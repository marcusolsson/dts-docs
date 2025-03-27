import { FunctionDocEntry } from "../parser/types";
import { escapeHTML } from "../parser/utils";

export const printFunction = (f: FunctionDocEntry): string => {
  const res: string[] = [];

  res.push("# " + f.name);
  res.push("");
  res.push("```ts");
  res.push(f.raw);
  res.push("```");
  res.push("");

  if (f.documentation) {
    res.push(escapeHTML(f.documentation));
    res.push("");
  }

  if (f.parameters.length > 0) {
    res.push(`## Parameters`);
    res.push("");
    res.push("| Parameter | Description |");
    res.push("|-----------|-------------|");

    f.parameters.forEach((p) => {
      res.push(
        "| `" +
          p.name +
          "` | " +
          escapeHTML(p.documentation) +
          (p.documentation ? " " : "") +
          "|"
      );
    });
    res.push("");
  }

  return res.join("\n");
};
