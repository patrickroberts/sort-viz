/**
 * Iterative merge sort array module.
 * @module sort/comparative/merge/iterative
 * @requires module:sort/comparative/merge.MergeSortArray
 */
import { MergeSortArray } from '../merge'

/**
 * @see {@link https://en.wikipedia.org/wiki/Merge_sort#Bottom-up_implementation|Bottom-up Merge Sort}
 * @extends module:sort/comparative/merge.MergeSortArray
 */
export class IterativeMergeSortArray extends MergeSortArray {
  * sort () {
    for (let increment = 1; increment < this.length; increment *= 2) {
      for (let begin = 0; begin < this.length; begin += increment * 2) {
        const middle = begin + increment
        const end = Math.min(begin + increment * 2, this.length)

        yield * this.merge(begin, middle, end)
      }
    }
  }
}
