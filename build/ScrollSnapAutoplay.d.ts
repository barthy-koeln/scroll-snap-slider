import { ScrollSnapPlugin } from './ScrollSnapPlugin.js';
export declare class ScrollSnapAutoplay extends ScrollSnapPlugin {
    intervalDuration: number;
    timeoutDuration: number;
    private debounceId;
    private interval;
    constructor(intervalDuration?: number, timeoutDuration?: number);
    get id(): string;
    enable: () => void;
    disable(): void;
    disableTemporarily: () => void;
    onInterval: () => void;
}
