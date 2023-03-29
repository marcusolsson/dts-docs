import { readFileSync } from "fs";
import { FunctionDocEntry } from "../src/types";
import * as ts from "typescript";
import { parseFunction, printFunction } from "../src/function";

test("parse function", () => {
  const file = "./testdata/function.d.ts";
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

  const want = [
    {
      name: "concat",
      documentation: "Concatenates two numbers.",
      type: "string",
      raw: "export function concat(param1: number, param2: number): string;",
      parameters: [
        { name: "param1", type: "number", documentation: "the first param" },
        { name: "param2", type: "number", documentation: "the second param" },
      ],
    },
    {
      name: "sum",
      documentation: "",
      type: "number",
      raw: "export function sum(param1: number, param2: number): number;",
      parameters: [
        { name: "param1", type: "number", documentation: "" },
        { name: "param2", type: "number", documentation: "" },
      ],
    },
  ];

  expect(functions.length).toBe(2);
  expect(functions).toEqual(want);
});

test("print function", () => {
  const got = [
    {
      name: "concat",
      documentation: "Concatenates two numbers.",
      type: "string",
      raw: "export function concat(param1: number, param2: number): string;",
      parameters: [
        { name: "param1", type: "number", documentation: "the first param" },
        { name: "param2", type: "number", documentation: "the second param" },
      ],
    },
    {
      name: "sum",
      documentation: "",
      type: "number",
      raw: "export function sum(param1: number, param2: number): number;",
      parameters: [
        { name: "param1", type: "number", documentation: "" },
        { name: "param2", type: "number", documentation: "" },
      ],
    },
  ];

  const want = readFileSync("./testdata/function.d.md", "utf-8");

  expect(got.map(printFunction).join("\n")).toEqual(want);
});
