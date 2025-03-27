import { readFileSync } from "fs";
import * as ts from "typescript";
import { FunctionDocEntry } from "../src/parser/types";
import { parseFunction } from "../src/parser/function";
import { printFunction } from "../src/printer/function";

test("parse tooltip", () => {
  const file = "./testdata/tooltip.d.ts";
  const program = ts.createProgram([file], {});
  const sourceFile = program.getSourceFile(file);
  const checker = program.getTypeChecker();
  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    removeComments: true,
  });

  const functions: FunctionDocEntry[] = [];

  if (sourceFile) {
    ts.forEachChild(sourceFile, (node) => {
      if (ts.isFunctionDeclaration(node)) {
        functions.push(parseFunction(node, checker, printer, sourceFile));
      }
    });
  }

  const want = readFileSync("./testdata/tooltip.d.md", "utf-8");

  expect(functions.map(printFunction).join("\n")).toEqual(want);
});
