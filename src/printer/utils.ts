import { existsSync, mkdirSync } from "fs";

export const escapeHTML = (str: string): string => {
  return str
    .replace("|", "&vert;")
    .replace("<", "&lt;")
    .replace("<", "&lt;")
    .replace("<", "&lt;")
    .replace(">", "&gt;")
    .replace(">", "&gt;")
    .replace(">", "&gt;");
};

export function ensureDir(dirPath: string) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath);
  }
}
