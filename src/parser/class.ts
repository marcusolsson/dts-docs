import * as ts from "typescript";
import { ClassDocEntry, DocEntry } from "./types";
import { serializeSignature, serializeSymbol } from "./utils";

export const parseClass = (
  node: ts.ClassDeclaration,
  checker: ts.TypeChecker,
  printer: ts.Printer,
  sourceFile: ts.SourceFile
): ClassDocEntry => {
  const classSymbol = checker.getSymbolAtLocation(node.name);

  const heritage: any = {};
  ts.forEachChild(node, (node) => {
    if (ts.isHeritageClause(node)) {
      if (node.getText().startsWith("implements")) {
        heritage.implements = [];

        ts.forEachChild(node, (node) => {
          heritage.implements.push(node.getText());
        });
      } else if (node.getText().startsWith("extends")) {
        heritage.extends = [];

        ts.forEachChild(node, (node) => {
          heritage.extends.push(node.getText());
        });
      }
    }
  });

  // Get the construct signatures
  let constructorType = checker.getTypeOfSymbolAtLocation(
    classSymbol,
    classSymbol.valueDeclaration!
  );

  const constructorSymbols = constructorType
    .getConstructSignatures()
    .map((s) => serializeSignature(checker, s));

  const propertySymbols: DocEntry[] = [];
  ts.forEachChild(node, (node) => {
    if (ts.isPropertyDeclaration(node)) {
      propertySymbols.push({
        raw: printer.printNode(ts.EmitHint.Unspecified, node, sourceFile),
        ...serializeSymbol(checker, checker.getSymbolAtLocation(node.name)),
      });
    }
  });

  const methodSymbols: DocEntry[] = [];
  ts.forEachChild(node, (node) => {
    if (ts.isMethodDeclaration(node)) {
      methodSymbols.push({
        raw: printer.printNode(ts.EmitHint.Unspecified, node, sourceFile),
        ...serializeSymbol(checker, checker.getSymbolAtLocation(node.name)),
      });
    }
  });

  return {
    ...serializeSymbol(checker, classSymbol),
    methods: methodSymbols,
    properties: propertySymbols,
    constructors: constructorSymbols,
    heritage,
  };
};
