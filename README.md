# Scroll Snap Slider

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![DeepScan grade](https://badgen.net/deepscan/grade/team/11039/project/14107/branch/253421)](https://deepscan.io/dashboard#view=project&tid=11039&pid=14107&bid=253421)
[![Tree Shaking: Supported](https://badgen.net/bundlephobia/tree-shaking/scroll-snap-slider)](https://bundlephobia.com/result?p=scroll-snap-slider)
<br>
[![npm Version](https://badgen.net/npm/v/scroll-snap-slider)](https://www.npmjs.com/package/scroll-snap-slider)
[![Dependency Count: 0](https://badgen.net/bundlephobia/dependency-count/scroll-snap-slider)](https://bundlephobia.com/result?p=scroll-snap-slider)
[![mminzippped Size](https://badgen.net/bundlephobia/minzip/scroll-snap-slider)](https://bundlephobia.com/result?p=scroll-snap-slider)

Mostly CSS slider with great performance. See a [demo](https://barthy-koeln.github.io/scroll-snap-slider/).

## Premise

This library is a shortcut to something I personally have to implement in almost every website. To keep it small (see
badges above), there are not many fancy features, no error handling.

However, with a clear API and the use of a ES6 class, it can provide a useful base for custom extensions.

What this module contains:

* Example markup for a `scroll-snap` slider
* CSS default styling for a `scroll-snap` slider without scrollbars
* ES6 class to slightly enhance functionality
* ES6 class plugins for `loop`, `autoplay`, and `draggable` features

For a more "fully-featured" implementation, go
to [Tanner Hodges' snap-slider](https://tannerhodges.github.io/snap-slider/)

## Installing

```shell
npm install barthy-koeln/scroll-snap-slider 

yarn add barthy-koeln/scroll-snap-slider
```

## Usage

HTML + CSS are enough for a working slider. You can use IDs and anchor links to create navigation buttons.

The ES6 class provided in this package augments the slider with a few events and methods.

### Markup

Slides always have 100% width. You can add whatever markup inside.

```html

<div class="scroll-snap-slider">
  <div class="scroll-snap-slide">
    <img src="https://picsum.photos/id/1011/400/300"/>
  </div>
  <div class="scroll-snap-slide">
    <img src="https://picsum.photos/id/1018/400/300"/>
  </div>
</div>
```

### SCSS

```scss
@import '~scroll-snap-slider';
```

```css
@import '~scroll-snap-slider/src/scroll-snap-slider.css';
```

### Additional Styles

Prevents page navigation on horizontal scrolling, i.E. on MacOS.
[\[Support tables\]](https://caniuse.com/?search=overscroll-behavior)

```css
.scroll-snap-slider {
  overscroll-behavior: none;
}
```

Prevents scrolling past elements in the slider:
[\[Support tables\]](https://caniuse.com/?search=scroll-snap-stop)

```css
.scroll-snap-slide {
  scroll-snap-stop: always;
}
```

### JavaScript

If you do not want to add any additional behaviour, the JavaScript instance is not needed. This class dispatches several
events and exposes a few methods, with which you can enhance your slider's behaviour.

**Default behaviour:**

```javascript
import { ScrollSnapSlider } from 'scroll-snap-slider'

const slider = new ScrollSnapSlider(document.querySelector(".example-slider"));

slider.addEventListener('slide-start', function (event) {
  console.info(`Started sliding towards slide ${event.detail}.`)
})

slider.addEventListener('slide-pass', function (event) {
  console.info(`Passing slide ${event.detail}.`)
})

slider.addEventListener('slide-stop', function (event) {
  console.info(`Stopped sliding at slide ${event.detail}.`)
})
```

**Advanced config:**

```javascript
import { ScrollSnapSlider } from 'scroll-snap-slider'

// Do not automatically attach scroll listener
const slider = new ScrollSnapSlider(document.querySelector(".example-slider"), false);

slider.scrollTimeout = 50 // Sets a shorter tiemout to detect scroll end

// Rounding Method
// Note: These methods depend on the direction of scrolling, hence the "next one" is crucial.
// When scrolling in the opposite direction, the effects are reversed.
// I have found this to an edge case, when Math.round timing was slighlty off for the first exploration of a web page.
slider.roundingMethod = Math.ceil // Trigger 'active' slide changes as soon as the next one is visible
slider.roundingMethod = Math.floor // Trigger 'active' slide changes only when the next one is fully visible

slider.sizingMethod = function (slider) {
  return slider.element.firstElementChild.offsetWidth // with padding?
  return slider.element.firstElementChild.clientWidth // without padding..
}

slider.listenerOptions = supportsPassive ? { passive: true } : false // test support for passive listeners first

// Now that we've set the listenerOptions, we can attach the listener
slider.attachListeners()
```

**Plugins:**

You can add one or multiple of the available Plugins:

* `ScrollSnapAutoplay`: Automatically slides at a given interval
* `ScrollSnapLoop`: Sliding past the last element shows the first without sliding to the start (and vice-versa)
* `ScrollSnapDraggable`: Drag the slider with your mouse. Note: this does not affect mobile behaviour and is not
  necessary for touch sliding.

Additional Note: The `ScrollSnapDraggable` and `ScrollSnapLoop` do not work well together.

```javascript
import { ScrollSnapSlider } from 'scroll-snap-slider/src/ScrollSnapSlider.js'
import { ScrollSnapAutoplay } from 'scroll-snap-slider/src/ScrollSnapAutoplay.js'
import { ScrollSnapLoop } from 'scroll-snap-slider/src/ScrollSnapLoop.js'

const sliderElement = document.querySelector('.example-slider')
const slider = new ScrollSnapSlider(sliderElement, true, [
  new ScrollSnapAutoplay(1200),
  new ScrollSnapLoop
])
```

Creating your own plugin:

```javascript
export class CustomPlugin extends ScrollSnapPlugin {

  /**
   * Pass any config here
   * @param {*} config
   */
  constructor (config) {
    super()

    this.config = config
  }

  /**
   * Override this if you need multiple instances of the same plugin on the same slider.
   * By default, the id will be the plugin's class name.
   * @return {String}
   */
  get id () {
    return 'lubba-wubba-dub-dub'
  }

  /**
   * Attach listeners, fetch DOM things, save reference to the slider
   * @param {ScrollSnapSlider} slider
   * @override
   */
  enable (slider) {
    // TODO methods stub
  }

  /**
   * Free resources, remove listeners, ...
   * @override
   */
  disable () {
    // TODO methods stub
  }
}
```

## API

| Method                          | Description                                                                 |
|-------------------------------- |-----------------------------------------------------------------------------|
| `slideTo(index: Number): void`  | Scrolls to slide with at `index`.                                           |
| `addEventListener(...)`         | This is a shortcut for `slider.element.addEventListener(...)`.              |
| `removeEventListener(...)`      | This is a shortcut for `slider.element.removeEventListener(...)`.           |
| `attachEventListeners()`        | Enables the JS behaviour of this plugin. This is called in the constructor. |
| `destroy()`                     | Free resources and listeners. You can/should do `slider = null` after this. |

## Events

Events dispatched on the slider's `element`:

| Event Name      | Event Detail Type | Description                                                                                                                                  |
|-----------------|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| `slide-start`   | `Number`          | Dispatched when sliding starts toward slide at `event.detail`.                                                                               |
| `slide-pass`    | `Number`          | Dispatched when sliding passes (crosses the threshold to) slide at `event.detail`. The threshold is defined/altered by the `roundingMethod`. |
| `slide-stop`    | `Number`          | Dispatched when sliding stopped at index `event.detail`, i.e. the last scroll event happened before `scrollTimeout` ms.                      |

You can use the proxy methods `addEventListener` and `removeEventListener` to listen to them.

## Public Properties

| Property                       | Description                                                           |
|--------------------------------|-----------------------------------------------------------------------|
| `slide: Number` (read only)    | Currently active slide.                                               |
| `element: Element` (read only) | The element passed into the constructor.                              |
| `slideScrollLeft` (read only)  | the `element.scrollLeft` value of the currently active slide.         |
| `scrollTimeout: Number`        | Timeout delay in milliseconds used to catch the end of scroll events. |
| `plugins: Map<String, ScrollSnapPlugin>`  | Map of plugins enabled for this slider |

## Support

Check out the
[support tables for CSS scroll snap](https://caniuse.com/css-snappoints). Note that it's up to you to inject potential
vendor prefixes.
