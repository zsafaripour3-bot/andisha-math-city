
"use strict";

/* ============================================
   ANDISHA VOICE SYSTEM V4
   کنترل یکپارچه صدای راهنما
   جلوگیری از پخش هم‌زمان و اجرای تکراری
   ============================================ */

(function () {
  if (window.__ANDISHA_VOICES_V4__) return;
  window.__ANDISHA_VOICES_V4__ = true;

  const audio = new Audio();
  audio.preload = "none";
  audio.loop = false;
  audio.volume = 1;

  const files = {
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

  let sessionToken = 0;
  let currentVoice = "";
  let voiceSessionActive = false;
  let welcomePlayed = false;
  let victoryPlayed = false;
  let lastZone = -1;

  function getCoordinator() {
    return window.andishaAudioCoordinator || null;
  }

  function stopAudioSource() {
    audio.pause();

    try {
      audio.currentTime = 0;
    } catch (e) {}

    audio.removeAttribute("src");

    try {
      audio.load();
    } catch (e) {}
  }

  function stopVoice(notifyCoordinator) {
    const hadVoice = voiceSessionActive;

    sessionToken++;
    currentVoice = "";
    voiceSessionActive = false;

    stopAudioSource();

    if (notifyCoordinator && hadVoice) {
      const coordinator = getCoordinator();

      if (coordinator && typeof coordinator.afterVoice === "function") {
        coordinator.afterVoice();
      }
    }
  }

  function finishVoice(token) {
    if (token !== sessionToken) return;
    if (!voiceSessionActive) return;

    currentVoice = "";
    voiceSessionActive = false;

    stopAudioSource();

    const coordinator = getCoordinator();

    if (coordinator && typeof coordinator.afterVoice === "function") {
      coordinator.afterVoice();
    }
  }

  function playVoice(name) {
    const filename = files[name];

    if (!filename) return;

    stopVoice(false);

    const token = sessionToken;

    currentVoice = name;
    voiceSessionActive = true;

    const coordinator = getCoordinator();

    if (coordinator && typeof coordinator.beforeVoice === "function") {
      coordinator.beforeVoice();
    }

    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }

    audio.src = "./assets/audio/" + filename;
    audio.currentTime = 0;

    const playPromise = audio.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {
        if (token !== sessionToken) return;
        finishVoice(token);
      });
    }
  }

  function playZoneVoice(index) {
    index = Number(index);

    if (!Number.isInteger(index)) return;
    if (index < 0 || index >= zoneVoices.length) return;

    lastZone = index;
    playVoice(zoneVoices[index]);
  }

  function getZoneIndex(button) {
    if (!button) return -1;

    const values = [
      button.getAttribute("data-index"),
      button.getAttribute("data-zone-index"),
      button.getAttribute("data-zone")
    ];

    for (let i = 0; i < values.length; i++) {
      if (values[i] === null) continue;

      const value = Number(values[i]);

      if (Number.isInteger(value) && value >= 0 && value <= 4) {
        return value;
      }
    }

    return -1;
  }

  function handleAppClick(event) {
    const button = event.target.closest
      ? event.target.closest("button[data-action]")
      : null;

    if (!button) return;

    const action = button.getAttribute("data-action");

    if (action === "story") {
      if (!welcomePlayed) {
        welcomePlayed = true;
        playVoice("welcome");
      }
      return;
    }

    if (action === "city" || action === "reset-progress") {
      victoryPlayed = false;
      stopVoice(true);
      return;
    }

    if (action === "zone") {
      const index = getZoneIndex(button);

      if (index !== -1) {
        playZoneVoice(index);
      }
      return;
    }

    if (action === "replay") {
      if (lastZone !== -1) {
        playZoneVoice(lastZone);
      }
      return;
    }

    if (action === "tower-answer") {
      if (window.towerCompleted && !victoryPlayed) {
        victoryPlayed = true;
        playVoice("victory");
      }
    }
  }

  audio.addEventListener("ended", function () {
    finishVoice(sessionToken);
  });

  audio.addEventListener("error", function () {
    if (currentVoice) {
      finishVoice(sessionToken);
    }
  });

  const app = document.getElementById("app");

  if (app) {
    app.addEventListener("click", handleAppClick, false);
  }

  document.addEventListener("click", function (event) {
    const target = event.target;

    if (!target || !target.closest) return;

    if (
      target.closest("#andishaStop") ||
      target.closest("#andishaRead")
    ) {
      stopVoice(true);
    }
  }, true);

  window.addEventListener("pagehide", function () {
    stopVoice(false);
  });

  window.andishaPlayVoice = playVoice;
  window.andishaPlayZoneVoice = playZoneVoice;
  window.andishaStopVoice = function () {
    stopVoice(true);
  };

  window.andishaVoiceStatus = function () {
    return {
      playing: voiceSessionActive,
      current: currentVoice,
      lastZone: lastZone
    };
  };

  console.log("ANDISHA VOICE SYSTEM V4 READY");
})();
