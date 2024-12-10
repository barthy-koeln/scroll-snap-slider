import { ScrollSnapPlugin } from './ScrollSnapPlugin'

/**
 * Plugin that enables mouse/pointer drag. Note, that touch interaction is enabled natively in all browsers.
 */
export class ScrollSnapDraggable extends ScrollSnapPlugin {

  /**
   * If this is null:
   *  The next/previous slide will not be reached unless you drag for more than half the slider's width.
   *
   * If this is a number:
   *  Dragging any slide for more than this distance in pixels will slide to the next slide in the desired direction.
   */
  quickSwipeDistance: number | null

  /**
   * Last drag event position
   */
  private lastX: number | null

  /**
   * Where the dragging started
   */
  private startX: number | null

  public constructor (quickSwipeDistance: number | null = null) {
    super()

    this.lastX = null
    this.startX = null
    this.slider = null
    this.quickSwipeDistance = quickSwipeDistance
  }

  /**
   * @inheritDoc
   */
  public get id (): string {
    return 'ScrollSnapDraggable'
  }

  /**
   * @override
   */
  public enable (): void {
    this.slider.element.classList.add('-draggable')
    this.slider.addEventListener('mousedown', this.startDragging)
    addEventListener('mouseup', this.stopDragging, { capture: true })
  }

  /**
   * @override
   */
  public disable (): void {
    this.slider.element.classList.remove('-draggable')

    this.slider.removeEventListener('mousedown', this.startDragging)
    removeEventListener('mouseup', this.stopDragging, { capture: true })

    this.lastX = null
  }

  /**
   * Disable scroll-snapping
   */
  private onSlideStopAfterDrag = () => {
    this.slider.element.style.scrollSnapStop = ''
    this.slider.element.style.scrollSnapType = ''
  }

  /**
   * Calculate the target slide after dragging
   */
  private getFinalSlide (): number {
    if (!this.quickSwipeDistance) {
      return this.slider.slide
    }

    const distance = Math.abs(this.startX - this.lastX)
    const minimumNotReached = this.quickSwipeDistance > distance
    const halfPointCrossed = distance > (this.slider.itemSize / 2)

    if (minimumNotReached || halfPointCrossed) {
      return this.slider.slide
    }

    if (this.startX < this.lastX) {
      return this.slider.slide - 1
    }

    return this.slider.slide + 1
  }

  /**
   * Scroll the slider the appropriate amount of pixels and update the last event position
   */
  private mouseMove = (event: MouseEvent) => {
    const distance = this.lastX - event.clientX
    this.lastX = event.clientX

    requestAnimationFrame(() => {
      this.slider.element.scrollLeft += distance
    })
  }

  /**
   * Clear disable timeout, set up variables and styles and attach the listener.
   */
  private startDragging = (event: MouseEvent) => {
    event.preventDefault()

    this.slider.removeEventListener('slide-stop', this.onSlideStopAfterDrag)
    this.startX = this.lastX = event.clientX
    this.slider.element.style.scrollBehavior = 'auto'
    this.slider.element.style.scrollSnapStop = 'unset'
    this.slider.element.style.scrollSnapType = 'none'
    this.slider.element.classList.add('-dragging')

    const autoplay = this.slider.plugins.get('ScrollSnapAutoplay')
    if (autoplay) {
      autoplay.disable()
    }

    addEventListener('mousemove', this.mouseMove)
  }

  /**
   * Remove listener and clean up the styles.
   * Note: We first restore the smooth behaviour, then manually snap to the current slide.
   * Using a timeout, we then restore the rest of the snap behaviour.
   */
  private stopDragging = (event: MouseEvent) => {
    if (this.lastX === null) {
      return
    }

    event.preventDefault()

    const finalSlide = this.getFinalSlide()

    removeEventListener('mousemove', this.mouseMove)
    this.lastX = null
    this.slider.element.style.scrollBehavior = ''
    this.slider.element.classList.remove('-dragging')

    this.slider.slideTo(finalSlide)

    const autoplay = this.slider.plugins.get('ScrollSnapAutoplay')
    if (autoplay) {
      autoplay.enable()
    }

    requestAnimationFrame(() => {
      const { scrollLeft, offsetWidth, scrollWidth } = this.slider.element
      if (scrollLeft === 0 || scrollWidth - scrollLeft - offsetWidth === 0) {
        this.onSlideStopAfterDrag()
        return
      }

      this.slider.addEventListener('slide-stop', this.onSlideStopAfterDrag, { once: true })
    })
  }
}
