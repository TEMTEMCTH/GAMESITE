document.addEventListener('DOMContentLoaded', () => {
    initCommon();

    const totalOpened = localStorage.getItem('totalOpened') || 0;
    const legendaryCount = localStorage.getItem('legendaryCount') || 0;
    const highestDrop = localStorage.getItem('highestDrop') || 0;

    document.getElementById('totalOpened').innerText = totalOpened;
    document.getElementById('legendaryCount').innerText = legendaryCount;
    document.getElementById('highestDrop').innerText = highestDrop;

    const invDiv = document.getElementById('inventoryList');
    const inv = window.getInventory();
    
    if (inv.length === 0) {
        invDiv.innerHTML = '<div class="inv-item">🐀 No rats yet... Open some cases!</div>';
    } else {
        invDiv.innerHTML = inv.map(item => `
            <div class="inv-item">
                <div style="font-size: 2rem;">${item.icon || '🐀'}</div>
                <div><strong>${item.name}</strong></div>
                <small>${item.rarity}<br>💰${item.value}</small>
            </div>
        `).join('');
    }
});