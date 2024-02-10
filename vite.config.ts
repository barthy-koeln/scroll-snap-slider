import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  base: './',
  plugins: [
    dts({ rollupTypes: true })
  ],
  build: {
    target: 'ESNext',
    minify: false,
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ScrollSnapSlider',
      formats: ['es', 'cjs', 'umd', 'iife'],
      fileName: 'scroll-snap-slider'
    }
  },
})
