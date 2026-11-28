
"use strict";

/* =========================================================
   ANDISHA CITY LIFE V5.3
   Correct Hero Position
   Compatible with Fantasy World V4.0
   Independent movement and building interaction
   ========================================================= */

(function () {

  if (window.__ANDISHA_CITY_LIFE_V53__) return;
  window.__ANDISHA_CITY_LIFE_V53__ = true;

  const world = document.getElementById("andisha-fantasy-world");

  if (!world) {
    console.warn("ANDISHA V5.3: World not found.");
    return;
  }

  const island = world.querySelector(".fw40-island");
  const buildingsArea = world.querySelector(".fw40-buildings");

  if (!island || !buildingsArea) {
    console.warn("ANDISHA V5.3: Buildings area not found.");
    return;
  }

  const buildings = Array.from(
    buildingsArea.querySelectorAll(
      ".fw40-building[data-zone-index]"
    )
  );

  if (buildings.length !== 5) {
    console.warn("ANDISHA V5.3: Expected five buildings.");
    return;
  }

  const names = [
    "فروشگاه جادویی",
    "آشپزخانه شگفتی‌ها",
    "بانک گنجینه‌ها",
    "سرزمین اندازه‌ها",
    "برج افسانه‌ای"
  ];

  const storageKeys = [
    "andishaShopCompleted",
    "andishaKitchenCompleted",
    "andishaBankCompleted",
    "andishaMapCompleted",
    "andishaTowerCompleted"
  ];

  const avatars = ["🧑‍🚀", "🧙‍♂️", "🦸", "🧝‍♀️", "👩‍🚀"];

  const STEP = 2.8;
  const NEAR_DISTANCE = 125;

  let x = 50;
  let y = 90;
  let currentBuilding = null;
  let moveTimer = null;

  /* ---------- Remove previous versions ---------- */

  [
    "andisha-city-life-v51-style",
    "andisha-city-life-v52-style",
    "andisha-city-life-v53-style",
    "andisha-city-hero-v51",
    "andisha-city-controls-v51",
    "andisha-city-nearby-v51",
    "andisha-city-life-hint-v51"
  ].forEach(function (id) {
    const element = document.getElementById(id);
    if (element) element.remove();
  });

  /* ---------- Styles ---------- */

  const style = document.createElement("style");
  style.id = "andisha-city-life-v53-style";

  style.textContent = `

    #andisha-fantasy-world .fw40-buildings {
      position: relative;
    }

    #andisha-city-hero-v51 {
      position: absolute;
      z-index: 12;
      left: 50%;
      top: 90%;
      width: 52px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 42px;
      line-height: 1;
      pointer-events: none;
      transform: translate(-50%, -50%);
      filter: drop-shadow(0 6px 4px #102d4666);
      transition: left .12s linear, top .12s linear;
      animation: andishaHeroFloat53 1.5s ease-in-out infinite;
    }

    @keyframes andishaHeroFloat53 {
      0%,100% { margin-top: 0; }
      50% { margin-top: -5px; }
    }

    #andisha-city-nearby-v51 {
      position: relative;
      z-index: 25;
      width: 100%;
      min-height: 54px;
      margin: 18px auto 10px;
      padding: 7px 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      border: 2px solid #fff;
      border-radius: 16px;
      color: #26345d;
      background: linear-gradient(135deg,#fff4bd,#fff);
      box-shadow: 0 5px 13px #102d4633;
      font-family: inherit;
      font-size: 12px;
      font-weight: 900;
      visibility: hidden;
      opacity: 0;
      transition: opacity .2s ease;
    }

    #andisha-city-nearby-v51.show {
      visibility: visible;
      opacity: 1;
    }

    #andisha-city-nearby-v51 button {
      flex-shrink: 0;
      padding: 9px 14px;
      border: 0;
      border-radius: 11px;
      color: #fff;
      background: linear-gradient(135deg,#1aaf83,#08775f);
      font-family: inherit;
      font-size: 12px;
      font-weight: 1000;
      cursor: pointer;
    }

    #andisha-city-controls-v51 {
      position: relative;
      z-index: 25;
      width: max-content;
      margin: 8px auto 5px;
      display: grid;
      grid-template-columns: repeat(3,43px);
      grid-template-rows: repeat(2,43px);
      gap: 5px;
      direction: ltr;
      touch-action: none;
    }

    #andisha-city-controls-v51 button {
      width: 43px;
      height: 43px;
      border: 2px solid #fff;
      border-radius: 13px;
      color: #fff;
      background: linear-gradient(145deg,#9364f5,#344caa);
      box-shadow: 0 4px 0 #222e70, 0 5px 10px #0003;
      font-size: 20px;
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

    @media(max-width:370px) {
      #andisha-city-controls-v51 {
        grid-template-columns: repeat(3,39px);
        grid-template-rows: repeat(2,39px);
      }

      #andisha-city-controls-v51 button {
        width: 39px;
        height: 39px;
      }

      #andisha-city-nearby-v51 {
        gap: 5px;
        font-size: 11px;
      }

      #andisha-city-hero-v51 {
        font-size: 37px;
      }
    }

    @media(prefers-reduced-motion:reduce) {
      #andisha-city-hero-v51 {
        animation: none;
      }
    }
  `;

  document.head.appendChild(style);

  /* ---------- Hero: inside buildings area ---------- */

  const hero = document.createElement("div");
  hero.id = "andisha-city-hero-v51";
  hero.textContent = "🧑‍🚀";
  hero.setAttribute("aria-label", "قهرمان اندیشا");

  buildingsArea.appendChild(hero);

  function updateHero() {
    hero.style.left = x + "%";
    hero.style.top = y + "%";
  }

  /* ---------- Nearby panel ---------- */

  const info = document.createElement("div");
  info.id = "andisha-city-nearby-v51";

  info.innerHTML = `
    <span id="andisha-city-nearby-name-v51">
      به یک ساختمان نزدیک شو
    </span>
    <button type="button" id="andisha-city-enter-v51">
      ورود ✨
    </button>
  `;

  island.appendChild(info);

  /* ---------- Movement controls ---------- */

  const controls = document.createElement("div");
  controls.id = "andisha-city-controls-v51";

  controls.innerHTML = `
    <button type="button" data-dir="up" aria-label="بالا">▲</button>
    <button type="button" data-dir="left" aria-label="چپ">◀</button>
    <button type="button" data-dir="down" aria-label="پایین">▼</button>
    <button type="button" data-dir="right" aria-label="راست">▶</button>
  `;

  island.appendChild(controls);

  /* ---------- Storage ---------- */

  function isCompleted(index) {
    try {
      const value = localStorage.getItem(storageKeys[index]);

      return (
        value === "true" ||
        value === "1" ||
        value === "completed"
      );
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

  /* ---------- Nearby detection ---------- */

  function showNearby(building) {
    if (
      currentBuilding === building &&
      info.classList.contains("show")
    ) {
      return;
    }

    currentBuilding = building;

    const index = Number(building.dataset.zoneIndex);

    world.querySelector(
      "#andisha-city-nearby-name-v51"
    ).textContent = "✨ " + names[index];

    info.classList.add("show");
  }

  function hideNearby() {
    currentBuilding = null;
    info.classList.remove("show");
  }

  function checkNearby() {
    if (!isWorldOpen()) {
      hideNearby();
      return;
    }

    const heroRect = hero.getBoundingClientRect();

    const hx = heroRect.left + heroRect.width / 2;
    const hy = heroRect.top + heroRect.height / 2;

    let nearest = null;
    let nearestDistance = Infinity;

    buildings.forEach(function (building) {
      const rect = building.getBoundingClientRect();

      const bx = rect.left + rect.width / 2;
      const by = rect.top + rect.height / 2;

      const dx = bx - hx;
      const dy = by - hy;

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

  function move(direction) {
    if (!isWorldOpen()) return;

    if (direction === "up") y -= STEP;
    if (direction === "down") y += STEP;
    if (direction === "left") x -= STEP;
    if (direction === "right") x += STEP;

    x = Math.max(5, Math.min(95, x));
    y = Math.max(4, Math.min(96, y));

    updateHero();
    checkNearby();
  }

  function stopMoving() {
    if (moveTimer) {
      clearInterval(moveTimer);
      moveTimer = null;
    }
  }

  controls.querySelectorAll("button[data-dir]").forEach(
    function (button) {
      const direction = button.dataset.dir;

      button.addEventListener("pointerdown", function (event) {
        event.preventDefault();

        stopMoving();
        move(direction);

        moveTimer = window.setInterval(function () {
          move(direction);
        }, 140);
      });

      button.addEventListener("pointerup", stopMoving);
      button.addEventListener("pointercancel", stopMoving);
      button.addEventListener("pointerleave", stopMoving);
    }
  );

  window.addEventListener("pointerup", stopMoving);
  window.addEventListener("blur", stopMoving);

  /* ---------- Keyboard ---------- */

  document.addEventListener("keydown", function (event) {
    if (!isWorldOpen()) return;

    const target = event.target;
    const tag = target && target.tagName;

    if (tag === "INPUT" || tag === "TEXTAREA") return;

    const keys = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right"
    };

    const direction = keys[event.key];

    if (direction) {
      event.preventDefault();
      move(direction);
    }
  });

  /* ---------- Enter mission ---------- */

  function enterBuilding() {
    if (!currentBuilding) return;

    const index = Number(currentBuilding.dataset.zoneIndex);

    if (!Number.isInteger(index) || index < 0 || index > 4) {
      return;
    }

    if (index === 4 && getProgress() < 4) {
      world.querySelector(
        "#andisha-city-nearby-name-v51"
      ).textContent = "🔒 ابتدا چهار مأموریت دیگر را کامل کن";

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

    buildings[index].click();
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

    try {
      const avatarIndex = Number(
        localStorage.getItem("andishaFantasyAvatar")
      );

      if (
        Number.isInteger(avatarIndex) &&
        avatarIndex >= 0 &&
        avatarIndex < avatars.length
      ) {
        hero.textContent = avatars[avatarIndex];
      }
    } catch (error) {
      // Keep default avatar.
    }

    updateHero();
    checkNearby();
  }

  window.addEventListener("storage", refresh);
  window.addEventListener("focus", refresh);
  window.addEventListener("pageshow", refresh);

  const avatarButton = world.querySelector("#fw40-avatar-change");

  if (avatarButton) {
    avatarButton.addEventListener("click", function () {
      window.setTimeout(refresh, 0);
    });
  }

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
    y = 90;
    updateHero();
    checkNearby();
  };

  updateHero();

  console.log("ANDISHA CITY LIFE V5.3 READY");

})();
