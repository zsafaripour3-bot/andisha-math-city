
/* 🎵 ANDISHA UNIFIED MUSIC & VOICE STUDIO */
(function () {
  "use strict";

  if (window.__andishaUnifiedStudio) return;
  window.__andishaUnifiedStudio = true;

  const STORAGE = {
    enabled: "andishaUnifiedEnabled",
    track: "andishaUnifiedTrack",
    volume: "andishaUnifiedVolume"
  };

  // بازیابی تنظیمات قبلی
  function getOldEnabled() {
    const newValue = localStorage.getItem(STORAGE.enabled);
    if (newValue !== null) return newValue === "true";

    const oldValue = localStorage.getItem("andishaMusicEnabled");
    if (oldValue !== null) return oldValue === "true";

    const previousValue = localStorage.getItem("andishaMusic");
    return previousValue === "true";
  }

  function getOldTrack() {
    const saved = localStorage.getItem(STORAGE.track);
    if (saved !== null) return Number(saved) || 0;

    const oldTrack = localStorage.getItem("andishaMusicTrack");

    if (oldTrack === "calm") return 0;
    if (oldTrack === "adventure") return 2;
    if (oldTrack === "happy") return 1;

    return Number(localStorage.getItem("andishaTrack")) || 0;
  }

  function getOldVolume() {
    const saved = localStorage.getItem(STORAGE.volume);
    if (saved !== null) return Number(saved);

    const oldVolume = localStorage.getItem("andishaMusicVolume");
    if (oldVolume !== null) return Math.round(Number(oldVolume) * 100);

    const previousVolume = localStorage.getItem("andishaVolume");
    if (previousVolume !== null) return Number(previousVolume);

    return 35;
  }

  let enabled = getOldEnabled();
  let track = Math.max(0, Math.min(2, getOldTrack()));
  let volume = Math.max(0, Math.min(100, getOldVolume()));

  let audio = null;
  let master = null;
  let musicTimer = null;
  let noteIndex = 0;
  let oldURL = null;

  const tracks = [
    {
      name: "🌙 موسیقی آرام",
      notes: [392, 440, 494, 440, 392, 330, 392, 440]
    },
    {
      name: "🎈 موسیقی شاد کودکانه",
      notes: [523, 659, 784, 659, 587, 698, 784, 880]
    },
    {
      name: "🚀 موسیقی ماجراجویانه",
      notes: [330, 392, 494, 587, 494, 392, 330, 294]
    }
  ];

  function setupAudio() {
    if (audio) {
      if (audio.state === "suspended") {
        audio.resume();
      }
      return true;
    }

    const AudioAPI = window.AudioContext || window.webkitAudioContext;
    if (!AudioAPI) return false;

    audio = new AudioAPI();
    master = audio.createGain();
    master.gain.value = volume / 100;
    master.connect(audio.destination);

    return true;
  }

  function tone(freq, duration, type, strength) {
    if (!audio || !master || !enabled) return;

    const oscillator = audio.createOscillator();
    const gain = audio.createGain();

    oscillator.type = type || "sine";
    oscillator.frequency.value = freq;

    gain.gain.setValueAtTime(strength || 0.08, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audio.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(master);

    oscillator.start();
    oscillator.stop(audio.currentTime + duration);
  }

  function startMusic() {
    if (!enabled || musicTimer) return;

    if (!setupAudio()) {
      status.textContent = "مرورگر از پخش موسیقی پشتیبانی نمی‌کند.";
      return;
    }

    noteIndex = 0;

    function playNote() {
      if (!enabled || !audio) return;

      const melody = tracks[track].notes;
      const frequency = melody[noteIndex % melody.length];

      tone(frequency, 0.24, "triangle", 0.055);
      noteIndex++;
    }

    playNote();
    musicTimer = setInterval(playNote, 330);
    status.textContent = "🎵 موسیقی در حال پخش است";
  }

  function stopMusic() {
    if (musicTimer) {
      clearInterval(musicTimer);
    }

    musicTimer = null;
  }

  function correctSound() {
    if (!enabled || !setupAudio()) return;

    tone(659, 0.15, "sine", 0.13);
    setTimeout(() => tone(784, 0.2, "sine", 0.13), 120);
    setTimeout(() => tone(988, 0.25, "sine", 0.13), 250);
  }

  function wrongSound() {
    if (!enabled || !setupAudio()) return;

    tone(240, 0.2, "triangle", 0.10);
    setTimeout(() => tone(190, 0.22, "triangle", 0.08), 150);
  }

  // پنل اصلی صدا
  const panel = document.createElement("section");
  panel.id = "andishaMusicStudio";
  panel.dir = "rtl";

  panel.style.cssText = `
    position:fixed;
    bottom:12px;
    left:10px;
    z-index:99999;
    width:calc(100% - 20px);
    max-width:360px;
    max-height:48vh;
    overflow-y:auto;
    padding:12px;
    border:2px solid #f5c75e;
    border-radius:18px;
    background:linear-gradient(135deg,#142b52,#315b91);
    color:white;
    font-family:Tahoma,sans-serif;
    box-shadow:0 5px 20px #0005;
  `;

  panel.innerHTML = `
    <button id="andishaStudioToggle" type="button"
      style="width:100%;padding:11px;border:0;border-radius:12px;
      background:#f5c75e;color:#142b52;font-weight:bold">
      🎵 ابزارهای صدا
    </button>

    <div id="andishaStudioContent" hidden>
      <h3 style="text-align:center">🎵 استودیوی موسیقی اندیشا</h3>

      <button id="andishaMusicToggle" type="button"
        style="width:100%;padding:10px;border:0;border-radius:10px;
        background:#f5c75e;color:#142b52;font-weight:bold">
        ${enabled ? "🔊 خاموش کردن صدا" : "🔇 روشن کردن صدا"}
      </button>

      <label style="display:block;margin-top:12px">🎼 انتخاب موسیقی</label>
      <select id="andishaTrack"
        style="width:100%;padding:10px;border-radius:10px;margin-top:6px">
        ${tracks.map((item, index) =>
          `<option value="${index}">${item.name}</option>`
        ).join("")}
      </select>

      <label for="andishaVolume" style="display:block;margin-top:12px">
        🔉 میزان صدا
      </label>
      <input id="andishaVolume" type="range"
        min="0" max="100" value="${volume}" style="width:100%">

      <hr style="border-color:#ffffff55;margin:15px 0">

      <h3>🎧 موسیقی دلخواه من</h3>
      <p>یک فایل صوتی از گوشی انتخاب کن:</p>

      <input id="andishaMusicFile" type="file"
        accept="audio/*" style="max-width:100%;color:white">

      <audio id="andishaPhonePlayer" controls
        style="width:100%;margin-top:10px"></audio>

      <p id="andishaPhoneMessage">هنوز آهنگی انتخاب نشده است.</p>

      <hr style="border-color:#ffffff55;margin:15px 0">

      <h3>🎙️ راهنمای صوتی قهرمان</h3>

      <button id="andishaRead" type="button"
        style="padding:10px;border:0;border-radius:10px;
        background:#f5c75e;color:#142b52;font-weight:bold">
        🔊 خواندن راهنمای این صفحه
      </button>

      <button id="andishaStop" type="button"
        style="padding:10px;border:0;border-radius:10px;margin:5px">
        ⏹ توقف
      </button>

      <p id="andishaVoiceStatus">راهنمای صوتی آماده است.</p>

      <p id="andishaMusicStatus">موسیقی پس‌زمینه بازی</p>
    </div>
  `;

  document.body.appendChild(panel);

  const content = document.getElementById("andishaStudioContent");
  const expandButton = document.getElementById("andishaStudioToggle");
  const toggle = document.getElementById("andishaMusicToggle");
  const selector = document.getElementById("andishaTrack");
  const slider = document.getElementById("andishaVolume");
  const status = document.getElementById("andishaMusicStatus");

  const picker = document.getElementById("andishaMusicFile");
  const player = document.getElementById("andishaPhonePlayer");
  const phoneMessage = document.getElementById("andishaPhoneMessage");

  const voiceStatus = document.getElementById("andishaVoiceStatus");
  const readButton = document.getElementById("andishaRead");
  const stopButton = document.getElementById("andishaStop");

  selector.value = String(track);
  player.volume = volume / 100;

  expandButton.addEventListener("click", function () {
    content.hidden = !content.hidden;
    expandButton.textContent = content.hidden
      ? "🎵 ابزارهای صدا"
      : "✖ بستن ابزارهای صدا";
  });

  toggle.addEventListener("click", function () {
    enabled = !enabled;
    localStorage.setItem(STORAGE.enabled, String(enabled));

    toggle.textContent = enabled
      ? "🔊 خاموش کردن صدا"
      : "🔇 روشن کردن صدا";

    if (enabled) {
      startMusic();
    } else {
      stopMusic();
      status.textContent = "صدا خاموش شد.";
    }
  });

  selector.addEventListener("change", function () {
    track = Number(selector.value);
    localStorage.setItem(STORAGE.track, String(track));

    if (enabled) {
      stopMusic();
      startMusic();
    }
  });

  slider.addEventListener("input", function () {
    volume = Number(slider.value);
    localStorage.setItem(STORAGE.volume, String(volume));

    if (master) {
      master.gain.value = volume / 100;
    }

    player.volume = volume / 100;
  });

  // انتخاب موسیقی از گوشی
  picker.addEventListener("change", function () {
    const file = picker.files[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      phoneMessage.textContent = "لطفاً یک فایل صوتی انتخاب کن.";
      return;
    }

    if (oldURL) {
      URL.revokeObjectURL(oldURL);
    }

    oldURL = URL.createObjectURL(file);
    player.src = oldURL;
    player.load();

    phoneMessage.textContent = "🎵 آهنگ انتخاب شد؛ دکمه پخش را بزن!";
  });

  player.addEventListener("play", function () {
    stopMusic();
    status.textContent = "🎧 موسیقی انتخابی گوشی در حال پخش است.";
  });

  player.addEventListener("pause", function () {
    status.textContent = "پخش موسیقی گوشی متوقف شد.";
  });

  // راهنمای صوتی فارسی
  readButton.addEventListener("click", function () {
    if (!("speechSynthesis" in window)) {
      voiceStatus.textContent = "مرورگر از راهنمای صوتی پشتیبانی نمی‌کند.";
      return;
    }

    window.speechSynthesis.cancel();

    const main = document.querySelector("#app main");

    if (!main) {
      voiceStatus.textContent = "ابتدا وارد یک مأموریت شو.";
      return;
    }

    const parts = main.querySelectorAll(
      "h1,h2,h3,p,.shop-options button"
    );

    const message = Array.from(parts)
      .map(element => element.innerText.trim())
      .filter(Boolean)
      .join(". ");

    if (!message) {
      voiceStatus.textContent = "متنی برای خواندن پیدا نشد.";
      return;
    }

    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = "fa-IR";
    speech.rate = 0.88;
    speech.pitch = 1;

    speech.onstart = function () {
      voiceStatus.textContent = "🔊 در حال خواندن...";
    };

    speech.onend = function () {
      voiceStatus.textContent = "خواندن تمام شد 🌟";
    };

    speech.onerror = function () {
      voiceStatus.textContent = "صدای فارسی گوشی را بررسی کن.";
    };

    window.speechSynthesis.speak(speech);
  });

  stopButton.addEventListener("click", function () {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    voiceStatus.textContent = "صدا متوقف شد.";
  });

  // توقف خواندن هنگام جابه‌جایی مأموریت‌ها
  app.addEventListener("click", function () {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      voiceStatus.textContent = "راهنمای صوتی آماده است.";
    }
  });

  // پخش افکت پاسخ درست و نادرست
  document.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button || !button.dataset.action) return;

    const action = button.dataset.action;
    const answer = Number(button.dataset.answer);

    let expected = null;

    if (action === "shop-answer") expected = 150000;
    if (action === "kitchen-answer") expected = 4;
    if (action === "bank-answer") expected = 50000;
    if (action === "map-answer") expected = 14;

    if (action === "tower-answer") {
      const question = towerQuestions[towerStep];
      if (question) expected = question.answer;
    }

    if (expected !== null) {
      if (answer === expected) {
        correctSound();
      } else {
        wrongSound();
      }
    }
  }, true);

  window.addEventListener("beforeunload", function () {
    stopMusic();

    if (oldURL) {
      URL.revokeObjectURL(oldURL);
    }
  });

  localStorage.setItem(STORAGE.enabled, String(enabled));
  localStorage.setItem(STORAGE.track, String(track));
  localStorage.setItem(STORAGE.volume, String(volume));
})();
