import { ParsedFile } from "../parser";
import { writeFileSync } from "fs";
import { printClass } from "./class";
import { printEnum } from "./enum";
import { printFunction } from "./function";
import { printInterface } from "./interface";
import { printType } from "./type";
import { ensureDir } from "./utils";
import * as path from "path";

export function writeDocs(inputFile: ParsedFile, outputDir: string) {
  if (outputDir) {
    ensureDir(path.join(outputDir));
  }

  const { classes, enums, functions, interfaces, types } = inputFile;

  const toc: string[] = [];

  toc.push("# API reference");
  toc.push("");

  toc.push("## Classes");
  toc.push("");

  if (classes.length) {
    ensureDir(path.join(outputDir, "classes"));
  }

  classes.forEach((c) => {
    writeFileSync(
      path.join(outputDir, "classes", c.name + ".md"),
      printClass(c)
    );

    toc.push(`- [${c.name}](classes/${c.name}.md)`);
  });

  toc.push("");
  toc.push("## Enums");
  toc.push("");

  if (enums.length) {
    ensureDir(path.join(outputDir, "enums"));
  }

  enums.forEach((e) => {
    writeFileSync(path.join(outputDir, "enums", e.name + ".md"), printEnum(e));

    toc.push(`- [${e.name}](enums/${e.name}.md)`);
  });

  toc.push("");
  toc.push("## Functions");
  toc.push("");

  if (functions.length) {
    ensureDir(path.join(outputDir, "functions"));
  }

  functions.forEach((f) => {
    writeFileSync(
      path.join(outputDir, "functions", f.name + ".md"),
      printFunction(f)
    );

    toc.push(`- [${f.name}](functions/${f.name}.md)`);
  });

  toc.push("");
  toc.push("## Interfaces");
  toc.push("");

  if (interfaces.length) {
    ensureDir(path.join(outputDir, "interfaces"));
  }

  interfaces.forEach((i) => {
    writeFileSync(
      path.join(outputDir, "interfaces", i.name + ".md"),
      printInterface(i)
    );

    toc.push(`- [${i.name}](interfaces/${i.name}.md)`);
  });

  toc.push("");
  toc.push("## Types");
  toc.push("");

  if (types.length) {
    ensureDir(path.join(outputDir, "types"));
  }

  types.forEach((t) => {
    writeFileSync(path.join(outputDir, "types", t.name + ".md"), printType(t));

    toc.push(`- [${t.name}](types/${t.name}.md)`);
  });

  toc.push("");

  writeFileSync(path.join(outputDir, "index.md"), toc.join("\n"));
}
