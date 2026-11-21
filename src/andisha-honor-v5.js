
/* ANDISHA HONOR BADGE V5 */
(function () {
  "use strict";

  if (window.__andishaHonorV5) return;
  window.__andishaHonorV5 = true;

  const EXPANSION_KEY = "andishaExpansionV3";
  const MAIN_SCORE_KEY = "andishaScore";

  const missionKeys = [
    "andishaShopCompleted",
    "andishaKitchenCompleted",
    "andishaBankCompleted",
    "andishaMapCompleted",
    "andishaTowerCompleted"
  ];

  function readHero() {
    try {
      return JSON.parse(localStorage.getItem(EXPANSION_KEY)) || {};
    } catch (error) {
      return {};
    }
  }

  function completedMissions() {
    return missionKeys.filter(function (key) {
      const value = localStorage.getItem(key);
      return value === "true" || value === "1";
    }).length;
  }

  function getHonor() {
    const hero = readHero();
    const missions = completedMissions();
    const exercises = Array.isArray(hero.completedExercises)
      ? hero.completedExercises.length : 0;
    const score = Number(localStorage.getItem(MAIN_SCORE_KEY)) || 0;

    if (missions === 5 && exercises >= 4) {
      return {
        icon: "👑",
        title: "افسانهٔ شهرک",
        message: "همهٔ مأموریت‌ها و تمرین‌ها را به پایان رسانده‌ای!"
      };
    }

    if (missions === 5) {
      return {
        icon: "🏆",
        title: "قهرمان بزرگ اندیشا",
        message: "تمام مأموریت‌های شهرک را کامل کرده‌ای!"
      };
    }

    if (missions >= 3) {
      return {
        icon: "🥇",
        title: "قهرمان پرتلاش",
        message: "بیش از نیمی از مسیر را پیموده‌ای!"
      };
    }

    if (missions >= 1 || exercises >= 1 || score > 0) {
      return {
        icon: "🥈",
        title: "قهرمان جست‌وجوگر",
        message: "هر قدم تو را به موفقیت نزدیک‌تر می‌کند!"
      };
    }

    return {
      icon: "🌱",
      title: "قهرمان تازه‌نفس",
      message: "ماجراجویی یادگیری تو تازه شروع شده است!"
    };
  }

  const style = document.createElement("style");
  style.id = "andisha-honor-v5-style";
  style.textContent = `
    #andisha-honor-v5 {
      margin:14px 0;
      padding:18px 12px;
      text-align:center;
      direction:rtl;
      border:2px solid #e4bd58;
      border-radius:18px;
      background:linear-gradient(135deg,#fff8df,#fff);
      color:#142b52;
      font-family:Tahoma,sans-serif;
      box-shadow:0 5px 18px #142b5218;
    }
    #andisha-honor-v5 .honor-icon {
      font-size:48px;
      margin:5px;
    }
    #andisha-honor-v5 h3 {
      margin:8px 0;
      font-size:19px;
    }
    #andisha-honor-v5 p {
      margin:7px 0;
      font-size:13px;
      line-height:1.9;
    }
    #andisha-honor-v5 .honor-label {
      display:inline-block;
      padding:6px 12px;
      border-radius:20px;
      background:#f5e6b7;
      color:#73520b;
      font-size:12px;
      font-weight:bold;
    }
  `;
  document.head.appendChild(style);

  function renderHonor() {
    const honor = getHonor();
    const content = document.getElementById("andisha-v3-content");
    if (!content) return;

    let card = document.getElementById("andisha-honor-v5");
    if (!card) {
      card = document.createElement("div");
      card.id = "andisha-honor-v5";
      content.appendChild(card);
    }

    card.innerHTML = `
      <span class="honor-label">نشان افتخار قهرمان</span>
      <div class="honor-icon">${honor.icon}</div>
      <h3>${honor.title}</h3>
      <p>${honor.message}</p>
      <p>این نشان بر اساس پیشرفت ثبت‌شدهٔ تو انتخاب شده است.</p>
    `;
  }

  function addHonorTab() {
    const tabs = document.querySelector(".andisha-v3-tabs");
    if (!tabs || document.getElementById("andisha-honor-v5-tab")) {
      return;
    }

    const button = document.createElement("button");
    button.id = "andisha-honor-v5-tab";
    button.type = "button";
    button.textContent = "🏆 افتخار";
    button.dataset.v5Honor = "true";
    tabs.appendChild(button);
  }

  document.addEventListener("click", function (event) {
    const button = event.target.closest("[data-v5-honor]");
    if (button) {
      const content = document.getElementById("andisha-v3-content");
      if (content) content.innerHTML = "";
      renderHonor();
    }
  });

  function initialize() {
    addHonorTab();

    const observer = new MutationObserver(addHonorTab);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

  console.log("Andisha Honor V5 loaded.");
})();
