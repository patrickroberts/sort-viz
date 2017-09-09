import * as view from './view'
import SortHistory from './history'
import Node from './node'

const { setTimeout, clearTimeout, sort } = global

export default class SortController {
  static get SelectedSortArray () {
    return sort[view.$algorithm.val() + 'SortArray']
  }

  static get selectedCompare () {
    const key = view.$criteria.val()
    const order = view.$order.val()

    const reverse = key === 'top' || key === 'bottom' || key === 'center'

    if ((order === 'ascending' && !reverse) || (order === 'descending' && reverse)) {
      return (a, b) => a[key] - b[key]
    } else {
      return (a, b) => b[key] - a[key]
    }
  }

  static get selectedKey () {
    const key = view.$criteria.val()
    const max = Number(view.$criteria.find(':selected').data('max'))
    const order = view.$order.val()

    const reverse = key === 'top' || key === 'bottom' || key === 'center'

    if ((order === 'ascending' && !reverse) || (order === 'descending' && reverse)) {
      return o => Math.floor(65536 * o[key] / max)
    } else {
      return o => Math.floor(65536 * (1 - o[key] / max))
    }
  }

  static get selectedEntry () {
    const isKeyed = Boolean(view.$algorithm.find(':selected').data('keyed'))
    const name = isKeyed ? 'Key' : 'Compare'

    return [name.toLowerCase(), SortController[`selected${name}`]]
  }

  static createInterrupt (controller) {
    return function interrupt (event = null) {
      if (event !== null) {
        view.handleControllerEvent(event, this.isSorting)

        if (this.isSorting) {
          this.history.push(event)
        }
      }

      if (this.isPlaying) {
        this.timeout = setTimeout(
          () => this.step(),
          this.isSorting ? this.interval : 0
        )
      }
    }.bind(controller)
  }

  constructor () {
    this.isPlaying = false
    this.isSorting = false
    this.interval = Number(view.$interval.val())
    this.history = new SortHistory(view.$history.val())
    this.timeout = null
    this.iterator = null
    this.array = new SortController.SelectedSortArray(
      SortController.createInterrupt(this),
      SortController.selectedEntry.pop()
    )
  }

  sort () {
    if (this.iterator === null) {
      this.iterator = this.array.sort()
      this.isSorting = true
    }
  }

  fill () {
    const length = Number(view.$size.val())

    if (length === this.array.length) {
      return
    }

    view.$container.empty()

    this.update(view.$history)
    this.iterator = this.array.fill(Node.factory(), length)
    this.isSorting = false
    this.busy()
    this.toggle(true)
  }

  shuffle () {
    this.update(view.$history)
    this.iterator = this.array.shuffle()
    this.isSorting = false
    this.busy()
    this.toggle(true)
  }

  stop () {
    view.stop()
    this.done()

    clearTimeout(this.timeout)

    this.isPlaying = false
    this.isSorting = false
    this.timeout = null
    this.iterator = null
  }

  play () {
    view.play()
    this.step()
  }

  pause () {
    view.stop()
  }

  toggle (force) {
    this.isPlaying = typeof force === 'boolean' ? force : !this.isPlaying

    clearTimeout(this.timeout)
    this.timeout = null

    if (this.isPlaying) {
      this.play()
    } else {
      this.pause()
    }
  }

  step () {
    this.sort()

    clearTimeout(this.timeout)

    const { done } = this.iterator.next()

    if (done) {
      this.stop()
    }
  }

  reset () {
    view.reset()
    this.stop()
    this.update(view.$history)
  }

  busy () {
    view.$('select[id],input.input').attr('disabled', true)

    view.$toggle.addClass('is-loading')
      .children()
      .css('visibility', 'hidden')
    view.$step.addClass('is-static')
    view.$shuffle.addClass('is-static')
    view.$reset.addClass('is-static')
  }

  done () {
    view.$('select[id],input.input').removeAttr('disabled')

    view.$toggle.removeClass('is-loading')
      .children()
      .removeAttr('style')
    view.$step.removeClass('is-static')
    view.$shuffle.removeClass('is-static')
    view.$reset.removeClass('is-static')
  }

  update ($setting) {
    const id = $setting.attr('id')

    switch (id) {
      case 'algorithm':
        const array = this.array
        this.array = new SortController.SelectedSortArray(
          array.get('interrupt'),
          SortController.selectedEntry.pop()
        )

        for (const [index, value] of array.entries()) {
          this.array[index] = value
        }
        break
      case 'criteria':
      case 'order':
        this.array.set(...SortController.selectedEntry)
        break
      case 'history':
        this.history = new SortHistory(Number($setting.val()))
        break
      case 'interval':
        this[id] = Number($setting.val())
    }
  }
}
