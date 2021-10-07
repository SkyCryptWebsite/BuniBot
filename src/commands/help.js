import {Command} from "patron";
import {config} from "../services/data.js";
import handler from "../services/handler.js";
import registry from "../services/registry.js";
import {send} from "../utilities/discord.js";

const prefix = config.prefixes[0];

export default new class Help extends Command {
  constructor() {
    super({
      arguments: [{defaultValue: undefined, example: "bazaar", type: "command"}],
      description: "Lists all the commands.",
      group: "Information",
      names: ["help", "commands", "command", "cmds"]
    });
  }
  async run(msg, args) {
    if(args.command === undefined) {
      const fields = [];

      for(const group of registry.groups.values()) {
        for(const command of registry.getGroupedCommands(group.name)) {
          if(await handler.runPreconditions(msg, command) == null) {
            const index = fields.findIndex(field => group.name === field.name);

            if(index === -1)
              fields.push({name: group.name, value: `- \`${command.getUsage(prefix)}\``, inline: true});
            else
              fields[index].value += `\n- \`${command.getUsage(prefix)}\``;
          }

        }

        const field = fields.find(f => group.name === f.name);

        if(field != null) {
          field.value += "\n\u200b";
          field.name = `__${field.name}__`;
        }
      }

      fields[fields.length - 1].value = fields[fields.length - 1].value.slice(0, -2);

      return send(msg.channel, {title: "Command List", fields});
    }

    let description = `**Description:** ${args.command.description}`;

    if(args.command.arguments.length !== 0)
      description += `\n**Example:** \`${args.command.getExample(prefix)}\``;

    await send(msg.channel, {title: args.command.getUsage(prefix), description});
  }
}();
