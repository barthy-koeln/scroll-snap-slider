import type { ScrollSnapSlider } from './ScrollSnapSlider'

/**
 * Abstract class used for plugins, that extend the slider's behaviour.
 */
export abstract class ScrollSnapPlugin {

  /**
   * Reference to the slider this plugin is attached to.
   */
  public slider: ScrollSnapSlider | null

  public constructor () {
    this.slider = null
  }

  /**
   * Unique Plugin ID, used as index in <code>ScrollSnapSlider::plugins</code>.
   * @see {ScrollSnapSlider.plugins}
   */
  public abstract get id (): string

  /**
   * Add listeners, compute things and enable the desired behaviour.
   * Override this with custom behaviour.
   */
  public abstract enable (): void

  /**
   * Remove listeners, clean up dependencies and free up memory.
   * Override this with custom behaviour.
   */
  public abstract disable (): void

}
