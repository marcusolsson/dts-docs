import * as ts from "typescript";
import {
  ClassDocEntry,
  DocEntry,
  FunctionDocEntry,
  InterfaceDocEntry,
} from "./types";
import { parseFunction } from "./function";
import { parseInterface } from "./interface";
import { parseClass } from "./class";
import { parseEnum } from "./enum";
import { parseType } from "./type";

export interface ParsedFile {
  functions: FunctionDocEntry[];
  interfaces: InterfaceDocEntry[];
  classes: ClassDocEntry[];
  enums: DocEntry[];
  types: DocEntry[];
}

export function parseFile(file: string): ParsedFile {
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
  const enums: DocEntry[] = [];
  const types: DocEntry[] = [];

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
