import { resolve } from 'path'
import dts from 'unplugin-dts/vite'
import { defineConfig } from 'vite'


export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    return {
      base: './',
      plugins: [
        dts({
          include: ['src/lib/**/*'],
          bundleTypes: true,
          copyDtsFiles: true
        }),
      ],
      build: {
        target: 'ESNext',
        minify: false,
        emptyOutDir: false,
        lib: {
          entry: resolve(__dirname, 'src/lib/index.ts'),
          name: 'ScrollSnapSlider',
          formats: ['es', 'cjs', 'umd', 'iife'],
          fileName: 'scroll-snap-slider',
        },
      },
    }
  }

  return {
    root: resolve(__dirname, './src/demo'),
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        'scroll-snap-slider': resolve(__dirname, './src/lib/index.ts'),
      },
    },
    build: {
      emptyOutDir: true,
      outDir: resolve(__dirname, './demo'),
      rollupOptions: {
        input: {
          main: resolve(__dirname, './src/demo/index.html'),
        },
      },
    },
  }
})
