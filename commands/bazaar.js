const axios = require('axios');
const discord = require('../discord.js');
const functions = require('../functions.js');
const math = require('mathjs');

let products = {};

async function updateProducts() {
  const bazaarResponse = await axios('https://sky.shiiyu.moe/api/v2/bazaar/');
  products = bazaarResponse.data;
  for (const productID in products) {
    const product = products[productID];
    if (product.tag != null) {
      product.tag = product.tag.split(" ");
    } else {
      product.tag = [];
      product.tag.push(...product.name.toLowerCase().split(" "));
    }
  }
}

updateProducts();
setInterval(updateProducts, 60000);

module.exports = {
  aliases: ["b", "baz", "bazaar"],
  description: "Check prices for one or more items on Bazaar.",
  run: async (client, msg, args) => {
    let itemSearch = "";
    let summary = args.join(" ").split(" + ");
    let fields = [];
    let totalBuy = 0;
    let totalSell = 0;
    let coinsMode = false;
    let title;
    let url;
    let thumbnail;
    for (const [index, part] of summary.entries()) {
      let stacks = false;
      const args_ = part.split(" ");
      let amount;
      if (['k', 'm', 'b'].includes(args_[0].charAt(args_[0].length - 1).toLowerCase()) && !isNaN(parseFloat(args_[0]))) {
        amount = parseFloat(args_[0]);
        switch(args_[0].charAt(args_[0].length - 1).toLowerCase()){
          case 'b':
            amount *= 1000;
          case 'm':
            amount *= 1000;
          case 'k':
            amount *= 1000;
        }
        coinsMode = true;
      } else if (!isNaN(parseInt(args_[0]))) {
        amount = Math.ceil(math.evaluate(args_[0].replace(/x/g, '*')));
      }
      if (args_[0].length < 1 || (amount !== undefined && args_[1] === undefined)) return discord.commandHelp(client, msg, "bazaar");
      if (amount !== undefined && ['stack', 'stacks'].includes(args_[1].toLowerCase())) {
        stacks = true;
        itemSearch = args_.slice(2);
      } else {
        itemSearch = args_.slice(1);
      }
      if (amount == undefined) {
        itemSearch = args_;
      }
      for (const [index, part] of itemSearch.entries()) {
        if (part == 'e' || part == 'ench') {
          itemSearch[index] = 'enchanted';
        }
      }
      itemSearch = itemSearch.join(" ").toLowerCase();
      const bazaarProduct = functions.getBazaarProduct(itemSearch, products);
      if (summary.length > 1 && index < 6) {
        fields.push({name: `${bazaarProduct.name}⠀`,value: "⠀",inline: true});
      }
      if (amount || amount == 0) {
        if (coinsMode) {
          let buyText = "";
          let sellText = "";
          const itemsBuy = Math.floor(amount / bazaarProduct.buyPrice);
          const itemsSell = Math.ceil(amount / bazaarProduct.sellPrice);
          buyText += `Buy ${itemsBuy.toLocaleString()}`;
          sellText += `Sell ${itemsSell.toLocaleString()}`;
          let buyStacks = `${ Math.round(itemsBuy / 64).toLocaleString() } × 64`;
          let sellStacks = `${ Math.round(itemsSell / 64).toLocaleString() } × 64`;
          if (itemsBuy >= 128 && itemsSell >= 128) {
            buyText += ` (${buyStacks})`;
            sellText += ` (${sellStacks})`;
          }
          if (itemsBuy >= 1280 && itemsSell >= 1280) {
            buyText = buyStacks;
            sellText = sellStacks;
          }
          totalBuy += itemsBuy * bazaarProduct.buyPrice;
          totalSell += itemsSell * bazaarProduct.sellPrice;
          if (index < 6) {
            fields.push(
              {name: `Spend ${functions.formatNumber(amount, false, 10)}`,value: buyText,inline: true},
              {name: `Earn ${functions.formatNumber(amount, false, 10)}`,value: sellText,inline: true}
            );
          }
        } else {
          if (stacks) {
            const name = amount > 1 ? `Buy ${amount.toLocaleString()} × 64` : `Buy 64`;
            totalBuy += amount * 64 * bazaarProduct.buyPrice;
            totalSell += amount * 64 * bazaarProduct.sellPrice;
            if (index < 6) {
              fields.push(
                {name: `Buy ${amount.toLocaleString()} × 64`,value: amount == 0 ? 'Free' : functions.formatNumber(amount * 64 * bazaarProduct.buyPrice, false, 100),inline: true},
                {name: `Sell ${amount.toLocaleString()} × 64`,value: amount == 0 ? 'Free' : functions.formatNumber(amount * 64 * bazaarProduct.sellPrice, false, 100),inline: true}
              );
            }
          } else {
            totalBuy += amount * bazaarProduct.buyPrice;
            totalSell += amount * bazaarProduct.sellPrice;
            if (index < 6) {
              fields.push(
                {name: `Buy ${amount.toLocaleString()}`,value: amount == 0 ? 'Free' : functions.formatNumber(amount * bazaarProduct.buyPrice, false, 100),inline: true},
                {name: `Sell ${amount.toLocaleString()}`,value: amount == 0 ? 'Free' : functions.formatNumber(amount * bazaarProduct.sellPrice, false, 100),inline: true}
              );
            }
          }
        }
      } else {
        totalBuy += bazaarProduct.buyPrice;
        totalSell += bazaarProduct.sellPrice;
        if (index < 6) {
          fields.push(
            {name: "Buy Price",value: functions.formatNumber(bazaarProduct.buyPrice, false, 100),inline: true},
            {name: "Sell Price",value: functions.formatNumber(bazaarProduct.sellPrice, false, 100),inline: true}
          );
        }
      }
      if (summary.length == 1) {
        title = bazaarProduct.name,
        url = `https://bazaartracker.com/product/${bazaarProduct.name.toLowerCase().replace(/\ /g, '_')}`
        thumbnail = {
          url: `https://sky.shiiyu.moe/item/${bazaarProduct.id}`
        }
      }
    }
    if (summary.length > 1) {
      title = "Bazaar Summary";
      if (summary.length > 6) {
        fields.push(
          {name: `${summary.length - 6} more item${summary.length == 7 ? '' : 's'}…`,value: "⠀",inline: true},
          {name: "⠀",value: "⠀",inline: true},
          {name: "⠀",value: "⠀",inline: true}
        );
      }
      fields.push(
        {name: "Summary",value: "⠀",inline: true},
        {name: coinsMode ? "Spend Total" : "Buy Total",value: functions.formatNumber(totalBuy, false, 100),inline: true},
        {name: coinsMode ? "Earn Total" : "Sell Total",value: functions.formatNumber(totalSell, false, 100),inline: true}
      );
    }
    let message = discord.embed(msg, undefined, title, fields);
    message.embed.url = url;
    message.embed.thumbnail = thumbnail;
    msg.channel.createMessage(message);
  },
  usage: "[amount] <item>"
}