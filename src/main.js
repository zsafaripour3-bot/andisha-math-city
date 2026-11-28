
"use strict";

// ============================================
// 🏙️ ANDISHA SMART CITY
// MAIN.JS - STABLE UNIFIED VERSION
// ============================================

const app = document.getElementById("app");

if (!app) {
  document.body.innerHTML =
    "<h2>خطا: بخش اصلی بازی پیدا نشد.</h2>";
  throw new Error("Andisha app not found");
}

// ============================================
// ذخیره‌سازی امن
// ============================================

function storageGet(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch (error) {
    console.warn("Storage read error:", error);
    return fallback;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, String(value));
    return true;
  } catch (error) {
    console.warn("Storage write error:", error);
    return false;
  }
}

function storageRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn("Storage remove error:", error);
  }
}

// ============================================
// اطلاعات بازی
// ============================================

let score = 0;

let shopCompleted = false;
let kitchenCompleted = false;
let bankCompleted = false;
let mapCompleted = false;
let towerCompleted = false;

let shopAttempts = 0;
let kitchenAttempts = 0;
let bankAttempts = 0;
let mapAttempts = 0;
let towerStep = 0;

// حالت تمرین مأموریت‌های تکمیل‌شده
let shopPracticeMode = false;
let kitchenPracticeMode = false;
let bankPracticeMode = false;
let mapPracticeMode = false;
let towerPracticeMode = false;

const STORAGE = {
  score: "andishaScore",
  shop: "andishaShopCompleted",
  kitchen: "andishaKitchenCompleted",
  bank: "andishaBankCompleted",
  map: "andishaMapCompleted",
  tower: "andishaTowerCompleted"
};

const zones = [
  {
    icon: "🛍️",
    name: "فروشگاه هوشمند",
    mission: "تخفیف و قیمت نهایی",
    color: "#e7a23b"
  },
  {
    icon: "🍰",
    name: "آشپزخانه مرکزی",
    mission: "تناسب در دستور غذا",
    color: "#e77b9c"
  },
  {
    icon: "🏦",
    name: "بانک اندیشا",
    mission: "درصد و سود ساده",
    color: "#43b9a0"
  },
  {
    icon: "📐",
    name: "کارگاه نقشه‌سازی",
    mission: "مقیاس و تناسب",
    color: "#6499e8"
  },
  {
    icon: "🏆",
    name: "برج هوشمند",
    mission: "چالش نهایی ریاضی",
    color: "#a78ae8"
  }
];

// ============================================
// ذخیره و بازیابی پیشرفت
// ============================================

function saveProgress() {
  storageSet(STORAGE.score, score);
  storageSet(STORAGE.shop, shopCompleted);
  storageSet(STORAGE.kitchen, kitchenCompleted);
  storageSet(STORAGE.bank, bankCompleted);
  storageSet(STORAGE.map, mapCompleted);
  storageSet(STORAGE.tower, towerCompleted);
}

function loadProgress() {
  score = Math.max(
    0,
    Number(storageGet(STORAGE.score, "0")) || 0
  );

  shopCompleted =
    storageGet(STORAGE.shop, "false") === "true";

  kitchenCompleted =
    storageGet(STORAGE.kitchen, "false") === "true";

  bankCompleted =
    storageGet(STORAGE.bank, "false") === "true";

  mapCompleted =
    storageGet(STORAGE.map, "false") === "true";

  towerCompleted =
    storageGet(STORAGE.tower, "false") === "true";
}

function resetProgress() {
  Object.keys(STORAGE).forEach(function(key) {
    storageRemove(STORAGE[key]);
  });

  score = 0;

  shopCompleted = false;
  kitchenCompleted = false;
  bankCompleted = false;
  mapCompleted = false;
  towerCompleted = false;

  shopAttempts = 0;
  kitchenAttempts = 0;
  bankAttempts = 0;
  mapAttempts = 0;
  towerStep = 0;

  shopPracticeMode = false;
  kitchenPracticeMode = false;
  bankPracticeMode = false;
  mapPracticeMode = false;
  towerPracticeMode = false;
}

function completedCount() {
  return [
    shopCompleted,
    kitchenCompleted,
    bankCompleted,
    mapCompleted,
    towerCompleted
  ].filter(Boolean).length;
}

// ============================================
// صفحه پایان عمومی
// ============================================

function showCompletedPage(title, message) {
  loadProgress();

  app.innerHTML = `
    <main dir="rtl">
      <h1>${title}</h1>
      <h2>🎉 ${message}</h2>
      <h3>⭐ مجموع امتیاز: ${score}</h3>
      <p>تعداد مناطق تکمیل‌شده: ${completedCount()} از ۵</p>
      <button data-action="city">
        بازگشت به شهرک 🏙️
      </button>
    </main>
  `;
}

// ============================================
// صفحه شروع و داستان
// ============================================

function showWelcome() {
  app.innerHTML = `
    <main dir="rtl">
      <h1>🏙️ شهرک هوشمند اندیشا</h1>
      <h2>مأموریت بزرگ تناسب و درصد</h2>
      <p>سلام قهرمان! آماده‌ای شهرک را بسازی؟</p>
      <button data-action="story">
        شروع ماجراجویی 🚀
      </button>
    </main>
  `;
}

function showStory() {
  app.innerHTML = `
    <main dir="rtl">
      <h1>🌟 آغاز یک مأموریت بزرگ</h1>
      <h2>👧 آوا و 🤖 اندی</h2>
      <p>آوا: سلام قهرمان! من مهندس کوچک شهرک هستم.</p>
      <p>اندی: شهرک به کمک ریاضی تو نیاز دارد!</p>
      <p>با حل معماها، پنج منطقه را آباد می‌کنیم.</p>
      <button data-action="city">
        ورود به شهرک 🏙️
      </button>
    </main>
  `;
}

// ============================================
// نقشه شهرک
// ============================================

