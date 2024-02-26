import {
  ScrollSnapAutoplay,
  ScrollSnapDraggable,
  ScrollSnapLoop,
  ScrollSnapSlider
} from '../dist/scroll-snap-slider.mjs'

const sliderSimpleElement = document.querySelector('.scroll-snap-slider.-simple')
const slides = sliderSimpleElement.getElementsByClassName('scroll-snap-slide')
const sliderSimple = new ScrollSnapSlider({ element: sliderSimpleElement })

const autoplayPlugin = new ScrollSnapAutoplay()
const loopPlugin = new ScrollSnapLoop()
const draggablePlugin = new ScrollSnapDraggable(50)

autoplayPlugin.slider = sliderSimple
loopPlugin.slider = sliderSimple
draggablePlugin.slider = sliderSimple

const buttons = document.querySelectorAll('.indicators.-simple .indicator')
const currentIndicator = document.querySelector('.indicators.-simple .current-indicator')
const prev = document.querySelector('.indicators.-simple .arrow.-prev')
const next = document.querySelector('.indicators.-simple .arrow.-next')

const setSelected = function (event) {
  const slideElementIndex = event.detail
  const slideElement = slides[slideElementIndex]

  for (const button of buttons) {
    const isActive = button.classList.toggle('-active', button.dataset.index === slideElement.dataset.index)
    if (isActive) {
      button.appendChild(currentIndicator)
    }
  }
}

for (const button of buttons) {
  button.addEventListener('click', function (event) {
    autoplayPlugin.disableTemporarily()
    event.preventDefault()

    const slideElementIndex = Array.prototype.slice
      .call(slides)
      .findIndex(item => item.dataset.index === button.dataset.index)

    sliderSimple.slideTo(slideElementIndex)
  })
}

prev.addEventListener('click', function () {
  autoplayPlugin.disableTemporarily()
  sliderSimple.slideTo(sliderSimple.slide - 1)
})

next.addEventListener('click', function () {
  autoplayPlugin.disableTemporarily()
  sliderSimple.slideTo(sliderSimple.slide + 1)
})

sliderSimple.addEventListener('slide-pass', setSelected)
sliderSimple.addEventListener('slide-stop', setSelected)

const autoPlayInput = document.querySelector('#autoplay')
const loopInput = document.querySelector('#loop')
const draggableInput = document.querySelector('#draggable')

autoPlayInput.addEventListener('change', () => togglePlugin(autoPlayInput, autoplayPlugin))
loopInput.addEventListener('change', () => togglePlugin(autoPlayInput, loopPlugin))
draggableInput.addEventListener('change', () => togglePlugin(autoPlayInput, draggablePlugin))

function enablePlugin (plugin) {
  plugin.enable()
  sliderSimple.plugins.set(plugin.id, plugin)
}

function disablePlugin (plugin) {
  plugin.disable()
  sliderSimple.plugins.delete(plugin.id)
}

function togglePlugin (input, plugin) {
  input.checked
    ? enablePlugin(plugin)
    : disablePlugin(plugin)
}
