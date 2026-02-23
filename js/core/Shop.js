// Класс магазина
class Shop {
    constructor() {
        this.items = []; // Все доступные предметы
        this.dailyItems = []; // Предметы в продаже сегодня
        this.lastUpdate = Date.now();

        // Инициализируем базовый ассортимент
        this.initializeShop();
    }

    // Инициализация предметов в магазине
    initializeShop() {
        // Создаем предметы
        const items = [
            // Оружие
            new window.Weapon('weapon_sword_1', 'Деревянный меч', 'common', 10, { damage: 5, range: 1 }, '⚔️'),
            new window.Weapon('weapon_sword_2', 'Железный меч', 'rare', 50, { damage: 12, range: 1 }, '⚔️'),
            new window.Weapon('weapon_bow_1', 'Короткий лук', 'common', 15, { damage: 7, range: 3, attackSpeed: 0.8 }, '🏹'),
            new window.Weapon('weapon_bow_2', 'Длинный лук', 'rare', 60, { damage: 15, range: 5, attackSpeed: 0.7 }, '🏹'),

            // Броня
            new window.Armor('armor_cloth_1', 'Тканевая броня', 'common', 8, { defense: 3, bonusHp: 5 }, '👕'),
            new window.Armor('armor_leather_1', 'Кожаная броня', 'common', 15, { defense: 5, bonusHp: 10 }, '👕'),
            new window.Armor('armor_iron_1', 'Железный нагрудник', 'rare', 40, { defense: 10, bonusHp: 20 }, '👕'),

            // Расходники
            new window.Consumable('consumable_hp_small', 'Малое зелье здоровья', 'common', 5, 'heal', 30, '💗'),
            new window.Consumable('consumable_hp_medium', 'Среднее зелье здоровья', 'rare', 15, 'heal', 60, '💗'),
            new window.Consumable('consumable_buff_attack', 'Зелье силы', 'rare', 20, 'buff', 20, '⚗️'),

            // Материалы
            new window.Material('material_wood', 'Древесина', 'common', 2, '🏠'),
            new window.Material('material_iron', 'Железо', 'common', 5, '⛓️'),
            new window.Material('material_cloth', 'Ткань', 'common', 3, '🛡️')
        ];

        this.items = items;
        this.refreshDailyItems();
    }

    // Обновить ежедневный ассортимент
    refreshDailyItems() {
        // Перемешиваем и берем 6 случайных предметов
        const shuffled = [...this.items].sort(() => 0.5 - Math.random());
        this.dailyItems = shuffled.slice(0, 6);
        this.lastUpdate = Date.now();
    }

    // В классе Shop, метод buyItem
    buyItem(itemId, heroId) {
        const item = this.dailyItems.find(i => i.id === itemId);
        if (!item) return { success: false, message: 'Предмет не найден' };

        const price = item.getPrice();

        // Проверяем ресурсы (используем expeditionResources)
        if (window.GameState.expeditionResources.proviziya < price) {
            return { success: false, message: 'Недостаточно провизии' };
        }

        // Списываем ресурсы
        window.GameState.updateExpeditionResource('proviziya', -price);

        // Добавляем предмет в общее хранилище, а не в инвентарь героя
        window.GameState.addToStorage(item);

        return {
            success: true,
            message: `Куплен ${item.name} за ${price} провизии. Предмет добавлен в общее хранилище.`,
            item: item
        };
    }

    // Проверить, нужно ли обновить ассортимент (раз в день)
    checkAndRefresh() {
        const oneDay = 24 * 60 * 60 * 1000; // В реальной игре
        // Для теста делаем обновление каждые 30 секунд
        const testInterval = 30 * 1000;

        if (Date.now() - this.lastUpdate > testInterval) {
            this.refreshDailyItems();
            return true;
        }
        return false;
    }
}

// Делаем глобальным
window.Shop = Shop;