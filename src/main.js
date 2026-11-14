const app = document.getElementById("app");

app.innerHTML = `
  <main dir="rtl">
    <h1>🏙️ شهرک هوشمند اندیشا</h1>
    <h2>مأموریت بزرگ تناسب و درصد</h2>
    <p>سلام قهرمان! آماده‌ای شهرک را بسازی؟</p>
    <button id="startBtn">شروع ماجراجویی 🚀</button>
  </main>
`;

document.getElementById("startBtn").addEventListener("click", () => {
  alert("به شهرک هوشمند اندیشا خوش آمدی!");
});
