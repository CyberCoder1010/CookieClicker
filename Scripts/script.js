const gameState = {
  cookies: 0,
  cookiesPerClick: 1,
  cookiesPerSecond: 0,
  totalClicks: 0,
  upgrades: [],
  achievements: [],
  lastSave: Date.now(),
  criticalChance: 0.05,
  goldenCookieSpawnTimer: 0,
  goldenCookiesClicked: 0,
};

const upgrades = [
  {
    id: "cursor",
    name: "Cursor",
    description: "Autoclicks once every 10 seconds",
    cost: 15,
    baseCost: 15,
    icon: "fas fa-mouse-pointer",
    effect: { cps: 0.1 },
    owned: 0,
  },
  {
    id: "grandma",
    name: "Grandma",
    description: "A nice grandma to bake cookies for you",
    cost: 100,
    baseCost: 100,
    icon: "fas fa-user",
    effect: { cps: 1 },
    owned: 0,
  },
  {
    id: "farm",
    name: "Farm",
    description: "Grows cookie plants from cookie seeds",
    cost: 500,
    baseCost: 500,
    icon: "fas fa-tractor",
    effect: { cps: 5 },
    owned: 0,
  },
  {
    id: "mine",
    name: "Mine",
    description: "Mines out cookie dough and chocolate chips",
    cost: 2000,
    baseCost: 2000,
    icon: "fas fa-mountain",
    effect: { cps: 10 },
    owned: 0,
  },
  {
    id: "factory",
    name: "Factory",
    description: "Produces large quantities of cookies",
    cost: 7000,
    baseCost: 7000,
    icon: "fas fa-industry",
    effect: { cps: 40 },
    owned: 0,
  },
  {
    id: "bank",
    name: "Bank",
    description: "Generates cookies from interest",
    cost: 50000,
    baseCost: 50000,
    icon: "fas fa-landmark",
    effect: { cps: 100 },
    owned: 0,
  },
  {
    id: "temple",
    name: "Temple",
    description: "Full of precious, ancient chocolate",
    cost: 200000,
    baseCost: 200000,
    icon: "fas fa-place-of-worship",
    effect: { cps: 400 },
    owned: 0,
  },
  {
    id: "wizard",
    name: "Wizard Tower",
    description: "Magically creates cookies out of nothing",
    cost: 1666666,
    baseCost: 1666666,
    icon: "fas fa-hat-wizard",
    effect: { cps: 6666 },
    owned: 0,
  },
  {
    id: "time-machine",
    name: "Time Machine",
    description: "Brings cookies from the past and future",
    cost: 12345678,
    baseCost: 12345678,
    icon: "fas fa-clock",
    effect: { cps: 98765 },
    owned: 0,
  },
  {
    id: "cookie-god",
    name: "Cookie God",
    description: "Divine intervention for cookie production",
    cost: 99999999,
    baseCost: 99999999,
    icon: "fas fa-crown",
    effect: { cps: 500000 },
    owned: 0,
  },
  {
    id: "antimatter",
    name: "Antimatter Condenser",
    description: "Converts antimatter into cookies",
    cost: 500000000,
    baseCost: 500000000,
    icon: "fas fa-atom",
    effect: { cps: 2500000 },
    owned: 0,
  },
  {
    id: "prism",
    name: "Light Prism",
    description: "Harnesses light energy for cookies",
    cost: 10000000000,
    baseCost: 10000000000,
    icon: "fas fa-sun",
    effect: { cps: 10000000 },
    owned: 0,
  },
  {
    id: "chancemaker",
    name: "Chancemaker",
    description: "Creates cookies from pure luck",
    cost: 1000000000000,
    baseCost: 1000000000000,
    icon: "fas fa-dice",
    effect: { cps: 500000000 },
    owned: 0,
  },
  {
    id: "infinity",
    name: "Infinity Engine",
    description: "Generates cookies from parallel universes",
    cost: 1e15,
    baseCost: 1e15,
    icon: "fas fa-infinity",
    effect: { cps: 1e9 },
    owned: 0,
  },
];

