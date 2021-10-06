const discord = require('../discord.js');

module.exports = {
  aliases: ["p", "ping"],
  description: "A command to check my ping.",
  run: async (client, msg, args) => {
    const now = Date.now();
    let {latency} = msg.channel.guild?.shard ?? client.shards.get(0);
    latency = Math.floor(latency / 2);
    const reply = await msg.channel.createMessage(`${now-msg.timestamp}ms`);
    await client.editMessage(reply.channel.id, reply.id, discord.embed(msg, `Latency: \`${latency}ms\`\nMessage Read: \`${reply.content}\`\nReply Sent: \`${reply.timestamp-msg.timestamp}ms\``, "Pong!"));
  }
}