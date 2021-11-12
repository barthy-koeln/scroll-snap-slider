export class ScrollSnapPlugin {

  /**
   * Unique Plugin ID
   * @public
   * @return {string}
   */
  get id () {
    return this.constructor.name
  }

  /**
   * Override this with custom behaviour.
   * @param {ScrollSnapSlider} slider
   * @public
   */
  enable (slider) {
    console.error(`${this.id}: implementation of enable() method missing.`, slider)
  }

  /**
   * Override this with custom behaviour.
   * @public
   */
  disable () {
    console.error(`${this.id}: implementation of disable() method missing.`)
  }

}