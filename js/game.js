// ==============================
// Глобальный файл - точка запуска.
// ==============================

// Принудительно показываем основной хедер при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const gameHeader = document.querySelector('.game-header');
    if (gameHeader) {
        gameHeader.style.display = 'flex';
        gameHeader.style.visibility = 'visible';
    }
});

// Создаем героев через класс Hero
const warrior = new window.Hero('1', 'Воин', { hp: 120, attack: 18, defense: 12, speed: 8 }, 'warrior');
const archer = new window.Hero('2', 'Лучник', { hp: 80, attack: 22, defense: 6, speed: 15 }, 'archer');
const mage = new window.Hero('3', 'Маг', { hp: 70, attack: 25, defense: 4, speed: 12 }, 'mage');
const rogue = new window.Hero('4', 'Разбойник', { hp: 90, attack: 16, defense: 8, speed: 18 }, 'rogue');

// Добавляем тестовые предметы в общий инвентарь
window.GameState.addToInventory(new window.Weapon('weapon_sword_1', 'Деревянный меч', 'common', 10, { damage: 5, range: 1 }, '⚔️'));
window.GameState.addToInventory(new window.Weapon('weapon_bow_1', 'Короткий лук', 'common', 15, { damage: 7, range: 3 }, '🏹'));
window.GameState.addToInventory(new window.Armor('armor_cloth_1', 'Тканевая броня', 'common', 8, { defense: 3, hp: 5 }, '👕'));
window.GameState.addToInventory(new window.Accessory('accessory_ring_1', 'Кольцо силы', 'rare', 20, { attack: 3, critChance: 0.05 }, '💍'));

// Добавляем героев в состояние
window.GameState.heroes.push(warrior);
window.GameState.heroes.push(archer);
window.GameState.heroes.push(mage);
window.GameState.heroes.push(rogue);

// Автоматически выбираем первого героя
window.GameState.selectHero('1');

// Инициализируем магазин
window.GameState.initShop();

// Инициализируем систему крафта
window.GameState.initRecipes();

// Инициализируем систему навыков
window.GameState.initSkills();

// Запуск UI
const ui = new window.UIManager();
window.ui = ui; // Делаем глобальным для доступа из арены
const arenaController = new window.ArenaController();
window.GameState.initSkills();
console.log('SkillManager инициализирован:', window.GameState.skillManager);

// Обработчики кнопок локаций
document.querySelectorAll('.start-match-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const location = e.target.closest('.location-card').dataset.location;
        const costType = e.target.dataset.costType;
        
        const hero = window.GameState.getCurrentHero();
        
        if (!hero) {
            alert('Сначала выберите героя в меню "Герои"!');
            return;
        }
        
        if (window.GameState.resources[costType] < 1) {
            alert(`Не хватает ${costType}!`);
            return;
        }
        
        // Тратим ресурс
        window.GameState.updateResource(costType, -1);
        
        // Начинаем вылазку
        const started = arenaController.startExpedition(location, hero);
        
        if (!started) {
            // Возвращаем ресурс, если не удалось начать
            window.GameState.updateResource(costType, 1);
        }
    });
});

console.log('Игра запущена! Магазин, крафт и навыки инициализированы.');