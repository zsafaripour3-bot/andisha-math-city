
const app = document.getElementById("app");

if (!app) {
  document.body.innerHTML = "<h2>خطا: بخش اصلی بازی پیدا نشد.</h2>";
  throw new Error("Andisha app not found");
}

// ===============================
// اطلاعات و ذخیره پیشرفت بازی
// ===============================

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

const zones = [
  { icon: "🛍️", name: "فروشگاه هوشمند", mission: "تخفیف و قیمت نهایی", color: "#e7a23b" },
  { icon: "🍰", name: "آشپزخانه مرکزی", mission: "تناسب در دستور غذا", color: "#e77b9c" },
  { icon: "🏦", name: "بانک اندیشا", mission: "درصد و سود ساده", color: "#43b9a0" },
  { icon: "📐", name: "کارگاه نقشه‌سازی", mission: "مقیاس و تناسب", color: "#6499e8" },
  { icon: "🏆", name: "برج هوشمند", mission: "چالش نهایی ریاضی", color: "#a78ae8" }
];

function saveProgress() {
  localStorage.setItem("andishaScore", String(score));
  localStorage.setItem("andishaShopCompleted", String(shopCompleted));
  localStorage.setItem("andishaKitchenCompleted", String(kitchenCompleted));
  localStorage.setItem("andishaBankCompleted", String(bankCompleted));
  localStorage.setItem("andishaMapCompleted", String(mapCompleted));
  localStorage.setItem("andishaTowerCompleted", String(towerCompleted));
}

function loadProgress() {
  score = Number(localStorage.getItem("andishaScore")) || 0;
  shopCompleted = localStorage.getItem("andishaShopCompleted") === "true";
  kitchenCompleted = localStorage.getItem("andishaKitchenCompleted") === "true";
  bankCompleted = localStorage.getItem("andishaBankCompleted") === "true";
  mapCompleted = localStorage.getItem("andishaMapCompleted") === "true";
  towerCompleted = localStorage.getItem("andishaTowerCompleted") === "true";
}

// ===============================
// صفحه شروع و داستان
// ===============================

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

// ===============================
// نقشه شهرک
// ===============================

function showCity() {
  loadProgress();

  app.innerHTML = `
    <main dir="rtl">
      <h1>🏙️ شهرک هوشمند اندیشا</h1>
      <h2>نقشه مأموریت قهرمان</h2>
      <h3>⭐ امتیاز تو: ${score}</h3>

      <p>🛍️ فروشگاه: ${shopCompleted ? "تکمیل شده 🎉" : "در انتظار قهرمان"}</p>
      <p>🍰 آشپزخانه: ${kitchenCompleted ? "تکمیل شده 🎉" : "در انتظار قهرمان"}</p>
      <p>🏦 بانک: ${bankCompleted ? "تکمیل شده 🎉" : "در انتظار قهرمان"}</p>
      <p>📐 نقشه‌سازی: ${mapCompleted ? "تکمیل شده 🎉" : "در انتظار قهرمان"}</p>
      <p>🏆 برج هوشمند: ${towerCompleted ? "تکمیل شده 🎉" : "در انتظار قهرمان"}</p>

      <section class="city-map">
        ${zones.map((zone, i) => `
          <article class="building" style="border-top:7px solid ${zone.color}">
            <div class="building-icon">${zone.icon}</div>
            <h2>${zone.name}</h2>
            <p>${zone.mission}</p>
            <button data-action="zone" data-zone="${i}">
              ورود به منطقه 🚀
            </button>
          </article>
        `).join("")}
      </section>
    </main>
  `;
}

// ===============================
// مأموریت اول: فروشگاه
// ===============================

function showShop() {
  loadProgress();
  shopAttempts = 0;

  if (shopCompleted) {
    app.innerHTML = `
      <main dir="rtl">
        <h1>🛍️ فروشگاه هوشمند</h1>
        <h2>🎉 مأموریت تکمیل شده است!</h2>
        <p>⭐ مجموع امتیاز: ${score}</p>
        <button data-action="city">بازگشت به شهرک 🏙️</button>
      </main>
    `;
    return;
  }

  app.innerHTML = `
    <main dir="rtl">
      <h1>🛍️ فروشگاه هوشمند اندیشا</h1>
      <h2>مأموریت اول: شکار تخفیف!</h2>
      <p>قیمت اولیه کیف: <strong>۲۰۰٬۰۰۰ تومان</strong></p>
      <p>تخفیف فروشگاه: <strong>۲۵ درصد</strong></p>
      <h3>قیمت نهایی کیف چقدر است؟</h3>

      <div class="shop-options">
        <button data-action="shop-answer" data-answer="150000">۱۵۰٬۰۰۰ تومان</button>
        <button data-action="shop-answer" data-answer="175000">۱۷۵٬۰۰۰ تومان</button>
        <button data-action="shop-answer" data-answer="125000">۱۲۵٬۰۰۰ تومان</button>
      </div>

      <p id="feedback">یکی از پاسخ‌ها را انتخاب کن.</p>
      <p id="score">⭐ امتیاز: ${score}</p>
      <button data-action="city">بازگشت به شهرک 🏙️</button>
    </main>
  `;
}