const achievements = [
  {
    id: "first_click",
    name: "First Click",
    description: "Bake your first cookie",
    icon: "fas fa-star",
    condition: (state) => state.cookies >= 1,
    unlocked: false,
    tier: "bronze",
  },
  {
    id: "ten_cookies",
    name: "Ten Cookies",
    description: "Bake 10 cookies",
    icon: "fas fa-cookie",
    condition: (state) => state.cookies >= 10,
    unlocked: false,
    tier: "bronze",
  },
  {
    id: "hundred_cookies",
    name: "Hundred Cookies",
    description: "Bake 100 cookies",
    icon: "fas fa-cookie-bite",
    condition: (state) => state.cookies >= 100,
    unlocked: false,
    tier: "silver",
  },
  {
    id: "thousand_cookies",
    name: "Thousand Cookies",
    description: "Bake 1,000 cookies",
    icon: "fas fa-bread-slice",
    condition: (state) => state.cookies >= 1000,
    unlocked: false,
    tier: "silver",
  },
  {
    id: "million_cookies",
    name: "Million Cookies",
    description: "Bake 1,000,000 cookies",
    icon: "fas fa-crown",
    condition: (state) => state.cookies >= 1000000,
    unlocked: false,
    tier: "gold",
  },
  {
    id: "billion_cookies",
    name: "Billion Cookies",
    description: "Bake 1,000,000,000 cookies",
    icon: "fas fa-gem",
    condition: (state) => state.cookies >= 1000000000,
    unlocked: false,
    tier: "gold",
  },
  {
    id: "trillion_cookies",
    name: "Trillion Cookies",
    description: "Bake 1,000,000,000,000 cookies",
    icon: "fas fa-rocket",
    condition: (state) => state.cookies >= 1e12,
    unlocked: false,
    tier: "platinum",
  },
  {
    id: "ten_clicks",
    name: "Ten Clicks",
    description: "Click the cookie 10 times",
    icon: "fas fa-hand-pointer",
    condition: (state) => state.totalClicks >= 10,
    unlocked: false,
    tier: "bronze",
  },
  {
    id: "hundred_clicks",
    name: "Hundred Clicks",
    description: "Click the cookie 100 times",
    icon: "fas fa-mouse",
    condition: (state) => state.totalClicks >= 100,
    unlocked: false,
    tier: "silver",
  },
  {
    id: "thousand_clicks",
    name: "Thousand Clicks",
    description: "Click the cookie 1,000 times",
    icon: "fas fa-fingerprint",
    condition: (state) => state.totalClicks >= 1000,
    unlocked: false,
    tier: "gold",
  },
  {
    id: "ten_thousand_clicks",
    name: "Ten Thousand Clicks",
    description: "Click the cookie 10,000 times",
    icon: "fas fa-hand-sparkles",
    condition: (state) => state.totalClicks >= 10000,
    unlocked: false,
    tier: "platinum",
  },
  {
    id: "first_upgrade",
    name: "First Upgrade",
    description: "Purchase your first upgrade",
    icon: "fas fa-shopping-cart",
    condition: (state) => state.upgrades.some((u) => u.owned > 0),
    unlocked: false,
    tier: "bronze",
  },
  {
    id: "five_upgrades",
    name: "Five Upgrades",
    description: "Purchase five different upgrades",
    icon: "fas fa-boxes",
    condition: (state) => state.upgrades.filter((u) => u.owned > 0).length >= 5,
    unlocked: false,
    tier: "silver",
  },
  {
    id: "all_upgrades",
    name: "All Upgrades",
    description: "Purchase at least one of every upgrade",
    icon: "fas fa-chess-queen",
    condition: (state) => state.upgrades.every((u) => u.owned > 0),
    unlocked: false,
    tier: "gold",
  },
  {
    id: "cookie_tycoon",
    name: "Cookie Tycoon",
    description: "Own 10 of every upgrade",
    icon: "fas fa-trophy",
    condition: (state) => state.upgrades.every((u) => u.owned >= 10),
    unlocked: false,
    tier: "gold",
  },
  {
    id: "cookie_emperor",
    name: "Cookie Emperor",
    description: "Own 100 of every upgrade",
    icon: "fas fa-chess-king",
    condition: (state) => state.upgrades.every((u) => u.owned >= 100),
    unlocked: false,
    tier: "platinum",
  },
  {
    id: "cps_master",
    name: "CPS Master",
    description: "Reach 1,000 cookies per second",
    icon: "fas fa-bolt",
    condition: (state) => state.cookiesPerSecond >= 1000,
    unlocked: false,
    tier: "gold",
  },
  {
    id: "cps_god",
    name: "CPS God",
    description: "Reach 1,000,000 cookies per second",
    icon: "fas fa-bolt-lightning",
    condition: (state) => state.cookiesPerSecond >= 1000000,
    unlocked: false,
    tier: "platinum",
  },
  {
    id: "critical_hit",
    name: "Critical Hit!",
    description: "Get a critical hit on the cookie",
    icon: "fas fa-bullseye",
    condition: (state) => state.totalClicks > 0,
    unlocked: false,
    tier: "bronze",
  },
  {
    id: "critical_master",
    name: "Critical Master",
    description: "Get 100 critical hits",
    icon: "fas fa-crosshairs",
    condition: (state) => (state.criticalHits || 0) >= 100,
    unlocked: false,
    tier: "gold",
  },
  {
    id: "golden_collector",
    name: "Golden Collector",
    description: "Click 10 golden cookies",
    icon: "fas fa-coins",
    condition: (state) => state.goldenCookiesClicked >= 10,
    unlocked: false,
    tier: "silver",
  },
  {
    id: "golden_hoarder",
    name: "Golden Hoarder",
    description: "Click 100 golden cookies",
    icon: "fas fa-coins",
    condition: (state) => state.goldenCookiesClicked >= 100,
    unlocked: false,
    tier: "platinum",
  },
];

