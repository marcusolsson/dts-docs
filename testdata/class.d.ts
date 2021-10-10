export interface Runnable {}

export interface Object {}

export abstract class Vehicle {}

export class Car extends Vehicle implements Runnable, Object {
  regNum: string;

  start(): void;

  stop(): void;
}
