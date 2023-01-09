import { ScrollSnapPlugin } from './ScrollSnapPlugin.js'
import type { ScrollSnapSlider } from './ScrollSnapSlider'

export class ScrollSnapAutoplay extends ScrollSnapPlugin {
  /**
   * Duration in milliseconds between slide changes
   */
  public intervalDuration: number

  /**
   * Duration in milliseconds after human interaction where the slider will not autoplay
   */
  public timeoutDuration: number

  private originalSlideTo: ScrollSnapSlider['slideTo']

  private debounceId: number | null

  /**
   * Interval ID
   */
  private interval: number | null

  public constructor (intervalDuration = 3141, timeoutDuration = 6282) {
    super()

    this.intervalDuration = intervalDuration
    this.timeoutDuration = timeoutDuration
    this.interval = null

    this.onInterval = this.onInterval.bind(this)
    this.disableTemporarily = this.disableTemporarily.bind(this)
    this.enable = this.enable.bind(this)
  }

  public get id (): string {
    return 'ScrollSnapAutoplay'
  }

  /**
   * @override
   */
  public enable (): void {
    this.debounceId && window.clearTimeout(this.debounceId)
    this.debounceId = null
    this.interval = window.setInterval(this.onInterval, this.intervalDuration)
    this.slider.addEventListener('touchstart', this.disableTemporarily, { passive: true })
    this.slider.addEventListener('wheel', this.disableTemporarily, { passive: true })
  }

  /**
   * @override
   */
  public disable (): void {
    this.slider.removeEventListener('touchstart', this.disableTemporarily)
    this.slider.removeEventListener('wheel', this.disableTemporarily)
    this.interval && window.clearInterval(this.interval)
    this.interval = null
    this.debounceId && window.clearTimeout(this.debounceId)
    this.debounceId = null
  }

  public disableTemporarily (): void {
    if (!this.interval) {
      return
    }

    window.clearInterval(this.interval)
    this.interval = null

    this.debounceId && window.clearTimeout(this.debounceId)
    this.debounceId = window.setTimeout(this.enable, this.timeoutDuration)
  }

  public onInterval (): void {
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