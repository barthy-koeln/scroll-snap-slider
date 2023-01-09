import type { ScrollSnapSlider } from './ScrollSnapSlider';
export declare abstract class ScrollSnapPlugin {
    slider: ScrollSnapSlider | null;
    protected constructor();
    abstract get id(): string;
    abstract enable(): void;
    abstract disable(): void;
}
