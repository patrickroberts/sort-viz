/**
 * Abstract sort array module.
 * @module sort/abstract
 *
 * @requires module:sort/scope.ScopeArray
 */
import { ScopeArray } from './scope'

/**
 * @memberOf module:sort/virtual
 *
 * @class Entry
 *
 * @hideconstructor
 *
 * @extends Array
 *
 * @property {number} 0 - Index.
 * @property {*} 1 - Value.
 */

/**
 * Invoked during each interruptable step of AbstractSortArray methods.
 * @memberOf module:sort/virtual
 *
 * @callback interruptCallback
 *
 * @param {Object} step - An object containing information about a generic step interruption.
 * @param {string} step.type - The type of step, e.g. "compare", "swap", "put", "key".
 * @param {module:sort/virtual.Entry[]} entries - An array of index / value pairs of elements involved in the step.
 */

/**
 * Base abstract class for arrays that implement sorting algorithms. Do not invoke directly.
 * @abstract
 *
 * @extends module:sort/scope.ScopeArray
 *
 * @param {module:sort/virtual.interruptCallback} interrupt
 *
 * @throws {TypeError} Illegal constructor.
 * @throws {TypeError} `interrupt` must be a function.
 */
export class AbstractSortArray extends ScopeArray {
  constructor (interrupt = () => {}) {
    super()

    if (this.constructor === AbstractSortArray) {
      throw new TypeError('Illegal constructor')
    }

    if (typeof interrupt === 'function') {
      this.set('interrupt', interrupt)
    } else {
      throw new TypeError('interrupt must be a function')
    }
  }

  /**
   * Invoked for each index to generate an element of the array.
   * @callback fillCallback
   *
   * @return {*} element - A generated value with which to populate the array.
   */

  /**
   * A method to interruptably populate the array with elements generated from `factory`.
   * @param {module:sort/abstract~fillCallback} factory
   * @param {number} [length=this.length]
   *
   * @throws {TypeError} `factory` must be a function.
   */
  * fill (factory, length = this.length) {
    if (typeof factory !== 'function') {
      throw new TypeError('factory must be a function')
    }

    this.length = 0

    for (let i = 0; i < length; i++) {
      yield * this.put(i, factory())
    }
  }

  /**
   * A method to interruptably randomize the order of elements in the array.
   * Uses the {@link https://en.wikipedia.org/wiki/Fisher–Yates_shuffle|Knuth Fisher Yates} method.
   */
  * shuffle () {
    for (let i = this.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      yield * this.swap(i, j)
    }
  }

  /**
   * A method to interruptably swap two elements in the array.
   * @param {number} i - Index of first element to swap.
   * @param {number} j - Index of second element to swap.
   */
  * swap (i, j) {
    ;[this[i], this[j]] = [this[j], this[i]]
    yield this.get('interrupt')({ type: 'swap', entries: [[i, this[i]], [j, this[j]]] })
  }

  /**
   * A method to interruptably put an element in the array.
   * @param {number} index - Index to put element `value`.
   * @param {*} value - Value to put in `index`.
   */
  * put (index, value) {
    this[index] = value
    yield this.get('interrupt')({ type: 'put', entries: [[index, value]] })
  }

  /**
   * Abstract method to interruptably sort array of elements.
   * @abstract
   * @throws {TypeError} Illegal invocation.
   */
  * sort () {
    throw new TypeError('Illegal invocation')
  }
}
