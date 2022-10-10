import {ResultType} from "patron";
import client from "./services/client.js";
import handler from "./services/handler.js";
import {send} from "./utilities/discord.js";
import * as log from "./utilities/logger.js";

client.once("ready", () => {
  log.info("Successfully logged in!");
  client.editStatus({name: `${client.users.size} users`, type: 3});
});
client.on("error", (err) => {
  if(err.message.includes("Connection reset"))
    return;

  log.error(err);
});
client.on("messageCreate", async msg => {
  if(msg.author.bot || msg.webhookID || (msg.type !== 0 && msg.type !== 19))
    return;

  const result = await handler.run(msg);

  switch(result.type) {
    case ResultType.ArgumentCount:
      await send(msg.channel, "Incorrect amount of arguments used.");

      break;
    case ResultType.Error:
      log.error(result.error);

      break;
    case ResultType.Precondition:
      await send(msg.channel, result.reason);

      break;
  }
});
client.on("messageReactionAdd", (msg, _emoji, userID) => {
  if(msg.id !== "739544190689476688")
    return;

  msg.channel.guild.addMemberRole(userID, "739326324702707723");
});
client.on("messageReactionRemove", (msg, _emoji, userID) => {
  if(msg.id !== "739544190689476688")
    return;

  msg.channel.guild.removeMemberRole(userID, "739326324702707723");
});
