/**
 * Smooth sort array module.
 * @module sort/comparative/smooth
 * @requires module:sort/comparative.ComparativeSortArray
 */
import { ComparativeSortArray } from '../comparative'

/**
 * Keeps an array of Leonardo heap sizes
 * that are implicit in SmoothSortArray.
 * @private
 */
class LeonardoHeapArray extends Array {
  peek (index = -1) {
    return this[this.length + index]
  }

  push () {
    if (this.length > 1 && this.peek(-2) - this.peek() === 1) {
      this.splice(-2, 2, this.peek(-2) + 1)
    } else if (this.length > 0 && this.peek() === 1) {
      super.push(0)
    } else {
      super.push(1)
    }
  }

  pop () {
    const size = super.pop()

    if (size > 1) {
      super.push(size - 1, size - 2)
    }
  }
}

/**
 * @see {@link https://en.wikipedia.org/wiki/Smoothsort|Smoothsort}
 * @extends module:sort/comparative.ComparativeSortArray
 */
export class SmoothSortArray extends ComparativeSortArray {
  /**
   * @param {number} index
   * @return {number}
   */
  static leonardo (index) {
    const sqrt5 = 2.23606797749979
    const phi = (1 + sqrt5) / 2
    const psi = (1 - sqrt5) / 2

    return Math.round((2 / sqrt5) * phi ** (index + 1) - psi ** (index + 1) - 1)
  }

  * sort () {
    const sizes = new LeonardoHeapArray()

    for (let i = 0; i < this.length; i++) {
      sizes.push()
      yield * this.trickle(i, sizes.peek())
    }

    for (let i = this.length - 1; i >= 0; i--) {
      yield * this.rootSort(sizes)
      sizes.pop()
    }
  }

  /**
   * @param {number} base - Index of Leonardo heap root in array.
   * @param {number} size - Size of Leonardo heap in array.
   */
  * trickle (base, size) {
    if (size < 2) return

    const right = base - 1
    const left = right - SmoothSortArray.leonardo(size - 2)

    if ((yield * this.compare(base, right)) < 0 && (yield * this.compare(right, left)) > 0) {
      yield * this.swap(base, right)
      yield * this.trickle(right, size - 2)
    }

    if ((yield * this.compare(base, left)) < 0) {
      yield * this.swap(base, left)
      yield * this.trickle(left, size - 1)
    }
  }

  /**
   * @param {number[]} sizes - Array of Leonardo heap sizes implicit in array.
   */
  * rootSort (sizes) {
    let index = SmoothSortArray.leonardo(sizes[0]) - 1

    for (let i = 1; i < sizes.length; i++) {
      let j = i - 1
      let k = index

      index += SmoothSortArray.leonardo(sizes[i])

      let base = index
      let right = base - 1
      let left = right - SmoothSortArray.leonardo(sizes[i] - 2)

      while (j >= 0 && (yield * this.compare(k, base)) > 0) {
        if (sizes[j + 1] >= 2) {
          if ((yield * this.compare(k, right)) < 0) {
            break
          }

          if ((yield * this.compare(k, left)) < 0) {
            break
          }
        }

        yield * this.swap(k, base)
        yield * this.trickle(k, sizes[j])

        base = k
        right = base - 1
        left = right - SmoothSortArray.leonardo(sizes[j] - 2)
        k -= SmoothSortArray.leonardo(sizes[j])
        j--
      }
    }
  }
}
