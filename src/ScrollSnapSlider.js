export class ScrollSlider {
  /**
   * Bind methods and attach listeners.
   * @param {HTMLElement} element
   */
  constructor (element) {
    this.element = element

    this.onScroll = this.onScroll.bind(this)
    this.scrollTo = this.scrollTo.bind(this)

    this.attachListeners()
  }

  /**
   * Attach all necessary listeners
   */
  attachListeners () {
    this.element.addEventListener('scroll', this.onScroll, {
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
      const slide = this.element.scrollLeft / this.element.offsetWidth

      this.element.dispatchEvent(
        new window.CustomEvent('slide-changed', {
          detail: slide
        })
      )
    }
  }

  /**
   * Scroll to a slide by index.
   *
   * @public
   * @param index
   */
  scrollTo (index) {
    this.element.scrollTo({
      left: index * this.element.offsetWidth,
      behavior: 'smooth'
    })
  }

  /**
   * Attach Listener to the root element
   * @param {String} event
   * @param {Function} listener
   * @param {AddEventListenerOptions} options
   */
  addEventListener (event, listener, options) {
    this.element.addEventListener(event, listener, options)
  }

  /**
   * Remove Listener to the root element
   * @param {String} event
   * @param {Function} listener
   */
  removeEventListener (event, listener) {
    this.element.addEventListener(event, listener)
  }
}
