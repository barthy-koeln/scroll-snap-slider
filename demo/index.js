import './slider-simple.js'
import './slider-multi.js'
import './slider-responsive.js'

document.body.dataset.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

document.addEventListener('DOMContentLoaded', function () {
    const button = document.querySelector('.toggle-theme input')

    if (document.body.dataset.theme === 'dark') {
        button.setAttribute('checked', '')
    }

    button.addEventListener('change', function () {
        document.body.dataset.theme = button.checked ? 'dark' : 'light'
    })
})
