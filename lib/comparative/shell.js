/**
 * Shell sort array module.
 * @module sort/comparative/shell
 *
 * @requires module:sort/comparative.ComparativeSortArray
 */
import { ComparativeSortArray } from '../comparative'

/**
 * @memberOf module:sort/virtual
 *
 * @callback sequenceCallback
 *
 * @param {number} index
 *
 * @return {number} gapSize
 */

/**
 * Uses the {@link https://oeis.org/A108870|Tokuda gap sequence} by default.
 * @see {@link https://en.wikipedia.org/wiki/Shellsort|Shellsort}
 *
 * @extends module:sort/comparative.ComparativeSortArray
 *
 * @param {module:sort/virtual.interruptCallback} [interrupt]
 * @param {module:sort/virtual.compareCallback} [compare]
 * @param {iterable|module:sort/virtual.sequenceCallback} [sequence=ShellSortArray.tokuda] - If an `iterable` is passed, it is converted to a `sequenceCallback`.
 *
 * @throws {TypeError} `sequence` must be iterable or function.
 */
export class ShellSortArray extends ComparativeSortArray {
  /**
   * @param {number} index
   *
   * @return {number}
   */
  static tokuda (index) {
    return Math.ceil((9 * (9 / 4) ** index - 4) / 5)
  }

  /**
   * Generates an ordered gap sequence sufficient for given `length`.
   * @param {number} length
   * @param {module:sort/virtual.sequenceCallback} gaps
   *
   * @yield {number}
   */
  static * sequence (length, gaps) {
    for (let index = 0, gap; (gap = gaps(index)) < length; index++) {
      yield gap
    }
  }

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

  /** @override */
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
