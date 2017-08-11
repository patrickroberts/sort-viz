/**
 * Heap sort array module.
 * @module sort/comparative/heap
 * @requires module:sort/comparative.ComparativeSortArray
 */
import { ComparativeSortArray } from '../comparative'

/**
 * @see {@link https://en.wikipedia.org/wiki/Heapsort|Heapsort}
 * @extends module:sort/comparative.ComparativeSortArray
 */
export class HeapSortArray extends ComparativeSortArray {
  * sort () {
    for (let index = Math.floor((this.length - 1) / 2); index >= 0; index--) {
      yield * this.trickle(index)
    }

    for (let index = this.length - 1; index > 0; index--) {
      yield * this.swap(0, index)
      yield * this.trickle(0, index)
    }
  }

  /**
   * @param {number} i
   * @param {number} [bound=this.length]
   */
  * trickle (i, bound = this.length) {
    if (i * 2 + 1 >= bound) return

    if ((yield * this.compare(i, i * 2 + 1)) < 0) {
      if (i * 2 + 2 >= bound || (yield * this.compare(i * 2 + 1, i * 2 + 2)) > 0) {
        yield * this.swap(i, i * 2 + 1)
        yield * this.trickle(i * 2 + 1, bound)
      }
    }

    if (i * 2 + 2 < bound && (yield * this.compare(i, i * 2 + 2)) < 0) {
      yield * this.swap(i, i * 2 + 2)
      yield * this.trickle(i * 2 + 2, bound)
    }
  }
}