const cookieElement = document.getElementById("cookie");
const cookieCountElement = document.getElementById("cookie-count");
const cpsElement = document.getElementById("cps");
const clicksElement = document.getElementById("clicks");
const cookiesPerClickElement = document.getElementById("cookies-per-click");
const upgradesContainer = document.getElementById("upgrades-container");
const achievementsContainer = document.getElementById("achievements-container");
const popupElement = document.getElementById("popup");
const saveNoticeElement = document.getElementById("save-notice");

function initGame() {
  loadGame();
  renderUpgrades();
  renderAchievements();
  updateUI();

  cookieElement.addEventListener("click", handleCookieClick);

  setInterval(gameLoop, 100);
  setInterval(saveGame, 30000);
  setInterval(spawnGoldenCookie, 30000);
  setInterval(updateGoldenCookies, 100);
}

function gameLoop() {
  gameState.cookies += gameState.cookiesPerSecond / 10;
  gameState.goldenCookieSpawnTimer++;
  checkAchievements();
  updateUI();
  if (gameState.goldenCookieSpawnTimer > 300) {
    spawnGoldenCookie();
    gameState.goldenCookieSpawnTimer = 0;
  }
}

function handleCookieClick(event) {
  const rect = cookieElement.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  let cookiesGained = gameState.cookiesPerClick;
  if (Math.random() < gameState.criticalChance) {
    cookiesGained *= 3;
    showCriticalHit(x, y);
    gameState.criticalHits = (gameState.criticalHits || 0) + 1;
    unlockAchievement("critical_hit");
  }
  gameState.cookies += cookiesGained;
  gameState.totalClicks++;
  createParticles(x, y);
}

