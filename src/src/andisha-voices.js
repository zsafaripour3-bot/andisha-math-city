"use strict";

(function () {
  if (window.__ANDISHA_VOICES_LOADED__) return;
  window.__ANDISHA_VOICES_LOADED__ = true;

  const audioFiles = {
    welcome: "welcome.mp3",
    shop: "shop.mp3",
    kitchen: "kitchen.mp3",
    bank: "bank.mp3",
    map: "map.mp3",
    tower: "tower.mp3",
    victory: "victory.mp3"
  };

  const player = new Audio();
  player.preload = "auto";

  let currentVoice = "";
  let welcomePlayed = false;

  function status(message) {
    const el = document.getElementById("andishaVoiceStatus");
    if (el) el.textContent = message;
  }

  function stopVoice() {
    player.pause();
    player.currentTime = 0;
    currentVoice = "";
  }

  function playVoice(name) {
    const file = audioFiles[name];
    if (!file) return;

    stopVoice();

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    player.src = new URL(
      "./assets/audio/" + file,
      document.baseURI
    ).href;

    currentVoice = name;
    status("در حال پخش صدای اندیشا 🎧");

    const result = player.play();

    if (result && typeof result.catch === "function") {
      result.catch(function () {
        status("برای پخش صدا، دوباره روی صفحه لمس کن.");
      });
    }
  }

  player.addEventListener("ended", function () {
    currentVoice = "";
    status("پخش صدا پایان یافت.");
  });

  player.addEventListener("error", function () {
    currentVoice = "";
    status("فایل صوتی پیدا نشد یا قابل پخش نیست.");
  });

  window.andishaPlayVoice = playVoice;
  window.andishaStopVoice = stopVoice;

  document.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const action = button.dataset.action;

    if (action === "story") {
      stopVoice();

      if (
        button.innerText.includes("شروع ماجراجویی") &&
        !welcomePlayed
      ) {
        welcomePlayed = true;
        playVoice("welcome");
      }
    }

    if (action === "city" || action === "reset-progress") {
      stopVoice();
    }

    if (action === "zone") {
      const zone = button.dataset.zone;

      const zoneVoices = {
        shop: "shop",
        kitchen: "kitchen",
        bank: "bank",
        map: "map",
        tower: "tower"
      };

      if (zoneVoices[zone]) {
        playVoice(zoneVoices[zone]);
      }
    }

    if (action === "replay") {
      const zone = button.dataset.zone;

      const zoneVoices = {
        shop: "shop",
        kitchen: "kitchen",
        bank: "bank",
        map: "map",
        tower: "tower"
      };

      if (zoneVoices[zone]) {
        playVoice(zoneVoices[zone]);
      }
    }

    if (action === "tower-answer" && window.towerCompleted) {
      playVoice("victory");
    }
  });

  const readButton = document.getElementById("andishaRead");
  const stopButton = document.getElementById("andishaStop");

  if (readButton) {
    readButton.addEventListener("click", stopVoice, true);
  }

  if (stopButton) {
    stopButton.addEventListener("click", stopVoice, true);
  }

})();
