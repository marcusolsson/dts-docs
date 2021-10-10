import { writeFileSync } from "fs";
import * as path from "path/posix";
import * as ts from "typescript";
import * as yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { parseClass, printClass } from "./class";
import { parseEnum, printEnum } from "./enum";
import { parseFunction, printFunction } from "./function";
import { parseInterface, printInterface } from "./interface";
import { parseType, printType } from "./type";
import {
  ClassDocEntry,
  EnumDocEntry,
  FunctionDocEntry,
  InterfaceDocEntry,
  TypeDocEntry,
} from "./types";

const parseFile = (file: string) => {
  const program = ts.createProgram([file], {});
  const checker = program.getTypeChecker();
  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    removeComments: true,
  });
  const sourceFile = program.getSourceFile(file);

  const functions: FunctionDocEntry[] = [];
  const interfaces: InterfaceDocEntry[] = [];
  const classes: ClassDocEntry[] = [];
  const enums: EnumDocEntry[] = [];
  const types: TypeDocEntry[] = [];

  ts.forEachChild(sourceFile, (node) => {
    if (ts.isFunctionDeclaration(node)) {
      functions.push(parseFunction(node, checker, printer, sourceFile));
    } else if (ts.isInterfaceDeclaration(node)) {
      interfaces.push(parseInterface(node, checker, printer, sourceFile));
    } else if (ts.isClassDeclaration(node)) {
      classes.push(parseClass(node, checker, printer, sourceFile));
    } else if (ts.isEnumDeclaration(node)) {
      enums.push(parseEnum(node, checker, printer, sourceFile));
    } else if (ts.isTypeAliasDeclaration(node)) {
      types.push(parseType(node, checker, printer, sourceFile));
    }
  });

  return {
    functions,
    interfaces,
    classes,
    enums,
    types,
  };
};

const argv = yargs(hideBin(process.argv))
  .usage("Usage: $0 --input [FILE] --output [DIR]")
  .demandOption(["input", "output"])
  .option("input", {
    alias: "i",
    type: "string",
    description: "Path to a .d.ts file.",
  })
  .option("output", {
    alias: "o",
    type: "string",
    description: "Path to the directory where the docs will go.",
  })
  .parseSync();

const { types, enums, functions, interfaces, classes } = parseFile(argv.input);

const outDir = argv.output;

const res: string[] = [];

res.push("# API reference");
res.push("");

res.push("## Classes");
res.push("");

classes.forEach((c) => {
  writeFileSync(path.join(outDir, "classes", c.name + ".md"), printClass(c));

  res.push(`- [${c.name}](classes/${c.name}.md)`);
});

res.push("## Enums");
res.push("");

enums.forEach((e) => {
  writeFileSync(path.join(outDir, "enums", e.name + ".md"), printEnum(e));

  res.push(`- [${e.name}](enums/${e.name}.md)`);
});

res.push("## Functions");
res.push("");

functions.forEach((f) => {
  writeFileSync(
    path.join(outDir, "functions", f.name + ".md"),
    printFunction(f)
  );

  res.push(`- [${f.name}](functions/${f.name}.md)`);
});

res.push("## Interfaces");
res.push("");

interfaces.forEach((i) => {
  writeFileSync(
    path.join(outDir, "interfaces", i.name + ".md"),
    printInterface(i)
  );

  res.push(`- [${i.name}](interfaces/${i.name}.md)`);
});

res.push("## Types");
res.push("");

types.forEach((t) => {
  writeFileSync(path.join(outDir, "types", t.name + ".md"), printType(t));

  res.push(`- [${t.name}](types/${t.name}.md)`);
});

writeFileSync(path.join(outDir, "overview.md"), res.join("\n"));
