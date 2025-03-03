document.addEventListener('DOMContentLoaded', () => {
    const settingsBtn = document.getElementById('set');
    const settingsPanel = document.getElementById('settings-panel');
    const backFromSettingsBtn = document.getElementById('back-from-settings');
    const playerSymbolToggle = document.getElementById('player-symbol-toggle');
    
    const playerSymbol = localStorage.getItem('playerSymbol') || 'X';
    playerSymbolToggle.checked = playerSymbol === 'O';
    
    settingsBtn.addEventListener('click', () => {
        settingsPanel.style.display = 'block';
    });
    
    backFromSettingsBtn.addEventListener('click', () => {
        settingsPanel.style.display = 'none';
    });
    
    playerSymbolToggle.addEventListener('change', () => {
        const newSymbol = playerSymbolToggle.checked ? 'O' : 'X';
        localStorage.setItem('playerSymbol', newSymbol);
    });
    
    if (window.location.hash === '#settings') {
        settingsPanel.style.display = 'block';
    }
});