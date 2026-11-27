
"use strict";

/* ============================================
   ANDISHA VOICE SYSTEM V6
   هماهنگ با استودیوی موسیقی اندیشا
   ============================================ */

(function() {

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

  let voicePlaying = false;

  function status(message) {
    const element = document.getElementById("andishaVoiceStatus");
    if (element) element.textContent = message;
  }

  function coordinator() {
    return window.andishaAudioCoordinator || null;
  }

  function stop(silent) {
    playToken++;

    voice.pause();

    try {
      voice.currentTime = 0;
    } catch (error) {}

    const wasPlaying = voicePlaying;
    voicePlaying = false;

    if (wasPlaying && !silent) {
      const control = coordinator();
      if (control) control.afterVoice();
    }

    if (!silent) {
      status("🔇 پخش صدا متوقف شد.");
    }
  }

  function play(name) {
    if (!files[name]) return;

    stop(true);

    const token = ++playToken;

    const control = coordinator();

    if (control) {
      control.beforeVoice();
    }

    voicePlaying = true;

    voice.src = new URL(
      "./assets/audio/" + files[name],
      document.baseURI
    ).href;

    status("🎧 صدای اندیشا در حال پخش است.");

    const result = voice.play();

    if (result && result.catch) {
      result.catch(function(error) {
        if (token !== playToken) return;

        console.warn("Andisha voice:", error);

        finishVoice();
        status("پخش صدا انجام نشد.");
      });
    }
  }

  function finishVoice() {
    if (!voicePlaying) return;

    voicePlaying = false;

    const control = coordinator();

    if (control) {
      control.afterVoice();
    }
  }

  voice.addEventListener("ended", function() {
    finishVoice();
    status("🌟 پخش صدا پایان یافت.");
  });

  voice.addEventListener("error", function() {
    finishVoice();
    console.warn("Audio file error:", voice.src);
    status("خطا در بارگذاری فایل صوتی.");
  });

  window.andishaPlayVoice = play;
  window.andishaStopVoice = stop;

  // حذف راهنمای گفتاری قدیمی
  function removeGuideButtons() {
    ["andishaRead", "andishaStop"].forEach(function(id) {
      const element = document.getElementById(id);
      if (element) element.remove();
    });
  }

  const guideObserver = new MutationObserver(removeGuideButtons);

  function startGuideRemoval() {
    removeGuideButtons();

    guideObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.body) {
    startGuideRemoval();
  } else {
    document.addEventListener("DOMContentLoaded", startGuideRemoval);
  }

  // تشخیص صفحه قهرمانی
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

    const observer = new MutationObserver(checkVictory);

    observer.observe(app, {
      childList: true,
      subtree: true,
      characterData: true
    });

    checkVictory();
  }

  startVictoryObserver();

  // مدیریت کلیک‌های بازی
  document.addEventListener("click", function(event) {
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

      return;
    }

    // پاسخ‌های درست و نادرست
    const answerActions = [
      "shop-answer",
      "kitchen-answer",
      "bank-answer",
      "map-answer",
      "tower-answer"
    ];

    if (answerActions.includes(action)) {
      stop(true);

      const answer = Number(button.dataset.answer);

      let expected = null;

      if (action === "shop-answer") expected = 150000;
      if (action === "kitchen-answer") expected = 4;
      if (action === "bank-answer") expected = 50000;
      if (action === "map-answer") expected = 14;

      if (action === "tower-answer") {
        const questions = window.towerQuestions;
        if (questions && questions.length) {
          expected = questions[window.towerStep]?.answer ?? null;
        }
      }

      const control = coordinator();

      if (control && expected !== null) {
        control.playFeedback(answer === expected);
      }
    }

  }, true);

  console.log("ANDISHA VOICE SYSTEM V6 READY");

})();
