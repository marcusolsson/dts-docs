import { DocEntry } from "../parser/types";
import { escapeHTML } from "./utils";

export const printEnum = (e: DocEntry): string => {
  const res: string[] = [];

  res.push(`# ${e.name}`);
  res.push("");
  res.push("```ts");
  res.push(e.raw);
  res.push("```");
  res.push("");

  if (e.documentation) {
    res.push(escapeHTML(e.documentation));
    res.push("");
  }

  return res.join("\n");
};
