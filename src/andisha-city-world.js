
"use strict";

/* ============================================
   ANDISHA CITY WORLD V2.1
   شهر فانتزی سه‌بعدی اندیشا
   نسخه اصلاح‌شده و یکپارچه
   مستقل از main.js و سیستم امتیازدهی
   ============================================ */

(function () {

  if (window.__ANDISHA_CITY_WORLD_V21__) return;
  window.__ANDISHA_CITY_WORLD_V21__ = true;

  const zones = [
    {
      name: "فروشگاه",
      key: "shop",
      icon: "🛍️",
      color: "#ff9f43",
      light: "#ffe0a8",
      desc: "خرید و محاسبه تخفیف"
    },
    {
      name: "آشپزخانه",
      key: "kitchen",
      icon: "🍳",
      color: "#20bf9f",
      light: "#b7f4df",
      desc: "آزمایش تناسب"
    },
    {
      name: "بانک",
      key: "bank",
      icon: "🏦",
      color: "#4b8cf5",
      light: "#c5ddff",
      desc: "دنیای درصدها"
    },
    {
      name: "نقشه",
      key: "map",
      icon: "🗺️",
      color: "#a477ed",
      light: "#e5d4ff",
      desc: "سفر به دنیای اندازه‌ها"
    },
    {
      name: "برج",
      key: "tower",
      icon: "🏙️",
      color: "#ef6b9b",
      light: "#ffd1e1",
      desc: "چالش نهایی قهرمانان"
    }
  ];

  /* جلوگیری از باقی‌ماندن نسخه قبلی */

  [
    "andisha-city-launcher",
    "andisha-city-world",
    "andisha-city-world-style"
  ].forEach(function (id) {
    const old = document.getElementById(id);
    if (old) old.remove();
  });

  /* ============================================
     CSS
     ============================================ */

  const style = document.createElement("style");
  style.id = "andisha-city-world-style";

  style.textContent = `

    #andisha-city-launcher {
      position: fixed;
      right: 16px;
      bottom: 85px;
      z-index: 9998;
      border: 2px solid #fff;
      border-radius: 18px;
      padding: 12px 17px;
      color: white;
      background: linear-gradient(135deg,#237de0,#142b52);
      box-shadow: 0 7px 0 #10234a,
                  0 12px 24px #10234a55;
      font-family: inherit;
      font-size: 14px;
      font-weight: 900;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    #andisha-city-launcher:active {
      transform: translateY(4px);
      box-shadow: 0 3px 0 #10234a;
    }

    #andisha-city-world {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: none;
      overflow-y: auto;
      overflow-x: hidden;
      box-sizing: border-box;
      padding: 18px 12px 30px;
      font-family: inherit;
      background: linear-gradient(
        180deg,
        #67c8ff 0%,
        #b5e9ff 48%,
        #c9f3c9 100%
      );
      isolation: isolate;
      overscroll-behavior: contain;
    }

    #andisha-city-world.open {
      display: block;
      animation: andishaWorldIn .35s ease;
    }

    @keyframes andishaWorldIn {
      from {
        opacity: 0;
        transform: scale(.97);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    #andisha-city-world .world-sun {
      position: absolute;
      top: 35px;
      left: 25px;
      width: 75px;
      height: 75px;
      border-radius: 50%;
      background: #ffe66d;
      box-shadow: 0 0 35px #fff2a6;
      z-index: -1;
      animation: andishaSun 4s ease-in-out infinite alternate;
    }

    @keyframes andishaSun {
      from { transform: scale(1); }
      to { transform: scale(1.12); }
    }

    #andisha-city-world .world-cloud {
      position: absolute;
      top: 95px;
      right: -120px;
      width: 100px;
      height: 28px;
      border-radius: 30px;
      background: #ffffffbb;
      z-index: -1;
      animation: andishaCloud 24s linear infinite;
      pointer-events: none;
    }

    #andisha-city-world .world-cloud:before,
    #andisha-city-world .world-cloud:after {
      content: "";
      position: absolute;
      bottom: 8px;
      border-radius: 50%;
      background: #ffffffdd;
    }

    #andisha-city-world .world-cloud:before {
      width: 42px;
      height: 42px;
      right: 15px;
    }

    #andisha-city-world .world-cloud:after {
      width: 32px;
      height: 32px;
      right: 48px;
    }

    @keyframes andishaCloud {
      from { transform: translateX(0); }
      to { transform: translateX(-130vw); }
    }

    #andisha-city-world .world-header {
      position: relative;
      max-width: 650px;
      margin: 10px auto 18px;
      padding: 17px 12px;
      text-align: center;
      color: #17336d;
      background: #ffffffdf;
      border: 2px solid white;
      border-radius: 23px;
      box-shadow: 0 7px 0 #4c87a833;
    }

    #andisha-city-world .world-header h2 {
      margin: 0 0 7px;
      font-size: 23px;
    }

    #andisha-city-world .world-header p {
      margin: 0;
      font-size: 13px;
    }

    #andisha-city-world .world-scene {
      position: relative;
      max-width: 680px;
      min-height: 150px;
      margin: 0 auto 17px;
      overflow: hidden;
      border: 3px solid #ffffffcc;
      border-radius: 22px;
      background: linear-gradient(
        #8edbff 0 65%,
        #72ce82 65%
      );
      box-shadow: 0 7px 0 #397c6380;
    }

    #andisha-city-world .scene-hill {
      position: absolute;
      bottom: -42px;
      width: 180px;
      height: 100px;
      border-radius: 50%;
      background: #5bbd70;
    }

    #andisha-city-world .scene-hill.one {
      left: -30px;
    }

    #andisha-city-world .scene-hill.two {
      right: -30px;
      background: #49ad68;
    }

    #andisha-city-world .scene-road {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 25px;
      background: #78899b;
      border-top: 3px solid white;
    }

    #andisha-city-world .scene-road:after {
      content: "";
      position: absolute;
      top: 10px;
      left: 0;
      width: 100%;
      border-top: 3px dashed #fff3b0;
    }

    #andisha-city-world .scene-house {
      position: absolute;
      bottom: 22px;
      width: 45px;
      height: 60px;
      border-radius: 5px 5px 0 0;
      background: #ffb75e;
      box-shadow: inset -7px 0 #d98b42;
    }

    #andisha-city-world .scene-house:before {
      content: "";
      position: absolute;
      top: -19px;
      left: -6px;
      width: 57px;
      height: 25px;
      background: #e87565;
      clip-path: polygon(
        50% 0,
        100% 100%,
        0 100%
      );
    }

    #andisha-city-world .scene-house:after {
      content: "";
      position: absolute;
      top: 15px;
      left: 15px;
      width: 13px;
      height: 18px;
      background: #d7f4ff;
      border: 2px solid white;
    }

    #andisha-city-world .scene-house.h1 {
      left: 17%;
    }

    #andisha-city-world .scene-house.h2 {
      left: 43%;
      height: 76px;
      background: #b28bea;
    }

    #andisha-city-world .scene-house.h3 {
      right: 17%;
      height: 53px;
      background: #5eafe9;
    }

    #andisha-city-world .world-buildings {
      display: grid;
      grid-template-columns: repeat(2,minmax(0,1fr));
      gap: 15px;
      max-width: 650px;
      margin: 0 auto;
    }

    #andisha-city-world .world-building {
      position: relative;
      min-height: 165px;
      overflow: hidden;
      box-sizing: border-box;
      border: 3px solid white;
      border-radius: 21px;
      padding: 13px 8px;
      color: #17336d;
      background: linear-gradient(
        145deg,
        #ffffff,
        #f0f7ff
      );
      box-shadow:
        0 8px 0 #17336d24,
        0 13px 22px #17336d25;
      font-family: inherit;
      cursor: pointer;
      transition:
        transform .18s ease,
        box-shadow .18s ease;
      -webkit-tap-highlight-color: transparent;
    }

    #andisha-city-world .world-building:active {
      transform: translateY(5px) scale(.98);
      box-shadow: 0 2px 0 #17336d24;
    }

    #andisha-city-world .world-building:focus-visible {
      outline: 3px solid #17336d;
      outline-offset: 3px;
    }

    #andisha-city-world .building-roof {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      height: 9px;
      background: var(--building-color);
    }

    #andisha-city-world .building-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 75px;
      height: 75px;
      margin: 7px auto 9px;
      border-radius: 22px;
      font-size: 43px;
      background: var(--building-light);
      box-shadow:
        inset 0 -6px #0000000c,
        0 5px 12px #00000012;
    }

    #andisha-city-world .world-building strong {
      display: block;
      font-size: 17px;
    }

    #andisha-city-world .world-building small {
      display: block;
      margin-top: 6px;
      color: #657b93;
      font-size: 11px;
    }

    #andisha-city-world .world-building:last-child {
      grid-column: 1 / -1;
      min-height: 145px;
    }

    #andisha-city-world .world-building:last-child .building-icon {
      width: 65px;
      height: 65px;
    }

    #andisha-city-world .world-footer {
      max-width: 650px;
      margin: 18px auto 0;
      text-align: center;
      color: #17336d;
      font-size: 12px;
      font-weight: bold;
    }

    #andisha-city-world .world-close {
      display: block;
      margin: 17px auto 10px;
      border: 2px solid white;
      border-radius: 16px;
      padding: 12px 27px;
      color: white;
      background: linear-gradient(
        135deg,
        #237de0,
        #17336d
      );
      box-shadow: 0 5px 0 #10234a;
      font-family: inherit;
      font-size: 15px;
      font-weight: bold;
      cursor: pointer;
    }

    #andisha-city-world .world-close:active {
      transform: translateY(3px);
      box-shadow: 0 2px 0 #10234a;
    }

    #andisha-world-toast {
      position: fixed;
      z-index: 10001;
      bottom: 25px;
      left: 50%;
      transform: translateX(-50%);
      background: #17336d;
      color: white;
      padding: 12px 18px;
      border-radius: 14px;
      font-family: inherit;
      font-size: 13px;
      max-width: 85%;
      text-align: center;
      box-shadow: 0 5px 15px #0003;
    }

    @media (max-width: 360px) {
      #andisha-city-world .world-buildings {
        gap: 9px;
      }

      #andisha-city-world .world-building {
        min-height: 145px;
      }

      #andisha-city-world .building-icon {
        width: 65px;
        height: 65px;
        font-size: 37px;
      }

      #andisha-city-world .world-header h2 {
        font-size: 20px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      #andisha-city-world *,
      #andisha-city-launcher {
        animation: none !important;
        transition: none !important;
      }
    }
  `;

  document.head.appendChild(style);

  /* ============================================
     ساخت دکمه ورود
     ============================================ */

  const launcher = document.createElement("button");

  launcher.id = "andisha-city-launcher";
  launcher.type = "button";
  launcher.textContent = "🏙️ شهر فانتزی اندیشا";
  launcher.setAttribute("aria-label", "ورود به شهر فانتزی اندیشا");

  /* ============================================
     ساخت محیط شهر
     ============================================ */

  const world = document.createElement("div");

  world.id = "andisha-city-world";
  world.setAttribute("role", "dialog");
  world.setAttribute("aria-label", "شهر هوشمند اندیشا");
  world.setAttribute("aria-modal", "true");

  world.innerHTML = `
    <div class="world-sun"></div>
    <div class="world-cloud"></div>

    <header class="world-header">
      <h2>🏙️ شهر هوشمند اندیشا</h2>
      <p>به شهر یادگیری خوش آمدی، قهرمان! ✨</p>
    </header>

    <div class="world-scene">
      <div class="scene-hill one"></div>
      <div class="scene-hill two"></div>
      <div class="scene-house h1"></div>
      <div class="scene-house h2"></div>
      <div class="scene-house h3"></div>
      <div class="scene-road"></div>
    </div>

    <div class="world-buildings"></div>

    <div class="world-footer">
      🌱 هر ساختمان یک ماجراجویی تازه است!
    </div>

    <button class="world-close" type="button">
      بازگشت به بازی اصلی ✨
    </button>
  `;

  const buildings = world.querySelector(".world-buildings");

  /* ============================================
     ساخت پنج ساختمان
     ============================================ */

  zones.forEach(function (zone, index) {

    const button = document.createElement("button");

    button.type = "button";
    button.className = "world-building";

    button.style.setProperty(
      "--building-color",
      zone.color
    );

    button.style.setProperty(
      "--building-light",
      zone.light
    );

    button.innerHTML =
      '<span class="building-roof"></span>' +
      '<span class="building-icon">' + zone.icon + '</span>' +
      '<strong>' + zone.name + '</strong>' +
      '<small>' + zone.desc + '</small>';

    button.addEventListener("click", function () {
      enterZone(index);
    });

    buildings.appendChild(button);

  });

  /* ============================================
     باز و بسته کردن شهر
     ============================================ */

  function openWorld() {

    world.classList.add("open");

    document.body.style.overflow = "hidden";

  }

  function closeWorld() {

    world.classList.remove("open");

    document.body.style.overflow = "";

  }

  /* ============================================
     پیام کوتاه
     ============================================ */

  let toastTimer = null;

  function showMessage(message) {

    let toast = document.getElementById(
      "andisha-world-toast"
    );

    if (!toast) {

      toast = document.createElement("div");

      toast.id = "andisha-world-toast";

      toast.setAttribute("role", "status");

      document.body.appendChild(toast);

    }

    toast.textContent = message;
    toast.style.display = "block";

    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    toastTimer = window.setTimeout(function () {

      toast.style.display = "none";

    }, 2500);

  }

  /* ============================================
     پیدا کردن دکمه اصلی هر منطقه
     ============================================ */

  function findMainZoneButton(index) {

    const buttons = document.querySelectorAll(
      '#app button[data-action="zone"]'
    );

    for (let i = 0; i < buttons.length; i++) {

      const values = [
        buttons[i].getAttribute("data-index"),
        buttons[i].getAttribute("data-zone-index"),
        buttons[i].getAttribute("data-zone")
      ];

      for (let j = 0; j < values.length; j++) {

        if (
          values[j] !== null &&
          Number(values[j]) === index
        ) {
          return buttons[i];
        }

      }

    }

    return null;

  }

  /* ============================================
     ورود به ساختمان
     ============================================ */

  function enterZone(index) {

    if (index < 0 || index >= zones.length) {
      showMessage("ساختمان موردنظر پیدا نشد.");
      return;
    }

    closeWorld();

    const zone = zones[index];

    try {

      /*
       * مسیر مستقیم:
       * استفاده از API اصلی بازی
       */

      if (typeof window.andishaOpenZone === "function") {

        window.andishaOpenZone(index);

        /*
         * پخش صدای راهنما از سیستم صوتی V4
         * بدون ایجاد کلیک مصنوعی
         */

        if (
          typeof window.andishaPlayZoneVoice === "function"
        ) {

          window.andishaPlayZoneVoice(index);

        } else if (
          typeof window.andishaPlayVoice === "function"
        ) {

          window.andishaPlayVoice(zone.key);

        }

        return;

      }

      /*
       * مسیر جایگزین:
       * کلیک روی دکمه اصلی بازی
       */

      const originalButton = findMainZoneButton(index);

      if (originalButton) {

        originalButton.click();

        return;

      }

      showMessage(
        "ساختمان پیدا شد، اما اتصال مرحله اصلی برقرار نیست."
      );

    } catch (error) {

      console.error(
        "ANDISHA ZONE CONNECTION ERROR:",
        error
      );

      showMessage(
        "ورود به ساختمان با خطا روبه‌رو شد."
      );

    }

  }

  /* ============================================
     رویدادهای دکمه‌ها
     ============================================ */

  launcher.addEventListener("click", openWorld);

  world.querySelector(".world-close").addEventListener(
    "click",
    closeWorld
  );

  world.addEventListener("click", function (event) {

    if (event.target === world) {
      closeWorld();
    }

  });

  document.addEventListener("keydown", function (event) {

    if (
      event.key === "Escape" &&
      world.classList.contains("open")
    ) {

      closeWorld();

    }

  });

  /* ============================================
     نصب در صفحه
     ============================================ */

  document.body.appendChild(launcher);
  document.body.appendChild(world);

  /* ============================================
     API عمومی افزونه
     ============================================ */

  window.andishaOpenCityWorld = openWorld;
  window.andishaCloseCityWorld = closeWorld;
  window.andishaEnterCityZone = enterZone;

  console.log(
    "ANDISHA CITY WORLD V2.1 READY"
  );

})();
