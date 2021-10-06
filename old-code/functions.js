const distance = require("jaro-winkler");

module.exports = {
  getBazaarProduct: (query, products) => {
    let resultMatch;
    let itemResults = [];
    for (const key in products) {
      itemResults.push({...products[key]});
    }
    for (const product of itemResults) {
      if (product.name.toLowerCase() == query) {
        resultMatch = product;
      }
      product.tagMatches = 0;
      product.distance = distance(product.name, query, {caseSensitive: false});
      for (const part of query.split(" ")) {
        for (const tag of product.tag) {
          if (tag == part) {
            product.tagMatches++;
          }
        }
      }
    }
    itemResults = itemResults.sort((a, b) => {
      if (a.tagMatches > b.tagMatches) return -1;
      if (a.tagMatches < b.tagMatches) return 1;
      if (a.distance > b.distance) return -1;
      if (a.distance < b.distance) return 1;
    });
    if (!resultMatch) {
      resultMatch = itemResults[0];
    }
    return resultMatch;
  },
  formatNumber: (number, floor, rounding = 10) => {
    let roundFunc = floor ? Math.floor : Math.ceil;
    if (number < 1000) {
      return Math.floor(number);
    } else if (number < 10000) {
      return (roundFunc(number / 1000 * rounding) / rounding).toFixed(rounding.toString().length - 1) + 'K';
    } else if (number < 1000000) {
      return roundFunc(number / 1000) + 'K';
    } else if (number < 1000000000) {
      return (roundFunc(number / 1000 / 1000 * rounding) / rounding).toFixed(rounding.toString().length - 1) + 'M';
    } else {
      return (roundFunc(number / 1000 / 1000 / 1000 * rounding * 10) / (rounding * 10)).toFixed(rounding.toString().length) + 'B';
    }
  }
}