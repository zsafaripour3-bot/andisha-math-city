
"use strict";

/* ============================================
   ANDISHA CITY WORLD V1.3
   اتصال مستقیم ساختمان‌ها به بازی اصلی
   جلوگیری از کلیک واسطه‌ای و صدای تکراری
   ============================================ */

(function () {
  if (window.__ANDISHA_CITY_WORLD_V13__) return;
  window.__ANDISHA_CITY_WORLD_V13__ = true;

  const zones = [
    { name: "فروشگاه", icon: "🛍️", color: "#ff9f43" },
    { name: "آشپزخانه", icon: "🍳", color: "#20bf9f" },
    { name: "بانک", icon: "🏦", color: "#4b8cf5" },
    { name: "نقشه", icon: "🗺️", color: "#a477ed" },
    { name: "برج", icon: "🏙️", color: "#ef6b9b" }
  ];

  const style = document.createElement("style");

  style.textContent = `
    #andisha-city-launcher {
      position: fixed;
      right: 16px;
      bottom: 85px;
      z-index: 9998;
      border: 2px solid rgba(255,255,255,.8);
      border-radius: 18px;
      padding: 11px 15px;
      color: #fff;
      background: linear-gradient(135deg,#1765b8,#17336d);
      box-shadow: 0 5px 18px rgba(0,0,0,.25);
      font-family: inherit;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
    }

    #andisha-city-world {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: none;
      overflow-y: auto;
      padding: 22px 14px;
      box-sizing: border-box;
      background:
        radial-gradient(circle at 20% 15%,#fff5b7 0,transparent 28%),
        linear-gradient(160deg,#8bd9ff,#c8eaff 48%,#b5edc7);
      font-family: inherit;
    }

    #andisha-city-world.open {
      display: block;
    }

    #andisha-city-world .world-header {
      max-width: 650px;
      margin: 10px auto 22px;
      padding: 16px;
      text-align: center;
      color: #17336d;
      background: rgba(255,255,255,.85);
      border-radius: 20px;
      box-shadow: 0 5px 15px rgba(0,0,0,.1);
    }

    #andisha-city-world .world-header h2 {
      margin: 0 0 7px;
      font-size: 22px;
    }

    #andisha-city-world .world-header p {
      margin: 0;
      font-size: 13px;
    }

    #andisha-city-world .world-buildings {
      display: grid;
      grid-template-columns: repeat(2,minmax(0,1fr));
      gap: 14px;
      max-width: 650px;
      margin: auto;
    }

    #andisha-city-world .world-building {
      min-height: 145px;
      border: 3px solid rgba(255,255,255,.85);
      border-radius: 22px;
      padding: 15px 8px;
      color: #17336d;
      background: rgba(255,255,255,.9);
      box-shadow: 0 7px 0 rgba(30,75,120,.16),
                  0 10px 20px rgba(0,0,0,.12);
      font-family: inherit;
      cursor: pointer;
      transition: transform .15s ease;
    }

    #andisha-city-world .world-building:active {
      transform: translateY(5px);
      box-shadow: 0 2px 0 rgba(30,75,120,.16);
    }

    #andisha-city-world .world-building .building-icon {
      display: block;
      font-size: 48px;
      margin-bottom: 9px;
    }

    #andisha-city-world .world-building strong {
      display: block;
      font-size: 17px;
    }

    #andisha-city-world .world-building small {
      display: block;
      margin-top: 6px;
      color: #63758c;
      font-size: 11px;
    }

    #andisha-city-world .world-building:last-child {
      grid-column: 1 / -1;
      min-height: 125px;
    }

    #andisha-city-world .world-close {
      display: block;
      margin: 25px auto 10px;
      border: 0;
      border-radius: 14px;
      padding: 12px 28px;
      color: #fff;
      background: #17336d;
      font-family: inherit;
      font-size: 15px;
      font-weight: bold;
      cursor: pointer;
    }

    @media (max-width: 360px) {
      #andisha-city-world .world-buildings {
        gap: 9px;
      }

      #andisha-city-world .world-building {
        min-height: 125px;
      }
    }
  `;

  document.head.appendChild(style);

  const launcher = document.createElement("button");
  launcher.id = "andisha-city-launcher";
  launcher.type = "button";
  launcher.textContent = "🏙️ شهر سه‌بعدی";

  const world = document.createElement("div");
  world.id = "andisha-city-world";

  world.innerHTML = `
    <div class="world-header">
      <h2>🏙️ شهر هوشمند اندیشا</h2>
      <p>برای ورود به هر بخش، ساختمان آن را انتخاب کن.</p>
    </div>

    <div class="world-buildings"></div>

    <button class="world-close" type="button">
      بازگشت به بازی ✨
    </button>
  `;

  const buildings = world.querySelector(".world-buildings");

  zones.forEach(function (zone, index) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "world-building";
    button.style.borderBottom = "6px solid " + zone.color;

    button.innerHTML =
      '<span class="building-icon">' + zone.icon + "</span>" +
      "<strong>" + zone.name + "</strong>" +
      "<small>برای ورود لمس کن</small>";

    button.addEventListener("click", function () {
      enterZone(index);
    });

    buildings.appendChild(button);
  });

  function openWorld() {
    world.classList.add("open");
  }

  function closeWorld() {
    world.classList.remove("open");
  }

  function findMainZoneButton(index) {
    const buttons = document.querySelectorAll(
      '#app button[data-action="zone"]'
    );

    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];

      const values = [
        button.getAttribute("data-index"),
        button.getAttribute("data-zone-index"),
        button.getAttribute("data-zone")
      ];

      for (let j = 0; j < values.length; j++) {
        if (values[j] !== null && Number(values[j]) === index) {
          return button;
        }
      }
    }

    return null;
  }

  function enterZone(index) {
    closeWorld();

    /*
      مسیر اصلی:
      استفاده از API خود بازی، بدون کلیک ساختگی.
      صدای همان ساختمان نیز فقط یک بار اجرا می‌شود.
    */

    if (typeof window.andishaOpenZone === "function") {
      window.andishaOpenZone(index);

      if (typeof window.andishaPlayZoneVoice === "function") {
        window.andishaPlayZoneVoice(index);
      }

      return;
    }

    /*
      مسیر جایگزین برای نسخه‌هایی که API ندارند.
    */

    const originalButton = findMainZoneButton(index);

    if (originalButton) {
      originalButton.click();
      return;
    }

    showMessage("دکمه ورود این ساختمان در بازی پیدا نشد.");
  }

  function showMessage(message) {
    let toast = document.getElementById("andisha-world-toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.id = "andisha-world-toast";

      toast.style.cssText =
        "position:fixed;z-index:10001;bottom:25px;left:50%;" +
        "transform:translateX(-50%);background:#17336d;color:white;" +
        "padding:12px 18px;border-radius:14px;font-family:inherit;" +
        "font-size:13px;max-width:85%;text-align:center;";

      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.display = "block";

    window.setTimeout(function () {
      toast.style.display = "none";
    }, 2500);
  }

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

  document.body.appendChild(launcher);
  document.body.appendChild(world);

  window.andishaOpenCityWorld = openWorld;
  window.andishaCloseCityWorld = closeWorld;

  console.log("ANDISHA CITY WORLD V1.3 READY");
})();
