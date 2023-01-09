import { ScrollSnapPlugin } from './ScrollSnapPlugin.js'

export class ScrollSnapLoop extends ScrollSnapPlugin {
  public constructor () {
    super()

    this.loopSlides = this.loopSlides.bind(this)
  }

  public get id (): string {
    return 'ScrollSnapLoop'
  }

  /**
   * @override
   */
  public enable (): void {
    this.slider.addEventListener('slide-pass', this.loopSlides)
    this.slider.addEventListener('slide-stop', this.loopSlides)
    this.loopSlides()
    this.slider.slide = this.slider.calculateSlide()
  }

  /**
   * @override
   */
  public disable (): void {
    this.slider.removeEventListener('slide-pass', this.loopSlides)
    this.slider.removeEventListener('slide-stop', this.loopSlides)

    const slides = this.slider.element.querySelectorAll<HTMLOrSVGElement & Element>('[data-index]')
    const sortedSlides = Array.from(slides).sort(this.sortFunction)

    Element.prototype.append.apply(this.slider.element, sortedSlides)
  }

  removeSnapping () {
    this.slider.detachListeners()
    this.slider.element.style.scrollBehavior = 'auto'
    this.slider.element.style.scrollSnapStop = 'unset'
    this.slider.element.style.scrollSnapType = 'none'
  }

  addSnapping () {
    this.slider.element.style.scrollBehavior = ''
    this.slider.element.style.scrollSnapStop = ''
    this.slider.element.style.scrollSnapType = ''
    this.slider.attachListeners()
  }

  private loopEndToStart () {
    this.removeSnapping()
    this.slider.element.prepend(this.slider.element.children[this.slider.element.children.length - 1])
    this.slider.element.scrollLeft += this.slider.itemSize
    this.addSnapping()
  }

  private loopStartToEnd () {
    this.removeSnapping()
    this.slider.element.append(this.slider.element.children[0])
    this.slider.element.scrollLeft -= this.slider.itemSize
    this.addSnapping()
  }

  private loopSlides (): void {
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

  private sortFunction (a: HTMLOrSVGElement, b: HTMLOrSVGElement): number {
    return parseInt(a.dataset.index!, 10) - parseInt(b.dataset.index!, 10)
  }
}