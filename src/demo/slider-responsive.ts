import { ScrollSnapSlider } from 'scroll-snap-slider'

const sliderResponsiveElement = document.querySelector<HTMLElement>('.scroll-snap-slider.-responsive')
const sliderResponsive = new ScrollSnapSlider({ element: sliderResponsiveElement })

const arrows = document.querySelector('.indicators.-responsive')
const prev = document.querySelector('.indicators.-responsive .arrow.-prev')
const next = document.querySelector('.indicators.-responsive .arrow.-next')

const updateArrows = function () {
  arrows.classList.toggle('-hidden', sliderResponsiveElement.scrollWidth <= sliderResponsiveElement.clientWidth)
}

prev.addEventListener('click', function () {
  sliderResponsive.slideTo(sliderResponsive.slide - 1)
})

next.addEventListener('click', function () {
  sliderResponsive.slideTo(sliderResponsive.slide + 1)
})

window.addEventListener('resize', updateArrows)
updateArrows()
