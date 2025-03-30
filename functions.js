const distance = require("jaro-winkler");

module.exports = {
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
