"use strict";

/* ============================================
   ANDISHA VOICE SYSTEM V3
   SINGLE AUDIO CONTROL
   جلوگیری از تداخل و اکو
   ============================================ */

(function () {

  if (window.__ANDISHA_VOICES_V3__) return;
  window.__ANDISHA_VOICES_V3__ = true;

  const audioFiles = {
    welcome: "welcome.mp3",
    shop: "shop.mp3",
    kitchen: "kitchen.mp3",
    bank: "bank.mp3",
    map: "map.mp3",
    tower: "tower.mp3",
    victory: "victory.mp3"
  };

  const zoneVoices = [
    "shop",
    "kitchen",
    "bank",
    "map",
    "tower"
  ];

  const audio = new Audio();

  audio.preload = "none";
  audio.loop = false;

  let currentVoice = "";
  let voiceSessionActive = false;
  let welcomePlayed = false;

  function setStatus(message) {
    const status = document.getElementById(
      "andishaVoiceStatus"
    );

    if (status) status.textContent = message;
  }

  // پایان یکپارچه صدای راهنما
  function finishVoice(message) {

    if (!currentVoice && !voiceSessionActive) return;

    currentVoice = "";

    if (voiceSessionActive) {

      voiceSessionActive = false;

      const coordinator = window.andishaAudioCoordinator;

      if (
        coordinator &&
        typeof coordinator.afterVoice === "function"
      ) {
        coordinator.afterVoice();
      }
    }

    setStatus(message || "پخش صدا پایان یافت. 🌟");
  }

  // توقف صدای قبلی
  function stopVoice(notifyCoordinator) {

    audio.pause();

    try {
      audio.currentTime = 0;
    } catch (error) {}

    audio.removeAttribute("src");
    audio.load();

    currentVoice = "";

    if (
      notifyCoordinator !== false &&
      voiceSessionActive
    ) {
      finishVoice("صدای راهنما متوقف شد.");
    }
  }

  // پخش صدای جدید
  function playVoice(name) {

    const filename = audioFiles[name];

    if (!filename) {
      console.warn("فایل صوتی نامعتبر:", name);
      return;
    }

    // توقف فایل قبلی بدون آزادکردن موسیقی
    stopVoice(false);

    // هماهنگی با استودیوی موسیقی V7
    const coordinator = window.andishaAudioCoordinator;

    if (!voiceSessionActive) {

      if (
        coordinator &&
        typeof coordinator.beforeVoice === "function"
      ) {
        coordinator.beforeVoice();
      }

      voiceSessionActive = true;
    }

    // توقف گفتار ماشینی
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    currentVoice = name;

    audio.src = new URL(
      "./assets/audio/" + filename,
      document.baseURI
    ).href;

    setStatus("🎧 صدای اندیشا در حال پخش است.");

    const playPromise = audio.play();

    if (playPromise && typeof playPromise.catch === "function") {

      playPromise.catch(function(error) {

        console.warn("خطای پخش فایل صوتی:", error);

        if (currentVoice === name) {
          finishVoice("پخش صدا انجام نشد؛ فایل را بررسی کن.");
        }

      });
    }
  }

  // پایان طبیعی فایل
  audio.addEventListener("ended", function() {
    finishVoice("پخش صدا پایان یافت. 🌟");
  });

  // خطای فایل
  audio.addEventListener("error", function() {

    if (!currentVoice) return;

    console.error("Andisha audio error:", audio.src);

    finishVoice("خطا در بارگذاری فایل صوتی.");

  });

  // API عمومی
  window.andishaPlayVoice = playVoice;
  window.andishaStopVoice = function() {
    stopVoice(true);
  };

  // ============================================
  // تشخیص کلیک‌های بازی
  // ============================================

  function handleGameClick(event) {

    const target = event.target;

    if (!target || typeof target.closest !== "function") {
      return;
    }

    const button = target.closest("button[data-action]");

    if (!button || button.disabled) return;

    const action = button.dataset.action;

    // شروع داستان
    if (action === "story") {

      if (
        button.textContent.indexOf("شروع ماجراجویی") !== -1 &&
        !welcomePlayed
      ) {

        welcomePlayed = true;
        playVoice("welcome");

      } else {

        stopVoice(true);

      }

      return;
    }

    // بازگشت به شهر
    if (
      action === "city" ||
      action === "reset-progress"
    ) {

      stopVoice(true);
      return;
    }

    // ورود به ساختمان‌ها
    if (action === "zone") {

      const index = Number(button.dataset.zone);
      const voiceName = zoneVoices[index];

      if (voiceName) {
        playVoice(voiceName);
      }

      return;
    }

    // تکرار صدای مأموریت
    if (action === "replay") {

      const zoneName = button.dataset.zoneName;

      if (
        audioFiles[zoneName] &&
        zoneName !== "welcome" &&
        zoneName !== "victory"
      ) {
        playVoice(zoneName);
      }

      return;
    }

    // صدای پیروزی
    if (
      action === "tower-answer" &&
      window.towerCompleted === true
    ) {

      playVoice("victory");
      return;
    }

  }

  // اتصال به بازی اصلی
  function attachToApp() {

    const app = document.getElementById("app");

    if (!app) {
      console.error("بخش اصلی بازی پیدا نشد.");
      return;
    }

    if (app.__andishaVoiceV3Attached) return;

    app.__andishaVoiceV3Attached = true;

    app.addEventListener(
      "click",
      handleGameClick,
      false
    );

  }

  attachToApp();

  // توقف هنگام استفاده از راهنمای گفتاری
  document.addEventListener("click", function(event) {

    const target = event.target;

    if (!target || typeof target.closest !== "function") {
      return;
    }

    if (
      target.closest("#andishaRead, #andishaStop")
    ) {
      stopVoice(true);
    }

  }, true);

  // توقف هنگام خروج
  window.addEventListener("pagehide", function() {
    stopVoice(false);
  });

  console.log("ANDISHA VOICE SYSTEM V3 READY");

})();
