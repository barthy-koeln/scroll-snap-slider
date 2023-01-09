import { ScrollSnapPlugin } from './ScrollSnapPlugin.js';
export declare class ScrollSnapLoop extends ScrollSnapPlugin {
    get id(): string;
    enable(): void;
    disable(): void;
    removeSnapping(): void;
    addSnapping(): void;
    private loopEndToStart;
    private loopStartToEnd;
    private loopSlides;
    private sortFunction;
}
