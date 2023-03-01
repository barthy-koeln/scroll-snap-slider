import { ScrollSnapPlugin } from './ScrollSnapPlugin.js';
export class ScrollSnapAutoplay extends ScrollSnapPlugin {
    intervalDuration;
    timeoutDuration;
    debounceId;
    interval;
    events;
    constructor(intervalDuration = 3141, timeoutDuration = 6282, events = ['touchmove', 'wheel']) {
        super();
        this.intervalDuration = intervalDuration;
        this.timeoutDuration = timeoutDuration;
        this.interval = null;
        this.events = events;
    }
    get id() {
        return 'ScrollSnapAutoplay';
    }
    enable = () => {
        this.debounceId && window.clearTimeout(this.debounceId);
        this.debounceId = null;
        this.interval = window.setInterval(this.onInterval, this.intervalDuration);
        for (const event of this.events) {
            this.slider.addEventListener(event, this.disableTemporarily, { passive: true });
        }
    };
    disable() {
        for (const event of this.events) {
            this.slider.removeEventListener(event, this.disableTemporarily);
        }
        this.interval && window.clearInterval(this.interval);
        this.interval = null;
        this.debounceId && window.clearTimeout(this.debounceId);
        this.debounceId = null;
    }
    disableTemporarily = () => {
        if (!this.interval) {
            return;
        }
        window.clearInterval(this.interval);
        this.interval = null;
        this.debounceId && window.clearTimeout(this.debounceId);
        this.debounceId = window.setTimeout(this.enable, this.timeoutDuration);
    };
    onInterval = () => {
        if (this.slider.plugins.has('ScrollSnapLoop')) {
            this.slider.slideTo(this.slider.slide + 1);
            return;
        }
        const { scrollLeft, offsetWidth, scrollWidth } = this.slider.element;
        const isLastSlide = scrollLeft + offsetWidth === scrollWidth;
        const target = isLastSlide ? 0 : this.slider.slide + 1;
        this.slider.slideTo(target);
    };
}
