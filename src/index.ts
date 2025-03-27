import { existsSync, mkdirSync, writeFileSync } from "fs";
import * as path from "path";
import { parseFile } from "./parser";
import { printFunction } from "./printer/function";
import { printClass } from "./printer/class";
import { printEnum } from "./printer/enum";
import { printType } from "./printer/type";
import { printInterface } from "./printer/interface";

function ensureDir(dirPath: string) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath);
  }
}

function main(args: string[]): void {
  const { types, enums, functions, interfaces, classes } = parseFile(args[0]);

  const outDir = args[1];

  if (outDir) {
    ensureDir(path.join(outDir));
  }

  const res: string[] = [];

  res.push("# API reference");
  res.push("");

  res.push("## Classes");
  res.push("");

  if (classes.length) {
    ensureDir(path.join(outDir, "classes"));
  }

  classes.forEach((c) => {
    writeFileSync(path.join(outDir, "classes", c.name + ".md"), printClass(c));

    res.push(`- [${c.name}](classes/${c.name}.md)`);
  });

  res.push("");
  res.push("## Enums");
  res.push("");

  if (enums.length) {
    ensureDir(path.join(outDir, "enums"));
  }

  enums.forEach((e) => {
    writeFileSync(path.join(outDir, "enums", e.name + ".md"), printEnum(e));

    res.push(`- [${e.name}](enums/${e.name}.md)`);
  });

  res.push("");
  res.push("## Functions");
  res.push("");

  if (functions.length) {
    ensureDir(path.join(outDir, "functions"));
  }

  functions.forEach((f) => {
    writeFileSync(
      path.join(outDir, "functions", f.name + ".md"),
      printFunction(f)
    );

    res.push(`- [${f.name}](functions/${f.name}.md)`);
  });

  res.push("");
  res.push("## Interfaces");
  res.push("");

  if (interfaces.length) {
    ensureDir(path.join(outDir, "interfaces"));
  }

  interfaces.forEach((i) => {
    writeFileSync(
      path.join(outDir, "interfaces", i.name + ".md"),
      printInterface(i)
    );

    res.push(`- [${i.name}](interfaces/${i.name}.md)`);
  });

  res.push("");
  res.push("## Types");
  res.push("");

  if (types.length) {
    ensureDir(path.join(outDir, "types"));
  }

  types.forEach((t) => {
    writeFileSync(path.join(outDir, "types", t.name + ".md"), printType(t));

    res.push(`- [${t.name}](types/${t.name}.md)`);
  });

  res.push("");

  writeFileSync(path.join(outDir, "index.md"), res.join("\n"));
}

main(process.argv.slice(2));
