const config = require('../config.json');
const discord = require('../discord.js');

module.exports = {
  description: "A command to reload one of my modules.",
  run: (client, msg, args) => {
    if (!config.owners.includes(msg.author.id)) return msg.channel.createMessage(discord.embed(msg, "This command may only be used by my owner!"));
    if (!args || args.length < 1) return msg.channel.createMessage(discord.embed(msg, "You must provide a command to reload."));
    const commandName = args[0];
    if (!client.commands.has(commandName)) return msg.channel.createMessage(discord.embed(msg, "That command does not exist!"));
    delete require.cache[require.resolve(`./${commandName}.js`)];
    client.commands.delete(commandName);
    const command = require(`./${commandName}.js`);
    client.commands.set(commandName, command);
    msg.channel.createMessage(discord.embed(msg, `The command \`${commandName}\` has been reloaded.`));
    console.log(`The command \`${commandName}\` has been reloaded.`);
  },
  usage: "<command>"
};