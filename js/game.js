// Инициализация данных для теста
const warrior = new window.Hero('1', 'воин', { hp: 100, attack: 20, defence: 5, speed: 15 }, 'warrior');

warrior.addToInventory(
    new Consumable('consumable_hp_small', 'Малое зелье здоровья', 'common', 5, 'heal', 30, '💗')
);

warrior.addToInventory(
    new Weapon('weapon_sword_1', 'Деревянный меч', 'common', 10, { damage: 5, range: 1 }, '⚔️')
);

window.GameState.heroes.push(warrior);

// Запуск UI
const ui = new UIManager();

window.GameState.selectHero(1);
window.GameState.initShop();

// Обработчики кнопок
document.querySelectorAll('.start-match-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (!window.GameState.getCurrentHero()) {
            alert('Сначала выберите героя!');
            return;
        }
        const costType = e.target.dataset.costType;
        window.GameState.updateResource(costType, -1);
        currentHero = window.GameState.getCurrentHero();
        currentHero.addExp(10);
        alert(`Матч начат! Получено 10 опыта.`);
        ui.updateResourcesUI();
    });
});

