import { TypeDocEntry } from "../parser/types";
import { escapeHTML } from "../parser/utils";

export const printType = (e: TypeDocEntry): string => {
  const res: string[] = [];

  res.push(`# ${e.name}`);
  res.push("");

  if (e.raw) {
    res.push("```ts");
    res.push(e.raw);
    res.push("```");
    res.push("");
  }

  res.push(escapeHTML(e.documentation));
  res.push("");

  return res.join("\n");
};
