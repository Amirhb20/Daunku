"use strict";
const navToggleIcon = document.querySelector(".nav-toggle__icon ");
const infos = document.querySelectorAll(".info");
const images = document.querySelectorAll(".reference__img");
const aboutSection = document.querySelector(".reference-photo");
const list = document.querySelector(".list");
const shoppingCart = document.querySelector(".shopping");
const shoppingCountEl = document.querySelector(".shopping__text");
const cardtab = document.querySelector(".cardtab");
const btnClose = document.querySelector(".btn-close");
const aboutUsImage = document.querySelectorAll(".aboutus__img__title");
const menuListItems = document.querySelectorAll(".list__item");
const sections = document.querySelectorAll("main > section");
const cartTotalPriceEl = document.querySelector(".cardtab-total__price");

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

shoppingCart.addEventListener("click", function () {
  cardtab.classList.toggle("cardtab--show");
});
btnClose.addEventListener("click", function () {
  cardtab.classList.remove("cardtab--show");
});
// ===== Selectors =====
const addToCartBtns = document.querySelectorAll(
  ".product-card__box__price__icon",
);
const cartTab = document.querySelector(".cardtab");
const closeCartBtn = document.querySelector(".btn-close");
const listCard = document.querySelector(".listcard");
const cartCount = document.querySelector(".shopping__text");

// ===== State =====
let cart = [];

// ===== Open / Close Cart =====
function openCart() {
  cartTab.classList.add("active");
}

function closeCart() {
  cartTab.classList.remove("active");
}

closeCartBtn.addEventListener("click", closeCart);

// ===== Add to Cart =====
addToCartBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".product-card__box");

    const title = card.querySelector(".product-card__box__title").innerText;

    const priceText = card.querySelector(
      ".product-card__box__price__text",
    ).innerText;

    const price = parseFloat(priceText.replace("$", ""));
    const img = card.querySelector(".product-card__box__img").src;

    addItem(title, price, img);
    openCart();
    scrollToCartIcon();
  });
});

// ===== Add Item Logic =====
function addItem(title, price, img) {
  const exist = cart.find((item) => item.title === title);

  if (exist) {
    exist.qty++;
  } else {
    cart.push({
      title,
      price,
      img,
      qty: 1,
    });
  }

  renderCart();
}

// ===== Render Cart =====
function renderCart() {
  listCard.innerHTML = "";
  let totalQty = 0;

  cart.forEach((item, index) => {
    totalQty += item.qty;

    listCard.innerHTML += `
      <div class="item">
        <div class="image">
          <img src="${item.img}" class="listcard__img">
        </div>

        <h3 class="name">${item.title}</h3>
        <p class="total-price">$${(item.price * item.qty).toFixed(2)}</p>

        <div class="quantity">
          <span class="minus" data-index="${index}">-</span>
          <span class="quantity__text">${item.qty}</span>
          <span class="plus" data-index="${index}">+</span>
        </div>

        <button class="btn-card-close" data-index="${index}"><i class="bi bi-trash"></i></button>
      </div>
    `;
  });

  cartCount.innerText = totalQty;
  updateTotalPrice(window.cart);
  attachEvents();
}

// ===== Quantity & Remove Events =====
function attachEvents() {
  document.querySelectorAll(".plus").forEach((btn) => {
    btn.onclick = () => {
      cart[btn.dataset.index].qty++;
      renderCart();
    };
  });

  document.querySelectorAll(".minus").forEach((btn) => {
    btn.onclick = () => {
      const i = btn.dataset.index;
      cart[i].qty--;

      if (cart[i].qty === 0) cart.splice(i, 1);
      renderCart();
    };
  });

  document.querySelectorAll(".btn-card-close").forEach((btn) => {
    btn.onclick = () => {
      cart.splice(btn.dataset.index, 1);
      renderCart();
    };
  });
}

//scroll to shpping icon
function scrollToCartIcon() {
  shoppingCart.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}
//local strage
// ===== LocalStorage Cart Preserve Auto =====
const cartKey = "myShoppingCart";

// ===== Load Cart from localStorage =====
function loadCartFromStorage() {
  const savedCart = localStorage.getItem(cartKey);
  if (savedCart) {
    const savedData = JSON.parse(savedCart);

    if (savedData.length) {
      // Update cart count
      const totalQty = savedData.reduce((sum, item) => sum + item.qty, 0);
      shoppingCountEl.innerText = totalQty;

      // Render saved items
      listCard.innerHTML = "";
      savedData.forEach((item, index) => {
        listCard.innerHTML += `
          <div class="item">
            <div class="image">
              <img src="${item.img}" class="listcard__img">
            </div>
            <h3 class="name">${item.title}</h3>
            <p class="total-price">$${(item.price * item.qty).toFixed(2)}</p>
            <div class="quantity">
              <span class="minus" data-index="${index}">-</span>
              <span class="quantity__text">${item.qty}</span>
              <span class="plus" data-index="${index}">+</span>
            </div>
            <button class="btn-card-close" data-index="${index}">✕</button>
          </div>
        `;
      });
    }

    // Update global cart
    window.cart = savedData;
    attachStorageEvents(); // اتوماتیک وصل رویدادها بعد از رندر
  } else {
    window.cart = [];
  }
}

