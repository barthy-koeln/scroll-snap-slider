import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'


export default defineConfig(({ mode }) => {
  if(mode === 'lib') {
    return {
      base: './',
      plugins: [
        dts({ rollupTypes: true })
      ],
      build: {
        target: 'ESNext',
        minify: false,
        emptyOutDir: false,
        lib: {
          entry: resolve(__dirname, 'src/lib/index.ts'),
          name: 'ScrollSnapSlider',
          formats: ['es', 'cjs', 'umd', 'iife'],
          fileName: 'scroll-snap-slider'
        }
      },
    }
  }

  return {
    root: resolve(__dirname, './src/demo'),
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        'scroll-snap-slider': resolve(__dirname, './src/lib/index.ts')
      }
    },
    build: {
      emptyOutDir: true,
      outDir: resolve(__dirname, './demo'),
      rollupOptions: {
        input: {
          main: resolve(__dirname, './src/demo/index.html'),
        }
      }
    }
  }
})
