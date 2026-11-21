
(function () {
  "use strict";

  if (window.__andishaMissionLogV7) return;
  window.__andishaMissionLogV7 = true;

  const missions = [
    { key: "andishaShopCompleted", name: "🛍️ مأموریت فروشگاه" },
    { key: "andishaKitchenCompleted", name: "🍰 مأموریت آشپزخانه" },
    { key: "andishaBankCompleted", name: "🏦 مأموریت بانک" },
    { key: "andishaMapCompleted", name: "📐 مأموریت نقشه" },
    { key: "andishaTowerCompleted", name: "🏰 مأموریت برج" }
  ];

  function isDone(key) {
    const value = localStorage.getItem(key);
    return value === "true" || value === "1";
  }

  function render() {
    const completed = missions.filter(function (mission) {
      return isDone(mission.key);
    }).length;

    const percent = Math.round((completed / missions.length) * 100);

    let html = `
      <section class="v7-mission-log">
        <h2>📜 دفترچه مأموریت قهرمان اندیشا</h2>
        <p>گزارش پیشرفت ماجراجویی تو</p>

        <div class="v7-progress">
          <div class="v7-progress-heading">
            <strong>${completed} از ۵ مأموریت انجام‌شده</strong>
            <strong>${percent}٪</strong>
          </div>

          <div class="v7-progress-track">
            <div class="v7-progress-fill"
              style="width:${percent}%"></div>
          </div>
        </div>

        <div class="v7-mission-list">
    `;

    missions.forEach(function (mission) {
      const done = isDone(mission.key);

      html += `
        <div class="v7-mission-item">
          <span>${mission.name}</span>
          <strong class="${done ? "v7-done" : "v7-pending"}">
            ${done ? "🏅 انجام شد" : "🔒 باقی‌مانده"}
          </strong>
        </div>
      `;
    });

    html += `
        </div>
        <p class="v7-message">
          ${completed === 5
            ? "🎉 آفرین! همهٔ مأموریت‌ها را با موفقیت انجام دادی."
            : "✨ برای تکمیل دفترچه، مأموریت‌های باقی‌مانده را انجام بده."}
        </p>
      </section>
    `;

    return html;
  }

  function addStyles() {
    if (document.getElementById("andisha-v7-style")) return;

    const style = document.createElement("style");
    style.id = "andisha-v7-style";

    style.textContent = `
      .v7-mission-log {
        direction: rtl;
        text-align: right;
        padding: 16px;
        color: inherit;
      }

      .v7-mission-log h2 {
        text-align: center;
        color: #e5b94f;
      }

      .v7-progress {
        margin: 20px 0;
        padding: 15px;
        border-radius: 14px;
        background: rgba(255,255,255,.08);
      }

      .v7-progress-heading {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
      }

      .v7-progress-track {
        display: block !important;
        width: 100% !important;
        height: 14px !important;
        margin-top: 12px;
        overflow: hidden;
        border-radius: 20px;
        background: rgba(255,255,255,.18) !important;
      }

      .v7-progress-fill {
        display: block !important;
        height: 100% !important;
        max-width: 100%;
        min-width: 0;
        border-radius: 20px;
        background: linear-gradient(90deg, #f4d477, #e5a928) !important;
        transition: width .7s ease;
      }

      .v7-mission-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        margin: 10px 0;
        padding: 13px;
        border-radius: 12px;
        background: rgba(255,255,255,.08);
      }

      .v7-done {
        color: #55d69e;
      }

      .v7-pending {
        color: #f0bd59;
      }

      .v7-message {
        text-align: center;
        margin-top: 20px;
        line-height: 2;
      }

      @media(max-width:380px) {
        .v7-mission-item {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function addTab() {
    const tabs = document.querySelector(".andisha-v3-tabs");

    if (!tabs) return;
    if (document.getElementById("andisha-v7-tab")) return;

    const tab = document.createElement("button");
    tab.id = "andisha-v7-tab";
    tab.type = "button";
    tab.textContent = "📜 دفترچه مأموریت";

    tab.addEventListener("click", function () {
      const content = document.getElementById("andisha-v3-content");
      if (!content) return;

      content.innerHTML = render();
    });

    tabs.appendChild(tab);
  }

  function init() {
    addStyles();
    addTab();

    const observer = new MutationObserver(function () {
      addTab();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
