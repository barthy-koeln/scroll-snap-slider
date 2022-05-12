import { ScrollSnapSlider } from '../src/ScrollSnapSlider.js'
import { ScrollSnapAutoplay } from '../src/ScrollSnapAutoplay.js'
import { ScrollSnapLoop } from '../src/ScrollSnapLoop.js'
import { ScrollSnapDraggable } from '../src/ScrollSnapDraggable.js'

const sliderSimpleElement = document.querySelector('.scroll-snap-slider.-simple')
const slides = sliderSimpleElement.getElementsByClassName('scroll-snap-slide')
const sliderSimple = new ScrollSnapSlider(sliderSimpleElement)

const autoplayPlugin = new ScrollSnapAutoplay()
const loopPlugin = new ScrollSnapLoop()
const draggablePlugin = new ScrollSnapDraggable(50)

const buttons = document.querySelectorAll('.indicators.-simple .indicator')
const prev = document.querySelector('.indicators.-simple .arrow.-prev')
const next = document.querySelector('.indicators.-simple .arrow.-next')

const setSelected = function (event) {
  const slideElementIndex = event.detail
  const slideElement = slides[slideElementIndex]
  const slideIndex = slideElement.dataset.index

  buttons[slideIndex].control.checked = true
}

for (const button of buttons) {
  button.addEventListener('click', function (event) {
    event.preventDefault()

    const slideElementIndex = Array.prototype.slice
      .call(slides)
      .findIndex(item => item.dataset.index === button.control.value)

    sliderSimple.slideTo(slideElementIndex)
  })
}

prev.addEventListener('click', function () {
  sliderSimple.slideTo(sliderSimple.slide - 1)
})

next.addEventListener('click', function () {
  sliderSimple.slideTo(sliderSimple.slide + 1)
})

sliderSimple.addEventListener('slide-pass', setSelected)
sliderSimple.addEventListener('slide-stop', setSelected)

/** AUTOPLAY & LOOP **/
const autoPlayInput = document.querySelector('#autoplay')
const loopInput = document.querySelector('#loop')
const draggableInput = document.querySelector('#draggable')

const enablePlugin = function (plugin) {
  plugin.enable(sliderSimple)
  sliderSimple.plugins.set(plugin.id, plugin)
}

const disablePlugin = function (plugin) {
  plugin.disable()
  sliderSimple.plugins.delete(plugin.id)
}

autoPlayInput.addEventListener('change', function () {
  autoPlayInput.checked ? enablePlugin(autoplayPlugin) : disablePlugin(autoplayPlugin)
})

loopInput.addEventListener('change', function () {
  if (loopInput.disabled) {
    return
  }

  loopInput.checked ? enablePlugin(loopPlugin) : disablePlugin(loopPlugin)
})

draggableInput.addEventListener('change', function () {
  loopInput.toggleAttribute('disabled', draggableInput.checked)

  if (draggableInput.checked) {
    enablePlugin(draggablePlugin)

    if (loopInput.checked) {
      disablePlugin(loopPlugin)
    }

    return
  }

  if (loopInput.checked) {
    enablePlugin(loopPlugin)
  }

  disablePlugin(draggablePlugin)
})