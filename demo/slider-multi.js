import { ScrollSnapSlider } from '../src/ScrollSnapSlider.js'

const sliderMultiElement = document.querySelector('.scroll-snap-slider.-multi')
const sliderMulti = new ScrollSnapSlider(sliderMultiElement)

const prev = document.querySelector('.indicators.-multi .arrow.-prev')
const next = document.querySelector('.indicators.-multi .arrow.-next')

const setSelected = function () {
  prev.classList.toggle('-disabled', sliderMultiElement.scrollLeft === 0)
  next.classList.toggle(
    '-disabled',
    sliderMultiElement.scrollLeft + sliderMultiElement.offsetWidth === sliderMultiElement.scrollWidth
  )
}

prev.addEventListener('click', function () {
  sliderMulti.slideTo(sliderMulti.slide - 1)
})

next.addEventListener('click', function () {
  sliderMulti.slideTo(sliderMulti.slide + 1)
})

sliderMulti.addEventListener('slide-pass', setSelected)
sliderMulti.addEventListener('slide-stop', setSelected)

sliderMulti.slideTo(2)