
"use strict";

/* ============================================
   ANDISHA VOICE SYSTEM
   نسخه مستقل اصلاح‌شده
   بدون تغییر main.js
   ============================================ */

(function () {

  if (window.__ANDISHA_VOICES_LOADED__) return;
  window.__ANDISHA_VOICES_LOADED__ = true;

  const AUDIO_PATH = "./assets/audio/";

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
  audio.preload = "auto";

  let welcomePlayed = false;
  let lastAction = "";
  let lastActionTime = 0;

  function setStatus(message) {
    const status = document.getElementById(
      "andishaVoiceStatus"
    );

    if (status) {
      status.textContent = message;
    }
  }

  function stopVoice() {
    audio.pause();

    try {
      audio.currentTime = 0;
    } catch (error) {}

  }

  function playVoice(name) {

    const filename = audioFiles[name];

    if (!filename) {
      console.warn("Andisha voice not found:", name);
      return;
    }

    stopVoice();

    audio.src = new URL(
      AUDIO_PATH + filename,
      document.baseURI
    ).href;

    audio.load();

    setStatus("🎧 صدای اندیشا در حال پخش است.");

    const promise = audio.play();

    if (promise && promise.catch) {
      promise.catch(function (error) {
        console.error("Audio playback error:", error);

        setStatus(
          "پخش صدا ناموفق بود. دوباره تلاش کن."
        );
      });
    }
  }

  audio.addEventListener("ended", function () {
    setStatus("🌟 پخش صدا پایان یافت.");
  });

  audio.addEventListener("error", function () {
    console.error("Audio file error:", audio.src);

    setStatus(
      "خطا در بارگذاری فایل صوتی؛ مسیر فایل را بررسی کن."
    );
  });

  window.andishaPlayVoice = playVoice;
  window.andishaStopVoice = stopVoice;

  function handleClick(event) {

    const target = event.target;

    if (!target || !target.closest) return;

    const button = target.closest(
      "button[data-action]"
    );

    if (!button || button.disabled) return;

    const action = button.dataset.action;

    const now = Date.now();

    if (
      action === lastAction &&
      now - lastActionTime < 350
    ) {
      return;
    }

    lastAction = action;
    lastActionTime = now;

    /* شروع ماجراجویی */

    if (action === "story") {

      const text = button.textContent || "";

      if (
        text.includes("شروع ماجراجویی") &&
        !welcomePlayed
      ) {
        welcomePlayed = true;
        playVoice("welcome");
      }

      return;
    }

    /* بازگشت به شهر */

    if (
      action === "city" ||
      action === "reset-progress"
    ) {
      stopVoice();
      return;
    }

    /* ورود به مناطق */

    if (action === "zone") {

      const index = Number(button.dataset.zone);

      const voiceName = zoneVoices[index];

      if (voiceName) {
        playVoice(voiceName);
      }

      return;
    }

    /* تکرار صدای منطقه */

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

    /* پاسخ برج هوشمند */

    if (
      action === "tower-answer" &&
      typeof towerCompleted !== "undefined" &&
      towerCompleted === true
    ) {
      playVoice("victory");
    }

  }

  /* اتصال به کل صفحه، بدون تغییر main.js */

  document.addEventListener(
    "click",
    handleClick,
    true
  );

  /* توقف MP3 هنگام استفاده از راهنمای گفتاری */

  document.addEventListener(
    "click",
    function (event) {

      const target = event.target;

      if (!target || !target.closest) return;

      if (
        target.closest("#andishaRead") ||
        target.closest("#andishaStop")
      ) {
        stopVoice();
      }

    },
    true
  );

  console.log(
    "ANDISHA VOICE SYSTEM READY"
  );

})();
