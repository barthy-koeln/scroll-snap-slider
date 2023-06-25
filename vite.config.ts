import {resolve} from 'path'
import {defineConfig} from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts()
  ],
  build: {
    target: 'ESNext',
    minify: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'scroll-snap-slider'
    }
  },
})
