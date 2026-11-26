/* ============================================
   ANDISHA VOICE SYSTEM
   سیستم اتصال فایل‌های صوتی شهرک هوشمند اندیشا
   نسخه اصلاحی 2
   ============================================ */

"use strict";

(function () {

  if (window.__ANDISHA_VOICES_LOADED__) return;
  window.__ANDISHA_VOICES_LOADED__ = true;

  // نام فایل‌های صوتی
  const audioFiles = {
    welcome: "welcome.mp3",
    shop: "shop.mp3",
    kitchen: "kitchen.mp3",
    bank: "bank.mp3",
    map: "map.mp3",
    tower: "tower.mp3",
    victory: "victory.mp3"
  };

  // ترتیب مناطق مطابق main.js
  const zoneVoices = [
    "shop",
    "kitchen",
    "bank",
    "map",
    "tower"
  ];

  const audio = new Audio();

  audio.preload = "auto";

  let welcomePlayed = false;
  let currentVoice = "";

  // نمایش وضعیت صدا
  function setStatus(message) {
    const status = document.getElementById("andishaVoiceStatus");

    if (status) {
      status.textContent = message;
    }
  }

  // توقف صدای قبلی
  function stopVoice() {
    audio.pause();

    try {
      audio.currentTime = 0;
    } catch (error) {
      // فایل هنوز آماده پخش نیست.
    }

    currentVoice = "";
  }

  // پخش فایل صوتی
  function playVoice(name) {

    const filename = audioFiles[name];

    if (!filename) {
      console.warn("فایل صوتی شناخته نشد:", name);
      return;
    }

    stopVoice();

    // توقف گفتار ماشینی در صورت فعال بودن
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    audio.src = new URL(
      "./assets/audio/" + filename,
      document.baseURI
    ).href;

    currentVoice = name;

    setStatus("🎧 صدای اندیشا در حال پخش است.");

    const result = audio.play();

    if (result && typeof result.catch === "function") {

      result.catch(function (error) {

        console.warn("خطا در پخش صدا:", error);

        setStatus(
          "پخش صدا انجام نشد. دوباره تلاش کن."
        );

      });

    }
  }

  // پایان پخش
  audio.addEventListener("ended", function () {

    currentVoice = "";

    setStatus("پخش صدا پایان یافت. 🌟");

  });

  // خطای فایل صوتی
  audio.addEventListener("error", function () {

    currentVoice = "";

    setStatus(
      "خطا در بارگذاری فایل صوتی؛ مسیر فایل را بررسی کن."
    );

    console.error(
      "Andisha audio error:",
      audio.src
    );

  });

  // دسترسی عمومی برای سایر بخش‌های بازی
  window.andishaPlayVoice = playVoice;
  window.andishaStopVoice = stopVoice;


  // ============================================
  // تشخیص کلیک‌های بازی
  // ============================================

  function handleGameClick(event) {

    const target = event.target;

    if (!target || typeof target.closest !== "function") {
      return;
    }

    const button = target.closest("button[data-action]");

    if (!button || button.disabled) {
      return;
    }

    const action = button.dataset.action;


    // شروع ماجراجویی
    if (action === "story") {

      if (
        button.textContent.indexOf("شروع ماجراجویی") !== -1 &&
        !welcomePlayed
      ) {

        welcomePlayed = true;

        playVoice("welcome");

      } else {

        stopVoice();

      }

      return;
    }


    // بازگشت به شهر یا شروع مجدد
    if (
      action === "city" ||
      action === "reset-progress"
    ) {

      stopVoice();

      return;
    }


    // ورود به مناطق پنج‌گانه
    if (action === "zone") {

      const index = Number(button.dataset.zone);

      const voiceName = zoneVoices[index];

      if (voiceName) {
        playVoice(voiceName);
      }

      return;
    }


    // پخش مجدد صدای منطقه
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
    // بررسی مستقیم متغیر towerCompleted در main.js
    if (
      action === "tower-answer" &&
      typeof towerCompleted !== "undefined" &&
      towerCompleted === true
    ) {

      playVoice("victory");

      return;
    }

  }


  // ============================================
  // اتصال سیستم صدا به بازی
  // ============================================

  function attachToApp() {

    const app = document.getElementById("app");

    if (!app) {
      console.error("بخش اصلی بازی پیدا نشد.");
      return;
    }

    if (app.__andishaVoiceClickAttached) {
      return;
    }

    app.__andishaVoiceClickAttached = true;

    // بعد از اجرای رویداد اصلی main.js
    app.addEventListener(
      "click",
      handleGameClick,
      false
    );

  }

  attachToApp();


  // ============================================
  // جلوگیری از تداخل MP3 با دکمه راهنمای گفتاری
  // ============================================

  document.addEventListener("click", function (event) {

    const target = event.target;

    if (!target || typeof target.closest !== "function") {
      return;
    }

    const control = target.closest(
      "#andishaRead, #andishaStop"
    );

    if (control) {
      stopVoice();
    }

  }, true);


  console.log(
    "ANDISHA VOICE SYSTEM: READY"
  );

})();
