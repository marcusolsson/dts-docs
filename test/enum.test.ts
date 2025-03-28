import { readFileSync } from "fs";
import * as ts from "typescript";
import { DocEntry } from "../src/parser/types";
import { parseEnum } from "../src/parser/enum";
import { EnumPrinter } from "../src/printer/enum";

test("parse enum", () => {
  const file = "./testdata/enum.d.ts";
  const program = ts.createProgram([file], {});
  const sourceFile = program.getSourceFile(file);
  const checker = program.getTypeChecker();
  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    removeComments: true,
  });

  expect(sourceFile).toBeTruthy();

  const enums: DocEntry[] = [];

  if (sourceFile) {
    ts.forEachChild(sourceFile, (node) => {
      if (ts.isEnumDeclaration(node)) {
        enums.push(parseEnum(node, checker, printer, sourceFile));
      }
    });
  }

  const want = [
    {
      name: "Direction",
      documentation: "The direction.",
      type: "typeof Direction",
      raw: `export enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT"
}`,
    },
  ];

  expect(enums.length).toBe(1);
  expect(enums).toEqual(want);
});

test("print enum", () => {
  const got = [
    {
      name: "Direction",
      documentation: "The direction.",
      type: "typeof Direction",
      raw: `export enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT"
}`,
    },
  ];

  const want = readFileSync("./testdata/enum.d.md", "utf-8");

  const printer = new EnumPrinter();

  expect(got.map(printer.print).join("\n")).toEqual(want);
});
