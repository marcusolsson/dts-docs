import { InterfaceDocEntry } from "../parser/types";
import { escapeHTML } from "../parser/utils";

export const printInterface = (i: InterfaceDocEntry): string => {
  const res: string[] = [];

  res.push(`# ${i.name}`);
  res.push("");

  if (i.documentation) {
    res.push(escapeHTML(i.documentation));
    res.push("");
  }

  if (i.properties.length > 0) {
    res.push("## Properties");
    res.push("");

    i.properties.forEach((m) => {
      res.push("### " + m.name);
      res.push("");
      res.push("```ts");
      res.push(m.name + ": " + m.type);
      res.push("```");
      res.push("");

      if (m.documentation) {
        res.push(escapeHTML(m.documentation));
        res.push("");
      }
    });
  }

  if (i.methods.length > 0) {
    res.push("## Methods");
    res.push("");

    i.methods.forEach((m) => {
      res.push("### " + m.name);
      res.push("");
      res.push("```ts");
      res.push(m.name + ": " + m.type);
      res.push("```");
      res.push("");

      if (m.documentation) {
        res.push(escapeHTML(m.documentation));
        res.push("");
      }
    });
  }

  return res.join("\n");
};
