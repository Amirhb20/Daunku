"use strict";
const infos = document.querySelectorAll(".info");
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
