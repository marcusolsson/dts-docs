import { readFileSync } from "fs";
import { FunctionDocEntry } from "../src/types";
import * as ts from "typescript";
import { parseFunction, printFunction } from "../src/function";

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
