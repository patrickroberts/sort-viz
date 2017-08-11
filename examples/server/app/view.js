export const { document, jQuery: $ } = global

export const $algorithm = $('#algorithm')
export const $criteria = $('#criteria')
export const $order = $('#order')
export const $interval = $('#interval')
export const $history = $('#history')
export const $size = $('#size')

export const $toggle = $('#toggle')
export const $step = $('#step')
export const $shuffle = $('#shuffle')
export const $reset = $('#reset')

export const $ops = { compare: $('#compares'), swap: $('#swaps'), put: $('#puts'), key: $('#keys') }

export const $container = $('#container')
export const $steps = $('#steps')

export const container = $container.get(0)

export function play () {
  $toggle
    .children()
    .each((index, element) => {
      if (index === 0) {
        $(element).find('i')
          .addClass('fa-stop')
          .removeClass('fa-play')
      } else {
        $(element).text('Pause')
      }
    })
}

export function stop () {
  $toggle.removeClass('is-loading')
    .children()
    .removeAttr('style')
    .each((index, element) => {
      if (index === 0) {
        $(element).find('i')
          .addClass('fa-play')
          .removeClass('fa-stop')
      } else {
        $(element).text('Play')
      }
    })
}

function replaceNode ([index, value]) {
  const nodes = container.children
  const length = nodes.length

  if (index < length) {
    container.replaceChild(value.node(), nodes[index])
  } else if (index === length) {
    container.appendChild(value.node())
  } else {
    console.warn(`index ${index} exceeds array length ${length}`)
  }
}

export function reset () {
  Object.values($ops).forEach($counter => $counter.text(0))
}

function increment (type) {
  const $counter = $ops[type]
  const value = Number($counter.text())

  $counter.text(value + 1)
}

export function handleControllerEvent ({ type, entries }, isSorting) {
  switch (type) {
    case 'swap':
    case 'put':
      entries.forEach(replaceNode)
      break
    case 'compare':
    case 'key':
      break
    default:
      console.warn(`unhandled event type ${type}`)
      return
  }

  if (isSorting) {
    increment(type)
  }
}
