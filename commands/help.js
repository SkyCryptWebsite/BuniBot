const config = require('../config.json');
const discord = require('../discord.js');

module.exports = {
  description: "Displays this message.",
  run: (client, msg, args) => {
    let keys = Array.from(client.commands.keys());
    if (!config.owners.includes(msg.author.id)) {
      keys = keys.filter(key => !config.ownerCommands.includes(key));
    }
    let commandList = ``;
    for (key of keys) {
      commandList += `\`${key}\` - ${client.commands.get(key).description}\n`;
    }
    msg.channel.createMessage(discord.embed(msg, commandList, "Commands for Buni"));
  }
}