let currentCase = null;
let currentWonItem = null;
let currentSelectedAmount = 1;
let isAnimating = false;
let animationFrame = null;

const MAX_CASES_OPEN = 10;

function getCaseIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

function loadCaseData() {
    const caseId = getCaseIdFromUrl();
    const saved = localStorage.getItem('casesData');
    if (saved) {
        const allCases = JSON.parse(saved);
        currentCase = allCases.find(c => c.id == caseId);
    }
    if (currentCase) {
        renderCaseDetails();
        updateTotalPrice();
    } else {
        document.getElementById('caseBlock').innerHTML = '<h1>Case not found!</h1><a href="index.html">Go back</a>';
    }
}

function renderCaseDetails() {
    document.getElementById('caseIcon').innerText = currentCase.icon || '📦';
    document.getElementById('caseName').innerText = currentCase.name;
    document.getElementById('casePrice').innerHTML = `💰 ${currentCase.price} ₽`;
    
    // Генерируем предметы для кейса (демо)
    const demoItems = [
        { name: "AK-47 | Redline", rarity: "Classified", price: 350, icon: "🔫", wear: "MW" },
        { name: "AWP | Dragon Lore", rarity: "Covert", price: 8500, icon: "🐉", wear: "FN" },
        { name: "M4A4 | Howl", rarity: "Covert", price: 4500, icon: "🐺", wear: "FN" },
        { name: "USP-S | Kill Confirmed", rarity: "Covert", price: 1200, icon: "💀", wear: "FN" },
        { name: "★ Karambit | Doppler", rarity: "Knife", price: 4500, icon: "🔪", wear: "FN" }
    ];
    
    const itemsGrid = document.getElementById('itemsGrid');
    itemsGrid.innerHTML = demoItems.map(item => `
        <div class="item-card">
            <div class="item-icon">${item.icon}</div>
            <div class="item-name">${item.name}</div>
            <div class="item-rarity">⭐ ${item.rarity}</div>
            <div class="item-value">💰 ${item.price} ₽</div>
            <div class="item-wear">${item.wear}</div>
        </div>
    `).join('');
}

function updateTotalPrice() {
    if (!currentCase) return;
    const total = currentCase.price * currentSelectedAmount;
    const el = document.getElementById('totalAmount');
    if (el) el.innerText = total;
}

function getRarityColor(rarity) {
    const colors = {
        'Consumer': '#6c6c8a', 'Industrial': '#4c9e6c', 'Mil-Spec': '#3a6ea5',
        'Restricted': '#9b4dff', 'Classified': '#e8672a', 'Covert': '#e54b9e', 'Knife': '#ffd700'
    };
    return colors[rarity] || '#a0a0b0';
}

function getRarityClass(rarity) {
    if (rarity === 'Knife' || rarity === 'Covert') return 'diamond';
    if (rarity === 'Classified' || rarity === 'Restricted') return 'gold';
    if (rarity === 'Mil-Spec') return 'silver';
    return 'bronze';
}

function performOpen() {
    if (window.getUserBalance() < currentCase.price) return null;
    window.addBalance(-currentCase.price);
    
    // Рандомный предмет
    const items = [
        { name: "AK-47 | Redline", rarity: "Classified", price: 350, icon: "🔫" },
        { name: "AWP | Dragon Lore", rarity: "Covert", price: 8500, icon: "🐉" },
        { name: "M4A4 | Howl", rarity: "Covert", price: 4500, icon: "🐺" },
        { name: "USP-S | Kill Confirmed", rarity: "Covert", price: 1200, icon: "💀" },
        { name: "★ Karambit | Doppler", rarity: "Knife", price: 4500, icon: "🔪" },
        { name: "Glock-18 | Water Elemental", rarity: "Restricted", price: 180, icon: "💧" }
    ];
    const wonItem = { ...items[Math.floor(Math.random() * items.length)] };
    
    window.addToInventory(wonItem);
    window.addToHistory(wonItem, currentCase.name, 'obtained');
    
    updateTotalPrice();
    document.getElementById('balance').innerText = window.getUserBalance();
    return wonItem;
}

function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function startSpin(wonItem) {
    const container = document.getElementById('horizontalAnimation');
    const track = document.getElementById('slotTrack');
    const rarityDiv = document.getElementById('slotRarity');
    const resultDiv = document.getElementById('slotResult');
    
    // Создаём ленту предметов
    const items = [
        { name: "AK-47 Redline", rarity: "Classified", price: 350, icon: "🔫" },
        { name: "AWP Dragon Lore", rarity: "Covert", price: 8500, icon: "🐉" },
        { name: "M4A4 Howl", rarity: "Covert", price: 4500, icon: "🐺" },
        { name: "USP-S Kill Confirmed", rarity: "Covert", price: 1200, icon: "💀" },
        { name: "★ Karambit Doppler", rarity: "Knife", price: 4500, icon: "🔪" },
        { name: "Glock-18 Water Elemental", rarity: "Restricted", price: 180, icon: "💧" }
    ];
    
    // Повторяем предметы для длинной ленты
    let allItems = [];
    for (let i = 0; i < 60; i++) {
        allItems.push(...items);
    }
    
    track.innerHTML = allItems.map(item => `
        <div class="slot-item-horizontal" style="border-left-color: ${getRarityColor(item.rarity)}">
            <div class="slot-item-icon">${item.icon}</div>
            <div class="slot-item-name">${item.name}</div>
            <div class="slot-item-rarity" style="color: ${getRarityColor(item.rarity)}">${item.rarity}</div>
            <div class="slot-item-value">${item.price} ₽</div>
        </div>
    `).join('');
    
    container.style.display = 'block';
    resultDiv.style.display = 'none';
    track.style.display = 'flex';
    rarityDiv.className = 'slot-rarity bronze';
    rarityDiv.innerText = 'ОТКРЫТИЕ...';
    
    const duration = 3000;
    const startTime = performance.now();
    const endPos = 5000;
    
    function animate(now) {
        const elapsed = now - startTime;
        let p = Math.min(elapsed / duration, 1);
        const eased = easeOutExpo(p);
        track.style.transform = `translateX(-${endPos * eased}px)`;
        
        if (p < 1) {
            animationFrame = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(animationFrame);
            showResult(wonItem);
        }
    }
    
    animationFrame = requestAnimationFrame(animate);
}