// ===== Save Cart to localStorage =====
function saveCartToStorage() {
  if (window.cart) {
    localStorage.setItem(cartKey, JSON.stringify(window.cart));
    // آپدیت عدد روی آیکون
    const totalQty = window.cart.reduce((sum, item) => sum + item.qty, 0);
    shoppingCountEl.innerText = totalQty;
  }
}

// ===== Attach Events for Plus / Minus / Remove =====
function attachStorageEvents() {
  document.querySelectorAll(".plus").forEach((btn) => {
    btn.onclick = () => {
      window.cart[btn.dataset.index].qty++;
      renderAndSave();
    };
  });

  document.querySelectorAll(".minus").forEach((btn) => {
    btn.onclick = () => {
      const i = btn.dataset.index;
      window.cart[i].qty--;
      if (window.cart[i].qty === 0) window.cart.splice(i, 1);
      renderAndSave();
    };
  });

  document.querySelectorAll(".btn-card-close").forEach((btn) => {
    btn.onclick = () => {
      window.cart.splice(btn.dataset.index, 1);
      renderAndSave();
    };
  });
}

// ===== Render Cart & Save =====
function renderAndSave() {
  listCard.innerHTML = "";

  window.cart.forEach((item, index) => {
    listCard.innerHTML += `
      <div class="item">
        <div class="image">
          <img src="${item.img}" class="listcard__img">
        </div>
        <h3 class="name">${item.title}</h3>
        <p class="total-price">$${(item.price * item.qty).toFixed(2)}</p>
        <div class="quantity">
          <span class="minus" data-index="${index}">-</span>
          <span class="quantity__text">${item.qty}</span>
          <span class="plus" data-index="${index}">+</span>
        </div>
        <button class="btn-card-close" data-index="${index}">✕</button>
      </div>
    `;
  });

  saveCartToStorage();
  updateTotalPrice(window.cart);
  attachStorageEvents();
}

// ===== Hook Add to Cart Button =====
document.querySelectorAll(".product-card__box__price__icon").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".product-card__box");
    const title = card.querySelector(".product-card__box__title").innerText;
    const priceText = card.querySelector(
      ".product-card__box__price__text",
    ).innerText;
    const price = parseFloat(priceText.replace("$", ""));
    const img = card.querySelector(".product-card__box__img").src;

    const exist = window.cart.find((item) => item.title === title);
    if (exist) exist.qty++;
    else window.cart.push({ title, price, img, qty: 1 });

    renderAndSave();
  });
});

// ===== Initialize =====
loadCartFromStorage();
updateTotalPrice(window.cart);

// ====total=====
function updateTotalPrice(cartData) {
  const total = cartData.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartTotalPriceEl.innerText = `$${total.toFixed(2)}`;
}

// فعال بودن آیتم اول
images[0].classList.add("active");

images.forEach((img) => {
  img.addEventListener("click", () => {
    images.forEach((item) => item.classList.remove("active"));
    img.classList.add("active");
  });
});

observer.observe(aboutSection);

//scrool section
menuListItems.forEach((menuListItem) => {
  menuListItem.addEventListener("click", function (e) {
    e.preventDefault();
    document
      .querySelector(".list__item--active")
      .classList.remove("list__item--active");
    menuListItem.classList.add("list__item--active");

    let sectionId = menuListItem.getAttribute("data-section");
    let sectionOffserTop = document.querySelector(`.${sectionId}`).offsetTop;

    window.scrollTo({
      top: sectionOffserTop - 150,
      behavior: "smooth",
    });
  });
});

window.addEventListener("scroll", () => {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 200;
    const sectionHeight = section.offsetHeight;

    if (pageYOffset >= sectionTop) {
      currentSection = section.getAttribute("id");
    }
  });

  menuListItems.forEach((item) => {
    item.classList.remove("list__item--active");

    const sectionName = item.getAttribute("data-section");

    // 👈 اگر بالای صفحه‌ایم Home فعال شود
    if (pageYOffset < sections[0].offsetTop - 200 && sectionName === "") {
      item.classList.add("list__item--active");
    }

    // 👈 بقیه سکشن‌ها
    if (sectionName === currentSection) {
      item.classList.add("list__item--active");
    }
  });
});
