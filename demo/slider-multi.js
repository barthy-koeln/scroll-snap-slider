import { ScrollSnapSlider } from '../dist/ScrollSnapSlider.js'

const sliderMultiElement = document.querySelector('.scroll-snap-slider.-multi')
const sliderMulti = new ScrollSnapSlider({ element: sliderMultiElement })

const prev = document.querySelector('.indicators.-multi .arrow.-prev')
const next = document.querySelector('.indicators.-multi .arrow.-next')

const updateArrows = function () {
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

sliderMulti.addEventListener('slide-pass', updateArrows)
sliderMulti.addEventListener('slide-stop', updateArrows)

sliderMulti.slideTo(2)
