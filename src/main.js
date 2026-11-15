
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
      <p>سلام قهرمان! من آوا هستم، مهندس کوچک شهرک.</p>
      <p>🤖 اندی: کمک! شهرک هوشمند ما به‌هم‌ریخته است.
      برای بازسازی آن به دانش ریاضی تو نیاز داریم!</p>
      <p>آوا: با حل معماهای تناسب و درصد می‌توانیم
      پنج منطقه شهرک را دوباره آباد کنیم.</p>
      <h3>آماده‌ای قهرمان؟</h3>
      <button id="enterBtn">ورود به شهرک 🏙️</button>
    </main>
  `;

  document.getElementById("enterBtn").addEventListener("click", showCity);
}

function showCity() {
  const zones = [
    { icon: "🛍️", name: "فروشگاه هوشمند", color: "#e7a23b", mission: "تخفیف و قیمت نهایی" },
    { icon: "🍰", name: "آشپزخانه مرکزی", color: "#e77b9c", mission: "تناسب در دستور غذا" },
    { icon: "🏦", name: "بانک اندیشا", color: "#43b9a0", mission: "درصد و سود ساده" },
    { icon: "📐", name: "کارگاه نقشه‌سازی", color: "#6499e8", mission: "مقیاس و تناسب" },
    { icon: "🏆", name: "برج هوشمند", color: "#a78ae8", mission: "چالش نهایی ریاضی" }
  ];

  app.innerHTML = `
    <main dir="rtl">
      <h1>🏙️ شهرک هوشمند اندیشا</h1>
      <h2>نقشه مأموریت قهرمان</h2>
      <p>هر ساختمان یک ماجرای ریاضی دارد!</p>

      <section class="city-map">
        ${zones.map((zone, i) => `
          <article class="building" style="border-top: 7px solid ${zone.color}">
            <div class="building-icon">${zone.icon}</div>
            <h2>${zone.name}</h2>
            <p>${zone.mission}</p>
            <button onclick="openZone(${i})">ورود به منطقه 🚀</button>
          </article>
        `).join("")}
      </section>

      <p>⭐ پنج منطقه، پنج مأموریت، یک قهرمان!</p>
    </main>
  `;
}

function openZone(index) {
  const names = [
    "فروشگاه هوشمند",
    "آشپزخانه مرکزی",
    "بانک اندیشا",
    "کارگاه نقشه‌سازی",
    "برج هوشمند"
  ];

  app.innerHTML = `
    <main dir="rtl">
      <h1>${names[index]}</h1>
      <h2>🤖 اندی: به منطقه مأموریت خوش آمدی!</h2>
      <p>این منطقه به‌زودی با یک بازی ریاضی جذاب فعال می‌شود.</p>
      <button onclick="showCity()">بازگشت به نقشه شهرک 🏙️</button>
    </main>
  `;
}

showWelcome();