function showCity() {
  loadProgress();

  const completedList = [
    shopCompleted,
    kitchenCompleted,
    bankCompleted,
    mapCompleted,
    towerCompleted
  ];

  app.innerHTML = `
    <main dir="rtl">

      <h1>🏙️ شهرک هوشمند اندیشا</h1>
      <h2>نقشه مأموریت قهرمان</h2>

      <h3>⭐ امتیاز تو: ${score}</h3>
      <p>🏅 مناطق تکمیل‌شده: ${completedCount()} از ۵</p>

      <section class="city-map">

        ${zones.map(function(zone, i) {
          const completed = completedList[i];

          return `
            <article class="building"
              style="border-top:7px solid ${zone.color}">

              <div class="building-icon">${zone.icon}</div>

              <h2>${zone.name}</h2>
              <p>${zone.mission}</p>

              <p>
                ${completed
                  ? "🏅 تکمیل شده"
                  : "🔐 مأموریت باز است"}
              </p>

              <button
                data-action="zone"
                data-zone="${i}">
                ${completed
                  ? "مشاهده منطقه"
                  : "ورود به منطقه 🚀"}
              </button>

            </article>
          `;
        }).join("")}

      </section>

      <button data-action="story">
        مشاهده داستان ماجراجویی
      </button>

      <button
        data-action="reset-progress"
        style="
          background:linear-gradient(135deg,#ffb3b3,#e8615e);
          color:#fff;
          margin-top:12px;
          font-size:14px;
          padding:10px 18px;
        ">
        🔄 شروع دوباره (پاک‌کردن پیشرفت)
      </button>

    </main>
  `;
}

// ============================================
// مأموریت اول: فروشگاه
// ============================================

