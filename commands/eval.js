const config = require("../config.json");
const discord = require('../discord.js');
const Eris = require('eris');
const levenshtein = require('js-levenshtein');
const package = require('../package.json');
const parseMS = require('parse-ms');

module.exports = {
  description: "A command to evaluate code.",
  run: async (client, msg, args) => {
    if (!config.owners.includes(msg.author.id)) return msg.channel.createMessage(discord.embed(msg, "This command may only be used by my owners!"));
    let code = args.join([" "])
    try {
      if (code === "") return msg.channel.createMessage(discord.embed(msg, `${msg.author.mention} -> Command Executed!`+`\`\`\`js\n\u200B\`\`\``+`Error:\n`+`\`\`\`js\nYou need to have input to eval something dummy!\`\`\``));
      if (code.includes("config.token") || code.includes("client.token")) return msg.channel.createMessage(discord.embed(msg, `${msg.author.mention} -> Command Executed!`+`\`\`\`js\n\u200B\`\`\``+`Error:\n`+`\`\`\`js\nYou may not eval with the token!\`\`\``));
      msg.channel.createMessage(discord.embed(msg, `${msg.author.mention} -> Command Executed!`+`\`\`\`js\n`+code+`\`\`\``+`Response:\n`+`\`\`\`js\n`+eval(code)+`\`\`\``));
    } catch (error) {
      msg.channel.createMessage(discord.embed(msg, `${msg.author.mention} -> Command Executed!`+`\`\`\`js\n`+code+`\`\`\``+`Error:\n`+`\`\`\`js\n`+error+`\`\`\``));
    }
  },
  usage: "<code>"
}