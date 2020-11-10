# Scroll Snap Slider

[![DeepScan grade](https://deepscan.io/api/teams/11039/projects/14107/branches/253421/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=11039&pid=14107&bid=253421)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Mostly CSS slider with great performance. See a [demo on codepen](https://codepen.io/BarthyB/pen/JjXgzOL).

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

slider.addEventListener('slide-changed', function(event){
  console.info(`Slide at Index ${event.detail} selected.`)
})
```

```scss
@import '~scroll-snap-slider';
```

## Y u no implement features?

This library is a shortcut to something I personally have to
implement in almost every website. To keep it small, there are no fancy
features, no error handling, and so on.

## Support

Check out the
[support tables for CSS scroll snap](https://caniuse.com/css-snappoints).
Note that it's up to you to inject potential vendor prefixes.
