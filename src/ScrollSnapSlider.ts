import { ScrollSnapPlugin } from './ScrollSnapPlugin'

/**
 * All options have sensitive defaults. The only required option is the <code>element</code>.
 */
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

  /**
   * @inheritDoc
   */
  public removeEventListener: HTMLElement['removeEventListener']

  /**
   * @inheritDoc
   */
  public addEventListener: HTMLElement['addEventListener']

  /**
   * Rounding method used to calculate the current slide (e.g. Math.floor, Math.round, Math.ceil, or totally custom.)
   *
   * @param value - factor indicating th current position (e.g "0" for first slide, "2.5" for third slide and a half)
   * @return f(x) - integer factor indicating the currently 'active' slide.
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
   * Computes a single number representing the slides widths.
   * By default, this will use the first slide's <code>offsetWidth</code>.
   * Possible values could be an average of all slides, the min or max values, ...
   *
   * @param slider current slider
   * @param entries resized entries
   * @return integer size of a slide in pixels
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

    this.scrollTimeoutId = null
    this.itemSize = this.sizingMethod(this)

    this.update()

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

  /**
   * Extend the Slider's functionality with Plugins
   *
   * @param plugins Plugins to attach
   * @param enabled Whether the plugins are enabled right away
   */
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
  public slideTo = (index: number) => {
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
   * Updates the computed values
   */
  update = () => {
    this.slide = this.calculateSlide()
    this.slideScrollLeft = this.slide * this.itemSize
  }

  /**
   * Calculates the active slide using the user-defined <code>roundingMethod</code>
   */
  private calculateSlide (): number {
    return this.roundingMethod(this.element.scrollLeft / this.itemSize)
  }

  /**
   * Calculate all necessary things and dispatch an event when sliding stops
   */
  private onScrollEnd = () => {
    this.scrollTimeoutId = null
    this.update()
    this.dispatch('slide-stop', this.slide)
  }

  /**
   * Callback on resize. This will recompute the <code>itemSize</code>
   * @param entries Entries that have changed size
   */
  private onSlideResize = (entries: ResizeObserverEntry[]) => {
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
  private onScroll = () => {
    if (null === this.scrollTimeoutId) {
      const direction = (this.element.scrollLeft > this.slideScrollLeft) ? 1 : -1
      this.dispatch('slide-start', this.slide + direction)
    }

    if (this.calculateSlide() !== this.slide) {
      this.update()
      this.dispatch('slide-pass', this.slide)
    }

    this.scrollTimeoutId && window.clearTimeout(this.scrollTimeoutId)
    this.scrollTimeoutId = window.setTimeout(this.onScrollEnd, this.scrollTimeout)
  }
}
