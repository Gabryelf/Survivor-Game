// Инициализация данных для теста
const warrior = new window.Hero('1', 'воин', { hp: 100, attack: 20, defence: 5, speed: 15 }, 'warrior');

window.GameState.heroes.push(warrior);

// Запуск UI
const ui = new UIManager();

window.GameState.selectHero(1);

// Обработчики кнопок
document.querySelectorAll('.start-match-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (!window.GameState.getCurrentHero()) {
            alert('Сначала выберите героя!');
            return;
        }
        const costType = e.target.dataset.costType;
        window.GameState.updateResource(costType, -1);
        alert(`Матч начат! Потрачен 1 ${costType}. Ресурсов осталось: ${window.GameState.resources[costType]}`);
        ui.updateResourcesUI();
    });
});

