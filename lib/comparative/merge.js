/**
 * Merge sort array module.
 * @module sort/comparative/merge
 *
 * @requires module:sort/comparative.ComparativeSortArray
 */
import { ComparativeSortArray } from '../comparative'

/**
 * Base abstract merge sort array.
 * @see {@link https://en.wikipedia.org/wiki/Merge_sort|Merge Sort}
 *
 * @abstract
 *
 * @extends module:sort/comparative.ComparativeSortArray
 */
export class MergeSortArray extends ComparativeSortArray {
  /**
   * @param {number} begin
   * @param {number} middle
   * @param {number} end
   */
  * merge (begin, middle, end) {
    const first = this.slice(begin, middle)
    const last = this.slice(middle, end)
    let index = begin
    let i = 0
    let j = 0

    while (index < end) {
      if (j === last.length) {
        yield * this.put(index, first[i++])
      } else if (i === first.length) {
        yield * this.put(index, last[j++])
      } else if ((yield * this.compare(begin + i, middle + j, first[i], last[j])) <= 0) {
        yield * this.put(index, first[i++])
      } else {
        yield * this.put(index, last[j++])
      }

      index++
    }
  }
}
