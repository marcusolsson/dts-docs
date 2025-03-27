import { parseFile } from "./parser";
import { writeDocs } from "./printer";

const args = process.argv.slice(2);

if (args.length !== 2) {
  console.log("dts-docs requires 2 arguments.");
  console.log("");
  console.log("Usage: dts-docs <input-file> <output-dir>");

  process.exit(1);
}

const [inputFile, outputDir] = args;

const parsed = parseFile(inputFile);

writeDocs(parsed, outputDir);
