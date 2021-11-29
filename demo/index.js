import { ScrollSnapSlider } from '../src/ScrollSnapSlider.js'
import { ScrollSnapAutoplay } from '../src/ScrollSnapAutoplay.js'
import { ScrollSnapLoop } from '../src/ScrollSnapLoop.js'
import { ScrollSnapDraggable } from '../src/ScrollSnapDraggable.js'

const sliderElement = document.querySelector('.example-slider')
const slides = sliderElement.getElementsByClassName('scroll-snap-slide')
const slider = new ScrollSnapSlider(sliderElement)

slider.roundingMethod = function (x) {
  const direction = x <= slider.slide ? -1 : 1

  if (direction < 0) {
    return Math.floor(x)
  }

  return Math.ceil(x)
}

/**
 * @param {Number} x the current slide position as a decimal (e.g. 1,5 = slide at index 1 has been slided by 50%)
 */
slider.roundingMethod = function (x) {
  // TODO return an integer that will be the the slider.slide
  return Math.round(x)
}

const autoplayPlugin = new ScrollSnapAutoplay()
const loopPlugin = new ScrollSnapLoop()
const draggablePlugin = new ScrollSnapDraggable(50)

/** BUTTONS & INDICATORS **/
const buttons = document.querySelectorAll('.example-indicator')
const prev = document.querySelector('.prev')
const next = document.querySelector('.next')

const setSelected = function (event) {
  const slideElementIndex = event.detail
  const slideElement = slides[slideElementIndex]
  const slideIndex = slideElement.dataset.index

  buttons[slideIndex].control.checked = true
}

for (const button of buttons) {
  button.addEventListener('click', function (event) {
    event.preventDefault()

    const slideElementIndex = Array.from(slides).findIndex(item => item.dataset.index === button.control.value)
    slider.slideTo(slideElementIndex)
  })
}

prev.addEventListener('click', function () {
  slider.slideTo(slider.slide - 1)
})

next.addEventListener('click', function () {
  slider.slideTo(slider.slide + 1)
})

slider.addEventListener('slide-pass', setSelected)
slider.addEventListener('slide-stop', setSelected)

/** AUTOPLAY & LOOP **/
const autoPlayInput = document.querySelector('#autoplay')
const loopInput = document.querySelector('#loop')
const draggableInput = document.querySelector('#draggable')

const enablePlugin = function (plugin) {
  plugin.enable(slider)
  slider.plugins.set(plugin.id, plugin)
}

const disablePlugin = function (plugin) {
  plugin.disable()
  slider.plugins.delete(plugin.id)
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