function showResult(item) {
    const track = document.getElementById('slotTrack');
    const resultDiv = document.getElementById('slotResult');
    const rarityDiv = document.getElementById('slotRarity');
    
    track.style.display = 'none';
    resultDiv.style.display = 'flex';
    resultDiv.innerHTML = `
        <div class="result-item-icon">${item.icon}</div>
        <div class="result-item-name">${item.name}</div>
        <div class="result-item-rarity" style="color: ${getRarityColor(item.rarity)}">⭐ ${item.rarity} ⭐</div>
        <div class="result-item-value">💰 ${item.price} ₽</div>
        <div class="result-buttons">
            <button class="result-btn again-btn" id="resultAgainBtn">🔄 Ещё</button>
            <button class="result-btn sell-btn" id="resultSellBtn">💰 Продать</button>
            <button class="result-btn upgrade-btn" id="resultUpgradeBtn">⬆️ Апгрейд</button>
        </div>
    `;
    
    rarityDiv.className = `slot-rarity ${getRarityClass(item.rarity)}`;
    rarityDiv.innerText = item.rarity.toUpperCase();
    currentWonItem = item;
    
    document.getElementById('resultAgainBtn')?.addEventListener('click', () => {
        resultDiv.style.display = 'none';
        track.style.display = 'flex';
        track.style.transform = 'translateX(0)';
        document.getElementById('horizontalAnimation').style.display = 'none';
        openSingleWithAnimation();
    });
    
    document.getElementById('resultSellBtn')?.addEventListener('click', () => {
        window.addBalance(item.price);
        window.updateHistoryItemStatusByItemId?.(item.id, 'sold');
        if (window.showNotification) {
            window.showNotification('💰 ПРОДАЖА', item.name, item.price, 'sell');
        }
        resultDiv.style.display = 'none';
        track.style.display = 'flex';
        track.style.transform = 'translateX(0)';
        document.getElementById('horizontalAnimation').style.display = 'none';
        document.getElementById('balance').innerText = window.getUserBalance();
    });
    
    document.getElementById('resultUpgradeBtn')?.addEventListener('click', () => {
        localStorage.setItem('upgradeItem', JSON.stringify(item));
        window.location.href = 'upgrade.html';
    });
}

function openSingleWithAnimation() {
    if (isAnimating) return;
    if (window.getUserBalance() < currentCase.price) {
        if (window.showNotification) {
            window.showNotification('⚠️ ОШИБКА', `Не хватает ${currentCase.price} ₽`, 0, 'buy');
        } else {
            alert(`Не хватает ${currentCase.price} ₽`);
        }
        return;
    }
    isAnimating = true;
    const won = performOpen();
    if (won) startSpin(won);
    setTimeout(() => { isAnimating = false; }, 4000);
}

function openMultiple(amount) {
    const total = currentCase.price * amount;
    if (window.getUserBalance() < total) {
        if (window.showNotification) {
            window.showNotification('⚠️ ОШИБКА', `Не хватает ${total} ₽`, 0, 'buy');
        } else {
            alert(`Не хватает ${total} ₽`);
        }
        return;
    }
    const results = [];
    for (let i = 0; i < amount; i++) {
        const w = performOpen();
        if (w) results.push(w);
    }
    const grouped = {};
    results.forEach(i => {
        if (!grouped[i.rarity]) grouped[i.rarity] = { count: 0, total: 0, icon: i.icon };
        grouped[i.rarity].count++;
        grouped[i.rarity].total += i.price;
    });
    const list = document.getElementById('bulkResultsList');
    list.innerHTML = Object.entries(grouped).map(([r, d]) => `
        <div style="display: flex; gap: 10px; padding: 8px; border-bottom: 1px solid #333;">
            <span>${d.icon}</span><span style="flex:1">${r}</span><span>✖️${d.count}</span><span>${d.total}₽</span>
        </div>
    `).join('');
    document.getElementById('resultModal').style.display = 'flex';
}

function initOpenButtons() {
    const mainBtn = document.getElementById('openMainBtn');
    if (mainBtn) {
        mainBtn.onclick = () => {
            if (currentSelectedAmount === 1) openSingleWithAnimation();
            else openMultiple(currentSelectedAmount);
        };
    }
    
    for (let i = 1; i <= 10; i++) {
        const btn = document.querySelector(`.qty-btn[data-amount="${i}"]`);
        if (btn) {
            btn.onclick = () => {
                currentSelectedAmount = i;
                updateTotalPrice();
            };
        }
    }
    
    const closeBtn = document.getElementById('bulkCloseBtn');
    if (closeBtn) closeBtn.onclick = () => document.getElementById('resultModal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.initCommon) window.initCommon();
    loadCaseData();
    initOpenButtons();
});