/**
 * Keyed sort array module.
 * @module sort/keyed
 *
 * @requires module:sort/abstract.AbstractSortArray
 */
import { AbstractSortArray } from './abstract'

/**
 * Invoked during each key step of the KeyedSortArray sort method.
 * @memberOf module:sort/virtual
 *
 * @callback keyCallback
 *
 * @param {*} o - An element whose non-negative integer value to check.
 *
 * @return {number} result - A non-negative integer value representing the relational index of `o`.
 */

/**
 * Base abstract class for arrays that implement non-comparative sorting algorithms.
 * @abstract
 *
 * @extends module:sort/abstract.AbstractSortArray
 *
 * @param {module:sort/virtual.interruptCallback} interrupt
 * @param {module:sort/virtual.keyCallback} key
 *
 * @throws {TypeError} `key` must be a function of 1 argument.
 */
export class KeyedSortArray extends AbstractSortArray {
  constructor (interrupt, key = o => 0) {
    super(interrupt)

    if (typeof key === 'function' && key.length === 1) {
      this.set('key', key)
    } else {
      throw new TypeError('key must be a function of 1 argument')
    }
  }

  /**
   * A method to interruptably key an element in the array.
   * `value` is optional, since `index` can sometimes be
   * used to represent an index that is virtual in the key.
   *
   * @param {number} index - Index of the element to key.
   * @param {*} [value=this[i]] - Value of the element to key.
   *
   * @return {number} result - A non-negative integer value representing the relational index of `value`.
   */
  * key (index, value = this[index]) {
    yield this.get('interrupt')({ type: 'key', entries: [[index, value]] })
    return this.get('key')(value)
  }
}
