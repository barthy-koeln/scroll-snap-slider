export class ScrollSnapSlider {
  /**
   * Bind methods and attach listeners.
   * @param {HTMLElement} element
   */
  constructor (element) {
    /**
     * Base element of this slider
     * @type {HTMLElement}
     */
    this.element = element

    /**
     * Active slide
     * @type {?number}
     */
    this.slide = null

    this.onScroll = this.onScroll.bind(this)
    this.scrollTo = this.scrollTo.bind(this)

    this.calculateSlide()
    this.attachListeners()
  }

  /**
   * Attach all necessary listeners
   */
  attachListeners () {
    this.addEventListener('scroll', this.onScroll, {
      passive: true
    })
  }

  /**
   * This listener calculates the modulo of the scroll position by the visible width.
   * Every time the result equals 0, the scroll position is exactly an integer multiple of the width.
   * This means that the carousel has reached another page.
   * The scroll-snap-type property makes sure that the container snaps perfectly to integer multiples.
   *
   * @private
   */
  onScroll () {
    if (this.element.scrollLeft % this.element.offsetWidth === 0) {
      this.calculateSlide()

      this.element.dispatchEvent(
        new window.CustomEvent('slide-changed', {
          detail: this.slide
        })
      )
    }
  }

  /**
   * Calculates the active slide
   * @private
   */
  calculateSlide () {
    this.slide = this.element.scrollLeft / this.element.offsetWidth
  }

  /**
   * Scroll to a slide by index.
   *
   * @param index
   * @public
   */
  scrollTo (index) {
    this.element.scrollTo({
      left: index * this.element.offsetWidth
    })
  }

  /**
   * Attach Listener to the root element
   * @param {String} event
   * @param {Function} listener
   * @param {AddEventListenerOptions} options
   * @public
   */
  addEventListener (event, listener, options = undefined) {
    this.element.addEventListener(event, listener, options)
  }

  /**
   * Remove Listener to the root element
   * @param {String} event
   * @param {Function} listener
   * @public
   */
  removeEventListener (event, listener) {
    this.element.addEventListener(event, listener)
  }
}
