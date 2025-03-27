import * as ts from "typescript";
import { DocEntry } from "./types";
import { escapeHTML, serializeSymbol } from "./utils";

export const printType = (e: DocEntry): string => {
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
};

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
