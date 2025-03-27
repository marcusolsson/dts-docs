import * as ts from "typescript";
import { DocEntry } from "./types";
import { serializeSymbol } from "./utils";

export const parseType = (
  node: ts.TypeAliasDeclaration,
  checker: ts.TypeChecker,
  printer: ts.Printer,
  sourceFile: ts.SourceFile
): DocEntry => {
  const symbol = checker.getSymbolAtLocation(node.name);

  if (!symbol) {
    throw new Error("unexpected error");
  }

  return {
    ...serializeSymbol(checker, symbol),
    raw: printer.printNode(ts.EmitHint.Unspecified, node, sourceFile),
  };
};
