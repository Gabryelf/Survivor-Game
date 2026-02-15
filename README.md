
# 🛠️ Arena Survivors — Версия 4: Система крафта и рецептов

> **Пошаговое руководство по добавлению новой функциональности**  
> *В этой версии мы добавим полноценную систему крафта, рецепты, материалы и механику открытия новых рецептов*

---

## 🎯 Что мы будем делать

В предыдущей версии у нас были герои, магазин и предметы. Теперь мы добавим:

| Компонент | Описание |
|-----------|----------|
| **Класс Recipe** | Описание рецепта: какие материалы нужны, какой предмет получается |
| **RecipeManager** | Управление всеми рецептами, проверка открытых рецептов |
| **Материалы в GameState** | Хранение wood, iron, cloth для крафта |
| **Экран крафта** | Отображение доступных рецептов и материалов |
| **Механика открытия рецептов** | Рецепты открываются в бою (случайно) или за уровень |
| **Экипировка предметов** | Возможность надеть оружие и броню из инвентаря |

---

## 📁 Новые файлы для создания

Нам нужно создать **2 новых класса и 1 скрипт**:

```
js/core/Recipe.js      // Классы Recipe и RecipeManager
```

---

## 🔧 Изменения в существующих файлах

| Файл | Что меняем |
|------|------------|
| `index.html` | Добавляем подключение `Recipe.js` |
| `GameState.js` | Добавляем `recipeManager`, материалы, метод `craftItem()`, `addBattleRewards()` |
| `UIManager.js` | Добавляем метод `renderCraft()`, обновляем `showHeroInventory()` для экипировки |
| `game.js` | Добавляем инициализацию рецептов |

---

## 📝 Пошаговая реализация

### Шаг 1: Создаём класс Recipe (`js/core/Recipe.js`)

Создайте новый файл `Recipe.js` в папке `core/`. Этот файл будет содержать два класса: `Recipe` (один рецепт) и `RecipeManager` (управление всеми рецептами).

#### 1.1 Базовый класс Recipe

```javascript
// Класс рецепта крафта
class Recipe {
    constructor(id, name, resultItem, materials, requiredLevel = 1, requiredSkill = null) {
        this.id = id;                      // Уникальный ID рецепта
        this.name = name;                   // Название рецепта
        this.resultItem = resultItem;       // Предмет, который получается
        this.materials = materials;         // Массив { itemId, quantity }
        this.requiredLevel = requiredLevel; // Требуемый уровень героя
        this.requiredSkill = requiredSkill; // Требуемый навык (пока не используем)
        this.isUnlocked = false;            // Открыт ли рецепт
        this.unlockChance = 0.05;            // 5% шанс открыть новый рецепт
        this.description = `Создает ${resultItem.name}`;
    }
    
    // Проверка, может ли герой скрафтить этот предмет
    canCraft(hero, availableMaterials) {
        // Проверяем уровень героя
        if (hero.level < this.requiredLevel) {
            return { 
                success: false, 
                message: `Требуется уровень ${this.requiredLevel}` 
            };
        }
        
        // Проверяем наличие всех материалов
        for (const material of this.materials) {
            // Получаем ID материала (может быть 'wood', 'iron' и т.д.)
            const materialId = material.itemId;
            
            // Проверяем, есть ли такой материал и хватает ли его
            if (!availableMaterials[materialId] || 
                availableMaterials[materialId] < material.quantity) {
                return { 
                    success: false, 
                    message: `Не хватает ${materialId}` 
                };
            }
        }
        
        return { success: true, message: 'Можно скрафтить' };
    }
    
    // Попытка открыть новый рецепт при крафте
    tryUnlockNewRecipe(allRecipes) {
        // Находим все закрытые рецепты (кроме текущего)
        const lockedRecipes = allRecipes.filter(r => !r.isUnlocked && r.id !== this.id);
        
        // Если есть закрытые рецепты и сработал шанс
        if (lockedRecipes.length > 0 && Math.random() < this.unlockChance) {
            // Выбираем случайный закрытый рецепт
            const randomRecipe = lockedRecipes[Math.floor(Math.random() * lockedRecipes.length)];
            randomRecipe.isUnlocked = true; // Открываем его
            return randomRecipe;
        }
        return null;
    }
}
```

