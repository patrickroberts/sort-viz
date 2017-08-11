/**
 * Comparative sort array module.
 * @module sort/comparative
 * @requires module:sort/abstract.AbstractSortArray
 */
import { AbstractSortArray } from './abstract'

/**
 * Base abstract class for arrays that implement comparative sorting algorithms.
 * @abstract
 * @extends {module:sort/abstract.AbstractSortArray}
 */
export class ComparativeSortArray extends AbstractSortArray {
  /**
   * Invoked during each compare step of the ComparativeSortArray sort method.
   * @callback compareCallback
   * @param {*} a - An element to compare on the left-hand side.
   * @param {*} b - An element to compare on the right-hand side.
   */

  /**
   * Creates a ComparativeSortArray.
   * @override
   * @param {interruptCallback} interrupt
   * @param {compareCallback} compare
   * @throws {TypeError} `compare` must be a function of 2 arguments.
   */
  constructor (interrupt, compare = (a, b) => 0) {
    super(interrupt)

    if (typeof compare === 'function' && compare.length === 2) {
      this.set('compare', compare)
    } else {
      throw new TypeError('compare must be a function of 2 arguments')
    }
  }

  /**
   * A method to interruptably compare two elements in the array.
   * `a` and `b` are optional, since `i` and `j` can sometimes be
   * used to represent indices that are virtual in the comparsion.
   * @param {number} i - Index of left-hand element to compare.
   * @param {number} j - Index of right-hand element to compare.
   * @param {*} [a=this[i]] - Value of left-hand element to compare.
   * @param {*} [b=this[j]] - Value of right-hand element to compare.
   * @return {number} result - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Description|See compareFunction}
   */
  * compare (i, j, a = this[i], b = this[j]) {
    yield this.get('interrupt')({ type: 'compare', entries: [[i, a], [j, b]] })
    return this.get('compare')(a, b)
  }
}