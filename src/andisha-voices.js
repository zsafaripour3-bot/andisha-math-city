"use strict";

(function () {
  if (window.__ANDISHA_VOICES_LOADED__) return;
  window.__ANDISHA_VOICES_LOADED__ = true;

  const files = {
    welcome: "welcome.mp3",
    shop: "shop.mp3",
    kitchen: "kitchen.mp3",
    bank: "bank.mp3",
    map: "map.mp3",
    tower: "tower.mp3",
    victory: "victory.mp3"
  };

  const audio = new Audio();
  audio.preload = "auto";

  function stop() {
    audio.pause();
    audio.currentTime = 0;
  }

  function play(name) {
    if (!files[name]) return;

    stop();

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    audio.src = new URL(
      "./assets/audio/" + files[name],
      document.baseURI
    ).href;

    const status = document.getElementById("andishaVoiceStatus");
    if (status) status.textContent = "🎧 صدای اندیشا در حال پخش است.";

    const result = audio.play();

    if (result && result.catch) {
      result.catch(function () {
        if (status) status.textContent = "پخش صدا انجام نشد؛ دوباره تلاش کن.";
      });
    }
  }

  audio.addEventListener("ended", function () {
    const status = document.getElementById("andishaVoiceStatus");
    if (status) status.textContent = "پخش صدا پایان یافت.";
  });

  audio.addEventListener("error", function () {
    const status = document.getElementById("andishaVoiceStatus");
    if (status) status.textContent = "خطا در بارگذاری فایل صوتی.";
  });

  window.andishaPlayVoice = play;
  window.andishaStopVoice = stop;

  document.addEventListener("click", function (event) {
    const button = event.target.closest &&
      event.target.closest("#andishaRead, #andishaStop");

    if (button) stop();
  }, true);
})();
