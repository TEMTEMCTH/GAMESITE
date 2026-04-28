// Cases data
const casesData = [
    { 
        id: 0, 
        name: "🧀 Cheese Case", 
        price: 100, 
        icon: "🐭🧀",
        description: "Common rats, occasional delicacy",
        items: [
            { name: "🧀 Cheese Rat", rarity: "common", value: 8, icon: "🐭" },
            { name: "🍕 Pizza Rat", rarity: "common", value: 12, icon: "🐀" },
            { name: "✨ Gouda Glow Rat", rarity: "rare", value: 45, icon: "✨🐭" },
            { name: "👨‍🍳 Ratatouille Chef", rarity: "legendary", value: 480, icon: "👨‍🍳🐀" }
        ]
    },
    { 
        id: 1, 
        name: "🧪 Toxic Sewer Case", 
        price: 350, 
        icon: "🧪☣️",
        description: "Mutants and radioactive creatures",
        items: [
            { name: "💚 Slime Rat", rarity: "common", value: 15, icon: "💚🐭" },
            { name: "👁️ Three-Eye Mutant", rarity: "rare", value: 85, icon: "👁️👁️👁️" },
            { name: "☢️ Glowing Rat", rarity: "rare", value: 110, icon: "☢️🐀" },
            { name: "🦠 Plague Doctor Rat", rarity: "legendary", value: 1250, icon: "🦠🐀" }
        ]
    },
    { 
        id: 2, 
        name: "👑 Rat King Vault", 
        price: 1000, 
        icon: "👑🐀",
        description: "Royalty and ancient rulers",
        items: [
            { name: "📜 Royal Page Rat", rarity: "rare", value: 120, icon: "📜🐭" },
            { name: "👑 Crown Rat", rarity: "legendary", value: 800, icon: "👑🐀" },
            { name: "✨ Golden Rat", rarity: "legendary", value: 1200, icon: "✨🐀" },
            { name: "🔮 Elder Rat Deity", rarity: "mythic", value: 4500, icon: "🔮🐀✨" }
        ]
    },
    { 
        id: 3, 
        name: "⚡ Electric Sewer", 
        price: 750, 
        icon: "⚡🔋",
        description: "Shocking surprises inside",
        items: [
            { name: "🔋 Battery Rat", rarity: "common", value: 20, icon: "🔋🐭" },
            { name: "⚡ Spark Rat", rarity: "rare", value: 95, icon: "⚡🐀" },
            { name: "🌩️ Thunder Rat", rarity: "legendary", value: 950, icon: "🌩️🐀" },
            { name: "💀 Tesla Coil Rat", rarity: "mythic", value: 2800, icon: "💀⚡🐀" }
        ]
    }
];

// Recent drops history (max 10)
let recentDrops = [];

function addRecentDrop(item, caseName) {
    const dropText = `${item.icon} ${item.name} (${item.rarity}) worth ${item.value} 🧀 from ${caseName}`;
    recentDrops.unshift(dropText);
    if (recentDrops.length > 8) recentDrops.pop();
    localStorage.setItem('recentDrops', JSON.stringify(recentDrops));
    renderRecentDrops();
}

function renderRecentDrops() {
    const container = document.getElementById('recentDropsList');
    if (!container) return;
    
    const saved = localStorage.getItem('recentDrops');
    if (saved) recentDrops = JSON.parse(saved);
    
    if (recentDrops.length === 0) {
        container.innerHTML = '<div class="drop-item">✨ Open your first case! ✨</div>';
        return;
    }
    
    container.innerHTML = recentDrops.map(drop => 
        `<div class="drop-item">${drop}</div>`
    ).join('');
}

function updateHeroStats() {
    const totalOpened = localStorage.getItem('totalOpened') || 0;
    const legendaryCount = localStorage.getItem('legendaryCount') || 0;
    
    const totalEl = document.getElementById('totalOpenedHero');
    const legEl = document.getElementById('legendaryHero');
    if (totalEl) totalEl.innerText = totalOpened;
    if (legEl) legEl.innerText = legendaryCount;
}

