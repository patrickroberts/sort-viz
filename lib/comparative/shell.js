/**
 * Shell sort array module.
 * @module sort/comparative/shell
 * @requires module:sort/comparative.ComparativeSortArray
 */
import { ComparativeSortArray } from '../comparative'

/**
 * @see {@link https://en.wikipedia.org/wiki/Shellsort|Shellsort}
 * Uses the {@link https://oeis.org/A108870|Tokuda gap sequence} by default.
 * @extends module:sort/comparative.ComparativeSortArray
 */
export class ShellSortArray extends ComparativeSortArray {
  /**
   * @param {number} index
   * @return {number}
   */
  static tokuda (index) {
    return Math.ceil((9 * (9 / 4) ** index - 4) / 5)
  }

  /**
   * @callback gapsCallback
   * @param {number} [index]
   * @return {number}
   */

  /**
   * Generates an ordered gap sequence sufficient for given `length`.
   * @param {number} length
   * @param {gapsCallback} gaps
   * @yield {number}
   */
  static * sequence (length, gaps) {
    for (let index = 0, gap; (gap = gaps(index)) < length; index++) {
      yield gap
    }
  }

  /**
   * @callback sequenceCallback
   * @param {number} index
   * @return {number} gap
   */

  /**
   * @param {interruptCallback} interrupt
   * @param {compareCallback} compare
   * @param {iterable|sequenceCallback} sequence
   */
  constructor (interrupt, compare, sequence = ShellSortArray.tokuda) {
    super(interrupt, compare)

    if (typeof sequence[Symbol.iterator] === 'function') {
      this.set('sequence', () => {
        const iterator = sequence[Symbol.iterator]()

        return ShellSortArray.sequence(this.length, iterator.next.bind(iterator))
      })
    } else if (typeof sequence === 'function') {
      this.set('sequence', () => ShellSortArray.sequence(this.length, sequence))
    } else {
      throw new TypeError('sequence must be iterable or function')
    }
  }

  * sort () {
    const gaps = Array.from(this.get('sequence')())

    for (let i = gaps.length - 1, increment = gaps[i]; i >= 0; increment = gaps[--i]) {
      for (let offset = 0; offset < increment && increment + offset < this.length; offset++) {
        for (let j = increment + offset; j < this.length; j += increment) {
          const value = this[j]
          let k = j - increment

          while (k >= 0 && (yield * this.compare(j, k, value)) < 0) {
            yield * this.put(k + increment, this[k])
            k -= increment
          }

          if (k + increment < j) {
            yield * this.put(k + increment, value)
          }
        }
      }
    }
  }
}