function checkShopAnswer(answer) {
  loadProgress();
  if (shopCompleted) return showShop();

  const feedback = document.getElementById("feedback");
  const scoreElement = document.getElementById("score");

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

    app.querySelectorAll('[data-action="shop-answer"]').forEach(b => b.disabled = true);
  } else {
    shopAttempts++;
    feedback.innerHTML = shopAttempts === 1
      ? "🌱 یک بار دیگر فکر کن!<p>۲۵ درصد یعنی یک‌چهارم قیمت کالا.</p>"
      : "🤖 اندی: ۲۰۰٬۰۰۰ ÷ ۴ = ۵۰٬۰۰۰ تومان تخفیف؛ آن را از قیمت کم کن.";
  }
}

// ===============================
// مأموریت دوم: آشپزخانه
// ===============================

function showKitchen() {
  loadProgress();
  kitchenAttempts = 0;

  if (kitchenCompleted) {
    app.innerHTML = `
      <main dir="rtl">
        <h1>🍰 آشپزخانه مرکزی</h1>
        <h2>🎉 مأموریت تکمیل شده است!</h2>
        <p>⭐ مجموع امتیاز: ${score}</p>
        <button data-action="city">بازگشت به شهرک 🏙️</button>
      </main>
    `;
    return;
  }

  app.innerHTML = `
    <main dir="rtl">
      <h1>🍰 آشپزخانه مرکزی اندیشا</h1>
      <h2>مأموریت دوم: دستور پخت قهرمانانه!</h2>
      <p>برای ۴ نفر به ۲ پیمانه آرد نیاز داریم.</p>
      <h3>برای ۸ نفر چند پیمانه آرد لازم داریم؟</h3>

      <div class="shop-options">
        <button data-action="kitchen-answer" data-answer="3">۳ پیمانه</button>
        <button data-action="kitchen-answer" data-answer="4">۴ پیمانه</button>
        <button data-action="kitchen-answer" data-answer="6">۶ پیمانه</button>
      </div>

      <p id="kitchen-feedback">پاسخ درست را انتخاب کن قهرمان!</p>
      <p id="kitchen-score">⭐ امتیاز: ${score}</p>
      <button data-action="city">بازگشت به شهرک 🏙️</button>
    </main>
  `;
}

function checkKitchenAnswer(answer) {
  loadProgress();
  if (kitchenCompleted) return showKitchen();

  const feedback = document.getElementById("kitchen-feedback");
  const scoreElement = document.getElementById("kitchen-score");

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

    app.querySelectorAll('[data-action="kitchen-answer"]').forEach(b => b.disabled = true);
  } else {
    kitchenAttempts++;
    feedback.innerHTML = kitchenAttempts === 1
      ? "🌱 دوباره فکر کن! تعداد مهمان‌ها دو برابر شده است."
      : "🤖 اندی: برای ۸ نفر، ۲ × ۲ = ۴ پیمانه آرد لازم داریم.";
  }
}

// ===============================
// مأموریت سوم: بانک
// ===============================

function showBank() {
  loadProgress();
  bankAttempts = 0;

  if (bankCompleted) {
    app.innerHTML = `
      <main dir="rtl">
        <h1>🏦 بانک اندیشا</h1>
        <h2>🎉 مأموریت تکمیل شده است!</h2>
        <p>⭐ مجموع امتیاز: ${score}</p>
        <button data-action="city">بازگشت به شهرک 🏙️</button>
      </main>
    `;
    return;
  }

  app.innerHTML = `
    <main dir="rtl">
      <h1>🏦 بانک اندیشا</h1>
      <h2>مأموریت سوم: راز درصد!</h2>
      <p>مبلغ سپرده فرضی: <strong>۵۰۰٬۰۰۰ تومان</strong></p>
      <p>درصد پاداش: <strong>۱۰ درصد</strong></p>
      <h3>مقدار پاداش چند تومان می‌شود؟</h3>

      <div class="shop-options">
        <button data-action="bank-answer" data-answer="50000">۵۰٬۰۰۰ تومان</button>
        <button data-action="bank-answer" data-answer="100000">۱۰۰٬۰۰۰ تومان</button>
        <button data-action="bank-answer" data-answer="25000">۲۵٬۰۰۰ تومان</button>
      </div>

      <p id="bank-feedback">با دقت فکر کن و پاسخ را انتخاب کن.</p>
      <p id="bank-score">⭐ امتیاز: ${score}</p>
      <button data-action="city">بازگشت به شهرک 🏙️</button>
    </main>
  `;
}

