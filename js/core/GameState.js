// ==============================
// Хранилище состояний игры
// ==============================
// Хранилище состояния игры
const GameState = {
    // Ресурсы для вылазок (отображаются в шапке)
    expeditionResources: {
        proviziya: 10,
        toplivo: 5,
        instrumenty: 3
    },

    // Общие материалы для крафта (доступны всем героям)
    craftingMaterials: {
        material_wood: 5,
        material_iron: 2,
        material_cloth: 3
    },

    // Общий склад предметов (купленные в магазине, доступны всем)
    itemStorage: [], // Массив предметов, которые можно экипировать любому герою

    heroes: [],
    currentHeroId: null,
    lastPassiveUpdate: Date.now(),
    shop: null,
    recipeManager: null,
    _listeners: [],

    // Подписка на изменения
    subscribe(callback) {
        this._listeners.push(callback);
    },

    notify() {
        this._listeners.forEach(cb => cb(this));
    },

    // Обновление ресурсов для вылазок
    updateExpeditionResource(type, amount) {
        if (this.expeditionResources[type] !== undefined) {
            this.expeditionResources[type] = Math.max(0, Math.round((this.expeditionResources[type] + amount) * 10) / 10);
            this.notify();
        }
    },

    // Обновление материалов для крафта
    updateCraftingMaterial(type, amount) {
        if (this.craftingMaterials[type] !== undefined) {
            this.craftingMaterials[type] = Math.max(0, this.craftingMaterials[type] + amount);
            this.notify();
        }
    },

    // Получить все материалы для отображения
    getCraftingMaterials() {
        return {
            wood: this.craftingMaterials.material_wood || 0,
            iron: this.craftingMaterials.material_iron || 0,
            cloth: this.craftingMaterials.material_cloth || 0
        };
    },

    // Добавить предмет в общее хранилище
    addToStorage(item) {
        this.itemStorage.push({
            ...item,
            storageId: Date.now() + Math.random() // Уникальный ID для предмета в хранилище
        });
        this.notify();
    },

    // Взять предмет из хранилища (для экипировки героя)
    takeFromStorage(storageId) {
        const index = this.itemStorage.findIndex(item => item.storageId === storageId);
        if (index !== -1) {
            const item = this.itemStorage[index];
            this.itemStorage.splice(index, 1);
            this.notify();
            return item;
        }
        return null;
    },

    // Получить предметы из хранилища по типу
    getStorageItems(type = null) {
        if (type) {
            return this.itemStorage.filter(item => item.type === type);
        }
        return this.itemStorage;
    },

    // Выбрать героя для боя
    selectHero(heroId) {
        this.currentHeroId = heroId;
        this.notify();
        const heroNameSpan = document.getElementById('currentHeroName');
        const hero = this.heroes.find(h => h.id === heroId);
        if (hero) {
            heroNameSpan.textContent = `Герой: ${hero.name}`;
        } else {
            heroNameSpan.textContent = 'Герой: Не выбран';
        }
    },

    // Получить текущего героя
    getCurrentHero() {
        return this.heroes.find(h => h.id === this.currentHeroId);
    },

    // Пассивное обновление ресурсов
    // В методе passiveUpdate добавить проверку на существование heroes
    passiveUpdate() {
        const now = Date.now();
        const diffSeconds = Math.floor((now - this.lastPassiveUpdate) / 1000);

        if (diffSeconds >= 1) {
            const resourcesGained = {
                proviziya: 0,
                toplivo: 0,
                instrumenty: 0
            };

            // ИСПРАВЛЕНО: проверяем, что heroes существует
            if (this.heroes && this.heroes.length > 0) {
                this.heroes.forEach(hero => {
                    if (hero && hero.isUnlocked) {
                        resourcesGained.proviziya += 0.05 * diffSeconds;
                        resourcesGained.toplivo += 0.03 * diffSeconds;
                        resourcesGained.instrumenty += 0.02 * diffSeconds;
                    }
                });
            }

            this.expeditionResources.proviziya = Math.round((this.expeditionResources.proviziya + resourcesGained.proviziya) * 10) / 10;
            this.expeditionResources.toplivo = Math.round((this.expeditionResources.toplivo + resourcesGained.toplivo) * 10) / 10;
            this.expeditionResources.instrumenty = Math.round((this.expeditionResources.instrumenty + resourcesGained.instrumenty) * 10) / 10;

            this.lastPassiveUpdate = now;

            if (this.shop) {
                this.shop.checkAndRefresh();
            }

            this.notify();
        }
    },

    // Инициализация магазина
    initShop() {
        this.shop = new window.Shop();
        this.notify();
    },

    // Инициализация рецептов
    initRecipes() {
        this.recipeManager = new window.RecipeManager();
        this.notify();
    },

    // Крафт предмета (теперь использует общие материалы)
    craftItem(recipeId, heroId) {
        if (!this.recipeManager) {
            return { success: false, message: 'Система крафта не инициализирована' };
        }

        const hero = this.heroes.find(h => h.id === heroId);
        if (!hero) {
            return { success: false, message: 'Герой не найден' };
        }

        // Крафтим предмет с использованием общих материалов
        const result = this.recipeManager.craft(recipeId, hero, this.craftingMaterials);

        if (result.success) {
            this.notify();
        }

        return result;
    },

    // Добавить награды после боя
    addBattleRewards(expeditionTime, killCount, isVictory) {
        if (!isVictory) return { success: false };

        const rewards = {
            expeditionResources: {
                proviziya: Math.floor(expeditionTime / 10) + killCount,
                toplivo: Math.floor(expeditionTime / 20),
                instrumenty: Math.floor(expeditionTime / 30)
            },
            craftingMaterials: {
                material_wood: Math.floor(Math.random() * 3) + 1,
                material_iron: Math.floor(Math.random() * 2),
                material_cloth: Math.floor(Math.random() * 2)
            }
        };

        // Начисляем ресурсы для вылазок
        Object.entries(rewards.expeditionResources).forEach(([res, amount]) => {
            this.updateExpeditionResource(res, amount);
        });

        // Начисляем материалы для крафта
        Object.entries(rewards.craftingMaterials).forEach(([mat, amount]) => {
            if (amount > 0) {
                this.updateCraftingMaterial(mat, amount);
            }
        });

        // Шанс на получение предмета
        if (Math.random() < 0.3) { // 30% шанс
            const possibleItems = [
                new window.Consumable('consumable_hp_small', 'Малое зелье здоровья', 'common', 5, 'heal', 30, '🧪'),
                new window.Consumable('consumable_hp_medium', 'Среднее зелье здоровья', 'rare', 15, 'heal', 60, '🧪'),
                new window.Material('material_iron', 'Железо', 'common', 5, '⛓️')
            ];
            const randomItem = possibleItems[Math.floor(Math.random() * possibleItems.length)];
            this.addToStorage(randomItem);
            rewards.item = randomItem;
        }

        return { success: true, rewards };
    }
};

// Делаем глобальной
window.GameState = GameState;

// Запускаем цикл пассивного обновления
setInterval(() => {
    window.GameState.passiveUpdate();
}, 1000);