**Что здесь происходит:**
- `canCraft()` проверяет уровень героя и количество материалов
- `tryUnlockNewRecipe()` с 5% шансом открывает новый случайный рецепт

#### 1.2 Класс RecipeManager

Добавьте этот код в тот же файл, после класса `Recipe`:

```javascript
// Класс для управления всеми рецептами
class RecipeManager {
    constructor() {
        this.recipes = []; // Массив всех рецептов
        this.initializeRecipes();
    }
    
    // Инициализация всех рецептов
    initializeRecipes() {
        // Создаем базовые рецепты
        const recipes = [
            // === ОРУЖИЕ ===
            new Recipe(
                'recipe_wooden_sword',           // ID рецепта
                'Деревянный меч',                 // Название
                new window.Weapon(                // Результат
                    'weapon_sword_1', 
                    'Деревянный меч', 
                    'common', 
                    10, 
                    { damage: 5, range: 1 }, 
                    '⚔️'
                ),
                [ { itemId: 'material_wood', quantity: 2 } ], // Материалы
                1 // Требуемый уровень
            ),
            
            new Recipe(
                'recipe_iron_sword',
                'Железный меч',
                new window.Weapon(
                    'weapon_sword_2', 
                    'Железный меч', 
                    'rare', 
                    50, 
                    { damage: 12, range: 1 }, 
                    '⚔️'
                ),
                [
                    { itemId: 'material_wood', quantity: 1 },
                    { itemId: 'material_iron', quantity: 3 }
                ],
                3
            ),
            
            new Recipe(
                'recipe_short_bow',
                'Короткий лук',
                new window.Weapon(
                    'weapon_bow_1', 
                    'Короткий лук', 
                    'common', 
                    15, 
                    { damage: 7, range: 3, attackSpeed: 0.8 }, 
                    '🏹'
                ),
                [
                    { itemId: 'material_wood', quantity: 3 },
                    { itemId: 'material_cloth', quantity: 1 }
                ],
                2
            ),
            
            // === БРОНЯ ===
            new Recipe(
                'recipe_cloth_armor',
                'Тканевая броня',
                new window.Armor(
                    'armor_cloth_1', 
                    'Тканевая броня', 
                    'common', 
                    8, 
                    { defense: 3, bonusHp: 5 }, 
                    '👕'
                ),
                [ { itemId: 'material_cloth', quantity: 3 } ],
                1
            ),
            
            new Recipe(
                'recipe_leather_armor',
                'Кожаная броня',
                new window.Armor(
                    'armor_leather_1', 
                    'Кожаная броня', 
                    'common', 
                    15, 
                    { defense: 5, bonusHp: 10 }, 
                    '👕'
                ),
                [
                    { itemId: 'material_cloth', quantity: 2 },
                    { itemId: 'material_wood', quantity: 1 }
                ],
                2
            ),
            
            // === РАСХОДНИКИ ===
            new Recipe(
                'recipe_hp_potion_small',
                'Малое зелье здоровья',
                new window.Consumable(
                    'consumable_hp_small', 
                    'Малое зелье здоровья', 
                    'common', 
                    5, 
                    'heal', 
                    30, 
                    '🍎'
                ),
                [
                    { itemId: 'material_cloth', quantity: 1 },
                    { itemId: 'material_wood', quantity: 1 }
                ],
                1
            ),
            
            // === РЕЦЕПТЫ, КОТОРЫЕ ИЗНАЧАЛЬНО ЗАКРЫТЫ ===
            new Recipe(
                'recipe_long_bow',
                'Длинный лук',
                new window.Weapon(
                    'weapon_bow_2', 
                    'Длинный лук', 
                    'rare', 
                    60, 
                    { damage: 15, range: 5, attackSpeed: 0.7 }, 
                    '🏹'
                ),
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
                new window.Armor(
                    'armor_iron_1', 
                    'Железный нагрудник', 
                    'rare', 
                    40, 
                    { defense: 10, bonusHp: 20 }, 
                    '👕'
                ),
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
    
    // Получить только открытые рецепты
    getUnlockedRecipes() {
        return this.recipes.filter(r => r.isUnlocked);
    }
    
    // Получить рецепт по ID
    getRecipe(id) {
        return this.recipes.find(r => r.id === id);
    }
    
    // Крафт предмета
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
        
        // Проверяем, есть ли место в инвентаре героя
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
        
        // Формируем сообщение
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
    
    // Открыть рецепт случайно после боя
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

**Важные моменты:**
- Первые 5 рецептов открыты сразу (индекс < 5)
- При крафте есть шанс открыть новый рецепт
- Материалы списываются из общего хранилища

---

### Шаг 2: Обновляем index.html

Добавьте подключение нового файла перед `UIManager.js`:

```html
<!-- Подключаем новые файлы -->
<script src="js/core/GameState.js"></script> 
<script src="js/core/Item.js"></script>
<script src="js/core/Hero.js"></script>
<script src="js/core/Shop.js"></script>
<script src="js/core/Recipe.js"></script>      <!-- НОВЫЙ ФАЙЛ -->
<script src="js/ui/UIManager.js"></script> 
<script src="js/game.js"></script>
```

---

### Шаг 3: Расширяем GameState (`js/core/GameState.js`)

Нам нужно добавить:
1. Материалы для крафта в `inventory`
2. `recipeManager` для управления рецептами
3. Методы для работы с крафтом

#### 3.1 Добавляем новые свойства в GameState

Найдите объект `GameState` и добавьте новые поля:

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
    
    // НОВОЕ: Материалы для крафта
    inventory: {
        material_wood: 5,    // Древесина
        material_iron: 2,     // Железо
        material_cloth: 3     // Ткань
    },
    
    shop: null,
    
    // НОВОЕ: Менеджер рецептов
    recipeManager: null,
    
    _listeners: [],
    
    // ... остальные методы
```

