
(function () {
  "use strict";

  if (window.__andishaStartV8) return;
  window.__andishaStartV8 = true;

  const CHANNEL = "https://eitaa.com/Andeesha";
  const STYLE_ID = "andisha-start-v8-style";

  const progressKeys = [
    "andishaScore",
    "andishaShopCompleted",
    "andishaKitchenCompleted",
    "andishaBankCompleted",
    "andishaMapCompleted",
    "andishaTowerCompleted",
    "andishaExpansionV3"
  ];

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #andisha-v8-overlay {
        position: fixed;
        inset: 0;
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        background: linear-gradient(145deg,#101f42,#174b83,#493b83);
        font-family: Tahoma,sans-serif;
        direction: rtl;
        overflow-y: auto;
      }

      .andisha-v8-card {
        width: min(100%,480px);
        padding: 25px 20px;
        border: 1px solid rgba(255,255,255,.35);
        border-radius: 25px;
        background: rgba(255,255,255,.12);
        color: white;
        text-align: center;
        box-shadow: 0 15px 50px rgba(0,0,0,.25);
        backdrop-filter: blur(12px);
      }

      .andisha-v8-card h1 {
        font-size: clamp(24px,6vw,34px);
        margin: 5px 0 12px;
      }

      .andisha-v8-card p {
        line-height: 2;
        margin: 8px 0;
      }

      .andisha-v8-btn {
        display: block;
        width: 100%;
        padding: 14px 12px;
        margin-top: 12px;
        border: 0;
        border-radius: 14px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        font-family: inherit;
      }

      .andisha-v8-continue {
        color: #142b52;
        background: #fff;
      }

      .andisha-v8-new {
        color: #fff;
        background: #e49b32;
      }

      .andisha-v8-channel {
        display: block;
        margin-top: 18px;
        padding: 17px 12px;
        border-radius: 18px;
        color: #142b52;
        background: #fff;
        text-decoration: none;
        font-weight: bold;
        line-height: 1.9;
      }

      .andisha-v8-arrow {
        display: block;
        font-size: 35px;
        color: #ffdc73;
        animation: andishaV8Bounce 1s infinite;
      }

      @keyframes andishaV8Bounce {
        0%,100% { transform: translateY(0); }
        50% { transform: translateY(9px); }
      }

      .andisha-v8-credit {
        margin-top: 20px;
        padding-top: 14px;
        border-top: 1px solid rgba(255,255,255,.25);
        font-size: 13px;
        line-height: 2;
      }

      #andisha-v8-footer {
        direction: rtl;
        margin: 28px 12px 18px;
        padding: 22px 15px;
        border-radius: 20px;
        text-align: center;
        color: white;
        background: linear-gradient(135deg,#142b52,#315b91);
        font-family: Tahoma,sans-serif;
      }

      #andisha-v8-footer a {
        color: #ffdf83;
        font-weight: bold;
        text-decoration: none;
      }
    `;

    document.head.appendChild(style);
  }

  function makeChannelLink() {
    return `
      <a class="andisha-v8-channel"
         href="${CHANNEL}"
         target="_blank"
         rel="noopener noreferrer">
        <span class="andisha-v8-arrow">⬇️ 👇</span>
        📣 ورود به کانال آکادمی اندیشا
        <br>
        آموزش هوش مصنوعی و فناوری در خدمت آموزش
        <br>
        eitaa.com/Andeesha
      </a>
    `;
  }

  function showStartScreen() {
    if (document.getElementById("andisha-v8-overlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "andisha-v8-overlay";

    overlay.innerHTML = `
      <section class="andisha-v8-card">
        <div style="font-size:48px">🏙️✨</div>
        <h1>شهرک هوشمند اندیشا</h1>
        <p>به شهر یادگیری، بازی و خلاقیت خوش آمدی!</p>

        <button type="button"
          class="andisha-v8-btn andisha-v8-continue"
          id="andisha-v8-continue">
          ▶ ادامه بازی
        </button>

        <button type="button"
          class="andisha-v8-btn andisha-v8-new"
          id="andisha-v8-new">
          ↻ شروع بازی جدید
        </button>

        ${makeChannelLink()}

        <div class="andisha-v8-credit">
          طراحی و توسعه: <strong>زهرا صفری‌پور</strong>
          <br>
          اندیشا | فناوری در خدمت آموزش
        </div>
      </section>
    `;

    document.body.appendChild(overlay);

    document.getElementById("andisha-v8-continue")
      .addEventListener("click", function () {
        overlay.remove();
      });

    document.getElementById("andisha-v8-new")
      .addEventListener("click", function () {
        const confirmed = window.confirm(
          "آیا مطمئنی؟ پیشرفت و امتیازهای بازی قبلی پاک می‌شوند و بازی از ابتدا شروع خواهد شد."
        );

        if (!confirmed) return;

        progressKeys.forEach(function (key) {
          localStorage.removeItem(key);
        });

        window.location.reload();
      });
  }

  function addFooter() {
    if (document.getElementById("andisha-v8-footer")) return;

    const footer = document.createElement("footer");
    footer.id = "andisha-v8-footer";

    footer.innerHTML = `
      <div style="font-size:28px">💙 اندیشا</div>
      <p>فناوری در خدمت آموزش</p>
      <p>طراحی و توسعه: زهرا صفری‌پور</p>
      <span class="andisha-v8-arrow">⬇️ 👇</span>
      <a href="${CHANNEL}" target="_blank"
         rel="noopener noreferrer">
        عضویت در کانال آکادمی اندیشا
        <br>
        eitaa.com/Andeesha
      </a>
    `;

    document.body.appendChild(footer);
  }

  function initialize() {
    addStyles();
    showStartScreen();
    addFooter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
