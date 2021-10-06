import * as fs from "fs";
import TOML from "@iarna/toml";

export const config = TOML.parse(fs.readFileSync(new URL("../data/config.toml", import.meta.url), "utf8"));
export const sensitive = TOML.parse(fs.readFileSync(new URL("../data/sensitive.toml", import.meta.url), "utf8"));
