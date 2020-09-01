const axios = require('axios');
const discord = require('../discord.js')
const emotes = require('../emotes.json');
const functions = require('../functions.js');
const _ = require('lodash');

const skillsSorted = [
  "taming", "farming", "mining", "combat", "foraging", "fishing", "enchanting", "alchemy", "carpentry", "runecrafting"
];

const statModifier = (value, stat) => {
  let suffix = '';
  switch(stat){
      case 'damage_increase':
          value = Math.floor(value * 100);
      case 'crit_chance':
      case 'crit_damage':
      case 'speed':
      case 'sea_creature_chance':
          suffix = '%';
  }
  return value + suffix;
};

const xpMax = {
  25: 3022425,
  30: 8022425,
  35: 15522425,
  40: 25522425,
  45: 38072425,
  50: 55172425
};

const xpMaxRunecrafting = {
  25: 94450
};

const skillEmbed = (msg, profile, skillName) => {
  const skill = profile.data.levels[skillName];
  const name = skillName.charAt(0).toUpperCase() + skillName.slice(1);
  const author = {name: `${profile.data.display_name}'s ${name} Skill (${profile.cute_name})`, url: `https://sky.shiiyu.moe/stats/${profile.data.uuid}/${profile.data.profile.profile_id}`}
  const xpMaxRequired = skillName == 'runecrafting' ? xpMaxRunecrafting[skill.maxLevel] : xpMax[skill.maxLevel];
  const currentProgress = Math.floor(skill.xpCurrent / skill.xpForNext * 100);
  const progress = Math.floor(skill.xp / xpMaxRequired * 100);
  let description = `Level: **${skill.level}** / ${skill.maxLevel} (**#${skill.rank.toLocaleString()}**)\n`;
  if (skill.level == skill.maxLevel) {
    description += `Current XP: **${Math.floor(skill.xpCurrent).toLocaleString()}**`;
  } else {
    description += `Current XP: **${Math.floor(skill.xpCurrent).toLocaleString()}** / ${skill.xpForNext.toLocaleString()} (**${currentProgress}%**)`;
  }
  description += `\nTotal XP: **${Math.floor(skill.xp).toLocaleString()}** / ${xpMaxRequired.toLocaleString()} (**${progress}%**)\n`;
  switch (skillName) {
    case "combat":
      description += `\nMinion Ghast Kills: **${(profile.raw.stats.kills_generator_ghast || 0).toLocaleString()}**`;
      break;
    case "fishing":
      description += `\nItems fished: **${(profile.raw.stats.items_fished || 0).toLocaleString()}**`;
      break;
    case "alchemy":
      if('collection' in profile.raw)
        description += `\nSugar Cane Collection: **${(profile.raw.collection.SUGAR_CANE || 0).toLocaleString()}**`;
      break;
    case "enchanting":
      if('collection' in profile.raw)
        description += `\nLapis Lazuli Collection: **${(profile.raw.collection['INK_SACK:4'] || 0).toLocaleString()}**`;
      break;
  }
  const skillBonus = profile.data.skill_bonus[skillName];
  const bonusKeys = _.pickBy(skillBonus, value => value > 0);
  if (_.keys(bonusKeys).length > 0) {
    description += '\n\nBonus:';
  }
  for (const key in bonusKeys) {
    let keyArr = key.split(" ");
    for (let i = 0; i < keyArr.length; i++) {
      keyArr[i] = keyArr[i].replace(/\_/g, ' ').charAt(0).toUpperCase() + keyArr[i].replace(/\_/g, ' ').slice(1);
    }
    const key_ = keyArr.join(" ");
    description += `\n**+${statModifier(skillBonus[key], key)}** ${key_}`
  }
  let fields = [];
  if (skill.level < skill.maxLevel && skill.maxLevel == 50) {
    description += '\n\nXP left to reach...';
    let levelKeys = _.keys(_.pickBy(xpMax, (value, key) => new Number(key) > skill.level)).sort((a, b) => a - b);
    if (levelKeys.length > 3) {
      levelKeys = [...levelKeys.slice(0, 2), levelKeys.pop()];
    }
    for (const key of levelKeys) {
      fields.push(
        {inline: true, name: `Level ${key}`, value: `**${Math.round(xpMax[key] - skill.xp).toLocaleString()}** XP`}
      );
    }
  }
  const output = discord.embed(msg, description, undefined, fields);
  output.embed.author = author;
  return output;
};

