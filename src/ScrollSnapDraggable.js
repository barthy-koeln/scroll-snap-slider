import { ScrollSnapPlugin } from './ScrollSnapPlugin.js'

export class ScrollSnapDraggable extends ScrollSnapPlugin {
  constructor () {
    super()

    /**
     * Last drag event position
     * @type {?Number}
     */
    this.lastX = null

    /**
     * Timeout ID for a smooth drag release
     * @type {?Number}
     */
    this.disableTimeout = null

    this.mouseMove = this.mouseMove.bind(this)
    this.startDragging = this.startDragging.bind(this)
    this.stopDragging = this.stopDragging.bind(this)
  }

  /**
   * @override
   * @param {ScrollSnapSlider} slider
   */
  enable (slider) {
    this.slider = slider
    this.element = this.slider.element

    this.element.classList.add('-draggable')

    this.slider.addEventListener('mousedown', this.startDragging)
    window.addEventListener('mouseup', this.stopDragging, { capture: true })
  }

  /**
   * @override
   */
  disable () {
    this.element.classList.remove('-draggable')

    window.clearTimeout(this.disableTimeout)
    this.slider.removeEventListener('mousedown', this.startDragging)
    window.removeEventListener('mouseup', this.stopDragging, { capture: true })

    this.slider = null
    this.element = null
    this.disableTimeout = null
    this.lastX = null
  }

  /**
   * Scroll the slider the appropriate amount of pixels and update the last event position
   * @param {MouseEvent} event
   */
  mouseMove (event) {
    const distance = this.lastX - event.clientX
    this.lastX = event.clientX

    this.element.scrollLeft += distance
  }

  /**
   * Clear disable timeout, set up variables and styles and attach the listener.
   * @param {MouseEvent} event
   */
  startDragging (event) {
    event.preventDefault()
    window.clearTimeout(this.disableTimeout)

    this.lastX = event.clientX
    this.element.style.scrollBehavior = 'auto'
    this.element.style.scrollSnapStop = 'unset'
    this.element.style.scrollSnapType = 'none'
    this.element.classList.add('-dragging')

    const autoplay = this.slider.plugins.get('ScrollSnapAutoplay')
    if (autoplay) {
      autoplay.disable()
    }

    window.addEventListener('mousemove', this.mouseMove)
  }

  /**
   * Remove listener and clean up the styles.
   * Note: We first restore the smooth behaviour, then manually snap to the current slide.
   * Using a timeout, we then restore the rest of the snap behaviour.
   * @param {MouseEvent} event
   */
  stopDragging (event) {
    if (this.lastX === null) {
      return
    }

    event.preventDefault()
    this.lastX = null
    window.removeEventListener('mousemove', this.mouseMove)
    this.element.style.scrollBehavior = null
    this.element.classList.remove('-dragging')
    this.slider.slideTo(this.slider.slide)

    const autoplay = this.slider.plugins.get('ScrollSnapAutoplay')
    if (autoplay) {
      autoplay.enable(this.slider)
    }

    this.disableTimeout = window.setTimeout(() => {
      this.element.style.scrollSnapStop = null
      this.element.style.scrollSnapType = null
    }, 300)
  }
}