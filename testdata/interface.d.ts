/**
 * The magnificent calculator.
 */
export interface Calculator {
  factor: number;

  /**
   * @public
   */
  diff: (param1: number, param2: number) => number;

  /**
   * Sums two numbers.
   *
   * @param param1 - the first param
   * @param param2 - the second param
   */
  sum(param1: number, param2: number): number;
}
