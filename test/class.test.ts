import { readFileSync } from "fs";
import * as ts from "typescript";
import { ClassDocEntry } from "../src/parser/types";
import { parseClass } from "../src/parser/class";
import { printClass } from "../src/printer/class";

test("parse class", () => {
  const file = "./testdata/class.d.ts";
  const program = ts.createProgram([file], {});
  const sourceFile = program.getSourceFile(file);
  const checker = program.getTypeChecker();
  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    removeComments: true,
  });

  const classes: ClassDocEntry[] = [];
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isClassDeclaration(node)) {
      classes.push(parseClass(node, checker, printer, sourceFile));
    }
  });

  const want: ClassDocEntry[] = [
    {
      name: "Vehicle",
      documentation: "",
      type: "typeof Vehicle",
      properties: [],
      constructors: [
        {
          parameters: [],
          documentation: "",
          returnType: "Vehicle",
        },
      ],
      methods: [],
      heritage: {},
    },
    {
      name: "Car",
      documentation: "",
      type: "typeof Car",
      properties: [
        {
          name: "regNum",
          documentation: "",
          type: "string",
          raw: "regNum: string;",
        },
      ],
      constructors: [
        {
          parameters: [
            {
              name: "brand",
              documentation: "",
              type: "string",
            },
            {
              name: "regNum",
              documentation: "",
              type: "string",
            },
          ],
          documentation: "",
          returnType: "Car",
        },
      ],
      methods: [
        {
          name: "start",
          documentation: "",
          raw: "start(): void;",
          type: "() => void",
        },
        {
          name: "stop",
          documentation: "",
          raw: "stop(): void;",
          type: "() => void",
        },
      ],
      heritage: {
        implements: ["Runnable", "Object"],
        extends: ["Vehicle"],
      },
    },
  ];

  expect(classes.length).toBe(2);
  expect(classes).toEqual(want);
});

test("print class", () => {
  const got = [
    {
      name: "Vehicle",
      documentation: "",
      type: "typeof Vehicle",
      properties: [],
      constructors: [
        {
          parameters: [],
          documentation: "",
          returnType: "Vehicle",
        },
      ],
      methods: [],
      heritage: {},
    },
    {
      name: "Car",
      documentation: "",
      type: "typeof Car",
      properties: [
        {
          name: "regNum",
          documentation: "",
          type: "string",
          raw: "regNum: string;",
        },
      ],
      constructors: [
        {
          parameters: [
            {
              name: "brand",
              documentation: "",
              type: "string",
            },
            {
              name: "regNum",
              documentation: "",
              type: "string",
            },
          ],
          documentation: "",
          returnType: "Car",
        },
      ],
      methods: [
        {
          name: "start",
          documentation: "",
          raw: "start(): void;",
          type: "() => void",
        },
        {
          name: "stop",
          documentation: "",
          raw: "stop(): void;",
          type: "() => void",
        },
      ],
      heritage: {
        implements: ["Runnable", "Object"],
        extends: ["Vehicle"],
      },
    },
  ];

  const want = readFileSync("./testdata/class.d.md", "utf-8");

  expect(got.map(printClass).join("\n")).toEqual(want);
});
