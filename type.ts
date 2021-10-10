import * as ts from "typescript";
import { EnumDocEntry, TypeDocEntry } from "./types";
import { escapeHTML, serializeSymbol } from "./utils";

export const printType = (e: TypeDocEntry): string => {
  const res: string[] = [];

  res.push(`# ${e.name}`);
  res.push("");
  res.push("```ts");
  res.push(e.raw);
  res.push("```");
  res.push("");
  res.push(escapeHTML(e.documentation));
  res.push("");

  return res.join("\n");
};

export const parseType = (
  node: ts.TypeAliasDeclaration,
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
