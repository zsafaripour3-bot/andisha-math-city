
"use strict";

/* =========================================================
   ANDISHA SMART CITY
   FANTASY WORLD V4.0
   Magical 3D Island Edition
   Independent visual expansion
   Preserves main game, scores, missions and audio
   ========================================================= */

(function () {

  if (window.__ANDISHA_FANTASY_WORLD_V40__) return;
  window.__ANDISHA_FANTASY_WORLD_V40__ = true;

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

  const worldId = "andisha-fantasy-world";
  const launcherId = "andisha-fantasy-launcher";
  const styleId = "andisha-fantasy-v40-style";

  /* ---------- Remove previous visual layers ---------- */

  [
    "andisha-city-launcher",
    "andisha-city-world",
    "andisha-city-world-style",
    "andisha-fantasy-launcher",
    "andisha-fantasy-world",
    "andisha-fantasy-v30-style",
    "andisha-fantasy-v31-style",
    "andisha-fantasy-v40-style"
  ].forEach(function (id) {
    const element = document.getElementById(id);
    if (element) element.remove();
  });

  /* ---------- Storage ---------- */

  function readStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function isCompleted(index) {
    const value = readStorage(storageKeys[index]);

    return (
      value === "true" ||
      value === "1" ||
      value === "completed"
    );
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
    const index = Number(readStorage("andishaFantasyAvatar"));

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
      console.warn("ANDISHA: Avatar could not be saved.");
    }
  }

  /* ---------- Styles ---------- */

  const style = document.createElement("style");
  style.id = styleId;

  style.textContent = `

  #${launcherId},
  #${worldId},
  #${worldId} * {
    box-sizing: border-box;
    font-family: inherit;
  }

  /* MAIN LAUNCHER */

  #${launcherId} {
    position: fixed;
    right: 15px;
    bottom: 85px;
    z-index: 9998;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 13px 18px;
    border: 2px solid #fff;
    border-radius: 20px;
    color: #fff;
    background: linear-gradient(135deg,#9b65ff,#3544a7);
    box-shadow:
      0 6px 0 #30215f,
      0 12px 28px #17255466;
    font-size: 14px;
    font-weight: 1000;
    cursor: pointer;
    animation: fw40Launcher 3s ease-in-out infinite;
    -webkit-tap-highlight-color: transparent;
  }

  @keyframes fw40Launcher {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  /* WORLD BACKGROUND */

  #${worldId} {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: none;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 15px 12px 38px;
    color: #fff;
    background:
      radial-gradient(ellipse at 50% 12%,#8ca5ff 0%,transparent 35%),
      radial-gradient(ellipse at 10% 70%,#6e54bd 0%,transparent 35%),
      linear-gradient(180deg,#17275f 0%,#314b91 48%,#152554 100%);
    isolation: isolate;
    overscroll-behavior: contain;
  }

  #${worldId}.open {
    display: block;
    animation: fw40Appear .45s ease;
  }

  @keyframes fw40Appear {
    from {
      opacity: 0;
      transform: scale(.97);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* SKY DECORATIONS */

  #${worldId} .fw40-sky {
    position: fixed;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;
  }

  #${worldId} .fw40-stars {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(2px 2px at 10% 15%,#fff 50%,transparent 100%),
      radial-gradient(3px 3px at 80% 18%,#fff 50%,transparent 100%),
      radial-gradient(2px 2px at 65% 42%,#fff 50%,transparent 100%),
      radial-gradient(3px 3px at 25% 52%,#fff 50%,transparent 100%),
      radial-gradient(2px 2px at 92% 70%,#fff 50%,transparent 100%),
      radial-gradient(2px 2px at 43% 85%,#fff 50%,transparent 100%);
    animation: fw40Twinkle 4s ease-in-out infinite alternate;
  }

  @keyframes fw40Twinkle {
    from { opacity: .35; }
    to { opacity: 1; }
  }

  #${worldId} .fw40-moon {
    position: absolute;
    top: 85px;
    left: 7%;
    width: 65px;
    height: 65px;
    border-radius: 50%;
    background: #fff3bb;
    box-shadow:
      0 0 20px #fff3bb88,
      0 0 55px #fff3bb55;
  }

  #${worldId} .fw40-cloud {
    position: absolute;
    width: 105px;
    height: 27px;
    border-radius: 30px;
    background: #ffffff25;
    filter: blur(1px);
    animation: fw40Cloud 18s linear infinite;
  }

  #${worldId} .fw40-cloud:before,
  #${worldId} .fw40-cloud:after {
    content: "";
    position: absolute;
    bottom: 8px;
    border-radius: 50%;
    background: #ffffff25;
  }

  #${worldId} .fw40-cloud:before {
    left: 17px;
    width: 38px;
    height: 38px;
  }

  #${worldId} .fw40-cloud:after {
    left: 48px;
    width: 48px;
    height: 48px;
  }

  #${worldId} .fw40-cloud.one {
    top: 155px;
    left: -120px;
  }

  #${worldId} .fw40-cloud.two {
    top: 290px;
    right: -130px;
    animation-delay: -9s;
    animation-duration: 23s;
  }

  @keyframes fw40Cloud {
    from { transform: translateX(0); }
    to { transform: translateX(125vw); }
  }

  /* HEADER */

  #${worldId} .fw40-header {
    position: relative;
    max-width: 760px;
    margin: 8px auto 16px;
    text-align: center;
  }

  #${worldId} .fw40-logo {
    display: inline-block;
    padding: 8px 17px;
    border: 1px solid #ffffff55;
    border-radius: 30px;
    color: #ffe79d;
    background: #ffffff17;
    font-size: 12px;
    font-weight: 1000;
    letter-spacing: 2px;
    box-shadow: 0 4px 15px #101b4d44;
  }

  #${worldId} .fw40-title {
    margin: 14px 0 5px;
    color: #fff0b0;
    font-size: clamp(25px,6vw,38px);
    font-weight: 1000;
    text-shadow:
      0 3px 0 #a46a42,
      0 7px 18px #ffcf6d66;
  }

  #${worldId} .fw40-subtitle {
    margin: 0;
    color: #e3eaff;
    font-size: 13px;
  }

  /* HERO */

  #${worldId} .fw40-hero {
    position: relative;
    max-width: 670px;
    margin: 18px auto;
    padding: 13px;
    display: flex;
    align-items: center;
    gap: 12px;
    border: 1px solid #ffffff55;
    border-radius: 24px;
    background: linear-gradient(135deg,#ffffff30,#ffffff0b);
    box-shadow:
      inset 0 1px 0 #ffffff55,
      0 12px 30px #07133e55;
    backdrop-filter: blur(9px);
  }

  #${worldId} .fw40-avatar {
    flex: 0 0 68px;
    width: 68px;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #fff;
    border-radius: 23px;
    color: #453274;
    background: linear-gradient(145deg,#fff1ad,#e7a5ff);
    box-shadow:
      0 6px 0 #8761c0,
      0 10px 18px #0003;
    font-size: 42px;
  }

  #${worldId} .fw40-hero-info {
    flex: 1;
    min-width: 0;
  }

  #${worldId} .fw40-hero-info strong {
    display: block;
    color: #fff4c4;
    font-size: 16px;
  }

  #${worldId} .fw40-hero-info small {
    display: block;
    margin-top: 5px;
    color: #dce8ff;
    font-size: 11px;
  }

  #${worldId} .fw40-avatar-change {
    padding: 9px 11px;
    border: 1px solid #ffffff66;
    border-radius: 13px;
    color: #fff;
    background: #ffffff1c;
    font-size: 11px;
    font-weight: 900;
    cursor: pointer;
  }

  /* STATS */

  #${worldId} .fw40-stats {
    max-width: 670px;
    margin: 0 auto 15px;
    display: grid;
    grid-template-columns: repeat(3,minmax(0,1fr));
    gap: 9px;
  }

  #${worldId} .fw40-stat {
    padding: 12px 5px;
    border: 1px solid #ffffff45;
    border-radius: 17px;
    text-align: center;
    background: linear-gradient(145deg,#ffffff25,#ffffff0b);
    box-shadow: 0 6px 15px #0a174544;
  }

  #${worldId} .fw40-stat b {
    display: block;
    color: #ffe69a;
    font-size: 21px;
  }

  #${worldId} .fw40-stat small {
    display: block;
    margin-top: 4px;
    color: #e0e9ff;
    font-size: 10px;
  }

  /* PROGRESS */

  #${worldId} .fw40-progress {
    max-width: 670px;
    margin: 0 auto 22px;
    padding: 13px;
    border: 1px solid #ffffff45;
    border-radius: 18px;
    background: #ffffff16;
  }

  #${worldId} .fw40-progress-head {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 9px;
    color: #fff1bd;
    font-size: 12px;
    font-weight: 900;
  }

  #${worldId} .fw40-track {
    height: 13px;
    overflow: hidden;
    border-radius: 20px;
    background: #101b4d;
    box-shadow: inset 0 2px 5px #0007;
  }

  #${worldId} .fw40-fill {
    width: 0;
    height: 100%;
    border-radius: 20px;
    background: linear-gradient(90deg,#49e4c2,#ffe36b,#ff9ec5);
    box-shadow: 0 0 13px #fff3a8;
    transition: width .6s ease;
  }

  /* ISLAND */

  #${worldId} .fw40-section-title {
    max-width: 700px;
    margin: 20px auto 14px;
    color: #fff1b7;
    font-size: 18px;
    font-weight: 1000;
    text-align: center;
    text-shadow: 0 3px 12px #0005;
  }

  #${worldId} .fw40-island-wrap {
    position: relative;
    max-width: 760px;
    margin: 0 auto;
    padding: 22px 10px 27px;
  }

  #${worldId} .fw40-island {
    position: relative;
    padding: 22px 13px 25px;
    border: 2px solid #b8e9ff;
    border-radius: 35px;
    background:
      radial-gradient(ellipse at 50% 0%,#c7ffe955,transparent 58%),
      linear-gradient(145deg,#72d5bd,#3d9d91 52%,#286b79);
    box-shadow:
      0 13px 0 #173f65,
      0 23px 35px #06133888,
      inset 0 3px 8px #ffffff77;
    transform: perspective(900px) rotateX(2deg);
  }

  #${worldId} .fw40-island:before {
    content: "";
    position: absolute;
    inset: 10px;
    border: 1px dashed #ffffff70;
    border-radius: 27px;
    pointer-events: none;
  }

  #${worldId} .fw40-island:after {
    content: "✦";
    position: absolute;
    top: -18px;
    right: 13%;
    color: #fff2a8;
    font-size: 29px;
    text-shadow: 0 0 15px #fff;
    animation: fw40Sparkle 2s ease-in-out infinite alternate;
  }

  @keyframes fw40Sparkle {
    from { transform: scale(.8) rotate(0); opacity: .55; }
    to { transform: scale(1.2) rotate(25deg); opacity: 1; }
  }

  /* BUILDINGS */

  #${worldId} .fw40-buildings {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: repeat(2,minmax(0,1fr));
    gap: 19px 13px;
  }

  #${worldId} .fw40-building {
    position: relative;
    min-width: 0;
    min-height: 184px;
    padding: 13px 7px 12px;
    overflow: hidden;
    border: 2px solid #ffffff;
    border-radius: 23px;
    color: #26345d;
    background: linear-gradient(150deg,#fff,#e9efff);
    box-shadow:
      0 8px 0 #233b65,
      0 13px 19px #07183e55;
    font-family: inherit;
    text-align: center;
    cursor: pointer;
    transition: transform .2s ease, box-shadow .2s ease;
    -webkit-tap-highlight-color: transparent;
  }

  #${worldId} .fw40-building:before {
    content: "";
    position: absolute;
    top: -37px;
    right: -23px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: var(--fw-light);
    opacity: .9;
  }

  #${worldId} .fw40-building:after {
    content: "";
    position: absolute;
    left: -25px;
    bottom: -34px;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: var(--fw-light);
    opacity: .65;
  }

  #${worldId} .fw40-building:active {
    transform: translateY(5px) scale(.98);
    box-shadow: 0 3px 0 #233b65,0 6px 12px #07183e55;
  }

  #${worldId} .fw40-building:focus-visible {
    outline: 3px solid #ffe58d;
    outline-offset: 4px;
  }

  #${worldId} .fw40-building-top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 9px;
    background: var(--fw-color);
  }

  #${worldId} .fw40-building-icon {
    position: relative;
    z-index: 1;
    display: flex;
    width: 79px;
    height: 79px;
    margin: 7px auto 10px;
    align-items: center;
    justify-content: center;
    border: 2px solid #ffffff;
    border-radius: 25px;
    background: linear-gradient(145deg,var(--fw-light),#ffffff);
    box-shadow:
      0 7px 0 #00000018,
      0 11px 16px #00000018,
      inset 0 2px 5px #ffffff;
    font-size: 44px;
    animation: fw40BuildingFloat 3s ease-in-out infinite;
  }

  #${worldId} .fw40-building:nth-child(even) .fw40-building-icon {
    animation-delay: .6s;
  }

  @keyframes fw40BuildingFloat {
    0%,100% { transform: translateY(0) rotate(-2deg); }
    50% { transform: translateY(-6px) rotate(2deg); }
  }

  #${worldId} .fw40-building strong {
    position: relative;
    z-index: 1;
    display: block;
    font-size: 13px;
    font-weight: 1000;
  }

  #${worldId} .fw40-building small {
    position: relative;
    z-index: 1;
    display: block;
    margin-top: 5px;
    color: #66718e;
    font-size: 10px;
  }

  #${worldId} .fw40-status {
    position: relative;
    z-index: 1;
    display: inline-block;
    margin-top: 9px;
    padding: 5px 10px;
    border-radius: 20px;
    color: #56617d;
    background: #e8edf8;
    font-size: 10px;
    font-weight: 1000;
  }

  #${worldId} .fw40-building.done {
    border-color: #ffe18a;
    background: linear-gradient(145deg,#fff8d8,#fff);
  }

  #${worldId} .fw40-building.done .fw40-status {
    color: #176f54;
    background: #c8f6df;
  }

  #${worldId} .fw40-building.final {
    grid-column: 1 / -1;
    min-height: 175px;
    background: linear-gradient(145deg,#fff0f6,#fff);
    border-color: #ffb9d4;
  }

  #${worldId} .fw40-building.final .fw40-building-icon {
    width: 76px;
    height: 76px;
  }

  #${worldId} .fw40-building.final.ready {
    border-color: #ffe17c;
    box-shadow:
      0 0 0 3px #ffd36d,
      0 8px 0 #9e4b7b,
      0 0 27px #ffcf6d99;
    animation: fw40FinalGlow 1.8s ease-in-out infinite alternate;
  }

  #${worldId} .fw40-building.final.locked {
    filter: saturate(.65);
  }

  @keyframes fw40FinalGlow {
    from {
      box-shadow: 0 0 0 2px #ffd36d,0 8px 0 #9e4b7b,0 0 12px #ffcf6d55;
    }
    to {
      box-shadow: 0 0 0 4px #fff0a8,0 8px 0 #9e4b7b,0 0 28px #ffcf6d;
    }
  }

  /* FOOTER */

  #${worldId} .fw40-footer {
    max-width: 650px;
    margin: 24px auto 0;
    color: #e0eaff;
    font-size: 12px;
    line-height: 2.2;
    text-align: center;
  }

  #${worldId} .fw40-footer strong {
    color: #ffe49a;
  }

  #${worldId} .fw40-close {
    display: block;
    margin: 18px auto 7px;
    padding: 13px 25px;
    border: 2px solid #fff;
    border-radius: 17px;
    color: #fff;
    background: linear-gradient(135deg,#9561f0,#30449b);
    box-shadow: 0 6px 0 #101a4d;
    font-family: inherit;
    font-size: 13px;
    font-weight: 1000;
    cursor: pointer;
  }

  /* MESSAGE */

  #${worldId} .fw40-toast {
    position: fixed;
    z-index: 10002;
    left: 50%;
    bottom: 24px;
    width: max-content;
    max-width: 88%;
    transform: translateX(-50%);
    padding: 13px 17px;
    border: 1px solid #ffffff66;
    border-radius: 16px;
    color: #fff;
    background: #182b68;
    box-shadow: 0 8px 24px #0006;
    text-align: center;
    font-size: 13px;
    font-weight: 900;
  }

  /* SMALL SCREENS */

  @media(max-width:370px) {
    #${worldId} {
      padding-left: 8px;
      padding-right: 8px;
    }

    #${worldId} .fw40-buildings {
      gap: 12px 8px;
    }

    #${worldId} .fw40-building {
      min-height: 165px;
      padding-left: 5px;
      padding-right: 5px;
    }

    #${worldId} .fw40-building-icon {
      width: 67px;
      height: 67px;
      font-size: 38px;
    }

    #${worldId} .fw40-hero {
      gap: 7px;
    }

    #${worldId} .fw40-avatar {
      flex-basis: 55px;
      width: 55px;
      height: 55px;
      font-size: 34px;
    }

    #${worldId} .fw40-avatar-change {
      padding: 8px 7px;
      font-size: 10px;
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
  launcher.setAttribute(
    "aria-label",
    "ورود به دنیای فانتزی اندیشا"
  );

  /* ---------- World ---------- */

  const world = document.createElement("div");
  world.id = worldId;
  world.setAttribute("role", "dialog");
  world.setAttribute("aria-label", "دنیای فانتزی اندیشا");
  world.setAttribute("aria-modal", "true");

  world.innerHTML = `
    <div class="fw40-sky" aria-hidden="true">
      <div class="fw40-stars"></div>
      <div class="fw40-moon"></div>
      <div class="fw40-cloud one"></div>
      <div class="fw40-cloud two"></div>
    </div>

    <header class="fw40-header">
      <div class="fw40-logo">ANDISHA • FANTASY WORLD</div>
      <h1 class="fw40-title">شهر افسانه‌ای اندیشا</h1>
      <p class="fw40-subtitle">
        سرزمین جادویی اعداد؛ ماجراجویی قهرمانان ✨
      </p>
    </header>

    <section class="fw40-hero">
      <div class="fw40-avatar" id="fw40-avatar">🧑‍🚀</div>

      <div class="fw40-hero-info">
        <strong>قهرمان اندیشا</strong>
        <small>آماده‌ای رازهای شهر را کشف کنی؟</small>
      </div>

      <button
        class="fw40-avatar-change"
        type="button"
        id="fw40-avatar-change"
      >
        تغییر قهرمان
      </button>
    </section>

    <section class="fw40-stats">
      <div class="fw40-stat">
        <b id="fw40-score">۰</b>
        <small>امتیاز</small>
      </div>

      <div class="fw40-stat">
        <b id="fw40-completed">۰/۵</b>
        <small>مأموریت کامل</small>
      </div>

      <div class="fw40-stat">
        <b id="fw40-medals">۰</b>
        <small>نشان افتخار</small>
      </div>
    </section>

    <section class="fw40-progress">
      <div class="fw40-progress-head">
        <span>⭐ مسیر قهرمانی تو</span>
        <span id="fw40-percent">۰٪</span>
      </div>

      <div class="fw40-track">
        <div class="fw40-fill" id="fw40-fill"></div>
      </div>
    </section>

    <h2 class="fw40-section-title">
      🗺️ جزیره مأموریت‌های اندیشا
    </h2>

    <section class="fw40-island-wrap">
      <div class="fw40-island">
        <div class="fw40-buildings" id="fw40-buildings"></div>
      </div>
    </section>

    <div class="fw40-footer">
      ✨ هر مأموریت، یک قدم تا قهرمانی!
      <br>
      <strong>طراحی و توسعه: اندیشا</strong>
    </div>

    <button class="fw40-close" type="button" id="fw40-close">
      ↩ بازگشت به بازی اصلی
    </button>
  `;

  const buildingContainer = world.querySelector("#fw40-buildings");

  /* ---------- Create buildings ---------- */

  zones.forEach(function (zone, index) {

    const button = document.createElement("button");

    button.type = "button";
    button.className = "fw40-building";
    button.dataset.zoneIndex = String(index);

    if (index === 4) {
      button.classList.add("final");
    }

    button.style.setProperty("--fw-color", zone.color);
    button.style.setProperty("--fw-light", zone.light);

    button.innerHTML =
      '<span class="fw40-building-top"></span>' +
      '<span class="fw40-building-icon">' + zone.icon + '</span>' +
      '<strong>' + zone.name + '</strong>' +
      '<small>' + zone.desc + '</small>' +
      '<span class="fw40-status">✨ آماده ماجراجویی</span>';

    button.addEventListener("click", function () {
      enterZone(index);
    });

    buildingContainer.appendChild(button);

  });

  /* ---------- Refresh ---------- */

  function refreshWorld() {

    const completed = getProgress();
    const score = getScore();
    const percent = Math.round(completed / zones.length * 100);

    world.querySelector("#fw40-score").textContent =
      String(score);

    world.querySelector("#fw40-completed").textContent =
      completed + "/5";

    world.querySelector("#fw40-medals").textContent =
      String(completed);

    world.querySelector("#fw40-percent").textContent =
      percent + "٪";

    world.querySelector("#fw40-fill").style.width =
      percent + "%";

    const buttons = buildingContainer.querySelectorAll(
      ".fw40-building"
    );

    buttons.forEach(function (button, index) {

      const done = isCompleted(index);
      const status = button.querySelector(".fw40-status");

      button.classList.toggle("done", done);

      if (done) {
        status.textContent = "🏅 مأموریت کامل شد";
      } else {
        status.textContent = "✨ آماده ماجراجویی";
      }

      if (index === 4) {

        button.classList.toggle("ready", completed >= 4);
        button.classList.toggle("locked", completed < 4);

        if (completed >= 4) {
          status.textContent = "🌟 دروازه قهرمانی آماده است";
        } else {
          status.textContent = "🔒 ابتدا چهار مأموریت دیگر را کامل کن";
        }

      }

    });

    world.querySelector("#fw40-avatar").textContent =
      avatars[getAvatar()];

  }

  /* ---------- Avatar ---------- */

  function changeAvatar() {

    const next = (getAvatar() + 1) % avatars.length;

    saveAvatar(next);
    refreshWorld();

    showMessage("قهرمان جدیدت انتخاب شد! " + avatars[next]);

  }

  /* ---------- Toast ---------- */

  let toastTimer = null;

  function showMessage(message) {

    let toast = world.querySelector(".fw40-toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.className = "fw40-toast";
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
    }, 2600);

  }

  /* ---------- Open / Close ---------- */

  let previousOverflow = "";
  let previousFocus = null;

  function openWorld() {

    previousFocus = document.activeElement;
    previousOverflow = document.body.style.overflow;

    refreshWorld();

    world.classList.add("open");
    document.body.style.overflow = "hidden";

    world.querySelector("#fw40-close").focus();

  }

  function closeWorld() {

    world.classList.remove("open");

    document.body.style.overflow = previousOverflow;

    if (
      previousFocus &&
      typeof previousFocus.focus === "function"
    ) {
      previousFocus.focus();
    }

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

  /* ---------- Enter mission ---------- */

  function enterZone(index) {

    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= zones.length
    ) {
      showMessage("این مأموریت پیدا نشد.");
      return;
    }

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

      openWorld();

      showMessage(
        "اتصال مرحله اصلی پیدا نشد. بازی اصلی را بررسی کن."
      );

    } catch (error) {

      console.error("ANDISHA FANTASY CONNECTION ERROR:", error);

      openWorld();
      showMessage("ورود به مأموریت با خطا روبه‌رو شد.");

    }

  }

  /* ---------- Events ---------- */

  launcher.addEventListener("click", openWorld);

  world.querySelector("#fw40-close").addEventListener(
    "click",
    closeWorld
  );

  world.querySelector("#fw40-avatar-change").addEventListener(
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

  /* ---------- Live progress refresh ---------- */

  window.addEventListener("storage", refreshWorld);
  window.addEventListener("focus", refreshWorld);
  window.addEventListener("pageshow", refreshWorld);

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
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

  console.log("ANDISHA FANTASY WORLD V4.0 READY");

})();
