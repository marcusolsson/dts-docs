import * as ts from "typescript";
import { DocEntry, FunctionDocEntry } from "./types";
import { escapeHTML } from "./utils";

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
      .map((f) => f.text.split(" - "))
      .map((f) => [f[0], f[1]])
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

export const printFunction = (f: FunctionDocEntry): string => {
  const res: string[] = [];

  res.push("# " + f.name);
  res.push("");
  res.push("```ts");
  res.push(f.raw);
  res.push("```");
  res.push("");

  if (f.documentation) {
    res.push(escapeHTML(f.documentation));
    res.push("");
  }

  if (f.parameters.length > 0) {
    res.push(`## Parameters`);
    res.push("");
    res.push("| Parameter | Description |");
    res.push("|-----------|-------------|");

    f.parameters.forEach((p) => {
      res.push(
        "| `" +
          p.name +
          "` | " +
          escapeHTML(p.documentation) +
          (p.documentation ? " " : "") +
          "|"
      );
    });
    res.push("");
  }

  return res.join("\n");
};
