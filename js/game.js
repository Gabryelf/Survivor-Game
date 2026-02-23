// ==============================
// Глобальный файл - точка запуска.
// ==============================

// Создаём глобальный менеджер навыков
window.skillManager = new SkillManager();

// Создаем героев через класс Hero
const warrior = new window.Hero('1', 'Воин', { hp: 120, attack: 18, defense: 12, speed: 8 }, 'warrior');
const archer = new window.Hero('2', 'Лучник', { hp: 80, attack: 22, defense: 6, speed: 15 }, 'archer');
const mage = new window.Hero('3', 'Маг', { hp: 70, attack: 25, defense: 4, speed: 12 }, 'mage');

// Добавляем тестовое оружие воину
const woodenSword = new window.Weapon('weapon_sword_1', 'Деревянный меч', 'common', 10, { damage: 8, range: 1, cooldown: 0.8 }, '⚔️');
warrior.equip(woodenSword, 'weapon');

// Добавляем героев в состояние
window.GameState.heroes.push(warrior);
window.GameState.heroes.push(archer);
window.GameState.heroes.push(mage);

// Автоматически выбираем первого героя
window.GameState.selectHero('1');

// Инициализируем магазин
window.GameState.initShop();

// Инициализируем систему крафта
window.GameState.initRecipes();

// Запуск UI
const ui = new window.UIManager();
const arenaController = new window.ArenaController();

// ЕДИНСТВЕННЫЙ обработчик кнопок локаций
document.querySelectorAll('.start-match-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const locationCard = e.target.closest('.location-card');
        if (!locationCard) return;
        
        const location = locationCard.dataset.location;
        const costType = e.target.dataset.costType;
        
        const hero = window.GameState.getCurrentHero();
        
        if (!hero) {
            alert('Сначала выберите героя в меню "Герои"!');
            return;
        }
        
        // ИСПРАВЛЕНО: используем expeditionResources вместо resources
        if (window.GameState.expeditionResources[costType] < 1) {
            alert(`Не хватает ${costType}!`);
            return;
        }
        
        // Тратим ресурс
        window.GameState.updateExpeditionResource(costType, -1);
        
        // Начинаем вылазку
        const started = arenaController.startExpedition(location, hero);
        
        if (!started) {
            // Возвращаем ресурс, если не удалось начать
            window.GameState.updateExpeditionResource(costType, 1);
        }
    });
});

console.log('Игра запущена! Магазин и крафт инициализированы.');