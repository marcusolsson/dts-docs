import * as ts from "typescript";
import { ClassDocEntry, DocEntry } from "./types";
import { escapeHTML, serializeSignature, serializeSymbol } from "./utils";

export const printClass = (c: ClassDocEntry): string => {
  const res: string[] = [];

  res.push("---");
  res.push(`title: dts-docs/api-reference/class/${c.name}`);
  res.push(`group: dts-docs`)
  res.push("---");
  res.push("");


  res.push(`# ${c.name}`);
  res.push("");
  if (c.heritage.extends && c.heritage.extends.length > 0) {
    res.push("Extends `" + c.heritage.extends.join("`, `") + "`");
    res.push("");
  }
  if (c.heritage.implements && c.heritage.implements.length > 0) {
    res.push("Implements `" + c.heritage.implements.join("`, `") + "`");
    res.push("");
  }

  if (c.documentation) {
    res.push(escapeHTML(c.documentation));
    res.push("");
  }

  if (c.constructors.length > 0) {
    res.push("## Constructor");
    res.push("");

    res.push("```ts");

    c.constructors.forEach((constructor) => {
      res.push(
        `constructor(${constructor.parameters
          .map((p) => `${p.name}: ${p.type}`)
          .join(", ")});`
      );
    });
    res.push("```");
    res.push("");
  }

  if (c.properties.length > 0) {
    res.push(`## Properties`);
    res.push("");

    c.properties.forEach((m) => {
      res.push("### " + m.name);
      res.push("");
      res.push("```ts");
      res.push(m.name + ": " + m.type);
      res.push("```");
      res.push("");

      if (m.documentation) {
        res.push(escapeHTML(m.documentation));
        res.push("");
      }
    });
  }

  if (c.methods.length > 0) {
    res.push(`## Methods`);
    res.push("");

    c.methods.forEach((m) => {
      res.push("### " + m.name);
      res.push("");
      res.push("```ts");
      res.push(m.raw);
      res.push("```");
      res.push("");

      if (m.documentation) {
        res.push(escapeHTML(m.documentation));
        res.push("");
      }
    });
  }

  return res.join("\n");
};

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
