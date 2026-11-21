
/* ANDISHA HONOR GALLERY V6 */
(function () {
  "use strict";

  if (window.__andishaHonorGalleryV6) return;
  window.__andishaHonorGalleryV6 = true;

  const DATA_KEY = "andishaExpansionV3";
  const DATE_KEY = "andishaHonorGalleryDatesV6";

  const badgeList = [
    { id: "welcome", icon: "🌟", title: "قهرمان تازه‌وارد" },
    { id: "ex1", icon: "🛍️", title: "شکارچی تخفیف" },
    { id: "ex2", icon: "🍰", title: "آشپز ماهر" },
    { id: "ex3", icon: "🏦", title: "استاد درصد" },
    { id: "ex4", icon: "📐", title: "مهندس نقشه" },
    { id: "all", icon: "👑", title: "قهرمان دانش" }
  ];

  function readData(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function getHero() {
    return readData(DATA_KEY, {});
  }

  function getDates() {
    return readData(DATE_KEY, {});
  }

  function getEarned() {
    const hero = getHero();
    return Array.isArray(hero.badges) ? hero.badges : [];
  }

  function saveDates(dates) {
    try {
      localStorage.setItem(DATE_KEY, JSON.stringify(dates));
    } catch (error) {
      console.warn("Gallery dates could not be saved.", error);
    }
  }

  function syncDates() {
    const dates = getDates();
    const earned = getEarned();
    const today = new Date().toLocaleDateString("fa-IR");

    earned.forEach(function (id) {
      if (!dates[id]) dates[id] = today;
    });

    saveDates(dates);
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  const style = document.createElement("style");
  style.id = "andisha-gallery-v6-style";
  style.textContent = `
    #andisha-gallery-v6 {
      direction:rtl;
      font-family:Tahoma,sans-serif;
      color:#142b52;
    }
    #andisha-gallery-v6 .gallery-head {
      text-align:center;
      padding:18px;
      border-radius:18px;
      background:linear-gradient(135deg,#142b52,#3266a0);
      color:white;
      margin-bottom:14px;
    }
    #andisha-gallery-v6 .gallery-crown {
      font-size:48px;
    }
    #andisha-gallery-v6 .gallery-grid {
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:10px;
    }
    #andisha-gallery-v6 .gallery-item {
      text-align:center;
      padding:15px 8px;
      background:white;
      border:1px solid #e2d3a5;
      border-radius:15px;
      box-shadow:0 3px 10px #142b5210;
    }
    #andisha-gallery-v6 .gallery-icon {
      font-size:36px;
      margin:5px;
    }
    #andisha-gallery-v6 .gallery-item h4 {
      font-size:13px;
      margin:8px 0;
    }
    #andisha-gallery-v6 .gallery-date {
      color:#64748b;
      font-size:10px;
      line-height:1.8;
    }
    #andisha-gallery-v6 .gallery-locked {
      opacity:.38;
      filter:grayscale(1);
    }
    #andisha-gallery-v6 .gallery-print {
      width:100%;
      padding:13px;
      margin-top:15px;
      border:0;
      border-radius:12px;
      background:#bd8b25;
      color:white;
      font:bold 14px Tahoma;
      cursor:pointer;
    }
    @media print {
      body * {
        visibility:hidden !important;
      }
      #andisha-gallery-v6,
      #andisha-gallery-v6 * {
        visibility:visible !important;
      }
      #andisha-gallery-v6 {
        position:absolute !important;
        top:10px;
        right:10px;
        left:10px;
        width:auto;
      }
      #andisha-gallery-v6 .gallery-print {
        display:none !important;
      }
    }
    @media(max-width:350px) {
      #andisha-gallery-v6 .gallery-grid {
        grid-template-columns:1fr;
      }
    }
  `;
  document.head.appendChild(style);

  function renderGallery() {
    syncDates();

    const content = document.getElementById("andisha-v3-content");
    if (!content) return;

    const hero = getHero();
    const earned = getEarned();
    const dates = getDates();

    const earnedCount = badgeList.filter(function (badge) {
      return earned.includes(badge.id);
    }).length;

    const name = hero.name || "قهرمان اندیشا";
    const avatar = hero.avatar || "🧑‍🚀";

    content.innerHTML = `
      <div id="andisha-gallery-v6">
        <div class="gallery-head">
          <div class="gallery-crown">🏆</div>
          <div style="font-size:38px">${escapeHTML(avatar)}</div>
          <h2>گالری افتخارات</h2>
          <h3>${escapeHTML(name)}</h3>
          <p>مجموع نشان‌ها: ${earnedCount} از ${badgeList.length}</p>
        </div>

        <div class="andisha-v3-card">
          <h3>🎖️ مجموعه نشان‌های قهرمانی</h3>
          <div class="gallery-grid">
            ${badgeList.map(function (badge) {
              const unlocked = earned.includes(badge.id);
              return `
                <div class="gallery-item ${unlocked ? "" : "gallery-locked"}">
                  <div class="gallery-icon">${badge.icon}</div>
                  <h4>${badge.title}</h4>
                  <div class="gallery-date">
                    ${unlocked
                      ? "🏅 دریافت‌شده"
                      : "🔒 هنوز دریافت نشده"}
                    ${unlocked
                      ? "<br>ثبت در گالری: " +
                        escapeHTML(dates[badge.id] || "نامشخص")
                      : ""}
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <div class="andisha-v3-card" style="text-align:center">
          <h3>🌟 پیام افتخار</h3>
          <p>هر نشان، یادگار یک تلاش و یک یادگیری تازه است.</p>
          <p><strong>اندیشا؛ مسیر کشف، تلاش و خلاقیت</strong></p>
        </div>

        <button type="button" class="gallery-print"
          data-v6-print>
          🖨️ چاپ کارت افتخارات
        </button>

        <p style="font-size:10px;color:#64748b;text-align:center">
          تاریخ‌های نمایش‌داده‌شده، زمان ثبت نشان در این گالری هستند.
        </p>
      </div>
    `;
  }

  function addGalleryTab() {
    const tabs = document.querySelector(".andisha-v3-tabs");
    if (!tabs || document.getElementById("andisha-gallery-v6-tab")) {
      return;
    }

    const button = document.createElement("button");
    button.id = "andisha-gallery-v6-tab";
    button.type = "button";
    button.textContent = "🏆 گالری افتخارات";
    button.dataset.v6Gallery = "true";
    tabs.appendChild(button);
  }

  document.addEventListener("click", function (event) {
    const galleryButton = event.target.closest("[data-v6-gallery]");
    if (galleryButton) {
      renderGallery();
      return;
    }

    const printButton = event.target.closest("[data-v6-print]");
    if (printButton) {
      window.print();
    }
  });

  function initialize() {
    addGalleryTab();

    const observer = new MutationObserver(function () {
      addGalleryTab();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

  console.log("Andisha Honor Gallery V6 loaded.");
})();
