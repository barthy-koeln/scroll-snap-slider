# Scroll Snap Slider

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![DeepScan grade](https://badgen.net/deepscan/grade/team/11039/project/14107/branch/253421)](https://deepscan.io/dashboard#view=project&tid=11039&pid=14107&bid=253421)
[![Tree Shaking: Supported](https://badgen.net/bundlephobia/tree-shaking/scroll-snap-slider)](https://bundlephobia.com/result?p=scroll-snap-slider)
<br>
[![npm Version](https://badgen.net/npm/v/scroll-snap-slider)](https://www.npmjs.com/package/scroll-snap-slider)
[![Dependency Count: 0](https://badgen.net/bundlephobia/dependency-count/scroll-snap-slider)](https://bundlephobia.com/result?p=scroll-snap-slider)
[![mminzippped Size](https://badgen.net/bundlephobia/minzip/scroll-snap-slider)](https://bundlephobia.com/result?p=scroll-snap-slider)


Mostly CSS slider with great performance. See a [demo on codepen](https://codepen.io/BarthyB/full/JjXgzOL).

## Premise

This library is a shortcut to something I personally have to
implement in almost every website. To keep it small (see badges above), there are no fancy
features, no error handling.

However, with a clear API and the use of a ES6 class, it can provide a useful base for custom extensions.

What this module contains:

* Example markup for a scroll-snap slider
* SCSS default styling for a scroll-snap slider without scrollbars
* ES6 class to slightly enhance functionality

## Installing

```shell script
yarn add barthy-koeln/scroll-snap-slider
```

## Usage

HTML + CSS are enough for a working slider. You can use IDs and anchor links to create navigation buttons.

The ES6 class provided in this package augments the slider with a few events and methods.

### Markup

Slides always have 100% width. You can add whatever markup inside.

```html
  <div class="scroll-snap-slider example-slider">
    <div class="scroll-snap-slide">
      <img src="https://picsum.photos/id/1011/400/300" />
    </div>
    <div class="scroll-snap-slide">
      <img src="https://picsum.photos/id/1018/400/300" />
    </div>
  </div>
```

### SCSS

```scss
@import '~scroll-snap-slider';
```

### JavaScript

```javascript
import { ScrollSnapSlider } from 'scroll-snap-slider'

const slider = new ScrollSnapSlider(document.querySelector(".example-slider"));

slider.addEventListener('slide-start', function(event){
  console.info(`Started sliding towards slide ${event.detail}.`)
})

slider.addEventListener('slide-pass', function(event){
  console.info(`Passing slide ${event.detail}.`)
})

slider.addEventListener('slide-stop', function(event){
  console.info(`Stopped sliding at slide ${event.detail}.`)
})
```

## API

| Method                          | Description                                                             |
|-------------------------------- |-------------------------------------------------------------------------|
| `slideTo(index: Number): void`  | Scrolls to slide with at `index`.                                       |
| `addEventListener(...)`         | This is a shortcut for `slider.element.addEventListener(...)`.          |
| `removeEventListener(...)`      | This is a shortcut for `slider.element.removeEventListener(...)`.       |
| `destroy()`                     | Free resources and listeners. You should do `slider = null` after this. |

## Events

Events dispatched on the slider's `element`:

| Event Name      | Event Detail Type | Description                                                                        |
|-----------------|-------------------|------------------------------------------------------------------------------------|
| `slide-start`   | `Number`          | Dispatched when sliding starts toward slide at `event.detail`.                     |
| `slide-pass`    | `Number`          | Dispatched when sliding passes (crosses the threshold to) slide at `event.detail`. |
| `slide-stop`    | `Number`          | Dispatched when sliding stopped at index `event.detail`.                           |

You can use the proxy methods `addEventListener` and `removeEventListener` to listen to them.

## Public Properties

| Property                       | Description                                                           |
|--------------------------------|-----------------------------------------------------------------------|
| `slide: Number` (read only)    | Currently active slide.                                               |
| `element: Element` (read only) | The element passed into the constructor.                              |
| `slideScrollLeft` (read only)  | the `element.scrollLeft` value of the currently active slide.         |
| `scrollTimeout: Number`        | Timeout delay in milliseconds used to catch the end of scroll events. |

## Support

Check out the
[support tables for CSS scroll snap](https://caniuse.com/css-snappoints).
Note that it's up to you to inject potential vendor prefixes.