#### 3.2 Добавляем метод для получения материалов

```javascript
// НОВЫЙ МЕТОД: Получить все материалы для отображения
getMaterials() {
    return {
        wood: this.inventory.material_wood || 0,
        iron: this.inventory.material_iron || 0,
        cloth: this.inventory.material_cloth || 0
    };
},
```

#### 3.3 Добавляем метод обновления материалов

```javascript
// Обновление материалов инвентаря
updateMaterial(type, amount) {
    if (this.inventory[type] !== undefined) {
        this.inventory[type] = Math.max(0, this.inventory[type] + amount);
        this.notify();
    }
},
```

#### 3.4 Добавляем метод инициализации рецептов

```javascript
// НОВЫЙ МЕТОД: Инициализация рецептов
initRecipes() {
    this.recipeManager = new window.RecipeManager();
    this.notify();
},
```

#### 3.5 Добавляем метод крафта

```javascript
// НОВЫЙ МЕТОД: Крафт предмета
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

#### 3.6 Добавляем награды после боя

```javascript
// НОВЫЙ МЕТОД: Добавить материалы после боя
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

### Шаг 4: Обновляем UIManager (`js/ui/UIManager.js`)

Добавляем метод `renderCraft()` для отображения экрана крафта.

#### 4.1 Добавляем метод renderCraft()

Вставьте этот метод внутрь класса `UIManager`:

```javascript
// Отрисовка крафта
renderCraft() {
    const container = document.getElementById('craftRecipes');
    container.innerHTML = '';
    
    // Проверяем, инициализирована ли система крафта
    if (!window.GameState.recipeManager) {
        container.innerHTML = '<p>Система крафта не инициализирована</p>';
        return;
    }
    
    // Проверяем, выбран ли герой
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
    
    // Получаем открытые рецепты
    const unlockedRecipes = window.GameState.recipeManager.getUnlockedRecipes();
    
    if (unlockedRecipes.length === 0) {
        container.innerHTML += '<p>Нет доступных рецептов</p>';
        return;
    }
    
    // Отображаем каждый рецепт
    unlockedRecipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'craft-item';
        
        // Проверяем, можно ли скрафтить
        const canCraft = recipe.canCraft(currentHero, window.GameState.inventory);
        
        // Собираем строку с материалами
        const materialsList = recipe.materials.map(m => {
            let icon = '📦';
            if (m.itemId === 'material_wood') icon = '🌲';
            if (m.itemId === 'material_iron') icon = '⛓️';
            if (m.itemId === 'material_cloth') icon = '🌯';
            return `${icon} ${m.quantity}`;
        }).join(' + ');
        
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

#### 4.2 Обновляем обработчик навигации

Найдите метод `initEventListeners()` и добавьте вызов `renderCraft()` при переключении на экран крафта:

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
            } else if (screenId === 'craft') {  // НОВОЕ
                this.renderCraft();
            }
        });
    });
    
    // ... остальной код
}
```

