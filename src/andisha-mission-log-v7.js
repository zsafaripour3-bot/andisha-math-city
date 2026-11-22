
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
    try {
      const value = localStorage.getItem(key);
      return value === "true" || value === "1";
    } catch (error) {
      return false;
    }
  }

  function render() {
    const completed = missions.filter(function (mission) {
      return isDone(mission.key);
    }).length;

    const percent = Math.round(
      (completed / missions.length) * 100
    );

    let html = `
      <section class="v7-mission-log">
        <h2>📜 دفترچه مأموریت قهرمان اندیشا</h2>
        <p>گزارش پیشرفت ماجراجویی تو</p>

        <div class="v7-progress">
          <div class="v7-progress-heading">
            <strong>${completed} از ۵ مأموریت انجام‌شده</strong>
            <strong class="v7-percent">۰٪</strong>
          </div>

          <div class="v7-progress-track">
            <div class="v7-progress-fill"
                 data-target="${percent}"
                 style="width:0%">
            </div>
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

  function animateProgress(content) {
    const bar = content.querySelector(".v7-progress-fill");
    const counter = content.querySelector(".v7-percent");

    if (!bar || !counter) return;

    const target = Number(bar.dataset.target) || 0;

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        bar.style.width = target + "%";
        counter.textContent = target.toLocaleString("fa-IR") + "٪";
      });
    });
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
        padding: 16px;
        border-radius: 16px;
        background: rgba(255,255,255,.09);
        border: 1px solid rgba(255,215,120,.2);
      }

      .v7-progress-heading {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }

      .v7-percent {
        color: #ffdf82;
        font-size: 20px;
      }

      .v7-progress-track {
        display: block !important;
        width: 100% !important;
        height: 16px !important;
        margin-top: 14px;
        overflow: hidden;
        border-radius: 30px;
        background: rgba(255,255,255,.2) !important;
        direction: ltr;
      }

      .v7-progress-fill {
        display: block !important;
        width: 0%;
        height: 100% !important;
        border-radius: 30px;
        background: linear-gradient(
          90deg,
          #e5a928,
          #ffe99b,
          #e5a928
        ) !important;
        box-shadow: 0 0 12px rgba(255,215,90,.7);
        transition: width 1200ms cubic-bezier(.2,.8,.2,1);
        position: relative;
        overflow: hidden;
      }

      .v7-progress-fill::after {
        content: "";
        position: absolute;
        top: 0;
        left: -50%;
        width: 40%;
        height: 100%;
        background: rgba(255,255,255,.55);
        transform: skewX(-25deg);
        animation: v7-shine 1.8s ease-in-out infinite;
      }

      @keyframes v7-shine {
        0% { left: -50%; }
        100% { left: 130%; }
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

      @media(prefers-reduced-motion: reduce) {
        .v7-progress-fill {
          transition: none;
        }
        .v7-progress-fill::after {
          animation: none;
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
      animateProgress(content);
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
