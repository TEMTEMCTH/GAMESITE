// ===== КЕЙСЫ С КАТЕГОРИЯМИ =====
const casesData = {
    serial: [
        { id: 0, name: "ХЬЮИ КЭМПБЕЛЛ", icon: "🧢", price: 55, itemsCount: 41, isNew: true },
        { id: 1, name: "ФРАНЦУЗИК", icon: "🥖", price: 111, itemsCount: 40, isNew: true },
        { id: 2, name: "СОЛДАТИК", icon: "🎖️", price: 444, itemsCount: 42, isNew: true },
        { id: 3, name: "ХОУМЛЕНДЕР", icon: "🇺🇸", price: 999, itemsCount: 41, isNew: true },
        { id: 4, name: "ПАЦАНЫ", icon: "👊", price: 4444, itemsCount: 44, isNew: true },
        { id: 5, name: "НИНДЗЯ", icon: "🥷", price: 69, itemsCount: 40, isNew: false },
        { id: 6, name: "САМУРАЙ", icon: "⚔️", price: 169, itemsCount: 40, isNew: false },
        { id: 7, name: "РОНИН", icon: "🏮", price: 299, itemsCount: 40, isNew: false },
        { id: 8, name: "СЁГУН", icon: "👑", price: 699, itemsCount: 41, isNew: false },
        { id: 9, name: "ИМПЕРАТОР", icon: "🏯", price: 1999, itemsCount: 39, isNew: false },
        { id: 10, name: "МАФИЯ", icon: "🕴️", price: 150, itemsCount: 45, isNew: true },
        { id: 11, name: "БАНДИТ", icon: "🔫", price: 250, itemsCount: 38, isNew: false },
        { id: 12, name: "ДЕТЕКТИВ", icon: "🔍", price: 350, itemsCount: 42, isNew: true },
        { id: 13, name: "ПРЕСТУПНИК", icon: "😈", price: 550, itemsCount: 40, isNew: false },
        { id: 14, name: "ГЕРОЙ", icon: "🦸", price: 750, itemsCount: 43, isNew: false },
    ],
    premium: [
        { id: 15, name: "ЗОЛОТОЙ", icon: "🌟", price: 1250, itemsCount: 50, isNew: true },
        { id: 16, name: "ПЛАТИНОВЫЙ", icon: "💎", price: 2500, itemsCount: 55, isNew: true },
        { id: 17, name: "АЛМАЗНЫЙ", icon: "✨", price: 5000, itemsCount: 60, isNew: false },
        { id: 18, name: "РУБИНОВЫЙ", icon: "🔴", price: 3500, itemsCount: 52, isNew: false },
        { id: 19, name: "САПФИРОВЫЙ", icon: "🔵", price: 4000, itemsCount: 53, isNew: true },
        { id: 20, name: "ИЗУМРУДНЫЙ", icon: "🟢", price: 3800, itemsCount: 51, isNew: false },
        { id: 21, name: "ОНИКСОВЫЙ", icon: "⚫", price: 3000, itemsCount: 48, isNew: false },
        { id: 22, name: "ЖЕМЧУЖНЫЙ", icon: "⚪", price: 2800, itemsCount: 47, isNew: true },
    ],
    exclusive: [
        { id: 23, name: "ДРАКОНИЙ", icon: "🐉", price: 7500, itemsCount: 65, isNew: true },
        { id: 24, name: "ФЕНИКС", icon: "🔥", price: 6800, itemsCount: 62, isNew: true },
        { id: 25, name: "ТИТАНОВЫЙ", icon: "⚙️", price: 5500, itemsCount: 58, isNew: false },
        { id: 26, name: "НЕБЕСНЫЙ", icon: "☁️", price: 6200, itemsCount: 60, isNew: false },
        { id: 27, name: "КОСМИЧЕСКИЙ", icon: "🌌", price: 8900, itemsCount: 70, isNew: true },
        { id: 28, name: "ЛЕГЕНДАРНЫЙ", icon: "🏆", price: 9999, itemsCount: 75, isNew: false },
    ],
    limited: [
        { id: 29, name: "ХЭЛЛОУИН", icon: "🎃", price: 450, itemsCount: 35, isNew: false },
        { id: 30, name: "НОВОГОДНИЙ", icon: "🎄", price: 550, itemsCount: 38, isNew: false },
        { id: 31, name: "ДЕНЬ РОЖДЕНИЯ", icon: "🎂", price: 650, itemsCount: 40, isNew: true },
        { id: 32, name: "ЛЕТНИЙ", icon: "☀️", price: 400, itemsCount: 36, isNew: false },
        { id: 33, name: "ВЕСЕННИЙ", icon: "🌸", price: 420, itemsCount: 37, isNew: true },
        { id: 34, name: "ОСЕННИЙ", icon: "🍂", price: 430, itemsCount: 37, isNew: false },
        { id: 35, name: "ЗИМНИЙ", icon: "❄️", price: 480, itemsCount: 38, isNew: false },
    ]
};

