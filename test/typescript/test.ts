import {
  ScrollSnapSlider,
  ScrollSnapAutoplay,
  ScrollSnapDraggable,
  ScrollSnapLoop,
  ScrollSnapPlugin
} from 'scroll-snap-slider'

console.log('TypeScript Import Test')
console.log('======================')
console.log('ScrollSnapSlider:', typeof ScrollSnapSlider)
console.log('ScrollSnapAutoplay:', typeof ScrollSnapAutoplay)
console.log('ScrollSnapDraggable:', typeof ScrollSnapDraggable)
console.log('ScrollSnapLoop:', typeof ScrollSnapLoop)
console.log('ScrollSnapPlugin:', typeof ScrollSnapPlugin)

const slider: ScrollSnapSlider | null = null

if (typeof ScrollSnapSlider !== 'function') {
  console.error('ERROR: ScrollSnapSlider should be a function/class')
  process.exit(1)
}

console.log('\n✓ All exports loaded successfully with types')
