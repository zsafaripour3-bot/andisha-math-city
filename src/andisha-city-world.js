
"use strict";

/* ==================================================
   ANDISHA SMART CITY
   FANTASY WORLD V3.0
   Independent visual expansion
   Preserves main game, scores and audio system
   ================================================== */

(function () {

  if (window.__ANDISHA_FANTASY_WORLD_V30__) return;
  window.__ANDISHA_FANTASY_WORLD_V30__ = true;

  const zones = [
    {
      name: "فروشگاه جادویی",
      key: "shop",
      icon: "🛍️",
      color: "#ffad45",
      light: "#fff0c8",
      desc: "راز تخفیف‌ها را کشف کن",
      mission: "مأموریت خرید هوشمند",
      reward: "نشان خریداری دانا"
    },
    {
      name: "آشپزخانه شگفتی‌ها",
      key: "kitchen",
      icon: "🍳",
      color: "#22cda7",
      light: "#c9fff0",
      desc: "جادوی تناسب را بیاموز",
      mission: "مأموریت آشپز کوچک",
      reward: "نشان استاد تناسب"
    },
    {
      name: "بانک گنجینه‌ها",
      key: "bank",
      icon: "🏦",
      color: "#579cff",
      light: "#d7eaff",
      desc: "گنج درصدها را پیدا کن",
      mission: "مأموریت نگهبان گنج",
      reward: "نشان نابغه درصد"
    },
    {
      name: "سرزمین اندازه‌ها",
      key: "map",
      icon: "🗺️",
      color: "#aa83ff",
      light: "#eadfff",
      desc: "مسیرهای ناشناخته را بپیمای",
      mission: "مأموریت نقشه‌خوان",
      reward: "نشان کاشف سرزمین"
    },
    {
      name: "برج افسانه‌ای",
      key: "tower",
      icon: "🏰",
      color: "#f16da4",
      light: "#ffe0ed",
      desc: "چالش نهایی قهرمانان",
      mission: "مأموریت قهرمان اندیشا",
      reward: "نشان قهرمان افسانه‌ای"
    }
  ];

  const avatars = ["🧑‍🚀", "🧙‍♂️", "🦸", "🧝‍♀️", "👩‍🚀"];

  const storageKeys = [
    "andishaShopCompleted",
    "andishaKitchenCompleted",
    "andishaBankCompleted",
    "andishaMapCompleted",
    "andishaTowerCompleted"
  ];

  const styleId = "andisha-fantasy-v30-style";
  const worldId = "andisha-fantasy-world";
  const launcherId = "andisha-fantasy-launcher";

  /* ---------- Cleanup old visual versions ---------- */

  [
    "andisha-city-launcher",
    "andisha-city-world",
    "andisha-city-world-style",
    "andisha-fantasy-launcher",
    "andisha-fantasy-world",
    "andisha-fantasy-v30-style"
  ].forEach(function (id) {
    const old = document.getElementById(id);
    if (old) old.remove();
  });

  /* ---------- Storage helpers ---------- */

  function readStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function isCompleted(index) {
    return readStorage(storageKeys[index]) === "true";
  }

  function getProgress() {
    return zones.reduce(function (total, zone, index) {
      return total + (isCompleted(index) ? 1 : 0);
    }, 0);
  }

  function getScore() {
    const value = Number(readStorage("andishaScore"));
    return Number.isFinite(value) ? value : 0;
  }

  function getAvatar() {
    const saved = readStorage("andishaFantasyAvatar");
    const index = Number(saved);

    return Number.isInteger(index) &&
      index >= 0 &&
      index < avatars.length
      ? index
      : 0;
  }

  function saveAvatar(index) {
    try {
      localStorage.setItem("andishaFantasyAvatar", String(index));
    } catch (error) {
      console.warn("Avatar could not be saved.");
    }
  }

  /* ---------- Main stylesheet ---------- */

  const style = document.createElement("style");
  style.id = styleId;

  style.textContent = `

  #${launcherId},
  #${worldId} {
    font-family: inherit;
    box-sizing: border-box;
  }

  #${launcherId} {
    position: fixed;
    right: 15px;
    bottom: 85px;
    z-index: 9998;
    border: 2px solid #fff;
    border-radius: 20px;
    padding: 12px 17px;
    color: #fff;
    font-size: 14px;
    font-weight: 900;
    background: linear-gradient(135deg,#8154ed,#263b91);
    box-shadow: 0 6px 0 #30215f, 0 12px 28px #17255455;
    cursor: pointer;
    animation: andishaLauncherFloat 3s ease-in-out infinite;
    -webkit-tap-highlight-color: transparent;
  }

  @keyframes andishaLauncherFloat {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }

  #${worldId} {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: none;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 14px 12px 35px;
    color: white;
    background:
      radial-gradient(ellipse at 50% 15%,#627ee8 0%,transparent 42%),
      linear-gradient(180deg,#111d53 0%,#263d83 47%,#172b5e 100%);
    isolation: isolate;
    overscroll-behavior: contain;
  }

  #${worldId}.open {
    display: block;
    animation: andishaWorldAppear .4s ease;
  }

  @keyframes andishaWorldAppear {
    from { opacity: 0; transform: scale(.96); }
    to { opacity: 1; transform: scale(1); }
  }

  #${worldId} *,
  #${worldId} *:before,
  #${worldId} *:after {
    box-sizing: border-box;
  }

  #${worldId} .fw-stars {
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background-image:
      radial-gradient(2px 2px at 10% 20%,#fff 50%,transparent 100%),
      radial-gradient(2px 2px at 80% 15%,#fff 50%,transparent 100%),
      radial-gradient(3px 3px at 60% 35%,#fff 50%,transparent 100%),
      radial-gradient(2px 2px at 25% 60%,#fff 50%,transparent 100%),
      radial-gradient(2px 2px at 90% 75%,#fff 50%,transparent 100%),
      radial-gradient(3px 3px at 40% 85%,#fff 50%,transparent 100%);
    opacity: .8;
    animation: fwTwinkle 4s ease-in-out infinite alternate;
  }

  @keyframes fwTwinkle {
    from { opacity: .4; }
    to { opacity: 1; }
  }

  #${worldId} .fw-orb {
    position: absolute;
    top: 95px;
    left: -45px;
    width: 130px;
    height: 130px;
    border-radius: 50%;
    background: #b99aff;
    opacity: .13;
    filter: blur(15px);
    pointer-events: none;
  }

  #${worldId} .fw-header {
    max-width: 720px;
    margin: 8px auto 15px;
    text-align: center;
  }

  #${worldId} .fw-logo {
    display: inline-block;
    font-size: 13px;
    font-weight: 900;
    letter-spacing: 2px;
    color: #ffe28c;
    padding: 7px 15px;
    border: 1px solid #ffffff44;
    border-radius: 30px;
    background: #ffffff10;
  }

  #${worldId} .fw-title {
    margin: 13px 0 5px;
    font-size: clamp(24px,6vw,35px);
    font-weight: 1000;
    color: #fff4bd;
    text-shadow: 0 4px 15px #f7bd4d66;
  }

  #${worldId} .fw-subtitle {
    margin: 0;
    font-size: 13px;
    color: #dce8ff;
  }

  #${worldId} .fw-hero {
    position: relative;
    max-width: 650px;
    margin: 16px auto;
    padding: 13px;
    display: flex;
    align-items: center;
    gap: 12px;
    border: 1px solid #ffffff40;
    border-radius: 22px;
    background: linear-gradient(135deg,#ffffff24,#ffffff0b);
    box-shadow: inset 0 1px 0 #ffffff35,0 12px 30px #080f3550;
    backdrop-filter: blur(8px);
  }

  #${worldId} .fw-avatar {
    flex: 0 0 68px;
    width: 68px;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 22px;
    font-size: 42px;
    background: linear-gradient(145deg,#fff1b4,#e8a9ff);
    box-shadow: 0 5px 0 #8e66c9;
  }

  #${worldId} .fw-hero-info {
    flex: 1;
    min-width: 0;
  }

  #${worldId} .fw-hero-info strong {
    display: block;
    font-size: 16px;
    color: #fff4c9;
  }

  #${worldId} .fw-hero-info small {
    display: block;
    margin-top: 5px;
    color: #d8e5ff;
    font-size: 11px;
  }

  #${worldId} .fw-avatar-change {
    border: 1px solid #ffffff66;
    border-radius: 12px;
    padding: 8px 10px;
    color: white;
    background: #ffffff19;
    font-family: inherit;
    font-weight: bold;
    cursor: pointer;
  }

  #${worldId} .fw-stats {
    max-width: 650px;
    margin: 0 auto 15px;
    display: grid;
    grid-template-columns: repeat(3,minmax(0,1fr));
    gap: 8px;
  }

  #${worldId} .fw-stat {
    padding: 11px 5px;
    text-align: center;
    border: 1px solid #ffffff35;
    border-radius: 16px;
    background: #ffffff15;
  }

  #${worldId} .fw-stat b {
    display: block;
    font-size: 20px;
    color: #ffe49a;
  }

  #${worldId} .fw-stat small {
    display: block;
    margin-top: 3px;
    font-size: 10px;
    color: #dbe5ff;
  }

  #${worldId} .fw-progress {
    max-width: 650px;
    margin: 0 auto 20px;
    padding: 13px;
    border: 1px solid #ffffff38;
    border-radius: 18px;
    background: #ffffff13;
  }

  #${worldId} .fw-progress-head {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-size: 12px;
    font-weight: bold;
    color: #fff3c2;
    margin-bottom: 9px;
  }

  #${worldId} .fw-progress-track {
    height: 12px;
    border-radius: 20px;
    overflow: hidden;
    background: #0e1749;
    box-shadow: inset 0 2px 4px #0005;
  }

  #${worldId} .fw-progress-fill {
    height: 100%;
    width: 0;
    border-radius: 20px;
    background: linear-gradient(90deg,#4be5c1,#ffe36b,#ff9fbd);
    box-shadow: 0 0 12px #fff3a8;
    transition: width .5s ease;
  }

  #${worldId} .fw-section-title {
    max-width: 650px;
    margin: 20px auto 12px;
    color: #fff1b6;
    font-size: 17px;
    font-weight: 900;
  }

  #${worldId} .fw-island {
    position: relative;
    max-width: 700px;
    margin: 0 auto;
    padding: 15px 10px 20px;
    border: 2px solid #ffffff42;
    border-radius: 27px;
    background:
      radial-gradient(ellipse at 50% 0%,#ffffff18,transparent 65%),
      linear-gradient(180deg,#415eaa88,#15265d99);
    box-shadow: 0 15px 35px #070d3155;
  }

  #${worldId} .fw-island:before {
    content: "";
    position: absolute;
    left: 7%;
    right: 7%;
    bottom: 8px;
    height: 13px;
    border-radius: 50%;
    background: #0c1746;
    filter: blur(7px);
    opacity: .7;
  }

  #${worldId} .fw-buildings {
    position: relative;
    display: grid;
    grid-template-columns: repeat(2,minmax(0,1fr));
    gap: 13px;
  }

  #${worldId} .fw-building {
    position: relative;
    min-width: 0;
    min-height: 170px;
    padding: 13px 7px 12px;
    overflow: hidden;
    border: 2px solid #ffffff;
    border-radius: 21px;
    color: #24325e;
    background: linear-gradient(150deg,#ffffff,#e9eaff);
    box-shadow: 0 8px 0 #101b4d88,0 12px 22px #080f3455;
    font-family: inherit;
    cursor: pointer;
    transition: transform .2s ease,filter .2s ease;
    -webkit-tap-highlight-color: transparent;
  }

  #${worldId} .fw-building:active {
    transform: translateY(5px) scale(.98);
  }

  #${worldId} .fw-building:focus-visible {
    outline: 3px solid #ffe58d;
    outline-offset: 3px;
  }

  #${worldId} .fw-building:before {
    content: "";
    position: absolute;
    top: -35px;
    right: -25px;
    width: 95px;
    height: 95px;
    border-radius: 50%;
    background: var(--fw-light);
    opacity: .8;
  }

  #${worldId} .fw-building-top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 8px;
    background: var(--fw-color);
  }

  #${worldId} .fw-building-icon {
    position: relative;
    display: flex;
    width: 76px;
    height: 76px;
    margin: 7px auto 9px;
    align-items: center;
    justify-content: center;
    border-radius: 23px;
    font-size: 43px;
    background: var(--fw-light);
    box-shadow: inset 0 -6px #0000000c,0 6px 12px #00000015;
    animation: fwBuildingFloat 3s ease-in-out infinite;
  }

  #${worldId} .fw-building:nth-child(even) .fw-building-icon {
    animation-delay: .6s;
  }

  @keyframes fwBuildingFloat {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }

  #${worldId} .fw-building strong {
    position: relative;
    display: block;
    font-size: 14px;
    font-weight: 1000;
  }

  #${worldId} .fw-building small {
    position: relative;
    display: block;
    margin-top: 5px;
    color: #66718e;
    font-size: 10px;
  }

  #${worldId} .fw-status {
    position: relative;
    display: inline-block;
    margin-top: 8px;
    padding: 4px 9px;
    border-radius: 20px;
    color: #5b6681;
    background: #e8edf8;
    font-size: 10px;
    font-weight: 900;
  }

  #${worldId} .fw-building.done {
    border-color: #ffe18a;
    background: linear-gradient(145deg,#fff8d8,#fff);
  }

  #${worldId} .fw-building.done .fw-status {
    color: #176f54;
    background: #c8f6df;
  }

  #${worldId} .fw-building.final {
    grid-column: 1 / -1;
    min-height: 160px;
    background: linear-gradient(145deg,#fff0f6,#fff);
    border-color: #ffb9d4;
  }

  #${worldId} .fw-building.final .fw-building-icon {
    width: 70px;
    height: 70px;
  }

  #${worldId} .fw-building.final.locked {
    filter: saturate(.65);
  }

  #${worldId} .fw-building.final.ready {
    box-shadow: 0 0 0 3px #ffd36d,0 8px 0 #9e4b7b,0 0 28px #ffcf6d99;
    animation: fwFinalGlow 1.8s ease-in-out infinite alternate;
  }

  @keyframes fwFinalGlow {
    from { box-shadow: 0 0 0 2px #ffd36d,0 8px 0 #9e4b7b,0 0 12px #ffcf6d55; }
    to { box-shadow: 0 0 0 4px #fff0a8,0 8px 0 #9e4b7b,0 0 28px #ffcf6d; }
  }

  #${worldId} .fw-footer {
    max-width: 650px;
    margin: 18px auto 0;
    text-align: center;
    color: #dbe7ff;
    font-size: 12px;
    line-height: 2;
  }

  #${worldId} .fw-close {
    display: block;
    margin: 18px auto 5px;
    border: 2px solid #ffffff;
    border-radius: 16px;
    padding: 12px 25px;
    color: #fff;
    background: linear-gradient(135deg,#8154ed,#263b91);
    box-shadow: 0 5px 0 #101a4d;
    font-family: inherit;
    font-weight: 900;
    cursor: pointer;
  }

  #${worldId} .fw-toast {
    position: fixed;
    z-index: 10002;
    left: 50%;
    bottom: 24px;
    width: max-content;
    max-width: 88%;
    transform: translateX(-50%);
    padding: 12px 17px;
    border: 1px solid #ffffff55;
    border-radius: 15px;
    color: white;
    background: #182b68;
    box-shadow: 0 8px 24px #0005;
    text-align: center;
    font-size: 13px;
    font-weight: bold;
  }

  @media(max-width:370px) {
    #${worldId} {
      padding-left: 8px;
      padding-right: 8px;
    }

    #${worldId} .fw-buildings {
      gap: 8px;
    }

    #${worldId} .fw-building {
      min-height: 155px;
    }

    #${worldId} .fw-building-icon {
      width: 65px;
      height: 65px;
      font-size: 37px;
    }

    #${worldId} .fw-hero {
      gap: 8px;
    }

    #${worldId} .fw-avatar {
      flex-basis: 57px;
      width: 57px;
      height: 57px;
      font-size: 35px;
    }
  }

  @media(prefers-reduced-motion:reduce) {
    #${worldId} *,
    #${launcherId} {
      animation: none !important;
      transition: none !important;
    }
  }

  `;

  document.head.appendChild(style);

  /* ---------- Launcher ---------- */

  const launcher = document.createElement("button");
  launcher.id = launcherId;
  launcher.type = "button";
  launcher.textContent = "✨ ورود به دنیای اندیشا";
  launcher.setAttribute("aria-label", "ورود به دنیای فانتزی اندیشا");

  /* ---------- World container ---------- */

  const world = document.createElement("div");
  world.id = worldId;
  world.setAttribute("role", "dialog");
  world.setAttribute("aria-label", "دنیای فانتزی اندیشا");
  world.setAttribute("aria-modal", "true");

  world.innerHTML = `
    <div class="fw-stars"></div>
    <div class="fw-orb"></div>

    <header class="fw-header">
      <div class="fw-logo">ANDISHA • FANTASY WORLD</div>
      <h1 class="fw-title">شهر افسانه‌ای اندیشا</h1>
      <p class="fw-subtitle">ماجراجویی بزرگ اعداد و قهرمانان ✨</p>
    </header>

    <section class="fw-hero">
      <div class="fw-avatar" id="fw-avatar">🧑‍🚀</div>
      <div class="fw-hero-info">
        <strong>قهرمان اندیشا</strong>
        <small>آماده‌ای رازهای شهر را کشف کنی؟</small>
      </div>
      <button class="fw-avatar-change" type="button" id="fw-avatar-change">
        تغییر قهرمان
      </button>
    </section>

    <section class="fw-stats">
      <div class="fw-stat">
        <b id="fw-score">۰</b>
        <small>امتیاز</small>
      </div>
      <div class="fw-stat">
        <b id="fw-completed">۰/۵</b>
        <small>مأموریت کامل</small>
      </div>
      <div class="fw-stat">
        <b id="fw-medals">۰</b>
        <small>نشان افتخار</small>
      </div>
    </section>

    <section class="fw-progress">
      <div class="fw-progress-head">
        <span>مسیر قهرمانی تو</span>
        <span id="fw-percent">۰٪</span>
      </div>
      <div class="fw-progress-track">
        <div class="fw-progress-fill" id="fw-progress-fill"></div>
      </div>
    </section>

    <h2 class="fw-section-title">🗺️ سرزمین مأموریت‌ها</h2>

    <section class="fw-island">
      <div class="fw-buildings" id="fw-buildings"></div>
    </section>

    <div class="fw-footer">
      ⭐ هر مأموریت، یک قدم تا قهرمانی!
      <br>
      طراحی و توسعه: اندیشا
    </div>

    <button class="fw-close" type="button" id="fw-close">
      بازگشت به بازی اصلی
    </button>
  `;

  const buildingContainer = world.querySelector("#fw-buildings");

  /* ---------- Building creation ---------- */

  zones.forEach(function (zone, index) {

    const button = document.createElement("button");
    button.type = "button";
    button.className = "fw-building";

    if (index === 4) {
      button.classList.add("final");
    }

    button.style.setProperty("--fw-color", zone.color);
    button.style.setProperty("--fw-light", zone.light);

    button.innerHTML =
      '<span class="fw-building-top"></span>' +
      '<span class="fw-building-icon">' + zone.icon + '</span>' +
      '<strong>' + zone.name + '</strong>' +
      '<small>' + zone.desc + '</small>' +
      '<span class="fw-status">در انتظار مأموریت</span>';

    button.addEventListener("click", function () {
      enterZone(index);
    });

    buildingContainer.appendChild(button);

  });

  /* ---------- Refresh visual progress ---------- */

  function refreshWorld() {

    const completed = getProgress();
    const score = getScore();
    const percent = Math.round(completed / zones.length * 100);

    world.querySelector("#fw-score").textContent =
      String(score);

    world.querySelector("#fw-completed").textContent =
      completed + "/5";

    world.querySelector("#fw-medals").textContent =
      completed;

    world.querySelector("#fw-percent").textContent =
      percent + "٪";

    world.querySelector("#fw-progress-fill").style.width =
      percent + "%";

    const buttons = buildingContainer.querySelectorAll(
      ".fw-building"
    );

    buttons.forEach(function (button, index) {

      const done = isCompleted(index);
      const status = button.querySelector(".fw-status");

      button.classList.toggle("done", done);

      if (done) {
        status.textContent = "🏅 مأموریت کامل شد";
      } else {
        status.textContent = "✨ آماده ماجراجویی";
      }

      if (index === 4) {

        button.classList.toggle(
          "ready",
          completed >= 4
        );

        button.classList.toggle(
          "locked",
          completed < 4
        );

        if (completed >= 4) {
          status.textContent = "🌟 دروازه قهرمانی آماده است";
        } else {
          status.textContent =
            "🔒 ابتدا چهار مأموریت دیگر را کامل کن";
        }

      }

    });

    world.querySelector("#fw-avatar").textContent =
      avatars[getAvatar()];

  }

  /* ---------- Avatar selection ---------- */

  function changeAvatar() {

    const next = (getAvatar() + 1) % avatars.length;

    saveAvatar(next);

    refreshWorld();

    showMessage("قهرمان جدیدت انتخاب شد! " + avatars[next]);

  }

  /* ---------- Toast ---------- */

  let toastTimer = null;

  function showMessage(message) {

    let toast = world.querySelector(".fw-toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.className = "fw-toast";
      toast.setAttribute("role", "status");
      world.appendChild(toast);
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

  /* ---------- Open and close ---------- */

  let previousOverflow = "";

  function openWorld() {

    previousOverflow = document.body.style.overflow;

    refreshWorld();

    world.classList.add("open");

    document.body.style.overflow = "hidden";

  }

  function closeWorld() {

    world.classList.remove("open");

    document.body.style.overflow = previousOverflow;

  }

  /* ---------- Find original game button ---------- */

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

  /* ---------- Enter a mission ---------- */

  function enterZone(index) {

    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= zones.length
    ) {
      showMessage("این مأموریت پیدا نشد.");
      return;
    }

    /*
      برج در بازی اصلی قفل آموزشی جداگانه ندارد.
      اینجا فقط راهنمایی تصویری ارائه می‌شود.
      منطق واقعی بازی تغییر نمی‌کند.
    */

    if (index === 4 && getProgress() < 4) {
      showMessage(
        "برای ورود به برج، ابتدا چهار مأموریت دیگر را کامل کن! 🏰"
      );
      return;
    }

    closeWorld();

    try {

      if (typeof window.andishaOpenZone === "function") {

        window.andishaOpenZone(index);

        if (
          typeof window.andishaPlayZoneVoice === "function"
        ) {
          window.andishaPlayZoneVoice(index);
        } else if (
          typeof window.andishaPlayVoice === "function"
        ) {
          window.andishaPlayVoice(zones[index].key);
        }

        return;
      }

      const originalButton = findMainZoneButton(index);

      if (originalButton) {
        originalButton.click();
        return;
      }

      showMessage(
        "اتصال مرحله اصلی پیدا نشد. بازی اصلی را بررسی کن."
      );

    } catch (error) {

      console.error("ANDISHA FANTASY CONNECTION ERROR:", error);

      showMessage("ورود به مأموریت با خطا روبه‌رو شد.");

    }

  }

  /* ---------- Events ---------- */

  launcher.addEventListener("click", openWorld);

  world.querySelector("#fw-close").addEventListener(
    "click",
    closeWorld
  );

  world.querySelector("#fw-avatar-change").addEventListener(
    "click",
    changeAvatar
  );

  document.addEventListener("keydown", function (event) {

    if (
      event.key === "Escape" &&
      world.classList.contains("open")
    ) {
      closeWorld();
    }

  });

  /*
    When the main game changes a completion flag,
    refresh the world the next time it opens.
  */

  window.addEventListener("storage", function () {
    if (world.classList.contains("open")) {
      refreshWorld();
    }
  });

  /* ---------- Install ---------- */

  document.body.appendChild(launcher);
  document.body.appendChild(world);

  /* ---------- Public API ---------- */

  window.andishaOpenCityWorld = openWorld;
  window.andishaCloseCityWorld = closeWorld;
  window.andishaEnterCityZone = enterZone;
  window.andishaRefreshFantasyWorld = refreshWorld;

  console.log("ANDISHA FANTASY WORLD V3.0 READY");

})();
