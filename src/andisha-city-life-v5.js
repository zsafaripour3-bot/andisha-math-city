
"use strict";

/* =========================================================
   ANDISHA CITY LIFE V5.1
   حرکت قهرمان + تعامل با ساختمان‌های V4.0
   مستقل از بازی اصلی، امتیازها و سیستم صدا
   ========================================================= */

(function () {

  if (window.__ANDISHA_CITY_LIFE_V51__) return;
  window.__ANDISHA_CITY_LIFE_V51__ = true;

  const world = document.getElementById("andisha-fantasy-world");

  if (!world) {
    console.warn("ANDISHA CITY LIFE: Fantasy World not found.");
    return;
  }

  const island = world.querySelector(".fw40-island");
  const buildings = Array.from(
    world.querySelectorAll(".fw40-building[data-zone-index]")
  );

  if (!island || buildings.length !== 5) {
    console.warn("ANDISHA CITY LIFE: Island or buildings not found.");
    return;
  }

  const storageKeys = [
    "andishaShopCompleted",
    "andishaKitchenCompleted",
    "andishaBankCompleted",
    "andishaMapCompleted",
    "andishaTowerCompleted"
  ];

  const zoneNames = [
    "فروشگاه جادویی",
    "آشپزخانه شگفتی‌ها",
    "بانک گنجینه‌ها",
    "سرزمین اندازه‌ها",
    "برج افسانه‌ای"
  ];

  const STEP = 3.5;
  const NEAR_DISTANCE = 125;

  let x = 50;
  let y = 88;
  let direction = "down";
  let moveTimer = null;
  let currentBuilding = null;

  /* ---------- Styles ---------- */

  const style = document.createElement("style");
  style.id = "andisha-city-life-v51-style";

  style.textContent = `
    #andisha-city-hero-v51 {
      position: absolute;
      z-index: 20;
      left: 50%;
      top: 88%;
      width: 54px;
      height: 62px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 43px;
      line-height: 1;
      pointer-events: none;
      transform: translate(-50%, -50%);
      filter: drop-shadow(0 7px 4px #102d4666);
      transition: left .12s linear, top .12s linear;
      animation: andishaHeroFloat51 1.5s ease-in-out infinite;
    }

    @keyframes andishaHeroFloat51 {
      0%,100% { margin-top: 0; }
      50% { margin-top: -5px; }
    }

    #andisha-city-controls-v51 {
      position: fixed;
      z-index: 10001;
      left: 14px;
      bottom: 17px;
      display: grid;
      grid-template-columns: repeat(3, 43px);
      grid-template-rows: repeat(2, 43px);
      gap: 5px;
      direction: ltr;
      touch-action: none;
    }

    #andisha-city-controls-v51 button {
      border: 2px solid #fff;
      border-radius: 13px;
      color: #fff;
      background: linear-gradient(145deg,#9364f5,#344caa);
      box-shadow: 0 4px 0 #222e70, 0 5px 12px #0004;
      font-size: 21px;
      font-weight: 900;
      cursor: pointer;
      touch-action: none;
      -webkit-tap-highlight-color: transparent;
    }

    #andisha-city-controls-v51 button:active {
      transform: translateY(3px);
      box-shadow: 0 1px 0 #222e70;
    }

    #andisha-city-controls-v51 [data-dir="up"] {
      grid-column: 2;
      grid-row: 1;
    }

    #andisha-city-controls-v51 [data-dir="left"] {
      grid-column: 1;
      grid-row: 2;
    }

    #andisha-city-controls-v51 [data-dir="down"] {
      grid-column: 2;
      grid-row: 2;
    }

    #andisha-city-controls-v51 [data-dir="right"] {
      grid-column: 3;
      grid-row: 2;
    }

    #andisha-city-nearby-v51 {
      position: fixed;
      z-index: 10002;
      left: 50%;
      bottom: 125px;
      width: max-content;
      max-width: 88%;
      display: none;
      align-items: center;
      gap: 9px;
      padding: 10px 12px;
      border: 2px solid #fff;
      border-radius: 17px;
      color: #26345d;
      background: linear-gradient(135deg,#fff4bd,#fff);
      box-shadow: 0 7px 22px #0005;
      transform: translateX(-50%);
      font-family: inherit;
      font-size: 12px;
      font-weight: 900;
    }

    #andisha-city-nearby-v51.show {
      display: flex;
    }

    #andisha-city-nearby-v51 button {
      flex-shrink: 0;
      padding: 9px 13px;
      border: 0;
      border-radius: 11px;
      color: #fff;
      background: linear-gradient(135deg,#1aaf83,#08775f);
      font-family: inherit;
      font-size: 12px;
      font-weight: 1000;
      cursor: pointer;
    }

    #andisha-city-life-hint-v51 {
      position: fixed;
      z-index: 10000;
      right: 12px;
      bottom: 24px;
      max-width: 180px;
      padding: 9px 11px;
      border: 1px solid #ffffff77;
      border-radius: 13px;
      color: #fff;
      background: #172b66dd;
      font-size: 10px;
      line-height: 1.8;
      pointer-events: none;
    }

    @media(max-width:370px) {
      #andisha-city-controls-v51 {
        left: 8px;
        bottom: 12px;
        grid-template-columns: repeat(3,39px);
        grid-template-rows: repeat(2,39px);
      }

      #andisha-city-nearby-v51 {
        bottom: 112px;
        font-size: 11px;
      }

      #andisha-city-life-hint-v51 {
        right: 8px;
        bottom: 17px;
        max-width: 145px;
      }
    }
  `;

  document.head.appendChild(style);

  /* ---------- Hero ---------- */

  const hero = document.createElement("div");
  hero.id = "andisha-city-hero-v51";
  hero.textContent = "🧑‍🚀";
  hero.setAttribute("aria-label", "قهرمان متحرک اندیشا");

  island.appendChild(hero);

  function updateHero() {
    hero.style.left = x + "%";
    hero.style.top = y + "%";
  }

  /* ---------- Movement controls ---------- */

  const controls = document.createElement("div");
  controls.id = "andisha-city-controls-v51";

  controls.innerHTML = `
    <button type="button" data-dir="up" aria-label="بالا">▲</button>
    <button type="button" data-dir="left" aria-label="چپ">◀</button>
    <button type="button" data-dir="down" aria-label="پایین">▼</button>
    <button type="button" data-dir="right" aria-label="راست">▶</button>
  `;

  world.appendChild(controls);

  const hint = document.createElement("div");
  hint.id = "andisha-city-life-hint-v51";
  hint.textContent = "با دکمه‌ها حرکت کن؛ نزدیک ساختمان‌ها برو و وارد مأموریت شو.";
  world.appendChild(hint);

  /* ---------- Nearby building panel ---------- */

  const info = document.createElement("div");
  info.id = "andisha-city-nearby-v51";

  info.innerHTML = `
    <span id="andisha-city-nearby-name-v51"></span>
    <button type="button" id="andisha-city-enter-v51">
      ورود ✨
    </button>
  `;

  world.appendChild(info);

  /* ---------- Helpers ---------- */

  function isCompleted(index) {
    try {
      const value = localStorage.getItem(storageKeys[index]);
      return value === "true" ||
        value === "1" ||
        value === "completed";
    } catch (error) {
      return false;
    }
  }

  function getProgress() {
    return storageKeys.reduce(function (total, key, index) {
      return total + (isCompleted(index) ? 1 : 0);
    }, 0);
  }

  function isWorldOpen() {
    return world.classList.contains("open");
  }

  function showNearby(building) {
    if (currentBuilding === building && info.classList.contains("show")) {
      return;
    }

    currentBuilding = building;

    const index = Number(building.dataset.zoneIndex);

    world.querySelector("#andisha-city-nearby-name-v51").textContent =
      "✨ " + zoneNames[index];

    info.classList.add("show");
  }

  function hideNearby() {
    currentBuilding = null;
    info.classList.remove("show");
  }

  /* ---------- Detect nearby buildings ---------- */

  function checkNearby() {

    if (!isWorldOpen()) {
      hideNearby();
      return;
    }

    const heroRect = hero.getBoundingClientRect();

    const heroCenterX = heroRect.left + heroRect.width / 2;
    const heroCenterY = heroRect.top + heroRect.height / 2;

    let nearest = null;
    let nearestDistance = Infinity;

    buildings.forEach(function (building) {

      const rect = building.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = centerX - heroCenterX;
      const dy = centerY - heroCenterY;

      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = building;
      }

    });

    if (nearest && nearestDistance <= NEAR_DISTANCE) {
      showNearby(nearest);
    } else {
      hideNearby();
    }
  }

  /* ---------- Movement ---------- */

  function move(dir) {

    if (!isWorldOpen()) return;

    direction = dir;

    if (dir === "up") y -= STEP;
    if (dir === "down") y += STEP;
    if (dir === "left") x -= STEP;
    if (dir === "right") x += STEP;

    x = Math.max(5, Math.min(95, x));
    y = Math.max(5, Math.min(95, y));

    updateHero();
    checkNearby();
  }

  function stopMoving() {
    if (moveTimer) {
      clearInterval(moveTimer);
      moveTimer = null;
    }
  }

  controls.querySelectorAll("button[data-dir]").forEach(function (button) {

    const dir = button.dataset.dir;

    button.addEventListener("pointerdown", function (event) {
      event.preventDefault();

      stopMoving();
      move(dir);

      moveTimer = window.setInterval(function () {
        move(dir);
      }, 140);
    });

    button.addEventListener("pointerup", stopMoving);
    button.addEventListener("pointercancel", stopMoving);
    button.addEventListener("pointerleave", stopMoving);

  });

  window.addEventListener("pointerup", stopMoving);
  window.addEventListener("blur", stopMoving);

  /* ---------- Keyboard movement ---------- */

  document.addEventListener("keydown", function (event) {

    if (!isWorldOpen()) return;

    const tag = event.target && event.target.tagName;

    if (tag === "INPUT" || tag === "TEXTAREA") return;

    const keys = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right"
    };

    const dir = keys[event.key];

    if (dir) {
      event.preventDefault();
      move(dir);
    }

  });

  /* ---------- Enter building ---------- */

  function enterBuilding() {

    if (!currentBuilding) return;

    const index = Number(currentBuilding.dataset.zoneIndex);

    if (!Number.isInteger(index) || index < 0 || index > 4) {
      return;
    }

    if (index === 4 && getProgress() < 4) {
      info.classList.remove("show");

      const name = world.querySelector("#andisha-city-nearby-name-v51");
      name.textContent = "🔒 ابتدا چهار مأموریت دیگر را کامل کن";

      info.classList.add("show");
      return;
    }

    stopMoving();

    if (typeof window.andishaEnterCityZone === "function") {
      window.andishaEnterCityZone(index);
      return;
    }

    if (typeof window.andishaOpenZone === "function") {
      window.andishaOpenZone(index);
      return;
    }

    const building = buildings[index];

    if (building) {
      building.click();
    }
  }

  info.querySelector("#andisha-city-enter-v51").addEventListener(
    "click",
    enterBuilding
  );

  /* ---------- Refresh ---------- */

  function refresh() {

    if (!isWorldOpen()) {
      hideNearby();
      stopMoving();
      return;
    }

    updateHero();

    const avatarIndex = Number(
      localStorage.getItem("andishaFantasyAvatar")
    );

    const avatars = ["🧑‍🚀", "🧙‍♂️", "🦸", "🧝‍♀️", "👩‍🚀"];

    if (
      Number.isInteger(avatarIndex) &&
      avatarIndex >= 0 &&
      avatarIndex < avatars.length
    ) {
      hero.textContent = avatars[avatarIndex];
    }

    checkNearby();
  }

  /* ---------- Events ---------- */

  window.addEventListener("storage", refresh);
  window.addEventListener("focus", refresh);
  window.addEventListener("pageshow", refresh);

  world.addEventListener("click", function (event) {
    if (event.target.closest("#fw40-avatar-change")) {
      refresh();
    }
  });

  const observer = new MutationObserver(function () {
    if (isWorldOpen()) refresh();
  });

  observer.observe(world, {
    attributes: true,
    attributeFilter: ["class"]
  });

  /* ---------- Public API ---------- */

  window.andishaCityLifeRefresh = refresh;

  window.andishaCityLifeResetPosition = function () {
    x = 50;
    y = 88;
    updateHero();
    checkNearby();
  };

  updateHero();

  console.log("ANDISHA CITY LIFE V5.1 READY");

})();
