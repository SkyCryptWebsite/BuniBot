const eris = require('eris');
const package = require('../package.json');
const parseMS = require('parse-ms');
const discord = require('../discord.js');

exports.run = (client, msg, args) => {
  const uptime = parseMS(client.uptime);
  const prettyUptime = `${uptime.days > 0 ? uptime.days.toString().length > 1 ? uptime.days+":" : "0"+uptime.days+":" : ""}${uptime.hours.toString().length > 1 ? uptime.hours : "0"+ uptime.hours}:${uptime.minutes.toString().length > 1 ? uptime.minutes : "0"+ uptime.minutes}:${uptime.seconds.toString().length > 1 ? uptime.seconds : "0"+ uptime.seconds}`;
  msg.channel.createMessage(discord.embed(msg, `:robot: Bot Version: **${package["version"]}**\n<:idk_this_symbol_lol:737881234235195503> NodeJS Version: **${process.version.slice(1)}**\n:books: Library: **Eris ${eris.VERSION}**\n:clock10: Current Uptime: **${prettyUptime}**`, "Bot Information"));
}