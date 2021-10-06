import {Command} from "patron";
import client from "../services/client.js";
import {editMessage, send} from "../utilities/discord.js";

export default new class Ping extends Command {
  constructor() {
    super({
      description: "A command to see the bot's ping.",
      group: "Information",
      names: ["ping", "pong"]
    });
  }
  async run(msg) {
    const now = Date.now();
    let {latency} = msg.channel.guild?.shard ?? client.shards.get(0);

    latency = Math.floor(latency / 2);

    const reply = await send(msg.channel, `${now-msg.timestamp}ms`, undefined, true);

    await editMessage(
      reply,
      `**Latency:** ${latency}ms\n`
        + `**Message Read:** ${reply.content}\n`
        + `**Reply Sent:** ${reply.timestamp-msg.timestamp}ms`,
      ""
    );
  }
}();
