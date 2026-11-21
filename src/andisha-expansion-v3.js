/* ANDISHA EXPANSION V3 */
(function () {
  "use strict";

  if (window.__andishaExpansionV3) return;
  window.__andishaExpansionV3 = true;

  const STORAGE_KEY = "andishaExpansionV3";

  const defaultData = {
    name: "قهرمان اندیشا",
    avatar: "🧑‍🚀",
    notes: [],
    badges: [],
    completedExercises: [],
    createdAt: new Date().toISOString()
  };

  function loadData() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || typeof saved !== "object") return { ...defaultData };
      return {
        ...defaultData,
        ...saved,
        notes: Array.isArray(saved.notes) ? saved.notes : [],
        badges: Array.isArray(saved.badges) ? saved.badges : [],
        completedExercises: Array.isArray(saved.completedExercises)
          ? saved.completedExercises : []
      };
    } catch (error) {
      return { ...defaultData };
    }
  }

  let data = loadData();

  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn("Andisha V3: ذخیره‌سازی انجام نشد.", error);
    }
  }

  function safeText(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  const exercises = [
    {
      id: "ex1",
      title: "🛍️ چالش تخفیف",
      question: "۳۰ درصدِ ۲۰۰٬۰۰۰ تومان چند تومان است؟",
      options: ["۳۰٬۰۰۰", "۶۰٬۰۰۰", "۸۰٬۰۰۰"],
      answer: 1,
      explanation: "۲۰۰٬۰۰۰ × ۳۰ ÷ ۱۰۰ = ۶۰٬۰۰۰ تومان"
    },
    {
      id: "ex2",
      title: "🍰 چالش تناسب",
      question: "اگر برای ۲ نفر، ۳ پیمانه آرد لازم باشد، برای ۶ نفر چند پیمانه لازم است؟",
      options: ["۶", "۹", "۱۲"],
      answer: 1,
      explanation: "تعداد افراد ۳ برابر شده؛ پس ۳ × ۳ = ۹ پیمانه."
    },
    {
      id: "ex3",
      title: "🏦 چالش درصد",
      question: "۲۵ درصدِ ۴۰۰ چند می‌شود؟",
      options: ["۵۰", "۱۰۰", "۱۵۰"],
      answer: 1,
      explanation: "۲۵ درصد یک‌چهارم است؛ ۴۰۰ ÷ ۴ = ۱۰۰."
    },
    {
      id: "ex4",
      title: "📐 چالش مقیاس",
      question: "هر سانتی‌متر برابر ۵ متر است. ۶ سانتی‌متر چند متر می‌شود؟",
      options: ["۲۵", "۳۰", "۳۵"],
      answer: 1,
      explanation: "۶ × ۵ = ۳۰ متر."
    }
  ];

  const style = document.createElement("style");
  style.id = "andishaExpansionV3Style";
  style.textContent = `
    #andisha-v3-launcher {
      position:fixed; right:12px; bottom:15px; z-index:100001;
      border:2px solid #f5c75e; border-radius:16px;
      background:#142b52; color:white; padding:12px 15px;
      font:bold 14px Tahoma; box-shadow:0 4px 16px #0004;
      cursor:pointer;
    }
    #andisha-v3-overlay {
      display:none; position:fixed; inset:0; z-index:100002;
      background:#07152bd9; padding:12px; overflow:auto;
      box-sizing:border-box; font-family:Tahoma,sans-serif;
    }
    #andisha-v3-panel {
      max-width:620px; margin:20px auto; padding:18px;
      border-radius:22px; background:#f7f9ff; color:#142b52;
      box-shadow:0 10px 35px #0005; direction:rtl;
    }
    #andisha-v3-panel button,
    #andisha-v3-panel input,
    #andisha-v3-panel textarea {
      font:14px Tahoma,sans-serif; box-sizing:border-box;
    }
    #andisha-v3-panel button {
      border:0; border-radius:11px; padding:10px 13px;
      cursor:pointer; background:#244d80; color:white;
      margin:4px;
    }
    #andisha-v3-panel button:disabled {
      opacity:.5; cursor:not-allowed;
    }
    .andisha-v3-tabs {
      display:flex; flex-wrap:wrap; gap:5px; margin:14px 0;
    }
    .andisha-v3-tabs button { flex:1; min-width:105px; }
    .andisha-v3-card {
      background:white; border:1px solid #dce5f2;
      border-radius:15px; padding:14px; margin:10px 0;
    }
    .andisha-v3-field {
      width:100%; padding:12px; border:1px solid #b9c9df;
      border-radius:10px; margin:7px 0; background:white;
    }
    .andisha-v3-muted { color:#64748b; font-size:12px; }
    .andisha-v3-badge {
      display:inline-block; padding:10px; margin:5px;
      background:#fff3cd; border-radius:12px; font-size:25px;
    }
    #andisha-v3-close {
      float:left; background:#a83248;
    }
  `;
  document.head.appendChild(style);

  const launcher = document.createElement("button");
  launcher.id = "andisha-v3-launcher";
  launcher.type = "button";
  launcher.textContent = "🎒 امکانات قهرمان";
  document.body.appendChild(launcher);

  const overlay = document.createElement("div");
  overlay.id = "andisha-v3-overlay";
  overlay.innerHTML = `
    <section id="andisha-v3-panel">
      <button id="andisha-v3-close" type="button">بستن ✕</button>
      <h2>🌟 آکادمی قهرمان اندیشا</h2>
      <p class="andisha-v3-muted">پروفایل، نشان‌ها، یادداشت‌ها و تمرین‌های بیشتر</p>
      <div class="andisha-v3-tabs">
        <button data-v3-tab="profile">👤 پروفایل</button>
        <button data-v3-tab="badges">🏅 نشان‌ها</button>
        <button data-v3-tab="notes">📒 یادداشت‌ها</button>
        <button data-v3-tab="practice">🧠 تمرین‌ها</button>
      </div>
      <div id="andisha-v3-content"></div>
    </section>
  `;
  document.body.appendChild(overlay);

  const content = document.getElementById("andisha-v3-content");

  function showTab(tab) {
    if (tab === "profile") renderProfile();
    else if (tab === "badges") renderBadges();
    else if (tab === "notes") renderNotes();
    else if (tab === "practice") renderPractice();
  }

  function renderProfile() {
    content.innerHTML = `
      <div class="andisha-v3-card">
        <h3>👤 پروفایل قهرمان</h3>
        <div style="font-size:48px;text-align:center">${safeText(data.avatar)}</div>
        <label>نام بازیکن</label>
        <input class="andisha-v3-field" id="andisha-v3-name"
          maxlength="30" value="${safeText(data.name)}">
        <label>انتخاب آواتار</label>
        <div>
          ${["🧑‍🚀","👩‍🚀","🧑‍🎓","👩‍🎓","🦊","🐼","🐱","🤖"]
            .map(avatar => `
              <button type="button" data-v3-avatar="${avatar}"
                style="font-size:22px">${avatar}</button>
            `).join("")}
        </div>
        <button type="button" data-v3-action="save-profile">ذخیره پروفایل 💾</button>
      </div>
    `;
  }
    function renderBadges() {
    const allBadges = [
      { id: "welcome", icon: "🌟", title: "قهرمان تازه‌وارد" },
      { id: "ex1", icon: "🛍️", title: "شکارچی تخفیف" },
      { id: "ex2", icon: "🍰", title: "آشپز ماهر" },
      { id: "ex3", icon: "🏦", title: "استاد درصد" },
      { id: "ex4", icon: "📐", title: "مهندس نقشه" },
      { id: "all", icon: "👑", title: "قهرمان دانش" }
    ];

    const earned = data.badges || [];

    content.innerHTML = `
      <div class="andisha-v3-card">
        <h3>🎒 کوله‌پشتی نشان‌های من</h3>
        <p>تعداد نشان‌های دریافت‌شده: ${earned.length}</p>
        <div>
          ${allBadges.map(badge => `
            <div class="andisha-v3-badge"
              title="${safeText(badge.title)}"
              style="${earned.includes(badge.id) ? "" : "opacity:.2;filter:grayscale(1)"}">
              ${badge.icon}
            </div>
          `).join("")}
        </div>
        <p class="andisha-v3-muted">
          با انجام تمرین‌ها نشان‌های تازه به دست بیاور.
        </p>
      </div>
    `;
  }

  function renderNotes() {
    content.innerHTML = `
      <div class="andisha-v3-card">
        <h3>📒 دفتر یادداشت قهرمان</h3>
        <textarea id="andisha-v3-note"
          class="andisha-v3-field" rows="4"
          maxlength="500" placeholder="ایده‌ها و نکته‌های ریاضی‌ات را بنویس..."></textarea>
        <button type="button" data-v3-action="add-note">
          ثبت یادداشت ✍️
        </button>
      </div>
      <div class="andisha-v3-card">
        <h3>یادداشت‌های من</h3>
        ${data.notes.length ? data.notes.map((note, index) => `
          <div class="andisha-v3-card">
            <p>${safeText(note.text)}</p>
            <small class="andisha-v3-muted">${safeText(note.date)}</small>
            <button type="button" data-v3-action="delete-note"
              data-v3-index="${index}">حذف</button>
          </div>
        `).join("") : "<p>هنوز یادداشتی ثبت نکرده‌ای.</p>"}
      </div>
    `;
  }

  function renderPractice() {
    content.innerHTML = `
      <div class="andisha-v3-card">
        <h3>🧠 تمرین‌های تکمیلی</h3>
        <p>برای دریافت نشان‌های جدید، تمرین‌ها را حل کن.</p>
        ${exercises.map((exercise, index) => {
          const done = data.completedExercises.includes(exercise.id);
          return `
            <div class="andisha-v3-card">
              <h4>${safeText(exercise.title)}</h4>
              <p>${safeText(exercise.question)}</p>
              ${exercise.options.map((option, optionIndex) => `
                <button type="button"
                  data-v3-action="answer"
                  data-v3-exercise="${index}"
                  data-v3-answer="${optionIndex}"
                  ${done ? "disabled" : ""}>
                  ${safeText(option)}
                </button>
              `).join("")}
              <p class="andisha-v3-feedback" id="andisha-v3-feedback-${index}">
                ${done ? "🎉 این تمرین را قبلاً حل کرده‌ای!" : "پاسخت را انتخاب کن."}
              </p>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function awardBadge(id) {
    if (!data.badges.includes(id)) {
      data.badges.push(id);
      saveData();
    }
  }

  function handleAnswer(exerciseIndex, answerIndex) {
    const exercise = exercises[exerciseIndex];
    if (!exercise) return;

    if (data.completedExercises.includes(exercise.id)) return;

    const feedback = document.getElementById(
      "andisha-v3-feedback-" + exerciseIndex
    );

    if (answerIndex === exercise.answer) {
      data.completedExercises.push(exercise.id);
      awardBadge(exercise.id);

      if (data.completedExercises.length === exercises.length) {
        awardBadge("all");
      }

      saveData();

      if (feedback) {
        feedback.innerHTML = `
          🎉 آفرین! پاسخ درست است.
          <p>${safeText(exercise.explanation)}</p>
          <strong>🏅 نشان جدید دریافت کردی!</strong>
        `;
      }

      content.querySelectorAll(
        '[data-v3-exercise="' + exerciseIndex + '"]'
      ).forEach(button => button.disabled = true);

    } else {
      if (feedback) {
        feedback.textContent = "🌱 دوباره تلاش کن؛ یک بار دیگر فکر کن!";
      }
    }
  }

  function addNote() {
    const input = document.getElementById("andisha-v3-note");
    if (!input) return;

    const value = input.value.trim();
    if (!value) {
      input.focus();
      return;
    }

    data.notes.unshift({
      text: value,
      date: new Date().toLocaleDateString("fa-IR")
    });

    saveData();
    renderNotes();
  }
    function saveProfile() {
    const input = document.getElementById("andisha-v3-name");
    if (!input) return;

    const name = input.value.trim();

    if (!name) {
      input.focus();
      return;
    }

    data.name = name.slice(0, 30);
    saveData();
    renderProfile();
  }

  function deleteNote(index) {
    if (!Number.isInteger(index) || index < 0 || index >= data.notes.length) {
      return;
    }

    data.notes.splice(index, 1);
    saveData();
    renderNotes();
  }

  launcher.addEventListener("click", function () {
    overlay.style.display = "block";
    showTab("profile");
  });

  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
      overlay.style.display = "none";
    }
  });

  document.getElementById("andisha-v3-close")
    .addEventListener("click", function () {
      overlay.style.display = "none";
    });

  overlay.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.v3Tab) {
      showTab(button.dataset.v3Tab);
      return;
    }

    if (button.dataset.v3Avatar) {
      data.avatar = button.dataset.v3Avatar;
      saveData();
      renderProfile();
      return;
    }

    const action = button.dataset.v3Action;

    if (action === "save-profile") {
      saveProfile();
    }

    if (action === "add-note") {
      addNote();
    }

    if (action === "delete-note") {
      deleteNote(Number(button.dataset.v3Index));
    }

    if (action === "answer") {
      handleAnswer(
        Number(button.dataset.v3Exercise),
        Number(button.dataset.v3Answer)
      );
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      overlay.style.display = "none";
    }
  });

  awardBadge("welcome");

  console.log("Andisha Expansion V3 loaded successfully.");
})();
