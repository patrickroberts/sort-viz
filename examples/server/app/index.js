import * as view from './view'
import Controller from './controller'

const { document, $ } = view

$('select').each(function () {
  const $options = $(this).find('option')

  $options
    .eq(Math.floor(Math.random() * $options.length))
    .prop('selected', true)
})

function refill () {
  view.$size.val(view.$algorithm.find(':selected').data('size'))
  controller.fill()
}

const controller = new Controller()

view.$toggle.click(() => controller.toggle())
view.$step.click(() => controller.step())
view.$shuffle.click(() => controller.shuffle())
view.$reset.click(() => controller.reset())

$(document).change((event) => {
  controller.update($(event.target))

  if (event.target === view.$algorithm.get(0)) {
    refill()
  }
})

view.$size.blur(() => controller.fill())

refill()
