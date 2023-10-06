import { ScrollSnapPlugin } from './ScrollSnapPlugin.js'

/**
 * @classdesc Plugin that automatically changes slides.
 */
export class ScrollSnapAutoplay extends ScrollSnapPlugin {
  /**
   * Duration in milliseconds between slide changes
   */
  public intervalDuration: number

  /**
   * Duration in milliseconds after human interaction where the slider will not autoplay
   */
  public timeoutDuration: number

  /**
   * Used to debounce the re-enabling after a user interaction
   */
  private debounceId: number | null

  /**
   * Interval ID
   */
  private interval: number | null

  /**
   * Event names that temporarily disable the autoplay behaviour
   */
  private readonly events: string[]

  public constructor(intervalDuration = 3141, timeoutDuration = 6282, events: string[] = ['touchmove', 'wheel']) {
    super()

    this.intervalDuration = intervalDuration
    this.timeoutDuration = timeoutDuration
    this.interval = null
    this.events = events
  }

  /**
   * @inheritDoc
   */
  public get id(): string {
    return 'ScrollSnapAutoplay'
  }

  /**
   * @inheritDoc
   * @override
   */
  public enable = () => {
    this.debounceId && clearTimeout(this.debounceId)
    this.debounceId = null
    this.interval = setInterval(this.onInterval, this.intervalDuration)

    for (const event of this.events) {
      this.slider.addEventListener(event, this.disableTemporarily, { passive: true })
    }
  }

  /**
   * @inheritDoc
   * @override
   */
  public disable(): void {
    for (const event of this.events) {
      this.slider.removeEventListener(event, this.disableTemporarily)
    }

    this.interval && clearInterval(this.interval)
    this.interval = null
    this.debounceId && clearTimeout(this.debounceId)
    this.debounceId = null
  }

  /**
   * Disable the autoplay behaviour and set a timeout to re-enable it.
   */
  public disableTemporarily = () => {
    if (!this.interval) {
      return
    }

    clearInterval(this.interval)
    this.interval = null

    this.debounceId && clearTimeout(this.debounceId)
    this.debounceId = setTimeout(this.enable, this.timeoutDuration)
  }

  /**
   * Callback for regular intervals to continue to the next slide
   */
  public onInterval = () => {
    if (this.slider.plugins.has('ScrollSnapLoop')) {
      this.slider.slideTo(this.slider.slide + 1)
      return
    }

    requestAnimationFrame(() => {
      const { scrollLeft, offsetWidth, scrollWidth } = this.slider.element
      const isLastSlide = scrollLeft + offsetWidth === scrollWidth
      const target = isLastSlide ? 0 : this.slider.slide + 1

      this.slider.slideTo(target)
    })
  }
}
