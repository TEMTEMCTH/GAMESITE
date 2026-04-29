// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let userBalance = 5000;
let inventory = [];
let dropHistory = [];

// ========== ИНИЦИАЛИЗАЦИЯ ==========
function initCommon() {
    loadBalance();
    loadInventory();
    loadHistory();
    
    // Ежедневный бонус
    const dailyBtn = document.getElementById('dailyBonusBtn');
    if (dailyBtn) dailyBtn.onclick = claimDaily;
    
    // Навигация по логотипу
    const logo = document.getElementById('logoLink');
    if (logo) logo.onclick = () => window.location.href = 'index.html';
    
    // Навигация по аватару
    const avatar = document.getElementById('avatarNav');
    if (avatar) avatar.onclick = () => window.location.href = 'profile.html';
    
    updateBalanceUI();
}

// ========== БАЛАНС ==========
function loadBalance() {
    const saved = localStorage.getItem('ratBalance');
    if (saved) userBalance = parseInt(saved);
    else userBalance = 5000;
}

function updateBalanceUI() {
    const elements = document.querySelectorAll('#balance');
    elements.forEach(el => {
        if (el) el.innerText = userBalance;
    });
    localStorage.setItem('ratBalance', userBalance);
}

function addBalance(amount) {
    userBalance += amount;
    updateBalanceUI();
    return userBalance;
}

function getUserBalance() {
    return userBalance;
}

// ========== ИНВЕНТАРЬ ==========
function loadInventory() {
    const saved = localStorage.getItem('ratInventory');
    if (saved) {
        inventory = JSON.parse(saved);
    } else {
        inventory = [
            { id: Date.now(), name: "🧀 Cheese Rat", rarity: "Consumer", value: 5, icon: "🐭", wear: null, stattrak: false }
        ];
        saveInventory();
    }
}

function saveInventory() {
    localStorage.setItem('ratInventory', JSON.stringify(inventory));
}

function getInventory() {
    return inventory;
}

function addToInventory(item) {
    const newItem = {
        id: Date.now() + Math.random(),
        name: item.name,
        rarity: item.rarity,
        value: item.value,
        icon: item.icon,
        wear: item.wear || null,
        stattrak: item.stattrak || false
    };
    inventory.push(newItem);
    saveInventory();
    return newItem;
}

function removeFromInventory(itemId) {
    const index = inventory.findIndex(i => i.id === itemId);
    if (index !== -1) {
        inventory.splice(index, 1);
        saveInventory();
        return true;
    }
    return false;
}

// ========== ИСТОРИЯ ==========
function loadHistory() {
    const saved = localStorage.getItem('dropHistory');
    if (saved) {
        dropHistory = JSON.parse(saved);
    } else {
        dropHistory = [];
    }
}

function saveHistory() {
    localStorage.setItem('dropHistory', JSON.stringify(dropHistory));
}

function getHistory() {
    return dropHistory;
}

function addToHistory(item, source, action = 'obtained') {
    const historyItem = {
        id: Date.now() + Math.random(),
        itemId: item.id || (Date.now() + Math.random()),
        name: item.name,
        rarity: item.rarity,
        value: item.value,
        icon: item.icon,
        wear: item.wear || null,
        stattrak: item.stattrak || false,
        source: source,
        action: action,
        date: new Date().toLocaleString('ru-RU', { hour12: false })
    };
    dropHistory.unshift(historyItem);
    if (dropHistory.length > 50) dropHistory.pop();
    saveHistory();
}

function updateHistoryItemStatus(itemId, newAction) {
    const item = dropHistory.find(h => h.id == itemId);
    if (item) {
        item.action = newAction;
        saveHistory();
    }
}

function updateHistoryItemStatusByItemId(itemId, newAction) {
    const item = dropHistory.find(h => h.itemId == itemId);
    if (item) {
        item.action = newAction;
        saveHistory();
    }
}

// ========== ЕЖЕДНЕВНЫЙ БОНУС ==========
function claimDaily() {
    const lastClaim = localStorage.getItem('ratDaily');
    const today = new Date().toDateString();
    if (lastClaim === today) {
        showNotification('⚠️ БОНУС', 'Вы уже получали сегодня!', 0, 'buy');
        return false;
    }
    const bonus = 250;
    addBalance(bonus);
    localStorage.setItem('ratDaily', today);
    showNotification('🎁 БОНУС', 'Ежедневный бонус', bonus, 'buy');
    return true;
}

// ========== УВЕДОМЛЕНИЯ ==========
function showNotification(title, message, value, type = 'sell') {
    let notificationArea = document.getElementById('notificationArea');
    if (!notificationArea) {
        notificationArea = document.createElement('div');
        notificationArea.id = 'notificationArea';
        notificationArea.className = 'notification-area';
        document.body.appendChild(notificationArea);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
        <div class="notification-value">💰 ${value} 🧀</div>
    `;
    
    notificationArea.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification.parentNode) notification.parentNode.removeChild(notification);
        }, 300);
    }, 3000);
    
    notification.onclick = () => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification.parentNode) notification.parentNode.removeChild(notification);
        }, 100);
    };
}

// ========== ЭКСПОРТ ГЛОБАЛЬНЫХ ФУНКЦИЙ ==========
window.initCommon = initCommon;
window.addBalance = addBalance;
window.getUserBalance = getUserBalance;
window.getInventory = getInventory;
window.addToInventory = addToInventory;
window.removeFromInventory = removeFromInventory;
window.getHistory = getHistory;
window.addToHistory = addToHistory;
window.updateHistoryItemStatus = updateHistoryItemStatus;
window.updateHistoryItemStatusByItemId = updateHistoryItemStatusByItemId;
window.showNotification = showNotification;