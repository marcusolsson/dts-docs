import { ParsedFile } from "../parser";
import { writeFileSync } from "fs";
import { ClassPrinter } from "./class";
import { EnumPrinter } from "./enum";
import { FunctionPrinter } from "./function";
import { InterfacePrinter } from "./interface";
import { TypePrinter } from "./type";
import { ensureDir } from "./utils";
import * as path from "path";
import { DocEntry } from "../parser/types";
import { TocPrinter } from "./toc";

/**
 * Used to define a printer strategy for a doc entry.
 */
export interface Printer<T extends DocEntry> {
  print(entry: T): string;
}

/**
 * Writes the parsed doc entries to an directory.
 *
 * @param input - The parsed file containing the definitions
 * @param outputDir - The root directory for the generated docs
 */
export function writeDocs(input: ParsedFile, outputDir: string) {
  writeTableOfContents(outputDir, input, new TocPrinter());

  writeEntriesToFile(outputDir, "classes", input.classes, new ClassPrinter());
  writeEntriesToFile(outputDir, "enums", input.enums, new EnumPrinter());
  writeEntriesToFile(
    outputDir,
    "functions",
    input.functions,
    new FunctionPrinter()
  );
  writeEntriesToFile(
    outputDir,
    "interfaces",
    input.interfaces,
    new InterfacePrinter()
  );
  writeEntriesToFile(outputDir, "types", input.types, new TypePrinter());
}

/**
 * Writes an index.md with the table of contents for all the doc entries.
 *
 * @param outputDir - The root directory for the generated docs
 * @param inputFile - The parsed file containing the definitions
 * @param printer - The printer to use for converting the definitions to text
 */
function writeTableOfContents(
  outputDir: string,
  inputFile: ParsedFile,
  printer: TocPrinter
) {
  if (outputDir) {
    ensureDir(path.join(outputDir));
  }

  writeFileSync(path.join(outputDir, "index.md"), printer.print(inputFile));
}

/**
 * Writes a collection of doc entries to a subfolder in the output directory.
 *
 * @param outputDir - The root directory for the generated docs
 * @param sectionDir - The subdirectory for the specific doc entries
 * @param entries - The doc entries to write
 * @param printer - The printer to use for converting doc entries to text
 */
function writeEntriesToFile<T extends DocEntry>(
  outputDir: string,
  sectionDir: string,
  entries: T[],
  printer: Printer<T>
) {
  if (entries.length) {
    ensureDir(path.join(outputDir, sectionDir));
  }

  entries.forEach((entry) => {
    writeFileSync(
      path.join(outputDir, sectionDir, entry.name + ".md"),
      printer.print(entry)
    );
  });
}
