import { ParsedFile } from "../parser";

export class TocPrinter {
  print(input: ParsedFile): string {
    const toc: string[] = [];

    toc.push("# API reference");
    toc.push("");

    toc.push("## Classes");
    toc.push("");

    input.classes.forEach((c) => {
      toc.push(`- [${c.name}](classes/${c.name}.md)`);
    });

    toc.push("");
    toc.push("## Enums");
    toc.push("");

    input.enums.forEach((e) => {
      toc.push(`- [${e.name}](enums/${e.name}.md)`);
    });

    toc.push("");
    toc.push("## Functions");
    toc.push("");

    input.functions.forEach((f) => {
      toc.push(`- [${f.name}](functions/${f.name}.md)`);
    });

    toc.push("");
    toc.push("## Interfaces");
    toc.push("");

    input.interfaces.forEach((i) => {
      toc.push(`- [${i.name}](interfaces/${i.name}.md)`);
    });

    toc.push("");
    toc.push("## Types");
    toc.push("");

    input.types.forEach((t) => {
      toc.push(`- [${t.name}](types/${t.name}.md)`);
    });

    toc.push("");

    return toc.join("\n");
  }
}
