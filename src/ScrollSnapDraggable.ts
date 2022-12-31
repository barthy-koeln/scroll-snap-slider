import { ScrollSnapPlugin } from './ScrollSnapPlugin.js'

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
   * Timeout ID for a smooth drag release
   */
  private disableTimeout: number | null

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
    this.disableTimeout = null
    this.quickSwipeDistance = quickSwipeDistance

    this.mouseMove = this.mouseMove.bind(this)
    this.startDragging = this.startDragging.bind(this)
    this.stopDragging = this.stopDragging.bind(this)
  }

  public get id (): string {
    return 'ScrollSnapDraggable'
  }

  /**
   * @override
   */
  public enable (): void {
    this.slider!.element.classList.add('-draggable')
    this.slider!.addEventListener('mousedown', this.startDragging)
    window.addEventListener('mouseup', this.stopDragging, { capture: true })
  }

  /**
   * @override
   */
  public disable (): void {
    this.slider!.element.classList.remove('-draggable')

    this.disableTimeout && window.clearTimeout(this.disableTimeout)
    this.disableTimeout = null

    this.slider!.removeEventListener('mousedown', this.startDragging)
    window.removeEventListener('mouseup', this.stopDragging, { capture: true })

    this.lastX = null
  }

  private getFinalSlide (): number {
    if (!this.quickSwipeDistance) {
      return this.slider!.slide
    }

    const distance = Math.abs(this.startX! - this.lastX!)
    const minimumNotReached = this.quickSwipeDistance > distance
    const halfPointCrossed = distance > (this.slider!.sizingMethod(this.slider!) / 2)

    if (minimumNotReached || halfPointCrossed) {
      return this.slider!.slide
    }

    if (this.startX! < this.lastX!) {
      return this.slider!.slide - 1
    }

    return this.slider!.slide + 1
  }

  /**
   * Scroll the slider the appropriate amount of pixels and update the last event position
   */
  private mouseMove (event: MouseEvent): void {
    const distance = this.lastX! - event.clientX
    this.lastX = event.clientX

    this.slider!.element.scrollLeft += distance
  }

  /**
   * Clear disable timeout, set up variables and styles and attach the listener.
   */
  private startDragging (event: MouseEvent): void {
    event.preventDefault()
    this.disableTimeout && window.clearTimeout(this.disableTimeout)
    this.disableTimeout = null

    this.startX = this.lastX = event.clientX
    this.slider!.element.style.scrollBehavior = 'auto'
    this.slider!.element.style.scrollSnapStop = 'unset'
    this.slider!.element.style.scrollSnapType = 'none'
    this.slider!.element.classList.add('-dragging')

    const autoplay = this.slider!.plugins.get('ScrollSnapAutoplay')
    if (autoplay) {
      autoplay.disable()
    }

    window.addEventListener('mousemove', this.mouseMove)
  }

  /**
   * Remove listener and clean up the styles.
   * Note: We first restore the smooth behaviour, then manually snap to the current slide.
   * Using a timeout, we then restore the rest of the snap behaviour.
   */
  private stopDragging (event: MouseEvent): void {
    if (this.lastX === null) {
      return
    }

    event.preventDefault()

    const finalSlide = this.getFinalSlide()

    window.removeEventListener('mousemove', this.mouseMove)
    this.lastX = null
    this.slider!.element.style.scrollBehavior = ''
    this.slider!.element.classList.remove('-dragging')

    this.slider!.slideTo(finalSlide)

    const autoplay = this.slider!.plugins.get('ScrollSnapAutoplay')
    if (autoplay) {
      autoplay.enable()
    }

    this.disableTimeout = window.setTimeout(() => {
      this.slider!.element.style.scrollSnapStop = ''
      this.slider!.element.style.scrollSnapType = ''
    }, 300)
  }
}