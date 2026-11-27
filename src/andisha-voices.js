
"use strict";

/* ============================================
   ANDISHA VOICE SYSTEM
   نسخه 5 - حذف راهنما و مدیریت تداخل صداها
   بدون تغییر main.js
   ============================================ */

(function () {

  if (window.__ANDISHA_VOICES_V5__) return;
  window.__ANDISHA_VOICES_V5__ = true;

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

  const voice = new Audio();
  voice.preload = "auto";

  let welcomePlayed = false;
  let victoryPlayed = false;
  let lastClickTime = 0;
  let playToken = 0;

  // رسانه‌هایی که پیش از صدای اندیشا در حال پخش بوده‌اند
  let pausedMedia = [];

  function status(message) {
    const el = document.getElementById("andishaVoiceStatus");
    if (el) el.textContent = message;
  }

  /* ============================================
     توقف و ازسرگیری صداهای دیگر صفحه
     ============================================ */

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

  /* ============================================
     توقف صدای اندیشا
     ============================================ */

  function stop() {

    playToken++;

    voice.pause();

    try {
      voice.currentTime = 0;
    } catch (e) {}

    resumeOtherMedia();

    status("🔇 پخش صدا متوقف شد.");
  }

  /* ============================================
     پخش کنترل‌شده صدا
     ============================================ */

  function play(name) {

    if (!files[name]) return;

    playToken++;
    const currentToken = playToken;

    voice.pause();

    try {
      voice.currentTime = 0;
    } catch (e) {}

    pauseOtherMedia();

    voice.src = new URL(
      "./assets/audio/" + files[name],
      document.baseURI
    ).href;

    status("🎧 صدای اندیشا در حال پخش است.");

    const result = voice.play();

    if (result && result.catch) {

      result.catch(function (error) {

        if (currentToken !== playToken) return;

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

  /* ============================================
     حذف دکمه‌های راهنمای گفتاری
     ============================================ */

  function removeGuideButtons() {

    const guideIds = [
      "andishaRead",
      "andishaStop"
    ];

    guideIds.forEach(function (id) {

      const element = document.getElementById(id);

      if (element) {
        element.remove();
      }

    });
  }

  function startGuideRemoval() {

    removeGuideButtons();

    const observer = new MutationObserver(function () {
      removeGuideButtons();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

  }

  if (document.body) {
    startGuideRemoval();
  } else {
    document.addEventListener("DOMContentLoaded", startGuideRemoval);
  }

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

  console.log("ANDISHA VOICE SYSTEM V5 READY");

})();
