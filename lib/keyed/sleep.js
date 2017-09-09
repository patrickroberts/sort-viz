/**
 * Sleep sort array module.
 * @module sort/keyed/sleep
 *
 * @requires module:sort/keyed.KeyedSortArray
 */
import { KeyedSortArray } from '../keyed'

/**
 * @see {@link https://rosettacode.org/wiki/Sorting_algorithms/Sleep_sort|Sleep Sort}
 *
 * @extends module:sort/keyed.KeyedSortArray
 */
export class SleepSortArray extends KeyedSortArray {
  /** @override */
  * sort () {
    const threads = new Array(this.length)

    for (let index = 0; index < this.length; index++) {
      threads[index] = { value: this[index], delay: yield * this.key(index) }
    }

    for (let index = 0; index < this.length; index++) {
      yield Promise.all(threads).then(() => {
        const step = Math.min.apply(Math, threads.map(({ delay }) => delay))
        const next = threads.findIndex(({ delay }) => delay === step)
        const [{ value }] = threads.splice(next, 1)

        threads.forEach(thread => {
          thread.delay -= step
        })

        this.put(index, value).next()
      })
    }
  }
}
