
---

[![Итерация 8 - Готова](https://img.shields.io/badge/Итерация_8-Экономика_и_контент-ffff00?style=for-the-badge)](##-итерация-1-скелет-и-навигация)

> [!NOTE]
> Обновлено 02.03.2026

<br>

> [!IMPORTANT]
> Внимательно читаем инструкцию и определяем участки для изменения, лучше всего комментировать эти места.

<br>

> [!WARNING]
> Выполнить нужно одно или более самостоятельных задания. Не выполненые самостоятельные задания, которые находятся в конце документа - это снижение бала за домашнее задание и возможное снижение итогового бала за зачет.

---

# 🎮 Arena Survivors — Версия 8: Экономика, контент и геймплей

> **Пошаговое руководство по расширению игровых механик**  
> *В этой версии мы добавим полноценную экономику, новые типы врагов, сундуки с добычей и систему открытия контента*

---

## 🎯 Что нового в версии 8

### 💰 Экономика и инвентарь
Раньше у каждого героя был свой инвентарь, что создавало путаницу. Теперь мы вводим четкое разделение:

| Что было | Что стало |
|----------|-----------|
| ❌ Инвентарь у каждого героя | ✅ **Общий рюкзак** для всех предметов |
| ❌ Материалы в том же инвентаре | ✅ **Отдельный склад** для материалов |
| ❌ Предметы привязаны к герою | ✅ Любой герой может использовать общие предметы |
| ❌ Покупка в магазине шла в инвентарь | ✅ Материалы идут на склад, предметы - в рюкзак |

### 🏆 Система навыков
Навыки теперь действительно влияют на характеристики героя:

- **Пассивные бонусы** - увеличение HP, атаки, защиты
- **Активные способности** - блок, двойной удар, критические попадания
- **Специализация класса** - уникальные эффекты для каждого

### 👾 Новые типы врагов
Появляются не сразу, а по мере прохождения:

- **Лучники** - атакуют с расстояния, появляются с 3 волны
- **Маги** - накладывают замедление, появляются с 5 волны
- **Элитные враги** - увеличенные характеристики, появляются с 7 волны

### 📦 Сундуки на арене
Новая механика исследования карты:

- **Требуют времени** - нужно стоять рядом 15 секунд
- **Прогресс откатывается** - если отошел, время сбрасывается
- **Случайная добыча** - зелья, материалы, опыт
- **Исчезают после открытия** - появляются новые на других волнах

### 🎨 Разделение стилей
Все CSS разбито на логические модули:

- `base.css` - базовые стили (сброс, переменные)
- `layout.css` - структура страницы
- `components.css` - компоненты (карточки, кнопки)
- `arena.css` - стили арены
- `modals.css` - стили модальных окон
- `animations.css` - анимации

---

## 📚 Теоретическая часть

### 🔄 Разделение ответственности (SRP - Single Responsibility Principle)

В программировании есть важный принцип: **каждый класс должен иметь только одну причину для изменения**. Давайте посмотрим на пример:

**Плохо:**
```javascript
class Hero {
    constructor() {
        this.inventory = []; // Инвентарь героя
        this.materials = []; // Материалы героя
    }
}
```

**Хорошо:**
```javascript
class Hero {
    constructor() {
        this.equipment = {}; // Только то, что надето
    }
}

class InventorySystem {
    static backpack = []; // Общий рюкзак для всех
    static materials = {}; // Общий склад материалов
}
```

### 📦 Система ресурсов

В нашей игре будет три типа хранилищ:

1. **Рюкзак (Backpack)** - содержит предметы (оружие, броню, зелья)
2. **Склад (Materials)** - содержит ресурсы для крафта
3. **Экипировка (Equipment)** - то, что надето на героя

### 🎮 Прогрессия в игре

Чтобы игра не была скучной, мы используем **динамическую сложность**:

- **Волны** - каждые 30 секунд сложность растет
- **Новые враги** - появляются на определенных волнах
- **Сундуки** - дают награду за исследование карты

---

## 📁 Новая структура папок

```
js/
├── core/                    # Ядро игры
│   ├── GameState.js         # Состояние игры (ОБНОВИТЬ)
│   ├── Hero.js              # Класс героя (ОБНОВИТЬ)
│   ├── Item.js              # Классы предметов (ОБНОВИТЬ)
│   └── Skill.js             # Классы навыков (ОБНОВИТЬ)
│
├── arena/                   # Логика арены
│   ├── SurvivorsArena.js    # Основной класс арены (ОБНОВИТЬ)
│   ├── GameEntity.js        # Сущности арены (ОБНОВИТЬ)
│   ├── WaveManager.js       # НОВЫЙ - управление волнами
│   └── Chest.js             # НОВЫЙ - класс сундука
│
├── ui/                      # Пользовательский интерфейс
│   ├── UIManager.js         # Менеджер UI (ОБНОВИТЬ)
│   └── templates/           # Шаблоны HTML
│       ├── heroCard.js      # Был
│       ├── inventory.js     # ОБНОВИТЬ - разделение рюкзака и склада
│       └── ...              # остальные шаблоны
│
├── config/                  # Конфигурации
│   ├── heroClasses.js       # Конфигурация классов (ОБНОВИТЬ - навыки)
│   ├── enemyTypes.js        # Конфигурация врагов (ОБНОВИТЬ - новые типы)
│   ├── waveConfig.js        # НОВЫЙ - конфигурация волн
│   ├── chestLoot.js         # НОВЫЙ - конфигурация добычи из сундуков
│   └── ...                  # остальные конфиги
│
├── css/                     # НОВАЯ ПАПКА - стили
│   ├── base.css             # Базовые стили
│   ├── layout.css           # Стили layout
│   ├── components.css       # Стили компонентов
│   ├── arena.css            # Стили арены
│   ├── modals.css           # Стили модальных окон
│   └── animations.css       # Анимации
│
└── game.js                  # Точка входа (ОБНОВИТЬ)
```

---

## 🔧 Какие файлы нужно изменить/создать

| Файл | Тип | Что нужно сделать |
|------|-----|-------------------|
| `js/config/waveConfig.js` | **НОВЫЙ** | Конфигурация волн и появления врагов |
| `js/config/chestLoot.js` | **НОВЫЙ** | Конфигурация добычи из сундуков |
| `js/arena/WaveManager.js` | **НОВЫЙ** | Менеджер волн |
| `js/arena/Chest.js` | **НОВЫЙ** | Класс сундука |
| `js/core/GameState.js` | **ОБНОВИТЬ** | Разделить инвентарь и материалы |
| `js/core/Hero.js` | **ОБНОВИТЬ** | Исправить применение навыков |
| `js/core/Skill.js` | **ОБНОВИТЬ** | Правильное применение эффектов |
| `js/config/enemyTypes.js` | **ОБНОВИТЬ** | Добавить лучников и магов |
| `js/config/heroClasses.js` | **ОБНОВИТЬ** | Добавить стартовые навыки |
| `js/arena/SurvivorsArena.js` | **ОБНОВИТЬ** | Добавить сундуки и волны |
| `js/arena/GameEntity.js` | **ОБНОВИТЬ** | Добавить новых врагов |
| `js/ui/UIManager.js` | **ОБНОВИТЬ** | Разделить рюкзак и склад |
| `js/ui/templates/inventory.js` | **ОБНОВИТЬ** | Новый шаблон инвентаря |
| `js/game.js` | **ОБНОВИТЬ** | Инициализация ресурсов |

---

## 📝 Пошаговая инструкция

### Шаг 1: Создаем новые конфигурационные файлы

#### 1.1 Создаем `js/config/waveConfig.js`

**Теория:** Волны в игре - это способ постепенно увеличивать сложность. Мы будем использовать конфигурацию, где каждая волна имеет свои параметры: какие враги появляются, с какой частотой, и какие бонусы даются.

```javascript
// js/config/waveConfig.js
// Конфигурация волн для арены

const WaveConfig = {
    // Базовые настройки
    base: {
        waveDuration: 30,           // Длительность волны в секундах
        baseEnemyCount: 5,           // Базовое количество врагов
        spawnInterval: 2.0,           // Интервал спавна в секундах
    },
    
    // Настройки по волнам
    waves: [
        { // Волна 1 - только гоблины
            enemies: ['goblin'],
            spawnRate: 1.5,
            difficulty: 1.0,
            chestChance: 0.3,        // 30% шанс появления сундука
            special: null
        },
        { // Волна 2 - гоблины + скелеты
            enemies: ['goblin', 'skeleton'],
            spawnRate: 1.3,
            difficulty: 1.2,
            chestChance: 0.4,
            special: null
        },
        { // Волна 3 - появляются лучники
            enemies: ['goblin', 'skeleton', 'archer'],
            spawnRate: 1.2,
            difficulty: 1.5,
            chestChance: 0.5,
            special: 'ranged_unlock'  // Разблокировка лучников
        },
        { // Волна 4 - смешанные
            enemies: ['goblin', 'skeleton', 'archer', 'ghost'],
            spawnRate: 1.1,
            difficulty: 1.8,
            chestChance: 0.6,
            special: null
        },
        { // Волна 5 - появляются маги
            enemies: ['goblin', 'skeleton', 'archer', 'ghost', 'mage'],
            spawnRate: 1.0,
            difficulty: 2.0,
            chestChance: 0.7,
            special: 'mage_unlock'
        },
        { // Волна 6 - элитные враги
            enemies: ['goblin', 'skeleton', 'archer', 'ghost', 'mage', 'elite'],
            spawnRate: 0.9,
            difficulty: 2.5,
            chestChance: 0.8,
            special: 'elite_unlock'
        },
        { // Волна 7 - босс
            enemies: ['goblin', 'skeleton', 'archer', 'ghost', 'mage', 'elite', 'boss'],
            spawnRate: 0.8,
            difficulty: 3.0,
            chestChance: 1.0,
            special: 'boss_fight'
        }
    ],
    
    // Коэффициенты сложности для бесконечного режима
    infinite: {
        hpMultiplier: 0.3,           // +30% здоровья каждую волну
        damageMultiplier: 0.2,        // +20% урона каждую волну
        speedMultiplier: 0.1,         // +10% скорости каждую волну
        spawnRateMultiplier: -0.05,   // -5% интервала спавна (чаще враги)
        chestChanceMultiplier: 0.05   // +5% шанс сундука каждую волну
    }
};

window.WaveConfig = WaveConfig;
```

#### 1.2 Создаем `js/config/chestLoot.js`

**Теория:** Сундуки должны давать случайную, но сбалансированную награду. Мы используем систему весов: чем больше вес, тем выше шанс выпадения.

```javascript
// js/config/chestLoot.js
// Конфигурация добычи из сундуков

const ChestLootConfig = {
    // Базовые настройки
    base: {
        openTime: 15,                // Время открытия в секундах
        resetTime: 5,                 // Время сброса прогресса
        maxDistance: 100,              // Максимальное расстояние для открытия
    },
    
    // Таблица добычи
    lootTable: [
        // Зелья здоровья (вес 30)
        {
            type: 'consumable',
            id: 'consumable_hp_small',
            name: 'Малое зелье здоровья',
            icon: '💗',
            effect: 'heal',
            value: 30,
            weight: 30,
            minWave: 1,
            maxWave: 3
        },
        {
            type: 'consumable',
            id: 'consumable_hp_medium',
            name: 'Среднее зелье здоровья',
            icon: '💗',
            effect: 'heal',
            value: 60,
            weight: 20,
            minWave: 3,
            maxWave: 5
        },
        {
            type: 'consumable',
            id: 'consumable_hp_large',
            name: 'Большое зелье здоровья',
            icon: '💗',
            effect: 'heal',
            value: 100,
            weight: 10,
            minWave: 5
        },
        
        // Материалы (вес 40)
        {
            type: 'material',
            id: 'material_wood',
            name: 'Древесина',
            icon: '🌲',
            amount: 2,
            weight: 40,
            minWave: 1
        },
        {
            type: 'material',
            id: 'material_iron',
            name: 'Железо',
            icon: '⛓️',
            amount: 1,
            weight: 30,
            minWave: 2
        },
        {
            type: 'material',
            id: 'material_cloth',
            name: 'Ткань',
            icon: '🌯',
            amount: 1,
            weight: 30,
            minWave: 1
        },
        
        // Опыт (вес 20)
        {
            type: 'exp',
            amount: 10,
            weight: 40,
            minWave: 1
        },
        {
            type: 'exp',
            amount: 25,
            weight: 30,
            minWave: 3
        },
        {
            type: 'exp',
            amount: 50,
            weight: 20,
            minWave: 5
        },
        
        // Редкие предметы (вес 10)
        {
            type: 'weapon',
            id: 'weapon_sword_2',
            name: 'Железный меч',
            icon: '⚔️',
            weight: 5,
            minWave: 4
        },
        {
            type: 'accessory',
            id: 'accessory_crit_1',
            name: 'Кольцо удачи',
            icon: '💍',
            stats: { critChance: 0.05 },
            weight: 5,
            minWave: 5
        }
    ],
    
    // Количество предметов из сундука
    itemCount: {
        min: 1,
        max: 3
    }
};

window.ChestLootConfig = ChestLootConfig;
```

#### 1.3 Обновляем `js/config/enemyTypes.js` - добавляем новых врагов

```javascript
// js/config/enemyTypes.js (дополнение)
// Добавляем новых врагов в существующий конфиг

const EnemyTypeConfig = {
    // ... существующие враги (гоблин, скелет и т.д.)
    
    // НОВЫЙ ТИП: Лучник
    archer: {
        name: 'Лучник',
        baseHp: 25,
        baseAttack: 8,
        speed: 1.8,
        expValue: 15,
        color: '#8B4513',
        spriteKey: 'archer',
        variants: ['archer'],
        bobSpeed: 8,
        attackInterval: 2.0,
        radius: 18,
        attackType: 'ranged',        // Дальний бой
        range: 250,                   // Дальность стрельбы
        projectileSpeed: 300,
        unlockWave: 3,                // Появляется с 3 волны
        description: 'Атакует с расстояния'
    },
    
    // НОВЫЙ ТИП: Маг
    mage: {
        name: 'Маг',
        baseHp: 20,
        baseAttack: 6,
        speed: 1.5,
        expValue: 20,
        color: '#4a4aff',
        spriteKey: 'mage',
        variants: ['mage'],
        bobSpeed: 6,
        attackInterval: 3.0,
        radius: 18,
        attackType: 'magic',          // Магическая атака
        range: 200,
        projectileSpeed: 250,
        effects: ['slow'],             // Замедляет при попадании
        slowDuration: 2,
        slowAmount: 0.5,
        unlockWave: 5,                 // Появляется с 5 волны
        description: 'Замедляет героя магией'
    },
    
    // НОВЫЙ ТИП: Элитный враг
    elite: {
        name: 'Элитный воин',
        baseHp: 80,
        baseAttack: 15,
        speed: 1.3,
        expValue: 40,
        color: '#ffaa00',
        spriteKey: 'elite',
        variants: ['elite'],
        bobSpeed: 5,
        attackInterval: 1.5,
        radius: 25,
        attackType: 'melee',
        effects: ['stun'],             // Может оглушать
        stunChance: 0.2,
        unlockWave: 7,                  // Появляется с 7 волны
        description: 'Опасный противник с усиленными характеристиками'
    }
};

window.EnemyTypeConfig = EnemyTypeConfig;
```

#### 1.4 Обновляем `js/config/heroClasses.js` - добавляем стартовые навыки

```javascript
// js/config/heroClasses.js (дополнение)
// Добавляем стартовые навыки и эффекты

const HeroClassConfig = {
    warrior: {
        name: 'Воин',
        baseStats: { hp: 120, attack: 18, defense: 12, speed: 8 },
        description: 'Мастер ближнего боя, может носить тяжелую броню',
        equipmentSlots: {
            weapon1: { type: 'weapon' },
            weapon2: { type: ['weapon', 'shield'] },
            armor: { type: 'armor' },
            accessory: { type: 'accessory' }
        },
        startingWeapon: {
            name: 'Меч',
            damage: 8,
            range: 70,
            cooldown: 1.4,
            type: 'melee',
            icon: '⚔️'
        },
        // НОВОЕ: Стартовые навыки
        startingSkills: [
            {
                id: 'skill_warrior_toughness',
                name: 'Стойкость',
                description: 'Увеличивает здоровье на 20',
                effects: { hp: 20 },
                icon: '❤️'
            }
        ],
        // НОВОЕ: Классовые бонусы
        classBonuses: {
            blockChance: 0.1,           // 10% шанс заблокировать атаку
            blockReduction: 0.5,         // Блок уменьшает урон на 50%
            healthRegen: 1               // Регенерация 1 HP в секунду
        },
        color: '#4aff4a',
        icon: '⚔️'
    },
    
    archer: {
        name: 'Лучник',
        baseStats: { hp: 80, attack: 22, defense: 6, speed: 15 },
        description: 'Мастер дальнего боя, наносит критический урон',
        equipmentSlots: {
            weapon1: { type: 'weapon' },
            armor: { type: 'armor' },
            accessory1: { type: 'accessory' },
            accessory2: { type: 'accessory' }
        },
        startingWeapon: {
            name: 'Лук',
            damage: 12,
            range: 300,
            cooldown: 1.7,
            type: 'ranged',
            accuracy: 0.8,
            icon: '🏹'
        },
        // НОВОЕ: Стартовые навыки
        startingSkills: [
            {
                id: 'skill_archer_accuracy',
                name: 'Меткость',
                description: 'Увеличивает шанс попадания на 10%',
                effects: { special: { type: 'accuracy', bonus: 0.1 } },
                icon: '🎯'
            }
        ],
        // НОВОЕ: Классовые бонусы
        classBonuses: {
            critChance: 0.15,            // 15% базовый шанс крита
            critDamage: 2.0,              // Крит наносит двойной урон
            rangeBonus: 1.2                // +20% к дальности
        },
        color: '#ffaa00',
        icon: '🏹'
    }
    
    // ... остальные классы
};

window.HeroClassConfig = HeroClassConfig;
```

---

### Шаг 2: Создаем новые классы для арены

#### 2.1 Создаем `js/arena/WaveManager.js`

**Теория:** WaveManager отвечает за управление волнами - когда какие враги появляются, как растет сложность. Это отдельный класс, чтобы не перегружать SurvivorsArena.

```javascript
// js/arena/WaveManager.js
// Менеджер волн для арены

class WaveManager {
    constructor(arena) {
        this.arena = arena;
        this.config = window.WaveConfig;
        
        this.currentWave = 0;
        this.waveTime = 0;
        this.waveDuration = this.config.base.waveDuration;
        
        this.unlockedEnemies = new Set(['goblin']); // Стартовые враги
        this.spawnedThisWave = 0;
        this.maxEnemiesThisWave = this.config.base.baseEnemyCount;
    }
    
    /**
     * Обновление состояния волн (вызывается каждый кадр)
     */
    update(deltaTime) {
        this.waveTime += deltaTime;
        
        // Проверяем, не пора ли перейти к следующей волне
        if (this.waveTime >= this.waveDuration) {
            this.nextWave();
        }
        
        // Проверяем, не нужно ли разблокировать новых врагов
        this.checkUnlocks();
    }
    
    /**
     * Переход к следующей волне
     */
    nextWave() {
        this.currentWave++;
        this.waveTime = 0;
        
        console.log(`🌊 Волна ${this.currentWave} началась!`);
        
        // Получаем конфиг текущей волны
        const waveConfig = this.config.waves[this.currentWave - 1] || 
                          this.generateInfiniteWave();
        
        // Обновляем параметры
        this.maxEnemiesThisWave = Math.floor(
            this.config.base.baseEnemyCount * waveConfig.difficulty
        );
        this.spawnedThisWave = 0;
        
        // Разблокируем новые типы врагов
        if (waveConfig.special) {
            this.handleSpecialEvent(waveConfig.special);
        }
        
        // Оповещаем UI о новой волне
        if (window.ui) {
            window.ui.showNotification(`🌊 Волна ${this.currentWave}`, 'info');
        }
    }
    
    /**
     * Генерация бесконечной волны (после последней в конфиге)
     */
    generateInfiniteWave() {
        const inf = this.config.infinite;
        const lastWave = this.config.waves[this.config.waves.length - 1];
        
        return {
            enemies: lastWave.enemies,
            spawnRate: Math.max(
                0.5, 
                lastWave.spawnRate + inf.spawnRateMultiplier * this.currentWave
            ),
            difficulty: lastWave.difficulty + 
                       inf.hpMultiplier * this.currentWave,
            chestChance: Math.min(
                1.0,
                lastWave.chestChance + inf.chestChanceMultiplier * this.currentWave
            )
        };
    }
    
    /**
     * Проверка разблокировки новых врагов
     */
    checkUnlocks() {
        Object.entries(window.EnemyTypeConfig).forEach(([type, config]) => {
            if (config.unlockWave && 
                config.unlockWave <= this.currentWave && 
                !this.unlockedEnemies.has(type)) {
                this.unlockedEnemies.add(type);
                console.log(`🔓 Разблокирован новый враг: ${config.name}`);
                
                if (window.ui) {
                    window.ui.showNotification(`🔓 Новый враг: ${config.name}`, 'info');
                }
            }
        });
    }
    
    /**
     * Обработка специальных событий волны
     */
    handleSpecialEvent(event) {
        switch(event) {
            case 'ranged_unlock':
                this.arena.showMessage('🏹 Появились лучники! Держите дистанцию!');
                break;
            case 'mage_unlock':
                this.arena.showMessage('🔮 Появились маги! Они замедляют!');
                break;
            case 'elite_unlock':
                this.arena.showMessage('💀 Элитные враги! Будьте осторожны!');
                break;
            case 'boss_fight':
                this.arena.showMessage('👾 БОСС! Соберитесь!');
                this.spawnBoss();
                break;
        }
    }
    
    /**
     * Спавн босса
     */
    spawnBoss() {
        // Спавним босса в центре карты
        const boss = new ArenaEnemy(
            this.arena.worldWidth / 2,
            this.arena.worldHeight / 2,
            this.currentWave * 2
        );
        boss.type = 'boss';
        this.arena.enemies.push(boss);
    }
    
    /**
     * Получить доступных врагов для текущей волны
     */
    getAvailableEnemies() {
        const waveConfig = this.config.waves[this.currentWave - 1] || 
                          this.generateInfiniteWave();
        
        return waveConfig.enemies.filter(enemy => 
            this.unlockedEnemies.has(enemy)
        );
    }
    
    /**
     * Проверить, можно ли заспавнить еще врага
     */
    canSpawnEnemy() {
        return this.spawnedThisWave < this.maxEnemiesThisWave &&
               this.arena.enemies.length < this.arena.maxEnemies;
    }
    
    /**
     * Увеличить счетчик заспавненных врагов
     */
    onEnemySpawned() {
        this.spawnedThisWave++;
    }
    
    /**
     * Получить текущий множитель сложности
     */
    getDifficultyMultiplier() {
        const waveConfig = this.config.waves[this.currentWave - 1] || 
                          this.generateInfiniteWave();
        return waveConfig.difficulty;
    }
    
    /**
     * Получить шанс появления сундука
     */
    getChestChance() {
        const waveConfig = this.config.waves[this.currentWave - 1] || 
                          this.generateInfiniteWave();
        return waveConfig.chestChance;
    }
}

window.WaveManager = WaveManager;
```

#### 2.2 Создаем `js/arena/Chest.js`

**Теория:** Сундук - это интерактивный объект на карте. Игрок должен подойти и подождать, чтобы открыть его. Если отойти - прогресс сбрасывается. Это создает элемент риска: пока стоишь у сундука, враги могут атаковать.

```javascript
// js/arena/Chest.js
// Класс сундука на арене

class Chest extends ArenaEntity {
    constructor(worldX, worldY) {
        super(worldX, worldY, 25, '#ffaa00');
        
        this.config = window.ChestLootConfig;
        
        // Состояние сундука
        this.isOpen = false;
        this.openProgress = 0;
        this.requiredTime = this.config.base.openTime;
        this.resetTime = this.config.base.resetTime;
        this.lastPlayerDistance = Infinity;
        this.openingTimer = 0;
        this.resetTimer = 0;
        
        // Визуальные эффекты
        this.glowIntensity = 0;
        this.sparkles = [];
        this.generateSparkles();
        
        // Добыча (генерируется при создании)
        this.loot = this.generateLoot();
        
        // Для анимации
        this.bobSpeed = 3;
        this.color = '#ffaa00';
        this.spriteKey = 'chest';
    }
    
    /**
     * Генерация случайной добычи
     */
    generateLoot() {
        const loot = [];
        const count = Math.floor(
            Math.random() * (this.config.itemCount.max - this.config.itemCount.min + 1)
        ) + this.config.itemCount.min;
        
        // Фильтруем доступную добычу по текущей волне
        const availableLoot = this.config.lootTable.filter(item => {
            if (item.minWave && item.minWave > window.currentArena?.waveManager?.currentWave) {
                return false;
            }
            if (item.maxWave && item.maxWave < window.currentArena?.waveManager?.currentWave) {
                return false;
            }
            return true;
        });
        
        // Выбираем случайные предметы с учетом весов
        for (let i = 0; i < count; i++) {
            const totalWeight = availableLoot.reduce((sum, item) => sum + item.weight, 0);
            let random = Math.random() * totalWeight;
            
            for (const item of availableLoot) {
                if (random < item.weight) {
                    loot.push({ ...item }); // Копируем, чтобы не изменять оригинал
                    break;
                }
                random -= item.weight;
            }
        }
        
        return loot;
    }
    
    /**
     * Генерация искр для визуального эффекта
     */
    generateSparkles() {
        for (let i = 0; i < 5; i++) {
            this.sparkles.push({
                angle: Math.random() * Math.PI * 2,
                distance: 15 + Math.random() * 20,
                speed: 0.5 + Math.random() * 1,
                offset: Math.random() * Math.PI * 2
            });
        }
    }
    
    /**
     * Обновление состояния сундука
     */
    update(deltaTime, hero) {
        super.update(deltaTime);
        
        if (this.isOpen) return;
        
        // Проверяем расстояние до героя
        const distance = hero ? Math.hypot(
            hero.worldX - this.worldX,
            hero.worldY - this.worldY
        ) : Infinity;
        
        // Обновляем прогресс открытия
        if (distance < this.config.base.maxDistance) {
            // Герой рядом - увеличиваем прогресс
            this.openingTimer += deltaTime;
            this.openProgress = Math.min(
                1,
                this.openingTimer / this.requiredTime
            );
            
            // Сбрасываем таймер сброса
            this.resetTimer = 0;
            
            // Визуальный эффект - свечение
            this.glowIntensity = Math.min(1, this.glowIntensity + deltaTime * 2);
            
            // Если прогресс достиг 100% - открываем сундук
            if (this.openProgress >= 1) {
                this.open();
            }
        } else {
            // Герой ушел - начинаем сбрасывать прогресс
            this.resetTimer += deltaTime;
            this.glowIntensity = Math.max(0, this.glowIntensity - deltaTime);
            
            if (this.resetTimer >= this.resetTime) {
                this.openingTimer = 0;
                this.openProgress = 0;
            }
        }
        
        this.lastPlayerDistance = distance;
        
        // Анимация искр
        this.updateSparkles(deltaTime);
    }
    
    /**
     * Обновление анимации искр
     */
    updateSparkles(deltaTime) {
        this.sparkles.forEach(sparkle => {
            sparkle.angle += sparkle.speed * deltaTime;
        });
    }
    
    /**
     * Открытие сундука
     */
    open() {
        this.isOpen = true;
        console.log('🎁 Сундук открыт! Добыча:', this.loot);
        
        // Применяем добычу
        this.applyLoot();
        
        // Визуальный эффект открытия
        this.color = '#aaaaaa';
        
        // Уведомление игрока
        if (window.ui) {
            window.ui.showNotification('🎁 Сундук открыт!', 'success');
        }
    }
    
    /**
     * Применение добычи к игре
     */
    applyLoot() {
        this.loot.forEach(item => {
            switch(item.type) {
                case 'consumable':
                    // Добавляем в рюкзак
                    window.GameState.addToBackpack({
                        id: item.id,
                        name: item.name,
                        icon: item.icon,
                        type: 'consumable',
                        effect: item.effect,
                        value: item.value
                    });
                    break;
                    
                case 'material':
                    // Добавляем на склад материалов
                    window.GameState.addMaterial(item.id, item.amount || 1);
                    break;
                    
                case 'exp':
                    // Добавляем опыт герою
                    if (window.currentArena?.hero) {
                        window.currentArena.hero.addExp(item.amount);
                    }
                    break;
                    
                case 'weapon':
                case 'accessory':
                    // Добавляем в рюкзак
                    window.GameState.addToBackpack({
                        id: item.id,
                        name: item.name,
                        icon: item.icon,
                        type: item.type,
                        stats: item.stats || {}
                    });
                    break;
            }
        });
        
        // Обновляем UI
        if (window.ui) {
            window.ui.updateResourcesUI();
        }
    }
    
    /**
     * Отрисовка сундука
     */
    draw(ctx, cameraX, cameraY) {
        const screenX = this.getScreenX(cameraX);
        const screenY = this.getScreenY(cameraY) + this.bobOffset;
        
        if (screenX + this.radius < 0 || screenX - this.radius > ctx.canvas.width ||
            screenY + this.radius < 0 || screenY - this.radius > ctx.canvas.height) {
            return;
        }
        
        ctx.save();
        
        // Эффект свечения при открытии
        if (this.glowIntensity > 0) {
            ctx.shadowColor = '#ffaa00';
            ctx.shadowBlur = 20 * this.glowIntensity;
        }
        
        // Рисуем сундук
        if (this.isOpen) {
            // Открытый сундук
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(screenX - 20, screenY - 15, 40, 30);
            
            // Крышка
            ctx.fillStyle = '#A0522D';
            ctx.fillRect(screenX - 22, screenY - 25, 44, 10);
            
            // Замок
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(screenX, screenY - 10, 5, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Закрытый сундук
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(screenX - 20, screenY - 20, 40, 30);
            
            // Крышка
            ctx.fillStyle = '#A0522D';
            ctx.fillRect(screenX - 22, screenY - 25, 44, 10);
            
            // Замок
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(screenX, screenY - 10, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
        
        // Прогресс-бар открытия
        if (this.openProgress > 0 && this.openProgress < 1) {
            const barWidth = 60;
            const barHeight = 6;
            
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(
                screenX - barWidth/2,
                screenY - 40,
                barWidth,
                barHeight
            );
            
            ctx.fillStyle = '#ffaa00';
            ctx.fillRect(
                screenX - barWidth/2,
                screenY - 40,
                barWidth * this.openProgress,
                barHeight
            );
            
            // Текст прогресса
            ctx.fillStyle = '#fff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(
                `${Math.floor(this.openProgress * 100)}%`,
                screenX,
                screenY - 45
            );
        }
        
        // Рисуем искры
        ctx.strokeStyle = '#ffaa00';
        ctx.lineWidth = 2;
        this.sparkles.forEach(sparkle => {
            const x = screenX + Math.cos(sparkle.angle) * sparkle.distance;
            const y = screenY + Math.sin(sparkle.angle) * sparkle.distance;
            
            ctx.beginPath();
            ctx.moveTo(x - 2, y - 2);
            ctx.lineTo(x + 2, y + 2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(x + 2, y - 2);
            ctx.lineTo(x - 2, y + 2);
            ctx.stroke();
        });
    }
}

window.Chest = Chest;
```

---

### Шаг 3: Обновляем классы ядра игры

#### 3.1 Обновляем `js/core/GameState.js` - разделяем инвентарь и материалы

**Теория:** Теперь у нас будет два отдельных хранилища:
- **backpack** - массив предметов (оружие, броня, зелья)
- **materials** - объект с количеством ресурсов

```javascript
// js/core/GameState.js (обновленная версия)
// ==============================
// Хранилище состояний игры
// ==============================

const GameState = {
// Ресурсы для входа на локации
    resources: {
        proviziya: 10,
        toplivo: 5,
        instrumenty: 3
    },
    
    // НОВОЕ: Общий рюкзак для всех предметов
    backpack: [], // Содержит предметы (оружие, броня, аксессуары, зелья)
    
    // НОВОЕ: Склад материалов (отдельно от предметов)
    materials: {
        wood: 5,
        iron: 2,
        cloth: 3
    },
    
    heroes: [],
    currentHeroId: null,
    lastPassiveUpdate: Date.now(),
    
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
    
    // НОВЫЙ МЕТОД: Добавить предмет в рюкзак
    addToBackpack(item) {
        this.backpack.push({
            ...item,
            instanceId: Date.now() + Math.random() + item.id // Уникальный ID
        });
        console.log(`📦 Предмет добавлен в рюкзак: ${item.name}`);
        this.notify();
    },
    
    // НОВЫЙ МЕТОД: Удалить предмет из рюкзака
    removeFromBackpack(itemId) {
        const index = this.backpack.findIndex(item => item.id === itemId || item.instanceId === itemId);
        if (index !== -1) {
            const item = this.backpack[index];
            this.backpack.splice(index, 1);
            console.log(`📦 Предмет удален из рюкзака: ${item.name}`);
            this.notify();
            return true;
        }
        return false;
    },
    
    // НОВЫЙ МЕТОД: Получить предметы определенного типа из рюкзака
    getBackpackItemsByType(type) {
        return this.backpack.filter(item => item.type === type);
    },
    
    // НОВЫЙ МЕТОД: Добавить материалы на склад
    addMaterial(type, amount) {
        if (this.materials[type] !== undefined) {
            this.materials[type] += amount;
            console.log(`📦 Материалы добавлены: ${type} +${amount}`);
            this.notify();
        }
    },
    
    // НОВЫЙ МЕТОД: Потратить материалы со склада
    useMaterial(type, amount) {
        if (this.materials[type] !== undefined && this.materials[type] >= amount) {
            this.materials[type] -= amount;
            console.log(`📦 Материалы использованы: ${type} -${amount}`);
            this.notify();
            return true;
        }
        return false;
    },
    
    // НОВЫЙ МЕТОД: Получить все материалы
    getMaterials() {
        return { ...this.materials };
    },
    
    // НОВЫЙ МЕТОД: Проверить, хватает ли материалов для крафта
    hasEnoughMaterials(requirements) {
        for (const req of requirements) {
            if (this.materials[req.itemId] < req.quantity) {
                return false;
            }
        }
        return true;
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
            
            this.heroes.forEach(hero => {
                if (hero.isUnlocked) {
                    resourcesGained.proviziya += 0.05 * diffSeconds;
                    resourcesGained.toplivo += 0.03 * diffSeconds;
                    resourcesGained.instrumenty += 0.02 * diffSeconds;
                }
            });
            
            this.resources.proviziya = Math.round((this.resources.proviziya + resourcesGained.proviziya) * 10) / 10;
            this.resources.toplivo = Math.round((this.resources.toplivo + resourcesGained.toplivo) * 10) / 10;
            this.resources.instrumenty = Math.round((this.resources.instrumenty + resourcesGained.instrumenty) * 10) / 10;
            
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
    
    // Инициализация навыков
    initSkills() {
        this.skillManager = new window.SkillManager();
        this.notify();
    },
    
    // НОВЫЙ МЕТОД: Крафт предмета (использует материалы со склада)
    craftItem(recipeId, heroId) {
        if (!this.recipeManager) {
            return { success: false, message: 'Система крафта не инициализирована' };
        }
        
        const hero = this.heroes.find(h => h.id === heroId);
        if (!hero) {
            return { success: false, message: 'Герой не найден' };
        }
        
        const recipe = this.recipeManager.getRecipe(recipeId);
        if (!recipe) {
            return { success: false, message: 'Рецепт не найден' };
        }
        
        // Проверяем, открыт ли рецепт
        if (!recipe.isUnlocked) {
            return { success: false, message: 'Рецепт еще не открыт' };
        }
        
        // Проверяем уровень героя
        if (hero.level < recipe.requiredLevel) {
            return { success: false, message: `Требуется уровень ${recipe.requiredLevel}` };
        }
        
        // Проверяем наличие материалов на складе
        if (!this.hasEnoughMaterials(recipe.materials)) {
            return { success: false, message: 'Недостаточно материалов' };
        }
        
        // Списываем материалы со склада
        for (const material of recipe.materials) {
            this.useMaterial(material.itemId, material.quantity);
        }
        
        // Добавляем результат в рюкзак
        this.addToBackpack(recipe.resultItem);
        
        // Пытаемся открыть новый рецепт
        const newRecipe = recipe.tryUnlockNewRecipe(this.recipeManager.recipes);
        
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
    },
    
    // НОВЫЙ МЕТОД: Купить предмет в магазине
    buyItem(itemId, heroId) {
        if (!this.shop) {
            return { success: false, message: 'Магазин не инициализирован' };
        }
        
        const hero = this.heroes.find(h => h.id === heroId);
        if (!hero) {
            return { success: false, message: 'Герой не найден' };
        }
        
        const item = this.shop.dailyItems.find(i => i.id === itemId);
        if (!item) {
            return { success: false, message: 'Предмет не найден' };
        }
        
        const price = item.getPrice();
        
        // Проверяем, хватает ли ресурсов
        if (this.resources.proviziya < price) {
            return { success: false, message: 'Недостаточно провизии' };
        }
        
        // Списываем ресурсы
        this.updateResource('proviziya', -price);
        
        // Если это материал - отправляем на склад, иначе в рюкзак
        if (item.type === 'material') {
            this.addMaterial(item.id.replace('material_', ''), item.amount || 1);
        } else {
            this.addToBackpack({ ...item });
        }
        
        return {
            success: true,
            message: `Куплен ${item.name} за ${price} провизии`,
            item: item
        };
    },
    
    // Добавить награды после боя
    addBattleRewards() {
        const materials = [
            { type: 'wood', amount: Math.floor(Math.random() * 3) + 1 },
            { type: 'iron', amount: Math.floor(Math.random() * 2) },
            { type: 'cloth', amount: Math.floor(Math.random() * 2) }
        ];
        
        materials.forEach(m => {
            if (m.amount > 0) {
                this.addMaterial(m.type, m.amount);
            }
        });
        
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
};

window.GameState = GameState;

setInterval(() => {
    window.GameState.passiveUpdate();
}, 1000);
```

#### 3.2 Обновляем `js/core/Hero.js` - исправляем применение навыков

**Теория:** Навыки теперь должны действительно влиять на характеристики героя. Мы добавим метод `applySkillEffects()`, который пересчитывает все бонусы.

```javascript
// js/core/Hero.js (обновленная версия)
// ==============================
// Класс героя в игре.
// ==============================

class Hero {
    constructor(id, name, baseStats, type) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.level = 1;
        this.exp = 0;
        this.expToNextLevel = 100;
        this.isUnlocked = true;
        
        // Получаем конфигурацию класса
        const classConfig = window.HeroClassConfig[type] || window.HeroClassConfig.warrior;
        
        // Базовые характеристики
        this.baseStats = {
            hp: baseStats.hp || classConfig.baseStats.hp,
            attack: baseStats.attack || classConfig.baseStats.attack,
            defense: baseStats.defense || classConfig.baseStats.defense,
            speed: baseStats.speed || classConfig.baseStats.speed
        };
        
        // НОВОЕ: Базовая статистика (без бонусов)
        this.rawStats = { ...this.baseStats };
        
        // Максимальное здоровье
        this.maxHp = this.baseStats.hp;
        
        // Текущие характеристики (будут пересчитаны)
        this.currentStats = { ...this.baseStats };
        
        // Снаряжение
        this.equipment = this.initEquipmentSlots(classConfig.equipmentSlots);
        
        // НОВОЕ: Навыки - теперь массив объектов, а не ID
        this.learnedSkills = [];
        
        // НОВОЕ: Стартовые навыки из конфига
        if (classConfig.startingSkills) {
            classConfig.startingSkills.forEach(skillData => {
                const skill = new Skill(
                    skillData.id,
                    skillData.name,
                    skillData.description,
                    'passive',
                    [this.type],
                    1,
                    skillData.effects,
                    skillData.icon
                );
                this.learnedSkills.push(skill);
                skill.apply(this);
            });
        }
        
        this.skillPoints = 0;
        this.pendingSkillLevel = 0;
        
        // НОВОЕ: Классовые бонусы
        this.classBonuses = classConfig.classBonuses || {};
        
        // Боевые характеристики
        this.critChance = this.classBonuses.critChance || 0;
        this.critDamage = this.classBonuses.critDamage || 1.5;
        this.lifesteal = 0;
        this.specialEffects = [];
        
        // Конфигурация класса
        this.classConfig = classConfig;
        
        // НОВОЕ: Пересчитываем все бонусы
        this.recalculateStats();
    }
    
    initEquipmentSlots(slotConfig) {
        const slots = {};
        for (const slotName of Object.keys(slotConfig)) {
            slots[slotName] = null;
        }
        return slots;
    }
    
    // НОВЫЙ МЕТОД: Пересчет всех характеристик
    recalculateStats() {
        // Начинаем с базовых характеристик
        this.currentStats = { ...this.rawStats };
        this.maxHp = this.rawStats.hp;
        
        // Добавляем бонусы от экипировки
        const allEquipment = Object.values(this.equipment).filter(item => item !== null);
        
        allEquipment.forEach(item => {
            if (item.stats) {
                if (item.stats.attack) this.currentStats.attack += item.stats.attack;
                if (item.stats.defense) this.currentStats.defense += item.stats.defense;
                if (item.stats.hp) {
                    this.currentStats.hp += item.stats.hp;
                    this.maxHp += item.stats.hp;
                }
                if (item.stats.speed) this.currentStats.speed += item.stats.speed;
            }
            
            if (item.special) {
                if (item.special.critChance) this.critChance += item.special.critChance;
                if (item.special.critDamage) this.critDamage += item.special.critDamage;
                if (item.special.lifesteal) this.lifesteal += item.special.lifesteal;
            }
        });
        
        // Добавляем бонусы от навыков
        this.learnedSkills.forEach(skill => {
            if (skill.effects.attack) this.currentStats.attack += skill.effects.attack;
            if (skill.effects.defense) this.currentStats.defense += skill.effects.defense;
            if (skill.effects.hp) {
                this.currentStats.hp += skill.effects.hp;
                this.maxHp += skill.effects.hp;
            }
            if (skill.effects.speed) this.currentStats.speed += skill.effects.speed;
            if (skill.effects.critChance) this.critChance += skill.effects.critChance;
            if (skill.effects.critDamage) this.critDamage += skill.effects.critDamage;
            if (skill.effects.lifesteal) this.lifesteal += skill.effects.lifesteal;
        });
        
        // Добавляем классовые бонусы
        if (this.classBonuses.healthRegen) {
            // Будет обрабатываться отдельно
        }
        
        // Убеждаемся, что текущее HP не превышает максимум
        if (this.currentStats.hp > this.maxHp) {
            this.currentStats.hp = this.maxHp;
        }
    }
    
    // Добавить опыт
    addExp(amount) {
        this.exp += amount;
        console.log(`Герой ${this.name} получил ${amount} опыта. Всего: ${this.exp}/${this.expToNextLevel}`);
        
        let leveledUp = false;
        while (this.exp >= this.expToNextLevel) {
            this.levelUp();
            leveledUp = true;
        }
        return leveledUp;
    }
    
    // Повышение уровня
    levelUp() {
        this.level++;
        this.exp -= this.expToNextLevel;
        this.expToNextLevel = Math.floor(this.expToNextLevel * 1.5);
        
        // Улучшаем базовые характеристики
        this.rawStats.hp += 10;
        this.rawStats.attack += 2;
        this.rawStats.defense += 1;
        
        // Пересчитываем все с учетом бонусов
        this.recalculateStats();
        
        // Каждые 3 уровня даем возможность выбрать навык
        if (this.level % 3 === 0) {
            this.pendingSkillLevel = this.level;
            this.skillPoints = (this.skillPoints || 0) + 1;
        }
    }
    
    // Проверить, нужно ли выбрать навык
    hasPendingSkill() {
        return this.pendingSkillLevel > 0;
    }
    
    // Экипировать предмет
    equip(item, slot) {
        const validSlots = this.getValidSlotsForItem(item);
        
        if (!validSlots.includes(slot)) return false;
        
        // Если в слоте уже есть предмет, возвращаем его в рюкзак
        if (this.equipment[slot]) {
            window.GameState.addToBackpack(this.equipment[slot]);
        }
        
        // Экипируем новый предмет
        this.equipment[slot] = item;
        
        // Удаляем предмет из рюкзака
        window.GameState.removeFromBackpack(item.instanceId || item.id);
        
        // Пересчитываем характеристики
        this.recalculateStats();
        return true;
    }
    
    // Снять предмет
    unequip(slot) {
        const item = this.equipment[slot];
        if (!item) return false;
        
        // Возвращаем в рюкзак
        window.GameState.addToBackpack(item);
        
        // Очищаем слот
        this.equipment[slot] = null;
        
        // Пересчитываем характеристики
        this.recalculateStats();
        return true;
    }
    
    // Получить допустимые слоты для предмета
    getValidSlotsForItem(item) {
        const slots = [];
        
        switch(item.type) {
            case 'weapon':
                if (this.type === 'warrior' || this.type === 'rogue') {
                    slots.push('weapon1', 'weapon2');
                } else {
                    slots.push('weapon1');
                }
                break;
            case 'shield':
                if (this.type === 'warrior') slots.push('weapon2');
                break;
            case 'armor':
                if (['warrior', 'archer'].includes(this.type)) slots.push('armor');
                break;
            case 'accessory':
                if (this.type === 'warrior') slots.push('accessory');
                if (this.type === 'archer') slots.push('accessory1', 'accessory2');
                if (this.type === 'mage') slots.push('accessory1', 'accessory2', 'accessory3');
                if (this.type === 'rogue') slots.push('accessory1', 'accessory2');
                break;
        }
        return slots;
    }
    
    // Получить все экипированные предметы
    getEquippedItems() {
        return Object.values(this.equipment).filter(item => item !== null);
    }
    
    // Применить урон с учетом критов и блоков
    calculateDamage(baseDamage) {
        let damage = baseDamage;
        
        // Проверка на блок (для воина)
        if (this.classBonuses.blockChance && Math.random() < this.classBonuses.blockChance) {
            damage *= (1 - (this.classBonuses.blockReduction || 0.5));
            return Math.floor(damage);
        }
        
        // Критический удар
        if (Math.random() < this.critChance) {
            damage *= this.critDamage;
        }
        
        return Math.floor(damage);
    }
    
    // Восстановление здоровья
    heal(amount) {
        this.currentStats.hp = Math.min(this.currentStats.hp + amount, this.maxHp);
    }
    
    // Регенерация здоровья (вызывается каждый кадр на арене)
    regen(deltaTime) {
        if (this.classBonuses.healthRegen) {
            this.heal(this.classBonuses.healthRegen * deltaTime);
        }
    }
}

window.Hero = Hero;
```

#### 3.3 Обновляем `js/core/Skill.js` - правильное применение эффектов

```javascript
// js/core/Skill.js (обновленная версия)
// ==============================
// Класс навыков для героев
// ==============================

class Skill {
    constructor(id, name, description, type, heroClasses, levelRequirement, effects, icon = '✨') {
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type; // 'passive', 'active', 'ultimate'
        this.heroClasses = heroClasses;
        this.levelRequirement = levelRequirement;
        this.effects = effects;
        this.icon = icon;
        this.isUnlocked = false;
        
        // Для активных навыков
        this.cooldown = 0;
        this.maxCooldown = effects.cooldown || 0;
        this.duration = effects.duration || 0;
        this.isActive = false;
        this.activeTimer = 0;
    }
    
    // Применить эффекты навыка к герою
    apply(hero) {
        console.log(`✨ Применяем навык ${this.name} к герою ${hero.name}`);
        
        // Сохраняем ссылку на героя для активных навыков
        this.hero = hero;
        
        // Применяем пассивные эффекты
        if (this.type === 'passive') {
            this.applyPassive(hero);
        }
        
        // Пересчитываем характеристики героя
        hero.recalculateStats();
    }
    
    // Применить пассивные эффекты
    applyPassive(hero) {
        if (this.effects.attack) {
            hero.rawStats.attack += this.effects.attack;
            console.log(`  +${this.effects.attack} к атаке`);
        }
        if (this.effects.defense) {
            hero.rawStats.defense += this.effects.defense;
            console.log(`  +${this.effects.defense} к защите`);
        }
        if (this.effects.hp) {
            hero.rawStats.hp += this.effects.hp;
            console.log(`  +${this.effects.hp} к здоровью`);
        }
        if (this.effects.speed) {
            hero.rawStats.speed += this.effects.speed;
            console.log(`  +${this.effects.speed} к скорости`);
        }
        if (this.effects.critChance) {
            hero.critChance = (hero.critChance || 0) + this.effects.critChance;
            console.log(`  +${Math.round(this.effects.critChance * 100)}% к крит. шансу`);
        }
        if (this.effects.critDamage) {
            hero.critDamage = (hero.critDamage || 1.5) + this.effects.critDamage;
            console.log(`  +${Math.round(this.effects.critDamage * 100)}% к крит. урону`);
        }
        if (this.effects.lifesteal) {
            hero.lifesteal = (hero.lifesteal || 0) + this.effects.lifesteal;
            console.log(`  +${Math.round(this.effects.lifesteal * 100)}% к вампиризму`);
        }
    }
    
    // НОВЫЙ МЕТОД: Активировать активный навык
    activate() {
        if (this.type !== 'active' || this.cooldown > 0) return false;
        
        this.isActive = true;
        this.activeTimer = this.duration;
        this.cooldown = this.maxCooldown;
        
        console.log(`✨ Активирован навык: ${this.name}`);
        
        // Применяем временные эффекты
        if (this.effects.special) {
            this.hero.specialEffects = this.hero.specialEffects || [];
            this.hero.specialEffects.push({
                ...this.effects.special,
                source: this.id,
                duration: this.duration
            });
        }
        
        return true;
    }
    
    // НОВЫЙ МЕТОД: Обновление активного навыка (вызывается каждый кадр)
    update(deltaTime) {
        if (this.cooldown > 0) {
            this.cooldown -= deltaTime;
        }
        
        if (this.isActive) {
            this.activeTimer -= deltaTime;
            
            // Применяем эффекты длящихся навыков
            if (this.effects.damagePerSecond) {
                // Наносим урон врагам вокруг
                this.applyAreaDamage(deltaTime);
            }
            
            if (this.activeTimer <= 0) {
                this.deactivate();
            }
        }
    }
    
    // НОВЫЙ МЕТОД: Деактивировать навык
    deactivate() {
        this.isActive = false;
        
        // Убираем временные эффекты
        if (this.hero && this.hero.specialEffects) {
            this.hero.specialEffects = this.hero.specialEffects.filter(
                effect => effect.source !== this.id
            );
        }
        
        console.log(`✨ Навык ${this.name} закончил действие`);
    }
    
    // НОВЫЙ МЕТОД: Применить урон по области
    applyAreaDamage(deltaTime) {
        if (!this.hero || !window.currentArena) return;
        
        const arena = window.currentArena;
        arena.enemies.forEach(enemy => {
            const distance = Math.hypot(
                enemy.worldX - this.hero.worldX,
                enemy.worldY - this.hero.worldY
            );
            
            if (distance < this.effects.radius) {
                enemy.takeDamage(this.effects.damagePerSecond * deltaTime);
            }
        });
    }
}

// Менеджер навыков
class SkillManager {
    constructor() {
        this.skills = [];
        this.initSkills();
    }
    
    initSkills() {
        const config = window.SkillConfig;
        
        // Загружаем все навыки из конфигурации
        Object.values(config).forEach(category => {
            category.forEach(skillData => {
                this.skills.push(new Skill(
                    skillData.id,
                    skillData.name,
                    skillData.description,
                    skillData.type || 'passive',
                    skillData.heroClasses,
                    skillData.levelRequirement,
                    skillData.effects,
                    skillData.icon
                ));
            });
        });
        
        console.log('Навыки инициализированы:', this.skills.length);
    }
    
    // Получить доступные навыки для героя
    getAvailableSkills(hero, level) {
        return this.skills.filter(skill => 
            skill.heroClasses.includes(hero.type) && 
            skill.levelRequirement <= level &&
            !hero.learnedSkills.some(s => s.id === skill.id)
        );
    }
    
    // Получить 3 случайных навыка для выбора
    getRandomSkillsForHero(hero, level) {
        const available = this.getAvailableSkills(hero, level);
        
        if (available.length === 0) {
            hero.pendingSkillLevel = 0;
            return [];
        }
        
        const shuffled = [...available].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(3, shuffled.length));
    }
    
    // Изучить навык
    learnSkill(hero, skillId) {
        const skill = this.skills.find(s => s.id === skillId);
        if (!skill) return false;
        
        if (hero.learnedSkills.some(s => s.id === skillId)) return false;
        
        // Создаем копию навыка для героя
        const heroSkill = new Skill(
            skill.id,
            skill.name,
            skill.description,
            skill.type,
            skill.heroClasses,
            skill.levelRequirement,
            { ...skill.effects },
            skill.icon
        );
        
        hero.learnedSkills.push(heroSkill);
        heroSkill.apply(hero);
        
        console.log(`✨ Герой ${hero.name} изучил навык: ${skill.name}`);
        return true;
    }
    
    // НОВЫЙ МЕТОД: Обновление всех активных навыков героя
    updateHeroSkills(hero, deltaTime) {
        hero.learnedSkills.forEach(skill => {
            if (skill.type === 'active') {
                skill.update(deltaTime);
            }
        });
    }
}

window.Skill = Skill;
window.SkillManager = SkillManager;
```

---

### Шаг 4: Обновляем классы арены

#### 4.1 Обновляем `js/arena/SurvivorsArena.js` - добавляем волны и сундуки

```javascript
// js/arena/SurvivorsArena.js (обновленная версия)
// Основной класс арены в стиле Survivors

class SurvivorsArena {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        this.screenWidth = 800;
        this.screenHeight = 600;

        this.worldWidth = 2400;
        this.worldHeight = 1800;

        this.cameraX = 0;
        this.cameraY = 0;

        this.isRunning = false;
        this.isPaused = false;
        this.gameTime = 0;

        // Сущности
        this.hero = null;
        this.enemies = [];
        this.expGems = [];
        
        // НОВОЕ: Сундуки
        this.chests = [];
        
        // НОВОЕ: Менеджер волн
        this.waveManager = null;

        this.maxEnemies = 40;
        this.skillChoiceShown = false;

        // Управление
        this.keys = {};
        this.joystick = { active: false, dirX: 0, dirY: 0 };

        this.decorations = [];
        this.lastTimestamp = 0;
        this.firstFrame = true;

        window.currentArena = this;

        this.generateDecorations();
        this.initControls();
        this.initResizeHandler();
        this.initOrientationHandler();
        this.initMutationObserver();
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        if (!container) return;

        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        if (containerWidth > 0 && containerHeight > 0) {
            this.screenWidth = containerWidth;
            this.screenHeight = containerHeight;
            this.canvas.width = containerWidth;
            this.canvas.height = containerHeight;

            if (this.hero) {
                this.updateCamera();
            }
        }
    }

    initResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (this.isRunning) {
                    this.resizeCanvas();
                }
            }, 100);
        });
    }

    initOrientationHandler() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                if (this.isRunning) {
                    this.resizeCanvas();
                }
            }, 200);
        });
    }

    initMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const screenArena = document.getElementById('screenArena');
                    if (screenArena && screenArena.classList.contains('active') && this.isRunning) {
                        setTimeout(() => {
                            this.resizeCanvas();
                        }, 50);
                    }
                }
            });
        });

        const screenArena = document.getElementById('screenArena');
        if (screenArena) {
            observer.observe(screenArena, { attributes: true });
        }
    }

    generateDecorations() {
        this.decorations = [];
        for (let i = 0; i < 100; i++) {
            this.decorations.push({
                x: Math.random() * this.worldWidth,
                y: Math.random() * this.worldHeight,
                type: Math.floor(Math.random() * 3),
                size: 20 + Math.random() * 30
            });
        }
    }

    updateCamera() {
        if (!this.hero) return;

        this.cameraX = this.hero.worldX - this.screenWidth / 2;
        this.cameraY = this.hero.worldY - this.screenHeight / 2;

        this.cameraX = Math.max(0, Math.min(this.worldWidth - this.screenWidth, this.cameraX));
        this.cameraY = Math.max(0, Math.min(this.worldHeight - this.screenHeight, this.cameraY));
    }

    init(heroData) {
        console.log('Инициализация арены с героем:', heroData);

        this.resizeCanvas();
        
        setTimeout(() => {
            if (this.isRunning) {
                this.resizeCanvas();
            }
        }, 50);

        // Размещаем героя в центре мира
        this.hero = new ArenaHero(this.worldWidth / 2, this.worldHeight / 2, heroData);
        this.enemies = [];
        this.expGems = [];
        
        // НОВОЕ: Инициализируем сундуки
        this.chests = [];
        
        this.gameTime = 0;
        this.skillChoiceShown = false;
        this.firstFrame = true;

        // НОВОЕ: Создаем менеджер волн
        this.waveManager = new WaveManager(this);

        if (!this.hero.heroData.learnedSkills) {
            this.hero.heroData.learnedSkills = [];
        }

        this.updateCamera();

        // НОВОЕ: Спавним первый сундук
        this.spawnChest();

        const pauseMenu = document.getElementById('pauseMenu');
        if (pauseMenu) {
            pauseMenu.style.display = 'none';
        }
    }

    start() {
        this.isRunning = true;
        this.isPaused = false;
        this.lastTimestamp = performance.now();
        this.firstFrame = true;
        
        this.resizeCanvas();
        
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
        this.lastTimestamp = performance.now();
        this.skillChoiceShown = false;
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    stop() {
        this.isRunning = false;
        window.currentArena = null;
    }

    gameLoop(timestamp) {
        if (!this.isRunning) return;

        const deltaTime = Math.min((timestamp - this.lastTimestamp) / 1000, 0.1);
        this.lastTimestamp = timestamp;

        if (this.firstFrame && this.hero) {
            this.updateCamera();
            this.firstFrame = false;
        }

        if (!this.isPaused && this.hero) {
            this.update(deltaTime);
        }

        this.draw();

        requestAnimationFrame((ts) => this.gameLoop(ts));
    }

    update(deltaTime) {
        this.gameTime += deltaTime;

        this.updateUI();

        // НОВОЕ: Обновляем менеджер волн
        if (this.waveManager) {
            this.waveManager.update(deltaTime);
        }

        if (!this.skillChoiceShown && this.hero && this.hero.heroData) {
            this.checkSkillChoice();
        }

        if (this.isPaused) return;

        this.handleHeroMovement(deltaTime);
        this.hero.update(deltaTime, this.worldWidth, this.worldHeight);
        
        // НОВОЕ: Регенерация героя
        this.hero.regen(deltaTime);
        
        this.updateCamera();

        if (this.hero.hp <= 0) {
            this.gameOver();
            return;
        }

        // НОВОЕ: Спавн врагов через менеджер волн
        if (this.waveManager && this.waveManager.canSpawnEnemy()) {
            this.spawnEnemy();
        }

        // Обновляем врагов
        this.enemies = this.enemies.filter(enemy => {
            enemy.update(deltaTime, this.hero, this.worldWidth, this.worldHeight);
            this.checkWeaponHits(enemy);
            return enemy.hp > 0;
        });

        // Обновляем кристаллы опыта
        this.expGems = this.expGems.filter(gem => {
            if (!gem) return false;
            gem.update(deltaTime, this.worldWidth, this.worldHeight);

            if (this.hero) {
                const distance = Math.hypot(gem.worldX - this.hero.worldX, gem.worldY - this.hero.worldY);
                if (distance < this.hero.radius + gem.radius + this.hero.expMagnet) {
                    this.hero.addExp(gem.value);
                    return false;
                }
            }
            return true;
        });

        // НОВОЕ: Обновляем сундуки
        this.chests = this.chests.filter(chest => {
            chest.update(deltaTime, this.hero);
            return !chest.isOpen; // Удаляем открытые сундуки
        });

        // НОВОЕ: Спавним новый сундук с некоторым шансом
        if (this.waveManager && Math.random() < 0.001 * deltaTime * 60) { // ~0.1% шанс в секунду
            if (this.chests.length < 3) { // Не больше 3 сундуков одновременно
                this.spawnChest();
            }
        }
    }

    checkWeaponHits(enemy) {
        if (!this.hero || !this.hero.weapons) return;

        this.hero.weapons.forEach(weapon => {
            if (weapon && weapon.projectiles) {
                weapon.projectiles.forEach(projectile => {
                    if (projectile && projectile.isActive) {
                        if (weapon.data && weapon.data.type === 'ranged') {
                            const distance = Math.hypot(
                                projectile.worldX - enemy.worldX,
                                projectile.worldY - enemy.worldY
                            );
                            if (distance < enemy.radius + 5) {
                                enemy.takeDamage(projectile.damage);
                                projectile.isActive = false;

                                if (enemy.hp <= 0) {
                                    this.spawnExpGem(enemy.worldX, enemy.worldY, enemy.expValue);
                                }
                            }
                        } else if (projectile.hitEnemies && !projectile.hitEnemies.has(enemy)) {
                            if (this.checkMeleeHit(this.hero, enemy, (projectile.data && projectile.data.range) || 60)) {
                                enemy.takeDamage((projectile.data && projectile.data.damage) || 5);
                                projectile.hitEnemies.add(enemy);

                                if (enemy.hp <= 0) {
                                    this.spawnExpGem(enemy.worldX, enemy.worldY, enemy.expValue);
                                }
                            }
                        }
                    }
                });
            }
        });
    }

    checkMeleeHit(hero, enemy, range) {
        if (!hero || !enemy) return false;
        const distance = Math.hypot(hero.worldX - enemy.worldX, hero.worldY - enemy.worldY);
        return distance < hero.radius + enemy.radius + range;
    }

    handleHeroMovement(deltaTime) {
        let moveX = 0, moveY = 0;

        if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) moveY -= 1;
        if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) moveY += 1;
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) moveX -= 1;
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) moveX += 1;

        if (this.joystick.active) {
            moveX = this.joystick.dirX;
            moveY = this.joystick.dirY;
        }

        if (moveX !== 0 || moveY !== 0 && this.hero) {
            const length = Math.sqrt(moveX * moveX + moveY * moveY);
            this.hero.vx = (moveX / length) * 0.5;
            this.hero.vy = (moveY / length) * 0.5;
        } else if (this.hero) {
            this.hero.vx = 0;
            this.hero.vy = 0;
        }
    }

    spawnEnemy() {
        let x, y;
        const viewMargin = 300;

        do {
            x = Math.random() * this.worldWidth;
            y = Math.random() * this.worldHeight;
        } while (
            x > this.cameraX - viewMargin &&
            x < this.cameraX + this.screenWidth + viewMargin &&
            y > this.cameraY - viewMargin &&
            y < this.cameraY + this.screenHeight + viewMargin
        );

        // НОВОЕ: Получаем доступных врагов из менеджера волн
        const availableEnemies = this.waveManager ? 
            this.waveManager.getAvailableEnemies() : 
            ['goblin', 'skeleton'];
        
        const enemyType = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
        const difficulty = this.waveManager ? this.waveManager.getDifficultyMultiplier() : 1;
        
        const enemy = new ArenaEnemy(x, y, difficulty, enemyType);
        this.enemies.push(enemy);
        
        if (this.waveManager) {
            this.waveManager.onEnemySpawned();
        }
    }

    // НОВЫЙ МЕТОД: Спавн сундука
    spawnChest() {
        let x, y;
        const viewMargin = 300;

        // Спавним в отдалении от героя
        do {
            x = Math.random() * this.worldWidth;
            y = Math.random() * this.worldHeight;
        } while (
            Math.hypot(x - this.hero.worldX, y - this.hero.worldY) < 300 ||
            (x > this.cameraX - viewMargin &&
             x < this.cameraX + this.screenWidth + viewMargin &&
             y > this.cameraY - viewMargin &&
             y < this.cameraY + this.screenHeight + viewMargin)
        );

        const chest = new Chest(x, y);
        this.chests.push(chest);
    }

    spawnExpGem(x, y, value) {
        this.expGems.push(new ExpGem(x, y, value));
    }

    updateUI() {
        if (!this.hero) return;

        const hpPercent = (this.hero.hp / this.hero.maxHp) * 100;
        const expPercent = ((this.hero.exp % 100) / 100) * 100;

        const hpBar = document.getElementById('arenaHpBar');
        const hpText = document.getElementById('arenaHpText');
        const expBar = document.getElementById('arenaExpBar');
        const expText = document.getElementById('arenaExpText');
        const timer = document.getElementById('arenaTimer');
        
        // НОВОЕ: Отображение волны
        const waveDisplay = document.getElementById('arenaWave');

        if (hpBar) hpBar.style.width = `${hpPercent}%`;
        if (hpText) hpText.textContent = `${Math.floor(this.hero.hp)}/${this.hero.maxHp}`;

        if (expBar) expBar.style.width = `${expPercent}%`;
        if (expText) expText.textContent = `Ур. ${this.hero.level} (${this.hero.exp % 100}/100)`;

        if (waveDisplay && this.waveManager) {
            waveDisplay.textContent = `🌊 Волна ${this.waveManager.currentWave}`;
        }

        const minutes = Math.floor(this.gameTime / 60);
        const seconds = Math.floor(this.gameTime % 60);
        if (timer) timer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        this.updateSkillSlots();
    }

    updateSkillSlots() {
        const skillSlots = document.querySelectorAll('.skill-slot');
        if (!skillSlots.length || !this.hero || !this.hero.heroData) return;

        const learnedSkills = this.hero.heroData.learnedSkills || [];

        skillSlots.forEach(slot => {
            slot.innerHTML = '';
            slot.classList.remove('active');
        });

        learnedSkills.forEach((skill, index) => {
            if (index < skillSlots.length) {
                skillSlots[index].innerHTML = skill.icon;
                skillSlots[index].classList.add('active');
                skillSlots[index].title = skill.name;
            }
        });
    }

    draw() {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);

        this.drawBackground();
        this.drawDecorations();

        // НОВОЕ: Рисуем сундуки
        if (this.chests) {
            this.chests.forEach(chest => {
                if (chest) chest.draw(this.ctx, this.cameraX, this.cameraY);
            });
        }

        if (this.expGems) {
            this.expGems.forEach(gem => {
                if (gem) gem.draw(this.ctx, this.cameraX, this.cameraY);
            });
        }

        if (this.enemies) {
            this.enemies.forEach(enemy => {
                if (enemy) enemy.draw(this.ctx, this.cameraX, this.cameraY);
            });
        }

        if (this.hero) {
            this.hero.draw(this.ctx, this.cameraX, this.cameraY);
        }
    }

    drawBackground() {
        // НОВОЕ: Фон зависит от локации
        let gradient;
        if (this.currentLocation === 'desert') {
            gradient = this.ctx.createLinearGradient(0, 0, 0, this.screenHeight);
            gradient.addColorStop(0, '#8B7355');
            gradient.addColorStop(1, '#5D4A36');
        } else if (this.currentLocation === 'factory') {
            gradient = this.ctx.createLinearGradient(0, 0, 0, this.screenHeight);
            gradient.addColorStop(0, '#4a4a4a');
            gradient.addColorStop(1, '#2a2a2a');
        } else {
            gradient = this.ctx.createLinearGradient(0, 0, 0, this.screenHeight);
            gradient.addColorStop(0, '#1a4a1a');
            gradient.addColorStop(1, '#2a5a2a');
        }
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
    }

    drawDecorations() {
        if (!this.decorations) return;

        this.decorations.forEach(dec => {
            const screenX = dec.x - this.cameraX;
            const screenY = dec.y - this.cameraY;

            if (screenX + dec.size < 0 || screenX - dec.size > this.screenWidth ||
                screenY + dec.size < 0 || screenY - dec.size > this.screenHeight) {
                return;
            }

            if (dec.type === 0) { // Дерево
                this.ctx.fillStyle = '#8B4513';
                this.ctx.fillRect(screenX - 5, screenY - dec.size / 2, 10, dec.size);
                this.ctx.fillStyle = '#0a8a0a';
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY - dec.size / 2 - 10, dec.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (dec.type === 1) { // Камень
                this.ctx.fillStyle = '#888';
                this.ctx.beginPath();
                this.ctx.ellipse(screenX, screenY, dec.size / 2, dec.size / 3, 0, 0, Math.PI * 2);
                this.ctx.fill();
            } else { // Куст
                this.ctx.fillStyle = '#2a8a2a';
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY, dec.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }

    togglePause() {
        const pauseMenu = document.getElementById('pauseMenu');
        if (!pauseMenu) return;

        if (this.isPaused) {
            this.resume();
            pauseMenu.style.display = 'none';
        } else {
            this.pause();
            pauseMenu.style.display = 'block';
        }
    }

    gameOver() {
        this.isRunning = false;
        
        if (window.ui) {
            window.ui.showBattleResults(this);
        }
        
        setTimeout(() => {
            this.exitArena();
        }, 3000);
    }

    exitArena() {
        this.stop();

        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('screenLobby').classList.add('active');
        document.querySelector('.game-nav').style.display = 'flex';

        const gameHeader = document.querySelector('.game-header');
        if (gameHeader) {
            gameHeader.style.display = 'flex';
            gameHeader.style.visibility = 'visible';
        }

        const pauseMenu = document.getElementById('pauseMenu');
        if (pauseMenu) {
            pauseMenu.style.display = 'none';
        }

        if (this.hero && this.hero.heroData) {
            this.hero.heroData.currentStats.hp = this.hero.hp;
            this.hero.heroData.level = this.hero.level;
            this.hero.heroData.exp = this.hero.exp;
            window.GameState.notify();
        }

        window.currentArena = null;
    }

    initControls() {
        window.addEventListener('keydown', (e) => {
            if (e.key.startsWith('Arrow') || ['w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
                e.preventDefault();
                this.keys[e.key] = true;
            }

            if (e.key === 'Escape' && this.isRunning) {
                this.togglePause();
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.key.startsWith('Arrow') || ['w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
                e.preventDefault();
                this.keys[e.key] = false;
            }
        });

        const joystickBase = document.querySelector('.joystick-base');
        const joystickThumb = document.getElementById('joystickThumb');

        if (joystickBase && joystickThumb) {
            let joystickActive = false;

            const touchStartHandler = (e) => {
                e.preventDefault();
                joystickActive = true;
                this.joystick.active = true;
            };

            const touchMoveHandler = (e) => {
                e.preventDefault();
                if (!joystickActive) return;

                const touch = e.touches[0];
                const rect = joystickBase.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                let dx = touch.clientX - centerX;
                let dy = touch.clientY - centerY;

                const maxRadius = rect.width / 2;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > maxRadius) {
                    dx = (dx / distance) * maxRadius;
                    dy = (dy / distance) * maxRadius;
                }

                joystickThumb.style.transform = `translate(${dx}px, ${dy}px)`;

                this.joystick.dirX = (dx / maxRadius) * 0.5;
                this.joystick.dirY = (dy / maxRadius) * 0.5;
            };

            const touchEndHandler = (e) => {
                e.preventDefault();
                joystickActive = false;
                this.joystick.active = false;
                joystickThumb.style.transform = 'translate(0, 0)';
            };

            joystickBase.addEventListener('touchstart', touchStartHandler, { passive: false });
            joystickBase.addEventListener('touchmove', touchMoveHandler, { passive: false });
            joystickBase.addEventListener('touchend', touchEndHandler, { passive: false });
            joystickBase.addEventListener('touchcancel', touchEndHandler, { passive: false });
        }
    }

    checkSkillChoice() {
        if (!this.hero || !this.hero.heroData || this.skillChoiceShown) {
            return;
        }
        
        const hasPending = this.hero.heroData.pendingSkillLevel > 0;
        
        if (hasPending) {
            this.skillChoiceShown = true;
            this.pause();
            
            const skills = window.GameState.skillManager.getRandomSkillsForHero(
                this.hero.heroData, 
                this.hero.heroData.pendingSkillLevel
            );
            
            setTimeout(() => {
                if (window.ui) {
                    window.ui.showSkillChoice(this.hero.heroData, skills);
                } else {
                    this.skillChoiceShown = false;
                    this.hero.heroData.pendingSkillLevel = 0;
                    this.resume();
                }
            }, 500);
        }
    }
    
    // НОВЫЙ МЕТОД: Показать сообщение на экране
    showMessage(text) {
        if (window.ui) {
            window.ui.showNotification(text, 'info');
        }
    }
}

window.SurvivorsArena = SurvivorsArena;
```

#### 4.2 Обновляем `js/arena/GameEntity.js` - добавляем новых врагов

```javascript
// В js/arena/GameEntity.js обновляем класс ArenaEnemy

class ArenaEnemy extends ArenaEntity {
    constructor(worldX, worldY, difficulty, enemyType = null) {
        super(worldX, worldY, 20);
        
        this.difficulty = difficulty;
        
        // Получаем конфигурацию врага
        let config;
        if (enemyType && window.EnemyTypeConfig[enemyType]) {
            config = window.EnemyTypeConfig[enemyType];
        } else {
            // Случайный враг
            const enemyTypes = Object.keys(window.EnemyTypeConfig);
            const typeKey = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            config = window.EnemyTypeConfig[typeKey];
            enemyType = typeKey;
        }
        
        this.type = enemyType;
        this.config = config;
        
        // Характеристики из конфига
        this.hp = config.baseHp * difficulty;
        this.maxHp = this.hp;
        this.attack = config.baseAttack * difficulty;
        this.speed = config.speed;
        this.expValue = config.expValue;
        this.color = config.color;
        this.bobSpeed = config.bobSpeed || 8;
        this.attackInterval = config.attackInterval || 1.0;
        this.radius = config.radius || 20;
        
        this.spriteKey = config.spriteKey;
        
        // НОВОЕ: Тип атаки (ближний/дальний)
        this.attackType = config.attackType || 'melee';
        this.range = config.range || 50;
        this.projectileSpeed = config.projectileSpeed || 300;
        
        // НОВОЕ: Эффекты врага
        this.effects = config.effects || [];
        this.slowAmount = config.slowAmount || 0.5;
        this.slowDuration = config.slowDuration || 2;
        
        // Для лучников и магов
        this.projectiles = [];
        this.attackCooldown = 0;
        
        // Особые эффекты
        this.slowed = false;
        this.slowTimer = 0;
    }

    takeDamage(amount) {
        this.hp -= amount;
        this.hitEffect = 0.15;
        
        if (this.hp <= 0) return true;
        return false;
    }

    slowDown() {
        if (!this.slowed) {
            this.slowed = true;
            this.speed /= 2;
            this.slowTimer = this.slowDuration;
            this.bobSpeed /= 2;
        }
    }

    update(deltaTime, hero, worldWidth, worldHeight) {
        super.update(deltaTime, worldWidth, worldHeight);
        
        if (this.slowed) {
            this.slowTimer -= deltaTime;
            if (this.slowTimer <= 0) {
                this.slowed = false;
                this.speed *= 2;
                this.bobSpeed *= 2;
            }
        }
        
        if (!hero) return;
        
        // Двигаемся к герою
        const dx = hero.worldX - this.worldX;
        const dy = hero.worldY - this.worldY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // НОВОЕ: Для дальних врагов - держим дистанцию
        if (this.attackType === 'ranged' && distance < this.range * 0.7) {
            // Слишком близко - отступаем
            this.vx = -dx / distance;
            this.vy = -dy / distance;
        } else if (distance > 10) {
            this.vx = dx / distance;
            this.vy = dy / distance;
        } else {
            this.vx = 0;
            this.vy = 0;
        }
        
        // Атака
        this.attackCooldown -= deltaTime;
        
        if (this.attackCooldown <= 0) {
            if (this.attackType === 'ranged' || this.attackType === 'magic') {
                // Дальняя атака
                if (distance < this.range) {
                    this.fireProjectile(hero);
                    this.attackCooldown = this.attackInterval;
                }
            } else {
                // Ближняя атака
                if (distance < this.radius + hero.radius + 10) {
                    hero.takeDamage(this.attack);
                    this.attackCooldown = this.attackInterval;
                }
            }
        }
        
        // Обновляем снаряды
        this.projectiles = this.projectiles.filter(p => p.isActive);
        this.projectiles.forEach(p => p.update(deltaTime, hero));
    }
    
    // НОВЫЙ МЕТОД: Выстрел снарядом
    fireProjectile(hero) {
        this.projectiles.push(new EnemyProjectile(this, hero, this.attack, this.attackType));
    }

    draw(ctx, cameraX, cameraY) {
        const screenX = this.getScreenX(cameraX);
        const screenY = this.getScreenY(cameraY) + this.bobOffset;
        
        if (screenX + this.radius < 0 || screenX - this.radius > ctx.canvas.width ||
            screenY + this.radius < 0 || screenY - this.radius > ctx.canvas.height) {
            return;
        }
        
        ctx.save();
        
        if (this.hitEffect > 0) {
            ctx.globalAlpha = 0.8;
            ctx.filter = 'brightness(1.8) sepia(1)';
        }
        
        let sprite = this.spriteManager ? this.spriteManager.getSprite(this.spriteKey) : null;
        
        if (sprite) {
            if (this.vx !== 0 || this.vy !== 0) {
                ctx.translate(screenX, screenY);
                ctx.rotate(Math.sin(this.animationTimer * 2) * 0.03);
                ctx.translate(-screenX, -screenY);
            }
            
            ctx.drawImage(sprite, screenX - 20, screenY - 20, 40, 40);
        } else {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Иконка типа врага
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            let icon = '👾';
            if (this.attackType === 'ranged') icon = '🏹';
            if (this.attackType === 'magic') icon = '🔮';
            if (this.type === 'boss') icon = '👑';
            
            ctx.fillText(icon, screenX, screenY);
        }
        
        ctx.restore();
        
        // Рисуем снаряды
        this.projectiles.forEach(p => p.draw(ctx, cameraX, cameraY));
        
        const hpPercent = this.hp / this.maxHp;
        const barWidth = 30;
        const barHeight = 3;
        
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(screenX - barWidth/2, screenY - this.radius - 5, barWidth, barHeight);
        
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(screenX - barWidth/2, screenY - this.radius - 5, barWidth * hpPercent, barHeight);
        
        if (this.slowed) {
            ctx.fillStyle = '#00aaff';
            ctx.beginPath();
            ctx.arc(screenX - 15, screenY - 15, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// НОВЫЙ КЛАСС: Снаряд врага
class EnemyProjectile {
    constructor(enemy, target, damage, type) {
        this.worldX = enemy.worldX;
        this.worldY = enemy.worldY;
        this.target = target;
        this.damage = damage;
        this.type = type;
        this.speed = enemy.projectileSpeed || 200;
        this.radius = 5;
        this.isActive = true;
        
        const dx = target.worldX - this.worldX;
        const dy = target.worldY - this.worldY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        this.vx = (dx / distance) * this.speed;
        this.vy = (dy / distance) * this.speed;
        
        // Цвет в зависимости от типа
        this.color = type === 'magic' ? '#aa4aff' : '#ffaa00';
    }
    
    update(deltaTime, hero) {
        this.worldX += this.vx * deltaTime;
        this.worldY += this.vy * deltaTime;
        
        // Проверка попадания
        const distance = Math.hypot(this.worldX - hero.worldX, this.worldY - hero.worldY);
        if (distance < hero.radius + this.radius) {
            hero.takeDamage(this.damage);
            
            // Применяем эффекты (для магов)
            if (this.type === 'magic' && hero.slowDown) {
                hero.slowDown();
            }
            
            this.isActive = false;
        }
        
        // Проверка выхода за границы мира
        if (this.worldX < 0 || this.worldX > 2000 || this.worldY < 0 || this.worldY > 2000) {
            this.isActive = false;
        }
    }
    
    draw(ctx, cameraX, cameraY) {
        const screenX = this.worldX - cameraX;
        const screenY = this.worldY - cameraY;
        
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

window.ArenaEnemy = ArenaEnemy;
window.EnemyProjectile = EnemyProjectile;
```

---

### Шаг 5: Обновляем UI и шаблоны

#### 5.1 Обновляем `js/ui/templates/inventory.js` - разделяем рюкзак и склад

```javascript
// js/ui/templates/inventory.js (обновленная версия)
// Шаблон инвентаря

const InventoryTemplate = {
    /**
     * Создает HTML инвентаря (рюкзак + склад материалов)
     * @param {Object} hero - объект героя
     * @param {Array} backpack - общий рюкзак
     * @param {Object} materials - склад материалов
     * @returns {string} HTML
     */
    render(hero, backpack, materials) {
        // Рюкзак с предметами
        const backpackHtml = backpack.length > 0 
            ? backpack.map((item) => `
                <div class="inventory-item" data-item-id="${item.id}" data-instance-id="${item.instanceId || item.id}" style="background: #16213e; padding: 10px; border-radius: 5px; text-align: center; cursor: pointer; border: 1px solid #0f3460;" 
                     onmouseover="this.style.borderColor='#e94560'" onmouseout="this.style.borderColor='#0f3460'">
                    <div style="font-size: 2rem;">${item.icon || '📦'}</div>
                    <div style="font-size: 0.8rem; color: #fff;">${item.name}</div>
                    <div style="font-size: 0.7rem; color: #aaa;">${item.type}</div>
                </div>
            `).join('') 
            : '<div style="grid-column: span 4; text-align: center; color: #666;">Рюкзак пуст</div>';

        // Склад материалов
        const materialsHtml = `
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
                <div style="background: #2a2a4a; padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2.5rem;">🌲</div>
                    <div style="font-size: 1.2rem; color: #4aff4a;">${materials.wood || 0}</div>
                    <div style="font-size: 0.8rem; color: #aaa;">Древесина</div>
                </div>
                <div style="background: #2a2a4a; padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2.5rem;">⛓️</div>
                    <div style="font-size: 1.2rem; color: #4aff4a;">${materials.iron || 0}</div>
                    <div style="font-size: 0.8rem; color: #aaa;">Железо</div>
                </div>
                <div style="background: #2a2a4a; padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2.5rem;">🌯</div>
                    <div style="font-size: 1.2rem; color: #4aff4a;">${materials.cloth || 0}</div>
                    <div style="font-size: 0.8rem; color: #aaa;">Ткань</div>
                </div>
            </div>
        `;

        // Экипировка
        const equipmentHtml = Object.entries(hero.equipment).map(([slot, item]) => `
            <div class="equipment-slot" data-slot="${slot}" style="background: #16213e; padding: 10px; border-radius: 5px; text-align: center; min-height: 100px; border: 2px solid #0f3460;">
                <div style="font-size: 0.8rem; color: #e94560; margin-bottom: 5px; text-transform: capitalize;">${slot}</div>
                ${item ? `
                    <div style="font-size: 2rem;">${item.icon || '📦'}</div>
                    <div style="font-size: 0.8rem; color: #fff;">${item.name}</div>
                    <button class="unequip-btn" data-hero-id="${hero.id}" data-slot="${slot}" style="font-size: 0.7rem; padding: 2px 5px; margin-top: 5px; background: #e94560; color: white; border: none; border-radius: 3px; cursor: pointer;">Снять</button>
                ` : '<div style="color: #666; padding: 20px 0;">Пусто</div>'}
            </div>
        `).join('');

        return `
            <h2 style="color: #e94560; margin-bottom: 20px;">Инвентарь ${hero.name} (${hero.type})</h2>
            
            <h3 style="color: #4aff4a; margin-bottom: 10px;">📦 Склад материалов</h3>
            ${materialsHtml}
            
            <div style="display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 250px;">
                    <h3 style="color: #4aff4a; margin-bottom: 10px;">🎒 Рюкзак</h3>
                    <div class="inventory-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; max-height: 300px; overflow-y: auto; padding: 10px; background: #0f0f1f; border-radius: 10px;">
                        ${backpackHtml}
                    </div>
                </div>
                
                <div style="flex: 1; min-width: 250px;">
                    <h3 style="color: #4aff4a; margin-bottom: 10px;">⚔️ Экипировка</h3>
                    <div class="equipment-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                        ${equipmentHtml}
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
                <button id="closeInventoryBtn" style="width: auto; padding: 10px 30px; background: #4aff4a; color: #000; border: none; border-radius: 5px; cursor: pointer;">Закрыть</button>
            </div>
        `;
    },

    /**
     * Создает HTML меню экипировки
     * @param {Object} hero - объект героя
     * @param {Object} item - предмет для экипировки
     * @param {Array} validSlots - допустимые слоты
     * @returns {string} HTML
     */
    renderEquipMenu(hero, item, validSlots) {
        const slotsHtml = validSlots.map(slot => `
            <button class="equip-slot-btn" data-slot="${slot}" style="background: #16213e; padding: 15px; border: 2px solid #0f3460; color: white; cursor: pointer; border-radius: 5px;">
                ${slot.charAt(0).toUpperCase() + slot.slice(1)}
                ${hero.equipment[slot] ? `<br><small style="color: #ffaa00;">(занято: ${hero.equipment[slot].name})</small>` : ''}
            </button>
        `).join('');

        return `
            <h2 style="color: #e94560; margin-bottom: 20px;">Экипировка предмета</h2>
            <div style="text-align: center; margin: 20px 0;">
                <div style="font-size: 4rem;">${item.icon || '📦'}</div>
                <h3 style="color: #fff; margin: 10px 0;">${item.name}</h3>
                <p style="color: #aaa;">${item.description || ''}</p>
            </div>
            
            <h3 style="color: #4aff4a; margin-bottom: 10px;">Выберите слот для экипировки:</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 20px 0;">
                ${slotsHtml}
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
                <button id="cancelEquipBtn" style="width: auto; padding: 10px 30px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer;">Отмена</button>
            </div>
        `;
    }
};

window.InventoryTemplate = InventoryTemplate;
```

#### 5.2 Обновляем `js/ui/UIManager.js` - используем новые методы GameState

Обновите методы, связанные с инвентарем:

```javascript
// В методе showHeroInventory замените:
const inventory = window.GameState.inventory || [];
// на:
const backpack = window.GameState.backpack || [];
const materials = window.GameState.getMaterials();

// И в вызове шаблона:
modalBody.innerHTML = window.InventoryTemplate.render(hero, backpack, materials);

// В обработчиках предметов замените:
const item = inventory.find(...)
// на:
const item = backpack.find(...)

// В методе showEquipMenu замените:
window.GameState.removeFromInventory(...)
// на:
window.GameState.removeFromBackpack(...)

// И в конце метода unequip замените:
window.GameState.addToInventory(...)
// на:
window.GameState.addToBackpack(...)
```

---

### Шаг 6: Создаем CSS модули

#### 6.1 Создаем `css/base.css`

```css
/* css/base.css */
/* Базовые стили и переменные */

:root {
    --color-primary: #e94560;
    --color-secondary: #4aff4a;
    --color-background: #0a0a1a;
    --color-surface: #16213e;
    --color-surface-dark: #0f0f1f;
    --color-text: #ffffff;
    --color-text-dim: #aaa;
    
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    
    --border-radius-sm: 4px;
    --border-radius-md: 8px;
    --border-radius-lg: 16px;
    
    --font-size-sm: 0.875rem;
    --font-size-md: 1rem;
    --font-size-lg: 1.25rem;
    --font-size-xl: 1.5rem;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Arial', sans-serif;
    user-select: none;
}

body {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background-color: var(--color-background);
    color: var(--color-text);
}

@keyframes fadeInOut {
    0% { opacity: 0; transform: translate(-50%, -20px); }
    10% { opacity: 1; transform: translate(-50%, 0); }
    90% { opacity: 1; transform: translate(-50%, 0); }
    100% { opacity: 0; transform: translate(-50%, -20px); }
}
```

#### 6.2 Создаем `css/layout.css`

```css
/* css/layout.css */
/* Структура страницы */

.game-container {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.game-header {
    background-color: #000000;
    padding: var(--spacing-md) var(--spacing-lg);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #0f3460;
    flex-shrink: 0;
}

.game-screen {
    flex: 1;
    overflow: auto;
    background-color: #000000;
    position: relative;
    min-height: 0;
}

.screen {
    display: none;
    height: 100%;
    width: 100%;
    overflow-y: auto;
    padding: var(--spacing-lg);
}

.screen.active {
    display: block;
}

.game-nav {
    display: flex;
    justify-content: space-around;
    background-color: #000000;
    padding: var(--spacing-md);
    border-top: 2px solid #0f3460;
    flex-shrink: 0;
    position: relative;
    bottom: 0;
    width: 100%;
    z-index: 50;
}

@media (max-width: 600px) {
    .game-header {
        flex-direction: column;
        gap: var(--spacing-xs);
        padding: var(--spacing-xs) var(--spacing-md);
    }
    
    .screen {
        padding: var(--spacing-md);
    }
}
```

#### 6.3 Создаем `css/components.css`

```css
/* css/components.css */
/* Компоненты интерфейса */

.resources {
    display: flex;
    gap: var(--spacing-lg);
    flex-wrap: wrap;
}

.resource-item {
    background: #081627;
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: 20px;
    font-size: var(--font-size-md);
}

.locations-grid, .heroes-list, .shop-grid, .craft-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-lg);
    padding: var(--spacing-sm) 0;
}

.location-card, .hero-card, .shop-item, .craft-item {
    background: var(--color-surface);
    border: 1px solid #091625;
    border-radius: var(--border-radius-md);
    padding: var(--spacing-lg);
    text-align: center;
}

button {
    background: var(--color-primary);
    color: white;
    border: none;
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    font-size: var(--font-size-md);
    margin-top: var(--spacing-sm);
    width: 100%;
    transition: all 0.3s ease;
}

button:hover {
    background: #ff6b8b;
    transform: translateY(-2px);
}

button:disabled {
    background: #666;
    cursor: not-allowed;
    transform: none;
}

.nav-btn {
    background: transparent;
    color: #a0a0a0;
    font-size: var(--font-size-lg);
    padding: var(--spacing-sm);
    width: auto;
    flex: 1;
    max-width: 120px;
}

.nav-btn.active {
    color: var(--color-primary);
    border-bottom: 2px solid var(--color-primary);
}

.hero-avatar {
    position: relative;
    margin-bottom: var(--spacing-md);
}

.hero-stats p {
    margin: var(--spacing-xs) 0;
    font-size: var(--font-size-sm);
}

.hero-exp progress {
    width: 100%;
    height: 10px;
    margin: var(--spacing-sm) 0;
}

.progress-bar-container {
    background: var(--color-surface);
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: 20px;
    min-width: 200px;
}

.progress-bar {
    width: 100%;
    height: 20px;
    background-color: #2a2a4a;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
}

.progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--color-secondary), #00aa00);
    border-radius: 10px;
    transition: width 0.3s ease;
}

.progress-bar-fill.hp {
    background: linear-gradient(90deg, #ff4a4a, #aa0000);
}

.progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 12px;
    font-weight: bold;
    text-shadow: 1px 1px 2px black;
}

@media (max-width: 600px) {
    .resources {
        justify-content: center;
        gap: var(--spacing-sm);
    }
    
    .resource-item {
        padding: 2px var(--spacing-sm);
        font-size: var(--font-size-sm);
    }
    
    .locations-grid, .heroes-list, .shop-grid, .craft-grid {
        grid-template-columns: 1fr;
        gap: var(--spacing-sm);
    }
}
```

#### 6.4 Создаем `css/arena.css`

```css
/* css/arena.css */
/* Стили для арены */

.arena-game-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #000;
    overflow: hidden;
}

.arena-header {
    background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1f 100%);
    padding: var(--spacing-sm) var(--spacing-lg);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid var(--color-primary);
    flex-shrink: 0;
    z-index: 10;
}

.arena-stats {
    display: flex;
    gap: var(--spacing-lg);
    flex-wrap: wrap;
    align-items: center;
    flex: 1;
}

.arena-stats .stat {
    background: var(--color-surface);
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: 20px;
    font-size: var(--font-size-md);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
}

.arena-skills {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
}

.skill-slot {
    background: var(--color-surface);
    width: 40px;
    height: 40px;
    border-radius: var(--border-radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    position: relative;
    border: 1px solid #0f3460;
    transition: all 0.3s ease;
}

.skill-slot.active {
    border-color: var(--color-primary);
    box-shadow: 0 0 10px rgba(233, 69, 96, 0.5);
}

.skill-slot::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(233,69,96,0.2) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s;
}

.skill-slot.active::after {
    opacity: 1;
    animation: pulse 2s infinite;
}

.pause-btn {
    background: var(--color-primary);
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    flex-shrink: 0;
}

.pause-btn:hover {
    background: #ff6b8b;
    transform: scale(1.1);
}

#gameCanvas {
    display: block;
    width: 100%;
    flex: 1;
    background: #000;
    object-fit: cover;
    min-height: 0;
}

.joystick-container {
    display: none;
    position: absolute;
    bottom: 30px;
    left: 30px;
    width: 120px;
    height: 120px;
    z-index: 20;
}

@media (max-width: 1024px) and (pointer: coarse) {
    .joystick-container {
        display: block;
    }
}

.joystick-base {
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(5px);
    border: 2px solid rgba(255, 255, 255, 0.3);
}

.joystick-thumb {
    width: 50px;
    height: 50px;
    background: rgba(233, 69, 96, 0.8);
    border-radius: 50%;
    transition: transform 0.1s ease;
}

.pause-menu {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.95);
    padding: var(--spacing-xl);
    border-radius: var(--border-radius-lg);
    text-align: center;
    z-index: 30;
    border: 2px solid var(--color-primary);
    min-width: 300px;
}

.pause-menu h3 {
    color: var(--color-primary);
    margin-bottom: var(--spacing-lg);
    font-size: 24px;
}

.pause-menu button {
    width: 100%;
    margin: var(--spacing-sm) 0;
    padding: var(--spacing-md);
    font-size: var(--font-size-md);
    border: none;
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    transition: all 0.3s ease;
}

.resume-btn {
    background: var(--color-secondary);
    color: #000;
}

.exit-arena-btn {
    background: var(--color-primary);
    color: white;
}

@keyframes pulse {
    0% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.2); }
    100% { opacity: 0.3; transform: scale(1); }
}
```

#### 6.5 Создаем `css/modals.css`

```css
/* css/modals.css */
/* Стили для модальных окон */

.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.8);
    z-index: 1000;
}

.modal-content {
    background-color: var(--color-surface);
    margin: 5% auto;
    padding: var(--spacing-lg);
    width: 90%;
    max-width: 800px;
    border-radius: var(--border-radius-md);
    max-height: 80vh;
    overflow-y: auto;
}

.close-modal {
    float: right;
    font-size: 28px;
    cursor: pointer;
    color: var(--color-text-dim);
}

.close-modal:hover {
    color: var(--color-primary);
}

.skill-choice-card {
    background: var(--color-surface-dark);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-md);
    text-align: center;
    cursor: pointer;
    border: 2px solid #0f3460;
    transition: all 0.3s;
}

.skill-choice-card:hover {
    border-color: var(--color-primary);
    transform: scale(1.02);
    box-shadow: 0 0 15px rgba(233,69,96,0.5);
}

.inventory-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-sm);
    max-height: 300px;
    overflow-y: auto;
    padding: var(--spacing-sm);
    background: var(--color-surface-dark);
    border-radius: var(--border-radius-sm);
}

.inventory-item {
    background: var(--color-surface);
    padding: var(--spacing-sm);
    border-radius: var(--border-radius-sm);
    text-align: center;
    cursor: pointer;
    border: 1px solid #0f3460;
}

.inventory-item:hover {
    border-color: var(--color-primary);
}

.equipment-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-sm);
}

.equipment-slot {
    background: var(--color-surface);
    padding: var(--spacing-sm);
    border-radius: var(--border-radius-sm);
    text-align: center;
    min-height: 100px;
    border: 2px solid #0f3460;
}

.materials-display {
    background: var(--color-surface);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-md);
    margin-bottom: var(--spacing-lg);
    display: flex;
    gap: var(--spacing-lg);
    justify-content: center;
    flex-wrap: wrap;
}

.shop-info {
    margin-top: var(--spacing-lg);
    text-align: center;
}
```

#### 6.6 Создаем `css/animations.css`

```css
/* css/animations.css */
/* Анимации */

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@keyframes glow {
    0%, 100% { box-shadow: 0 0 5px var(--color-primary); }
    50% { box-shadow: 0 0 20px var(--color-primary); }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideIn {
    from { transform: translateY(50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

.bounce {
    animation: bounce 1s ease-in-out infinite;
}

.spin {
    animation: spin 2s linear infinite;
}

.glow {
    animation: glow 2s ease-in-out infinite;
}

.fade-in {
    animation: fadeIn 0.5s ease-out;
}

.slide-in {
    animation: slideIn 0.5s ease-out;
}

.shake {
    animation: shake 0.3s ease-in-out;
}
```

#### 6.7 Обновляем `style.css` - теперь только импорты

```css
/* style.css */
/* Главный файл стилей - только импорты */

@import url('css/base.css');
@import url('css/layout.css');
@import url('css/components.css');
@import url('css/arena.css');
@import url('css/modals.css');
@import url('css/animations.css');

/* Специфичные для арены стили, которые переопределяют базовые */
.screen#screenArena .arena-header {
    display: flex !important;
}
```

---

### Шаг 7: Обновляем index.html

```html
<!-- В HEAD добавляем link к style.css -->
<link rel="stylesheet" href="style.css">

<!-- В конце body обновляем порядок скриптов -->
<!-- Конфигурации -->
<script src="js/config/heroClasses.js"></script>
<script src="js/config/enemyTypes.js"></script>
<script src="js/config/weapons.js"></script>
<script src="js/config/skills.js"></script>
<script src="js/config/locations.js"></script>
<script src="js/config/waveConfig.js"></script>
<script src="js/config/chestLoot.js"></script>

<!-- Core классы -->
<script src="js/core/GameState.js"></script>
<script src="js/core/Item.js"></script>
<script src="js/core/Hero.js"></script>
<script src="js/core/Shop.js"></script>
<script src="js/core/Recipe.js"></script>
<script src="js/core/Skill.js"></script>

<!-- Шаблоны UI -->
<script src="js/ui/templates/heroCard.js"></script>
<script src="js/ui/templates/skillChoice.js"></script>
<script src="js/ui/templates/inventory.js"></script>
<script src="js/ui/templates/shopItem.js"></script>
<script src="js/ui/templates/craftItem.js"></script>
<script src="js/ui/templates/notification.js"></script>

<!-- Классы арены -->
<script src="js/arena/GameEntity.js"></script>
<script src="js/arena/Chest.js"></script>
<script src="js/arena/WaveManager.js"></script>
<script src="js/arena/SpriteManager.js"></script>
<script src="js/arena/SurvivorsArena.js"></script>
<script src="js/arena/ArenaController.js"></script>

<!-- UI -->
<script src="js/ui/UIManager.js"></script>
<script src="js/game.js"></script>
```

---

## ✅ Тестирование после рефакторинга

### Проверка экономики
- [ ] Предметы покупаются в магазине и попадают в рюкзак
- [ ] Материалы покупаются и попадают на склад
- [ ] В инвентаре героя видны рюкзак и склад отдельно
- [ ] При крафте материалы списываются со склада
- [ ] При экипировке предмет из рюкзака исчезает

### Проверка навыков
- [ ] При повышении уровня характеристики растут
- [ ] При изучении навыка характеристики увеличиваются
- [ ] Активные навыки можно использовать
- [ ] Эффекты навыков работают в бою

### Проверка врагов
- [ ] На первых волнах только гоблины и скелеты
- [ ] На 3 волне появляются лучники
- [ ] На 5 волне появляются маги
- [ ] Лучники атакуют с расстояния
- [ ] Маги замедляют при попадании

### Проверка сундуков
- [ ] Сундуки спавнятся на карте
- [ ] При подходе начинается прогресс открытия
- [ ] Если отойти - прогресс сбрасывается
- [ ] При открытии выпадает добыча
- [ ] Добыча зависит от волны

---

## 🎯 Самостоятельные задания

### Уровень 1 (Легкий)
1. **Добавить новый ресурс** - создайте "Камни" для крафта
2. **Добавить нового врага** - создайте "Варвара" с высокой атакой
3. **Изменить дроп из сундуков** - настройте веса в chestLoot.js

### Уровень 2 (Средний)
4. **Система улучшения сундуков** - чем дальше волна, тем лучше дроп
5. **Элитные враги с аурами** - враги, которые усиливают других
6. **Комбо-навыки** - если взять два определенных навыка, открывается третий

### Уровень 3 (Сложный)
7. **События на волнах** - случайные события (дождь, туман, усиление врагов)
8. **Магазин на арене** - торговец, который появляется между волнами
9. **Система достижений** - награды за убийство определенного количества врагов

### Уровень 4 (Экспертный)
10. **Режим "Бесконечность"** - бесконечные волны с растущей сложностью
11. **Генератор подземелий** - процедурная генерация карты
12. **Мультиплеер** - два героя на одной арене

---

## 🏁 Заключение

Поздравляю! Вы успешно обновили игру до версии 8. Теперь у вас:

- ✅ **Разделенная экономика** - рюкзак для предметов, склад для материалов
- ✅ **Рабочие навыки** - действительно влияют на характеристики
- ✅ **Новые враги** - лучники и маги с уникальным поведением
- ✅ **Сундуки с добычей** - интерактивные объекты на карте
- ✅ **Волны** - постепенное усложнение игры
- ✅ **Модульные стили** - CSS разбит на логические части

> [!TIP]
> Такая архитектура позволяет легко добавлять новый контент: просто правим конфиги!
