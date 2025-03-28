import { readFileSync } from "fs";
import * as ts from "typescript";
import { InterfaceDocEntry } from "../src/parser/types";
import { parseInterface } from "../src/parser/interface";
import { InterfacePrinter } from "../src/printer/interface";

test("parse interface", () => {
  const file = "./testdata/interface.d.ts";
  const program = ts.createProgram([file], {});
  const sourceFile = program.getSourceFile(file);
  const checker = program.getTypeChecker();
  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    removeComments: true,
  });

  const interfaces: InterfaceDocEntry[] = [];
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isInterfaceDeclaration(node)) {
      interfaces.push(parseInterface(node, checker, printer, sourceFile));
    }
  });

  const want = [
    {
      name: "Calculator",
      documentation: "The magnificent calculator.",
      type: "any",
      methods: [
        {
          name: "sum",
          documentation: "Sums two numbers.",
          raw: "sum(param1: number, param2: number): number;",
          type: "(param1: number, param2: number) => number",
        },
      ],
      properties: [
        {
          name: "factor",
          type: "number",
          documentation: "",
          raw: "factor: number;",
        },
        {
          name: "diff",
          type: "(param1: number, param2: number) => number",
          documentation: "",
          raw: "diff: (param1: number, param2: number) => number;",
        },
      ],
    },
  ];

  expect(interfaces.length).toBe(1);
  expect(interfaces).toEqual(want);
});

test("print interface", () => {
  const got = [
    {
      name: "Calculator",
      documentation: "The magnificent calculator.",
      type: "any",
      methods: [
        {
          name: "sum",
          documentation: "Sums two numbers.",
          raw: "sum(param1: number, param2: number): number;",
          type: "(param1: number, param2: number) => number",
        },
      ],
      properties: [
        {
          name: "factor",
          type: "number",
          documentation: "",
          raw: "factor: number;",
        },
        {
          name: "diff",
          type: "(param1: number, param2: number) => number",
          documentation: "",
          raw: "diff: (param1: number, param2: number) => number;",
        },
      ],
    },
  ];

  const want = readFileSync("./testdata/interface.d.md", "utf-8");

  const printer = new InterfacePrinter();

  expect(got.map(printer.print).join("\n")).toEqual(want);
});
