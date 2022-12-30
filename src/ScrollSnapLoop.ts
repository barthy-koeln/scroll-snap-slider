import { ScrollSnapPlugin } from './ScrollSnapPlugin.js'

export class ScrollSnapLoop extends ScrollSnapPlugin {
  element: any;
  slider: any;
  slides: any;
  constructor () {
    super()

    this.loopSlides = this.loopSlides.bind(this)
  }

  /**
   * @override
   * @param {ScrollSnapSlider} slider
   */
  enable (slider: any) {
    this.slider = slider
    this.element = this.slider.element
    this.slides = this.element.getElementsByClassName('scroll-snap-slide')
    this.slider.addEventListener('slide-pass', this.loopSlides)
    this.slider.addEventListener('slide-stop', this.loopSlides)
    this.loopSlides()
  }

  /**
   * @override
   */
  disable () {
    this.slider.removeEventListener('slide-pass', this.loopSlides)
    this.slider.removeEventListener('slide-stop', this.loopSlides)

    const sortedSlides = Array.prototype.slice
      .call(this.slides)
      .sort((a, b) => parseInt(a.dataset.index, 10) - parseInt(b.dataset.index, 10))

    Element.prototype.append.apply(this.element, sortedSlides)

    this.slider = null
    this.element = null
    this.slides = null
  }

  loopSlides () {
    this.slider.detachListeners()

    const { scrollLeft, offsetWidth, scrollWidth } = this.element
    if (scrollLeft < 5) {
      this.element.prepend(this.slides[this.slides.length - 1])
    } else if (scrollWidth - scrollLeft - offsetWidth < 5) {
      this.element.append(this.slides[0])
    }

    this.slider.attachListeners()
  }
}