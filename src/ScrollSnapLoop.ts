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

  private loopSlides (): void {
    if (this.slider.element.children.length < 3) {
      return
    }

    this.slider.detachListeners()

    const { scrollLeft, offsetWidth, scrollWidth } = this.slider.element
    if (scrollLeft < 5) {
      this.slider.element.prepend(this.slider.element.children[this.slider.element.children.length - 1])
    } else if (scrollWidth - scrollLeft - offsetWidth < 5) {
      this.slider.element.append(this.slider.element.children[0])
    }

    this.slider.attachListeners()
  }

  private sortFunction (a: HTMLOrSVGElement, b: HTMLOrSVGElement): number {
    return parseInt(a.dataset.index!, 10) - parseInt(b.dataset.index!, 10)
  }
}