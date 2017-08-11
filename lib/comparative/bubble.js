/**
 * Bubble sort array module.
 * @module sort/comparative/bubble
 * @requires module:sort/comparative.ComparativeSortArray
 */
import { ComparativeSortArray } from '../comparative'

/**
 * @see {@link https://en.wikipedia.org/wiki/Bubble_sort|Bubble Sort}
 * @extends module:sort/comparative.ComparativeSortArray
 */
export class BubbleSortArray extends ComparativeSortArray {
  * sort () {
    for (let i = this.length; i > 0; i--) {
      for (let j = 1; j < i; j++) {
        if ((yield * this.compare(j - 1, j)) > 0) {
          yield * this.swap(j - 1, j)
        }
      }
    }
  }
}