function checkBankAnswer(answer) {
  loadProgress();
  if (bankCompleted) return showBank();

  const feedback = document.getElementById("bank-feedback");
  const scoreElement = document.getElementById("bank-score");

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

    app.querySelectorAll('[data-action="bank-answer"]').forEach(b => b.disabled = true);
  } else {
    bankAttempts++;
    feedback.innerHTML = bankAttempts === 1
      ? "🌱 راهنمایی اندی: ۱۰ درصد یعنی یک‌دهم مبلغ."
      : "🤖 اندی: ۵۰۰٬۰۰۰ را بر ۱۰ تقسیم می‌کنیم؛ جواب ۵۰٬۰۰۰ است.";
  }
}

// ===============================
// مأموریت چهارم: نقشه‌سازی
// ===============================

function showMapWorkshop() {
  loadProgress();
  mapAttempts = 0;

  if (mapCompleted) {
    app.innerHTML = `
      <main dir="rtl">
        <h1>📐 کارگاه نقشه‌سازی</h1>
        <h2>🎉 نقشه شهرک تکمیل شد!</h2>
        <p>⭐ مجموع امتیاز: ${score}</p>
        <button data-action="city">بازگشت به شهرک 🏙️</button>
      </main>
    `;
    return;
  }

  app.innerHTML = `
    <main dir="rtl">
      <h1>📐 کارگاه نقشه‌سازی اندیشا</h1>
      <h2>مأموریت چهارم: طراح شهرک باش!</h2>
      <p>هر ۱ سانتی‌متر روی نقشه برابر با ۲ متر در واقعیت است.</p>
      <p>📏 فاصله مدرسه تا پارک روی نقشه: <strong>۷ سانتی‌متر</strong></p>
      <h3>فاصله واقعی مدرسه تا پارک چند متر است؟</h3>

      <div class="shop-options">
        <button data-action="map-answer" data-answer="12">۱۲ متر</button>
        <button data-action="map-answer" data-answer="14">۱۴ متر</button>
        <button data-action="map-answer" data-answer="16">۱۶ متر</button>
      </div>

      <p id="map-feedback">پاسخ را انتخاب کن، مهندس کوچک!</p>
      <p id="map-score">⭐ امتیاز: ${score}</p>
      <button data-action="city">بازگشت به شهرک 🏙️</button>
    </main>
  `;
}

function checkMapAnswer(answer) {
  loadProgress();
  if (mapCompleted) return showMapWorkshop();

  const feedback = document.getElementById("map-feedback");
  const scoreElement = document.getElementById("map-score");

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

    app.querySelectorAll('[data-action="map-answer"]').forEach(b => b.disabled = true);
  } else {
    mapAttempts++;
    feedback.innerHTML = mapAttempts === 1
      ? "🌱 هر سانتی‌متر برابر ۲ متر است. پس ۷ را در ۲ ضرب کن."
      : "🤖 اندی: ۷ × ۲ = ۱۴ متر.";
  }
}

