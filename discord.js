const config = require('./config.json');

const levenshtein = require('js-levenshtein');

module.exports = {
  commandHelp: (client, msg, command) => {
    const cmd = client.commands.get(command);
    let fields = [
      {name: "Command", value: `\`${config.prefix+command}\``},
      {name: "Description", value: cmd.description}, {name: "Usage", value: `\`\`\`${config.prefix+command+" "+cmd.usage}\`\`\``}
    ];
    msg.channel.createMessage(module.exports.embed(msg, undefined, undefined, fields));
  },
  embed: (msg, text, header, fields) => {
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
        color: 0xBAED91
      }
    }
  },
  resolveCommand: (msg, command, commands) => {
    let keys = Array.from(commands.keys());
    if (keys.includes(command)) return command;
    for (const key of keys) {
      if (commands.get(key).aliases.includes(command)) return key;
    }
    if (!config.owners.includes(msg.author.id)) {
      keys = keys.filter(key => !config.ownerCommands.includes(key));
    }
    let aliases = [];
    for (const key of keys) {
      aliases.push(commands.get(key).aliases.sort((a, b) => {
        return levenshtein(command, a) - levenshtein(command, b);
      })[0]);
    }
    console.log(aliases);
    const alias = aliases.sort((a, b) => {
      return levenshtein(command, a) - levenshtein(command, b);
    })[0];
    if (levenshtein(command, alias) > 2) return false;
    for (key of keys) {
      if (commands.get(key).aliases.includes(alias)) return key;
    }
  }
}