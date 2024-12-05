/**
 * Timer utility class with start, resume, stop and reset functionality
 */
export class Timer {
    private timerId: number | null = null;
    private startTime: number = 0;
    private remainingTime: number = 0;
    private isRunning: boolean = false;
    private readonly interval: number;
    private readonly callback: () => void;

    constructor(callback: () => void, interval: number = 5000) {
        this.callback = callback;
        this.interval = interval;
    }

    start(): void {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startTime = Date.now();
            this.scheduleNextTick();
        }
    }

    stop(): void {
        if (this.isRunning) {
            this.isRunning = false;
            if (this.timerId !== null) {
                window.clearTimeout(this.timerId);
                this.timerId = null;
            }
            this.remainingTime = this.interval - (Date.now() - this.startTime);
        }
    }

    resume(): void {
        if (!this.isRunning && this.remainingTime > 0) {
            this.isRunning = true;
            this.startTime = Date.now() - (this.interval - this.remainingTime);
            this.scheduleNextTick();
        } else if (!this.isRunning) {
            this.start();
        }
    }

    reset(): void {
        this.stop();
        this.remainingTime = 0;
        this.startTime = 0;
    }

    private scheduleNextTick(): void {
        const nextTick = this.remainingTime || this.interval;
        this.remainingTime = 0;

        this.timerId = window.setTimeout(() => {
            if (this.isRunning) {
                this.callback();
                this.startTime = Date.now();
                this.scheduleNextTick();
            }
        }, nextTick);
    }
}