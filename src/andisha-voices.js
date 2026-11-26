
"use strict";

// ============================================
// 🎙️ ANDISHA VOICE SYSTEM
// سیستم مستقل پخش صداهای فارسی شهرک اندیشا
// ============================================

(function () {
  "use strict";

  if (window.__andishaVoiceSystem) return;
  window.__andishaVoiceSystem = true;

  const AUDIO_BASE = "../assets/audio/";

  const voicePlayer = new Audio();
  voicePlayer.preload = "auto";

  let currentVoice = "";

  const voiceStatus = document.getElementById("andishaVoiceStatus");

  const voiceFiles = {
    welcome: "welcome.mp3",
    shop: "shop.mp3",
    kitchen: "kitchen.mp3",
    bank: "bank.mp3",
    map: "map.mp3",
    tower: "tower.mp3",
    victory: "victory.mp3"
  };

  function stopVoice() {
    voicePlayer.pause();
    voicePlayer.currentTime = 0;
    currentVoice = "";
  }

  function playVoice(name) {
    const filename = voiceFiles[name];

    if (!filename) return;

    stopVoice();

    // جلوگیری از هم‌زمانی صدای فارسی گوشی و فایل MP3
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    currentVoice = name;
    voicePlayer.src = new URL(
      AUDIO_BASE + filename,
      document.currentScript
        ? document.currentScript.src
        : window.location.href
    ).href;

    voicePlayer.load();

    voicePlayer.play()
      .then(function () {
        if (voiceStatus) {
          voiceStatus.textContent = "🔊 در حال پخش راهنمای فارسی...";
        }
      })
      .catch(function (error) {
        console.warn("پخش فایل صوتی انجام نشد:", filename, error);

        if (voiceStatus) {
          voiceStatus.textContent =
            "فایل صوتی پخش نشد؛ بازی را ادامه بده.";
        }
      });
  }

  voicePlayer.addEventListener("ended", function () {
    currentVoice = "";

    if (voiceStatus) {
      voiceStatus.textContent = "پخش راهنمای صوتی تمام شد 🌟";
    }
  });

  voicePlayer.addEventListener("error", function () {
    console.warn("فایل صوتی پیدا نشد:", voicePlayer.src);

    if (voiceStatus) {
      voiceStatus.textContent =
        "فایل صوتی در دسترس نیست؛ بازی بدون مشکل ادامه دارد.";
    }
  });

  // ============================================
  // تشخیص ورود به مناطق و شروع ماجراجویی
  // ============================================

  document.addEventListener("click", function (event) {
    const target = event.target;

    if (!target || typeof target.closest !== "function") return;

    const button = target.closest("#app button[data-action]");

    if (!button) return;

    const action = button.dataset.action;

    if (action === "story") {
      // فقط دکمه شروع اولیه، خوشامدگویی را پخش می‌کند.
      if (button.innerText.includes("شروع ماجراجویی")) {
        playVoice("welcome");
      }
    }

    if (action === "zone") {
      const zone = Number(button.dataset.zone);

      const zoneNames = [
        "shop",
        "kitchen",
        "bank",
        "map",
        "tower"
      ];

      if (Number.isInteger(zone) && zoneNames[zone]) {
        playVoice(zoneNames[zone]);
      }
    }

    if (action === "replay") {
      const zoneName = button.dataset.zoneName;

      if (voiceFiles[zoneName]) {
        playVoice(zoneName);
      }
    }

    // پس از پاسخ درست چهارمین قفل برج
    if (
      action === "tower-answer" &&
      typeof towerCompleted !== "undefined" &&
      towerCompleted === true
    ) {
      playVoice("victory");
    }

  });

  // ============================================
  // توقف MP3 هنگام استفاده از راهنمای گوشی
  // ============================================

  const readButton = document.getElementById("andishaRead");
  const stopButton = document.getElementById("andishaStop");

  if (readButton) {
    readButton.addEventListener("click", stopVoice);
  }

  if (stopButton) {
    stopButton.addEventListener("click", stopVoice);
  }

  // ============================================
  // پاک‌سازی هنگام خروج از صفحه
  // ============================================

  window.addEventListener("beforeunload", stopVoice);

  // امکان توقف از بخش‌های دیگر پروژه
  window.andishaStopVoice = stopVoice;

  console.log("🎙️ سیستم صوتی اندیشا فعال شد.");

})();
