import { ScrollSnapSlider } from '../src/ScrollSnapSlider.js'
import { ScrollSnapAutoplay } from '../src/ScrollSnapAutoplay.js'

const sliderElement = document.querySelector('.example-slider')
const slides = sliderElement.getElementsByClassName('scroll-snap-slide')
const slider = new ScrollSnapSlider(sliderElement)

const autoplayPlugin = new ScrollSnapAutoplay()

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

const loopSlides = function () {
  const lastIndex = slides.length - 1

  if (slider.slide === 0) {
    sliderElement.prepend(slides[lastIndex])
    return
  }

  if (slider.slide === lastIndex) {
    sliderElement.append(slides[0])
  }
}

const enableLoop = function () {
  slider.addEventListener('slide-stop', loopSlides)
  loopSlides()
}

const disableLoop = function () {
  slider.removeEventListener('slide-stop', loopSlides)
}

autoPlayInput.addEventListener('change', function () {
  autoPlayInput.checked ? autoplayPlugin.enable(slider) : autoplayPlugin.disable()
})

loopInput.addEventListener('change', function () {
  loopInput.checked ? enableLoop() : disableLoop()
})
