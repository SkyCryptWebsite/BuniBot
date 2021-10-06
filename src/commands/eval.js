import {Command} from "patron";
import {inspect} from "util";
import {config} from "../services/data.js";
import {editMessage, send} from "../utilities/discord.js";
import {hrformat} from "../utilities/times.js";

function cleanError(error) {
  //regex only works on linux systems
  return error.replace(/(file:\/+)?[/\w-]+\.js:\d+:\d+/g, path => path.slice(path.lastIndexOf("/") + 1));
}

function clean(result) {
  let cleaned = inspect(result, {maxArrayLength: 3})
    .replace(/```/g, "``\u200B`")
    .replace(/Promise { (?!<pending>)[^}\n]+}/g, "Promise { <pending> }");

  if(result instanceof Error)
    cleaned = cleanError(cleaned, true);

  return `\`\`\`js\n${cleaned.length > 1e3 ? "'Too long to display (>1000 characters)'" : cleaned}\n\`\`\``;
}

export default new class Eval extends Command {
  constructor() {
    super({
      arguments: [{
        example: "new Promise(res => setTimeout(res, 1e4))",
        key: "code",
        remainder: true,
        type: "string"
      }],
      description: "Evaluates JavaScript code.",
      group: "Owner",
      names: ["eval", "ev"]
    });
  }
  async run(msg, args) {
    let result;
    let end;
    let pEnd;
    let start;

    try {
      start = process.hrtime.bigint();
      result = eval(args.code);
      end = process.hrtime.bigint();

      if(result instanceof Promise)
        result.then(res => (pEnd = process.hrtime.bigint()) && res, rej => (pEnd = process.hrtime.bigint()) && rej);
    }catch(err) {
      end = process.hrtime.bigint();

      return send(msg.channel, {
        color: config.colors.failure,
        description: `**Throws with:**${clean(err)}in ${hrformat(end - start)}`
      });
    }

    const description = `**Evaluates to:**${clean(result)}in ${hrformat(end - start)}`;
    const response = await send(msg.channel, {
      color: config.colors.success,
      description
    });

    if(response == null || !(result instanceof Promise))
      return;

    await result.then(res => editMessage(response, {
      color: config.colors.promise,
      description: `${description}\n\n**Which resolves to:**${clean(res)}in ${hrformat(pEnd - start)}`
    }), rej => editMessage(response, {
      color: config.colors.promise,
      description: `${description}\n\n**Which rejects with:**${clean(rej)}in ${hrformat(pEnd - start)}`
    }));
  }
}();
