const config = require('../config.json');
const discord = require('../discord.js');

module.exports = {
  aliases: ["h", "help"],
  description: "Displays this message.",
  run: (client, msg, args) => {
    let keys = Array.from(client.commands.keys()).sort();
    if (!config.owners.includes(msg.author.id)) {
      keys = keys.filter(key => !config.ownerCommands.includes(key));
    }
    let commandList = ``;
    for (key of keys) {
      const cmd = client.commands.get(key);
      commandList += `\`${key}${cmd.usage ? " "+cmd.usage : ""}\` - ${cmd.description}\n`;
    }
    msg.channel.createMessage(discord.embed(msg, commandList, "Commands for Buni"));
  }
}