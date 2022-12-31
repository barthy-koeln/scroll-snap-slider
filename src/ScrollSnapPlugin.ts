import type { ScrollSnapSlider } from './ScrollSnapSlider'

export abstract class ScrollSnapPlugin {
  public slider: ScrollSnapSlider | null

  protected constructor () {
    this.slider = null
  }

  /**
   * Unique Plugin ID
   */
  public abstract get id (): string

  /**
   * Override this with custom behaviour.
   */
  public abstract enable (): void

  /**
   * Override this with custom behaviour.
   */
  public abstract disable (): void

}