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
     * @type {?number}
     */
    this.slide = null

    /**
     * Active slide's scrollLeft in the containing element
     * @type {number}
     */
    this.slideScrollLeft = 0

    /**
     * Timestamp when the last scroll started
     * @type {?number}
     */
    this.scrollStarted = null

    this.onScroll = this.onScroll.bind(this)
    this.onScrollEnd = this.onScrollEnd.bind(this)
    this.slideTo = this.slideTo.bind(this)

    this.calculateSlide()
    this.attachListeners()
  }

  /**
   * Attach all necessary listeners
   * @return {void}
   * @private
   */
  attachListeners () {
    this.addEventListener('scroll', this.onScroll, {
      passive: true
    })
  }

  /**
   * Act when scrolling starts and stops
   * @param {Event} event
   * @return {void}
   * @private
   */
  onScroll (event) {
    if (null === this.scrollStarted) {
      this.scrollStarted = event.timeStamp
      this.onScrollStart()
    }

    if (this.element.scrollLeft % this.element.offsetWidth === 0) {
      this.scrollStarted = null
      this.onScrollEnd()
    }
  }

  /**
   * Dispatch an event when sliding starts
   * @return {void}
   * @private
   */
  onScrollStart () {
    const direction = (this.element.scrollLeft > this.slideScrollLeft) ? 1 : -1
    this.dispatch('slide-start', this.slide + direction)
  }

  /**
   * Calculate all necessary things and dispatch an event when sliding stops
   * @return {void}
   * @private
   */
  onScrollEnd () {
    this.calculateSlide()
    this.dispatch('slide-stop', this.slide)
  }

  /**
   * Calculates the active slide.
   * The scroll-snap-type property makes sure that the container snaps perfectly to integer multiples.
   * @return {void}
   * @private
   */
  calculateSlide () {
    if (this.element.scrollLeft % this.element.offsetWidth !== 0) {
      return
    }

    this.slideScrollLeft = this.element.scrollLeft
    this.slide = this.slideScrollLeft / this.element.offsetWidth
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
   * Attach Listener to the root element
   * @param {String} event
   * @param {EventListenerOrEventListenerObject} listener
   * @param {undefined|boolean|AddEventListenerOptions} options
   * @return {void}
   * @public
   */
  addEventListener (event, listener, options = undefined) {
    this.element.addEventListener(event, listener, options)
  }

  /**
   * Remove Listener to the root element
   * @param {String} event
   * @param {EventListenerOrEventListenerObject} listener
   * @param {undefined|boolean|AddEventListenerOptions} options
   * @return {void}
   * @public
   */
  removeEventListener (event, listener, options = undefined) {
    this.element.removeEventListener(event, listener, options)
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
