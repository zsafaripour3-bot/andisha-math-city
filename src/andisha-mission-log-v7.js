(function () {
  "use strict";

  const DATA_KEY = "andishaExpansionV3";
  const MISSION_KEY = {
    shop: "andishaShopCompleted",
    kitchen: "andishaKitchenCompleted",
    bank: "andishaBankCompleted",
    map: "andishaMapCompleted",
    tower: "andishaTowerCompleted"
  };

  const missions = [
    { id: "shop", title: "فروشگاه", icon: "🛍️", key: MISSION_KEY.shop },
    { id: "kitchen", title: "آشپزخانه", icon: "🍰", key: MISSION_KEY.kitchen },
    { id: "bank", title: "بانک", icon: "🏦", key: MISSION_KEY.bank },
    { id: "map", title: "کارگاه نقشه", icon: "📐", key: MISSION_KEY.map },
    { id: "tower", title: "برج", icon: "🏰", key: MISSION_KEY.tower }
  ];

  function readData() {
    try {
      return JSON.parse(localStorage.getItem(DATA_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  function isDone(key) {
    return localStorage.getItem(key) === "true";
  }

  function getProgress() {
    return missions.filter(function (m) {
      return isDone(m.key);
    }).length;
  }

  function render() {
    const data = readData();
    const completed = getProgress();
    const percent = Math.round(completed / missions.length * 100);

    const html = `
      <div class="v7-mission-log">
        <div class="v7-header">
          <div class="v7-header-icon">📜</div>
          <h2>دفترچهٔ مأموریت‌های قهرمان</h2>
          <p>قدم‌به‌قدم تا افتخار بزرگ اندیشا</p>
        </div>

        <div class="v7-progress">
          <strong>پیشرفت مأموریت‌ها</strong>
          <div class="v7-progress-number">${completed} از ۵</div>
          <div class="v7-progress-track">
            <div class="v7-progress-fill" style="width:${percent}%"></div>
          </div>
          <p>${percent}٪ از مسیر قهرمانی طی شده است.</p>
        </div>

        <div class="v7-mission-list">
          ${missions.map(function (m, index) {
            const done = isDone(m.key);
            return `
              <div class="v7-mission ${done ? "completed" : "pending"}">
                <span class="v7-mission-icon">${m.icon}</span>
                <div class="v7-mission-info">
                  <strong>مأموریت ${index + 1}: ${m.title}</strong>
                  <small>${done ? "✅ انجام‌شده" : "🔒 در انتظار انجام"}</small>
                </div>
                <span>${done ? "🏅" : "⭐"}</span>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;

    return html;
  }
    const style = document.createElement("style");
  style.textContent = `
    .v7-mission-log {
      direction: rtl;
      padding: 18px;
      border-radius: 20px;
      background: linear-gradient(145deg, #142b52, #244b7d);
      color: #fff;
      font-family: inherit;
    }

    .v7-header {
      text-align: center;
      padding: 15px 5px;
    }

    .v7-header-icon {
      font-size: 42px;
    }

    .v7-header h2 {
      margin: 10px 0;
      font-size: 21px;
    }

    .v7-header p,
    .v7-progress p {
      color: #dce9ff;
      font-size: 13px;
    }

    .v7-progress {
      background: rgba(255,255,255,.12);
      padding: 16px;
      border-radius: 16px;
      margin-bottom: 18px;
    }

    .v7-progress-number {
      margin: 10px 0;
      color: #ffd76a;
      font-size: 22px;
      font-weight: bold;
    }

    .v7-progress-track {
      height: 12px;
      background: rgba(255,255,255,.2);
      border-radius: 20px;
      overflow: hidden;
    }

    .v7-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #ffd76a, #fff0a8);
      border-radius: 20px;
      transition: width .4s ease;
    }

    .v7-mission-list {
      display: grid;
      gap: 10px;
    }

    .v7-mission {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 13px;
      border-radius: 14px;
      background: rgba(255,255,255,.12);
      border: 1px solid rgba(255,255,255,.12);
    }

    .v7-mission.completed {
      border-color: #ffd76a;
    }

    .v7-mission-icon {
      font-size: 28px;
    }

    .v7-mission-info {
      display: grid;
      gap: 5px;
      flex: 1;
    }

    .v7-mission-info small {
      color: #dce9ff;
    }
  `;
  document.head.appendChild(style);
    function addTab() {
    const tabs = document.querySelector(".andisha-v3-tabs");
    if (!tabs || document.querySelector('[data-v7-tab]')) return;

    const tab = document.createElement("button");
    tab.type = "button";
    tab.textContent = "📜 دفترچه مأموریت";
    tab.setAttribute("data-v7-tab", "true");

    tab.addEventListener("click", function () {
      let panel = document.querySelector('[data-v7-panel]');

      if (!panel) {
        panel = document.createElement("div");
        panel.setAttribute("data-v7-panel", "true");
        tabs.parentNode.appendChild(panel);
      }

      panel.innerHTML = render();
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    tabs.appendChild(tab);
  }

  const observer = new MutationObserver(addTab);

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  addTab();

  window.addEventListener("storage", function () {
    const panel = document.querySelector('[data-v7-panel]');
    if (panel) panel.innerHTML = render();
  });
})();
