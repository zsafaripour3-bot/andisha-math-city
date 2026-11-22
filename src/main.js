
"use strict";

// ============================================
// 🏙️ ANDISHA SMART CITY
// نسخه یکپارچه و اصلاح‌شده
// ============================================

const app = document.getElementById("app");

if (!app) {
  document.body.innerHTML = "<h2>خطا: بخش اصلی بازی پیدا نشد.</h2>";
  throw new Error("Andisha app not found");
}

// ============================================
// اطلاعات و ذخیره پیشرفت بازی
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

function saveProgress() {
  try {
    localStorage.setItem(STORAGE.score, String(score));
    localStorage.setItem(STORAGE.shop, String(shopCompleted));
    localStorage.setItem(STORAGE.kitchen, String(kitchenCompleted));
    localStorage.setItem(STORAGE.bank, String(bankCompleted));
    localStorage.setItem(STORAGE.map, String(mapCompleted));
    localStorage.setItem(STORAGE.tower, String(towerCompleted));
  } catch (error) {
    console.error("خطا در ذخیره پیشرفت:", error);
  }
}

function loadProgress() {
  try {
    score = Number(localStorage.getItem(STORAGE.score)) || 0;

    shopCompleted = localStorage.getItem(STORAGE.shop) === "true";
    kitchenCompleted = localStorage.getItem(STORAGE.kitchen) === "true";
    bankCompleted = localStorage.getItem(STORAGE.bank) === "true";
    mapCompleted = localStorage.getItem(STORAGE.map) === "true";
    towerCompleted = localStorage.getItem(STORAGE.tower) === "true";
  } catch (error) {
    console.error("خطا در خواندن پیشرفت:", error);
  }
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

function showCompletedPage(title, message) {
  loadProgress();

  app.innerHTML = `
    <main dir="rtl">
      <h1>${title}</h1>
      <h2>🎉 ${message}</h2>
      <h3>⭐ مجموع امتیاز: ${score}</h3>
      <p>تعداد مناطق تکمیل‌شده: ${completedCount()} از ۵</p>
      <button data-action="city">بازگشت به شهرک 🏙️</button>
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
      <button data-action="story">شروع ماجراجویی 🚀</button>
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
      <button data-action="city">ورود به شهرک 🏙️</button>
    </main>
  `;
}

// ============================================
// نقشه شهرک
// ============================================

function showCity() {
  loadProgress();

  app.innerHTML = `
    <main dir="rtl">
      <h1>🏙️ شهرک هوشمند اندیشا</h1>
      <h2>نقشه مأموریت قهرمان</h2>

      <h3>⭐ امتیاز تو: ${score}</h3>
      <p>🏅 مناطق تکمیل‌شده: ${completedCount()} از ۵</p>

      <section class="city-map">
        ${zones.map((zone, i) => {
          const completed = [
            shopCompleted,
            kitchenCompleted,
            bankCompleted,
            mapCompleted,
            towerCompleted
          ][i];

          return `
            <article class="building"
              style="border-top:7px solid ${zone.color}">

              <div class="building-icon">${zone.icon}</div>
              <h2>${zone.name}</h2>
              <p>${zone.mission}</p>

              <p>
                ${completed ? "🏅 تکمیل شده" : "🔐 مأموریت باز است"}
              </p>

              <button data-action="zone" data-zone="${i}">
                ${completed ? "مشاهده منطقه" : "ورود به منطقه 🚀"}
              </button>

            </article>
          `;
        }).join("")}
      </section>

      <button data-action="story">
        مشاهده داستان ماجراجویی
      </button>
    </main>
  `;
}

// ============================================
// مأموریت اول: فروشگاه
// ============================================

function showShop() {
  loadProgress();
  shopAttempts = 0;

  const isCompleted = shopCompleted;

  app.innerHTML = `
    <main dir="rtl">
      <h1>🛍️ فروشگاه هوشمند اندیشا</h1>
      <h2>مأموریت اول: شکار تخفیف!</h2>

      ${isCompleted ? `<p>🏅 این مأموریت قبلاً تکمیل شده است.</p>` : ""}

      <p>قیمت اولیه کیف: <strong>۲۰۰٬۰۰۰ تومان</strong></p>
      <p>تخفیف فروشگاه: <strong>۲۵ درصد</strong></p>

      <h3>قیمت نهایی کیف چقدر است؟</h3>

      <div class="shop-options">
        <button data-action="shop-answer" data-answer="150000" ${isCompleted ? "disabled" : ""}>
          ۱۵۰٬۰۰۰ تومان
        </button>

        <button data-action="shop-answer" data-answer="175000" ${isCompleted ? "disabled" : ""}>
          ۱۷۵٬۰۰۰ تومان
        </button>

        <button data-action="shop-answer" data-answer="125000" ${isCompleted ? "disabled" : ""}>
          ۱۲۵٬۰۰۰ تومان
        </button>
      </div>

      <p id="feedback">
        ${isCompleted
          ? "🎉 آفرین! پاسخ درست: ۱۵۰٬۰۰۰ تومان (۲۵٪ تخفیف = ۵۰٬۰۰۰ تومان)"
          : "یکی از پاسخ‌ها را انتخاب کن."}
      </p>
      <p id="score">⭐ امتیاز: ${score}</p>

      <button data-action="city">بازگشت به شهرک 🏙️</button>
    </main>
  `;
}

function checkShopAnswer(answer) {
  loadProgress();

  if (shopCompleted) return;

  const feedback = document.getElementById("feedback");
  const scoreElement = document.getElementById("score");

  if (!feedback || !scoreElement) return;

  if (answer === 150000) {
    shopCompleted = true;
    score += 10;
    saveProgress();

    scoreElement.textContent = `⭐ امتیاز: ${score}`;

    feedback.innerHTML = `
      🎉 آفرین قهرمان!
      <p>۲۵ درصدِ ۲۰۰٬۰۰۰ می‌شود ۵۰٬۰۰۰ تومان.</p>
      <p>۲۰۰٬۰۰۰ − ۵۰٬۰۰۰ = ۱۵۰٬۰۰۰ تومان</p>
      <h3>🏅 ۱۰ امتیاز گرفتی!</h3>
    `;

    app.querySelectorAll('[data-action="shop-answer"]')
      .forEach(button => button.disabled = true);

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

function showKitchen() {
  loadProgress();
  kitchenAttempts = 0;

  const isCompleted = kitchenCompleted;

  app.innerHTML = `
    <main dir="rtl">
      <h1>🍰 آشپزخانه مرکزی اندیشا</h1>
      <h2>مأموریت دوم: دستور پخت قهرمانانه!</h2>

      ${isCompleted ? `<p>🏅 این مأموریت قبلاً تکمیل شده است.</p>` : ""}

      <p>برای ۴ نفر به ۲ پیمانه آرد نیاز داریم.</p>
      <h3>برای ۸ نفر چند پیمانه آرد لازم داریم؟</h3>

      <div class="shop-options">
        <button data-action="kitchen-answer" data-answer="3" ${isCompleted ? "disabled" : ""}>۳ پیمانه</button>
        <button data-action="kitchen-answer" data-answer="4" ${isCompleted ? "disabled" : ""}>۴ پیمانه</button>
        <button data-action="kitchen-answer" data-answer="6" ${isCompleted ? "disabled" : ""}>۶ پیمانه</button>
      </div>

      <p id="kitchen-feedback">
        ${isCompleted
          ? "🎉 آفرین! پاسخ درست: ۴ پیمانه (۲ × ۲)"
          : "پاسخ درست را انتخاب کن قهرمان!"}
      </p>
      <p id="kitchen-score">⭐ امتیاز: ${score}</p>

      <button data-action="city">بازگشت به شهرک 🏙️</button>
    </main>
  `;
}

function checkKitchenAnswer(answer) {
  loadProgress();

  if (kitchenCompleted) return;

  const feedback = document.getElementById("kitchen-feedback");
  const scoreElement = document.getElementById("kitchen-score");

  if (!feedback || !scoreElement) return;

  if (answer === 4) {
    kitchenCompleted = true;
    score += 10;
    saveProgress();

    scoreElement.textContent = `⭐ امتیاز: ${score}`;

    feedback.innerHTML = `
      🎉 آفرین قهرمان!
      <p>تعداد مهمان‌ها دو برابر شده است.</p>
      <p>۲ × ۲ = ۴ پیمانه آرد</p>
      <h3>🏅 ۱۰ امتیاز گرفتی!</h3>
    `;

    app.querySelectorAll('[data-action="kitchen-answer"]')
      .forEach(button => button.disabled = true);

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

function showBank() {
  loadProgress();
  bankAttempts = 0;

  const isCompleted = bankCompleted;

  app.innerHTML = `
    <main dir="rtl">
      <h1>🏦 بانک اندیشا</h1>
      <h2>مأموریت سوم: راز درصد!</h2>

      ${isCompleted ? `<p>🏅 این مأموریت قبلاً تکمیل شده است.</p>` : ""}

      <p>مبلغ سپرده فرضی: <strong>۵۰۰٬۰۰۰ تومان</strong></p>
      <p>درصد پاداش: <strong>۱۰ درصد</strong></p>

      <h3>مقدار پاداش چند تومان می‌شود؟</h3>

      <div class="shop-options">
        <button data-action="bank-answer" data-answer="50000" ${isCompleted ? "disabled" : ""}>
          ۵۰٬۰۰۰ تومان
        </button>

        <button data-action="bank-answer" data-answer="100000" ${isCompleted ? "disabled" : ""}>
          ۱۰۰٬۰۰۰ تومان
        </button>

        <button data-action="bank-answer" data-answer="25000" ${isCompleted ? "disabled" : ""}>
          ۲۵٬۰۰۰ تومان
        </button>
      </div>

      <p id="bank-feedback">
        ${isCompleted
          ? "🎉 آفرین! پاسخ درست: ۵۰٬۰۰۰ تومان (۵۰۰٬۰۰۰ ÷ ۱۰)"
          : "با دقت فکر کن و پاسخ را انتخاب کن."}
      </p>
      <p id="bank-score">⭐ امتیاز: ${score}</p>

      <button data-action="city">بازگشت به شهرک 🏙️</button>
    </main>
  `;
}

function checkBankAnswer(answer) {
  loadProgress();

  if (bankCompleted) return;

  const feedback = document.getElementById("bank-feedback");
  const scoreElement = document.getElementById("bank-score");

  if (!feedback || !scoreElement) return;

  if (answer === 50000) {
    bankCompleted = true;
    score += 10;
    saveProgress();

    scoreElement.textContent = `⭐ امتیاز: ${score}`;

    feedback.innerHTML = `
      🎉 آفرین قهرمان!
      <p>۱۰ درصد یعنی یک‌دهم.</p>
      <p>۵۰۰٬۰۰۰ ÷ ۱۰ = ۵۰٬۰۰۰ تومان</p>
      <h3>🏅 ۱۰ امتیاز گرفتی!</h3>
    `;

    app.querySelectorAll('[data-action="bank-answer"]')
      .forEach(button => button.disabled = true);

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

function showMapWorkshop() {
  loadProgress();
  mapAttempts = 0;

  const isCompleted = mapCompleted;

  app.innerHTML = `
    <main dir="rtl">
      <h1>📐 کارگاه نقشه‌سازی اندیشا</h1>
      <h2>مأموریت چهارم: طراح شهرک باش!</h2>

      ${isCompleted ? `<p>🏅 این مأموریت قبلاً تکمیل شده است.</p>` : ""}

      <p>هر ۱ سانتی‌متر روی نقشه برابر با ۲ متر در واقعیت است.</p>
      <p>📏 فاصله مدرسه تا پارک روی نقشه: <strong>۷ سانتی‌متر</strong></p>

      <h3>فاصله واقعی مدرسه تا پارک چند متر است؟</h3>

      <div class="shop-options">
        <button data-action="map-answer" data-answer="12" ${isCompleted ? "disabled" : ""}>۱۲ متر</button>
        <button data-action="map-answer" data-answer="14" ${isCompleted ? "disabled" : ""}>۱۴ متر</button>
        <button data-action="map-answer" data-answer="16" ${isCompleted ? "disabled" : ""}>۱۶ متر</button>
      </div>

      <p id="map-feedback">
        ${isCompleted
          ? "🎉 آفرین مهندس! پاسخ درست: ۱۴ متر (۷ × ۲)"
          : "پاسخ را انتخاب کن، مهندس کوچک!"}
      </p>
      <p id="map-score">⭐ امتیاز: ${score}</p>

      <button data-action="city">بازگشت به شهرک 🏙️</button>
    </main>
  `;
}

function checkMapAnswer(answer) {
  loadProgress();

  if (mapCompleted) return;

  const feedback = document.getElementById("map-feedback");
  const scoreElement = document.getElementById("map-score");

  if (!feedback || !scoreElement) return;

  if (answer === 14) {
    mapCompleted = true;
    score += 10;
    saveProgress();

    scoreElement.textContent = `⭐ امتیاز: ${score}`;

    feedback.innerHTML = `
      🎉 آفرین مهندس شهرک!
      <p>۷ × ۲ = ۱۴ متر</p>
      <h3>🏅 ۱۰ امتیاز گرفتی!</h3>
    `;

    app.querySelectorAll('[data-action="map-answer"]')
      .forEach(button => button.disabled = true);

  } else {
    mapAttempts++;

    feedback.innerHTML = mapAttempts === 1
      ? "🌱 هر سانتی‌متر برابر ۲ متر است. پس ۷ را در ۲ ضرب کن."
      : "🤖 اندی: ۷ × ۲ = ۱۴ متر.";
  }
}

// ============================================
// مأموریت پنجم: برج هوشمند
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

function showTower() {
  loadProgress();

  if (towerCompleted) {
    app.innerHTML = `
      <main dir="rtl">
        <h1>🏆 برج هوشمند اندیشا</h1>
        <h2>🎉🎉 چهار قفل باز شد!</h2>
        <h2>🥇 تو قهرمان شهرک اندیشا هستی!</h2>

        <p>⭐ امتیاز نهایی: ${score}</p>

        <p>🛍️ فروشگاه: ${shopCompleted ? "تکمیل" : "هنوز تکمیل نشده"}</p>
        <p>🍰 آشپزخانه: ${kitchenCompleted ? "تکمیل" : "هنوز تکمیل نشده"}</p>
        <p>🏦 بانک: ${bankCompleted ? "تکمیل" : "هنوز تکمیل نشده"}</p>
        <p>📐 نقشه‌سازی: ${mapCompleted ? "تکمیل" : "هنوز تکمیل نشده"}</p>
        <p>🏆 برج هوشمند: تکمیل</p>

        <h3>🌟 نشان طلایی قهرمانی مبارک!</h3>

        <button data-action="city">بازگشت به شهرک 🏙️</button>
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
        ${q.options.map(option => `
          <button
            data-action="tower-answer"
            data-answer="${option.value}">
            ${option.text}
          </button>
        `).join("")}
      </div>

      <p id="tower-feedback">🤖 اندی: هر چهار قفل را باز کن!</p>
      <p>⭐ امتیاز فعلی: ${score}</p>

      <button data-action="city">بازگشت به شهرک 🏙️</button>
    </main>
  `;
}

function checkTowerAnswer(answer) {
  loadProgress();

  if (towerCompleted) {
    showTower();
    return;
  }

  const q = towerQuestions[towerStep];
  const feedback = document.getElementById("tower-feedback");

  if (!q || !feedback) return;

  if (answer === q.answer) {
    towerStep++;

    if (towerStep === towerQuestions.length) {
      towerCompleted = true;
      score += 10;
      saveProgress();

      app.innerHTML = `
        <main dir="rtl">
          <h1>🏆 برج هوشمند اندیشا</h1>
          <h2>🎉🎉 چهار قفل باز شد!</h2>
          <h2>🥇 تو قهرمان شهرک اندیشا هستی!</h2>

          <p>⭐ امتیاز نهایی: ${score}</p>

          <p>🛍️ فروشگاه: ${shopCompleted ? "تکمیل" : "هنوز تکمیل نشده"}</p>
          <p>🍰 آشپزخانه: ${kitchenCompleted ? "تکمیل" : "هنوز تکمیل نشده"}</p>
          <p>🏦 بانک: ${bankCompleted ? "تکمیل" : "هنوز تکمیل نشده"}</p>
          <p>📐 نقشه‌سازی: ${mapCompleted ? "تکمیل" : "هنوز تکمیل نشده"}</p>
          <p>🏆 برج هوشمند: تکمیل</p>

          <h3>🌟 نشان طلایی قهرمانی مبارک!</h3>

          <button data-action="city">بازگشت به شهرک 🏙️</button>
        </main>
      `;

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

  if (!target || typeof target.closest !== "function") return;

  const button = target.closest("button[data-action]");

  if (!button || !app.contains(button) || button.disabled) return;

  const action = button.dataset.action;

  event.preventDefault();

  switch (action) {
    case "story":
      showStory();
      break;

    case "city":
      showCity();
      break;

    case "zone": {
      const index = Number(button.dataset.zone);

      if (!Number.isInteger(index) || !zones[index]) return;

      if (index === 0) showShop();
      else if (index === 1) showKitchen();
      else if (index === 2) showBank();
      else if (index === 3) showMapWorkshop();
      else if (index === 4) showTower();

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

// اجرای صفحه شروع
loadProgress();
showWelcome();

// ============================================
// 🎵🎧🎙️ استودیوی یکپارچه اندیشا
// نسخه جمع‌شونده با انتخاب موقعیت
// ============================================

(function() {
  "use strict";

  if (window.__andishaUnifiedStudio) return;
  window.__andishaUnifiedStudio = true;

  const MUSIC_KEY = "andishaMusic";
  const TRACK_KEY = "andishaTrack";
  const VOLUME_KEY = "andishaVolume";
  const POSITION_KEY = "andishaMusicPanelPosition";

  const oldEnabled = localStorage.getItem(MUSIC_KEY);
  const oldEnabledV2 = localStorage.getItem("andishaMusicEnabled");

  let enabled = oldEnabled !== null
    ? oldEnabled === "true"
    : oldEnabledV2 === "true";

  let track = Number(localStorage.getItem(TRACK_KEY)) || 0;
  let volume = Number(localStorage.getItem(VOLUME_KEY) || 35);

  track = Math.max(0, Math.min(2, track));
  volume = Math.max(0, Math.min(100, volume));

  const validPositions = [
    "top-right",
    "top-left",
    "bottom-right",
    "bottom-left"
  ];

  let panelPosition = localStorage.getItem(POSITION_KEY) || "bottom-left";

  if (!validPositions.includes(panelPosition)) {
    panelPosition = "bottom-left";
  }

  // پنل در شروع بسته باشد
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

  // ============================================
  // موتور صدا
  // ============================================

  function setupAudio() {
    const AudioAPI = window.AudioContext || window.webkitAudioContext;

    if (!AudioAPI) return false;

    if (!audio) {
      audio = new AudioAPI();
      master = audio.createGain();
      master.connect(audio.destination);
    }

    if (audio.state === "suspended") {
      audio.resume();
    }

    master.gain.value = volume / 100;

    return true;
  }

  function tone(freq, duration, type, strength) {
    if (!audio || !master) return;

    const oscillator = audio.createOscillator();
    const gain = audio.createGain();

    oscillator.type = type || "sine";
    oscillator.frequency.value = freq;

    gain.gain.setValueAtTime(
      strength || 0.1,
      audio.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audio.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(master);

    oscillator.start();
    oscillator.stop(audio.currentTime + duration);
  }

  function playNote() {
    if (!enabled || !audio) return;

    const melody = tracks[track].notes;
    const frequency = melody[noteIndex % melody.length];

    noteIndex++;

    tone(frequency, 0.28, "triangle", 0.12);
  }

  function startMusic() {
    if (!enabled || timer) return;

    if (!setupAudio()) {
      status.textContent = "مرورگر از موسیقی پشتیبانی نمی‌کند.";
      return;
    }

    noteIndex = 0;
    playNote();

    timer = setInterval(playNote, 420);

    status.textContent = "🎵 موسیقی در حال پخش است";
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

  function correctSound() {
    if (!enabled || !setupAudio()) return;

    tone(659, 0.14, "sine", 0.16);

    setTimeout(function() {
      tone(784, 0.18, "sine", 0.16);
    }, 130);

    setTimeout(function() {
      tone(988, 0.22, "sine", 0.16);
    }, 260);
  }

  function wrongSound() {
    if (!enabled || !setupAudio()) return;

    tone(240, 0.2, "triangle", 0.12);

    setTimeout(function() {
      tone(190, 0.2, "triangle", 0.10);
    }, 150);
  }

  // ============================================
  // ساخت پنل موسیقی
  // ============================================

  const panel = document.createElement("section");

  panel.id = "andishaMusicStudio";
  panel.dir = "rtl";

  panel.style.cssText = `
    position:fixed;
    z-index:99999;
    width:min(300px,calc(100% - 16px));
    max-height:min(60vh,420px);
    overflow-y:auto;
    -webkit-overflow-scrolling:touch;
    box-sizing:border-box;
    padding:12px;
    border:2px solid #f5c75e;
    border-radius:16px;
    background:#142b52;
    color:white;
    font-family:Tahoma,sans-serif;
    font-size:13px;
    box-shadow:0 5px 20px #0005;
    text-align:center;
    display:none;
    overscroll-behavior:contain;
  `;

  panel.innerHTML = `
    <div style="
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:8px;
      margin-bottom:10px;
    ">
      <h3 style="margin:4px 0;color:#ffe18a;font-size:15px">
        🎵 استودیوی موسیقی اندیشا
      </h3>

      <button id="andishaMusicCollapse"
        type="button"
        aria-label="جمع کردن پنل"
        style="
          padding:7px 10px;
          border:0;
          border-radius:8px;
          background:#f5c75e;
          color:#142b52;
          font-weight:bold;
          cursor:pointer;
        ">
        ✕
      </button>
    </div>

    <label for="andishaMusicPosition"
      style="display:block;margin:8px 0 5px">
      📍 موقعیت پنل
    </label>

    <select id="andishaMusicPosition"
      aria-label="انتخاب موقعیت پنل"
      style="
        width:100%;
        padding:9px;
        margin:3px 0 10px;
        border-radius:9px;
        box-sizing:border-box;
        font-family:Tahoma,sans-serif;
      ">
      <option value="top-right">بالا سمت راست</option>
      <option value="top-left">بالا سمت چپ</option>
      <option value="bottom-right">پایین سمت راست</option>
      <option value="bottom-left">پایین سمت چپ</option>
    </select>

    <button id="andishaMusicToggle" type="button">
      ${enabled ? "🔇 خاموش کردن موسیقی" : "🎶 روشن کردن موسیقی"}
    </button>

    <select id="andishaTrack"
      aria-label="انتخاب موسیقی"
      style="
        width:100%;
        padding:9px;
        margin:8px 0;
        border-radius:9px;
        box-sizing:border-box;
      ">
      ${tracks.map((item, index) => `
        <option value="${index}">${item.name}</option>
      `).join("")}
    </select>

    <label for="andishaVolume">🔊 میزان صدا</label>

    <input id="andishaVolume"
      type="range"
      min="0"
      max="100"
      value="${volume}"
      style="width:100%;margin:8px 0">

    <hr style="border-color:#ffffff33">

    <h3 style="color:#ffe18a">🎧 موسیقی دلخواه من</h3>

    <input id="andishaMusicFile"
      type="file"
      accept="audio/*"
      style="max-width:100%;color:white">

    <audio id="andishaPhonePlayer"
      controls
      style="width:100%;margin-top:8px"></audio>

    <p id="andishaPhoneMessage">
      هنوز آهنگی انتخاب نشده است.
    </p>

    <hr style="border-color:#ffffff33">

    <h3 style="color:#ffe18a">🎙️ راهنمای صوتی قهرمان</h3>

    <button id="andishaRead" type="button">
      🔊 خواندن راهنمای این صفحه
    </button>

    <button id="andishaStop" type="button">
      ⏹ توقف صدا
    </button>

    <p id="andishaVoiceStatus">
      راهنمای صوتی آماده است.
    </p>

    <p id="andishaMusicStatus">
      موسیقی پس‌زمینه بازی
    </p>
  `;

  // ============================================
  // دکمه شناور موسیقی
  // ============================================

  const bubble = document.createElement("button");

  bubble.id = "andishaMusicBubble";
  bubble.type = "button";
  bubble.textContent = "🎵";
  bubble.title = "باز کردن استودیوی موسیقی";
  bubble.setAttribute("aria-label", "باز کردن استودیوی موسیقی");

  bubble.style.cssText = `
    position:fixed;
    z-index:99999;
    width:48px;
    height:48px;
    padding:0;
    border:2px solid #f5c75e;
    border-radius:50%;
    background:#142b52;
    color:#ffe18a;
    font-size:23px;
    line-height:1;
    box-shadow:0 4px 14px #0005;
    cursor:pointer;
    display:flex;
    align-items:center;
    justify-content:center;
    -webkit-tap-highlight-color:transparent;
  `;

  document.body.appendChild(panel);
  document.body.appendChild(bubble);

  // ============================================
  // تنظیم موقعیت پنل و دکمه شناور
  // ============================================

  function applyPosition(pos) {
    if (!validPositions.includes(pos)) {
      pos = "bottom-left";
    }

    panelPosition = pos;

    // پاک کردن موقعیت‌های قبلی
    panel.style.top = "auto";
    panel.style.bottom = "auto";
    panel.style.left = "auto";
    panel.style.right = "auto";

    bubble.style.top = "auto";
    bubble.style.bottom = "auto";
    bubble.style.left = "auto";
    bubble.style.right = "auto";

    // فاصله امن از لبه‌های صفحه
    if (pos === "top-right") {
      panel.style.top = "max(10px, env(safe-area-inset-top))";
      panel.style.right = "8px";

      bubble.style.top = "max(10px, env(safe-area-inset-top))";
      bubble.style.right = "8px";
    }

    if (pos === "top-left") {
      panel.style.top = "max(10px, env(safe-area-inset-top))";
      panel.style.left = "8px";

      bubble.style.top = "max(10px, env(safe-area-inset-top))";
      bubble.style.left = "8px";
    }

    if (pos === "bottom-right") {
      panel.style.bottom = "max(72px, calc(env(safe-area-inset-bottom) + 64px))";
      panel.style.right = "8px";

      bubble.style.bottom = "max(10px, env(safe-area-inset-bottom))";
      bubble.style.right = "8px";
    }

    if (pos === "bottom-left") {
      panel.style.bottom = "max(72px, calc(env(safe-area-inset-bottom) + 64px))";
      panel.style.left = "8px";

      bubble.style.bottom = "max(10px, env(safe-area-inset-bottom))";
      bubble.style.left = "8px";
    }

    try {
      localStorage.setItem(POSITION_KEY, pos);
    } catch (error) {
      console.warn("ذخیره موقعیت پنل انجام نشد:", error);
    }
  }

  // ============================================
  // باز و بسته کردن پنل
  // ============================================

  function openPanel() {
    panelOpen = true;
    panel.style.display = "block";
    bubble.style.display = "none";
  }

  function closePanel() {
    panelOpen = false;
    panel.style.display = "none";
    bubble.style.display = "flex";
  }

  bubble.addEventListener("click", function() {
    openPanel();
  });

  document.getElementById("andishaMusicCollapse")
    .addEventListener("click", function() {
      closePanel();
    });

  // ============================================
  // دریافت عناصر پنل
  // ============================================

  const toggle = document.getElementById("andishaMusicToggle");
  const selector = document.getElementById("andishaTrack");
  const slider = document.getElementById("andishaVolume");
  const positionSelector = document.getElementById("andishaMusicPosition");

  const status = document.getElementById("andishaMusicStatus");

  const picker = document.getElementById("andishaMusicFile");
  const player = document.getElementById("andishaPhonePlayer");
  const phoneMessage = document.getElementById("andishaPhoneMessage");

  const voiceStatus = document.getElementById("andishaVoiceStatus");

  // ظاهر دکمه‌های پنل
  panel.querySelectorAll("button").forEach(function(button) {
    if (button.id === "andishaMusicCollapse") return;

    button.style.cssText += `
      padding:9px 12px;
      margin:4px;
      border:0;
      border-radius:9px;
      background:#f5c75e;
      color:#142b52;
      font-weight:bold;
      font-family:Tahoma,sans-serif;
      cursor:pointer;
      min-height:40px;
    `;
  });

  selector.value = String(track);
  positionSelector.value = panelPosition;

  // اعمال موقعیت ذخیره‌شده
  applyPosition(panelPosition);

  // شروع در حالت بسته
  closePanel();

  // ============================================
  // روشن و خاموش کردن موسیقی
  // ============================================

  toggle.addEventListener("click", function() {
    enabled = !enabled;

    localStorage.setItem(MUSIC_KEY, String(enabled));
    localStorage.setItem("andishaMusicEnabled", String(enabled));

    toggle.textContent = enabled
      ? "🔇 خاموش کردن موسیقی"
      : "🎶 روشن کردن موسیقی";

    if (enabled) {
      startMusic();
    } else {
      stopMusic();
    }
  });

  // ============================================
  // انتخاب موسیقی
  // ============================================

  selector.addEventListener("change", function() {
    track = Number(selector.value);

    localStorage.setItem(TRACK_KEY, String(track));

    localStorage.setItem(
      "andishaMusicTrack",
      ["calm", "happy", "adventure"][track]
    );

    if (enabled) {
      stopMusic();
      startMusic();
    }
  });

  // ============================================
  // کنترل صدا
  // ============================================

  slider.addEventListener("input", function() {
    volume = Number(slider.value);

    localStorage.setItem(VOLUME_KEY, String(volume));

    if (master) {
      master.gain.value = volume / 100;
    }
  });

  // ============================================
  // انتخاب موقعیت پنل
  // ============================================

  positionSelector.addEventListener("change", function() {
    applyPosition(positionSelector.value);
  });

  // ============================================
  // انتخاب آهنگ از گوشی
  // ============================================

  picker.addEventListener("change", function() {
    const file = picker.files[0];

    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      phoneMessage.textContent = "لطفاً فایل صوتی انتخاب کن.";
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

  // هنگام پخش آهنگ شخصی، موسیقی داخلی متوقف شود
  player.addEventListener("play", stopMusic);

  player.addEventListener("ended", function() {
    if (enabled) startMusic();
  });

  // ============================================
  // خواندن متن صفحه
  // ============================================

  document.getElementById("andishaRead")
    .addEventListener("click", function() {

      if (!("speechSynthesis" in window)) {
        voiceStatus.textContent =
          "مرورگر از راهنمای صوتی پشتیبانی نمی‌کند.";
        return;
      }

      window.speechSynthesis.cancel();

      const main = document.querySelector("#app main");

      if (!main) {
        voiceStatus.textContent =
          "صفحه‌ای برای خواندن پیدا نشد.";
        return;
      }

      const parts = main.querySelectorAll(
        "h1,h2,h3,p,.shop-options button"
      );

      const message = Array.from(parts)
        .map(function(element) {
          return element.innerText.trim();
        })
        .filter(Boolean)
        .join(". ");

      if (!message) {
        voiceStatus.textContent =
          "متنی برای خواندن در این صفحه وجود ندارد.";
        return;
      }

      const speech = new SpeechSynthesisUtterance(message);

      speech.lang = "fa-IR";
      speech.rate = 0.88;
      speech.pitch = 1;

      speech.onstart = function() {
        voiceStatus.textContent = "🔊 در حال خواندن...";
      };

      speech.onend = function() {
        voiceStatus.textContent = "خواندن تمام شد 🌟";
      };

      speech.onerror = function() {
        voiceStatus.textContent =
          "صدای فارسی گوشی را بررسی کن.";
      };

      window.speechSynthesis.speak(speech);
    });

  // ============================================
  // توقف راهنمای صوتی
  // ============================================

  document.getElementById("andishaStop")
    .addEventListener("click", function() {

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      voiceStatus.textContent = "صدا متوقف شد.";
    });

  // با کلیک روی بازی، خواندن قبلی متوقف شود
  app.addEventListener("click", function() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  });

  // ============================================
  // صدای پاسخ صحیح و اشتباه
  // ============================================

  document.addEventListener("click", function(event) {
    const target = event.target;

    if (!target || typeof target.closest !== "function") return;

    const button = target.closest("#app button[data-action]");

    if (!button || button.disabled) return;

    const action = button.dataset.action;
    const answer = Number(button.dataset.answer);

    let expected = null;

    if (action === "shop-answer") expected = 150000;
    if (action === "kitchen-answer") expected = 4;
    if (action === "bank-answer") expected = 50000;
    if (action === "map-answer") expected = 14;

    if (action === "tower-answer") {
      expected = towerQuestions[towerStep]?.answer ?? null;
    }

    if (expected !== null) {
      if (answer === expected) {
        correctSound();
      } else {
        wrongSound();
      }
    }

  }, true);

  // وضعیت دکمه موسیقی
  toggle.textContent = enabled
    ? "🔇 خاموش کردن موسیقی"
    : "🎶 روشن کردن موسیقی";

  // ============================================
  // پاک‌سازی هنگام خروج
  // ============================================

  window.addEventListener("beforeunload", function() {
    stopMusic();

    if (phoneURL) {
      URL.revokeObjectURL(phoneURL);
    }
  });

})();
