import '@/demo/slider-simple'
import '@/demo/slider-multi'
import '@/demo/slider-responsive'
import './index.css'

document.body.dataset.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

document.addEventListener('DOMContentLoaded', function () {
  const button = document.querySelector<HTMLInputElement>('.toggle-theme input')

  if (document.body.dataset.theme === 'dark') {
    button.setAttribute('checked', '')
  }
  button.addEventListener('change', function () {
    document.body.dataset.theme = button.checked ? 'dark' : 'light'
  })
})
