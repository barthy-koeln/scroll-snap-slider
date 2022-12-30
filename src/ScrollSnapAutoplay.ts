import { ScrollSnapPlugin } from './ScrollSnapPlugin.js'

export class ScrollSnapAutoplay extends ScrollSnapPlugin {
  interval: any;
  intervalDuration: any;
  slider: any;
  slides: any;
  constructor (intervalDuration = 3141) {
    super()

    /**
     * Duration in milliseconds between slide changes
     * @type {Number}
     */
    this.intervalDuration = intervalDuration

    /**
     * Interval ID
     * @type {?Number}
     */
    this.interval = null

    this.onInterval = this.onInterval.bind(this)
  }

  /**
   * @override
   * @param {ScrollSnapSlider} slider
   */
  enable (slider: any) {
    if (this.slider) {
      return
    }

    this.slider = slider
    this.slides = this.slider.element.getElementsByClassName('scroll-snap-slide')
    this.interval = window.setInterval(this.onInterval, this.intervalDuration)
  }

  /**
   * @override
   */
  disable () {
    window.clearInterval(this.interval)

    this.slider = null
    this.slides = null
    this.interval = null
  }

  onInterval () {
    if (this.slider.plugins.has('ScrollSnapLoop')) {
      this.slider.slideTo(this.slider.slide + 1)
      return
    }

    const { scrollLeft, offsetWidth, scrollWidth } = this.slider.element
    const isLastSlide = scrollLeft + offsetWidth === scrollWidth
    const target = isLastSlide ? 0 : this.slider.slide + 1

    this.slider.slideTo(target)
  }
}