import { ScrollSnapPlugin } from './ScrollSnapPlugin.js';
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
