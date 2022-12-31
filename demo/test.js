import { ScrollSnapSlider } from '../build/ScrollSnapSlider.js'
import { ScrollSnapAutoplay } from '../build/ScrollSnapAutoplay.js'
import { ScrollSnapLoop } from '../build/ScrollSnapLoop.js'

const sliderSimpleElement = document.querySelector('.scroll-snap-slider.-simple')
const sliderSimple = new ScrollSnapSlider({ element: sliderSimpleElement })
  .with([
    new ScrollSnapAutoplay(),
    new ScrollSnapLoop()
  ])

window.slider = sliderSimple