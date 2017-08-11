/**
 * Insertion sort array module.
 * @module sort/comparative/insertion
 *
 * @requires module:sort/comparative.ComparativeSortArray
 */
import { ComparativeSortArray } from '../comparative'

/**
 * @see {@link https://en.wikipedia.org/wiki/Insertion_sort|Insertion Sort}
 *
 * @extends module:sort/comparative.ComparativeSortArray
 */
export class InsertionSortArray extends ComparativeSortArray {
  /** @override */
  * sort () {
    for (let i = 1; i < this.length; i++) {
      let j = i - 1
      const value = this[i]

      while (j >= 0 && (yield * this.compare(i, j, value)) < 0) {
        yield * this.put(j + 1, this[j--])
      }

      if (j + 1 < i) {
        yield * this.put(j + 1, value)
      }
    }
  }
}
