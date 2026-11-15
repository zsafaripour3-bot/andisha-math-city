
const app = document.getElementById("app");

if (!app) {
  document.body.innerHTML = "<h2>خطا: بخش اصلی بازی پیدا نشد.</h2>";
  throw new Error("Andisha app not found");
}

let score = Number(localStorage.getItem("andishaScore")) || 0;
let shopCompleted = localStorage.getItem("andishaShopCompleted") === "true";
let kitchenCompleted = localStorage.getItem("andishaKitchenCompleted") === "true";

let shopAttempts = 0;
let kitchenAttempts = 0;

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
}

function loadProgress() {
  score = Number(localStorage.getItem("andishaScore")) || 0;
  shopCompleted = localStorage.getItem("andishaShopCompleted") === "true";
  kitchenCompleted = localStorage.getItem("andishaKitchenCompleted") === "true";
}

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

function showCity() {
  loadProgress();

  app.innerHTML = `
    <main dir="rtl">
      <h1>🏙️ شهرک هوشمند اندیشا</h1>
      <h2>نقشه مأموریت قهرمان</h2>
      <p>⭐ امتیاز تو: ${score}</p>
      <p>🛍️ فروشگاه: ${shopCompleted ? "تکمیل شده 🎉" : "در انتظار قهرمان"}</p>
      <p>🍰 آشپزخانه: ${kitchenCompleted ? "تکمیل شده 🎉" : "در انتظار قهرمان"}</p>

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

function showShop() {
  shopAttempts = 0;
  loadProgress();

  if (shopCompleted) {
    app.innerHTML = `
      <main dir="rtl">
        <h1>🛍️ فروشگاه هوشمند اندیشا</h1>
        <h2>🎉 مأموریت تکمیل شده است!</h2>
        <p>آفرین قهرمان!</p>
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
      <p>🌟 مأموریت فروشگاه تکمیل شد.</p>
    `;

    app.querySelectorAll('[data-action="shop-answer"]').forEach(button => {
      button.disabled = true;
    });
  } else {
    shopAttempts++;

    feedback.innerHTML = shopAttempts === 1
      ? `🌱 یک بار دیگر فکر کن!<p>۲۵ درصد یعنی یک‌چهارم قیمت کالا.</p><p>اول مقدار تخفیف را پیدا کن.</p>`
      : `🤖 اندی: بیا با هم حل کنیم!<p>۲۰۰٬۰۰۰ ÷ ۴ = ۵۰٬۰۰۰ تومان تخفیف</p><p>۲۰۰٬۰۰۰ − ۵۰٬۰۰۰ = ۱۵۰٬۰۰۰ تومان</p><p>حالا دوباره انتخاب کن.</p>`;
  }
}

function showKitchen() {
  kitchenAttempts = 0;
  loadProgress();

  if (kitchenCompleted) {
    app.innerHTML = `
      <main dir="rtl">
        <h1>🍰 آشپزخانه مرکزی اندیشا</h1>
        <h2>🎉 مأموریت دوم تکمیل شده است!</h2>
        <p>آفرین قهرمان! تو آشپزخانه را آباد کردی.</p>
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

      <p>👧 آوا: قرار است برای مهمان‌های شهرک کیک درست کنیم!</p>
      <p>🤖 اندی: برای ۴ نفر به ۲ پیمانه آرد نیاز داریم.</p>

      <h3>اگر بخواهیم برای ۸ نفر کیک درست کنیم، چند پیمانه آرد لازم داریم؟</h3>

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

  if (kitchenCompleted) {
    showKitchen();
    return;
  }

  const feedback = document.getElementById("kitchen-feedback");
  const scoreElement = document.getElementById("kitchen-score");

  if (answer === 4) {
    kitchenCompleted = true;
    score += 10;
    saveProgress();

    scoreElement.textContent = `⭐ امتیاز: ${score}`;

    feedback.innerHTML = `
      🎉 آفرین قهرمان!
      <p>تعداد مهمان‌ها از ۴ نفر به ۸ نفر رسیده است؛ یعنی دو برابر شده.</p>
      <p>پس مقدار آرد هم دو برابر می‌شود:</p>
      <h3>۲ × ۲ = ۴ پیمانه آرد</h3>
      <h3>🏅 ۱۰ امتیاز گرفتی!</h3>
      <p>🍰 آشپزخانه با موفقیت آباد شد!</p>
    `;

    app.querySelectorAll('[data-action="kitchen-answer"]').forEach(button => {
      button.disabled = true;
    });
  } else {
    kitchenAttempts++;

    feedback.innerHTML = kitchenAttempts === 1
      ? `🌱 دوباره فکر کن!<p>تعداد مهمان‌ها دو برابر شده است.</p><p>مقدار آرد هم باید دو برابر شود.</p>`
      : `🤖 اندی: بیا با هم حساب کنیم!<p>برای ۴ نفر ۲ پیمانه آرد لازم داریم.</p><p>برای ۸ نفر: ۲ × ۲ = ۴ پیمانه</p><p>حالا پاسخ را انتخاب کن.</p>`;
  }
}

function showComingSoon(index) {
  const zone = zones[index];

  app.innerHTML = `
    <main dir="rtl">
      <h1>${zone.icon} ${zone.name}</h1>
      <h2>🤖 اندی: این مأموریت به‌زودی فعال می‌شود!</h2>
      <p>${zone.mission}</p>
      <button data-action="city">بازگشت به نقشه 🏙️</button>
    </main>
  `;
}

app.addEventListener("click", function(event) {
  const button = event.target.closest("button");

  if (!button || !app.contains(button) || button.disabled) {
    return;
  }

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

      if (index === 0) {
        showShop();
      } else if (index === 1) {
        showKitchen();
      } else {
        showComingSoon(index);
      }
      break;
    }

    case "shop-answer":
      checkShopAnswer(Number(button.dataset.answer));
      break;

    case "kitchen-answer":
      checkKitchenAnswer(Number(button.dataset.answer));
      break;
  }
});

showWelcome();
