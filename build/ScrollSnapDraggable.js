import { ScrollSnapPlugin } from './ScrollSnapPlugin.js';
export class ScrollSnapDraggable extends ScrollSnapPlugin {
    quickSwipeDistance;
    disableTimeout;
    lastX;
    startX;
    constructor(quickSwipeDistance = null) {
        super();
        this.lastX = null;
        this.startX = null;
        this.slider = null;
        this.disableTimeout = null;
        this.quickSwipeDistance = quickSwipeDistance;
    }
    get id() {
        return 'ScrollSnapDraggable';
    }
    enable() {
        this.slider.element.classList.add('-draggable');
        this.slider.addEventListener('mousedown', this.startDragging);
        window.addEventListener('mouseup', this.stopDragging, { capture: true });
    }
    disable() {
        this.slider.element.classList.remove('-draggable');
        this.disableTimeout && window.clearTimeout(this.disableTimeout);
        this.disableTimeout = null;
        this.slider.removeEventListener('mousedown', this.startDragging);
        window.removeEventListener('mouseup', this.stopDragging, { capture: true });
        this.lastX = null;
    }
    getFinalSlide() {
        if (!this.quickSwipeDistance) {
            return this.slider.slide;
        }
        const distance = Math.abs(this.startX - this.lastX);
        const minimumNotReached = this.quickSwipeDistance > distance;
        const halfPointCrossed = distance > (this.slider.sizingMethod(this.slider) / 2);
        if (minimumNotReached || halfPointCrossed) {
            return this.slider.slide;
        }
        if (this.startX < this.lastX) {
            return this.slider.slide - 1;
        }
        return this.slider.slide + 1;
    }
    mouseMove = (event) => {
        const distance = this.lastX - event.clientX;
        this.lastX = event.clientX;
        this.slider.element.scrollLeft += distance;
    };
    startDragging = (event) => {
        event.preventDefault();
        this.disableTimeout && window.clearTimeout(this.disableTimeout);
        this.disableTimeout = null;
        this.startX = this.lastX = event.clientX;
        this.slider.element.style.scrollBehavior = 'auto';
        this.slider.element.style.scrollSnapStop = 'unset';
        this.slider.element.style.scrollSnapType = 'none';
        this.slider.element.classList.add('-dragging');
        const autoplay = this.slider.plugins.get('ScrollSnapAutoplay');
        if (autoplay) {
            autoplay.disable();
        }
        window.addEventListener('mousemove', this.mouseMove);
    };
    stopDragging = (event) => {
        if (this.lastX === null) {
            return;
        }
        event.preventDefault();
        const finalSlide = this.getFinalSlide();
        window.removeEventListener('mousemove', this.mouseMove);
        this.lastX = null;
        this.slider.element.style.scrollBehavior = '';
        this.slider.element.classList.remove('-dragging');
        this.slider.slideTo(finalSlide);
        const autoplay = this.slider.plugins.get('ScrollSnapAutoplay');
        if (autoplay) {
            autoplay.enable();
        }
        this.disableTimeout = window.setTimeout(() => {
            this.slider.element.style.scrollSnapStop = '';
            this.slider.element.style.scrollSnapType = '';
        }, 300);
    };
}
