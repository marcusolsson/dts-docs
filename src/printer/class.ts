import { ClassDocEntry } from "../parser/types";
import { escapeHTML } from "./utils";

export const printClass = (c: ClassDocEntry): string => {
  const res: string[] = [];

  res.push(`# ${c.name}`);
  res.push("");
  if (c.heritage.extends && c.heritage.extends.length > 0) {
    res.push("Extends `" + c.heritage.extends.join("`, `") + "`");
    res.push("");
  }
  if (c.heritage.implements && c.heritage.implements.length > 0) {
    res.push("Implements `" + c.heritage.implements.join("`, `") + "`");
    res.push("");
  }

  if (c.documentation) {
    res.push(escapeHTML(c.documentation));
    res.push("");
  }

  if (c.constructors.length > 0) {
    res.push("## Constructor");
    res.push("");

    res.push("```ts");

    c.constructors.forEach((constructor) => {
      res.push(
        `constructor(${constructor.parameters
          .map((p) => `${p.name}: ${p.type}`)
          .join(", ")});`
      );
    });
    res.push("```");
    res.push("");
  }

  if (c.properties.length > 0) {
    res.push(`## Properties`);
    res.push("");

    c.properties.forEach((m) => {
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

  if (c.methods.length > 0) {
    res.push(`## Methods`);
    res.push("");

    c.methods.forEach((m) => {
      res.push("### " + m.name);
      res.push("");
      res.push("```ts");
      res.push(m.raw);
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
