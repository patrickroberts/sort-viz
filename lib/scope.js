/**
 * Scope array module.
 * @module sort/scope
 */

/**
 * @private
 */
const scope = new WeakMap()

/**
 * Interface for classes with weakly referenced scoped variables.
 * @memberOf module:sort/virtual
 *
 * @interface Scope
 */

/**
 * @method
 *
 * @name module:sort/virtual.Scope#has
 *
 * @param {*} key - Reference key of scoped variable.
 *
 * @return {boolean} exists - Instance contains a scoped variable for the given key.
 */

/**
 * @method
 *
 * @name module:sort/virtual.Scope#delete
 *
 * @param {*} key - Reference key of scoped variable.
 *
 * @return {boolean} successful - Is `true` if removed, `false` if element does not exist.
 */

/**
 * @method
 *
 * @name module:sort/virtual.Scope#get
 *
 * @param {*} key - Reference key of scoped variable.
 *
 * @return {*} value - Scoped variable for the given key or `undefined` if none exists.
 */

/**
 * @method
 *
 * @name module:sort/virtual.Scope#set
 *
 * @param {*} key - Reference key of scoped variable.
 * @param {*} value - Value of scoped variable to set.
 *
 * @return {this}
 */

/**
 * Array that implements Scope for weakly referenced scoped instance variables.
 * @extends Array
 *
 * @implements module:sort/virtual.Scope
 */
export class ScopeArray extends Array {
  constructor () {
    super(...arguments)
    scope.set(this, new Map())
  }

  /**
   * Shallow copy a portion of an array into a new array object.
   * @param {number} [begin=0] - First index of shallow copy.
   * @param {number} [end=this.length] - Last index of shallow copy, not included.
   *
   * @return {Array}
   */
  slice (begin = 0, end = this.length) {
    const copy = new this.constructor()
    const from = begin < 0 ? begin + this.length : begin
    const to = end < 0 ? end + this.length : end

    scope.set(copy, new Map(scope.get(this)))

    for (let index = from; index < to; index++) {
      copy[copy.length] = this[index]
    }

    return copy
  }

  has (key) {
    return scope.get(this).has(key)
  }

  delete (key) {
    return scope.get(this).delete(key)
  }

  get (key) {
    return scope.get(this).get(key)
  }

  set (key, value) {
    scope.get(this).set(key, value)

    return this
  }
}
