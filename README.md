[![Итерация 4 - Готова](https://img.shields.io/badge/Итерация_4-Система_крафта-924e7d?style=for-the-badge)](##-итерация-1-скелет-и-навигация)

> [!NOTE]
> Обновлено 20.02.2026

<br>

> [!IMPORTANT]
> Внимательно реализуем каждый класс и метод из руководства, важно ошибки фиксить сразу, что бы потом не запутаться.

<br>

> [!CAUTION]
> Не выполненые самостоятельные задания, которые находятся в конце документа - это снижение бала за домашнее задание и возможное снижение итогового бала за зачет.

---

# 🛡️ Arena Survivors v0.0.4: Добавляем систему крафта

Привет, команда! В третьей версии у нас появились предметы и магазин. Теперь мы добавим **систему крафта**:

**Что нового:**
- Класс `Recipe` — описывает рецепт (что нужно и что получается)
- Класс `RecipeManager` — управляет всеми рецептами
- Материалы для крафта (дерево, железо, ткань)
- Экран крафта с отображением доступных рецептов
- Открытие новых рецептов после боёв (с шансом 30%)

**Важно:** Мы не переписываем игру, а **добавляем новые файлы и методы** в существующий код. Каждый шаг — это конкретное место, куда нужно вставить код.

---

## 📁 Создаём новый файл `js/core/Recipe.js`

Это полностью новый файл. Создайте его в папке `core/`. Здесь будут жить классы для системы крафта.

### Шаг 0. Добавить методы для работы инвенторя
```javascript
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
```

### Шаг 1.1. Класс Recipe (базовый рецепт)

Вставьте этот код в новый файл:

```javascript
// ==============================
// Класс рецепта крафта
// ==============================
class Recipe {
    /**
     * Создаёт новый рецепт
     * @param {string} id - Уникальный идентификатор
     * @param {string} name - Название рецепта
     * @param {Object} resultItem - Предмет, который получается
     * @param {Array} materials - Материалы [{ itemId, quantity }]
     * @param {number} requiredLevel - Требуемый уровень героя
     * @param {string} requiredSkill - Требуемый навык (если есть)
     */
    constructor(id, name, resultItem, materials, requiredLevel = 1, requiredSkill = null) {
        this.id = id;
        this.name = name;
        this.resultItem = resultItem;
        this.materials = materials;
        this.requiredLevel = requiredLevel;
        this.requiredSkill = requiredSkill;
        this.isUnlocked = false; // По умолчанию закрыт
        this.unlockChance = 0.05; // 5% шанс открыть при крафте
        this.description = `Создает ${resultItem.name}`;
    }

    /**
     * Проверяет, может ли герой скрафтить этот предмет
     * @param {Object} hero - Герой
     * @param {Object} availableMaterials - Доступные материалы
     * @returns {Object} - { success, message }
     */
    canCraft(hero, availableMaterials) {
        // Проверяем уровень
        if (hero.level < this.requiredLevel) {
            return { success: false, message: `Требуется уровень ${this.requiredLevel}` };
        }
        
        // Проверяем материалы
        for (const material of this.materials) {
            if (!availableMaterials[material.itemId] || availableMaterials[material.itemId] < material.quantity) {
                return { success: false, message: `Не хватает ${material.itemId}` };
            }
        }
        
        return { success: true, message: 'Можно скрафтить' };
    }

    /**
     * Пытается открыть новый рецепт при крафте
     * @param {Array} allRecipes - Все рецепты
     * @returns {Object|null} - Открытый рецепт или null
     */
    tryUnlockNewRecipe(allRecipes) {
        // Ищем закрытые рецепты
        const lockedRecipes = allRecipes.filter(r => !r.isUnlocked && r.id !== this.id);
        
        if (lockedRecipes.length > 0 && Math.random() < this.unlockChance) {
            const randomRecipe = lockedRecipes[Math.floor(Math.random() * lockedRecipes.length)];
            randomRecipe.isUnlocked = true;
            return randomRecipe;
        }
        return null;
    }
}
```

### Шаг 1.2. Класс RecipeManager (управление рецептами)

Добавьте после класса `Recipe` (но до `window.Recipe`):

```javascript
// ==============================
// Класс для управления всеми рецептами
// ==============================
class RecipeManager {
    constructor() {
        this.recipes = [];
        this.initializeRecipes();
    }

    /**
     * Инициализация всех рецептов
     */
    initializeRecipes() {
        // Создаём базовые рецепты
        const recipes = [
            // Оружие
            new Recipe(
                'recipe_wooden_sword',
                'Деревянный меч',
                new window.Weapon('weapon_sword_1', 'Деревянный меч', 'common', 10, { damage: 5, range: 1 }, '⚔️'),
                [
                    { itemId: 'material_wood', quantity: 2 }
                ],
                1
            ),
            new Recipe(
                'recipe_iron_sword',
                'Железный меч',
                new window.Weapon('weapon_sword_2', 'Железный меч', 'rare', 50, { damage: 12, range: 1 }, '⚔️'),
                [
                    { itemId: 'material_wood', quantity: 1 },
                    { itemId: 'material_iron', quantity: 3 }
                ],
                3
            ),
            new Recipe(
                'recipe_short_bow',
                'Короткий лук',
                new window.Weapon('weapon_bow_1', 'Короткий лук', 'common', 15, { damage: 7, range: 3, attackSpeed: 0.8 }, '🏹'),
                [
                    { itemId: 'material_wood', quantity: 3 },
                    { itemId: 'material_cloth', quantity: 1 }
                ],
                2
            ),
            
            // Броня
            new Recipe(
                'recipe_cloth_armor',
                'Тканевая броня',
                new window.Armor('armor_cloth_1', 'Тканевая броня', 'common', 8, { defense: 3, bonusHp: 5 }, '👕'),
                [
                    { itemId: 'material_cloth', quantity: 3 }
                ],
                1
            ),
            new Recipe(
                'recipe_leather_armor',
                'Кожаная броня',
                new window.Armor('armor_leather_1', 'Кожаная броня', 'common', 15, { defense: 5, bonusHp: 10 }, '👕'),
                [
                    { itemId: 'material_cloth', quantity: 2 },
                    { itemId: 'material_wood', quantity: 1 }
                ],
                2
            ),
            
            // Расходники
            new Recipe(
                'recipe_hp_potion_small',
                'Малое зелье здоровья',
                new window.Consumable('consumable_hp_small', 'Малое зелье здоровья', 'common', 5, 'heal', 30, '🍎'),
                [
                    { itemId: 'material_cloth', quantity: 1 },
                    { itemId: 'material_wood', quantity: 1 }
                ],
                1
            ),
            
            // Рецепты, которые изначально закрыты
            new Recipe(
                'recipe_long_bow',
                'Длинный лук',
                new window.Weapon('weapon_bow_2', 'Длинный лук', 'rare', 60, { damage: 15, range: 5, attackSpeed: 0.7 }, '🏹'),
                [
                    { itemId: 'material_wood', quantity: 4 },
                    { itemId: 'material_iron', quantity: 2 },
                    { itemId: 'material_cloth', quantity: 2 }
                ],
                5
            ),
            new Recipe(
                'recipe_iron_armor',
                'Железный нагрудник',
                new window.Armor('armor_iron_1', 'Железный нагрудник', 'rare', 40, { defense: 10, bonusHp: 20 }, '👕'),
                [
                    { itemId: 'material_iron', quantity: 5 },
                    { itemId: 'material_cloth', quantity: 2 }
                ],
                4
            )
        ];
        
        // Первые 5 рецептов открыты по умолчанию
        recipes.forEach((recipe, index) => {
            if (index < 5) {
                recipe.isUnlocked = true;
            }
        });
        
        this.recipes = recipes;
    }

    /**
     * Получить открытые рецепты
     * @returns {Array} - Массив открытых рецептов
     */
    getUnlockedRecipes() {
        return this.recipes.filter(r => r.isUnlocked);
    }

    /**
     * Получить рецепт по ID
     * @param {string} id - ID рецепта
     * @returns {Object|null} - Рецепт или null
     */
    getRecipe(id) {
        return this.recipes.find(r => r.id === id);
    }

    /**
     * Крафт предмета
     * @param {string} recipeId - ID рецепта
     * @param {Object} hero - Герой
     * @param {Object} materials - Доступные материалы
     * @returns {Object} - Результат крафта
     */
    craft(recipeId, hero, materials) {
        const recipe = this.getRecipe(recipeId);
        if (!recipe) {
            return { success: false, message: 'Рецепт не найден' };
        }
        
        // Проверяем, открыт ли рецепт
        if (!recipe.isUnlocked) {
            return { success: false, message: 'Рецепт еще не открыт' };
        }
        
        // Проверяем возможность крафта
        const canCraft = recipe.canCraft(hero, materials);
        if (!canCraft.success) {
            return canCraft;
        }
        
        // Проверяем, есть ли место в инвентаре
        const added = hero.addToInventory({ ...recipe.resultItem });
        if (!added) {
            return { success: false, message: 'Инвентарь героя полон' };
        }
        
        // Списываем материалы
        for (const material of recipe.materials) {
            materials[material.itemId] -= material.quantity;
        }
        
        // Пытаемся открыть новый рецепт
        const newRecipe = recipe.tryUnlockNewRecipe(this.recipes);
        
        let message = `Создан ${recipe.resultItem.name}`;
        if (newRecipe) {
            message += `\n🔓 Открыт новый рецепт: ${newRecipe.name}!`;
        }
        
        return {
            success: true,
            message: message,
            item: recipe.resultItem,
            newRecipe: newRecipe
        };
    }

    /**
     * Открыть рецепт случайно после боя
     * @returns {Object|null} - Открытый рецепт или null
     */
    tryUnlockRandomRecipe() {
        const lockedRecipes = this.recipes.filter(r => !r.isUnlocked);
        if (lockedRecipes.length > 0 && Math.random() < 0.1) { // 10% шанс
            const randomRecipe = lockedRecipes[Math.floor(Math.random() * lockedRecipes.length)];
            randomRecipe.isUnlocked = true;
            return randomRecipe;
        }
        return null;
    }
}

// Делаем классы глобальными
window.Recipe = Recipe;
window.RecipeManager = RecipeManager;
```

---

## 🔄 Обновляем `js/core/GameState.js`

Теперь добавим в хранилище поддержку крафта.

### Шаг 2.1. Добавляем новые поля

Найдите в начале объекта `GameState` и добавьте два новых поля:

```javascript
const GameState = {
    resources: {
        proviziya: 10,
        toplivo: 5,
        instrumenty: 3
    },
    heroes: [],
    currentHeroId: null,
    lastPassiveUpdate: Date.now(),
    inventory: {
        // +++ НОВОЕ: переименовываем для крафта (было wood, metal, cloth)
        material_wood: 5,
        material_iron: 2,
        material_cloth: 3
    },
    shop: null,
    // +++ НОВОЕ: менеджер рецептов
    recipeManager: null,
    
    _listeners: [],
    // ... остальные методы
```

### Шаг 2.2. Добавляем метод getMaterials

Найдите место после метода `updateMaterial` и добавьте:

Добавить метод updateMaterial() если его нет в GameState:
```javascript
    // Обновление материалов инвентаря
    updateMaterial(type, amount) {
        if (this.inventory[type] !== undefined) {
            this.inventory[type] = Math.max(0, this.inventory[type] + amount);
            this.notify();
        }
    },
```

```javascript
    /**
     * Получить все материалы для отображения в удобном формате
     * @returns {Object} - Объект с материалами
     */
    getMaterials() {
        return {
            wood: this.inventory.material_wood || 0,
            iron: this.inventory.material_iron || 0,
            cloth: this.inventory.material_cloth || 0
        };
    },
```

### Шаг 2.3. Добавляем метод initRecipes

Найдите место после `initShop` и добавьте:

```javascript
    /**
     * Инициализация рецептов
     */
    initRecipes() {
        this.recipeManager = new window.RecipeManager();
        this.notify();
    },
```

### Шаг 2.4. Добавляем метод craftItem

Добавьте после `initRecipes`:

```javascript
    /**
     * Крафт предмета
     * @param {string} recipeId - ID рецепта
     * @param {string} heroId - ID героя
     * @returns {Object} - Результат крафта
     */
    craftItem(recipeId, heroId) {
        if (!this.recipeManager) {
            return { success: false, message: 'Система крафта не инициализирована' };
        }
        
        const hero = this.heroes.find(h => h.id === heroId);
        if (!hero) {
            return { success: false, message: 'Герой не найден' };
        }
        
        // Крафтим предмет
        const result = this.recipeManager.craft(recipeId, hero, this.inventory);
        
        if (result.success) {
            this.notify(); // Обновляем UI
        }
        
        return result;
    },
```

### Шаг 2.5. Добавляем метод addBattleRewards

Добавьте после `craftItem`:

```javascript
    /**
     * Добавляет награды после боя (материалы и возможные рецепты)
     * @returns {Object} - Объект с наградами
     */
    addBattleRewards() {
        // Случайные материалы
        const materials = [
            { type: 'material_wood', amount: Math.floor(Math.random() * 3) + 1 },
            { type: 'material_iron', amount: Math.floor(Math.random() * 2) },
            { type: 'material_cloth', amount: Math.floor(Math.random() * 2) }
        ];
        
        materials.forEach(m => {
            if (m.amount > 0) {
                this.updateMaterial(m.type, m.amount);
            }
        });
        
        // Шанс открыть новый рецепт (30%)
        if (this.recipeManager && Math.random() < 0.3) {
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
```

---

## 🎨 Обновляем `js/ui/UIManager.js`

Теперь добавим отрисовку экрана крафта и кнопки экипировки.

### Шаг 3.1. Добавляем вызов renderCraft в конструктор

Найдите конструктор и добавьте проверку в конец:

```javascript
    constructor() {
        this.screens = { ... };
        this.navButtons = ...;
        this.resourceElements = { ... };
        
        this.initEventListeners();
        this.subscribeToState();
        this.updateResourcesUI();
        this.renderHeroes();
        
        if (window.GameState.shop) {
            this.renderShop();
        }
        
        // +++ НОВОЕ: если рецепты инициализированы, отображаем крафт
        if (window.GameState.recipeManager) {
            this.renderCraft();
        }
    }
```

### Шаг 3.2. Добавляем переключение на крафт в initEventListeners

Найдите в `initEventListeners` обработчик клика и добавьте условие:

```javascript
    initEventListeners() {
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const screenId = e.target.dataset.screen;
                this.showScreen(screenId);
                this.setActiveNavButton(e.target);
                
                if (screenId === 'heroes') {
                    this.renderHeroes();
                } else if (screenId === 'shop') {
                    this.renderShop();
                } else if (screenId === 'craft') { // +++ НОВОЕ
                    this.renderCraft();
                }
            });
        });
        
        document.querySelector('.close-modal').addEventListener('click', () => {
            document.getElementById('heroModal').style.display = 'none';
        });
    }
```

### Шаг 3.3. Добавляем обновление крафта в subscribeToState

Найдите метод `subscribeToState` и дополните:

```javascript
    subscribeToState() {
        window.GameState.subscribe(() => {
            this.updateResourcesUI();
            
            if (this.screens.heroes.classList.contains('active')) {
                this.renderHeroes();
            } else if (this.screens.shop.classList.contains('active')) {
                this.renderShop();
            } else if (this.screens.craft.classList.contains('active')) { // +++ НОВОЕ
                this.renderCraft();
            }
        });
    }
```

### Шаг 3.4. Добавляем метод renderCraft

Это самый большой новый метод. Добавьте его после `renderShop()`:

```javascript
    /**
     * Отрисовывает экран крафта
     */
    renderCraft() {
        const container = document.getElementById('craftRecipes');
        container.innerHTML = '';
        
        if (!window.GameState.recipeManager) {
            container.innerHTML = '<p>Система крафта не инициализирована</p>';
            return;
        }
        
        const currentHero = window.GameState.getCurrentHero();
        if (!currentHero) {
            container.innerHTML = '<p>Сначала выберите героя</p>';
            return;
        }
        
        // Отображаем доступные материалы
        const materials = window.GameState.getMaterials();
        const materialsDiv = document.createElement('div');
        materialsDiv.className = 'materials-display';
        materialsDiv.style.cssText = `
            background: #16213e;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            display: flex;
            gap: 20px;
            justify-content: center;
        `;
        materialsDiv.innerHTML = `
            <div> 🌲 <span id="materialWood">${materials.wood}</span></div>
            <div> ⛓️ <span id="materialIron">${materials.iron}</span></div>
            <div> 🌯 <span id="materialCloth">${materials.cloth}</span></div>
        `;
        container.appendChild(materialsDiv);
        
        // Заголовок с открытыми рецептами
        const title = document.createElement('h3');
        title.textContent = 'Доступные рецепты:';
        container.appendChild(title);
        
        // Отображаем открытые рецепты
        const unlockedRecipes = window.GameState.recipeManager.getUnlockedRecipes();
        
        if (unlockedRecipes.length === 0) {
            container.innerHTML += '<p>Нет доступных рецептов</p>';
            return;
        }
        
        unlockedRecipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'craft-item';
            
            // Проверяем, можно ли скрафтить
            const canCraft = recipe.canCraft(currentHero, window.GameState.inventory);
            
            // Собираем строку с материалами
            const materialsList = recipe.materials.map(m => 
                `${m.itemId === 'material_wood' ? '🌲' : m.itemId === 'material_iron' ? '⛓️' : '🌯'} ${m.quantity}`
            ).join(' + ');
            
            recipeCard.innerHTML = `
                <div style="font-size: 2rem;">${recipe.resultItem.icon}</div>
                <h4>${recipe.name}</h4>
                <p>${recipe.resultItem.description}</p>
                <p class="craft-materials">Требуется: ${materialsList}</p>
                <p class="craft-level">Требуемый уровень: ${recipe.requiredLevel}</p>
                <button class="craft-item-btn" data-recipe-id="${recipe.id}" ${!canCraft.success ? 'disabled' : ''}>
                    ${canCraft.success ? 'Скрафтить' : canCraft.message}
                </button>
            `;
            
            // Если нельзя скрафтить, делаем кнопку серой
            if (!canCraft.success) {
                recipeCard.querySelector('button').style.background = '#666';
                recipeCard.querySelector('button').style.cursor = 'not-allowed';
            }
            
            container.appendChild(recipeCard);
        });
        
        // Добавляем обработчики крафта
        document.querySelectorAll('.craft-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.disabled) return;
                
                const recipeId = e.target.dataset.recipeId;
                const currentHero = window.GameState.getCurrentHero();
                
                if (!currentHero) {
                    alert('Сначала выберите героя!');
                    return;
                }
                
                const result = window.GameState.craftItem(recipeId, currentHero.id);
                
                if (result.success) {
                    alert(result.message);
                    this.renderCraft(); // Обновляем экран крафта
                    
                    // Если открылся новый рецепт, показываем уведомление
                    if (result.newRecipe) {
                        setTimeout(() => {
                            alert(`🔓 Открыт новый рецепт: ${result.newRecipe.name}!`);
                        }, 100);
                    }
                } else {
                    alert(result.message);
                }
            });
        });
    }
```

### Шаг 3.5. Добавляем кнопки экипировки в инвентарь

Найдите метод `showHeroInventory` и найдите строку с отображением предмета. Замените её на эту (добавляется кнопка экипировки):

```javascript
    showHeroInventory(heroId) {
        const hero = window.GameState.heroes.find(h => h.id === heroId);
        if (!hero) return;
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <h2>Инвентарь ${hero.name}</h2>
            <div class="inventory-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
                ${hero.inventory.map((item, index) => {
                    if (item) {
                        return `<div class="inventory-slot" data-slot="${index}" style="background: #0f3460; padding: 15px; border-radius: 5px; text-align: center;">
                            <div style="font-size: 2rem;">${item.icon}</div>
                            <div>${item.name}</div>
                            ${item.type === 'consumable' ? '<button class="use-item-btn" data-hero-id="' + heroId + '" data-slot="' + index + '">Использовать</button>' : ''}
                            ${item.type === 'weapon' || item.type === 'armor' ? '<button class="equip-item-btn" data-hero-id="' + heroId + '" data-slot="' + index + '">Экипировать</button>' : ''}
                        </div>`;
                    } else {
                        return `<div class="inventory-slot empty" data-slot="${index}" style="background: #1a1a2e; padding: 15px; border-radius: 5px; border: 1px dashed #0f3460; text-align: center;">
                            Пусто
                        </div>`;
                    }
                }).join('')}
            </div>
            <h3>Экипировка</h3>
            <div class="equipment-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 10px;">
                <div class="equipment-slot" style="background: #0f3460; padding: 10px; border-radius: 5px;">
                    <strong>Оружие:</strong><br>
                    ${hero.equipment.weapon ? hero.equipment.weapon.name : 'Пусто'}
                </div>
                <div class="equipment-slot" style="background: #0f3460; padding: 10px; border-radius: 5px;">
                    <strong>Броня:</strong><br>
                    ${hero.equipment.armor ? hero.equipment.armor.name : 'Пусто'}
                </div>
                <div class="equipment-slot" style="background: #0f3460; padding: 10px; border-radius: 5px;">
                    <strong>Аксессуар:</strong><br>
                    ${hero.equipment.accessory ? hero.equipment.accessory.name : 'Пусто'}
                </div>
            </div>
        `;
        
        // ... остальной код (обработчики для use-item-btn уже есть)
        
        // +++ НОВОЕ: добавляем обработчики для кнопок экипировки
        document.querySelectorAll('.equip-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const heroId = e.target.dataset.heroId;
                const slot = parseInt(e.target.dataset.slot);
                const hero = window.GameState.heroes.find(h => h.id === heroId);
                const item = hero.inventory[slot];
                
                if (item) {
                    let equipSlot = 'weapon';
                    if (item.type === 'armor') equipSlot = 'armor';
                    if (item.type === 'accessory') equipSlot = 'accessory';
                    
                    hero.equip(item, equipSlot);
                    hero.inventory[slot] = null; // Убираем из инвентаря
                    
                    alert(`Экипировано: ${item.name}`);
                    this.showHeroInventory(heroId);
                }
            });
        });
        
        document.getElementById('heroModal').style.display = 'block';
    }
