import '@/demo/slider-simple'
import '@/demo/slider-multi'
import '@/demo/slider-responsive'
import './index.css'

document.body.dataset.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
document.body.dataset.motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduced' : 'normal'

document.addEventListener('DOMContentLoaded', function () {
  const themeButton = document.querySelector<HTMLInputElement>('.toggle-theme input')
  const motionButton = document.querySelector<HTMLInputElement>('.toggle-motion input')

  if (document.body.dataset.theme === 'dark') {
    themeButton.setAttribute('checked', '')
  }

  if (document.body.dataset.motion === 'reduced') {
    motionButton.setAttribute('checked', '')
  }
  themeButton.addEventListener('change', function () {
    document.body.dataset.theme = themeButton.checked ? 'dark' : 'light'
  })
  motionButton.addEventListener('change', function () {
    document.body.dataset.motion = motionButton.checked ? 'reduced' : 'normal'
  })
})
