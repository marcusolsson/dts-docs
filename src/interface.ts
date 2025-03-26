import * as ts from "typescript";
import { DocEntry, InterfaceDocEntry } from "./types";
import { escapeHTML, serializeSymbol } from "./utils";

export const printInterface = (i: InterfaceDocEntry): string => {
  const res: string[] = [];

  res.push("---");
  res.push(`title: dts-docs/api-reference/interface/${i.name}`);
  res.push(`group: dts-docs`)
  res.push("---");
  res.push("");


  res.push(`# ${i.name}`);
  res.push("");

  if (i.documentation) {
    res.push(escapeHTML(i.documentation));
    res.push("");
  }

  if (i.properties.length > 0) {
    res.push("## Properties");
    res.push("");

    i.properties.forEach((m) => {
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

  if (i.methods.length > 0) {
    res.push("## Methods");
    res.push("");

    i.methods.forEach((m) => {
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

  return res.join("\n");
};

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
