const config = require("../config.json");
const discord = require("../discord.js");

module.exports = {
    aliases: ["u"],
    description: "username error help message",
    run: (client, msg, args) => {
        msg.channel.createMessage(
            discord.embed(
                msg,
                `While the site itself is not broken, searching for players may return the following error.
                \`\`\`No user with the name '<ign>' was found\`\`\`
    This is due to current issues with an API we use for resolving UUIDs from usernames.
    While we patiently await a fix, **please search using a player's UUID instead of their username**.`,
                "No username found error",
                [
                    {
                        name: `How do I find a UUID?`,
                        value: "If googling `minecraft uuid` is too hard for you, we suggest using https://mcuuid.net/ to find a player's UUID",
                    },
                ]
            )
        );
    },
};
