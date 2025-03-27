import * as ts from "typescript";
import { DocEntry, InterfaceDocEntry } from "./types";
import { serializeSymbol } from "./utils";

export const parseInterface = (
  node: ts.InterfaceDeclaration,
  checker: ts.TypeChecker,
  printer: ts.Printer,
  sourceFile: ts.SourceFile
): InterfaceDocEntry => {
  const interfaceSymbol = checker.getSymbolAtLocation(node.name);

  const properties: DocEntry[] = [];
  ts.forEachChild(node, (node) => {
    if (ts.isPropertySignature(node)) {
      const propertySymbol = checker.getSymbolAtLocation(node.name);

      properties.push({
        raw: node.getText(),
        ...serializeSymbol(checker, propertySymbol),
      });
    }
  });

  const methods: DocEntry[] = [];
  ts.forEachChild(node, (node) => {
    if (ts.isMethodSignature(node)) {
      methods.push({
        raw: printer.printNode(ts.EmitHint.Unspecified, node, sourceFile),
        ...serializeSymbol(checker, checker.getSymbolAtLocation(node.name)),
      });
    }
  });

  return {
    ...serializeSymbol(checker, interfaceSymbol),
    properties,
    methods,
  };
};
