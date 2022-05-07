import { ScrollSnapSlider } from '../src/ScrollSnapSlider.js'

const sliderElement = document.querySelector('.example-slider')
const slides = sliderElement.getElementsByClassName('scroll-snap-slide')
const slider = new ScrollSnapSlider(sliderElement)

const prev = document.querySelector('.prev')
const next = document.querySelector('.next')

const setSelected = function (event) {
  const slideElementIndex = event.detail
  const slideElement = slides[slideElementIndex]

  const targetedScrollLeft = slideElementIndex * slideElement.offsetWidth
  const maximumScrollLeft = sliderElement.scrollWidth - sliderElement.offsetWidth

  prev.classList.toggle('-disabled', slideElementIndex === 0)
  next.classList.toggle('-disabled', targetedScrollLeft > maximumScrollLeft)
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