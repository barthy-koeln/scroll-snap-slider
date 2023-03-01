export class ScrollSnapSlider {
    element;
    plugins;
    removeEventListener;
    addEventListener;
    roundingMethod;
    scrollTimeout;
    itemSize;
    sizingMethod;
    slide;
    resizeObserver;
    scrollTimeoutId;
    slideScrollLeft;
    constructor(options) {
        Object.assign(this, {
            scrollTimeout: 100,
            roundingMethod: Math.round,
            sizingMethod: (slider) => slider.element.firstElementChild.offsetWidth,
            ...options
        });
        this.scrollTimeoutId = null;
        this.itemSize = this.sizingMethod(this);
        this.update();
        this.addEventListener = this.element.addEventListener.bind(this.element);
        this.removeEventListener = this.element.removeEventListener.bind(this.element);
        this.plugins = new window.Map();
        this.resizeObserver = new ResizeObserver(this.onSlideResize);
        this.resizeObserver.observe(this.element);
        for (const child of this.element.children) {
            this.resizeObserver.observe(child);
        }
        this.attachListeners();
    }
    with(plugins, enabled = true) {
        for (const plugin of plugins) {
            plugin.slider = this;
            this.plugins.set(plugin.id, plugin);
            enabled && plugin.enable();
        }
        return this;
    }
    attachListeners() {
        this.addEventListener('scroll', this.onScroll, { passive: true });
    }
    detachListeners() {
        this.removeEventListener('scroll', this.onScroll);
        this.scrollTimeoutId && window.clearTimeout(this.scrollTimeoutId);
    }
    slideTo = (index) => {
        this.element.scrollTo({
            left: index * this.itemSize
        });
    };
    destroy() {
        this.scrollTimeoutId && window.clearTimeout(this.scrollTimeoutId);
        this.detachListeners();
        for (const [id, plugin] of this.plugins) {
            plugin.disable();
            plugin.slider = null;
            this.plugins.delete(id);
        }
    }
    update = () => {
        this.slide = this.calculateSlide();
        this.slideScrollLeft = this.slide * this.itemSize;
    };
    calculateSlide() {
        return this.roundingMethod(this.element.scrollLeft / this.itemSize);
    }
    onScrollEnd = () => {
        this.scrollTimeoutId = null;
        this.update();
        this.dispatch('slide-stop', this.slide);
    };
    onSlideResize = (entries) => {
        this.itemSize = this.sizingMethod(this, entries);
    };
    dispatch(event, detail) {
        return this.element.dispatchEvent(new window.CustomEvent(event, {
            detail
        }));
    }
    onScroll = () => {
        if (null === this.scrollTimeoutId) {
            const direction = (this.element.scrollLeft > this.slideScrollLeft) ? 1 : -1;
            this.dispatch('slide-start', this.slide + direction);
        }
        if (this.calculateSlide() !== this.slide) {
            this.update();
            this.dispatch('slide-pass', this.slide);
        }
        this.scrollTimeoutId && window.clearTimeout(this.scrollTimeoutId);
        this.scrollTimeoutId = window.setTimeout(this.onScrollEnd, this.scrollTimeout);
    };
}
