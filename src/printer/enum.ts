import { EnumDocEntry } from "../parser/types";
import { escapeHTML } from "../parser/utils";

export const printEnum = (e: EnumDocEntry): string => {
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
