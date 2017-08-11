/**
 * Selection sort array module.
 * @module sort/comparative/selection
 *
 * @requires module:sort/comparative.ComparativeSortArray
 */
import { ComparativeSortArray } from '../comparative'

/**
 * @see {@link https://en.wikipedia.org/wiki/Selection_sort|Selection Sort}
 *
 * @extends module:sort/comparative.ComparativeSortArray
 */
export class SelectionSortArray extends ComparativeSortArray {
  /** @override */
  * sort () {
    for (let i = 0; i < this.length; i++) {
      let smallestIndex = i

      for (let j = i + 1; j < this.length; j++) {
        if ((yield * this.compare(smallestIndex, j)) > 0) {
          smallestIndex = j
        }
      }

      if (smallestIndex > i) {
        yield * this.swap(i, smallestIndex)
      }
    }
  }
}
