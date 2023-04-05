import { readFileSync } from "fs";
import * as ts from "typescript";
import { parseType, printType } from "../src/type";
import { EnumDocEntry } from "../src/types";

test("parse type", () => {
  const file = "./testdata/type.d.ts";
  const program = ts.createProgram([file], {});
  const sourceFile = program.getSourceFile(file);
  const checker = program.getTypeChecker();
  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    removeComments: true,
  });

  const enums: EnumDocEntry[] = [];

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

  expect(got.map(printType).join("\n")).toEqual(want);
});
