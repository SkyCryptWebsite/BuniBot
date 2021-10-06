import chalk from "chalk";

function now() {
  return new Date().toLocaleString("en-US");
}

export function info(data, ...args) {
  console.info(chalk`{dim ${now()}} {green [INFO]}`, data, ...args);
}
export function warn(data, ...args) {
  console.info(chalk`{dim ${now()}} {yellow [WARN]}`, data, ...args);
}
export function error(data, ...args) {
  console.info(chalk`{dim ${now()}} {red [ERROR]}`, data, ...args);
}
