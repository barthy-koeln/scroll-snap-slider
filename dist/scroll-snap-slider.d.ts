export declare class ScrollSnapAutoplay extends ScrollSnapPlugin {
    intervalDuration: number;
    timeoutDuration: number;
    private debounceId;
    private interval;
    private readonly events;
    constructor(intervalDuration?: number, timeoutDuration?: number, events?: string[]);
    get id(): string;
    enable: () => void;
    disable(): void;
    disableTemporarily: () => void;
    onInterval: () => void;
    resetInterval: () => void;
}

export declare class ScrollSnapDraggable extends ScrollSnapPlugin {
    quickSwipeDistance: number | null;
    private lastX;
    private startX;
    constructor(quickSwipeDistance?: number | null);
    get id(): string;
    enable(): void;
    disable(): void;
    private onSlideStopAfterDrag;
    private getFinalSlide;
    private mouseMove;
    private startDragging;
    private stopDragging;
}

export declare class ScrollSnapLoop extends ScrollSnapPlugin {
    get id(): string;
    enable(): void;
    disable(): void;
    private removeSnapping;
    private addSnapping;
    private loopEndToStart;
    private loopStartToEnd;
    private loopSlides;
    private sortFunction;
}

export declare abstract class ScrollSnapPlugin {
    slider: ScrollSnapSlider | null;
    constructor();
    abstract get id(): string;
    abstract enable(): void;
    abstract disable(): void;
}

export declare class ScrollSnapSlider {
    element: HTMLElement;
    plugins: Map<string, ScrollSnapPlugin>;
    removeEventListener: HTMLElement['removeEventListener'];
    addEventListener: HTMLElement['addEventListener'];
    roundingMethod: (value: number) => number;
    scrollTimeout: number;
    itemSize: number;
    sizingMethod: (slider: ScrollSnapSlider, entries?: ResizeObserverEntry[] | undefined) => number;
    slide: number;
    private resizeObserver;
    private scrollTimeoutId;
    private slideScrollLeft;
    constructor(options: ScrollSnapSliderOptions);
    with(plugins: ScrollSnapPlugin[], enabled?: boolean): ScrollSnapSlider;
    attachListeners(): void;
    detachListeners(): void;
    slideTo: (index: number) => void;
    destroy(): void;
    update: () => void;
    private onScrollEnd;
    private onResize;
    private dispatch;
    private onScroll;
}

declare type ScrollSnapSliderOptions = Partial<ScrollSnapSlider> & {
    element: HTMLElement;
};

export { }
