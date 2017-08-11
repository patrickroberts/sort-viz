/**
 * Tournament sort array module.
 * @module sort/comparative/tournament
 * @requires module:sort/comparative.ComparativeSortArray
 */
import { ComparativeSortArray } from '../comparative'

/**
 * @private
 *
 * @extends module:sort/comparative.ComparativeSortArray
 */
class TournamentTree extends ComparativeSortArray {
  /**
   * Inherits externally implemented methods from sort array.
   * @param {module:sort/comparative.ComparativeSortArray} array
   *
   * @return {TournamentTree}
   */
  static from (array) {
    return new this(array.get('interrupt'), array.get('compare'))
  }

  /**
   * @param {module:sort/comparative.ComparativeSortArray} array
   *
   * @return {TournamentTree}
   */
  static * build (array) {
    const tree = this.from(array)

    tree.push(Array.from(array))

    while (tree.top.length > 1) {
      let size = Math.ceil(tree.top.length / 2)

      if (tree.top.length < size * 2) {
        tree.top.push(null)
      }

      tree.push(new Array(size))

      for (let index = 0; index < size; index++) {
        yield * tree.compete(tree.length - 1, index)
      }
    }

    return tree
  }

  /**
   * @return {Array}
   */
  get top () {
    return this[this.length - 1]
  }

  /**
   * @param {number} [bracket=this.length - 1]
   * @param {number} [index=this[bracket].length - 1]
   */
  * compete (bracket = this.length - 1, index = this[bracket].length - 1) {
    if (bracket === 0) {
      return
    }

    const next = this[bracket]
    const last = this[bracket - 1]

    let side

    if (last[index * 2 + 1] === null) {
      side = index * 2
    } else if (last[index * 2] === null) {
      side = index * 2 + 1
    } else if ((yield * this.compare(bracket, index)) <= 0) {
      side = index * 2
    } else {
      side = index * 2 + 1
    }

    next[index] = last[side]
    last[side] = null

    if (next[index] !== null) {
      yield * this.compete(bracket - 1, side)
    }
  }

  /**
   * @param {number} bracket
   * @param {number} index
   *
   * @return {number}
   */
  * compare (bracket, index) {
    const a = this[bracket - 1][index * 2]
    const b = this[bracket - 1][index * 2 + 1]
    const i = this.indexOf(a, bracket - 1)
    const j = this.indexOf(b, bracket - 1)

    return yield * super.compare(i, j, a, b)
  }

  /**
   * O(log n) lookup
   * @param {*} value
   * @param {number} bracket
   *
   * @return {number}
   */
  indexOf (value, bracket) {
    let index = 0

    for (let current = bracket; current >= 0; current--) {
      const next = this[current].indexOf(value, index * 2)

      // if unsuccessful lookup
      if (next < 0) {
        // bailout with approximation
        return this[current][index * 2 + 1] === null ? index * 2 : index * 2 + 1
      }

      index = next
    }

    return index
  }
}

/**
 * @see {@link https://en.wikipedia.org/wiki/Tournament_sort|Tournament Sort}
 *
 * @extends module:sort/comparative.ComparativeSortArray
 */
export class TournamentSortArray extends ComparativeSortArray {
  /** @override */
  * sort () {
    const tree = yield * TournamentTree.build(this)

    for (let index = 0; index < this.length; index++, yield * tree.compete()) {
      yield * this.put(index, tree.top[0])
    }
  }
}
