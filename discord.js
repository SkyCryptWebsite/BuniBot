const config = require('./config.json');
const levenshtein = require('js-levenshtein');

exports.resolveCommand = (msg, command, commands) => {
  let keys = Array.from(commands.keys());
  if (keys.includes(command)) return command;
  if (!config.owners.includes(msg.author.id)) {
    keys = keys.filter(key => !config.ownerCommands.includes(key));
  }
  const key = keys.sort((a, b) => {
    return levenshtein(command, a) - levenshtein(command, b);
  })[0];
  if (levenshtein(command, key) > 3) return false;
  return key;
}

exports.embed = (msg, text, header, fields) => {
  return {
    content: "",
    embed: {
      title: header,
      description: text,
      fields: fields,
      footer: {
        icon_url: msg.author.avatarURL,
        text: `Requested by ${msg.author.username}#${msg.author.discriminator}`
      },
      timestamp: new Date(),
      color: 0xBAED91
    }
  }
}