#### 4.3 Обновляем подписку на состояние

В методе `subscribeToState()` добавьте вызов `renderCraft()`:

```javascript
subscribeToState() {
    window.GameState.subscribe(() => {
        this.updateResourcesUI();
        
        if (this.screens.heroes.classList.contains('active')) {
            this.renderHeroes();
        } else if (this.screens.shop.classList.contains('active')) {
            this.renderShop();
        } else if (this.screens.craft.classList.contains('active')) {  // НОВОЕ
            this.renderCraft();
        }
    });
}
```

#### 4.4 Добавляем экипировку предметов в инвентаре

Найдите метод `showHeroInventory()` и добавьте обработчики для кнопок "Экипировать":

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
    
    // Обработчики для использования расходников
    document.querySelectorAll('.use-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const heroId = e.target.dataset.heroId;
            const slot = parseInt(e.target.dataset.slot);
            const hero = window.GameState.heroes.find(h => h.id === heroId);
            
            if (hero && hero.useConsumable(slot)) {
                alert('Предмет использован!');
                this.showHeroInventory(heroId);
            } else {
                alert('Нельзя использовать этот предмет сейчас');
            }
        });
    });
    
    // НОВОЕ: Обработчики для экипировки
    document.querySelectorAll('.equip-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const heroId = e.target.dataset.heroId;
            const slot = parseInt(e.target.dataset.slot);
            const hero = window.GameState.heroes.find(h => h.id === heroId);
            const item = hero.inventory[slot];
            
            if (item) {
                // Определяем, в какой слот экипировать
                let equipSlot = 'weapon';
                if (item.type === 'armor') equipSlot = 'armor';
                if (item.type === 'accessory') equipSlot = 'accessory';
                
                // Экипируем предмет
                hero.equip(item, equipSlot);
                hero.inventory[slot] = null; // Убираем из инвентаря
                
                alert(`Экипировано: ${item.name}`);
                this.showHeroInventory(heroId); // Обновляем отображение
            }
        });
    });
    
    document.getElementById('heroModal').style.display = 'block';
}
```

---

### Шаг 5: Добавляем награды за бой в game.js

Обновите обработчик кнопки "Начать матч" в `game.js`:

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
        
        // Даем опыт за матч
        const currentHero = window.GameState.getCurrentHero();
        currentHero.addExp(15);
        
        // НОВОЕ: Добавляем награды (материалы и возможные рецепты)
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

### Шаг 6: Добавляем инициализацию рецептов в game.js

В конец файла `game.js`, после инициализации магазина, добавьте:

```javascript
// Инициализируем систему крафта
window.GameState.initRecipes();

