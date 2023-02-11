import { ScrollSnapPlugin } from './ScrollSnapPlugin.js'

/**
 * Plugin to loop around to the first slide at the end and to the last slide at the start
 * All slides should have a unique and numeric <code>data-index</code> attribute.
 */
export class ScrollSnapLoop extends ScrollSnapPlugin {

  /**
   * @inheritDoc
   */
  public get id (): string {
    return 'ScrollSnapLoop'
  }

  /**
   * @inheritDoc
   * @override
   */
  public enable (): void {
    this.slider.addEventListener('slide-pass', this.loopSlides)
    this.slider.addEventListener('slide-stop', this.loopSlides)
    this.loopSlides()
  }

  /**
   * @inheritDoc
   * @override
   */
  public disable (): void {
    this.slider.removeEventListener('slide-pass', this.loopSlides)
    this.slider.removeEventListener('slide-stop', this.loopSlides)

    const slides = this.slider.element.querySelectorAll<HTMLOrSVGElement & Element>('[data-index]')
    const sortedSlides = Array.from(slides).sort(this.sortFunction)

    Element.prototype.append.apply(this.slider.element, sortedSlides)
  }

  /**
   * Remove snapping behaviour
   */
  private removeSnapping () {
    this.slider.detachListeners()
    this.slider.element.style.scrollBehavior = 'auto'
    this.slider.element.style.scrollSnapStop = 'unset'
    this.slider.element.style.scrollSnapType = 'none'
  }

  /**
   * Add snapping behaviour
   */
  private addSnapping () {
    this.slider.element.style.scrollBehavior = ''
    this.slider.element.style.scrollSnapStop = ''
    this.slider.element.style.scrollSnapType = ''
    this.slider.attachListeners()
    window.setTimeout(this.slider.update, 0)
  }

  /**
   * Move last slide to the start of the slider.
   */
  private loopEndToStart () {
    this.removeSnapping()
    this.slider.element.prepend(this.slider.element.children[this.slider.element.children.length - 1])
    this.slider.element.scrollLeft += this.slider.itemSize
    this.addSnapping()
  }

  /**
   * Move first slide to the end of the slider.
   */
  private loopStartToEnd () {
    this.removeSnapping()
    this.slider.element.append(this.slider.element.children[0])
    this.slider.element.scrollLeft -= this.slider.itemSize
    this.addSnapping()
  }

  /**
   * Determine which slide to move where and apply the change.
   */
  private loopSlides = () => {
    if (this.slider.element.children.length < 3) {
      return
    }

    const { scrollLeft, offsetWidth, scrollWidth } = this.slider.element
    if (scrollLeft < 5) {
      this.loopEndToStart()
      return
    }

    if (scrollWidth - scrollLeft - offsetWidth < 5) {
      this.loopStartToEnd()
    }
  }

  /**
   * Sort items to their initial position after disabling
   */
  private sortFunction (a: HTMLOrSVGElement, b: HTMLOrSVGElement): number {
    return parseInt(a.dataset.index, 10) - parseInt(b.dataset.index, 10)
  }
}