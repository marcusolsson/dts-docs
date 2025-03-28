import { Printer } from ".";
import { DocEntry } from "../parser/types";
import { escapeHTML } from "./utils";

export class TypePrinter implements Printer<DocEntry> {
  print(e: DocEntry): string {
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
  }
}
