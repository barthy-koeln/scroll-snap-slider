import { ScrollSnapSlider } from '../src/ScrollSnapSlider.js'

const sliderElement = document.querySelector('.example-slider')
const slider = new ScrollSnapSlider(sliderElement)

const prev = document.querySelector('.prev')
const next = document.querySelector('.next')

const setSelected = function () {
  prev.classList.toggle('-disabled', sliderElement.scrollLeft === 0)
  next.classList.toggle('-disabled', sliderElement.scrollLeft + sliderElement.offsetWidth === sliderElement.scrollWidth)
}

prev.addEventListener('click', function () {
  slider.slideTo(slider.slide - 1)
})

next.addEventListener('click', function () {
  slider.slideTo(slider.slide + 1)
})

slider.addEventListener('slide-pass', setSelected)
slider.addEventListener('slide-stop', setSelected)

slider.slideTo(2)

window.slider = slider