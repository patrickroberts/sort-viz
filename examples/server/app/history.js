import * as view from './view'

const { getComputedStyle, jQuery: $, sort } = global
const { ScopeArray } = sort

const colors = Object.entries(view.$ops).reduce((colors, [key, $element]) => {
  colors[key] = getComputedStyle($element.prev().get(0)).color

  return colors
}, {})

class Step {
  constructor ({ type, entries }) {
    console.log(type)

    this.color = colors[type]
    this.rects = entries.map(([index]) => {
      const offset = view.container.children[index].getBoundingClientRect()
      const parent = view.container.getBoundingClientRect()
      const { left: offsetLeft, width: offsetWidth } = offset
      const { left: parentLeft, width: parentWidth } = parent

      return {
        left: (offsetLeft - parentLeft) * 100 / parentWidth,
        width: offsetWidth * 100 / parentWidth
      }
    })
  }

  fragment () {
    return this.rects.reduce((fragment, rect) => {
      const child = document.createElement('div')

      child.classList.add('column')
      child.style.backgroundColor = this.color
      child.style.left = `${rect.left + rect.width / 5}%`
      child.style.width = `${rect.width * 3 / 5}%`

      fragment.appendChild(child)

      return fragment
    }, view.document.createDocumentFragment())
  }
}

export default class SortHistory extends ScopeArray {
  constructor (steps) {
    view.$steps.empty()

    super()

    this.set('steps', steps)
  }

  push (event) {
    const limit = this.get('steps')
    const step = new Step(event)

    super.push(step)

    view.$steps.append(step.fragment())

    while (this.length > limit) {
      const { rects: { length } } = this.shift()
      view.$steps.find(`:lt(${length})`).remove()
    }
  }
}