// ===== СПИСОК СКИНОВ ДЛЯ ЛЕНТЫ (как на скриншоте) =====
const liveSkins = [
    { name: "M4A4", skin: "Песчаная буря", icon: "🔫", stattrak: false },
    { name: "USP-S", skin: "Кровавый тигр", icon: "🔫", stattrak: true },
    { name: "Galil AR", skin: "Янтарный градиент", icon: "🔫", stattrak: false },
    { name: "Sawed-Off", skin: "KissLove", icon: "🔫", stattrak: true },
    { name: "Glock-18", skin: "Рука Рамсеса", icon: "🔫", stattrak: false },
    { name: "P90", skin: "Спешный скарабей", icon: "🔫", stattrak: false },
    { name: "USP-S", skin: "Страх", icon: "🔫", stattrak: true },
    { name: "M4A4", skin: "Зубная фея", icon: "🔫", stattrak: false },
    { name: "AK-47", skin: "Redline", icon: "🔫", stattrak: false },
    { name: "AWP", skin: "Dragon Lore", icon: "🔫", stattrak: true },
    { name: "M4A1-S", skin: "Printstream", icon: "🔫", stattrak: false },
    { name: "Desert Eagle", skin: "Printstream", icon: "🔫", stattrak: true }
];

// ===== ИГРОКИ =====
const players = [
    { name: "Onlain", avatar: "🎮" },
    { name: "Queen Jaguar", avatar: "🐆" },
    { name: "Black Lotus", avatar: "🌸" },
    { name: "High Roller", avatar: "🎲" },
    { name: "Blue Tire", avatar: "🛞" },
    { name: "Emperor", avatar: "👑" },
    { name: "Sun in Leo", avatar: "☀️" },
    { name: "Sandstorm", avatar: "🏜️" },
    { name: "Elite Build", avatar: "🏗️" },
    { name: "Catowice 2019", avatar: "🐱" },
    { name: "StatTrak Pro", avatar: "⭐" }
];

// ===== ГЕНЕРАЦИЯ ДРОПА =====
function generateDrop() {
    const player = players[Math.floor(Math.random() * players.length)];
    const skin = liveSkins[Math.floor(Math.random() * liveSkins.length)];
    const price = Math.floor(Math.random() * 2000) + 50;
    return { player, skin, price };
}

// ===== РЕНДЕР КАТЕГОРИЙ =====
function renderCategory(containerId, cases, countId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!cases || cases.length === 0) {
        container.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:#666; padding:2rem;">Нет кейсов</div>';
        if (countId) document.getElementById(countId).innerText = '0';
        return;
    }
    
    container.innerHTML = cases.map(c => `
        <div class="case-card" data-id="${c.id}">
            <div class="case-icon">${c.icon}</div>
            <div class="case-name">${c.name}${c.isNew ? '<span class="case-badge">NEW</span>' : ''}</div>
            <div class="case-items-count"><span>${c.itemsCount}</span> предметов</div>
            <div class="case-price">${c.price} ₽</div>
        </div>
    `).join('');
    
    if (countId) document.getElementById(countId).innerText = cases.length;
    
    document.querySelectorAll(`#${containerId} .case-card`).forEach(card => {
        card.addEventListener('click', () => {
            window.location.href = `case-detail.html?id=${card.dataset.id}`;
        });
    });
}

