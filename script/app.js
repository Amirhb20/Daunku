"use strict";
const navToggleIcon = document.querySelector(".nav-toggle__icon ");
const list = document.querySelector(".list");
const infos = document.querySelectorAll(".info");
const images = document.querySelectorAll(".reference__img");
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
// فعال بودن آیتم اول
images[0].classList.add("active");

images.forEach((img) => {
  img.addEventListener("click", () => {
    images.forEach((item) => item.classList.remove("active"));
    img.classList.add("active");
  });
});

const aboutSection = document.querySelector(".reference-photo");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        aboutSection.classList.add("show");
        observer.unobserve(aboutSection); // فقط یک بار اجرا شود
      }
    });
  },
  {
    threshold: 0.5, // 30٪ بخش دیده شود
  },
);

observer.observe(aboutSection);
