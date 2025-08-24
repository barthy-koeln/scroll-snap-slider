# Scroll Snap Slider

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Maintainability](https://api.codeclimate.com/v1/badges/c4c7edd819ca59e9f5e2/maintainability)](https://codeclimate.com/github/barthy-koeln/scroll-snap-slider/maintainability)
[![Tree Shaking: Supported](https://badgen.net/bundlephobia/tree-shaking/scroll-snap-slider)](https://bundlephobia.com/result?p=scroll-snap-slider)
<br>
[![npm Version](https://badgen.net/npm/v/scroll-snap-slider)](https://www.npmjs.com/package/scroll-snap-slider)
[![Dependency Count: 0](https://badgen.net/bundlephobia/dependency-count/scroll-snap-slider)](https://bundlephobia.com/result?p=scroll-snap-slider)
[![minzipped Size](https://badgen.net/bundlephobia/minzip/scroll-snap-slider)](https://bundlephobia.com/result?p=scroll-snap-slider)

Mostly CSS slider with great performance.

[demo](https://barthy-koeln.github.io/scroll-snap-slider/) | [docs](https://barthy-koeln.github.io/scroll-snap-slider/docs/)

## Table of Contents

- [Premise](#premise)
- [Sizes](#sizes)
- [Restrictions](#restrictions)
- [Installing](#installing)
- [Usage](#usage)
    - [Markup](#markup)
    - [CSS](#css)
    - [Additional Styles](#additional-styles)
    - [JavaScript](#javascript)
- [API](#api)
- [Events](#events)
- [Public Properties](#public-properties)
- [Support](#support)
- [Contributing](#contributing)

## Features

* Native touch integration (draggable)
* Native scroll integration (any peripheral — if it can scroll, it can use this slider)
* Full HTML slides (any content possible)
* Usable with native DOM methods like `scrollIntoView()`

## Premise

This library is an opinionated minimal implementation of a common feature across many websites.
To keep it small, there are not many fancy features and there is almost no error handling.

However, with a clear API and the use of a ES6 class, it can provide a useful base for custom extensions.

What this module contains:

* Example markup for a `scroll-snap` slider
* CSS default styling for a `scroll-snap` slider without scrollbars
* ES6 class to slightly enhance functionality
* ES6 class plugins for `loop`, `autoplay`, and desktop/mouse `draggable` features
* TypeScript Typings

## Sizes

Here are the sizes of individual modules, using terser and gzip with default options.

| Item             | minified (terser) | minified + gzipped |
|------------------|-------------------|--------------------|
| complete exports | 8.4 kB            | 2.1 kB             |

## Restrictions

This library only handles sliders on the X-axis.

For more "fully-featured" implementations, go to:

* [Nick Piscitelli's Glider.js](https://github.com/NickPiscitelli/Glider.js)
* [Tanner Hodges' snap-slider](https://tannerhodges.github.io/snap-slider/)

## Installing

```shell
npm install scroll-snap-slider 

yarn add scroll-snap-slider
```

## Usage

The class provided in this package augments a slider with a few events and methods.

### Markup

You can add whatever markup inside the slides.

```html

<ul class="scroll-snap-slider">
  <li class="scroll-snap-slide">
    <img
      alt=""
      src="https://picsum.photos/id/1011/400/300"
    />
  </li>
  <li class="scroll-snap-slide">
    <img
      alt=""
      src="https://picsum.photos/id/1018/400/300"
    />
  </li>
</ul>
```

### CSS

```css
@import 'scroll-snap-slider';
```

### Additional Styles

Prevents page navigation on horizontal scrolling, i.E. on macOS.
[\[Support tables\]](https://caniuse.com/?search=overscroll-behavior)

```css
.scroll-snap-slider {
  overscroll-behavior-x: none;
  overscroll-behavior-y: auto;
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

const element = document.querySelector('.example-slider')
const slider = new ScrollSnapSlider({ element })

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
const slider = new ScrollSnapSlider({
  element: document.querySelector('.example-slider'),
  scrollTimeout: 50, // Sets a shorter timeout to detect scroll end
  roundingMethod: Math.round, // Dispatch 'slide-pass' events around the center of each slide
  // roundingMethod: Math.ceil, // Dispatch 'slide-pass' events as soon as the next one is visible
  // roundingMethod: Math.floor, // Dispatch 'slide-pass' events only when the next one is fully visible
  sizingMethod (slider) {

    // with padding
    return slider.element.firstElementChild.offsetWidth

    // without padding
    // return slider.element.firstElementChild.clientWidth
  }
})
```

**Plugins:**

You can add one or multiple of the available Plugins:

* `ScrollSnapAutoplay`: Automatically slides at a given interval
* `ScrollSnapLoop`: Sliding past the last element shows the first without sliding to the start (and vice-versa)
* `ScrollSnapDraggable`: Drag the slider with your mouse. Note: this does not affect mobile behaviour and is not
  necessary for touch sliding.

```javascript
import { ScrollSnapSlider, ScrollSnapAutoplay, ScrollSnapLoop } from 'scroll-snap-slider';

const element = document.querySelector('.example-slider')
const slider = new ScrollSnapSlider({ element }).with([
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
   * Chose a unique plugin name. If you need multiple instances of the same plugin on a slider, each must return a unique id.
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
    // TODO method stub
  }

  /**
   * Free resources, remove listeners, ...
   * @override
   */
  disable () {
    // TODO method stub
  }
}
```

## API

| Method                         | Description                                                                 |
|--------------------------------|-----------------------------------------------------------------------------|
| `slideTo(index: Number): void` | Scrolls to slide at `index`.                                                |
| `addEventListener(...)`        | This is a shortcut for `slider.element.addEventListener(...)`.              |
| `removeEventListener(...)`     | This is a shortcut for `slider.element.removeEventListener(...)`.           |
| `attachEventListeners()`       | Enables the JS behaviour of this plugin. This is called in the constructor. |
| `detachEventListeners()`       | Disables the JS behaviour of this plugin.                                   |
| `destroy()`                    | Free resources and listeners. You can/should do `slider = null` after this. |

## Events

Events dispatched on the slider's `element`:

| Event Name    | Event Detail Type | Description                                                                                                                                  |
|---------------|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| `slide-start` | `Number`          | Dispatched when sliding starts toward slide at `event.detail`.                                                                               |
| `slide-pass`  | `Number`          | Dispatched when sliding passes (crosses the threshold to) slide at `event.detail`. The threshold is defined/altered by the `roundingMethod`. |
| `slide-stop`  | `Number`          | Dispatched when sliding stopped at index `event.detail`, i.e. the last scroll event happened before `scrollTimeout` ms.                      |

You can use the proxy methods `addEventListener` and `removeEventListener` to listen to them.

If you want proper typing for these events in TypeScript, you can augment the global `HTMLElementEventMap` interface:

```ts
declare global {
  interface HTMLElementEventMap {
    'slide-pass': CustomEvent<number>;
    'slide-stop': CustomEvent<number>;
    'slide-start': CustomEvent<number>;
  }
}
```

or copy/import them from `scroll-snap-slider/global.d.ts`.

## Public Properties

| Property                                 | Description                                                           |
|------------------------------------------|-----------------------------------------------------------------------|
| `slide: Number` (read only)              | Currently active slide.                                               |
| `element: Element` (read only)           | The element passed into the constructor.                              |
| `scrollTimeout: Number`                  | Timeout delay in milliseconds used to catch the end of scroll events. |
| `plugins: Map<String, ScrollSnapPlugin>` | Map of plugins enabled for this slider                                |

## Support

Check out the [support tables for CSS scroll snap](https://caniuse.com/css-snappoints).
Note that it's up to you to inject or add vendor specific code.

## Contributing

Feel free to open issues and pull requests, but keep the minimalist approach of this project in mind. When in doubt,
open an issue first and we can discuss.

### Running locally

```shell
yarn # install deps
yarn dev # run a local dev-server of the demo
yarn build # build the module 
```
