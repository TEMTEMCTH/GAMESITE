document.addEventListener('DOMContentLoaded', () => {
    initCommon();

    // Обновление статистики
    document.getElementById('totalOpened').innerText = localStorage.getItem('totalOpened') || 0;
    document.getElementById('legendaryCount').innerText = localStorage.getItem('legendaryCount') || 0;
    document.getElementById('highestDrop').innerText = localStorage.getItem('highestDrop') || 0;

    function getRarityColor(rarity) {
        const colors = {
            'Consumer': '#6c6c8a', 'Industrial': '#4c9e6c', 'Mil-Spec': '#3a6ea5',
            'Restricted': '#9b4dff', 'Classified': '#e8672a', 'Covert': '#e54b9e', 'Knife': '#ffd700'
        };
        return colors[rarity] || '#a0a0b0';
    }

    // Продажа всего инвентаря
    function sellAllInventory() {
        const inv = getInventory();
        if (inv.length === 0) {
            showNotification('⚠️ ВНИМАНИЕ', 'Инвентарь пуст', 0, 'buy');
            return;
        }
        const totalValue = inv.reduce((sum, item) => sum + item.value, 0);
        
        addBalance(totalValue);
        inv.forEach(item => updateHistoryItemStatusByItemId(item.id, 'sold'));
        localStorage.setItem('ratInventory', JSON.stringify([]));
        
        showNotification('💰 МАССОВАЯ ПРОДАЖА', `Продано ${inv.length} предметов`, totalValue, 'sell');
        
        renderInventory();
        renderHistory();
        document.getElementById('balance').innerText = getUserBalance();
    }

    // Рендер инвентаря
    function renderInventory() {
        const invDiv = document.getElementById('inventoryList');
        const inv = getInventory();
        
        if (inv.length === 0) {
            invDiv.innerHTML = '<div style="text-align:center; padding:2rem;">🐀 Нет предметов... Откройте кейсы!</div>';
            return;
        }
        
        invDiv.innerHTML = inv.map(item => {
            const rarityColor = getRarityColor(item.rarity);
            return `
                <div class="inv-item" data-id="${item.id}">
                    <div class="inv-icon">${item.icon}</div>
                    <div class="inv-name" title="${item.name}">${item.name}</div>
                    <div class="inv-rarity" style="color: ${rarityColor};">⭐ ${item.rarity}</div>
                    <div class="inv-value">💰 ${item.value}</div>
                    ${item.wear ? `<div class="inv-wear" style="font-size:0.55rem;">${item.wear}</div>` : ''}
                    ${item.stattrak ? '<div style="font-size:0.55rem; color:#ffd700;">★ StatTrak</div>' : ''}
                    <div class="inv-actions">
                        <button class="inv-action-btn sell" data-id="${item.id}" data-name="${item.name}" data-value="${item.value}">💰</button>
                        <button class="inv-action-btn upgrade" data-id="${item.id}" data-name="${item.name}" data-value="${item.value}" data-icon="${item.icon}" data-rarity="${item.rarity}" data-wear="${item.wear || ''}" data-stattrak="${item.stattrak || false}">⬆️</button>
                        <button class="inv-action-btn steam" data-id="${item.id}">🟢</button>
                    </div>
                </div>
            `;
        }).join('');
        
        // Обработчики продажи
        document.querySelectorAll('.inv-action-btn.sell').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const itemId = parseInt(btn.dataset.id);
                const itemName = btn.dataset.name;
                const itemValue = parseInt(btn.dataset.value);
                
                removeFromInventory(itemId);
                addBalance(itemValue);
                updateHistoryItemStatusByItemId(itemId, 'sold');
                
                showNotification('💰 ПРОДАЖА', itemName, itemValue, 'sell');
                
                renderInventory();
                renderHistory();
                document.getElementById('balance').innerText = getUserBalance();
            };
        });
        
        // Обработчики апгрейда
        document.querySelectorAll('.inv-action-btn.upgrade').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                localStorage.setItem('upgradeItem', JSON.stringify({
                    id: parseInt(btn.dataset.id),
                    name: btn.dataset.name,
                    value: parseInt(btn.dataset.value),
                    icon: btn.dataset.icon,
                    rarity: btn.dataset.rarity,
                    wear: btn.dataset.wear,
                    stattrak: btn.dataset.stattrak === 'true'
                }));
                window.location.href = 'upgrade.html';
            };
        });
        
        // Обработчики Steam
        document.querySelectorAll('.inv-action-btn.steam').forEach(btn => {
            btn.onclick = () => showNotification('🟢 STEAM', 'Вывод в Steam скоро появится', 0, 'buy');
        });
    }

    // Рендер истории
    function renderHistory() {
        const historyDiv = document.getElementById('historyList');
        const history = getHistory();
        
        if (history.length === 0) {
            historyDiv.innerHTML = '<div style="text-align:center; padding:2rem;">📜 Нет дропов. Откройте кейсы!</div>';
            return;
        }
        
        historyDiv.innerHTML = history.map(item => {
            const rarityColor = getRarityColor(item.rarity);
            let statusText = '', statusClass = '';
            if (item.action === 'obtained') { statusText = '✓ Получен'; statusClass = 'obtained'; }
            else if (item.action === 'sold') { statusText = '💰 Продан'; statusClass = 'sold'; }
            else { statusText = '⬆️ Улучшен'; statusClass = 'upgraded'; }
            
            const actionText = item.action === 'sold' ? 'Продан' : (item.action === 'upgraded' ? 'Улучшен' : 'Получен');
            
            return `
                <div class="history-item">
                    <div class="history-icon">${item.icon}</div>
                    <div class="history-info">
                        <div class="history-name">${item.name}${item.stattrak ? ' ★StatTrak' : ''}${item.wear ? ` (${item.wear})` : ''}</div>
                        <div class="history-details">${actionText} • ${item.source} • ${item.date}</div>
                    </div>
                    <div class="history-rarity" style="color: ${rarityColor};">⭐ ${item.rarity}</div>
                    <div class="history-value">💰 ${item.value} 🧀</div>
                    <div class="history-status ${statusClass}">${statusText}</div>
                    ${item.action === 'obtained' ? `
                        <div class="history-actions">
                            <button class="history-action-btn sell" data-id="${item.id}" data-name="${item.name}" data-value="${item.value}">💰</button>
                            <button class="history-action-btn upgrade" data-id="${item.id}" data-name="${item.name}" data-value="${item.value}" data-icon="${item.icon}" data-rarity="${item.rarity}" data-wear="${item.wear || ''}" data-stattrak="${item.stattrak || false}">⬆️</button>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
        
        // Обработчики продажи в истории
        document.querySelectorAll('.history-action-btn.sell').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const itemId = parseFloat(btn.dataset.id);
                const itemName = btn.dataset.name;
                const itemValue = parseInt(btn.dataset.value);
                
                updateHistoryItemStatus(itemId, 'sold');
                addBalance(itemValue);
                showNotification('💰 ПРОДАЖА', itemName, itemValue, 'sell');
                renderHistory();
                document.getElementById('balance').innerText = getUserBalance();
            };
        });
        
        // Обработчики апгрейда в истории
        document.querySelectorAll('.history-action-btn.upgrade').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                localStorage.setItem('upgradeItem', JSON.stringify({
                    historyId: parseFloat(btn.dataset.id),
                    name: btn.dataset.name,
                    value: parseInt(btn.dataset.value),
                    icon: btn.dataset.icon,
                    rarity: btn.dataset.rarity,
                    wear: btn.dataset.wear,
                    stattrak: btn.dataset.stattrak === 'true'
                }));
                window.location.href = 'upgrade.html';
            };
        });
    }

    // Вкладки
    function initTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const inventoryTab = document.getElementById('inventoryTab');
        const historyTab = document.getElementById('historyTab');
        
        tabBtns.forEach(btn => {
            btn.onclick = () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (btn.dataset.tab === 'inventory') {
                    inventoryTab.style.display = 'block';
                    historyTab.style.display = 'none';
                    renderInventory();
                } else {
                    inventoryTab.style.display = 'none';
                    historyTab.style.display = 'block';
                    renderHistory();
                }
            };
        });
    }
    
    // Кнопки
    document.getElementById('sellAllBtn')?.addEventListener('click', sellAllInventory);
    document.getElementById('clearDataBtn')?.addEventListener('click', () => {
        if (confirm('⚠️ ВНИМАНИЕ! Это удалит ВСЕ предметы, историю и статистику!' +
                    '\n\nБаланс будет сброшен до 5000.\n\nВы уверены?')) {
            localStorage.removeItem('ratInventory');
            localStorage.removeItem('dropHistory');
            localStorage.removeItem('totalOpened');
            localStorage.removeItem('legendaryCount');
            localStorage.removeItem('highestDrop');
            localStorage.setItem('ratBalance', '5000');
            showNotification('🗑️ СБРОС', 'Все данные очищены', 0, 'buy');
            setTimeout(() => location.reload(), 1500);
        }
    });

    renderInventory();
    initTabs();
});