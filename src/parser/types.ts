export interface Heritage {
  extends?: string[];
  implements?: string[];
}

export interface DocEntry {
  name: string;
  documentation: string;
  type: string;
  raw?: string;
}

export interface SignatureDocEntry {
  parameters: DocEntry[];
  returnType: string;
  documentation: string;
  raw?: string;
}

export interface FunctionDocEntry extends DocEntry {
  parameters: DocEntry[];
}

export interface ClassDocEntry extends DocEntry {
  properties: DocEntry[];
  methods: DocEntry[];
  constructors: SignatureDocEntry[];
  heritage: Heritage;
}

export interface InterfaceDocEntry extends DocEntry {
  properties: DocEntry[];
  methods: DocEntry[];
}
