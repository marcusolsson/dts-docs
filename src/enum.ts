import * as ts from "typescript";
import { DocEntry } from "./types";
import { escapeHTML, serializeSymbol } from "./utils";

export const printEnum = (e: DocEntry): string => {
  const res: string[] = [];

  res.push(`# ${e.name}`);
  res.push("");
  res.push("```ts");
  res.push(e.raw);
  res.push("```");
  res.push("");

  if (e.documentation) {
    res.push(escapeHTML(e.documentation));
    res.push("");
  }

  return res.join("\n");
};

export const parseEnum = (
  node: ts.EnumDeclaration,
  checker: ts.TypeChecker,
  printer: ts.Printer,
  sourceFile: ts.SourceFile
): DocEntry => {
  const symbol = checker.getSymbolAtLocation(node.name);
  return {
    ...serializeSymbol(checker, symbol),
    raw: printer.printNode(ts.EmitHint.Unspecified, node, sourceFile),
  };
};
