const { document } = global

function rgb2hsl (r, g, b) {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h
  let s
  const l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    var d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  return [h, s, l]
}

export default class Node {
  static factory (granularity = Number.MAX_SAFE_INTEGER) {
    function random (range = 1) {
      const x = Math.floor(Math.random() * granularity) / granularity

      return x * range
    }

    return function create () {
      const top = this(100)
      const bottom = this(100)

      const red = this(256)
      const green = this(256)
      const blue = this(256)

      const [hue, saturation, lightness] = rgb2hsl(red, green, blue)

      return new Node({ top, bottom, red, green, blue, hue, saturation, lightness })
    }.bind(random)
  }

  constructor (properties) {
    const { top, bottom } = properties

    Object.assign(this, properties)

    this.top = Math.min(top, bottom)
    this.bottom = Math.max(top, bottom)

    this.height = this.bottom - this.top
    this.center = this.bottom + this.top

    this.luminance = 2126 * this.red + 7152 * this.green + 722 * this.blue
  }

  node () {
    const element = document.createElement('div')
    const color = `rgb(${Math.floor(this.red)},${Math.floor(this.green)},${Math.floor(this.blue)})`

    element.classList.add('column')
    element.style.backgroundColor = color
    element.style.borderColor = color
    element.style.top = `${this.top}%`
    element.style.height = `${this.height}%`

    return element
  }
}
