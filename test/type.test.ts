import { readFileSync } from "fs";
import * as ts from "typescript";
import { DocEntry } from "../src/parser/types";
import { parseType } from "../src/parser/type";
import { TypePrinter } from "../src/printer/type";

test("parse type", () => {
  const file = "./testdata/type.d.ts";
  const program = ts.createProgram([file], {});
  const sourceFile = program.getSourceFile(file);
  const checker = program.getTypeChecker();
  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    removeComments: true,
  });

  const enums: DocEntry[] = [];

  if (sourceFile) {
    ts.forEachChild(sourceFile, (node) => {
      if (ts.isTypeAliasDeclaration(node)) {
        enums.push(parseType(node, checker, printer, sourceFile));
      }
    });
  }

  const want = [
    {
      name: "State",
      documentation: "Switch state.",
      type: "any",
      raw: `export type State = "on" | "off";`,
    },
  ];

  expect(enums.length).toBe(1);
  expect(enums).toEqual(want);
});

test("print type", () => {
  const got = [
    {
      name: "State",
      documentation: "Switch state.",
      type: "any",
      raw: `export type State = "on" | "off";`,
    },
  ];

  const want = readFileSync("./testdata/type.d.md", "utf-8");

  const printer = new TypePrinter();

  expect(got.map(printer.print).join("\n")).toEqual(want);
});
