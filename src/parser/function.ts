import * as ts from "typescript";
import { DocEntry, FunctionDocEntry } from "./types";

export const parseFunction = (
  node: ts.FunctionDeclaration,
  checker: ts.TypeChecker,
  printer: ts.Printer,
  sourceFile: ts.SourceFile
): FunctionDocEntry => {
  const signature = checker.getSignatureFromDeclaration(node);
  const symbol = checker.getSymbolAtLocation(node.name);
  const documentation = ts.displayPartsToString(
    symbol.getDocumentationComment(checker)
  );

  const docTags = Object.fromEntries(
    symbol
      .getJsDocTags()
      .filter((f) => f.name === "param")
      .map((f) => {
        const name = f.text.find((f) => f.kind === "parameterName");
        const text = f.text.find((f) => f.kind === "text");

        if (name) {
          return [name.text, text.text.replace("- ", "")];
        }

        // If the parameter doesn't have have a description, the kind will be
        // `text` instead of `parameterName`.
        return [text.text, ""];
      })
  );

  const parameters = signature.parameters.map<DocEntry>((param) => ({
    name: param.getName(),
    type: checker.typeToString(
      checker.getTypeOfSymbolAtLocation(param, param.valueDeclaration!)
    ),
    documentation: docTags[param.getName()] ?? "",
  }));

  return {
    name: symbol.getName(),
    documentation,
    type: checker.typeToString(signature.getReturnType()),
    raw: printer.printNode(ts.EmitHint.Unspecified, node, sourceFile),
    parameters,
  };
};
