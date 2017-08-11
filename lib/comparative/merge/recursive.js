/**
 * Recursive merge sort array module.
 * @module sort/comparative/merge/recursive
 *
 * @requires module:sort/comparative/merge.MergeSortArray
 */
import { MergeSortArray } from '../merge'

/**
 * @see {@link https://en.wikipedia.org/wiki/Merge_sort#Top-down_implementation|Top-down Merge Sort}
 *
 * @extends module:sort/comparative/merge.MergeSortArray
 */
export class RecursiveMergeSortArray extends MergeSortArray {
  /**
   * @override
   *
   * @param {number} [begin=0]
   * @param {number} [end=this.length]
   */
  * sort (begin = 0, end = this.length) {
    const middle = Math.ceil((begin + end) / 2)

    if (middle - begin > 1) {
      yield * this.sort(begin, middle)
      yield * this.sort(middle, end)
    }

    yield * this.merge(begin, middle, end)
  }
}
