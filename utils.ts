import * as ts from "typescript";
import { DocEntry } from "./types";

export const serializeSymbol = (
  checker: ts.TypeChecker,
  symbol: ts.Symbol
): DocEntry => {
  return {
    name: symbol.getName(),
    documentation: ts.displayPartsToString(
      symbol.getDocumentationComment(checker)
    ),
    type: checker.typeToString(
      checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
    ),
  };
};

export function serializeSignature(
  checker: ts.TypeChecker,
  signature: ts.Signature
) {
  return {
    parameters: signature.parameters.map((p) => serializeSymbol(checker, p)),
    returnType: checker.typeToString(signature.getReturnType()),
    documentation: ts.displayPartsToString(
      signature.getDocumentationComment(checker)
    ),
  };
}

export const escapeHTML = (str: string): string => {
  return str
    .replace("|", "&vert;")
    .replace("<", "&lt;")
    .replace("<", "&lt;")
    .replace("<", "&lt;")
    .replace(">", "&gt;")
    .replace(">", "&gt;")
    .replace(">", "&gt;");
};
