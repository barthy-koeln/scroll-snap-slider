/**
 * @classdesc Mostly CSS slider with great performance.
 */
export class ScrollSnapSlider {
  /**
   * Bind methods and possibly attach listeners.
   * @param {Element|HTMLElement} element - element to attach listeners and dispatch events
   * @param {Boolean} enabled - attach listeners and enable plugins now. If this is false, you will have to call slider.attachListener() once and plugin.enable() for each plugin later.
   * @param {ScrollSnapPlugin[]} plugins - additional behaviour
   */
  constructor (element, enabled = true, plugins = []) {
    /**
     * Base element of this slider
     * @name ScrollSnapSlider#element
     * @type {Element|HTMLElement}
     * @readonly
     * @public
     */
    this.element = element

    /**
     * Active slide's scrollLeft in the containing element
     * @name ScrollSnapSlider#slideScrollLeft
     * @type {Number}
     * @private
     */
    this.slideScrollLeft = this.element.scrollLeft

    /**
     * Timeout ID used to catch the end of scroll events
     * @name ScrollSnapSlider#scrollTimeoutId
     * @type {?Number}
     * @private
     */
    this.scrollTimeoutId = null

    /**
     * @callback roundingMethod
     * @param {Number} x - factor indicating th current position (e.g "0" for first slide, "2.5" for third slide and a half)
     * @return {Number} f(x) - integer factor indicating the currently 'active' slide.
     */

    /**
     * Rounding method used to calculate the current slide (e.g. Math.floor, Math.round, Math.ceil, or totally custom.)
     * @name ScrollSnapSlider#roundingMethod
     * @type {roundingMethod}
     * @public
     */
    this.roundingMethod = Math.round

    /**
     * Active slide
     * @name ScrollSnapSlider#slide
     * @type {?Number}
     * @public
     */
    this.slide = this.calculateSlide()

    /**
     * Timeout delay in milliseconds used to catch the end of scroll events
     * @name ScrollSnapSlider#scrollTimeout
     * @type {?Number}
     * @public
     */
    this.scrollTimeout = 100

    /**
     * Options for the scroll listener (passive by default, may be overwritten for compatibility or other reasons)
     * @name ScrollSnapSlider#listenerOptions
     * @type {AddEventListenerOptions}
     * @public
     */
    this.listenerOptions = {
      passive: true
    }

    this.onScroll = this.onScroll.bind(this)
    this.onScrollEnd = this.onScrollEnd.bind(this)
    this.slideTo = this.slideTo.bind(this)

    /**
     * Adds event listener to the element
     * @name ScrollSnapSlider#addEventListener
     * @method
     * @public
     */
    this.addEventListener = this.element.addEventListener.bind(this.element)

    /**
     * Removes event listener from the element
     * @name ScrollSnapSlider#removeEventListener
     * @method
     * @public
     */
    this.removeEventListener = this.element.removeEventListener.bind(this.element)

    enabled && this.attachListeners()

    /**
     * Maps a plugin name to its instance
     * @type {Map<String, Object>}
     */
    this.plugins = new window.Map()
    for (const plugin of plugins) {
      this.plugins.set(plugin.id, plugin)
      enabled && plugin.enable(this)
    }
  }

  /**
   * Attach all necessary listeners
   * @return {void}
   * @public
   */
  attachListeners () {
    this.addEventListener('scroll', this.onScroll, this.listenerOptions)
  }

  /**
   * Act when scrolling starts and stops
   * @return {void}
   * @private
   */
  onScroll () {
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

    window.clearTimeout(this.scrollTimeoutId)
    this.scrollTimeoutId = window.setTimeout(this.onScrollEnd, this.scrollTimeout)
  }

  /**
   * Calculate all necessary things and dispatch an event when sliding stops
   * @return {void}
   * @private
   */
  onScrollEnd () {
    if (this.element.scrollLeft % this.element.offsetWidth !== 0) {
      return
    }

    this.scrollTimeoutId = null
    this.slide = this.calculateSlide()
    this.slideScrollLeft = this.element.scrollLeft
    this.dispatch('slide-stop', this.slide)
  }

  /**
   * Calculates the active slide.
   * The scroll-snap-type property makes sure that the container snaps perfectly to integer multiples.
   * @return {Number}
   * @private
   */
  calculateSlide () {
    return this.roundingMethod(this.element.scrollLeft / this.element.offsetWidth)
  }

  /**
   * @param {String} event
   * @param {any} detail
   * @return {boolean}
   * @private
   */
  dispatch (event, detail) {
    return this.element.dispatchEvent(
      new window.CustomEvent(event, {
        detail: detail
      })
    )
  }

  /**
   * Scroll to a slide by index.
   *
   * @param {Number} index
   * @return {void}
   * @public
   */
  slideTo (index) {
    this.element.scrollTo({
      left: index * this.element.offsetWidth
    })
  }

  /**
   * Free resources and listeners, disable plugins
   * @return {void}
   * @public
   */
  destroy () {
    window.clearTimeout(this.scrollTimeoutId)
    this.removeEventListener('scroll', this.onScroll, this.listenerOptions)

    for (const plugin of this.plugins.values()) {
      plugin.disable()
    }
  }
}