console.log('Игра запущена! Магазин и крафт инициализированы.');
```

---

### Шаг 7: Тестирование

После всех изменений проверьте работу:

#### 7.1 Проверка материалов
- [ ] Откройте экран "Крафт"
- [ ] Должны отображаться материалы: 🌲 5, ⛓️ 2, 🌯 3

#### 7.2 Проверка доступных рецептов
- [ ] Должны отображаться первые 5 рецептов
- [ ] Рецепты с уровнем 1 должны быть доступны
- [ ] У рецепта "Железный меч" кнопка должна быть неактивна (требуется уровень 3)

#### 7.3 Проверка крафта
- [ ] Нажмите "Скрафтить" на "Деревянный меч"
- [ ] Должно появиться сообщение об успехе
- [ ] Материалы должны уменьшиться (🌲 было 5, стало 3)
- [ ] Предмет должен появиться в инвентаре героя

#### 7.4 Проверка открытия рецептов
- [ ] Скрафтите несколько предметов (есть шанс открыть новый рецепт)
- [ ] При открытии должно появиться уведомление

#### 7.5 Проверка экипировки
- [ ] Зайдите в инвентарь героя (кнопка "Инвентарь")
- [ ] У предметов должна быть кнопка "Экипировать"
- [ ] После экипировки предмет должен исчезнуть из инвентаря
- [ ] В разделе экипировки должно отобразиться название предмета
- [ ] Характеристики героя должны увеличиться

#### 7.6 Проверка наград после боя
- [ ] Начните матч на любой локации
- [ ] Должно появиться сообщение с полученными материалами
- [ ] Материалы должны добавиться к имеющимся

---

## ✅ Проверка результатов

После выполнения всех шагов у вас должно получиться:

### Структура файлов:
```
js/
├── core/
│   ├── GameState.js    # Добавлены материалы, recipeManager, методы крафта
│   ├── Hero.js         # Без изменений
│   ├── Item.js         # Без изменений
│   ├── Shop.js         # Без изменений
│   └── Recipe.js       # НОВЫЙ файл с Recipe и RecipeManager
└── ui/
    └── UIManager.js    # Добавлен renderCraft(), экипировка
```

### Новые возможности:
1. ✅ Просмотр доступных материалов
2. ✅ Просмотр открытых рецептов
3. ✅ Крафт предметов из материалов
4. ✅ Открытие новых рецептов случайно
5. ✅ Экипировка оружия и брони
6. ✅ Получение материалов после боя

---

## 🎯 Задания для самостоятельной работы

1. **Добавить новый рецепт**
   - Создайте рецепт "Боевой топор" (урон 10, требует уровень 2)
   - Материалы: 2 дерева, 1 железо
   - Добавьте в `initializeRecipes()`

2. **Улучшить отображение материалов**
   - Добавьте иконки к материалам в сообщении о наградах
   - Вместо "wood: 2" показывать "🌲 2"

3. **Разбор предметов на материалы**
   - Добавить кнопку "Разобрать" в инвентаре
   - При разборе предмета получать часть материалов
   - Меч → 1 железо, лук → 2 дерева

4. **Категории рецептов**
   - Добавить вкладки: "Оружие", "Броня", "Расходники"
   - Фильтровать рецепты по типу

5. **Подсказки при наведении**
   - При наведении на материал показывать, в каких рецептах используется
   - Сделать через `title` или тултип

6. **Система качества крафта**
   - При крафте есть шанс получить предмет лучшего качества
   - Обычный (80%), редкий (15%), эпический (5%)
   - Качество влияет на характеристики

7. **Связанные рецепты**
    - Рецепты могут требовать не только материалы, но и другие предметы
    - Например, для "Улучшенного меча" нужен "Обычный меч" + железо


---

## 🐛 Возможные проблемы и их решение

| Проблема | Решение |
|----------|---------|
| Рецепты не отображаются | Проверьте, вызван ли `initRecipes()` в `game.js` |
| Кнопка "Скрафтить" неактивна | Проверьте уровень героя и наличие материалов |
| Предмет не появляется в инвентаре | Проверьте, есть ли свободные слоты (9) |
| Материалы не списываются | Проверьте `craft()` в RecipeManager |
| Не открываются новые рецепты | Проверьте `unlockChance` и `tryUnlockRandomRecipe()` |
| Экипировка не работает | Проверьте `equip()` в Hero.js |

---

## 📚 Что мы изучили в этой версии

1. **Наследование** — Recipe использует созданные ранее классы предметов
2. **Композиция** — RecipeManager содержит массив рецептов
3. **Проверка условий** — canCraft проверяет уровень и материалы
4. **Случайность** — шанс открыть новый рецепт
5. **Обновление UI** — реакция на изменения GameState
6. **Обработка ошибок** — проверка всех условий перед действием

---

## 🏁 Заключение

Поздравляю! Вы добавили в игру полноценную систему крафта. Теперь игрок может:

1. ⚙️ Создавать оружие и броню из материалов
2. 🔓 Открывать новые рецепты в бою
3. ⚔️ Экипировать созданные предметы
4. 📦 Получать материалы за матчи

**Следующий шаг:** создание боевой системы!

---
