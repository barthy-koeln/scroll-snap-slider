import { ScrollSnapPlugin } from './ScrollSnapPlugin'

export type ScrollSnapSliderOptions = Partial<ScrollSnapSlider> & {
  element: HTMLElement
}

/**
 * @classdesc Mostly CSS slider with great performance.
 */
export class ScrollSnapSlider {
  /**
   * Base element of this slider
   */
  public element: HTMLElement

  /**
   * additional behaviour
   */
  public plugins: Map<string, ScrollSnapPlugin>

  public removeEventListener: HTMLElement['removeEventListener']

  public addEventListener: HTMLElement['addEventListener']

  /**
   * Rounding method used to calculate the current slide (e.g. Math.floor, Math.round, Math.ceil, or totally custom.)
   *
   * @param {number} value - factor indicating th current position (e.g "0" for first slide, "2.5" for third slide and a half)
   * @return {number} f(x) - integer factor indicating the currently 'active' slide.
   */
  public roundingMethod: (value: number) => number

  /**
   * Timeout delay in milliseconds used to catch the end of scroll events
   */
  public scrollTimeout: number

  /**
   * Calculated size of a single item
   */
  public itemSize: number

  /**
   * Gets the width of each child, assuming all children have the same size
   *
   * @param {ScrollSnapSlider} slider - current slider
   * @return {number} integer size of a slide in pixels
   */
  public sizingMethod: (slider: ScrollSnapSlider, entries?: ResizeObserverEntry[] | undefined) => number

  /**
   * Active slide
   */
  public slide: number

  /**
   * Resize observer used to update item size
   */
  private resizeObserver: ResizeObserver
  /**
   * Timeout ID used to catch the end of scroll events
   */
  private scrollTimeoutId: null | number

  /**
   * Active slide's scrollLeft in the containing element
   */
  private slideScrollLeft: number

  /**
   * Bind methods and possibly attach listeners.
   */
  constructor (options: ScrollSnapSliderOptions) {
    Object.assign(this, {
      scrollTimeout: 100,
      roundingMethod: Math.round,
      sizingMethod: (slider: ScrollSnapSlider) => (slider.element.firstElementChild as HTMLElement).offsetWidth,
      ...options
    })

    this.slideScrollLeft = this.element.scrollLeft
    this.scrollTimeoutId = null

    this.itemSize = this.sizingMethod(this)
    this.slide = this.calculateSlide()

    this.onScroll = this.onScroll.bind(this)
    this.onScrollEnd = this.onScrollEnd.bind(this)
    this.slideTo = this.slideTo.bind(this)
    this.onSlideResize = this.onSlideResize.bind(this)

    this.addEventListener = this.element.addEventListener.bind(this.element)
    this.removeEventListener = this.element.removeEventListener.bind(this.element)
    this.plugins = new window.Map()
    this.resizeObserver = new ResizeObserver(this.onSlideResize)
    this.resizeObserver.observe(this.element)
    for (const child of this.element.children) {
      this.resizeObserver.observe(child)
    }

    this.attachListeners()
  }

  public with (plugins: ScrollSnapPlugin[], enabled = true): ScrollSnapSlider {
    for (const plugin of plugins) {
      plugin.slider = this
      this.plugins.set(plugin.id, plugin)
      enabled && plugin.enable()
    }

    return this
  }

  /**
   * Attach all necessary listeners
   */
  public attachListeners (): void {
    this.addEventListener('scroll', this.onScroll, { passive: true })
  }

  /**
   * Detach all listeners
   */
  public detachListeners (): void {
    this.removeEventListener('scroll', this.onScroll)
    this.scrollTimeoutId && window.clearTimeout(this.scrollTimeoutId)
  }

  /**
   * Scroll to a slide by index.
   */
  public slideTo (index: number): void {
    this.element.scrollTo({
      left: index * this.itemSize
    })
  }

  /**
   * Free resources and listeners, disable plugins
   */
  public destroy (): void {
    this.scrollTimeoutId && window.clearTimeout(this.scrollTimeoutId)
    this.detachListeners()

    for (const [id, plugin] of this.plugins) {
      plugin.disable()
      plugin.slider = null
      this.plugins.delete(id)
    }
  }

  /**
   * Calculates the active slide.
   * The scroll-snap-type property makes sure that the container snaps perfectly to integer multiples.
   */
  calculateSlide (): number {
    return this.roundingMethod(this.element.scrollLeft / this.itemSize)
  }

  /**
   * Calculate all necessary things and dispatch an event when sliding stops
   */
  private onScrollEnd (): void {
    this.scrollTimeoutId = null
    this.slide = this.calculateSlide()
    this.slideScrollLeft = this.element.scrollLeft
    this.dispatch('slide-stop', this.slide)
  }

  private onSlideResize (entries: ResizeObserverEntry[]) {
    this.itemSize = this.sizingMethod(this, entries)
  }

  /**
   * Dispatches an event on the slider's element
   */
  private dispatch (event: string, detail: unknown): boolean {
    return this.element.dispatchEvent(
      new window.CustomEvent(event, {
        detail
      })
    )
  }

  /**
   * Act when scrolling starts and stops
   */
  private onScroll (): void {
    if (null === this.scrollTimeoutId) {
      const direction = (this.element.scrollLeft > this.slideScrollLeft) ? 1 : -1
      this.dispatch('slide-start', this.slide + direction)
    }

    const floored = this.calculateSlide()
    if (floored !== this.slide) {
      this.slideScrollLeft = this.element.scrollLeft
      this.slide = floored
      this.dispatch('slide-pass', this.slide)
    }

    this.scrollTimeoutId && window.clearTimeout(this.scrollTimeoutId)
    this.scrollTimeoutId = window.setTimeout(this.onScrollEnd, this.scrollTimeout)
  }
}
