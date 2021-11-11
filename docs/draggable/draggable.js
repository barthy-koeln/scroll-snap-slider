import { ScrollSnapSlider } from '../../src/ScrollSnapSlider.js'
import { ScrollSnapDraggable } from '../../src/ScrollSnapDraggable.js'

window.slider = new ScrollSnapSlider(document.querySelector('.example-slider'), true, [new ScrollSnapDraggable()])
