class ScrollSnapPlugin {
  /**
   * Reference to the slider this plugin is attached to.
   */
  slider;
  constructor() {
    this.slider = null;
  }
}
class ScrollSnapAutoplay extends ScrollSnapPlugin {
  /**
   * Duration in milliseconds between slide changes
   */
  intervalDuration;
  /**
   * Duration in milliseconds after human interaction where the slider will not autoplay
   */
  timeoutDuration;
  /**
   * Used to debounce the re-enabling after a user interaction
   */
  debounceId;
  /**
   * Interval ID
   */
  interval;
  /**
   * Event names that temporarily disable the autoplay behaviour
   */
  events;
  constructor(intervalDuration = 3141, timeoutDuration = 6282, events = ["touchmove", "wheel"]) {
    super();
    this.intervalDuration = intervalDuration;
    this.timeoutDuration = timeoutDuration;
    this.interval = null;
    this.events = events;
  }
  /**
   * @inheritDoc
   */
  get id() {
    return "ScrollSnapAutoplay";
  }
  /**
   * @inheritDoc
   * @override
   */
  enable = () => {
    this.debounceId && clearTimeout(this.debounceId);
    this.debounceId = null;
    this.interval = setInterval(this.onInterval, this.intervalDuration);
    for (const event of this.events) {
      this.slider.addEventListener(event, this.disableTemporarily, { passive: true });
    }
  };
  /**
   * @inheritDoc
   * @override
   */
  disable() {
    for (const event of this.events) {
      this.slider.removeEventListener(event, this.disableTemporarily);
    }
    this.interval && clearInterval(this.interval);
    this.interval = null;
    this.debounceId && clearTimeout(this.debounceId);
    this.debounceId = null;
  }
  /**
   * Disable the autoplay behaviour and set a timeout to re-enable it.
   */
  disableTemporarily = () => {
    if (!this.interval) {
      return;
    }
    clearInterval(this.interval);
    this.interval = null;
    this.debounceId && clearTimeout(this.debounceId);
    this.debounceId = setTimeout(this.enable, this.timeoutDuration);
  };
  /**
   * Callback for regular intervals to continue to the next slide
   */
  onInterval = () => {
    if (this.slider.plugins.has("ScrollSnapLoop")) {
      this.slider.slideTo(this.slider.slide + 1);
      return;
    }
    requestAnimationFrame(() => {
      const { scrollLeft, offsetWidth, scrollWidth } = this.slider.element;
      const isLastSlide = scrollLeft + offsetWidth === scrollWidth;
      const target = isLastSlide ? 0 : this.slider.slide + 1;
      this.slider.slideTo(target);
    });
  };
}
class ScrollSnapDraggable extends ScrollSnapPlugin {
  /**
   * If this is null:
   *  The next/previous slide will not be reached unless you drag for more than half the slider's width.
   *
   * If this is a number:
   *  Dragging any slide for more than this distance in pixels will slide to the next slide in the desired direction.
   */
  quickSwipeDistance;
  /**
   * Last drag event position
   */
  lastX;
  /**
   * Where the dragging started
   */
  startX;
  constructor(quickSwipeDistance = null) {
    super();
    this.lastX = null;
    this.startX = null;
    this.slider = null;
    this.quickSwipeDistance = quickSwipeDistance;
  }
  /**
   * @inheritDoc
   */
  get id() {
    return "ScrollSnapDraggable";
  }
  /**
   * @override
   */
  enable() {
    this.slider.element.classList.add("-draggable");
    this.slider.addEventListener("mousedown", this.startDragging);
    addEventListener("mouseup", this.stopDragging, { capture: true });
  }
  /**
   * @override
   */
  disable() {
    this.slider.element.classList.remove("-draggable");
    this.slider.removeEventListener("mousedown", this.startDragging);
    removeEventListener("mouseup", this.stopDragging, { capture: true });
    this.lastX = null;
  }
  /**
   * Disable scroll-snapping
   */
  onSlideStopAfterDrag = () => {
    this.slider.element.style.scrollSnapStop = "";
    this.slider.element.style.scrollSnapType = "";
  };
  /**
   * Calculate the target slide after dragging
   */
  getFinalSlide() {
    if (!this.quickSwipeDistance) {
      return this.slider.slide;
    }
    const distance = Math.abs(this.startX - this.lastX);
    const minimumNotReached = this.quickSwipeDistance > distance;
    const halfPointCrossed = distance > this.slider.itemSize / 2;
    if (minimumNotReached || halfPointCrossed) {
      return this.slider.slide;
    }
    if (this.startX < this.lastX) {
      return this.slider.slide - 1;
    }
    return this.slider.slide + 1;
  }
  /**
   * Scroll the slider the appropriate amount of pixels and update the last event position
   */
  mouseMove = (event) => {
    const distance = this.lastX - event.clientX;
    this.lastX = event.clientX;
    requestAnimationFrame(() => {
      this.slider.element.scrollLeft += distance;
    });
  };
  /**
   * Clear disable timeout, set up variables and styles and attach the listener.
   */
  startDragging = (event) => {
    event.preventDefault();
    this.startX = this.lastX = event.clientX;
    this.slider.element.style.scrollBehavior = "auto";
    this.slider.element.style.scrollSnapStop = "unset";
    this.slider.element.style.scrollSnapType = "none";
    this.slider.element.classList.add("-dragging");
    const autoplay = this.slider.plugins.get("ScrollSnapAutoplay");
    if (autoplay) {
      autoplay.disable();
    }
    addEventListener("mousemove", this.mouseMove);
  };
  /**
   * Remove listener and clean up the styles.
   * Note: We first restore the smooth behaviour, then manually snap to the current slide.
   * Using a timeout, we then restore the rest of the snap behaviour.
   */
  stopDragging = (event) => {
    if (this.lastX === null) {
      return;
    }
    event.preventDefault();
    const finalSlide = this.getFinalSlide();
    removeEventListener("mousemove", this.mouseMove);
    this.lastX = null;
    this.slider.element.style.scrollBehavior = "";
    this.slider.element.classList.remove("-dragging");
    this.slider.slideTo(finalSlide);
    const autoplay = this.slider.plugins.get("ScrollSnapAutoplay");
    if (autoplay) {
      autoplay.enable();
    }
    requestAnimationFrame(() => {
      const { scrollLeft, offsetWidth, scrollWidth } = this.slider.element;
      if (scrollLeft === 0 || scrollWidth - scrollLeft - offsetWidth === 0) {
        this.onSlideStopAfterDrag();
        return;
      }
      this.slider.addEventListener("slide-stop", this.onSlideStopAfterDrag, { once: true });
    });
  };
}
class ScrollSnapLoop extends ScrollSnapPlugin {
  /**
   * @inheritDoc
   */
  get id() {
    return "ScrollSnapLoop";
  }
  /**
   * @inheritDoc
   * @override
   */
  enable() {
    this.slider.addEventListener("slide-pass", this.loopSlides);
    this.slider.addEventListener("slide-stop", this.loopSlides);
    this.loopSlides();
  }
  /**
   * @inheritDoc
   * @override
   */
  disable() {
    this.slider.removeEventListener("slide-pass", this.loopSlides);
    this.slider.removeEventListener("slide-stop", this.loopSlides);
    const slides = this.slider.element.querySelectorAll("[data-index]");
    const sortedSlides = Array.from(slides).sort(this.sortFunction);
    Element.prototype.append.apply(this.slider.element, sortedSlides);
  }
  /**
   * Remove snapping behaviour
   */
  removeSnapping() {
    this.slider.detachListeners();
    this.slider.element.style.scrollBehavior = "auto";
    this.slider.element.style.scrollSnapStop = "unset";
    this.slider.element.style.scrollSnapType = "none";
  }
  /**
   * Add snapping behaviour
   */
  addSnapping() {
    this.slider.element.style.scrollBehavior = "";
    this.slider.element.style.scrollSnapStop = "";
    this.slider.element.style.scrollSnapType = "";
    this.slider.attachListeners();
    setTimeout(this.slider.update, 0);
  }
  /**
   * Move last slide to the start of the slider.
   */
  loopEndToStart() {
    requestAnimationFrame(() => {
      this.removeSnapping();
      this.slider.element.prepend(this.slider.element.children[this.slider.element.children.length - 1]);
      this.slider.element.scrollLeft += this.slider.itemSize;
      this.addSnapping();
    });
  }
  /**
   * Move first slide to the end of the slider.
   */
  loopStartToEnd() {
    requestAnimationFrame(() => {
      this.removeSnapping();
      this.slider.element.append(this.slider.element.children[0]);
      this.slider.element.scrollLeft -= this.slider.itemSize;
      this.addSnapping();
    });
  }
  /**
   * Determine which slide to move where and apply the change.
   */
  loopSlides = () => {
    if (this.slider.element.children.length < 3) {
      return;
    }
    requestAnimationFrame(() => {
      const { scrollLeft, offsetWidth, scrollWidth } = this.slider.element;
      if (scrollLeft < 5) {
        this.loopEndToStart();
        return;
      }
      if (scrollWidth - scrollLeft - offsetWidth < 5) {
        this.loopStartToEnd();
      }
    });
  };
  /**
   * Sort items to their initial position after disabling
   */
  sortFunction(a, b) {
    return parseInt(a.dataset.index, 10) - parseInt(b.dataset.index, 10);
  }
}
class ScrollSnapSlider {
  /**
   * Base element of this slider
   */
  element;
  /**
   * additional behaviour
   */
  plugins;
  /**
   * @inheritDoc
   */
  removeEventListener;
  /**
   * @inheritDoc
   */
  addEventListener;
  /**
   * Rounding method used to calculate the current slide (e.g. Math.floor, Math.round, Math.ceil, or totally custom.)
   *
   * @param value - factor indicating th current position (e.g "0" for first slide, "2.5" for third slide and a half)
   * @return f(x) - integer factor indicating the currently 'active' slide.
   */
  roundingMethod;
  /**
   * Timeout delay in milliseconds used to catch the end of scroll events
   */
  scrollTimeout;
  /**
   * Calculated size of a single item
   */
  itemSize;
  /**
   * Computes a single number representing the slides widths.
   * By default, this will use the first slide's <code>offsetWidth</code>.
   * Possible values could be an average of all slides, the min or max values, ...
   *
   * @param slider current slider
   * @param entries resized entries
   * @return integer size of a slide in pixels
   */
  sizingMethod;
  /**
   * Active slide
   */
  slide;
  /**
   * Resize observer used to update item size
   */
  resizeObserver;
  /**
   * Timeout ID used to catch the end of scroll events
   */
  scrollTimeoutId;
  /**
   * Active slide's scrollLeft in the containing element
   */
  slideScrollLeft;
  /**
   * Bind methods and possibly attach listeners.
   */
  constructor(options) {
    Object.assign(this, {
      scrollTimeout: 100,
      roundingMethod: Math.round,
      sizingMethod: (slider) => {
        return slider.element.firstElementChild.offsetWidth;
      },
      ...options
    });
    this.scrollTimeoutId = null;
    this.addEventListener = this.element.addEventListener.bind(this.element);
    this.removeEventListener = this.element.removeEventListener.bind(this.element);
    this.plugins = /* @__PURE__ */ new Map();
    this.resizeObserver = new ResizeObserver(this.rafSlideSize);
    this.resizeObserver.observe(this.element);
    for (const child of this.element.children) {
      this.resizeObserver.observe(child);
    }
    this.rafSlideSize();
    this.attachListeners();
  }
  /**
   * Extend the Slider's functionality with Plugins
   *
   * @param plugins Plugins to attach
   * @param enabled Whether the plugins are enabled right away
   */
  with(plugins, enabled = true) {
    for (const plugin of plugins) {
      plugin.slider = this;
      this.plugins.set(plugin.id, plugin);
      enabled && plugin.enable();
    }
    return this;
  }
  /**
   * Attach all necessary listeners
   */
  attachListeners() {
    this.addEventListener("scroll", this.onScroll, { passive: true });
  }
  /**
   * Detach all listeners
   */
  detachListeners() {
    this.removeEventListener("scroll", this.onScroll);
    this.scrollTimeoutId && clearTimeout(this.scrollTimeoutId);
  }
  /**
   * Scroll to a slide by index.
   */
  slideTo = (index) => {
    requestAnimationFrame(() => {
      this.element.scrollTo({
        left: index * this.itemSize
      });
    });
  };
  /**
   * Free resources and listeners, disable plugins
   */
  destroy() {
    this.scrollTimeoutId && clearTimeout(this.scrollTimeoutId);
    this.detachListeners();
    for (const [id, plugin] of this.plugins) {
      plugin.disable();
      plugin.slider = null;
      this.plugins.delete(id);
    }
  }
  /**
   * Updates the computed values
   */
  update = () => {
    requestAnimationFrame(() => {
      this.slide = this.roundingMethod(this.element.scrollLeft / this.itemSize);
      this.slideScrollLeft = this.slide * this.itemSize;
    });
  };
  /**
   * Calculate all necessary things and dispatch an event when sliding stops
   */
  onScrollEnd = () => {
    this.scrollTimeoutId = null;
    this.update();
    this.dispatch("slide-stop", this.slide);
  };
  /**
   * This will recompute the <code>itemSize</code>
   * @param entries Optional entries delivered from a ResizeObserver
   */
  rafSlideSize = (entries) => {
    requestAnimationFrame(() => {
      this.itemSize = this.sizingMethod(this, entries);
      this.update();
    });
  };
  /**
   * Dispatches an event on the slider's element
   */
  dispatch(event, detail) {
    return this.element.dispatchEvent(
      new CustomEvent(event, {
        detail
      })
    );
  }
  /**
   * Act when scrolling starts and stops
   */
  onScroll = () => {
    requestAnimationFrame(() => {
      const { scrollLeft } = this.element;
      const newSlide = this.roundingMethod(scrollLeft / this.itemSize);
      if (null === this.scrollTimeoutId) {
        const direction = scrollLeft > this.slideScrollLeft ? 1 : -1;
        this.dispatch("slide-start", this.slide + direction);
      }
      if (newSlide !== this.slide) {
        this.update();
        this.dispatch("slide-pass", this.slide);
      }
      this.scrollTimeoutId && clearTimeout(this.scrollTimeoutId);
      this.scrollTimeoutId = setTimeout(this.onScrollEnd, this.scrollTimeout);
    });
  };
}
export {
  ScrollSnapAutoplay,
  ScrollSnapDraggable,
  ScrollSnapLoop,
  ScrollSnapPlugin,
  ScrollSnapSlider
};