function createParticles(x, y) {
  for (let i = 0; i < 12; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    const size = Math.random() * 15 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 100 + 50;
    const endX = x + Math.cos(angle) * distance;
    const endY = y + Math.sin(angle) * distance;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    cookieElement.appendChild(particle);
    const animation = particle.animate(
      [
        { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
        {
          transform: `translate(${endX - x}px, ${endY - y}px) rotate(${
            Math.random() * 360
          }deg)`,
          opacity: 0,
        },
      ],
      { duration: Math.random() * 1000 + 500, easing: "ease-out" }
    );
    animation.onfinish = () => particle.remove();
  }
}

function showCriticalHit(x, y) {
  const critText = document.createElement("div");
  critText.className = "critical-hit";
  critText.textContent = "CRITICAL HIT!";
  critText.style.left = `${x}px`;
  critText.style.top = `${y}px`;
  cookieElement.appendChild(critText);
  setTimeout(() => critText.remove(), 1000);
}

function spawnGoldenCookie() {
  if (gameState.cookiesPerSecond < 10) return;
  const goldenCookie = document.createElement("div");
  goldenCookie.className = "golden-cookie";
  goldenCookie.innerHTML = '<i class="fas fa-star"></i>';
  const x = Math.random() * (window.innerWidth - 100) + 50;
  const y = Math.random() * (window.innerHeight - 100) + 50;
  goldenCookie.style.left = `${x}px`;
  goldenCookie.style.top = `${y}px`;
  goldenCookie.addEventListener("click", () => {
    const bonus = gameState.cookiesPerSecond * 10;
    gameState.cookies += bonus;
    gameState.goldenCookiesClicked++;
    showPopup(
      "Golden Cookie!",
      `You found a golden cookie and earned ${formatNumber(bonus)} cookies!`
    );
    goldenCookie.remove();
    if (gameState.goldenCookiesClicked >= 10)
      unlockAchievement("golden_collector");
    if (gameState.goldenCookiesClicked >= 100)
      unlockAchievement("golden_hoarder");
  });
  document.body.appendChild(goldenCookie);
  setTimeout(() => goldenCookie.remove(), 10000);
}

function updateGoldenCookies() {}

function purchaseUpgrade(upgradeId) {
  const upgrade = gameState.upgrades.find((u) => u.id === upgradeId);
  if (!upgrade) return;
  if (gameState.cookies >= upgrade.cost) {
    gameState.cookies -= upgrade.cost;
    upgrade.owned++;
    upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.owned));
    if (upgrade.effect.cps) gameState.cookiesPerSecond += upgrade.effect.cps;
    showPopup(
      `Purchased: ${upgrade.name}`,
      `You now have ${upgrade.owned} ${upgrade.name}s`
    );
    if (upgrade.owned === 1) unlockAchievement("first_upgrade");
    if (gameState.upgrades.filter((u) => u.owned > 0).length >= 5)
      unlockAchievement("five_upgrades");
    if (gameState.upgrades.every((u) => u.owned > 0))
      unlockAchievement("all_upgrades");
    if (gameState.upgrades.every((u) => u.owned >= 10))
      unlockAchievement("cookie_tycoon");
    if (gameState.upgrades.every((u) => u.owned >= 100))
      unlockAchievement("cookie_emperor");
    updateUI();
    renderUpgrades();
  }
}

function unlockAchievement(achievementId) {
  const achievement = gameState.achievements.find(
    (a) => a.id === achievementId
  );
  if (achievement && !achievement.unlocked) {
    achievement.unlocked = true;
    showAchievementPopup(achievement);
    renderAchievements();
    playAchievementSound();
    if (achievementId === "critical_hit") gameState.criticalChance = 0.1;
    if (achievementId === "cps_master") gameState.cookiesPerClick += 5;
  }
}

function checkAchievements() {
  gameState.achievements.forEach((achievement) => {
    if (!achievement.unlocked && achievement.condition(gameState)) {
      unlockAchievement(achievement.id);
    }
  });
}

function showAchievementPopup(achievement) {
  popupElement.querySelector(".popup-title").textContent = achievement.name;
  popupElement.querySelector(".popup-message").textContent =
    achievement.description;
  popupElement.classList.add("achievement-popup");
  popupElement.querySelector(
    ".popup-icon"
  ).innerHTML = `<i class="${achievement.icon}"></i>`;
  popupElement.classList.add("show");
  setTimeout(() => popupElement.classList.remove("show"), 5000);
}

function showPopup(title, message) {
  popupElement.querySelector(".popup-title").textContent = title;
  popupElement.querySelector(".popup-message").textContent = message;
  popupElement.classList.remove("achievement-popup");
  popupElement.querySelector(".popup-icon").innerHTML =
    '<i class="fas fa-info-circle"></i>';
  popupElement.classList.add("show");
  setTimeout(() => popupElement.classList.remove("show"), 3000);
}

function playAchievementSound() {
  const sound = new Audio(
    "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYmPkpWXmpyeoaOlp6mqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/wABAgMEBQYHCAkKCwwNDg8QERITFBUWFxgZGhscHR4fICEiIyQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj9AQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpbXF1eX2BhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ent8fX5/gIGCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/"
  );
  sound.volume = 0.3;
  sound.play();
}

function showSaveNotice() {
  saveNoticeElement.classList.add("show");
  setTimeout(() => saveNoticeElement.classList.remove("show"), 2000);
}

function formatNumber(num) {
  if (num >= 1e15) return (num / 1e15).toFixed(2) + "Qd";
  if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return Math.floor(num);
}

function updateUI() {
  cookieCountElement.textContent = formatNumber(gameState.cookies);
  cpsElement.textContent = formatNumber(gameState.cookiesPerSecond);
  clicksElement.textContent = formatNumber(gameState.totalClicks);
  cookiesPerClickElement.textContent = gameState.cookiesPerClick;
  updateUpgradesAvailability();
}

