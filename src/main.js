
const app = document.getElementById("app");

if (!app) {
  document.body.innerHTML = "<h2>خطا: بخش اصلی بازی پیدا نشد.</h2>";
  throw new Error("Andisha app element not found");
}

// اطلاعات بازی
let score = Number(localStorage.getItem("andishaScore")) || 0;
let shopCompleted =
  localStorage.getItem("andishaShopCompleted") === "true";
let attempts = 0;

const zones = [
  { icon: "🛍️", name: "فروشگاه هوشمند", mission: "تخفیف و قیمت نهایی", color: "#e7a23b" },
  { icon: "🍰", name: "آشپزخانه مرکزی", mission: "تناسب در دستور غذا", color: "#e77b9c" },
  { icon: "🏦", name: "بانک اندیشا", mission: "درصد و سود ساده", color: "#43b9a0" },
  { icon: "📐", name: "کارگاه نقشه‌سازی", mission: "مقیاس و تناسب", color: "#6499e8" },
  { icon: "🏆", name: "برج هوشمند", mission: "چالش نهایی ریاضی", color: "#a78ae8" }
];

function loadProgress() {
  score = Number(localStorage.getItem("andishaScore")) || 0;
  shopCompleted =
    localStorage.getItem("andishaShopCompleted") === "true";
}

function saveProgress() {
  localStorage.setItem("andishaScore", String(score));
  localStorage.setItem("andishaShopCompleted", String(shopCompleted));
}

// صفحه خوشامدگویی
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

// داستان بازی
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

// نقشه شهرک
function showCity() {
  loadProgress();

  app.innerHTML = `
    <main dir="rtl">
      <h1>🏙️ شهرک هوشمند اندیشا</h1>
      <h2>نقشه مأموریت قهرمان</h2>
      <p>⭐ امتیاز تو: ${score}</p>
      <p>🏅 وضعیت فروشگاه:
        ${shopCompleted ? "تکمیل شده 🎉" : "در انتظار قهرمان"}
      </p>

      <section class="city-map">
        ${zones.map((zone, i) => `
          <article class="building"
            style="border-top:7px solid ${zone.color}">
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

// فروشگاه
function showShop() {
  attempts = 0;
  loadProgress();

  if (shopCompleted) {
    app.innerHTML = `
      <main dir="rtl">
        <h1>🛍️ فروشگاه هوشمند اندیشا</h1>
        <h2>🎉 مأموریت اول تکمیل شده است!</h2>
        <p>آفرین قهرمان! تو فروشگاه را با موفقیت آباد کردی.</p>
        <p>🏅 امتیاز این مأموریت قبلاً ثبت شده است.</p>
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
      <p>🤖 اندی: قهرمان! یک کیف زیبا در فروشگاه داریم.</p>
      <p>قیمت اولیه کیف: <strong>۲۰۰٬۰۰۰ تومان</strong></p>
      <p>تخفیف فروشگاه: <strong>۲۵ درصد</strong></p>
      <h3>قیمت نهایی کیف چقدر است؟</h3>

      <div class="shop-options">
        <button data-action="answer" data-answer="150000">۱۵۰٬۰۰۰ تومان</button>
        <button data-action="answer" data-answer="175000">۱۷۵٬۰۰۰ تومان</button>
        <button data-action="answer" data-answer="125000">۱۲۵٬۰۰۰ تومان</button>
      </div>

      <p id="feedback">یکی از پاسخ‌ها را انتخاب کن.</p>
      <p id="score">⭐ امتیاز: ${score}</p>
      <button data-action="city">بازگشت به شهرک 🏙️</button>
    </main>
  `;
}

// بررسی پاسخ
function checkShopAnswer(answer) {
  loadProgress();

  if (shopCompleted) {
    showShop();
    return;
  }

  const feedback = document.getElementById("feedback");
  const scoreElement = document.getElementById("score");

  if (answer === 150000) {
    shopCompleted = true;
    score += 10;
    saveProgress();

    scoreElement.textContent = `⭐ امتیاز: ${score}`;

    feedback.innerHTML = `
      🎉 آفرین قهرمان! پاسخ درست است.
      <p>۲۵ درصدِ ۲۰۰٬۰۰۰ می‌شود ۵۰٬۰۰۰ تومان.</p>
      <p>۲۰۰٬۰۰۰ − ۵۰٬۰۰۰ = ۱۵۰٬۰۰۰ تومان</p>
      <h3>🏅 ۱۰ امتیاز گرفتی!</h3>
      <p>🌟 مأموریت فروشگاه با موفقیت تکمیل شد.</p>
    `;

    app.querySelectorAll('[data-action="answer"]').forEach(button => {
      button.disabled = true;
    });

  } else {
    attempts++;

    if (attempts === 1) {
      feedback.innerHTML = `
        🌱 یک بار دیگر فکر کن!
        <p>۲۵ درصد یعنی یک‌چهارم قیمت کالا.</p>
        <p>اول مقدار تخفیف را پیدا کن.</p>
      `;
    } else {
      feedback.innerHTML = `
        🤖 اندی: بیا با هم حل کنیم!
        <p>۲۰۰٬۰۰۰ ÷ ۴ = ۵۰٬۰۰۰ تومان تخفیف</p>
        <p>۲۰۰٬۰۰۰ − ۵۰٬۰۰۰ = ۱۵۰٬۰۰۰ تومان</p>
        <p>حالا پاسخ درست را انتخاب کن.</p>
      `;
    }
  }
}

// مناطق دیگر
function showComingSoon(index) {
  const zone = zones[index];

  app.innerHTML = `
    <main dir="rtl">
      <h1>${zone.icon} ${zone.name}</h1>
      <h2>🤖 اندی: به‌زودی این مأموریت فعال می‌شود!</h2>
      <p>${zone.mission}</p>
      <button data-action="city">بازگشت به نقشه 🏙️</button>
    </main>
  `;
}

// تنها مسیر مدیریت تمام کلیک‌ها
app.addEventListener("click", function(event) {
  const button = event.target.closest("button");

  if (!button || !app.contains(button) || button.disabled) {
    return;
  }

  const action = button.dataset.action;

  if (!action) return;

  event.preventDefault();
  event.stopPropagation();

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

      if (index === 0) {
        showShop();
      } else {
        showComingSoon(index);
      }
      break;
    }

    case "answer":
      checkShopAnswer(Number(button.dataset.answer));
      break;
  }
});

// شروع بازی
showWelcome();
