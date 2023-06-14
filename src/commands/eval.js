import { Command } from "patron";
import { inspect } from "util";
import { colors } from "../services/data.js";
import { editMessage, send } from "../utilities/discord.js";
import { formatTime } from "../utilities/times.js";

function cleanError(error) {
  //regex only works on linux systems
  return error.replace(/(file:\/+)?[/\w-]+\.js:\d+:\d+/g, (path) =>
    path.slice(path.lastIndexOf("/") + 1)
  );
}

function clean(result) {
  let cleaned = inspect(result, { maxArrayLength: 3 })
    .replace(/```/g, "``\u200B`")
    .replace(/Promise { (?!<pending>)[^}\n]+}/g, "Promise { <pending> }");

  if (result instanceof Error)
    cleaned = cleanError(cleaned, true);

  return `\`\`\`js\n${cleaned.length > 1e3 ? "'Too long to display (>1000 characters)'" : cleaned}\n\`\`\``;
}

export default new (class Eval extends Command {
  constructor() {
    super({
      arguments: [
        {
          example: "new Promise(res => setTimeout(res, 1e4))",
          key: "code",
          remainder: true,
          type: "string",
        },
      ],
      description: "Evaluates JavaScript code.",
      group: "Owner",
      names: ["eval", "ev"],
    });
  }
  async run(msg, args) {
    try {
      const start = performance.now();
      const result = eval(args.code);
      const end = performance.now();

      let pEnd;
      if (result instanceof Promise) {
        await Promise.resolve(result)
          .then(
            (res) => (pEnd = performance.now()) && res,
            (rej) => (pEnd = performance.now()) && rej
          );
      }

      const description = `**Evaluates to:**${clean(
        result
      )}in ${formatTime(end - start)}`;

      send(msg.channel, {
        color: colors.success,
        description,
      }).then((response) => {
        if (response == null || !(result instanceof Promise)) {
          return;
        }

        Promise.resolve(result)
          .then((res) =>
            editMessage(response, {
              color: colors.promise,
              description: `${description}\n\n**Which resolves to:**${clean(
                res
              )}in ${formatTime(pEnd - start)}`,
            })
          )
          .catch((rej) =>
            editMessage(response, {
              color: colors.promise,
              description: `${description}\n\n**Which rejects with:**${clean(
                rej
              )}in ${formatTime(pEnd - start)}`,
            })
          );
      });
    } catch (err) {
      const end = performance.now();
      const description = `**Throws with:**${clean(err)}in ${formatTime(
        end - start
      )}`;
      send(msg.channel, {
        color: colors.failure,
        description,
      });
    }
  }
})();
