import { ScrollSnapPlugin } from './ScrollSnapPlugin.js';
export class ScrollSnapLoop extends ScrollSnapPlugin {
    constructor() {
        super();
        this.loopSlides = this.loopSlides.bind(this);
    }
    get id() {
        return 'ScrollSnapLoop';
    }
    enable() {
        this.slider.addEventListener('slide-pass', this.loopSlides);
        this.slider.addEventListener('slide-stop', this.loopSlides);
        this.loopSlides();
        this.slider.slide = this.slider.calculateSlide();
    }
    disable() {
        this.slider.removeEventListener('slide-pass', this.loopSlides);
        this.slider.removeEventListener('slide-stop', this.loopSlides);
        const slides = this.slider.element.querySelectorAll('[data-index]');
        const sortedSlides = Array.from(slides).sort(this.sortFunction);
        Element.prototype.append.apply(this.slider.element, sortedSlides);
    }
    loopSlides() {
        if (this.slider.element.children.length < 3) {
            return;
        }
        this.slider.detachListeners();
        const { scrollLeft, offsetWidth, scrollWidth } = this.slider.element;
        if (scrollLeft < 5) {
            this.slider.element.prepend(this.slider.element.children[this.slider.element.children.length - 1]);
        }
        else if (scrollWidth - scrollLeft - offsetWidth < 5) {
            this.slider.element.append(this.slider.element.children[0]);
        }
        this.slider.attachListeners();
    }
    sortFunction(a, b) {
        return parseInt(a.dataset.index, 10) - parseInt(b.dataset.index, 10);
    }
}