function renderAllCategories() {
    renderCategory('serialCases', casesData.serial, 'serialCount');
    renderCategory('premiumCases', casesData.premium, 'premiumCount');
    renderCategory('exclusiveCases', casesData.exclusive, 'exclusiveCount');
    renderCategory('limitedCases', casesData.limited, 'limitedCount');
}

// ===== ЛЕНТА ОТКРЫТИЙ (как на скриншоте) =====
let liveDrops = [];

function createLiveDropElement(drop) {
    const div = document.createElement('div');
    div.className = 'live-drop-item';
    const stattrakSpan = drop.skin.stattrak ? '<span style="color:#ffd700; font-size:0.6rem;">★ StatTrak™</span> ' : '';
    div.innerHTML = `
        <span class="live-drop-avatar">${drop.player.avatar}</span>
        <span class="live-drop-name">${drop.player.name}</span>
        <span class="live-drop-skin">
            ${stattrakSpan}${drop.skin.name} | ${drop.skin.skin}
        </span>
        <span class="live-drop-price">${drop.price}₽</span>
    `;
    return div;
}

function initLiveDrops() {
    const track = document.getElementById('liveDropsTrack');
    if (!track) return;
    
    // Заполняем 20 дропов
    for (let i = 0; i < 20; i++) {
        const drop = generateDrop();
        liveDrops.push(drop);
        track.appendChild(createLiveDropElement(drop));
    }
    
    // Каждые 5 секунд добавляем новый слева, удаляем правый
    setInterval(() => {
        const newDrop = generateDrop();
        liveDrops.unshift(newDrop);
        const newElement = createLiveDropElement(newDrop);
        track.insertBefore(newElement, track.firstChild);
        
        // Плавное появление
        newElement.style.opacity = '0';
        setTimeout(() => {
            newElement.style.transition = 'opacity 0.3s';
            newElement.style.opacity = '1';
        }, 10);
        
        // Удаляем последний
        if (liveDrops.length > 20) {
            liveDrops.pop();
            const lastElement = track.lastChild;
            if (lastElement) {
                lastElement.style.transition = 'opacity 0.3s';
                lastElement.style.opacity = '0';
                setTimeout(() => {
                    if (lastElement.parentNode) lastElement.parentNode.removeChild(lastElement);
                }, 300);
            }
        }
    }, 5000);
}

// ===== ТАЙМЕР =====
function startTimer() {
    let time = 39 * 60 + 55;
    const timerEl = document.getElementById('timer');
    if (!timerEl) return;
    setInterval(() => {
        if (time <= 0) return;
        time--;
        const h = Math.floor(time / 3600);
        const m = Math.floor((time % 3600) / 60);
        const s = time % 60;
        timerEl.innerText = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }, 1000);
}

// ===== ПРОМОКОД =====
function initPromoCopy() {
    const btn = document.getElementById('copyPromo');
    if (btn) {
        btn.onclick = () => {
            const promo = document.getElementById('promocode').innerText;
            navigator.clipboard.writeText(promo);
            if (window.showNotification) {
                window.showNotification('📋 ПРОМОКОД', 'Скопирован: ' + promo, 0, 'buy');
            }
        };
    }
}

// ===== СОХРАНЕНИЕ КЕЙСОВ =====
function saveAllCasesToLocalStorage() {
    const all = [...casesData.serial, ...casesData.premium, ...casesData.exclusive, ...casesData.limited];
    localStorage.setItem('casesData', JSON.stringify(all));
}

// ===== ЗАПУСК =====
document.addEventListener('DOMContentLoaded', () => {
    if (window.initCommon) window.initCommon();
    renderAllCategories();
    startTimer();
    initPromoCopy();
    saveAllCasesToLocalStorage();
    initLiveDrops();
});