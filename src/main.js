
/* ANDISHA RELIABLE GAME CLICK HANDLER */

document.addEventListener("click", function(event) {
  const target = event.target;

  if (!target || typeof target.closest !== "function") return;

  const button = target.closest("#app button[data-action]");

  if (!button || button.disabled) return;

  const action = button.dataset.action;

  event.preventDefault();

  switch (action) {
    case "story":
      showStory();
      break;

    case "city":
      showCity();
      break;

    case "zone": {
      const index = Number(button.dataset.zone);

      if (!Number.isInteger(index) || !zones[index]) return;

      const missions = [
        showShop,
        showKitchen,
        showBank,
        showMapWorkshop,
        showTower
      ];

      missions[index]();
      break;
    }

    case "shop-answer":
      checkShopAnswer(Number(button.dataset.answer));
      break;

    case "kitchen-answer":
      checkKitchenAnswer(Number(button.dataset.answer));
      break;

    case "bank-answer":
      checkBankAnswer(Number(button.dataset.answer));
      break;

    case "map-answer":
      checkMapAnswer(Number(button.dataset.answer));
      break;

    case "tower-answer":
      checkTowerAnswer(Number(button.dataset.answer));
      break;
  }
}, true);
