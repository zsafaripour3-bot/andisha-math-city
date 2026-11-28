
"use strict";

/* =====================================================
   ANDISHA CITY LIFE V5.1
   حرکت قهرمان + تعامل با ساختمان‌ها
   نسخه یکپارچه و اصلاح‌شده
   مستقل از بازی اصلی و سیستم امتیازدهی
   ===================================================== */

(function () {
  if (window.__ANDISHA_CITY_LIFE_V51__) return;
  window.__ANDISHA_CITY_LIFE_V51__ = true;

  const STYLE_ID = "andisha-city-life-v51-style";
  const HERO_ID = "andisha-city-hero-v51";
  const CONTROL_ID = "andisha-city-controls-v51";
  const INFO_ID = "andisha-city-nearby-v51";

  const buildingNames = [
    "فروشگاه جادویی",
    "آشپزخانه شگفتی‌ها",
    "بانک گنجینه‌ها",
    "سرزمین اندازه‌ها",
    "برج افسانه‌ای"
  ];

  const STEP = 2.2;
  const NEAR_DISTANCE = 115;

  let world = null;
  let scene = null;
  let hero = null;
  let controls = null;
  let info = null;
  let nearbyBuilding = null;

  let x = 50;
  let y = 76;
  let direction = "down";

  function addStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      #${HERO_ID} {
        position:absolute;
        left:50%;
        top:76%;
        z-index:30;
        width:58px;
        height:68px;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:43px;
        line-height:1;
        pointer-events:none;
        transform:translate(-50%,-50%);
        filter:drop-shadow(0 5px 5px rgba(0,0,0,.35));
        transition:left .12s linear,top .12s linear;
        animation:andishaHeroFloat51 1.2s ease-in-out infinite;
      }

      #${HERO_ID}::after {
        content:"";
        position:absolute;
        width:34px;
        height:9px;
        bottom:1px;
        left:12px;
        border-radius:50%;
        background:rgba(0,0,0,.22);
        filter:blur(4px);
        z-index:-1;
      }

      @keyframes andishaHeroFloat51 {
        0%,100% { margin-top:0; }
        50% { margin-top:-5px; }
      }

      #${CONTROL_ID} {
        position:absolute;
        z-index:10020;
        left:14px;
        bottom:18px;
        display:grid;
        grid-template-columns:43px 43px 43px;
        grid-template-rows:43px 43px 43px;
        gap:5px;
        direction:ltr;
        touch-action:none;
      }

      #${CONTROL_ID} button {
        border:2px solid rgba(255,255,255,.85);
        border-radius:14px;
        background:linear-gradient(145deg,#4f8cff,#263eaa);
        color:white;
        font-size:22px;
        font-weight:bold;
        box-shadow:0 4px 10px rgba(0,0,0,.3);
        cursor:pointer;
        touch-action:none;
        user-select:none;
      }

      #${CONTROL_ID} button:active {
        transform:scale(.88);
        background:#ffb52e;
      }

      #${CONTROL_ID} .up {
        grid-column:2;
        grid-row:1;
      }

      #${CONTROL_ID} .left {
        grid-column:1;
        grid-row:2;
      }

      #${CONTROL_ID} .center {
        grid-column:2;
        grid-row:2;
        font-size:15px;
      }

      #${CONTROL_ID} .right {
        grid-column:3;
        grid-row:2;
      }

      #${CONTROL_ID} .down {
        grid-column:2;
        grid-row:3;
      }

      #${INFO_ID} {
        position:absolute;
        z-index:10021;
        left:14px;
        bottom:165px;
        max-width:220px;
        min-width:155px;
        padding:10px 13px;
        border:2px solid rgba(255,255,255,.8);
        border-radius:16px;
        background:rgba(20,35,75,.96);
        color:white;
        font-family:inherit;
        font-size:12px;
        line-height:1.8;
        text-align:center;
        box-shadow:0 5px 18px rgba(0,0,0,.3);
        display:none;
      }

      #${INFO_ID}.show {
        display:block;
        animation:andishaInfoIn51 .25s ease-out;
      }

      @keyframes andishaInfoIn51 {
        from {
          opacity:0;
          transform:translateY(8px);
        }
        to {
          opacity:1;
          transform:translateY(0);
        }
      }

      #${INFO_ID} button {
        display:block;
        width:100%;
        margin-top:6px;
        padding:7px;
        border:0;
        border-radius:10px;
        background:linear-gradient(90deg,#ffcf4a,#ff9c27);
        color:#382000;
        font-family:inherit;
        font-weight:bold;
        cursor:pointer;
      }

      .andisha-building-nearby-v51 {
        filter:drop-shadow(0 0 12px #ffe66d) !important;
        animation:andishaBuildingGlow51 1s ease-in-out infinite alternate;
      }

      @keyframes andishaBuildingGlow51 {
        from {
          transform:translateY(0) scale(1);
        }
        to {
          transform:translateY(-4px) scale(1.035);
        }
      }

      @media(max-width:600px) {
        #${CONTROL_ID} {
          transform:scale(.88);
          transform-origin:bottom left;
          left:8px;
          bottom:10px;
        }

        #${INFO_ID} {
          left:8px;
          bottom:145px;
          max-width:190px;
        }

        #${HERO_ID} {
          font-size:38px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function findWorld() {
    return (
      document.getElementById("andisha-fantasy-world") ||
      document.getElementById("andisha-city-world")
    );
  }

  function findScene() {
    if (!world) return null;

    return (
      world.querySelector(".world-scene") ||
      world.querySelector(".fantasy-scene") ||
      world.querySelector(".andisha-fantasy-scene") ||
      world
    );
  }

  function getBuildings() {
    if (!world) return [];

    return Array.from(
      world.querySelectorAll(
        ".world-building, .fantasy-building, .city-building, [data-zone-index]"
      )
    ).filter(function (element) {
      return !element.closest("#" + CONTROL_ID);
    });
  }

  function createHero() {
    if (!scene) return;

    hero = document.getElementById(HERO_ID);

    if (!hero) {
      hero = document.createElement("div");
      hero.id = HERO_ID;
      hero.textContent = "🧑‍🚀";
      hero.setAttribute("aria-label", "قهرمان اندیشا");
      scene.appendChild(hero);
    }

    scene.style.position = "relative";
    updateHeroPosition();
  }

  function createControls() {
    if (!world) return;

    controls = document.getElementById(CONTROL_ID);

    if (!controls) {
      controls = document.createElement("div");
      controls.id = CONTROL_ID;

      controls.innerHTML = `
        <button class="up" data-move="up" aria-label="بالا">▲</button>
        <button class="left" data-move="left" aria-label="چپ">◀</button>
        <button class="center" data-move="stop" aria-label="توقف">✦</button>
        <button class="right" data-move="right" aria-label="راست">▶</button>
        <button class="down" data-move="down" aria-label="پایین">▼</button>
      `;

      world.appendChild(controls);

      controls.addEventListener("pointerdown", function (event) {
        const button = event.target.closest("[data-move]");
        if (!button) return;

        event.preventDefault();

        const move = button.dataset.move;
        if (move === "stop") return;

        moveHero(move);
      });
    }

    info = document.getElementById(INFO_ID);

    if (!info) {
      info = document.createElement("div");
      info.id = INFO_ID;
      world.appendChild(info);
    }
  }

  function updateHeroPosition() {
    if (!hero) return;

    hero.style.left = x + "%";
    hero.style.top = y + "%";
  }

  function moveHero(move) {
    if (!hero || !world) return;

    if (world.getBoundingClientRect().width === 0) return;

    direction = move;

    if (move === "up") y -= STEP;
    if (move === "down") y += STEP;
    if (move === "left") x -= STEP;
    if (move === "right") x += STEP;

    x = Math.max(5, Math.min(95, x));
    y = Math.max(8, Math.min(91, y));

    updateHeroPosition();
    checkNearbyBuilding();
  }

  function getHeroCenter() {
    if (!hero) return null;

    const rect = hero.getBoundingClientRect();

    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  function getBuildingIndex(building) {
    const values = [
      building.dataset.index,
      building.dataset.zoneIndex,
      building.dataset.zone
    ];

    for (let i = 0; i < values.length; i++) {
      if (values[i] === undefined) continue;

      const number = Number(values[i]);

      if (Number.isInteger(number) && number >= 0 && number <= 4) {
        return number;
      }

      const keyMap = {
        shop:0,
        kitchen:1,
        bank:2,
        map:3,
        tower:4
      };

      if (keyMap[values[i]] !== undefined) {
        return keyMap[values[i]];
      }
    }

    const text = building.textContent || "";

    if (text.includes("فروشگاه")) return 0;
    if (text.includes("آشپزخانه")) return 1;
    if (text.includes("بانک")) return 2;
    if (text.includes("اندازه") || text.includes("نقشه")) return 3;
    if (text.includes("برج")) return 4;

    return -1;
  }

  function checkNearbyBuilding() {
    if (!hero || !world) return;

    const center = getHeroCenter();
    if (!center) return;

    const buildings = getBuildings();

    let closest = null;
    let closestDistance = Infinity;

    buildings.forEach(function (building) {
      const rect = building.getBoundingClientRect();

      if (!rect.width || !rect.height) return;

      const bx = rect.left + rect.width / 2;
      const by = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(center.x - bx, 2) +
        Math.pow(center.y - by, 2)
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closest = building;
      }
    });

    if (nearbyBuilding && nearbyBuilding !== closest) {
      nearbyBuilding.classList.remove(
        "andisha-building-nearby-v51"
      );
    }

    if (closest && closestDistance < NEAR_DISTANCE) {
      nearbyBuilding = closest;
      nearbyBuilding.classList.add(
        "andisha-building-nearby-v51"
      );

      showNearbyInfo(closest);
    } else {
      nearbyBuilding = null;
      hideNearbyInfo();
    }
  }

  function showNearbyInfo(building) {
    if (!info) return;

    // جلوگیری از بازسازی پیام برای یک ساختمان ثابت
    if (
      info._andishaTarget === building &&
      info.classList.contains("show")
    ) {
      return;
    }

    info._andishaTarget = building;

    const index = getBuildingIndex(building);

    const name = index >= 0
      ? buildingNames[index]
      : "ساختمان شهر";

    info.innerHTML = `
      <div>✨ به ${name} نزدیک شدی!</div>
      <div>برای ورود به این ساختمان آماده‌ای؟</div>
      <button type="button" id="andisha-enter-nearby-v51">
        🚪 ورود به ساختمان
      </button>
    `;

    info.classList.add("show");

    const enterButton = info.querySelector(
      "#andisha-enter-nearby-v51"
    );

    enterButton.addEventListener("click", function () {
      enterBuilding(building);
    });
  }

  function hideNearbyInfo() {
    if (!info) return;

    info._andishaTarget = null;
    info.classList.remove("show");
  }

  function enterBuilding(building) {
    if (!building) return;

    const index = getBuildingIndex(building);

    if (
      index >= 0 &&
      typeof window.andishaEnterCityZone === "function"
    ) {
      window.andishaEnterCityZone(index);
    } else if (
      index >= 0 &&
      typeof window.andishaOpenZone === "function"
    ) {
      window.andishaOpenZone(index);
    } else {
      building.click();
    }

    hideNearbyInfo();
  }

  function onKeyboard(event) {
    if (!world || !world.isConnected) return;

    if (world.getBoundingClientRect().width === 0) return;

    const keys = {
      ArrowUp:"up",
      ArrowDown:"down",
      ArrowLeft:"left",
      ArrowRight:"right"
    };

    const move = keys[event.key];

    if (move) {
      event.preventDefault();
      moveHero(move);
    }

    if (event.key === "Enter" && nearbyBuilding) {
      event.preventDefault();
      enterBuilding(nearbyBuilding);
    }
  }

  function activate() {
    world = findWorld();
    if (!world) return;

    scene = findScene();
    if (!scene) return;

    addStyle();
    createHero();
    createControls();
    checkNearbyBuilding();
  }

  function deactivate() {
    if (hero) hero.remove();
    if (controls) controls.remove();
    if (info) info.remove();

    if (nearbyBuilding) {
      nearbyBuilding.classList.remove(
        "andisha-building-nearby-v51"
      );
    }

    hero = null;
    controls = null;
    info = null;
    nearbyBuilding = null;
    scene = null;
    world = null;
  }

  function refresh() {
    const currentWorld = findWorld();

    if (!currentWorld) {
      deactivate();
      return;
    }

    if (currentWorld.getBoundingClientRect().width === 0) {
      deactivate();
      return;
    }

    if (
      world !== currentWorld ||
      !hero ||
      !hero.isConnected
    ) {
      deactivate();
      activate();
    } else {
      checkNearbyBuilding();
    }
  }

  document.addEventListener("keydown", onKeyboard);

  const observer = new MutationObserver(function () {
    refresh();
  });

  observer.observe(document.body, {
    childList:true,
    subtree:true,
    attributes:true,
    attributeFilter:["style","class"]
  });

  window.addEventListener("resize", refresh);
  window.addEventListener("pageshow", refresh);
  window.addEventListener("focus", refresh);

  window.andishaCityLifeRefresh = refresh;

  refresh();

  console.log("ANDISHA CITY LIFE V5.1 READY");

})();
