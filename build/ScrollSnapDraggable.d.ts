import { ScrollSnapPlugin } from './ScrollSnapPlugin.js';
export declare class ScrollSnapDraggable extends ScrollSnapPlugin {
    quickSwipeDistance: number | null;
    private disableTimeout;
    private lastX;
    private startX;
    constructor(quickSwipeDistance?: number | null);
    get id(): string;
    enable(): void;
    disable(): void;
    private getFinalSlide;
    private mouseMove;
    private startDragging;
    private stopDragging;
}
