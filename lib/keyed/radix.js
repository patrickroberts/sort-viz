/**
 * Radix sort array module.
 * @module sort/keyed/radix
 *
 * @requires module:sort/keyed.KeyedSortArray
 */
import { KeyedSortArray } from '../keyed'

/**
 * @see {@link https://en.wikipedia.org/wiki/Radix_sort|Radix Sort}
 *
 * @extends module:sort/keyed.KeyedSortArray
 *
 * @param {module:sort/virtual.interruptCallback} [interrupt]
 * @param {module:sort/virtual.keyCallback} [key]
 * @param {number} [radix=36]
 *
 * @throws {RangeError} `radix` must be an integer between 2 and 36.
 */
export class RadixSortArray extends KeyedSortArray {
  constructor (interrupt, key, radix = 36) {
    super(interrupt, key)

    if (radix < 2 || radix > 36 || radix !== Math.floor(radix)) {
      throw new RangeError('radix must be an integer between 2 and 36')
    }

    this.set('radix', radix)
  }

  /**
   * @override
   *
   * @param {number} [radix=this.get('radix')]
   */
  * sort (radix = this.get('radix')) {
    const buckets = new Array(radix)
    // allocate a swap array for every write sequence
    let swap = new RadixSortArray(this.get('interrupt'), this.get('key'), radix)
    let self = this
    let maxLength = 1

    for (let digit = 0; digit < maxLength; digit++) {
      buckets.fill(0)

      for (let i = 0; i < self.length; i++) {
        const key = (yield * self.key(i)).toString(radix)
        const bucket = self.bucket(key, digit, radix)

        if (key.length > maxLength) {
          maxLength = key.length
        }

        for (let j = bucket + 1; j < radix; j++) {
          buckets[j]++
        }
      }

      for (let i = 0; i < self.length; i++) {
        const key = (yield * self.key(i)).toString(radix)
        const bucket = self.bucket(key, digit, radix)

        yield * swap.put(buckets[bucket]++, self[i])
      }

      ;[swap, self] = [self, swap]
    }

    if (swap === this) {
      for (let i = self.length - 1; i >= 0; i--) {
        yield * swap.put(i, self.pop())
      }
    }
  }

  /**
   * @param {string} key
   * @param {number} digit
   * @param {number} [radix=this.get('radix')]
   *
   * @return {number} index
   */
  bucket (key, digit, radix = this.get('radix')) {
    if (digit >= key.length) {
      return 0
    }

    return parseInt(key.substr(key.length - digit - 1, 1), radix)
  }
}
