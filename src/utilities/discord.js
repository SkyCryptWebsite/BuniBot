import client from "../services/client.js";
import {config} from "../services/data.js";

export function editMessage(msg, embed, content) {
  return msg.edit(embedify(typeof embed === "string" ? {description: embed} : embed, content));
}
export function embedify(embed, content) {
  embed.color = embed.color ?? config.colors.default;

  return {content, embed};
}
export function send(channel, content, files, raw = false) {
  if(!validChannel(channel))
    return;

  return channel.createMessage(
    raw ? content : embedify(typeof content === "string" ? {description: content} : content),
    files
  );
}
export function tag(user) {
  return `${user.username}#${user.discriminator}`;
}
export function validChannel(channel) {
  if(channel.guild == null)
    return true;

  const perms = channel.permissionsOf(client.user.id);

  return config.clientPermissions.every(perm => perms.has(perm));
}
