import { ScrollSnapSlider } from "./src/ScrollSnapSlider.js";

const slider = new ScrollSnapSlider(document.querySelector(".example-slider"));

const buttons = document.querySelectorAll(".example-indicator");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");

for (const button of buttons) {
  button.addEventListener("click", function (event) {
    event.preventDefault();
    slider.slideTo(parseInt(button.control.value, 10));
  });
}

prev.addEventListener("click", function () {
  slider.slideTo(slider.slide - 1);
});

next.addEventListener("click", function () {
  slider.slideTo(slider.slide + 1);
});

const setSelected = function (event) {
  buttons[event.detail].control.checked = true;
};

slider.addEventListener("slide-pass", setSelected);
slider.addEventListener("slide-stop", setSelected);
