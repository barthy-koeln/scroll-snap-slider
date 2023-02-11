import { ScrollSnapPlugin } from './ScrollSnapPlugin.js';
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
