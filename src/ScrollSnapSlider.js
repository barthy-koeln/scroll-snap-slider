export class ScrollSnapSlider {
  /**
   * Bind methods and attach listeners.
   * @param {Element} element
   */
  constructor (element) {
    /**
     * Base element of this slider
     * @type {Element}
     */
    this.element = element

    /**
     * Active slide
     * @type {?Number}
     */
    this.slide = this.calculateSlide()

    /**
     * Active slide's scrollLeft in the containing element
     * @type {Number}
     */
    this.slideScrollLeft = this.element.scrollLeft

    /**
     * Timeout ID used to catch the end of scroll events
     * @type {?Number}
     */
    this.scrollTimeoutId = null
    
    /**
     * @callback roundingMethod
     * @param {Number} x - factor indicating th current position (e.g "0" for first slide, "2.5" for third slide and a half)
     * @return {Number} f(x) - integer factor indicating the currently 'active' slide.
     */
    
    /**
     * Rounding method used to calculate the current slide (e.g. Math.floor, Math.round, Math.ceil, or totally custom.)
     * @type {roundingMethod}
     */
    this.roundingMethod = Math.round

    /**
     * Timeout delay in milliseconds used to catch the end of scroll events
     * @type {?Number}
     */
    this.scrollTimeout = 100

    this.onScroll = this.onScroll.bind(this)
    this.onScrollEnd = this.onScrollEnd.bind(this)
    this.slideTo = this.slideTo.bind(this)

    /**
     * Adds event listener to the element
     * @type {Function}
     * @public
     */
    this.addEventListener = this.element.addEventListener.bind(this.element)

    /**
     * Removes event listener from the element
     * @type {Function}
     * @public
     */
    this.removeEventListener = this.element.removeEventListener.bind(this.element)

    this.attachListeners()
  }

  /**
   * Attach all necessary listeners
   * @return {void}
   * @public
   */
  attachListeners () {
    this.addEventListener('scroll', this.onScroll, {
      passive: true
    })
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
   * Free resources and listeners
   * @return {void}
   * @public
   */
  destroy () {
    this.removeEventListener('scroll', this.onScroll, {
      passive: true
    })
  }
}