function showShop(practice) {
  loadProgress();

  shopPracticeMode = practice === true;
  shopAttempts = 0;

  const isCompleted = shopCompleted;
  const locked = isCompleted && !shopPracticeMode;

  app.innerHTML = `
    <main dir="rtl">

      <h1>🛍️ فروشگاه هوشمند اندیشا</h1>
      <h2>مأموریت اول: شکار تخفیف!</h2>

      <p>قیمت اولیه کیف:
        <strong>۲۰۰٬۰۰۰ تومان</strong>
      </p>

      <p>تخفیف فروشگاه:
        <strong>۲۵ درصد</strong>
      </p>

      <h3>قیمت نهایی کیف چقدر است؟</h3>

      <div class="shop-options">

        <button data-action="shop-answer"
          data-answer="150000"
          ${locked ? "disabled" : ""}>
          ۱۵۰٬۰۰۰ تومان ${isCompleted ? "✅" : ""}
        </button>

        <button data-action="shop-answer"
          data-answer="175000"
          ${locked ? "disabled" : ""}>
          ۱۷۵٬۰۰۰ تومان
        </button>

        <button data-action="shop-answer"
          data-answer="125000"
          ${locked ? "disabled" : ""}>
          ۱۲۵٬۰۰۰ تومان
        </button>

      </div>

      <p id="feedback">
        ${locked
          ? "🏅 این مأموریت قبلاً تکمیل شده است."
          : shopPracticeMode
            ? "🔄 حالت تمرین؛ امتیاز جدید دریافت نمی‌کنی."
            : "یکی از پاسخ‌ها را انتخاب کن."}
      </p>

      <p id="score">⭐ امتیاز: ${score}</p>

      ${isCompleted && !shopPracticeMode ? `
        <button data-action="replay"
          data-zone-name="shop"
          style="
            background:linear-gradient(135deg,#a1c4fd,#c2e9fb);
            color:#142b52;
            margin-top:10px">
          🔄 تکرار مأموریت
        </button>
      ` : ""}

      <button data-action="city">
        بازگشت به شهرک 🏙️
      </button>

    </main>
  `;
}

function checkShopAnswer(answer) {
  loadProgress();

  if (shopCompleted && !shopPracticeMode) {
    return showShop(false);
  }

  const feedback = document.getElementById("feedback");
  const scoreElement = document.getElementById("score");

  if (!feedback || !scoreElement) return;

  if (answer === 150000) {

    if (!shopCompleted) {
      shopCompleted = true;
      score += 10;
      saveProgress();
    }

    scoreElement.textContent = `⭐ امتیاز: ${score}`;

    feedback.innerHTML = `
      🎉 آفرین قهرمان!

      <p>۲۵ درصدِ ۲۰۰٬۰۰۰ می‌شود ۵۰٬۰۰۰ تومان.</p>
      <p>۲۰۰٬۰۰۰ − ۵۰٬۰۰۰ = ۱۵۰٬۰۰۰ تومان</p>

      <h3>
        ${shopPracticeMode
          ? "🌱 تمرین با موفقیت انجام شد؛ امتیاز جدید ندارد."
          : "🏅 ۱۰ امتیاز گرفتی!"}
      </h3>
    `;

    app.querySelectorAll('[data-action="shop-answer"]')
      .forEach(function(button) {
        button.disabled = true;
      });

  } else {

    shopAttempts++;

    feedback.innerHTML = shopAttempts === 1
      ? "🌱 یک بار دیگر فکر کن!<p>۲۵ درصد یعنی یک‌چهارم قیمت کالا.</p>"
      : "🤖 اندی: ۲۰۰٬۰۰۰ ÷ ۴ = ۵۰٬۰۰۰ تومان تخفیف؛ آن را از قیمت کم کن.";

  }
}

// ============================================
// مأموریت دوم: آشپزخانه
// ============================================

function showKitchen(practice) {
  loadProgress();

  kitchenPracticeMode = practice === true;
  kitchenAttempts = 0;

  const isCompleted = kitchenCompleted;
  const locked = isCompleted && !kitchenPracticeMode;

  app.innerHTML = `
    <main dir="rtl">

      <h1>🍰 آشپزخانه مرکزی اندیشا</h1>
      <h2>مأموریت دوم: دستور پخت قهرمانانه!</h2>

      <p>برای ۴ نفر به ۲ پیمانه آرد نیاز داریم.</p>

      <h3>برای ۸ نفر چند پیمانه آرد لازم داریم؟</h3>

      <div class="shop-options">

        <button data-action="kitchen-answer"
          data-answer="3"
          ${locked ? "disabled" : ""}>
          ۳ پیمانه
        </button>

        <button data-action="kitchen-answer"
          data-answer="4"
          ${locked ? "disabled" : ""}>
          ۴ پیمانه ${isCompleted ? "✅" : ""}
        </button>

        <button data-action="kitchen-answer"
          data-answer="6"
          ${locked ? "disabled" : ""}>
          ۶ پیمانه
        </button>

      </div>

      <p id="kitchen-feedback">
        ${locked
          ? "🏅 این مأموریت قبلاً تکمیل شده است."
          : kitchenPracticeMode
            ? "🔄 حالت تمرین؛ امتیاز جدید دریافت نمی‌کنی."
            : "پاسخ درست را انتخاب کن قهرمان!"}
      </p>

      <p id="kitchen-score">⭐ امتیاز: ${score}</p>

      ${isCompleted && !kitchenPracticeMode ? `
        <button data-action="replay"
          data-zone-name="kitchen"
          style="
            background:linear-gradient(135deg,#a1c4fd,#c2e9fb);
            color:#142b52;
            margin-top:10px">
          🔄 تکرار مأموریت
        </button>
      ` : ""}

      <button data-action="city">
        بازگشت به شهرک 🏙️
      </button>

    </main>
  `;
}

function checkKitchenAnswer(answer) {
  loadProgress();

  if (kitchenCompleted && !kitchenPracticeMode) {
    return showKitchen(false);
  }

  const feedback = document.getElementById("kitchen-feedback");
  const scoreElement = document.getElementById("kitchen-score");

  if (!feedback || !scoreElement) return;

  if (answer === 4) {

    if (!kitchenCompleted) {
      kitchenCompleted = true;
      score += 10;
      saveProgress();
    }

    scoreElement.textContent = `⭐ امتیاز: ${score}`;

    feedback.innerHTML = `
      🎉 آفرین قهرمان!

      <p>تعداد مهمان‌ها دو برابر شده است.</p>
      <p>۲ × ۲ = ۴ پیمانه آرد</p>

      <h3>
        ${kitchenPracticeMode
          ? "🌱 تمرین با موفقیت انجام شد؛ امتیاز جدید ندارد."
          : "🏅 ۱۰ امتیاز گرفتی!"}
      </h3>
    `;

    app.querySelectorAll('[data-action="kitchen-answer"]')
      .forEach(function(button) {
        button.disabled = true;
      });

  } else {

    kitchenAttempts++;

    feedback.innerHTML = kitchenAttempts === 1
      ? "🌱 دوباره فکر کن! تعداد مهمان‌ها دو برابر شده است."
      : "🤖 اندی: برای ۸ نفر، ۲ × ۲ = ۴ پیمانه آرد لازم داریم.";

  }
}

// ============================================
// مأموریت سوم: بانک
// ============================================

function showBank(practice) {
  loadProgress();

  bankPracticeMode = practice === true;
  bankAttempts = 0;

  const isCompleted = bankCompleted;
  const locked = isCompleted && !bankPracticeMode;

  app.innerHTML = `
    <main dir="rtl">

      <h1>🏦 بانک اندیشا</h1>
      <h2>مأموریت سوم: راز درصد!</h2>

      <p>مبلغ سپرده فرضی:
        <strong>۵۰۰٬۰۰۰ تومان</strong>
      </p>

      <p>درصد پاداش:
        <strong>۱۰ درصد</strong>
      </p>

      <h3>مقدار پاداش چند تومان می‌شود؟</h3>

      <div class="shop-options">

        <button data-action="bank-answer"
          data-answer="50000"
          ${locked ? "disabled" : ""}>
          ۵۰٬۰۰۰ تومان ${isCompleted ? "✅" : ""}
        </button>

        <button data-action="bank-answer"
          data-answer="100000"
          ${locked ? "disabled" : ""}>
          ۱۰۰٬۰۰۰ تومان
        </button>

        <button data-action="bank-answer"
          data-answer="25000"
          ${locked ? "disabled" : ""}>
          ۲۵٬۰۰۰ تومان
        </button>

      </div>

      <p id="bank-feedback">
        ${locked
          ? "🏅 این مأموریت قبلاً تکمیل شده است."
          : bankPracticeMode
            ? "🔄 حالت تمرین؛ امتیاز جدید دریافت نمی‌کنی."
            : "با دقت فکر کن و پاسخ را انتخاب کن."}
      </p>

      <p id="bank-score">⭐ امتیاز: ${score}</p>

      ${isCompleted && !bankPracticeMode ? `
        <button data-action="replay"
          data-zone-name="bank"
          style="
            background:linear-gradient(135deg,#a1c4fd,#c2e9fb);
            color:#142b52;
            margin-top:10px">
          🔄 تکرار مأموریت
        </button>
      ` : ""}

      <button data-action="city">
        بازگشت به شهرک 🏙️
      </button>

    </main>
  `;
}

function checkBankAnswer(answer) {
  loadProgress();

  if (bankCompleted && !bankPracticeMode) {
    return showBank(false);
  }

  const feedback = document.getElementById("bank-feedback");
  const scoreElement = document.getElementById("bank-score");

  if (!feedback || !scoreElement) return;

  if (answer === 50000) {

    if (!bankCompleted) {
      bankCompleted = true;
      score += 10;
      saveProgress();
    }

    scoreElement.textContent = `⭐ امتیاز: ${score}`;

    feedback.innerHTML = `
      🎉 آفرین قهرمان!

      <p>۱۰ درصد یعنی یک‌دهم.</p>
      <p>۵۰۰٬۰۰۰ ÷ ۱۰ = ۵۰٬۰۰۰ تومان</p>

      <h3>
        ${bankPracticeMode
          ? "🌱 تمرین با موفقیت انجام شد؛ امتیاز جدید ندارد."
          : "🏅 ۱۰ امتیاز گرفتی!"}
      </h3>
    `;

    app.querySelectorAll('[data-action="bank-answer"]')
      .forEach(function(button) {
        button.disabled = true;
      });

  } else {

    bankAttempts++;

    feedback.innerHTML = bankAttempts === 1
      ? "🌱 راهنمایی اندی: ۱۰ درصد یعنی یک‌دهم مبلغ."
      : "🤖 اندی: ۵۰۰٬۰۰۰ را بر ۱۰ تقسیم می‌کنیم؛ جواب ۵۰٬۰۰۰ است.";

  }
}

// ============================================
// مأموریت چهارم: نقشه‌سازی
// ============================================

function showMapWorkshop(practice) {
  loadProgress();

  mapPracticeMode = practice === true;
  mapAttempts = 0;

  const isCompleted = mapCompleted;
  const locked = isCompleted && !mapPracticeMode;

  app.innerHTML = `
    <main dir="rtl">

      <h1>📐 کارگاه نقشه‌سازی اندیشا</h1>
      <h2>مأموریت چهارم: طراح شهرک باش!</h2>

      <p>هر ۱ سانتی‌متر روی نقشه برابر با ۲ متر در واقعیت است.</p>

      <p>📏 فاصله مدرسه تا پارک روی نقشه:
        <strong>۷ سانتی‌متر</strong>
      </p>

      <h3>فاصله واقعی مدرسه تا پارک چند متر است؟</h3>

      <div class="shop-options">

        <button data-action="map-answer"
          data-answer="12"
          ${locked ? "disabled" : ""}>
          ۱۲ متر
        </button>

        <button data-action="map-answer"
          data-answer="14"
          ${locked ? "disabled" : ""}>
          ۱۴ متر ${isCompleted ? "✅" : ""}
        </button>

        <button data-action="map-answer"
          data-answer="16"
          ${locked ? "disabled" : ""}>
          ۱۶ متر
        </button>

      </div>

      <p id="map-feedback">
        ${locked
          ? "🏅 این مأموریت قبلاً تکمیل شده است."
          : mapPracticeMode
            ? "🔄 حالت تمرین؛ امتیاز جدید دریافت نمی‌کنی."
            : "پاسخ را انتخاب کن، مهندس کوچک!"}
      </p>

      <p id="map-score">⭐ امتیاز: ${score}</p>

      ${isCompleted && !mapPracticeMode ? `
        <button data-action="replay"
          data-zone-name="map"
          style="
            background:linear-gradient(135deg,#a1c4fd,#c2e9fb);
            color:#142b52;
            margin-top:10px">
          🔄 تکرار مأموریت
        </button>
      ` : ""}

      <button data-action="city">
        بازگشت به شهرک 🏙️
      </button>

    </main>
  `;
}

function checkMapAnswer(answer) {
  loadProgress();

  if (mapCompleted && !mapPracticeMode) {
    return showMapWorkshop(false);
  }

  const feedback = document.getElementById("map-feedback");
  const scoreElement = document.getElementById("map-score");

  if (!feedback || !scoreElement) return;

  if (answer === 14) {

    if (!mapCompleted) {
      mapCompleted = true;
      score += 10;
      saveProgress();
    }

    scoreElement.textContent = `⭐ امتیاز: ${score}`;

    feedback.innerHTML = `
      🎉 آفرین مهندس شهرک!

      <p>۷ × ۲ = ۱۴ متر</p>

      <h3>
        ${mapPracticeMode
          ? "🌱 تمرین با موفقیت انجام شد؛ امتیاز جدید ندارد."
          : "🏅 ۱۰ امتیاز گرفتی!"}
      </h3>
    `;

    app.querySelectorAll('[data-action="map-answer"]')
      .forEach(function(button) {
        button.disabled = true;
      });

  } else {

    mapAttempts++;

    feedback.innerHTML = mapAttempts === 1
      ? "🌱 هر سانتی‌متر برابر ۲ متر است. پس ۷ را در ۲ ضرب کن."
      : "🤖 اندی: ۷ × ۲ = ۱۴ متر.";

  }
}

// ============================================
// مأموریت پنجم: پرسش‌های برج
// ============================================

const towerQuestions = [
  {
    title: "🛍️ قفل اول: راز تخفیف",
    question: "قیمت یک کیف ۳۰۰٬۰۰۰ تومان است. با تخفیف ۲۰ درصدی، قیمت نهایی چقدر می‌شود؟",
    options: [
      { text: "۲۴۰٬۰۰۰ تومان", value: 240000 },
      { text: "۲۶۰٬۰۰۰ تومان", value: 260000 },
      { text: "۲۸۰٬۰۰۰ تومان", value: 280000 }
    ],
    answer: 240000,
    hint: "۲۰ درصدِ ۳۰۰٬۰۰۰ برابر ۶۰٬۰۰۰ است. تخفیف را از قیمت کم کن."
  },
  {
    title: "🍰 قفل دوم: دستور پخت",
    question: "برای ۳ نفر، ۲ پیمانه آرد لازم است. برای ۹ نفر چند پیمانه لازم داریم؟",
    options: [
      { text: "۴ پیمانه", value: 4 },
      { text: "۶ پیمانه", value: 6 },
      { text: "۸ پیمانه", value: 8 }
    ],
    answer: 6,
    hint: "تعداد مهمان‌ها ۳ برابر شده؛ مقدار آرد هم ۳ برابر می‌شود."
  },
  {
    title: "🏦 قفل سوم: رمز درصد",
    question: "۵ درصدِ ۴۰۰٬۰۰۰ تومان چند تومان است؟",
    options: [
      { text: "۱۰٬۰۰۰ تومان", value: 10000 },
      { text: "۲۰٬۰۰۰ تومان", value: 20000 },
      { text: "۴۰٬۰۰۰ تومان", value: 40000 }
    ],
    answer: 20000,
    hint: "۱۰ درصد برابر ۴۰٬۰۰۰ است؛ ۵ درصد نصف آن است."
  },
  {
    title: "📐 قفل چهارم: نقشه شهرک",
    question: "اگر هر سانتی‌متر روی نقشه برابر ۳ متر باشد، ۸ سانتی‌متر چند متر است؟",
    options: [
      { text: "۱۸ متر", value: 18 },
      { text: "۲۱ متر", value: 21 },
      { text: "۲۴ متر", value: 24 }
    ],
    answer: 24,
    hint: "۸ را در ۳ ضرب کن."
  }
];

// ============================================
// API عمومی بازی برای افزونه‌ها
// ============================================

window.andishaGetExpectedAnswer = function(action) {
  const fixed = {
    "shop-answer": 150000,
    "kitchen-answer": 4,
    "bank-answer": 50000,
    "map-answer": 14
  };

  if (action === "tower-answer") {
    return towerQuestions[towerStep]
      ? towerQuestions[towerStep].answer
      : null;
  }

  return Object.prototype.hasOwnProperty.call(fixed, action)
    ? fixed[action]
    : null;
};

window.towerQuestions = towerQuestions;

Object.defineProperty(window, "towerStep", {
  configurable: true,
  get: function() {
    return towerStep;
  }
});

Object.defineProperty(window, "towerCompleted", {
  configurable: true,
  get: function() {
    return towerCompleted;
  }
});

window.andishaIsTowerCompleted = function() {
  return towerCompleted;
};

// ورود مستقیم افزونه به پنج ساختمان
window.andishaOpenZone = function(index) {
  index = Number(index);

  if (!Number.isInteger(index) || index < 0 || index > 4) {
    return false;
  }

  switch (index) {
    case 0:
      showShop(false);
      break;
    case 1:
      showKitchen(false);
      break;
    case 2:
      showBank(false);
      break;
    case 3:
      showMapWorkshop(false);
      break;
    case 4:
      showTower(false);
      break;
    default:
      return false;
  }

  return true;
};

console.log("ANDISHA PUBLIC GAME API READY");

// ============================================
// نمایش برج هوشمند
// ============================================

function showTower(practice) {
  loadProgress();

  towerPracticeMode = practice === true;

  if (towerCompleted && !towerPracticeMode) {
    app.innerHTML = `
      <main dir="rtl">

        <h1>🏆 برج هوشمند اندیشا</h1>
        <h2>🎉🎉 چهار قفل باز شد!</h2>
        <h2>🥇 چالش برج را با موفقیت به پایان رساندی!</h2>

        <p>⭐ امتیاز تو: ${score}</p>

        <p>🛍️ فروشگاه:
          ${shopCompleted ? "تکمیل" : "هنوز تکمیل نشده"}
        </p>

        <p>🍰 آشپزخانه:
          ${kitchenCompleted ? "تکمیل" : "هنوز تکمیل نشده"}
        </p>

        <p>🏦 بانک:
          ${bankCompleted ? "تکمیل" : "هنوز تکمیل نشده"}
        </p>

        <p>📐 نقشه‌سازی:
          ${mapCompleted ? "تکمیل" : "هنوز تکمیل نشده"}
        </p>

        <p>🏆 برج هوشمند: تکمیل</p>

        <h3>🌟 نشان طلایی قهرمانی مبارک!</h3>

        <button data-action="replay"
          data-zone-name="tower"
          style="
            background:linear-gradient(135deg,#a1c4fd,#c2e9fb);
            color:#142b52;
            margin-top:10px">
          🔄 تکرار مأموریت برج
        </button>

        <button data-action="city">
          بازگشت به شهرک 🏙️
        </button>

      </main>
    `;

    return;
  }

  towerStep = 0;
  showTowerQuestion();
}

function showTowerQuestion() {
  const q = towerQuestions[towerStep];

  if (!q) {
    showTower();
    return;
  }

  app.innerHTML = `
    <main dir="rtl">

      <h1>🏆 برج هوشمند اندیشا</h1>
      <h2>مأموریت نهایی: چهار قفل قهرمانی</h2>

      <h3>${q.title}</h3>

      <p>🔐 قفل ${towerStep + 1} از ۴</p>
      <p>${q.question}</p>

      <div class="shop-options">

        ${q.options.map(function(option) {
          return `
            <button
              data-action="tower-answer"
              data-answer="${option.value}">
              ${option.text}
            </button>
          `;
        }).join("")}

      </div>

      <p id="tower-feedback">
        🤖 اندی: هر چهار قفل را باز کن!
      </p>

      <p>⭐ امتیاز فعلی: ${score}</p>

      <button data-action="city">
        بازگشت به شهرک 🏙️
      </button>

    </main>
  `;
}

function showTowerVictory() {
  loadProgress();

  app.innerHTML = `
    <main dir="rtl">

      <h1>🏆 برج هوشمند اندیشا</h1>
      <h2>🎉🎉 چهار قفل باز شد!</h2>
      <h2>🥇 تو قهرمان برج اندیشا هستی!</h2>

      <p>⭐ امتیاز تو: ${score}</p>

      <p>🛍️ فروشگاه:
        ${shopCompleted ? "تکمیل" : "هنوز تکمیل نشده"}
      </p>

      <p>🍰 آشپزخانه:
        ${kitchenCompleted ? "تکمیل" : "هنوز تکمیل نشده"}
      </p>

      <p>🏦 بانک:
        ${bankCompleted ? "تکمیل" : "هنوز تکمیل نشده"}
      </p>

      <p>📐 نقشه‌سازی:
        ${mapCompleted ? "تکمیل" : "هنوز تکمیل نشده"}
      </p>

      <p>🏆 برج هوشمند: تکمیل</p>

      <h3>🌟 نشان طلایی قهرمانی مبارک!</h3>

      ${towerPracticeMode ? `
        <p>🌱 تمرین برج با موفقیت انجام شد؛ امتیاز جدید ندارد.</p>
      ` : `
        <p>🏅 ۱۰ امتیاز برای تکمیل برج دریافت کردی!</p>
      `}

      <button data-action="city">
        بازگشت به شهرک 🏙️
      </button>

    </main>
  `;
}

function checkTowerAnswer(answer) {
  loadProgress();

  if (towerCompleted && !towerPracticeMode) {
    showTower(false);
    return;
  }

  const q = towerQuestions[towerStep];
  const feedback = document.getElementById("tower-feedback");

  if (!q || !feedback) return;

  if (answer === q.answer) {

    towerStep++;

    if (towerStep === towerQuestions.length) {

      if (!towerCompleted) {
        towerCompleted = true;
        score += 10;
        saveProgress();
      }

      showTowerVictory();

    } else {
      showTowerQuestion();
    }

  } else {

    feedback.innerHTML = `
      🌱 هنوز این قفل باز نشده!
      <p>${q.hint}</p>
      <p>دوباره تلاش کن قهرمان!</p>
    `;

  }
}

// ============================================
// مدیریت مرکزی کلیک‌های بازی
// ============================================

app.addEventListener("click", function(event) {
  const target = event.target;

  if (!target || typeof target.closest !== "function") {
    return;
  }

  const button = target.closest("button[data-action]");

  if (!button || !app.contains(button) || button.disabled) {
    return;
  }

  const action = button.dataset.action;

  event.preventDefault();

  switch (action) {

    case "story":
      showStory();
      break;

    case "city":
      showCity();
      break;

    case "reset-progress": {
      const confirmed = window.confirm(
        "آیا مطمئنی می‌خواهی پیشرفت بازی پاک شود؟ امتیازها و وضعیت مناطق صفر می‌شوند، اما نشان‌ها، پروفایل و یادداشت‌ها حفظ می‌شوند."
      );

      if (confirmed) {
        resetProgress();
        showCity();
      }

      break;
    }

    case "replay": {
      const zoneName = button.dataset.zoneName;

      if (zoneName === "shop") {
        showShop(true);

      } else if (zoneName === "kitchen") {
        showKitchen(true);

      } else if (zoneName === "bank") {
        showBank(true);

      } else if (zoneName === "map") {
        showMapWorkshop(true);

      } else if (zoneName === "tower") {
        showTower(true);
      }

      break;
    }

    case "zone": {
      const index = Number(button.dataset.zone);

      if (!window.andishaOpenZone(index)) {
        console.warn("ورود به ساختمان ناموفق بود:", index);
      }

      break;
    }

    case "shop-answer":
      checkShopAnswer(Number(button.dataset.answer));
      break;

    case "kitchen-answer":
      checkKitchenAnswer(Number(button.dataset.answer));
      break;

    case "bank-answer":
      checkBankAnswer(Number(button.dataset.answer));
      break;

    case "map-answer":
      checkMapAnswer(Number(button.dataset.answer));
      break;

    case "tower-answer":
      checkTowerAnswer(Number(button.dataset.answer));
      break;
  }

}, true);

// ============================================
// اجرای صفحه شروع
// ============================================

loadProgress();
showWelcome();

// ============================================
// 🎵🎧 ANDISHA UNIFIED MUSIC STUDIO V7.1
// ============================================

(function() {
  "use strict";

  if (window.__andishaUnifiedStudioV71) return;
  window.__andishaUnifiedStudioV71 = true;

  const MUSIC_KEY = "andishaMusic";
  const TRACK_KEY = "andishaTrack";
  const VOLUME_KEY = "andishaVolume";
  const POSITION_KEY = "andishaMusicPanelPosition";

  const oldEnabled = storageGet(MUSIC_KEY, null);
  const oldEnabledV2 = storageGet("andishaMusicEnabled", "false");

  let enabled = oldEnabled !== null
    ? oldEnabled === "true"
    : oldEnabledV2 === "true";

  let track = Number(storageGet(TRACK_KEY, "0")) || 0;
  let volume = Number(storageGet(VOLUME_KEY, "35"));

  track = Math.max(0, Math.min(2, track));
  volume = Math.max(0, Math.min(100, volume));

  const VALID_POSITIONS = [
    "top-right",
    "top-left",
    "bottom-right",
    "bottom-left"
  ];

  let panelPosition = storageGet(POSITION_KEY, "bottom-left");

  if (VALID_POSITIONS.indexOf(panelPosition) === -1) {
    panelPosition = "bottom-left";
  }

  let panelOpen = false;

  const tracks = [
    {
      name: "🎹 آرام و دلنشین",
      notes: [392, 440, 523, 440, 392, 330, 392, 440]
    },
    {
      name: "🎮 شاد و کودکانه",
      notes: [523, 659, 784, 659, 587, 698, 880, 698]
    },
    {
      name: "🚀 ماجراجویی قهرمان",
      notes: [330, 392, 494, 587, 494, 659, 587, 494]
    }
  ];

  let audio = null;
  let master = null;
  let timer = null;
  let noteIndex = 0;
  let phoneURL = null;
  let player = null;

  let status = null;

  let voiceActive = false;
  let feedbackBusy = false;

  let resumeMusicAfterVoice = false;
  let resumePhoneAfterVoice = false;

  let feedbackTimer = null;

  const activeOscillators = new Set();

  // ==========================================
  // ساخت سیستم صوتی
  // ==========================================

  function setupAudio() {
    const AudioAPI =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioAPI) return false;

    if (!audio) {
      try {
        audio = new AudioAPI();
        master = audio.createGain();
        master.connect(audio.destination);
      } catch (error) {
        console.warn("ساخت AudioContext ناموفق بود:", error);
        return false;
      }
    }

    if (
      audio.state === "suspended" &&
      typeof audio.resume === "function"
    ) {
      audio.resume().catch(function(error) {
        console.warn("فعال‌سازی صدا ناموفق بود:", error);
      });
    }

    master.gain.value = volume / 100;

    return true;
  }

  // ==========================================
  // توقف صداهای ساخته‌شده
  // ==========================================

  function stopGeneratedSounds() {
    activeOscillators.forEach(function(oscillator) {
      try {
        oscillator.stop();
      } catch (error) {}

      try {
        oscillator.disconnect();
      } catch (error) {}
    });

    activeOscillators.clear();
  }

  // ==========================================
  // تولید نت
  // ==========================================

  function tone(freq, duration, type, strength, startAt) {
    if (!setupAudio()) return;

    const oscillator = audio.createOscillator();
    const gain = audio.createGain();

    const startTime =
      typeof startAt === "number"
        ? startAt
        : audio.currentTime + 0.02;

    oscillator.type = type || "sine";
    oscillator.frequency.value = freq;

    gain.gain.setValueAtTime(
      strength || 0.1,
      startTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      startTime + duration
    );

    oscillator.connect(gain);
    gain.connect(master);

    activeOscillators.add(oscillator);

    oscillator.onended = function() {
      activeOscillators.delete(oscillator);

      try {
        oscillator.disconnect();
        gain.disconnect();
      } catch (error) {}
    };

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }

  // ==========================================
  // پخش موسیقی پس‌زمینه
  // ==========================================

  function playNote() {
    if (
      !enabled ||
      !audio ||
      voiceActive ||
      feedbackBusy ||
      (player && !player.paused)
    ) {
      return;
    }

    const melody = tracks[track].notes;
    const frequency = melody[noteIndex % melody.length];

    noteIndex++;

    tone(frequency, 0.28, "triangle", 0.12);
  }

  function startMusic() {
    if (
      !enabled ||
      timer ||
      voiceActive ||
      feedbackBusy ||
      (player && !player.paused)
    ) {
      return;
    }

    if (!setupAudio()) {
      if (status) {
        status.textContent =
          "مرورگر از موسیقی پشتیبانی نمی‌کند.";
      }
      return;
    }

    noteIndex = 0;
    playNote();

    timer = setInterval(playNote, 420);

    if (status) {
      status.textContent = "🎵 موسیقی در حال پخش است";
    }
  }

  function stopMusic() {
    if (timer) {
      clearInterval(timer);
    }

    timer = null;

    if (status) {
      status.textContent = "موسیقی متوقف شد.";
    }
  }

  // ==========================================
  // ادامه صدای قبلی
  // ==========================================

  function resumePreviousAudio() {
    const resumePhone = resumePhoneAfterVoice;
    const resumeMusic = resumeMusicAfterVoice;

    resumePhoneAfterVoice = false;
    resumeMusicAfterVoice = false;

    if (resumePhone && player && player.src) {
      player.play().then(function() {
        if (status) {
          status.textContent =
            "🎧 موسیقی انتخابی گوشی در حال پخش است";
        }
      }).catch(function() {
        if (enabled) startMusic();
      });

      return;
    }

    if (resumeMusic && enabled) {
      startMusic();
    }
  }

  // ==========================================
  // هماهنگی با صدای راهنما
  // ==========================================

  function beforeVoice() {
    if (!voiceActive && !feedbackBusy) {
      resumeMusicAfterVoice = !!timer;

      resumePhoneAfterVoice =
        !!(player && !player.paused && player.src);
    }

    if (feedbackTimer) {
      clearTimeout(feedbackTimer);
      feedbackTimer = null;
    }

    feedbackBusy = false;

    stopMusic();
    stopGeneratedSounds();

    if (player && !player.paused) {
      player.pause();
    }

    voiceActive = true;

    if (status) {
      status.textContent =
        "🎙️ صدای راهنمای اندیشا در حال پخش است";
    }
  }

  function afterVoice() {
    if (!voiceActive) return;

    voiceActive = false;

    if (status) {
      status.textContent = "صدای راهنما پایان یافت.";
    }

    resumePreviousAudio();
  }

  // ==========================================
  // صدای پاسخ صحیح و غلط
  // ==========================================

  function playFeedback(correct) {

    // صدای راهنما همیشه اولویت دارد.
    if (voiceActive) return;

    if (timer) {
      resumeMusicAfterVoice = true;
    }

    if (player && !player.paused && player.src) {
      resumePhoneAfterVoice = true;
    }

    stopMusic();

    if (player && !player.paused) {
      player.pause();
    }

    stopGeneratedSounds();

    if (feedbackTimer) {
      clearTimeout(feedbackTimer);
      feedbackTimer = null;
    }

    feedbackBusy = true;

    if (status) {
      status.textContent = correct
        ? "🌟 پاسخ درست!"
        : "🌱 دوباره تلاش کن!";
    }

    if (!enabled || !setupAudio()) {
      finishFeedback();
      return;
    }

    const now = audio.currentTime + 0.04;

    if (correct) {
      tone(659, 0.13, "sine", 0.16, now);
      tone(784, 0.15, "sine", 0.16, now + 0.19);
      tone(988, 0.20, "sine", 0.16, now + 0.40);

      feedbackTimer = setTimeout(finishFeedback, 800);

    } else {
      tone(240, 0.15, "triangle", 0.12, now);
      tone(190, 0.17, "triangle", 0.10, now + 0.22);

      feedbackTimer = setTimeout(finishFeedback, 600);
    }
  }

  function finishFeedback() {
    if (feedbackTimer) {
      clearTimeout(feedbackTimer);
      feedbackTimer = null;
    }

    feedbackBusy = false;

    if (!voiceActive) {
      resumePreviousAudio();
    }
  }

  // ==========================================
  // API هماهنگی با فایل صوتی MP3
  // ==========================================

  window.andishaAudioCoordinator = {
    beforeVoice: beforeVoice,
    afterVoice: afterVoice,
    playFeedback: playFeedback
  };

  // ==========================================
  // حباب شناور
  // ==========================================

  const bubble = document.createElement("button");

  bubble.id = "andishaMusicBubble";
  bubble.type = "button";
  bubble.textContent = "🎵";

  bubble.setAttribute(
    "aria-label",
    "باز کردن استودیوی موسیقی"
  );

  bubble.style.cssText = `
    position:fixed;
    z-index:99999;
    width:52px;
    height:52px;
    border-radius:50%;
    border:2px solid #f5c75e;
    background:#142b52;
    color:#ffe18a;
    font-size:22px;
    cursor:pointer;
    display:none;
    box-shadow:0 5px 18px #0006;
    padding:0;
    margin:0;
  `;

  document.body.appendChild(bubble);

  // ==========================================
  // پنل موسیقی
  // ==========================================

  const panel = document.createElement("section");

  panel.id = "andishaMusicStudio";
  panel.dir = "rtl";

  panel.style.cssText = `
    position:fixed;
    z-index:99999;
    width:min(320px,calc(100% - 20px));
    max-height:min(60vh,420px);
    overflow-y:auto;
    padding:12px;
    border:2px solid #f5c75e;
    border-radius:16px;
    background:#142b52;
    color:white;
    font-family:Tahoma,sans-serif;
    font-size:13px;
    box-shadow:0 5px 20px #0005;
    text-align:center;
    box-sizing:border-box;
  `;

  panel.innerHTML = `
    <div style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:6px;
      margin-bottom:8px">

      <h3 style="margin:0;color:#ffe18a;font-size:14px">
        🎵 استودیوی موسیقی اندیشا
      </h3>

      <button id="andishaMusicCollapse"
        type="button"
        aria-label="جمع کردن استودیو"
        style="
          padding:4px 9px;
          margin:0;
          border:0;
          border-radius:8px;
          background:#f5c75e;
          color:#142b52;
          font-weight:bold;
          cursor:pointer">
        ✕
      </button>

    </div>

    <button id="andishaMusicToggle" type="button">
      ${enabled
        ? "🔇 خاموش کردن موسیقی"
        : "🎶 روشن کردن موسیقی"}
    </button>

    <select id="andishaTrack"
      aria-label="انتخاب موسیقی"
      style="
        width:100%;
        padding:9px;
        margin:8px 0;
        border-radius:9px">

      ${tracks.map(function(item, index) {
        return `
          <option value="${index}">
            ${item.name}
          </option>
        `;
      }).join("")}

    </select>

    <label for="andishaVolume">🔊 میزان صدا</label>

    <input id="andishaVolume"
      type="range"
      min="0"
      max="100"
      value="${volume}"
      style="width:100%">

    <label for="andishaMusicPanelPosition"
      style="display:block;margin-top:8px">
      📍 محل نمایش استودیو
    </label>

    <select id="andishaMusicPanelPosition"
      aria-label="محل نمایش استودیو"
      style="
        width:100%;
        padding:9px;
        margin:4px 0 8px;
        border-radius:9px">

      <option value="top-right">بالا راست</option>
      <option value="top-left">بالا چپ</option>
      <option value="bottom-right">پایین راست</option>
      <option value="bottom-left">پایین چپ</option>

    </select>

    <hr style="border-color:#ffffff33">

    <h3 style="color:#ffe18a">🎧 موسیقی دلخواه من</h3>

    <input id="andishaMusicFile"
      type="file"
      accept="audio/*"
      style="max-width:100%;color:white">

    <audio id="andishaPhonePlayer"
      controls
      style="width:100%;margin-top:8px">
    </audio>

    <p id="andishaPhoneMessage">
      هنوز آهنگی انتخاب نشده است.
    </p>

    <p id="andishaVoiceStatus">
      سیستم صوتی اندیشا آماده است.
    </p>

    <p id="andishaMusicStatus">
      موسیقی پس‌زمینه بازی
    </p>
  `;

  document.body.appendChild(panel);

  panel.querySelectorAll("button").forEach(function(button) {
    if (button.id === "andishaMusicCollapse") return;

    button.style.cssText = `
      padding:9px 12px;
      margin:4px;
      border:0;
      border-radius:9px;
      background:#f5c75e;
      color:#142b52;
      font-weight:bold;
      font-family:Tahoma,sans-serif;
      cursor:pointer;
    `;
  });

  // ==========================================
  // اتصال کنترل‌ها
  // ==========================================

  const toggle =
    document.getElementById("andishaMusicToggle");

  const selector =
    document.getElementById("andishaTrack");

  const slider =
    document.getElementById("andishaVolume");

  const positionSelect =
    document.getElementById("andishaMusicPanelPosition");

  const collapseButton =
    document.getElementById("andishaMusicCollapse");

  status =
    document.getElementById("andishaMusicStatus");

  const picker =
    document.getElementById("andishaMusicFile");

  player =
    document.getElementById("andishaPhonePlayer");

  const phoneMessage =
    document.getElementById("andishaPhoneMessage");

  selector.value = String(track);
  positionSelect.value = panelPosition;

  // ==========================================
  // موقعیت پنل و حباب
  // ==========================================

  function applyPanelPosition() {
    panel.style.left = "";
    panel.style.right = "";
    panel.style.top = "";
    panel.style.bottom = "";

    bubble.style.left = "";
    bubble.style.right = "";
    bubble.style.top = "";
    bubble.style.bottom = "";

    const edge = "10px";

    if (panelPosition === "top-right") {
      panel.style.top = edge;
      panel.style.right = edge;
      bubble.style.top = edge;
      bubble.style.right = edge;

    } else if (panelPosition === "top-left") {
      panel.style.top = edge;
      panel.style.left = edge;
      bubble.style.top = edge;
      bubble.style.left = edge;

    } else if (panelPosition === "bottom-right") {
      panel.style.bottom = edge;
      panel.style.right = edge;
      bubble.style.bottom = edge;
      bubble.style.right = edge;

    } else if (panelPosition === "bottom-left") {
      panel.style.bottom = edge;
      panel.style.left = edge;
      bubble.style.bottom = edge;
      bubble.style.left = edge;
    }
  }

  function applyPanelVisibility() {
    panel.style.display = panelOpen ? "block" : "none";
    bubble.style.display = panelOpen ? "none" : "block";
  }

  applyPanelPosition();
  applyPanelVisibility();

  // ==========================================
  // باز کردن قفل صوتی مرورگر
  // ==========================================

  function unlockAudioOnce() {
    setupAudio();
  }

  document.addEventListener(
    "pointerdown",
    unlockAudioOnce,
    { once: true }
  );

  document.addEventListener(
    "keydown",
    unlockAudioOnce,
    { once: true }
  );

  // ==========================================
  // روشن و خاموش کردن موسیقی
  // ==========================================

  toggle.addEventListener("click", function() {
    enabled = !enabled;

    storageSet(MUSIC_KEY, enabled);
    storageSet("andishaMusicEnabled", enabled);

    toggle.textContent = enabled
      ? "🔇 خاموش کردن موسیقی"
      : "🎶 روشن کردن موسیقی";

    if (enabled) {
      if (!voiceActive && !feedbackBusy) {
        startMusic();
      }
    } else {
      stopMusic();
      stopGeneratedSounds();
      resumeMusicAfterVoice = false;
    }
  });

  // ==========================================
  // انتخاب موسیقی
  // ==========================================

  selector.addEventListener("change", function() {
    track = Number(selector.value);

    storageSet(TRACK_KEY, track);

    storageSet(
      "andishaMusicTrack",
      ["calm", "happy", "adventure"][track]
    );

    if (enabled && !voiceActive && !feedbackBusy) {
      stopMusic();
      stopGeneratedSounds();
      startMusic();
    }
  });

  // ==========================================
  // میزان صدا
  // ==========================================

  slider.addEventListener("input", function() {
    volume = Number(slider.value);

    storageSet(VOLUME_KEY, volume);

    if (master) {
      master.gain.value = volume / 100;
    }
  });

  // ==========================================
  // محل پنل
  // ==========================================

  positionSelect.addEventListener("change", function() {
    const value = positionSelect.value;

    if (VALID_POSITIONS.indexOf(value) === -1) {
      return;
    }

    panelPosition = value;

    storageSet(POSITION_KEY, panelPosition);

    applyPanelPosition();
  });

  // ==========================================
  // جمع و باز کردن پنل
  // ==========================================

  collapseButton.addEventListener("click", function() {
    panelOpen = false;
    applyPanelVisibility();
  });

  bubble.addEventListener("click", function() {
    panelOpen = true;
    applyPanelVisibility();
  });

  // ==========================================
  // انتخاب آهنگ از گوشی
  // ==========================================

  picker.addEventListener("change", function() {
    const file = picker.files[0];

    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      phoneMessage.textContent =
        "لطفاً یک فایل صوتی انتخاب کن.";
      return;
    }

    if (phoneURL) {
      URL.revokeObjectURL(phoneURL);
    }

    phoneURL = URL.createObjectURL(file);

    player.src = phoneURL;
    player.load();

    phoneMessage.textContent =
      "🎵 آهنگ انتخاب شد؛ دکمه پخش را بزن!";
  });

  player.addEventListener("play", function() {
    if (voiceActive || feedbackBusy) {
      player.pause();
      return;
    }

    stopMusic();
    stopGeneratedSounds();
  });

  player.addEventListener("ended", function() {
    if (enabled && !voiceActive && !feedbackBusy) {
      startMusic();
    }
  });

  // ==========================================
  // توقف گفتار مرورگر هنگام تغییر صفحه
  // ==========================================

  app.addEventListener("click", function() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  });

  // ==========================================
  // تشخیص پاسخ‌ها و پخش صدای بازخورد
  // ==========================================

  document.addEventListener("click", function(event) {
    const target = event.target;

    if (!target || typeof target.closest !== "function") {
      return;
    }

    const button = target.closest("#app button[data-action]");

    if (!button || button.disabled) return;

    const action = button.dataset.action;

    const expected = window.andishaGetExpectedAnswer
      ? window.andishaGetExpectedAnswer(action)
      : null;

    if (expected === null || expected === undefined) {
      return;
    }

    const answer = Number(button.dataset.answer);

    playFeedback(answer === expected);

  }, true);

  // ==========================================
  // پاک‌سازی هنگام خروج
  // ==========================================

  window.addEventListener("beforeunload", function() {
    stopMusic();
    stopGeneratedSounds();

    if (feedbackTimer) {
      clearTimeout(feedbackTimer);
      feedbackTimer = null;
    }

    if (player) {
      player.pause();
    }

    if (phoneURL) {
      URL.revokeObjectURL(phoneURL);
    }

    if (audio && audio.state !== "closed") {
      audio.close().catch(function() {});
    }
  });

  if (enabled) {
    toggle.textContent = "🔇 خاموش کردن موسیقی";
  }

  console.log("ANDISHA UNIFIED MUSIC STUDIO V7.1 READY");

})();
