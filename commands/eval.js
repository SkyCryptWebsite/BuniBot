const config = require("../config.json");
const Eris = require('eris');
const package = require('../package.json');
const parseMS = require('parse-ms');
const discord = require('../discord.js');

exports.run = async (client, msg, args) => {
  if (!config.owners.includes(msg.author.id)) return msg.channel.createMessage(discord.embed(msg, "This command may only be used by my owners!"));
  let code = msg.content.substr(6);
  try {
    if (code === "") return msg.channel.createMessage(discord.embed(msg, `${msg.author.mention} -> Command Executed!`+`\`\`\`js\n\u200B\`\`\``+`Error:\n`+`\`\`\`js\nYou need to have input to eval something dummy!\`\`\``));
    if (code.includes("config.token") || code.includes("client.token")) return msg.channel.createMessage(discord.embed(msg, `${msg.author.mention} -> Command Executed!`+`\`\`\`js\n\u200B\`\`\``+`Error:\n`+`\`\`\`js\nYou may not eval with the token!\`\`\``));
    msg.channel.createMessage(discord.embed(msg, `${msg.author.mention} -> Command Executed!`+`\`\`\`js\n`+code+`\`\`\``+`Response:\n`+`\`\`\`js\n`+eval(code)+`\`\`\``));
  } catch (error) {
    msg.channel.createMessage(discord.embed(msg, `${msg.author.mention} -> Command Executed!`+`\`\`\`js\n`+code+`\`\`\``+`Error:\n`+`\`\`\`js\n`+error+`\`\`\``));
  }
}