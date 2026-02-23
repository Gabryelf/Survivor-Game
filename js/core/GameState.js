// ==============================
// Хранилище состояний игры
// ==============================
const GameState = {
    resources: {
        proviziya: 10,
        toplivo: 5,
        instrumenty: 3
    },
    heroes: [],
    currentHeroId: null,
    lastPassiveUpdate: Date.now(),
    
    // Общий инвентарь для всех предметов
    inventory: [], // Массив предметов
    
    // Материалы для крафта
    materials: {
        wood: 5,
        iron: 2,
        cloth: 3
    },
    
    shop: null,
    recipeManager: null,
    skillManager: null,
    
    _listeners: [],
    
    // Подписка на изменения
    subscribe(callback) {
        this._listeners.push(callback);
    },
    
    notify() {
        this._listeners.forEach(cb => cb(this));
    },
    
    // Обновление ресурсов
    updateResource(type, amount) {
        if (this.resources[type] !== undefined) {
            this.resources[type] = Math.max(0, Math.round((this.resources[type] + amount) * 10) / 10);
            this.notify();
        }
    },
    
    // Добавить предмет в инвентарь
    addToInventory(item) {
        this.inventory.push({
            ...item,
            instanceId: Date.now() + Math.random() + item.id // Уникальный ID для экземпляра
        });
        this.notify();
    },
    
    // Удалить предмет из инвентаря
    removeFromInventory(itemId) {
        const index = this.inventory.findIndex(item => item.id === itemId || item.instanceId === itemId);
        if (index !== -1) {
            this.inventory.splice(index, 1);
            this.notify();
            return true;
        }
        return false;
    },
    
    // Получить предметы определенного типа
    getItemsByType(type) {
        return this.inventory.filter(item => item.type === type);
    },
    
    // Получить все материалы
    getMaterials() {
        return { ...this.materials };
    },
    
    // Обновить материалы
    updateMaterial(type, amount) {
        if (this.materials[type] !== undefined) {
            this.materials[type] = Math.max(0, this.materials[type] + amount);
            this.notify();
        }
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
    passiveUpdate() {
        const now = Date.now();
        const diffSeconds = Math.floor((now - this.lastPassiveUpdate) / 1000);
        
        if (diffSeconds >= 1) {
            const resourcesGained = {
                proviziya: 0,
                toplivo: 0,
                instrumenty: 0
            };
            
            // Каждый открытый герой генерирует ресурсы
            this.heroes.forEach(hero => {
                if (hero.isUnlocked) {
                    resourcesGained.proviziya += 0.05 * diffSeconds;
                    resourcesGained.toplivo += 0.03 * diffSeconds;
                    resourcesGained.instrumenty += 0.02 * diffSeconds;
                }
            });
            
            // Применяем накопленные ресурсы
            this.resources.proviziya = Math.round((this.resources.proviziya + resourcesGained.proviziya) * 10) / 10;
            this.resources.toplivo = Math.round((this.resources.toplivo + resourcesGained.toplivo) * 10) / 10;
            this.resources.instrumenty = Math.round((this.resources.instrumenty + resourcesGained.instrumenty) * 10) / 10;
            
            this.lastPassiveUpdate = now;
            
            // Проверяем обновление магазина
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
    
    // Инициализация навыков
    initSkills() {
        this.skillManager = new window.SkillManager();
        this.notify();
    },
    
    // Крафт предмета
    craftItem(recipeId, heroId) {
        if (!this.recipeManager) {
            return { success: false, message: 'Система крафта не инициализирована' };
        }
        
        const hero = this.heroes.find(h => h.id === heroId);
        if (!hero) {
            return { success: false, message: 'Герой не найден' };
        }
        
        // Крафтим предмет
        const result = this.recipeManager.craft(recipeId, hero, this.materials);
        
        if (result.success) {
            // Добавляем предмет в инвентарь
            this.addToInventory(result.item);
            this.notify();
        }
        
        return result;
    },
    
    // Добавить материалы после боя
    addBattleRewards() {
        // Случайные материалы
        const materials = [
            { type: 'wood', amount: Math.floor(Math.random() * 3) + 1 },
            { type: 'iron', amount: Math.floor(Math.random() * 2) },
            { type: 'cloth', amount: Math.floor(Math.random() * 2) }
        ];
        
        materials.forEach(m => {
            if (m.amount > 0) {
                this.updateMaterial(m.type, m.amount);
            }
        });
        
        // Шанс открыть новый рецепт
        if (this.recipeManager && Math.random() < 0.3) { // 30% шанс
            const newRecipe = this.recipeManager.tryUnlockRandomRecipe();
            if (newRecipe) {
                return {
                    materials: materials,
                    newRecipe: newRecipe
                };
            }
        }
        
        return { materials: materials };
    }
};

// Делаем глобальной
window.GameState = GameState;

// Запускаем цикл пассивного обновления
setInterval(() => {
    window.GameState.passiveUpdate();
}, 1000);