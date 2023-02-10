import { ScrollSnapPlugin } from './ScrollSnapPlugin.js';
export declare class ScrollSnapDraggable extends ScrollSnapPlugin {
    quickSwipeDistance: number | null;
    private enableTimeout;
    private lastX;
    private startX;
    constructor(quickSwipeDistance?: number | null);
    get id(): string;
    enable(): void;
    disable(): void;
    onSlideStopAfterDrag: () => void;
    private getFinalSlide;
    private mouseMove;
    private startDragging;
    private stopDragging;
}
