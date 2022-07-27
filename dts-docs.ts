import { writeFileSync } from "fs";
import * as ts from "typescript";
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
import * as path from "path";

function parseFile(file: string) {
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
}

function main(args: string[]): void {
  const { types, enums, functions, interfaces, classes } = parseFile(args[0]);

  const outDir = args[1];

  const res: string[] = [];

  res.push("# API reference");
  res.push("");

  res.push("## Classes");
  res.push("");

  classes.forEach((c) => {
    writeFileSync(path.join(outDir, "classes", c.name + ".md"), printClass(c));

    res.push(`- [${c.name}](classes/${c.name}.md)`);
  });

  res.push("");
  res.push("## Enums");
  res.push("");

  enums.forEach((e) => {
    writeFileSync(path.join(outDir, "enums", e.name + ".md"), printEnum(e));

    res.push(`- [${e.name}](enums/${e.name}.md)`);
  });

  res.push("");
  res.push("## Functions");
  res.push("");

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

  types.forEach((t) => {
    writeFileSync(path.join(outDir, "types", t.name + ".md"), printType(t));

    res.push(`- [${t.name}](types/${t.name}.md)`);
  });

  res.push("");

  writeFileSync(path.join(outDir, "overview.md"), res.join("\n"));
}

main(process.argv.slice(2));
