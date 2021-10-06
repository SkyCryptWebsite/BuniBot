const discord = require('../discord.js');

module.exports = {
  aliases: ["inv", "invite"],
  description: "Provides a link to invite me to your server",
  run: (client, msg, args) => {
    msg.channel.createMessage(discord.embed(msg, "[**Click this to invite me to a server.**](https://discord.com/api/oauth2/authorize?client_id=664968475068071957&permissions=604367937&scope=bot)"));
  }
}