module.exports = {
  aliases: ["s", "skills"],
  description: "Check skills for a player.",
  run: async (client, msg, args) => {
    if (args[0] === undefined) {
      return discord.commandHelp(client, msg, "skills");
    }
    const message = await msg.channel.createMessage(discord.embed(msg, `Awaiting API response... ${"<a:beespin:"+emotes["beespin"].id+">"}`, `${args[0]}'s Skills`));
    let response;
    try {
      response = await axios(`https://sky.lea.moe/api/v2/profile/${args[0]}`);
    } catch (e) {
      let error = "Failed retrieving data from API.";
      if (e.response != null && e.response.data != null && 'error' in e.response.data) {
        error = e.response.data.error;
      }
      await message.edit(discord.embed(msg, error, "Error"));
    }
    const {data} = response;
    let profile = data.profiles[_.findKey(data.profiles, a => a.current)];
    let customProfile;
    let customSkill;
    if (args.length > 1 && !skillsSorted.includes(args[1].toLowerCase())) {
      customProfile = args[1].toLowerCase();
      if (args.length > 2 && skillsSorted.includes(args[2].toLowerCase())) {
        customSkill = args[2].toLowerCase();
      }
      for (const key in data.profiles) {
        if (data.profiles[key].cute_name.toLowerCase() == customProfile) {
          profile = data.profiles[key];
        }
      }
    } else if (args.length > 1 && skillsSorted.includes(args[1].toLowerCase())) {
      customSkill = args[1].toLowerCase();
    }
    const author = {name: `${profile.data.display_name}'s Skills (${profile.cute_name})`, url: `https://sky.lea.moe/stats/${profile.data.uuid}/${profile.data.profile.profile_id}`};
    const description =  `Total Skill XP: **${functions.formatNumber(profile.data.total_skill_xp)}**\nAverage Skill Level: **${(Math.floor(profile.data.average_level * 100) / 100).toFixed(2)}** (**${(Math.floor(profile.data.average_level_no_progress * 100) / 100).toFixed(2)}**) (**#${functions.formatNumber(profile.data.average_level_rank)}**)`
    const fields = [];
    const thumbnail = {url: `https://minotar.net/helm/${profile.data.uuid}/128`};
    const embed = discord.embed(msg, description);
    embed.embed.author = author, embed.embed.thumbnail = thumbnail;
    const reactions = [];
    for (const [index, skillName] of skillsSorted.entries()) {
      const skill = profile.data.levels[skillName];
      if (skill == null) {
        continue;
      }
      const name = skillName.charAt(0).toUpperCase() + skillName.slice(1);
      const skillEmote = `<:sb${name}:${emotes["sb"+name].id}>`;
      const field = {inline: true, name: `${skillEmote.toString()} ${name} **${skill.level}** (#${functions.formatNumber(skill.rank)})`};
      if(skill.level == skill.maxLevel) {
        field['value'] = `**${skill.xpForNext === 0 ? '–' : functions.formatNumber(skill.xpCurrent, true)}** XP`;
      } else {
        field['value'] = `**${skill.xpForNext === 0 ? '–' : functions.formatNumber(skill.xpCurrent, true)}** / ${skill.xpForNext === 0 ? '–' : functions.formatNumber(skill.xpForNext, false)} XP`;
      }
      field['value'] += ` (**${functions.formatNumber(skill.xp, true)}**)`
      fields.push(field);
      if (index % 2 != 0) {
        fields.push({inline: true, name: "⠀", value: "⠀",});
      }
      reactions.push(":sb"+name+":"+emotes["sb"+name].id);
    }
    embed.embed.fields = fields;
    let currentSkill = null;
    if (customSkill) {
      currentSkill = customSkill;
      await message.edit(skillEmbed(msg, profile, customSkill));
    } else {
      await message.edit(embed);
    }
    reactions.unshift('⬅️');
    reactions.map(a => message.addReaction(a));-
    await discord.collectReactions(message, user => !user.bot, (reaction, user) => {
      message.removeReaction(reaction.id ? `${reaction.name}:${reaction.id}` : reaction.name, user.id).catch(console.error);
      if (user.id != msg.author.id) return;
      if (reaction.name == '⬅️') {
        if (currentSkill === null) return;
        currentSkill = null;
        message.edit(embed);
        return;
      }
      const skillName = reaction.name.substring(2).toLowerCase();
      if (skillName == currentSkill) return;
      currentSkill = skillName;
      message.edit(skillEmbed(msg, profile, skillName));
    }, 120 * 1000);
    await message.removeReactions();
    return null;
  },
  usage: "<username> [profile name] [skill name]"
}