// ===============================
// مأموریت پنجم: برج هوشمند
// ===============================

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
        <h2>🎉 تو قهرمان شهرک شدی!</h2>
        <p>⭐ امتیاز نهایی: ${score}</p>
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

  app.innerHTML = `
    <main dir="rtl">
      <h1>🏆 برج هوشمند اندیشا</h1>
      <h2>مأموریت نهایی: چهار قفل قهرمانی</h2>
      <h3>${q.title}</h3>
      <p>🔐 قفل ${towerStep + 1} از ۴</p>
      <p>${q.question}</p>

      <div class="shop-options">
        ${q.options.map(option => `
          <button data-action="tower-answer" data-answer="${option.value}">
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
  if (towerCompleted) return showTower();

  const q = towerQuestions[towerStep];
  const feedback = document.getElementById("tower-feedback");

  if (answer === q.answer) {
    towerStep++;

    if (towerStep === 4) {
      towerCompleted = true;
      score += 10;
      saveProgress();

      app.innerHTML = `
        <main dir="rtl">
          <h1>🏆 برج هوشمند اندیشا</h1>
          <h2>🎉🎉 چهار قفل باز شد!</h2>
          <h2>🥇 تو قهرمان شهرک اندیشا هستی!</h2>
          <p>⭐ امتیاز نهایی: ${score}</p>
          <p>🛍️ فروشگاه: تکمیل</p>
          <p>🍰 آشپزخانه: تکمیل</p>
          <p>🏦 بانک: تکمیل</p>
          <p>📐 نقشه‌سازی: تکمیل</p>
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

// ===============================
// مدیریت کلیک‌های بازی
// ===============================

app.addEventListener("click", function(event) {
  const button = event.target.closest("button");
  if (!button || !app.contains(button) || button.disabled) return;

  const action = button.dataset.action;
  if (!action) return;

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
});

showWelcome();

// ===============================
// 🎵🎧🎙️ استودیوی یکپارچه اندیشا
// ===============================

(function () {
  "use strict";

  if (window.__andishaUnifiedStudio) return;
  window.__andishaUnifiedStudio = true;

  const MUSIC_KEY = "andishaMusic";
  const TRACK_KEY = "andishaTrack";
  const VOLUME_KEY = "andishaVolume";

  const oldEnabled = localStorage.getItem(MUSIC_KEY);
  const oldEnabledV2 = localStorage.getItem("andishaMusicEnabled");

  let enabled = oldEnabled !== null
    ? oldEnabled === "true"
    : oldEnabledV2 === "true";

  let track = Number(localStorage.getItem(TRACK_KEY)) || 0;
  let volume = Number(localStorage.getItem(VOLUME_KEY) || 35);

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

  function setupAudio() {
    const AudioAPI = window.AudioContext || window.webkitAudioContext;
    if (!AudioAPI) return false;

    if (!audio) {
      audio = new AudioAPI();
      master = audio.createGain();
      master.connect(audio.destination);
    }

    if (audio.state === "suspended") audio.resume();

    master.gain.value = volume / 100;
    return true;
  }

  function tone(freq, duration, type, strength) {
    if (!audio || !master) return;

    const osc = audio.createOscillator();
    const gain = audio.createGain();

    osc.type = type || "sine";
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(strength || 0.1, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audio.currentTime + duration
    );

    osc.connect(gain);
    gain.connect(master);

    osc.start();
    osc.stop(audio.currentTime + duration);
  }

  function playNote() {
    if (!enabled || !audio) return;

    const melody = tracks[track].notes;
    const freq = melody[noteIndex % melody.length];

    noteIndex++;
    tone(freq, 0.28, "triangle", 0.12);
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
    if (timer) clearInterval(timer);
    timer = null;
    status.textContent = "موسیقی متوقف شد.";
  }

  function correctSound() {
    if (!enabled || !setupAudio()) return;

    tone(659, 0.14, "sine", 0.16);
    setTimeout(() => tone(784, 0.18, "sine", 0.16), 130);
    setTimeout(() => tone(988, 0.22, "sine", 0.16), 260);
  }

  function wrongSound() {
    if (!enabled || !setupAudio()) return;

    tone(240, 0.2, "triangle", 0.12);
    setTimeout(() => tone(190, 0.2, "triangle", 0.10), 150);
  }

  const panel = document.createElement("section");
  panel.id = "andishaMusicStudio";
  panel.dir = "rtl";

  panel.style.cssText = `
    position:fixed;
    left:10px;
    bottom:10px;
    z-index:99999;
    width:min(320px,calc(100% - 20px));
    max-height:45vh;
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
  `;

  panel.innerHTML = `
    <h3 style="margin:4px 0 12px;color:#ffe18a">
      🎵 استودیوی موسیقی اندیشا
    </h3>

    <button id="andishaMusicToggle" type="button">
      ${enabled ? "🔇 خاموش کردن موسیقی" : "🎶 روشن کردن موسیقی"}
    </button>

    <select id="andishaTrack" aria-label="انتخاب موسیقی"
      style="width:100%;padding:9px;margin:8px 0;border-radius:9px">
      ${tracks.map((t, i) =>
        `<option value="${i}">${t.name}</option>`
      ).join("")}
    </select>

    <label for="andishaVolume">🔊 میزان صدا</label>
    <input id="andishaVolume" type="range"
      min="0" max="100" value="${volume}" style="width:100%">

    <hr style="border-color:#ffffff33">

    <h3 style="color:#ffe18a">🎧 موسیقی دلخواه من</h3>
    <input id="andishaMusicFile" type="file"
      accept="audio/*" style="max-width:100%;color:white">

    <audio id="andishaPhonePlayer" controls
      style="width:100%;margin-top:8px"></audio>

    <p id="andishaPhoneMessage">هنوز آهنگی انتخاب نشده است.</p>

    <hr style="border-color:#ffffff33">

    <h3 style="color:#ffe18a">🎙️ راهنمای صوتی قهرمان</h3>

    <button id="andishaRead" type="button">
      🔊 خواندن راهنمای این صفحه
    </button>

    <button id="andishaStop" type="button">
      ⏹ توقف صدا
    </button>

    <p id="andishaVoiceStatus">راهنمای صوتی آماده است.</p>
    <p id="andishaMusicStatus">موسیقی پس‌زمینه بازی</p>
  `;

  document.body.appendChild(panel);

  panel.querySelectorAll("button").forEach(button => {
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

  const toggle = document.getElementById("andishaMusicToggle");
  const selector = document.getElementById("andishaTrack");
  const slider = document.getElementById("andishaVolume");
  const status = document.getElementById("andishaMusicStatus");

  const picker = document.getElementById("andishaMusicFile");
  const player = document.getElementById("andishaPhonePlayer");
  const phoneMessage = document.getElementById("andishaPhoneMessage");

  const voiceStatus = document.getElementById("andishaVoiceStatus");

  selector.value = String(track);

  toggle.addEventListener("click", function () {
    enabled = !enabled;

    localStorage.setItem(MUSIC_KEY, String(enabled));
    localStorage.setItem("andishaMusicEnabled", String(enabled));

    toggle.textContent = enabled
      ? "🔇 خاموش کردن موسیقی"
      : "🎶 روشن کردن موسیقی";

    if (enabled) startMusic();
    else stopMusic();
  });

  selector.addEventListener("change", function () {
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

  slider.addEventListener("input", function () {
    volume = Number(slider.value);
    localStorage.setItem(VOLUME_KEY, String(volume));

    if (master) master.gain.value = volume / 100;
  });

  picker.addEventListener("change", function () {
    const file = picker.files[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      phoneMessage.textContent = "لطفاً فایل صوتی انتخاب کن.";
      return;
    }

    if (phoneURL) URL.revokeObjectURL(phoneURL);

    phoneURL = URL.createObjectURL(file);
    player.src = phoneURL;
    player.load();

    phoneMessage.textContent = "🎵 آهنگ انتخاب شد؛ دکمه پخش را بزن!";
  });

  player.addEventListener("play", stopMusic);

  document.getElementById("andishaRead").addEventListener("click", function () {
    if (!("speechSynthesis" in window)) {
      voiceStatus.textContent = "مرورگر از راهنمای صوتی پشتیبانی نمی‌کند.";
      return;
    }

    window.speechSynthesis.cancel();

    const main = document.querySelector("#app main");

    if (!main) {
      voiceStatus.textContent = "صفحه‌ای برای خواندن پیدا نشد.";
      return;
    }

    const parts = main.querySelectorAll("h1,h2,h3,p,.shop-options button");

    const message = Array.from(parts)
      .map(el => el.innerText.trim())
      .filter(Boolean)
      .join(". ");

    if (!message) {
      voiceStatus.textContent = "متنی برای خواندن در این صفحه وجود ندارد.";
      return;
    }

    const speech = new SpeechSynthesisUtterance(message);

    speech.lang = "fa-IR";
    speech.rate = 0.88;
    speech.pitch = 1;

    speech.onstart = () => {
      voiceStatus.textContent = "🔊 در حال خواندن...";
    };

    speech.onend = () => {
      voiceStatus.textContent = "خواندن تمام شد 🌟";
    };

    speech.onerror = () => {
      voiceStatus.textContent = "صدای فارسی گوشی را بررسی کن.";
    };

    window.speechSynthesis.speak(speech);
  });

  document.getElementById("andishaStop").addEventListener("click", function () {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    voiceStatus.textContent = "صدا متوقف شد.";
  });

  app.addEventListener("click", function () {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  });

  document.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button || !button.dataset.action) return;

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
      if (answer === expected) correctSound();
      else wrongSound();
    }
  }, true);

  if (enabled) {
    toggle.textContent = "🔇 خاموش کردن موسیقی";
  }
})();
