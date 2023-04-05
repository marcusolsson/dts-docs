export interface Runnable {}

export interface Object {}

export abstract class Vehicle {}

export class Car extends Vehicle implements Runnable, Object {
  regNum: string;

  constructor(brand: string, regNum: string);

  start(): void;

  stop(): void;

  /**
   * foo
   * @public
   */
  on(name: "foo", callback: () => any, ctx?: any): string;

  /**
   * bar
   * @public
   */
  on(name: "bar", callback: () => any, ctx?: any): string;

  /**
   * baz
   * @public
   */
  on(name: "baz", callback: () => any, ctx?: any): string;
}
