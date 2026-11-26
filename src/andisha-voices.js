
"use strict";

/* ============================================
   ANDISHA VOICE SYSTEM
   نسخه 4 - تشخیص خودکار صفحه قهرمانی
   بدون تغییر main.js
   ============================================ */

(function () {

  if (window.__ANDISHA_VOICES_V4__) return;
  window.__ANDISHA_VOICES_V4__ = true;

  const files = {
    welcome: "welcome.mp3",
    shop: "shop.mp3",
    kitchen: "kitchen.mp3",
    bank: "bank.mp3",
    map: "map.mp3",
    tower: "tower.mp3",
    victory: "victory.mp3"
  };

  const zones = [
    "shop",
    "kitchen",
    "bank",
    "map",
    "tower"
  ];

  const audio = new Audio();
  audio.preload = "auto";

  let welcomePlayed = false;
  let victoryPlayed = false;
  let lastClickTime = 0;

  function status(message) {
    const el = document.getElementById("andishaVoiceStatus");
    if (el) el.textContent = message;
  }

  function stop() {
    audio.pause();
    try {
      audio.currentTime = 0;
    } catch (e) {}
  }

  function play(name) {
    if (!files[name]) return;

    stop();

    audio.src = new URL(
      "./assets/audio/" + files[name],
      document.baseURI
    ).href;

    status("🎧 صدای اندیشا در حال پخش است.");

    const result = audio.play();

    if (result && result.catch) {
      result.catch(function (error) {
        console.error("Andisha audio:", error);
        status("پخش صدا انجام نشد.");
      });
    }
  }

  window.andishaPlayVoice = play;
  window.andishaStopVoice = stop;

  audio.addEventListener("ended", function () {
    status("🌟 پخش صدا پایان یافت.");
  });

  audio.addEventListener("error", function () {
    console.error("Audio file error:", audio.src);
    status("خطا در بارگذاری فایل صوتی.");
  });

  /* ============================================
     تشخیص صفحه قهرمانی
     ============================================ */

  function checkVictory() {

    const app = document.getElementById("app");
    if (!app) return;

    const content = app.innerText || "";

    const isVictory =
      content.includes("تو قهرمان شهرک اندیشا هستی") &&
      content.includes("امتیاز نهایی") &&
      content.includes("نشان طلایی قهرمانی");

    if (isVictory && !victoryPlayed) {

      victoryPlayed = true;

      play("victory");

      console.log("ANDISHA: VICTORY VOICE STARTED");

    }

    if (!isVictory) {
      victoryPlayed = false;
    }
  }

  /* مشاهده تغییرات صفحه بازی */

  function startVictoryObserver() {

    const app = document.getElementById("app");

    if (!app) {
      setTimeout(startVictoryObserver, 300);
      return;
    }

    const observer = new MutationObserver(function () {
      checkVictory();
    });

    observer.observe(app, {
      childList: true,
      subtree: true,
      characterData: true
    });

    checkVictory();
  }

  startVictoryObserver();

  /* ============================================
     تشخیص کلیک‌های بازی
     ============================================ */

  document.addEventListener("click", function (event) {

    const target = event.target;

    if (!target || !target.closest) return;

    const button = target.closest("button[data-action]");

    if (!button || button.disabled) return;

    const action = button.dataset.action;

    const now = Date.now();

    if (now - lastClickTime < 250) return;

    lastClickTime = now;

    if (action === "story") {

      const text = button.textContent || "";

      if (
        text.includes("شروع ماجراجویی") &&
        !welcomePlayed
      ) {
        welcomePlayed = true;
        play("welcome");
      }

      return;
    }

    if (
      action === "city" ||
      action === "reset-progress"
    ) {
      stop();
      victoryPlayed = false;
      return;
    }

    if (action === "zone") {

      const index = Number(button.dataset.zone);

      if (zones[index]) {
        play(zones[index]);
      }

      return;
    }

    if (action === "replay") {

      const name = button.dataset.zoneName;

      if (
        name &&
        files[name] &&
        name !== "welcome" &&
        name !== "victory"
      ) {
        play(name);
      }

    }

  }, true);

  /* توقف MP3 هنگام استفاده از راهنمای گفتاری */

  document.addEventListener("click", function (event) {

    const target = event.target;

    if (!target || !target.closest) return;

    if (
      target.closest("#andishaRead") ||
      target.closest("#andishaStop")
    ) {
      stop();
    }

  }, true);

  console.log("ANDISHA VOICE SYSTEM V4 READY");

})();
