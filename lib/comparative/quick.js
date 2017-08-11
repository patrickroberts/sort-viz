/**
 * Quick sort array module.
 * @module sort/comparative/quick
 * @requires module:sort/comparative.ComparativeSortArray
 */
import { ComparativeSortArray } from '../comparative'

/**
 * @see {@link https://en.wikipedia.org/wiki/Quicksort|Quicksort}
 * @extends module:sort/comparative.ComparativeSortArray
 */
export class QuickSortArray extends ComparativeSortArray {
  /**
   * @param {number} [begin=0]
   * @param {number} [end=this.length - 1]
   */
  * sort (begin = 0, end = this.length - 1) {
    let i = begin
    let j = end
    let pivot = Math.floor((i + j) / 2)

    while (i <= j) {
      while (i !== pivot && (yield * this.compare(i, pivot)) <= 0) {
        i++
      }
      while (j !== pivot && (yield * this.compare(j, pivot)) >= 0) {
        j--
      }

      if (i === j) {
        i++
        j--
      } else if (i < j) {
        if (i === pivot) {
          pivot = j
        } else if (j === pivot) {
          pivot = i
        }

        yield * this.swap(i++, j--)
      }
    }

    if (j > begin) yield * this.sort(begin, j)
    if (i < end) yield * this.sort(i, end)
  }
}
