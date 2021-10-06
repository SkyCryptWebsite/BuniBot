import {Command} from "patron";
import {send} from "../utilities/discord.js";

export default new class Invite extends Command {
  constructor() {
    super({
      description: "Provides a link to invite me to your server.",
      group: "Information",
      names: ["invite", "inv"]
    });
  }
  async run(msg) {
    send(msg.channel, "[**Click this to invite me to a server.**]"
      + "(https://discord.com/api/oauth2/authorize?client_id=664968475068071957&permissions=604367937&scope=bot)");
  }
}();
