/**
 * Cocktail sort array module.
 * @module sort/comparative/cocktail
 *
 * @requires module:sort/comparative.ComparativeSortArray
 */
import { ComparativeSortArray } from '../comparative'

/**
 * @see {@link https://en.wikipedia.org/wiki/Cocktail_sort|Cocktail Sort}
 *
 * @extends module:sort/comparative.ComparativeSortArray
 */
export class CocktailSortArray extends ComparativeSortArray {
  /** @override */
  * sort () {
    let begin = 0
    let end = this.length - 1

    while (begin < end) {
      let nextBegin = end
      let nextEnd = begin

      for (let index = begin; index < end; index++) {
        if ((yield * this.compare(index, index + 1)) > 0) {
          yield * this.swap(index, index + 1)
          nextEnd = index
        }
      }

      for (let index = end; index > begin; index--) {
        if ((yield * this.compare(index - 1, index)) > 0) {
          yield * this.swap(index - 1, index)
          nextBegin = index
        }
      }

      begin = nextBegin
      end = nextEnd
    }
  }
}
