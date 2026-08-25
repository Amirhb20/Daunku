"use strict";
const navToggleIcon = document.querySelector(".nav-toggle__icon ");
const list = document.querySelector(".list");
const infos = document.querySelectorAll(".info");
navToggleIcon.addEventListener("click", function () {
  navToggleIcon.classList.toggle("nav-toggle__icon--open");
  list.classList.toggle("list--show");
});
infos.forEach((info) => {
  const icon = info.querySelector(".info-icon");
  const box = info.querySelector(".info-box");

  icon.addEventListener("click", () => {
    infos.forEach((item) => {
      item.querySelector(".info-box").classList.remove("info-box--active");
    });

    box.classList.add("info-box--active");
  });
});
