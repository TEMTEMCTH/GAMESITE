let selectedUpgradeItem = null;

function loadUpgradeInventory() {
    const container = document.getElementById('upgradeInventoryList');
    const inventory = window.getInventory();
    
    if (inventory.length === 0) {
        container.innerHTML = '<div style="padding: 1rem; text-align: center;">No items to upgrade. Open some cases first!</div>';
        return;
    }
    
    container.innerHTML = inventory.map((item, idx) => `
        <div class="inv-upgrade-item" data-index="${idx}">
            <div style="font-size: 1.5rem;">${item.icon}</div>
            <div style="font-size: 0.7rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</div>
            <small style="color: ${getRarityColor(item.rarity)}">${item.rarity}</small>
            <div style="font-size: 0.7rem;">💰${item.value}</div>
        </div>
    `).join('');
    
    document.querySelectorAll('.inv-upgrade-item').forEach(el => {
        el.addEventListener('click', () => {
            document.querySelectorAll('.inv-upgrade-item').forEach(i => i.classList.remove('selected'));
            el.classList.add('selected');
            const idx = parseInt(el.dataset.index);
            selectedUpgradeItem = { ...inventory[idx], inventoryIndex: idx };
            document.getElementById('currentItemDisplay').innerHTML = `
                <div style="font-size: 2rem;">${selectedUpgradeItem.icon}</div>
                <div style="font-weight: bold;">${selectedUpgradeItem.name}</div>
                <div>${selectedUpgradeItem.rarity}</div>
                <div>💰 Value: ${selectedUpgradeItem.value} 🧀</div>
            `;
            document.getElementById('spinUpgradeBtn').disabled = false;
        });
    });
}

function getRarityColor(rarity) {
    const colors = {
        'Consumer': '#6c6c8a', 'Industrial': '#4c9e6c', 'Mil-Spec': '#3a6ea5',
        'Restricted': '#9b4dff', 'Classified': '#e8672a', 'Covert': '#e54b9e', 'Knife': '#ffcc00'
    };
    return colors[rarity] || '#a0a0b0';
}

function spinUpgrade() {
    if (!selectedUpgradeItem) return;
    
    const segments = [
        { multiplier: 0, label: '❌ LOSE', chance: 0.35 },
        { multiplier: 1.2, label: '1.2x', chance: 0.25 },
        { multiplier: 1.5, label: '1.5x', chance: 0.2 },
        { multiplier: 2, label: '2x', chance: 0.12 },
        { multiplier: 3, label: '3x', chance: 0.05 },
        { multiplier: 5, label: 'JACKPOT 5x', chance: 0.03 }
    ];
    
    // Анимация выделения сегментов
    const segmentsEl = document.querySelectorAll('.wheel-segment');
    let spins = 0;
    const spinInterval = setInterval(() => {
        segmentsEl.forEach((seg, i) => {
            seg.classList.remove('highlight');
            if (Math.random() > 0.7) seg.classList.add('highlight');
        });
        spins++;
        if (spins > 15) {
            clearInterval(spinInterval);
            
            // Выбор результата
            const rand = Math.random();
            let cumulative = 0;
            let result = null;
            for (const seg of segments) {
                cumulative += seg.chance;
                if (rand < cumulative) {
                    result = seg;
                    break;
                }
            }
            
            const newValue = Math.floor(selectedUpgradeItem.value * result.multiplier);
            const modal = document.getElementById('upgradeResultModal');
            const resultText = document.getElementById('upgradeResultText');
            
            // Подсветка выпавшего сегмента
            segmentsEl.forEach(el => el.classList.remove('highlight'));
            const resultIndex = segments.findIndex(s => s === result);
            if (resultIndex >= 0) segmentsEl[resultIndex].classList.add('highlight');
            
            if (result.multiplier === 0) {
                resultText.innerHTML = `
                    <div style="font-size: 3rem;">💀</div>
                    <div style="color: #ff4466;">UPGRADE FAILED!</div>
                    <div>You lost: ${selectedUpgradeItem.name}</div>
                    <div>Value: ${selectedUpgradeItem.value} 🧀 → 0 🧀</div>
                `;
                // Удаляем предмет из инвентаря
                const inventory = window.getInventory();
                inventory.splice(selectedUpgradeItem.inventoryIndex, 1);
                window.saveInventory();
            } else {
                resultText.innerHTML = `
                    <div style="font-size: 3rem;">✨</div>
                    <div style="color: #00ff88;">UPGRADE SUCCESSFUL!</div>
                    <div>${selectedUpgradeItem.name}</div>
                    <div>${selectedUpgradeItem.value} 🧀 → ${newValue} 🧀</div>
                    <div style="color: #ffaa00;">Multiplier: ${result.multiplier}x</div>
                `;
                // Обновляем предмет в инвентаре
                const inventory = window.getInventory();
                inventory[selectedUpgradeItem.inventoryIndex].value = newValue;
                inventory[selectedUpgradeItem.inventoryIndex].name = `✨ ${inventory[selectedUpgradeItem.inventoryIndex].name}`;
                window.saveInventory();
            }
            
            modal.style.display = 'flex';
            document.getElementById('spinUpgradeBtn').disabled = true;
            selectedUpgradeItem = null;
            document.getElementById('currentItemDisplay').innerHTML = '<p>Select an item from your inventory to upgrade</p>';
            loadUpgradeInventory();
            // Внутри spinUpgrade, после успешного апгрейда:
window.addToHistory({
    name: `✨ ${inventory[selectedUpgradeItem.inventoryIndex].name}`,
    rarity: selectedUpgradeItem.rarity,
    value: newValue,
    icon: selectedUpgradeItem.icon,
    wear: selectedUpgradeItem.wear,
    stattrak: selectedUpgradeItem.stattrak
}, 'Upgrade Roulette', 'upgraded');
        }
    }, 100);
}

function initUpgradeModal() {
    const modal = document.getElementById('upgradeResultModal');
    const closeSpan = document.querySelector('#upgradeResultModal .close');
    const closeBtn = document.getElementById('upgradeResultClose');
    
    const closeModal = () => modal.style.display = 'none';
    if (closeSpan) closeSpan.onclick = closeModal;
    if (closeBtn) closeBtn.onclick = closeModal;
    window.onclick = (e) => { if (e.target === modal) closeModal(); };
}

document.addEventListener('DOMContentLoaded', () => {
    initCommon();
    loadUpgradeInventory();
    document.getElementById('spinUpgradeBtn').onclick = spinUpgrade;
    initUpgradeModal();
});