function renderUpgrades() {
  upgradesContainer.innerHTML = "";
  gameState.upgrades.forEach((upgrade) => {
    const upgradeElement = document.createElement("div");
    upgradeElement.className = "upgrade";
    upgradeElement.id = `upgrade-${upgrade.id}`;
    if (gameState.cookies < upgrade.cost)
      upgradeElement.classList.add("disabled");
    const progress = Math.min(100, (gameState.cookies / upgrade.cost) * 100);
    upgradeElement.innerHTML = `
                    <div class="upgrade-header">
                        <div class="upgrade-icon"><i class="${
                          upgrade.icon
                        }"></i></div>
                        <div class="upgrade-name">${upgrade.name}</div>
                        <div class="upgrade-owned">${upgrade.owned}</div>
                    </div>
                    <div class="upgrade-description">${
                      upgrade.description
                    }</div>
                    <div class="upgrade-cost">
                        <span>Cost: ${formatNumber(upgrade.cost)} cookies</span>
                        <span class="upgrade-effect">+${
                          upgrade.effect.cps
                        } CPS</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${progress}%"></div>
                    </div>
                `;
    upgradeElement.addEventListener("click", () => {
      if (!upgradeElement.classList.contains("disabled"))
        purchaseUpgrade(upgrade.id);
    });
    upgradesContainer.appendChild(upgradeElement);
  });
}

function renderAchievements() {
  achievementsContainer.innerHTML = "";
  gameState.achievements.forEach((achievement) => {
    const achievementElement = document.createElement("div");
    achievementElement.className = `achievement ${achievement.tier} ${
      achievement.unlocked ? "unlocked" : ""
    }`;
    achievementElement.innerHTML = `
                    <div class="achievement-icon"><i class="${achievement.icon}"></i></div>
                    <div class="achievement-info">
                        <div class="achievement-name">${achievement.name}</div>
                        <div class="achievement-desc">${achievement.description}</div>
                    </div>
                `;
    achievementsContainer.appendChild(achievementElement);
  });
}

function updateUpgradesAvailability() {
  gameState.upgrades.forEach((upgrade) => {
    const element = document.getElementById(`upgrade-${upgrade.id}`);
    if (!element) return;
    element.classList.toggle("disabled", gameState.cookies < upgrade.cost);
    const progress = element.querySelector(".progress");
    if (progress)
      progress.style.width = `${Math.min(
        100,
        (gameState.cookies / upgrade.cost) * 100
      )}%`;
  });
}

function saveGame() {
  const saveData = {
    cookies: gameState.cookies,
    cookiesPerClick: gameState.cookiesPerClick,
    cookiesPerSecond: gameState.cookiesPerSecond,
    totalClicks: gameState.totalClicks,
    upgrades: gameState.upgrades,
    achievements: gameState.achievements,
    lastSave: Date.now(),
    goldenCookiesClicked: gameState.goldenCookiesClicked,
    criticalHits: gameState.criticalHits || 0,
  };
  localStorage.setItem("cookieClickerSave", JSON.stringify(saveData));
  showSaveNotice();
}

function loadGame() {
  const saveData = localStorage.getItem("cookieClickerSave");
  if (saveData) {
    const parsed = JSON.parse(saveData);
    gameState.cookies = parsed.cookies || 0;
    gameState.cookiesPerClick = parsed.cookiesPerClick || 1;
    gameState.cookiesPerSecond = parsed.cookiesPerSecond || 0;
    gameState.totalClicks = parsed.totalClicks || 0;
    gameState.lastSave = parsed.lastSave || Date.now();
    gameState.goldenCookiesClicked = parsed.goldenCookiesClicked || 0;
    gameState.criticalHits = parsed.criticalHits || 0;
    gameState.upgrades = upgrades.map((upgrade) => {
      const saved = parsed.upgrades?.find((u) => u.id === upgrade.id);
      return saved ? { ...upgrade, ...saved } : { ...upgrade };
    });
    gameState.achievements = achievements.map((achievement) => {
      const saved = parsed.achievements?.find((a) => a.id === achievement.id);
      return saved ? { ...achievement, ...saved } : { ...achievement };
    });
  } else {
    gameState.upgrades = upgrades.map((u) => ({ ...u }));
    gameState.achievements = achievements.map((a) => ({ ...a }));
  }
}

window.addEventListener("load", initGame);
window.addEventListener("beforeunload", saveGame);
