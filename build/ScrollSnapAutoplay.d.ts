import { ScrollSnapPlugin } from './ScrollSnapPlugin.js';
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
}
