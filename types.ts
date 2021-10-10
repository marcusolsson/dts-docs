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

export interface TypeDocEntry extends DocEntry {}

export interface EnumDocEntry extends DocEntry {}

export interface FunctionDocEntry extends DocEntry {
  parameters: DocEntry[];
}

export interface ClassDocEntry extends DocEntry {
  properties: DocEntry[];
  methods: DocEntry[];
  constructors: SignatureDocEntry[];
  heritage: {
    implements?: any[];
    extends?: any[];
  };
}

export interface InterfaceDocEntry extends DocEntry {
  properties: DocEntry[];
  methods: DocEntry[];
}
