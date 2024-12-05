import { ScrollSnapPlugin } from './ScrollSnapPlugin.js'
import { Timer } from './utils';

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
   * Timer instance to handle the interval
   * @private
   */
  private timer: Timer

  /**
   * Event names that temporarily disable the autoplay behaviour
   */
  private readonly events: string[]

  public constructor(intervalDuration = 3141, timeoutDuration = 6282, events: string[] = ['touchmove', 'wheel']) {
    super()

    this.intervalDuration = intervalDuration
    this.timeoutDuration = timeoutDuration
    this.events = events
    this.timer = new Timer(this.onInterval, this.intervalDuration);
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
    this.timer.start();

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

    this.timer.stop();
    this.debounceId && clearTimeout(this.debounceId)
    this.debounceId = null
  }

  /**
   * Disable the autoplay behaviour and set a timeout to re-enable it.
   */
  public disableTemporarily = () => {
    this.timer.stop()
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

  /**
   * Restart the interval
   */
  public restartInterval() {
    this.timer.reset();
    this.timer.start();
  }
}
