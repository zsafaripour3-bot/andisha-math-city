
/* ANDISHA SMART HERO DASHBOARD V4 */
(function () {
  "use strict";

  if (window.__andishaDashboardV4) return;
  window.__andishaDashboardV4 = true;

  const EXPANSION_KEY = "andishaExpansionV3";

  const missionKeys = [
    "andishaShopCompleted",
    "andishaKitchenCompleted",
    "andishaBankCompleted",
    "andishaMapCompleted",
    "andishaTowerCompleted"
  ];

  function readData() {
    try {
      return JSON.parse(localStorage.getItem(EXPANSION_KEY)) || {};
    } catch (error) {
      return {};
    }
  }

  function isCompleted(key) {
    const value = localStorage.getItem(key);
    return value === "true" || value === "1";
  }

  function getStats() {
    const hero = readData();
    const completedMissions = missionKeys.filter(isCompleted).length;
    const exercises = Array.isArray(hero.completedExercises)
      ? hero.completedExercises.length : 0;
    const badges = Array.isArray(hero.badges)
      ? hero.badges.length : 0;
    const score = Number(localStorage.getItem("andishaScore")) || 0;

    return {
      name: hero.name || "قهرمان اندیشا",
      avatar: hero.avatar || "🧑‍🚀",
      missions: completedMissions,
      exercises: exercises,
      badges: badges,
      score: score,
      notes: Array.isArray(hero.notes) ? hero.notes.length : 0
    };
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  const style = document.createElement("style");
  style.id = "andisha-dashboard-v4-style";
  style.textContent = `
    #andisha-dashboard-v4 {
      direction:rtl;
      font-family:Tahoma,sans-serif;
      color:#142b52;
    }
    #andisha-dashboard-v4 .hero-head {
      text-align:center;
      padding:18px;
      background:linear-gradient(135deg,#142b52,#3266a0);
      color:white;
      border-radius:18px;
      margin-bottom:14px;
    }
    #andisha-dashboard-v4 .hero-avatar {
      font-size:48px;
      margin:5px;
    }
    #andisha-dashboard-v4 .hero-grid {
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:10px;
    }
    #andisha-dashboard-v4 .hero-stat {
      background:white;
      border:1px solid #dce5f2;
      border-radius:14px;
      padding:15px 8px;
      text-align:center;
    }
    #andisha-dashboard-v4 .hero-number {
      display:block;
      font-size:25px;
      font-weight:bold;
      color:#244d80;
      margin:8px;
    }
    #andisha-dashboard-v4 .hero-progress {
      height:13px;
      background:#e2e8f0;
      border-radius:20px;
      overflow:hidden;
      margin:12px 0;
    }
    #andisha-dashboard-v4 .hero-progress-fill {
      height:100%;
      background:linear-gradient(90deg,#e8b84d,#f5d77c);
      border-radius:20px;
      transition:width .3s;
    }
    #andisha-dashboard-v4 .hero-refresh {
      width:100%;
      margin-top:14px;
      padding:12px;
      border:0;
      border-radius:12px;
      background:#244d80;
      color:white;
      font:bold 14px Tahoma;
      cursor:pointer;
    }
    @media(max-width:380px) {
      #andisha-dashboard-v4 .hero-grid {
        grid-template-columns:1fr 1fr;
      }
    }
  `;
  document.head.appendChild(style);

  function renderDashboard() {
    const stats = getStats();
    const progress = Math.round(
      (stats.missions / missionKeys.length) * 100
    );

    const content = document.getElementById("andisha-v3-content");
    if (!content) return;

    content.innerHTML = `
      <div id="andisha-dashboard-v4">
        <div class="hero-head">
          <div class="hero-avatar">${escapeHTML(stats.avatar)}</div>
          <h2>${escapeHTML(stats.name)}</h2>
          <p>داشبورد هوشمند قهرمان اندیشا 🌟</p>
        </div>

        <div class="andisha-v3-card">
          <h3>🚀 پیشرفت مأموریت‌ها</h3>
          <strong>${stats.missions} از ۵ مأموریت تکمیل‌شده</strong>
          <div class="hero-progress">
            <div class="hero-progress-fill"
              style="width:${progress}%"></div>
          </div>
          <p>${progress}٪ پیشرفت مأموریت‌های شهرک</p>
        </div>

        <div class="hero-grid">
          <div class="hero-stat">
            🏆 امتیاز کل
            <span class="hero-number">${stats.score}</span>
          </div>
          <div class="hero-stat">
            🏅 نشان‌ها
            <span class="hero-number">${stats.badges}</span>
          </div>
          <div class="hero-stat">
            🧠 تمرین‌های حل‌شده
            <span class="hero-number">${stats.exercises}</span>
          </div>
          <div class="hero-stat">
            📒 یادداشت‌ها
            <span class="hero-number">${stats.notes}</span>
          </div>
        </div>

        <button class="hero-refresh" type="button"
          data-dashboard-refresh>
          🔄 به‌روزرسانی آمار
        </button>

        <p style="text-align:center;font-size:12px;color:#64748b">
          اندیشا | هر تلاش، یک قدم به سوی یادگیری 🌱
        </p>
      </div>
    `;
  }

  function addDashboardTab() {
    const tabs = document.querySelector(".andisha-v3-tabs");
    if (!tabs || document.getElementById("andisha-dashboard-tab")) {
      return;
    }

    const button = document.createElement("button");
    button.id = "andisha-dashboard-tab";
    button.type = "button";
    button.textContent = "📊 داشبورد";
    button.dataset.v3Dashboard = "true";
    tabs.appendChild(button);
  }

  document.addEventListener("click", function (event) {
    const button = event.target.closest("[data-v3-dashboard]");
    if (button) {
      renderDashboard();
      return;
    }

    const refresh = event.target.closest("[data-dashboard-refresh]");
    if (refresh) {
      renderDashboard();
    }
  });

  function initialize() {
    addDashboardTab();

    const observer = new MutationObserver(function () {
      addDashboardTab();
    });

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

  console.log("Andisha Dashboard V4 loaded.");
})();
