"use strict";

/* ============================================
   ANDISHA VOICE SYSTEM
   نسخه 6 - مدیریت تداخل صداها و جلوگیری از اکو
   بدون تغییر main.js
   ============================================ */

(function () {

  if (window.__ANDISHA_VOICES_V6__) return;
  window.__ANDISHA_VOICES_V6__ = true;

  const files = {
    welcome: "welcome.mp3",
    shop: "shop.mp3",
    kitchen: "kitchen.mp3",
    bank: "bank.mp3",
    map: "map.mp3",
    tower: "tower.mp3",
    victory: "victory.mp3"
  };

  const zones = ["shop", "kitchen", "bank", "map", "tower"];

  const voice = new Audio();
  voice.preload = "auto";

  let welcomePlayed = false;
  let victoryPlayed = false;
  let lastClickTime = 0;
  let playToken = 0;

  let pausedMedia = [];

  function status(message) {
    const el = document.getElementById("andishaVoiceStatus");
    if (el) el.textContent = message;
  }

  function pauseOtherMedia() {
    pausedMedia = [];
    document.querySelectorAll("audio").forEach(function (item) {
      if (item === voice || item.paused) return;
      pausedMedia.push(item);
      item.pause();
    });
  }

  function resumeOtherMedia() {
    const list = pausedMedia.slice();
    pausedMedia = [];
    list.forEach(function (item) {
      if (!item.isConnected) return;
      const result = item.play();
      if (result && result.catch) {
        result.catch(function () {});
      }
    });
  }

  function stop() {
    playToken++;
    voice.pause();
    try { voice.currentTime = 0; } catch (e) {}
    resumeOtherMedia();
    status("🔇 پخش صدا متوقف شد.");
  }

  function play(name) {
    if (!files[name]) return;

    playToken++;
    const currentToken = playToken;

    voice.pause();
    try { voice.currentTime = 0; } catch (e) {}
    pauseOtherMedia();

    // استفاده از URL مطلق برای جلوگیری از خطای مسیر در موبایل
    voice.src = new URL("./assets/audio/" + files[name], document.baseURI).href;
    
    // این خط به مرورگر می‌گوید که بافر قبلی را کاملاً پاک کند (جلوگیری از هم‌پوشانی)
    voice.load(); 

    status("🎧 صدای اندیشا در حال پخش است.");

    const result = voice.play();
    if (result && result.catch) {
      result.catch(function (error) {
        if (currentToken !== playToken) return; // نادیده گرفتن خطای صدای قطع‌شده
        console.error("Andisha audio:", error);
        status("پخش صدا انجام نشد.");
        resumeOtherMedia();
      });
    }
  }

  window.andishaPlayVoice = play;
  window.andishaStopVoice = stop;

  voice.addEventListener("ended", function () {
    status("🌟 پخش صدا پایان یافت.");
    resumeOtherMedia();
  });

  voice.addEventListener("error", function () {
    console.error("Audio file error:", voice.src);
    status("خطا در بارگذاری فایل صوتی.");
    resumeOtherMedia();
  });

  function removeGuideButtons() {
    const guideIds = ["andishaRead", "andishaStop"];
    guideIds.forEach(function (id) {
      const element = document.getElementById(id);
      if (element) element.remove();
    });
  }

  function startGuideRemoval() {
    removeGuideButtons();
    const observer = new MutationObserver(function () { removeGuideButtons(); });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.body) {
    startGuideRemoval();
  } else {
    document.addEventListener("DOMContentLoaded", startGuideRemoval);
  }

  function checkVictory() {
    const app = document.getElementById("app");
    if (!app) return;
    const content = app.innerText || "";
    const isVictory = content.includes("تو قهرمان شهرک اندیشا هستی") && 
                      content.includes("امتیاز نهایی") && 
                      content.includes("نشان طلایی قهرمانی");

    if (isVictory && !victoryPlayed) {
      victoryPlayed = true;
      play("victory");
    }
    if (!isVictory) {
      victoryPlayed = false;
    }
  }

  function startVictoryObserver() {
    const app = document.getElementById("app");
    if (!app) {
      setTimeout(startVictoryObserver, 300);
      return;
    }
    const observer = new MutationObserver(function () { checkVictory(); });
    observer.observe(app, { childList: true, subtree: true, characterData: true });
    checkVictory();
  }
  startVictoryObserver();

  // ============================================
  // تشخیص کلیک‌های بازی
  // ============================================
  document.addEventListener("click", function (event) {
    const target = event.target;
    if (!target || !target.closest) return;

    const button = target.closest("button[data-action]");
    if (!button || button.disabled) return;

    const action = button.dataset.action;
    const now = Date.now();

    // جلوگیری از کلیک دوباره سریع (اکو)
    if (now - lastClickTime < 250) return;
    lastClickTime = now;

    // ۱. شروع بازی
    if (action === "story") {
      const text = button.textContent || "";
      if (text.includes("شروع ماجراجویی") && !welcomePlayed) {
        welcomePlayed = true;
        play("welcome");
      }
      return;
    }

    // ۲. بازگشت به شهرک
    if (action === "city" || action === "reset-progress") {
      stop();
      victoryPlayed = false;
      return;
    }

    // ۳. ورود به منطقه
    if (action === "zone") {
      const index = Number(button.dataset.zone);
      if (zones[index]) {
        play(zones[index]);
      }
      return;
    }

    // ۴. تکرار مأموریت
    if (action === "replay") {
      const name = button.dataset.zoneName;
      if (name && files[name] && name !== "welcome" && name !== "victory") {
        play(name);
      }
      return;
    }

    // 🌟 اصلاح جدید: اگر دانش‌آموز روی دکمه‌های پاسخ کلیک کرد،
    // صدای گوینده را فوراً قطع کن تا صدای زنگ (درست/غلط) به تنهایی شنیده شود.
    if (action.endsWith("-answer")) {
      stop();
      return;
    }

  }, true);

  console.log("ANDISHA VOICE SYSTEM V6 READY");

})();
