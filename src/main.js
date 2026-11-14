
const app = document.getElementById("app");

function showWelcome() {
  app.innerHTML = `
    <main dir="rtl">
      <h1>🏙️ شهرک هوشمند اندیشا</h1>
      <h2>مأموریت بزرگ تناسب و درصد</h2>
      <p>سلام قهرمان! آماده‌ای شهرک را بسازی؟</p>
      <button id="startBtn">شروع ماجراجویی 🚀</button>
    </main>
  `;

  document.getElementById("startBtn").addEventListener("click", showStory);
}

function showStory() {
  app.innerHTML = `
    <main dir="rtl">
      <h1>🌟 آغاز یک مأموریت بزرگ</h1>
      <h2>👧 آوا و 🤖 اندی</h2>
      <p>
        سلام قهرمان! من آوا هستم، مهندس کوچک شهرک.
      </p>
      <p>
        🤖 اندی: کمک! شهرک هوشمند ما به‌هم‌ریخته است.
        برای بازسازی آن به دانش ریاضی تو نیاز داریم!
      </p>
      <p>
        آوا: با حل معماهای تناسب و درصد می‌توانیم
        پنج منطقه شهرک را دوباره آباد کنیم.
      </p>
      <h3>آماده‌ای قهرمان؟</h3>
      <button id="enterBtn">ورود به شهرک 🏙️</button>
    </main>
  `;

  document.getElementById("enterBtn").addEventListener("click", showCity);
}

function showCity() {
  const zones = [
    "🛍️ فروشگاه هوشمند",
    "🍰 آشپزخانه مرکزی",
    "🏦 بانک اندیشا",
    "📐 کارگاه نقشه‌سازی",
    "🏆 برج هوشمند"
  ];

  app.innerHTML = `
    <main dir="rtl">
      <h1>🏙️ نقشه شهرک هوشمند اندیشا</h1>
      <p>قهرمان! پنج منطقه منتظر کمک تو هستند.</p>
      <ul>
        ${zones.map(zone => `<li>${zone}</li>`).join("")}
      </ul>
      <p>✨ به‌زودی مأموریت هر منطقه آغاز می‌شود.</p>
    </main>
  `;
}

showWelcome();
