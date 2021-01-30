# Scroll Snap Slider

[![DeepScan grade](https://deepscan.io/api/teams/11039/projects/14107/branches/253421/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=11039&pid=14107&bid=253421)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Mostly CSS slider with great performance. See a [demo on codepen](https://codepen.io/BarthyB/full/JjXgzOL).

## Installing

```shell script
yarn add barthy-koeln/scroll-snap-slider
```

## Usage

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

```javascript
import {ScrollSnapSlider} from 'scroll-snap-slider'

const slider = new ScrollSnapSlider(document.querySelector(".example-slider"));

slider.addEventListener('slide-to', function(event){
  console.info(`Started sliding towards slide ${event.detail}.`)
})

slider.addEventListener('slide-changed', function(event){
  console.info(`Stopped sliding at slide ${event.detail}.`)
})
```

```scss
@import '~scroll-snap-slider';
```

## Y u no implement features?

This library is a shortcut to something I personally have to
implement in almost every website. To keep it small, there are no fancy
features, no error handling, and so on.

## API

| method                          | description                                                             |
|-------------------------------- |-------------------------------------------------------------------------|
| `slideTo(index: Number): void` | Scrolls to slide with at `index`.                                       |
| `addEventListener(...)`         | This is a shortcut for `slider.element.addEventListener(...)`           |
| `removeEventListener(...)`      | This is a shortcut for `slider.element.removeEventListener(...)`        |
| `destroy()`                     | Free resources and listeners. You should do `slider = null` after this. |

## Events

Events dispatched on the slider's `element`:

| event name      | event detail type | description                                                   |
|-----------------|-------------------|---------------------------------------------------------------|
| `slide-start`   | `Number`          | Dispatched when sliding starts toward slide at `event.detail` |
| `slide-stop`    | `Number`          | Dispatched when sliding stopped at index `event.detail`       |


You can use the proxy methods `addEventListener` and `removeEventListener` to listen to them.

## Support

Check out the
[support tables for CSS scroll snap](https://caniuse.com/css-snappoints).
Note that it's up to you to inject potential vendor prefixes.
