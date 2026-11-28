
"use strict";

/* ============================================
   ANDISHA START V9
   صفحه ورود دوحالته اندیشا
   ورود معمولی + ورود فانتزی
   افزونه مستقل
   ============================================ */

(function () {

  if (window.__ANDISHA_START_V9__) return;
  window.__ANDISHA_START_V9__ = true;

  const STYLE_ID = "andisha-start-v9-style";
  const SCREEN_ID = "andisha-start-v9-screen";

  function createStartScreen() {

    if (document.getElementById(SCREEN_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      #${SCREEN_ID} {
        position: fixed;
        inset: 0;
        z-index: 100000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 18px;
        overflow-y: auto;
        direction: rtl;
        font-family: Tahoma, sans-serif;
        background:
          radial-gradient(circle at 15% 15%, #3956a0 0, transparent 35%),
          radial-gradient(circle at 85% 85%, #693b9c 0, transparent 35%),
          linear-gradient(145deg, #101b3d, #172c59 55%, #241b4b);
        color: white;
        box-sizing: border-box;
      }

      #${SCREEN_ID} * {
        box-sizing: border-box;
      }

      #${SCREEN_ID} .start-container {
        width: 100%;
        max-width: 760px;
        text-align: center;
      }

      #${SCREEN_ID} .start-logo {
        font-size: clamp(48px, 12vw, 82px);
        margin-bottom: 8px;
        filter: drop-shadow(0 8px 18px #0008);
      }

      #${SCREEN_ID} .start-title {
        font-size: clamp(27px, 6vw, 42px);
        font-weight: 900;
        margin: 8px 0;
        color: #fff3bd;
        text-shadow: 0 3px 15px #f4b94266;
      }

      #${SCREEN_ID} .start-subtitle {
        font-size: 15px;
        line-height: 2;
        color: #dce7ff;
        margin: 8px auto 28px;
      }

      #${SCREEN_ID} .start-options {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }

      #${SCREEN_ID} .start-option {
        min-width: 0;
        border: 1px solid #ffffff44;
        border-radius: 24px;
        padding: 22px 14px;
        color: white;
        cursor: pointer;
        font-family: inherit;
        transition: transform .2s, box-shadow .2s;
        box-shadow: 0 12px 30px #0005;
      }

      #${SCREEN_ID} .start-option:active {
        transform: scale(.97);
      }

      #${SCREEN_ID} .start-normal {
        background: linear-gradient(145deg, #167fc0, #174b91);
      }

      #${SCREEN_ID} .start-fantasy {
        background: linear-gradient(145deg, #8b48c7, #472c91);
      }

      #${SCREEN_ID} .start-option .option-icon {
        display: block;
        font-size: 55px;
        margin-bottom: 12px;
      }

      #${SCREEN_ID} .start-option strong {
        display: block;
        font-size: 19px;
        margin-bottom: 10px;
      }

      #${SCREEN_ID} .start-option small {
        display: block;
        font-size: 12px;
        line-height: 2;
        color: #f0edff;
      }

      #${SCREEN_ID} .start-option:hover {
        transform: translateY(-5px);
        box-shadow: 0 18px 35px #0007;
      }

      #${SCREEN_ID} .start-footer {
        margin-top: 25px;
        font-size: 12px;
        color: #cbd6f3;
      }

      #${SCREEN_ID} .start-error {
        display: none;
        margin-top: 18px;
        padding: 12px;
        border-radius: 12px;
        background: #8d293d;
        color: white;
        font-size: 13px;
        line-height: 1.8;
      }

      @media (max-width: 480px) {
        #${SCREEN_ID} .start-options {
          grid-template-columns: 1fr;
          gap: 12px;
        }

        #${SCREEN_ID} .start-option {
          padding: 16px 12px;
        }

        #${SCREEN_ID} .start-option .option-icon {
          font-size: 43px;
          margin-bottom: 5px;
        }

        #${SCREEN_ID} .start-option strong {
          font-size: 17px;
        }

        #${SCREEN_ID} .start-subtitle {
          margin-bottom: 18px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        #${SCREEN_ID} *,
        #${SCREEN_ID} *::before,
        #${SCREEN_ID} *::after {
          transition: none !important;
          animation: none !important;
        }
      }
    `;

    document.head.appendChild(style);

    const screen = document.createElement("div");
    screen.id = SCREEN_ID;

    screen.innerHTML = `
      <div class="start-container">

        <div class="start-logo">🏙️✨</div>

        <div class="start-title">
          شهرک هوشمند اندیشا
        </div>

        <div class="start-subtitle">
          به دنیای یادگیری، کشف و ماجراجویی خوش آمدی!
          <br>
          شیوه ورود خودت را انتخاب کن.
        </div>

        <div class="start-options">

          <button
            type="button"
            class="start-option start-normal"
            id="andishaNormalEntry">

            <span class="option-icon">🏡</span>

            <strong>ورود معمولی</strong>

            <small>
              ورود به بازی اصلی اندیشا
              <br>
              با محیط آموزشی کلاسیک
            </small>

          </button>

          <button
            type="button"
            class="start-option start-fantasy"
            id="andishaFantasyEntry">

            <span class="option-icon">🪄</span>

            <strong>ورود فانتزی</strong>

            <small>
              ورود به شهر جادویی اندیشا
              <br>
              با ساختمان‌های شگفت‌انگیز
            </small>

          </button>

        </div>

        <div
          class="start-error"
          id="andishaStartError">
        </div>

        <div class="start-footer">
          اندیشا | فناوری در خدمت آموزش
          <br>
          طراحی و توسعه: زهرا صفری‌پور
        </div>

      </div>
    `;

    document.body.appendChild(screen);

    const normalButton = document.getElementById(
      "andishaNormalEntry"
    );

    const fantasyButton = document.getElementById(
      "andishaFantasyEntry"
    );

    const errorBox = document.getElementById(
      "andishaStartError"
    );

    // ورود معمولی
    normalButton.addEventListener("click", function () {

      try {
        localStorage.setItem("andishaEntryMode", "normal");
      } catch (error) {}

      closeStartScreen();

    });

    // ورود فانتزی
    fantasyButton.addEventListener("click", function () {

      if (
        typeof window.andishaOpenCityWorld !== "function"
      ) {

        errorBox.style.display = "block";

        errorBox.textContent =
          "شهر فانتزی هنوز بارگذاری نشده است. " +
          "ترتیب فایل‌های index.html را بررسی کن.";

        return;
      }

      try {
        localStorage.setItem("andishaEntryMode", "fantasy");
      } catch (error) {}

      closeStartScreen();

      window.andishaOpenCityWorld();

    });

  }

  function closeStartScreen() {

    const screen = document.getElementById(SCREEN_ID);

    if (screen) {
      screen.remove();
    }

  }

  function start() {

    if (!document.getElementById("app")) {
      console.error("ANDISHA START V9: app not found");
      return;
    }

    createStartScreen();

  }

  if (document.readyState === "loading") {

    document.addEventListener("DOMContentLoaded", start);

  } else {

    start();

  }

  window.andishaOpenStartScreen = start;

  console.log("ANDISHA START V9 READY");

})();
