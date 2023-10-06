import { ScrollSnapPlugin } from './ScrollSnapPlugin';
export type ScrollSnapSliderOptions = Partial<ScrollSnapSlider> & {
    element: HTMLElement;
};
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
    private rafSlideSize;
    private dispatch;
    private onScroll;
}
