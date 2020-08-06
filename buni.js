const config = require('./config.json');
const discord = require('./discord.js');
const Eris = require('eris');
const fs = require('fs');

const client = new Eris(config.token);

client.commands = new Map();

fs.readdir('./commands/', (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let command = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName, command);
  });
});

client.on('ready', () => {
  console.log(`${client.user.username+"#"+client.user.discriminator} has successfully logged in`);
  client.editStatus({name: `over the universe | ~help`, type: 3 });
});

client.connect().catch(console.error);

client.on('messageCreate', async msg => {
  if (msg.author.bot || msg.type !== 0 || msg.author.discriminator === 0000) return;
  if (config.autoVoteChannels.includes(msg.channel.id)) {
    msg.addReaction("👍");
    msg.addReaction("👎");
    return;
  }
  if (!msg.content.startsWith(config.prefix)) return;
  const args = msg.content.slice(config.prefix.length).split(/\s+/);
  if (args[0].startsWith("~")) return;
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(discord.resolveCommand(msg, command, client.commands));
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