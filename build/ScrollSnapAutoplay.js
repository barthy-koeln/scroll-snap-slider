import { ScrollSnapPlugin } from './ScrollSnapPlugin.js';
export class ScrollSnapAutoplay extends ScrollSnapPlugin {
    intervalDuration;
    timeoutDuration;
    originalSlideTo;
    debounceId;
    interval;
    constructor(intervalDuration = 3141, timeoutDuration = 6282) {
        super();
        this.intervalDuration = intervalDuration;
        this.timeoutDuration = timeoutDuration;
        this.interval = null;
        this.onInterval = this.onInterval.bind(this);
        this.disableTemporarily = this.disableTemporarily.bind(this);
        this.enable = this.enable.bind(this);
    }
    get id() {
        return 'ScrollSnapAutoplay';
    }
    enable() {
        this.debounceId && window.clearTimeout(this.debounceId);
        this.debounceId = null;
        this.interval = window.setInterval(this.onInterval, this.intervalDuration);
        this.slider.addEventListener('touchstart', this.disableTemporarily, { passive: true });
        this.slider.addEventListener('wheel', this.disableTemporarily, { passive: true });
    }
    disable() {
        this.slider.removeEventListener('touchstart', this.disableTemporarily);
        this.slider.removeEventListener('wheel', this.disableTemporarily);
        this.interval && window.clearInterval(this.interval);
        this.interval = null;
        this.debounceId && window.clearTimeout(this.debounceId);
        this.debounceId = null;
    }
    disableTemporarily() {
        if (!this.interval) {
            return;
        }
        window.clearInterval(this.interval);
        this.interval = null;
        this.debounceId && window.clearTimeout(this.debounceId);
        this.debounceId = window.setTimeout(this.enable, this.timeoutDuration);
    }
    onInterval() {
        if (this.slider.plugins.has('ScrollSnapLoop')) {
            this.slider.slideTo(this.slider.slide + 1);
            return;
        }
        const { scrollLeft, offsetWidth, scrollWidth } = this.slider.element;
        const isLastSlide = scrollLeft + offsetWidth === scrollWidth;
        const target = isLastSlide ? 0 : this.slider.slide + 1;
        this.slider.slideTo(target);
    }
}
