const config = require('./config.json');
const discord = require('./discord.js');
const Eris = require('eris');
const fs = require('fs');
const prefix = "~";
const autoVoteChannels = ["738990231348314123"];

const client = new Eris(config.token);

let commands = new Map();

fs.readdir('./commands/', (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let command = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    commands.set(commandName, command);
  });
});

client.on('ready', () => {
  console.log(`${client.user.username+"#"+client.user.discriminator} has successfully logged in`);
  client.editStatus({name: `over the universe`, type: 3 });
});

client.connect().catch(console.error);

client.on('messageCreate', async msg => {
  if (msg.author.bot || msg.type !== 0 || msg.author.discriminator === 0000) return;
  if (autoVoteChannels.includes(msg.channel.id)) {
    msg.addReaction("👍");
    msg.addReaction("👎");
    return;
  }
  if (!msg.content.startsWith(prefix)) return;
  const args = msg.content.slice(prefix.length).split(/\s+/);
  if (args[0].startsWith("~")) return;
  const command = args.shift().toLowerCase();
  const cmd = commands.get(discord.resolveCommand(msg, command, commands));
  if (!cmd) return msg.channel.createMessage(discord.embed(msg, "I could not find that command!"));
  cmd.run(client, msg, args);
});

client.on('messageReactionAdd', async (msg, emoji, userID) => {
  if (msg.id !== "739544190689476688") return;
  msg.channel.guild.addMemberRole(userID, "739326324702707723");
});

client.on('messageReactionRemove', async (msg, emoji, userID) => {
  if (msg.id !== "739544190689476688") return;
  msg.channel.guild.removeMemberRole(userID, "739326324702707723");
});