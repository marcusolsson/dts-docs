import * as ts from "typescript";
import { EnumDocEntry } from "./types";
import { serializeSymbol } from "./utils";

export const parseEnum = (
  node: ts.EnumDeclaration,
  checker: ts.TypeChecker,
  printer: ts.Printer,
  sourceFile: ts.SourceFile
): EnumDocEntry => {
  const symbol = checker.getSymbolAtLocation(node.name);
  return {
    ...serializeSymbol(checker, symbol),
    raw: printer.printNode(ts.EmitHint.Unspecified, node, sourceFile),
  };
};
