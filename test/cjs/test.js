const {
  ScrollSnapSlider,
  ScrollSnapAutoplay,
  ScrollSnapDraggable,
  ScrollSnapLoop
} = require('scroll-snap-slider')

console.log('CommonJS Import Test')
console.log('====================')
console.log('ScrollSnapSlider:', typeof ScrollSnapSlider)
console.log('ScrollSnapAutoplay:', typeof ScrollSnapAutoplay)
console.log('ScrollSnapDraggable:', typeof ScrollSnapDraggable)
console.log('ScrollSnapLoop:', typeof ScrollSnapLoop)

if (typeof ScrollSnapSlider !== 'function') {
  console.error('ERROR: ScrollSnapSlider should be a function/class')
  process.exit(1)
}

console.log('\n✓ All exports loaded successfully')
