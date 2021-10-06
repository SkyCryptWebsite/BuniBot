import * as path from "path";
import {fileURLToPath} from "url";

export function join(metaURL, ...paths) {
  return path.join(path.dirname(metaURL), ...paths.filter(p => p != null));
}
export function joinFile(metaURL, ...paths) {
  return path.join(fileURLToPath(path.dirname(metaURL)), ...paths.filter(p => p != null));
}
