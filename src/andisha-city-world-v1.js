
"use strict";

/* ============================================
   ANDISHA CITY WORLD V1.2
   اتصال مستقیم ساختمان‌ها به بازی اصلی
   افزونه مستقل - بدون تغییر main.js
   ============================================ */

(function () {
  if (window.__ANDISHA_CITY_WORLD_V1__) return;
  window.__ANDISHA_CITY_WORLD_V1__ = true;

  const zones = [
    { name: "فروشگاه", icon: "🛍️", color: "#ffbd59", index: 0 },
    { name: "آشپزخانه", icon: "🍰", color: "#ff8eae", index: 1 },
    { name: "بانک", icon: "🏦", color: "#65c9c2", index: 2 },
    { name: "کارگاه نقشه", icon: "📐", color: "#8eabff", index: 3 },
    { name: "برج هوشمند", icon: "🏰", color: "#b99aff", index: 4 }
  ];

  function addStyles() {
    if (document.getElementById("andisha-city-world-style")) return;

    const style = document.createElement("style");
    style.id = "andisha-city-world-style";

    style.textContent = `
      #andisha-city-launcher {
        position: fixed;
        z-index: 9998;
        bottom: 85px;
        right: 16px;
        border: 2px solid rgba(255,255,255,.9);
        border-radius: 20px;
        padding: 13px 18px;
        background: linear-gradient(135deg,#183c79,#386bd0);
        color: white;
        font-family: inherit;
        font-size: 14px;
        font-weight: 900;
        box-shadow: 0 8px 25px #142b5260;
        cursor: pointer;
        transition: transform .2s ease;
      }

      #andisha-city-launcher:active {
        transform: scale(.96);
      }

      #andisha-city-world {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: none;
        overflow-y: auto;
        direction: rtl;
        background:
          radial-gradient(circle at 15% 15%,#fff7bd 0 2%,transparent 18%),
          linear-gradient(160deg,#8bd8f7,#d2efff 48%,#a6dfbb);
        font-family: inherit;
        color: #19345c;
      }

      #andisha-city-world.open {
        display: block;
        animation: acw-enter .4s ease;
      }

      @keyframes acw-enter {
        from { opacity: 0; transform: scale(.97); }
        to { opacity: 1; transform: scale(1); }
      }

      .acw-header {
        position: sticky;
        top: 0;
        z-index: 20;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        padding: 13px 16px;
        background: #ffffffd9;
        backdrop-filter: blur(12px);
        box-shadow: 0 3px 14px #24466b20;
      }

      .acw-title {
        font-size: 19px;
        font-weight: 900;
      }

      .acw-close {
        border: 0;
        border-radius: 12px;
        padding: 9px 14px;
        background: #193b70;
        color: white;
        font-size: 15px;
        cursor: pointer;
      }

      .acw-subtitle {
        text-align: center;
        padding: 14px 10px 0;
        font-weight: bold;
        color: #234c77;
      }

      .acw-sky {
        position: relative;
        min-height: 570px;
        max-width: 850px;
        margin: auto;
        padding: 35px 12px 60px;
        overflow: hidden;
      }

      .acw-sun {
        position: absolute;
        top: 25px;
        left: 12%;
        width: 72px;
        height: 72px;
        border-radius: 50%;
        background: #ffe27a;
        box-shadow: 0 0 35px #fff2a7;
        animation: acw-sun 4s ease-in-out infinite alternate;
      }

      @keyframes acw-sun {
        to { transform: scale(1.12); }
      }

      .acw-cloud {
        position: absolute;
        color: white;
        font-size: 44px;
        opacity: .85;
        animation: acw-cloud 18s linear infinite alternate;
      }

      .acw-cloud.one { top: 60px; right: 8%; }
      .acw-cloud.two { top: 135px; left: 12%; animation-delay: -7s; }

      @keyframes acw-cloud {
        to { transform: translateX(35px); }
      }

      .acw-ground {
        position: absolute;
        inset: 180px 2% 0;
        border-radius: 48% 48% 15px 15px;
        background: radial-gradient(ellipse at 50% 45%,#a9e6a5,#70c88f 70%);
        box-shadow: inset 0 12px 25px #ffffff50,
                    0 18px 35px #327c6c30;
        transform: perspective(700px) rotateX(12deg);
      }

      .acw-road {
        position: absolute;
        top: 340px;
        left: -10%;
        width: 120%;
        height: 78px;
        transform: rotate(-10deg);
        border-top: 7px solid #ffffffb0;
        border-bottom: 7px solid #ffffffb0;
        background: #7894a9;
        box-shadow: 0 8px 15px #315b6040;
      }

      .acw-road::after {
        content: "";
        position: absolute;
        top: 34px;
        left: 0;
        width: 100%;
        border-top: 4px dashed #fff4b5;
      }

      .acw-buildings {
        position: relative;
        z-index: 3;
        display: grid;
        grid-template-columns: repeat(3,minmax(85px,1fr));
        gap: 32px 18px;
        max-width: 590px;
        margin: 45px auto 0;
        padding: 20px 12px;
      }

      .acw-building {
        position: relative;
        min-height: 130px;
        border: 0;
        background: transparent;
        cursor: pointer;
        color: #17385e;
        transition: transform .25s ease;
      }

      .acw-building:hover {
        transform: translateY(-8px) scale(1.04);
      }

      .acw-building:active {
        transform: scale(.95);
      }

      .acw-house {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 84px;
        margin: 0 9px 10px;
        border: 3px solid #ffffff;
        border-radius: 12px 12px 5px 5px;
        background: var(--house-color);
        box-shadow: 9px 9px 0 var(--house-side),
                    0 12px 20px #27576a45;
        transform: skewY(-3deg);
      }

      .acw-house::before {
        content: "";
        position: absolute;
        top: -25px;
        left: -5px;
        right: -5px;
        height: 29px;
        border: 3px solid #ffffff;
        border-radius: 12px 12px 2px 2px;
        background: var(--house-roof);
        clip-path: polygon(50% 0,100% 100%,0 100%);
      }

      .acw-house::after {
        content: "";
        position: absolute;
        bottom: 0;
        width: 19px;
        height: 31px;
        border-radius: 7px 7px 0 0;
        background: #ffffffb8;
        border: 2px solid #ffffff;
      }

      .acw-building:nth-child(2) .acw-house { height: 105px; }
      .acw-building:nth-child(3) .acw-house { height: 92px; }
      .acw-building:nth-child(4) .acw-house { height: 78px; }
      .acw-building:nth-child(5) .acw-house { height: 118px; }

      .acw-building:nth-child(5) .acw-house::before {
        background: #7056bc;
      }

      .acw-icon {
        position: relative;
        z-index: 2;
        font-size: 32px;
        filter: drop-shadow(0 3px 2px #24334b40);
      }

      .acw-label {
        display: inline-block;
        margin-top: 7px;
        padding: 6px 9px;
        border-radius: 12px;
        background: #ffffffed;
        box-shadow: 0 4px 10px #315c6330;
        font-weight: 900;
        font-size: 12px;
        white-space: nowrap;
      }

      .acw-tree {
        position: absolute;
        z-index: 4;
        font-size: 35px;
        animation: acw-tree 2.5s ease-in-out infinite alternate;
      }

      @keyframes acw-tree {
        to { transform: rotate(4deg); }
      }

      .acw-tree.t1 { top: 290px; left: 5%; }
      .acw-tree.t2 { top: 440px; right: 5%; }
      .acw-tree.t3 { top: 485px; left: 13%; }

      .acw-footer {
        position: relative;
        z-index: 5;
        margin: 0 12px 25px;
        padding: 14px;
        border-radius: 18px;
        background: #ffffffd9;
        text-align: center;
        font-weight: bold;
        box-shadow: 0 5px 18px #315c6330;
      }

      .acw-toast {
        position: fixed;
        z-index: 10001;
        bottom: 85px;
        left: 50%;
        transform: translateX(-50%);
        max-width: 90%;
        padding: 12px 18px;
        border-radius: 14px;
        background: #183c79;
        color: white;
        text-align: center;
        box-shadow: 0 5px 18px #142b5260;
      }

      @media(max-width:430px) {
        .acw-sky { min-height: 590px; }
        .acw-buildings {
          gap: 25px 8px;
          padding: 15px 5px;
        }
        .acw-building { min-height: 125px; }
        .acw-label { font-size: 11px; }
        .acw-title { font-size: 16px; }
      }

      @media(prefers-reduced-motion: reduce) {
        #andisha-city-world *,
        #andisha-city-world *::before,
        #andisha-city-world *::after {
          animation: none !important;
          transition: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function showToast(message) {
    const old = document.querySelector(".acw-toast");
    if (old) old.remove();

    const toast = document.createElement("div");
    toast.className = "acw-toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    window.setTimeout(function () {
      toast.remove();
    }, 2600);
  }

  function openCity() {
    const city = document.getElementById("andisha-city-world");

    if (city) {
      city.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  }

  function closeCity() {
    const city = document.getElementById("andisha-city-world");

    if (city) {
      city.classList.remove("open");
    }

    document.body.style.overflow = "";
  }

  /* اتصال ساختمان به فرمان اصلی main.js */
  function enterMainZone(index) {
    const app = document.getElementById("app");

    if (!app) return false;

    // اگر دکمه اصلی وجود دارد، همان را اجرا کن
    const originalButton = Array.from(
      app.querySelectorAll('button[data-action="zone"]')
    ).find(function (button) {
      return Number(button.dataset.zone) === index;
    });

    if (originalButton) {
      originalButton.click();
      return true;
    }

    // اگر دکمه در صفحه فعلی وجود ندارد،
    // یک دکمه موقت برای اجرای رویداد اصلی بساز
    const proxyButton = document.createElement("button");

    proxyButton.type = "button";
    proxyButton.dataset.action = "zone";
    proxyButton.dataset.zone = String(index);
    proxyButton.hidden = true;

    app.appendChild(proxyButton);

    proxyButton.click();
    proxyButton.remove();

    return true;
  }

  function createCity() {
    if (document.getElementById("andisha-city-world")) return;

    const overlay = document.createElement("section");

    overlay.id = "andisha-city-world";
    overlay.setAttribute("aria-label", "شهرک سه‌بعدی اندیشا");

    overlay.innerHTML = `
      <header class="acw-header">
        <div class="acw-title">🏙️ شهرک هوشمند اندیشا</div>
        <button class="acw-close" type="button">✕ بستن</button>
      </header>

      <div class="acw-subtitle">
        به شهر رنگارنگ اندیشا خوش آمدی! ✨
      </div>

      <div class="acw-sky">
        <div class="acw-sun"></div>
        <div class="acw-cloud one">☁️</div>
        <div class="acw-cloud two">☁️</div>
        <div class="acw-ground"></div>
        <div class="acw-road"></div>

        <span class="acw-tree t1">🌳</span>
        <span class="acw-tree t2">🌲</span>
        <span class="acw-tree t3">🌳</span>

        <div class="acw-buildings">
          ${zones.map(function (zone) {
            return `
              <button class="acw-building"
                type="button"
                data-zone-index="${zone.index}"
                aria-label="ورود به ${zone.name}">
                <span class="acw-house"
                  style="
                    --house-color:${zone.color};
                    --house-side:${zone.color}99;
                    --house-roof:${zone.color};
                  ">
                  <span class="acw-icon">${zone.icon}</span>
                </span>
                <span class="acw-label">${zone.name}</span>
              </button>
            `;
          }).join("")}
        </div>
      </div>

      <div class="acw-footer">
        🌟 هر ساختمان یک ماجراجویی تازه است!
        <br>
        <small>اندیشا | فناوری در خدمت آموزش</small>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector(".acw-close").addEventListener(
      "click",
      closeCity
    );

    overlay.addEventListener("click", function (event) {
      const target = event.target;

      if (!target || typeof target.closest !== "function") return;

      const building = target.closest("[data-zone-index]");

      if (!building) return;

      const index = Number(building.dataset.zoneIndex);

      if (!Number.isInteger(index) || index < 0 || index > 4) {
        showToast("ساختمان انتخاب‌شده معتبر نیست.");
        return;
      }

      closeCity();

      const success = enterMainZone(index);

      if (!success) {
        showToast("بخش اصلی بازی در دسترس نیست.");
      }
    });
  }

  function init() {
    addStyles();
    createCity();

    if (document.getElementById("andisha-city-launcher")) return;

    const launcher = document.createElement("button");

    launcher.id = "andisha-city-launcher";
    launcher.type = "button";
    launcher.textContent = "🏙️ شهرک سه‌بعدی";

    launcher.addEventListener("click", openCity);

    document.body.appendChild(launcher);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeCity();
    });

    console.log("ANDISHA CITY WORLD V1.2 READY");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
