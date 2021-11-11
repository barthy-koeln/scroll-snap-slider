export class ScrollSnapAutoplay {
  constructor (intervalDuration = 3141) {
    this.intervalDuration = intervalDuration
    this.interval = null

    this.onInterval = this.onInterval.bind(this)
  }

  enable (slider) {
    this.slider = slider
    this.slides = this.slider.element.getElementsByClassName('scroll-snap-slide')
    this.interval = window.setInterval(this.onInterval, this.intervalDuration)
  }

  onInterval () {
    if (this.slider.plugins.has('ScrollSnapLoop')) {
      this.slider.slideTo(this.slider.slide + 1)
      return
    }

    const isLastSlide = this.slider.slide === this.slides.length - 1
    const target = isLastSlide ? 0 : this.slider.slide + 1

    this.slider.slideTo(target)
  }

  disable () {
    window.clearInterval(this.interval)
  }
}