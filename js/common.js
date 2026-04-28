// Global state
let userBalance = 1247;
let inventory = [];

function updateBalanceUI() {
    document.querySelectorAll('#balance').forEach(el => {
        if (el) el.innerText = userBalance;
    });
    localStorage.setItem('ratBalance', userBalance);
}

function saveInventory() {
    localStorage.setItem('ratInventory', JSON.stringify(inventory));
}

function loadInventory() {
    const saved = localStorage.getItem('ratInventory');
    if (saved) {
        inventory = JSON.parse(saved);
    } else {
        inventory = [
            { name: "🧀 Cheese Rat", rarity: "common", value: 5, icon: "🐭" },
            { name: "⚙️ Sewer Bot", rarity: "rare", value: 30, icon: "🤖" }
        ];
        saveInventory();
    }
}

function addToInventory(item) {
    inventory.push(item);
    saveInventory();
}

function getInventory() {
    return inventory;
}

function claimDaily() {
    const lastClaim = localStorage.getItem('ratDaily');
    const today = new Date().toDateString();
    if (lastClaim === today) {
        alert("🐀 Already claimed today! Come back tomorrow.");
        return false;
    }
    const bonus = 250;
    userBalance += bonus;
    updateBalanceUI();
    localStorage.setItem('ratDaily', today);
    alert(`🎁 +${bonus} 🧀 coins! Your hoard grows.`);
    return true;
}

function initCommon() {
    const savedBalance = localStorage.getItem('ratBalance');
    if (savedBalance) userBalance = parseInt(savedBalance);
    updateBalanceUI();
    loadInventory();

    const dailyBtn = document.getElementById('dailyBonusBtn');
    if (dailyBtn) dailyBtn.onclick = claimDaily;
}

// Expose to other scripts
window.initCommon = initCommon;
window.addBalance = (amount) => {
    userBalance += amount;
    updateBalanceUI();
    return userBalance;
};
window.getUserBalance = () => userBalance;
window.addToInventory = addToInventory;
window.getInventory = getInventory;