function openCase(caseData) {
    // Check balance
    if (window.getUserBalance() < caseData.price) {
        alert(`🐀 Not enough 🧀 coins! Need ${caseData.price}, you have ${window.getUserBalance()}`);
        return;
    }
    
    // Deduct balance
    window.addBalance(-caseData.price);
    
    // Random item from case
    const randomIndex = Math.floor(Math.random() * caseData.items.length);
    const wonItem = { ...caseData.items[randomIndex] };
    
    // Add to inventory
    window.addToInventory(wonItem);
    
    // Update stats
    let totalOpened = parseInt(localStorage.getItem('totalOpened') || '0');
    totalOpened++;
    localStorage.setItem('totalOpened', totalOpened);
    
    if (wonItem.rarity === 'legendary' || wonItem.rarity === 'mythic') {
        let legendaryCount = parseInt(localStorage.getItem('legendaryCount') || '0');
        legendaryCount++;
        localStorage.setItem('legendaryCount', legendaryCount);
    }
    
    // Track highest drop
    let highestDrop = parseInt(localStorage.getItem('highestDrop') || '0');
    if (wonItem.value > highestDrop) {
        localStorage.setItem('highestDrop', wonItem.value);
    }
    
    // Add to recent drops
    addRecentDrop(wonItem, caseData.name);
    updateHeroStats();
    
    // Show modal with result
    showOpenModal(wonItem);
}

function showOpenModal(item) {
    const modal = document.getElementById('openModal');
    const resultText = document.getElementById('resultText');
    const wheel = document.getElementById('rouletteWheel');
    
    // Determine color based on rarity
    const rarityColors = {
        'common': '#b68b40',
        'rare': '#3b82f6',
        'legendary': '#f59e0b',
        'mythic': '#ec4899'
    };
    
    resultText.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">${item.icon}</div>
        <div style="font-weight: bold; font-size: 1.4rem;">${item.name}</div>
        <div style="color: ${rarityColors[item.rarity] || '#b68b40'}; margin: 0.5rem 0;">
            ⭐ ${item.rarity.toUpperCase()} ⭐
        </div>
        <div>💰 Value: ${item.value} 🧀</div>
    `;
    
    // Animation
    let spins = 0;
    const spinInterval = setInterval(() => {
        const symbols = ['🎲', '🎰', '🐀', '🧀', '✨', '💎'];
        wheel.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        spins++;
        if (spins > 10) {
            clearInterval(spinInterval);
            wheel.innerText = item.icon;
        }
    }, 80);
    
    modal.style.display = "flex";
}

function renderCases() {
    const container = document.getElementById('casesContainer');
    if (!container) return;
    
    container.innerHTML = casesData.map(caseItem => `
        <div class="case-card" data-id="${caseItem.id}">
            <div class="case-icon">${caseItem.icon}</div>
            <h3>${caseItem.name}</h3>
            <div class="case-price">💰 ${caseItem.price} 🧀</div>
            <div class="case-items-preview">
                ${caseItem.items.slice(0, 2).map(i => i.icon).join(' ')}...
            </div>
            <button class="open-case-btn" data-id="${caseItem.id}">
                🔑 Open Case
            </button>
        </div>
    `).join('');
    
    // Attach event listeners
    document.querySelectorAll('.open-case-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const caseId = parseInt(btn.dataset.id);
            const selectedCase = casesData.find(c => c.id === caseId);
            if (selectedCase) openCase(selectedCase);
        });
    });
}

// Modal close logic
function initModal() {
    const modal = document.getElementById('openModal');
    const closeSpan = document.querySelector('#openModal .close');
    const closeBtn = document.getElementById('modalCloseBtn');
    
    if (closeSpan) {
        closeSpan.onclick = () => modal.style.display = "none";
    }
    if (closeBtn) {
        closeBtn.onclick = () => modal.style.display = "none";
    }
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = "none";
    };
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initCommon();
    renderCases();
    renderRecentDrops();
    updateHeroStats();
    initModal();
});