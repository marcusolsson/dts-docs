import { existsSync, mkdirSync, writeFileSync } from "fs";
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

function ensureDir(dirPath: string) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath);
  }
}

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

  if (!sourceFile) {
    return {
      functions,
      interfaces,
      classes,
      enums,
      types,
    };
  }

  const parseDeclarations = (node: ts.Node) => {
    ts.forEachChild(node, (n) => {
      if (ts.isFunctionDeclaration(n)) {
        functions.push(parseFunction(n, checker, printer, sourceFile));
      } else if (ts.isInterfaceDeclaration(n)) {
        interfaces.push(parseInterface(n, checker, printer, sourceFile));
      } else if (ts.isClassDeclaration(n)) {
        classes.push(parseClass(n, checker, printer, sourceFile));
      } else if (ts.isEnumDeclaration(n)) {
        enums.push(parseEnum(n, checker, printer, sourceFile));
      } else if (ts.isTypeAliasDeclaration(n)) {
        types.push(parseType(n, checker, printer, sourceFile));
      } else if (ts.isModuleDeclaration(n)) {
        if (n.body) {
          parseDeclarations(n.body);
        }
      }
    });
  };

  parseDeclarations(sourceFile);

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

  if (outDir) {
    ensureDir(path.join(outDir));
  }

  const res: string[] = [];

  res.push("---");
  res.push(`title: dts-docs/api-reference`);
  res.push(`group: dts-docs`)
  res.push("---");
  res.push("");

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