```

---

## 🚀 Обновляем `js/game.js`

В файле запуска нужно добавить инициализацию крафта и улучшить награды за бой.

### Шаг 4.1. Добавляем инициализацию рецептов

Найдите место после инициализации магазина и добавьте:

```javascript
// Инициализируем магазин
window.GameState.initShop();

// +++ НОВОЕ: инициализируем систему крафта
window.GameState.initRecipes();
```

### Шаг 4.2. Улучшаем обработчик начала боя (добавляем награды)

Найдите обработчик `start-match-btn` и замените на этот:

```javascript
// Обработчики кнопок локаций
document.querySelectorAll('.start-match-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const costType = e.target.dataset.costType;
        
        if (!window.GameState.getCurrentHero()) {
            alert('Сначала выберите героя в меню "Герои"!');
            return;
        }
        
        if (window.GameState.resources[costType] < 1) {
            alert(`Не хватает ${costType}!`);
            return;
        }
        
        window.GameState.updateResource(costType, -1);
        
        // Даем опыт за матч (увеличили до 15)
        const currentHero = window.GameState.getCurrentHero();
        currentHero.addExp(15);
        
        // +++ НОВОЕ: добавляем награды (материалы и возможные рецепты)
        const rewards = window.GameState.addBattleRewards();
        
        let message = `Матч завершен! Герой ${currentHero.name} получил 15 опыта.\n`;
        message += `Получены материалы: ${rewards.materials.map(m => m.amount > 0 ? `${m.type.replace('material_', '')}: ${m.amount}` : '').filter(Boolean).join(', ')}`;
        
        if (rewards.newRecipe) {
            message += `\n🔓 Открыт новый рецепт: ${rewards.newRecipe.name}!`;
        }
        
        alert(message);
    });
});
```

### Шаг 4.3. Обновляем сообщение в консоли

В конце файла замените `console.log`:

```javascript
console.log('Игра запущена! Магазин и крафт инициализированы.');
```

---

## 📝 Обновляем `index.html`

В самом конце файла, в блоке подключения скриптов, добавьте новую строку для `Recipe.js`. **Важен порядок:**

```html
<script src="js/core/GameState.js"></script> 
<script src="js/core/Item.js"></script>
<script src="js/core/Hero.js"></script>
<script src="js/core/Shop.js"></script>
<script src="js/core/Recipe.js"></script>   <!-- НОВОЕ: система крафта -->
<script src="js/ui/UIManager.js"></script> 
<script src="js/game.js"></script>
```

**Почему такой порядок:**
1. `GameState` — должен быть самым первым
2. `Item.js` — базовые классы предметов
3. `Hero.js` — герои используют предметы
4. `Shop.js` — магазин создаёт предметы
5. `Recipe.js` — рецепты используют предметы
6. `UIManager.js` — отрисовывает интерфейс
7. `game.js` — запускает всё

---

## ✅ Что мы добавили

| Файл | Что нового |
|------|------------|
| `Recipe.js` (новый) | Классы Recipe и RecipeManager |
| `GameState.js` | Поле `recipeManager`, методы `initRecipes()`, `craftItem()`, `addBattleRewards()`, `getMaterials()` |
| `UIManager.js` | Метод `renderCraft()`, кнопки экипировки в инвентаре |
| `game.js` | Инициализация крафта, награды за бой |
| `index.html` | Подключение нового файла |

---

## 💻 Как проверить, что всё работает

1. **Откройте экран Крафт** — должны увидеть доступные материалы и первые 5 рецептов
2. **Выберите героя** (обязательно, крафт привязан к герою)
3. **Попробуйте скрафтить** Деревянный меч — если есть 2 дерева, предмет появится в инвентаре
4. **Проведите бой** — должны получить материалы и с 30% шансом новый рецепт
5. **Откройте инвентарь** — у оружия и брони появилась кнопка "Экипировать"
6. **Экипируйте предмет** — характеристики героя должны измениться

---

## 👑 Микро-задания для самостоятельной работы

Выберите **одно** задание, которое улучшит код без добавления новых механик:

### 🔹 Задание 1. Добавить иконки для материалов в GameState.getMaterials()
Сейчас в методе `getMaterials()` возвращаются только числа. Добавьте в возвращаемый объект ещё и иконки для отображения.

**Где:** `GameState.js`, метод `getMaterials()`

---

### 🔹 Задание 2. Улучшить сообщение о нехватке материалов
В методе `canCraft` сейчас выводится "Не хватает material_wood". Сделайте, чтобы показывалось понятное название: "Не хватает древесины".

**Подсказка:** Создайте объект-словарь в начале файла.

**Где:** `Recipe.js`, метод `canCraft()`

---

### 🔹 Задание 3. Добавить проверку на наличие рецепта перед крафтом
В методе `craftItem` уже есть проверка, но дублирующая логика есть и в `RecipeManager.craft`. Уберите проверку из одного места.

**Где:** `RecipeManager.js`, метод `craft()`

---

### 🔹 Задание 4. Добавить счётчик свободных слотов в инвентаре
В модальном окне инвентаря добавьте строку: "Свободно: X/9 слотов". Это поможет игроку понять, может ли он купить новый предмет.

**Где:** `UIManager.js`, метод `showHeroInventory()`, в начало `modalBody.innerHTML`

---

---

### 🔹 Задание 5. Улучшить отображение требований к рецепту
В карточке рецепта сейчас показывается только список материалов. Добавьте рядом иконки материалов, чтобы было нагляднее.

**Где:** `UIManager.js`, метод `renderCraft()`, строка с `materialsList`

---

### 🎯 Как выполнять

1. Выберите одно задание
2. Внесенные изменения пометьте коментариями.
3. Внесите изменения (буквально 3-10 строк кода)
4. Сделайте commit и push
5. В комментариях к домашнему заданию укажите улучшение.

<br>

> [!TIP]
> Тестируем - страница крафта должна отображать предметы которые сможет создавать герой, при крафте возможно выучить случайный рецепт следщего уровня, во вкладке инвентаря есть возможность экипировать предмет.  **Переходим к версии 0.0.4 в следующую ветку**
