import {Command, ImportAll, Registry} from "patron";
import client from "./services/client.js";
import {config} from "./services/data.js";
import registry from "./services/registry.js";
import * as imports from "./utilities/imports.js";
import * as log from "./utilities/logger.js";

function importAll(dir) {
  return ImportAll(imports.join(import.meta.url, dir));
}

(async function() {
  Registry.setLibrary("eris");
  Command.setDefaults({clientPermissions: config.clientPermissions});
  registry.registerPrefixes(config.prefixes)
    .registerPreconditions(await importAll("./conditions/command"))
    .registerGroups(await importAll("./groups"))
    .registerCommands(await importAll("./commands"));
  await import("./events.js");
  await client.connect();
})().catch(log.error);
