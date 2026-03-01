
---

[![Итерация 7 - Готова](https://img.shields.io/badge/Итерация_7-Рефакторинг_и_структурирование-4a4aff?style=for-the-badge)](##-итерация-1-скелет-и-навигация)

> [!NOTE]
> Обновлено 02.03.2026

<br>

> [!IMPORTANT]
> Внимательно читаем инструкцию и определяем участки для изменения, лучше всего комментировать эти места.

<br>

> [!WARNING]
> Выполнить нужно одно или более самостоятельных задания. Не выполненые самостоятельные задания, которые находятся в конце документа - это снижение бала за домашнее задание и возможное снижение итогового бала за зачет.

---

# 🎮 Arena Survivors — Версия 7: Рефакторинг и структурирование кода

> **Пошаговое руководство по рефакторингу проекта**  
> *В этой версии мы проведем масштабный рефакторинг: разделим ответственность между классами, вынесем все шаблоны в отдельные файлы и создадим систему конфигураций*

---

## ✨ Что нового в версии 7

### 📁 Новая структура проекта
Раньше весь код был перемешан в нескольких больших файлах. Теперь мы разделяем проект на логические модули:

**Основные изменения:**
- **Конфигурации** — все настройки (статы героев, типы врагов, оружие, навыки) вынесены в отдельные файлы
- **Шаблоны HTML** — вся верстка для UI вынесена в отдельные файлы-шаблоны
- **Чистый код** — методы стали короче и понятнее

### 🎯 Что дает такая структура?

| Было | Стало |
|------|-------|
| ❌ Всё в одном файле UIManager.js | ✅ Шаблоны в отдельных файлах |
| ❌ Статы героев в коде | ✅ Конфигурация в heroClasses.js |
| ❌ Типы врагов в коде | ✅ Конфигурация в enemyTypes.js |
| ❌ Сложно менять баланс | ✅ Меняем в одном месте |

---

## 📁 Новая структура папок

Создайте в папке `js` новые папки и файлы:

```
js/
├── core/                    # Ядро игры (было)
│   ├── GameState.js
│   ├── Hero.js
│   ├── Item.js
│   ├── Shop.js
│   ├── Recipe.js
│   └── Skill.js
│
├── arena/                   # Логика арены (было)
│   ├── SurvivorsArena.js
│   ├── GameEntity.js
│   ├── SpriteManager.js
│   └── ArenaController.js
│
├── ui/                      # Пользовательский интерфейс
│   ├── UIManager.js         # Будет обновлен
│   └── templates/           # НОВАЯ ПАПКА - шаблоны HTML
│       ├── heroCard.js      # Шаблон карточки героя
│       ├── skillChoice.js   # Шаблон выбора навыка
│       ├── inventory.js     # Шаблон инвентаря
│       ├── shopItem.js      # Шаблон предмета магазина
│       ├── craftItem.js     # Шаблон рецепта крафта
│       └── notification.js  # Шаблон уведомления
│
├── config/                  # НОВАЯ ПАПКА - конфигурации
│   ├── heroClasses.js       # Конфигурация классов героев
│   ├── enemyTypes.js        # Конфигурация типов врагов
│   ├── weapons.js           # Конфигурация оружия
│   ├── skills.js            # Конфигурация навыков
│   ├── shopItems.js         # Конфигурация предметов магазина
│   ├── craftRecipes.js      # Конфигурация рецептов крафта
│   └── locations.js         # Конфигурация локаций
│
└── game.js                  # Точка входа (было)
```

---

## 🔧 Какие файлы нужно изменить/создать

| Файл | Что нужно сделать |
|------|-------------------|
| `js/config/heroClasses.js` | **Создать новый файл** - конфигурация классов героев |
| `js/config/enemyTypes.js` | **Создать новый файл** - конфигурация типов врагов |
| `js/config/weapons.js` | **Создать новый файл** - конфигурация оружия |
| `js/config/skills.js` | **Создать новый файл** - конфигурация навыков |
| `js/config/locations.js` | **Создать новый файл** - конфигурация локаций |
| `js/ui/templates/heroCard.js` | **Создать новый файл** - шаблон карточки героя |
| `js/ui/templates/skillChoice.js` | **Создать новый файл** - шаблон выбора навыка |
| `js/ui/templates/inventory.js` | **Создать новый файл** - шаблон инвентаря |
| `js/ui/templates/shopItem.js` | **Создать новый файл** - шаблон предмета магазина |
| `js/ui/templates/craftItem.js` | **Создать новый файл** - шаблон рецепта крафта |
| `js/ui/templates/notification.js` | **Создать новый файл** - шаблон уведомления |
| `js/core/Hero.js` | **Обновить** - использовать конфигурацию |
| `js/core/Skill.js` | **Обновить** - использовать конфигурацию |
| `js/arena/GameEntity.js` | **Обновить** класс ArenaEnemy с конфигурацией |
| `js/ui/UIManager.js` | **Полностью заменить** - использовать шаблоны |
| `index.html` | **Обновить** порядок подключения скриптов |

---

## 📝 Пошаговая инструкция

### Шаг 1: Создаем папки config и templates

1. В папке `js` создайте папку `config`
2. В папке `js` создайте папку `ui/templates` (папку templates внутри ui)

---

### Шаг 2: Создаем конфигурационные файлы

#### 2.1 Создаем `js/config/heroClasses.js`

Этот файл содержит все настройки классов героев. Теперь, чтобы изменить статы воина, мы правим только этот файл!

```javascript
// js/config/heroClasses.js
// Конфигурация классов героев

const HeroClassConfig = {
    warrior: {
        name: 'Воин',
        baseStats: { hp: 120, attack: 18, defense: 12, speed: 8 },
        description: 'Мастер ближнего боя, может носить тяжелую броню',
        equipmentSlots: {
            weapon1: { type: 'weapon', required: false },
            weapon2: { type: ['weapon', 'shield'], required: false },
            armor: { type: 'armor', required: true },
            accessory: { type: 'accessory', required: false }
        },
        startingWeapon: {
            name: 'Меч',
            damage: 8,
            range: 70,
            cooldown: 1.4,
            type: 'melee',
            icon: '⚔️'
        },
        color: '#4aff4a',
        icon: '⚔️'
    },
    
    archer: {
        name: 'Лучник',
        baseStats: { hp: 80, attack: 22, defense: 6, speed: 15 },
        description: 'Мастер дальнего боя, наносит критический урон',
        equipmentSlots: {
            weapon1: { type: 'weapon', required: true },
            armor: { type: 'armor', required: true },
            accessory1: { type: 'accessory', required: false },
            accessory2: { type: 'accessory', required: false }
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
        color: '#ffaa00',
        icon: '🏹'
    },
    
    mage: {
        name: 'Маг',
        baseStats: { hp: 70, attack: 25, defense: 4, speed: 12 },
        description: 'Владеет магией, может замедлять врагов',
        equipmentSlots: {
            weapon1: { type: 'weapon', required: true },
            accessory1: { type: 'accessory', required: false },
            accessory2: { type: 'accessory', required: false },
            accessory3: { type: 'accessory', required: false }
        },
        startingWeapon: {
            name: 'Посох',
            damage: 5,
            range: 200,
            cooldown: 2.8,
            type: 'magic',
            icon: '🔮'
        },
        color: '#aa4aff',
        icon: '🔮'
    },
    
    rogue: {
        name: 'Разбойник',
        baseStats: { hp: 90, attack: 16, defense: 8, speed: 18 },
        description: 'Быстрый и смертоносный, ставит ловушки',
        equipmentSlots: {
            weapon1: { type: 'weapon', required: true },
            weapon2: { type: 'weapon', required: false },
            accessory1: { type: 'accessory', required: false },
            accessory2: { type: 'accessory', required: false }
        },
        startingWeapon: {
            name: 'Кинжалы',
            damage: 6,
            range: 50,
            cooldown: 0.75,
            type: 'melee',
            icon: '🗡️'
        },
        color: '#ff4a4a',
        icon: '🗡️'
    }
};

window.HeroClassConfig = HeroClassConfig;
```

#### 2.2 Создаем `js/config/enemyTypes.js`

Здесь хранятся все типы врагов. Хотите добавить нового врага? Просто добавьте его в этот массив!

```javascript
// js/config/enemyTypes.js
// Конфигурация типов врагов

const EnemyTypeConfig = {
    goblin: {
        name: 'Гоблин',
        baseHp: 30,
        baseAttack: 5,
        speed: 2,
        expValue: 10,
        color: '#2d5a27',
        spriteKey: 'goblin',
        variants: ['goblin', 'goblin_1', 'goblin_2'],
        bobSpeed: 9,
        attackInterval: 1.0,
        radius: 20
    },
    
    skeleton: {
        name: 'Скелет',
        baseHp: 40,
        baseAttack: 8,
        speed: 1.5,
        expValue: 15,
        color: '#aaaaaa',
        spriteKey: 'skeleton',
        variants: ['skeleton', 'skeleton_1'],
        bobSpeed: 6,
        attackInterval: 1.2,
        radius: 20
    },
    
    ghost: {
        name: 'Призрак',
        baseHp: 25,
        baseAttack: 6,
        speed: 3,
        expValue: 12,
        color: '#aa4aff',
        spriteKey: 'ghost',
        variants: ['ghost'],
        bobSpeed: 4,
        attackInterval: 0.8,
        radius: 18,
        effects: ['phase']
    },
    
    orc: {
        name: 'Орк',
        baseHp: 60,
        baseAttack: 12,
        speed: 1.2,
        expValue: 25,
        color: '#8B4513',
        spriteKey: 'orc',
        variants: ['orc'],
        bobSpeed: 5,
        attackInterval: 1.5,
        radius: 25
    },
    
    boss: {
        name: 'Босс',
        baseHp: 200,
        baseAttack: 25,
        speed: 1.0,
        expValue: 100,
        color: '#e94560',
        spriteKey: 'boss',
        variants: ['boss'],
        bobSpeed: 3,
        attackInterval: 2.0,
        radius: 35,
        isBoss: true,
        abilities: ['summon', 'rage']
    }
};

window.EnemyTypeConfig = EnemyTypeConfig;
```

#### 2.3 Создаем `js/config/weapons.js`

Конфигурация оружия. Здесь есть как базовое оружие для классов, так и игровые предметы.

```javascript
// js/config/weapons.js
// Конфигурация оружия

const WeaponConfig = {
    // Базовое оружие по классам
    baseWeapons: {
        warrior: {
            name: 'Меч',
            damage: 8,
            range: 70,
            cooldown: 1.4,
            type: 'melee',
            icon: '⚔️'
        },
        archer: {
            name: 'Лук',
            damage: 12,
            range: 300,
            cooldown: 1.7,
            type: 'ranged',
            accuracy: 0.8,
            icon: '🏹'
        },
        mage: {
            name: 'Посох',
            damage: 5,
            range: 200,
            cooldown: 2.8,
            type: 'magic',
            icon: '🔮'
        },
        rogue: {
            name: 'Кинжалы',
            damage: 6,
            range: 50,
            cooldown: 0.75,
            type: 'melee',
            icon: '🗡️'
        },
        default: {
            name: 'Кулаки',
            damage: 5,
            range: 60,
            cooldown: 1.0,
            type: 'melee',
            icon: '👊'
        }
    },
    
    // Игровое оружие (для магазина и крафта)
    weapons: [
        {
            id: 'weapon_sword_1',
            name: 'Деревянный меч',
            type: 'weapon',
            rarity: 'common',
            basePrice: 10,
            stats: { damage: 5, range: 1 },
            icon: '⚔️',
            description: 'Простой меч из дерева',
            weaponType: 'melee'
        },
        {
            id: 'weapon_sword_2',
            name: 'Железный меч',
            type: 'weapon',
            rarity: 'rare',
            basePrice: 50,
            stats: { damage: 12, range: 1 },
            icon: '⚔️',
            description: 'Тяжелый железный меч',
            weaponType: 'melee'
        }
    ]
};

window.WeaponConfig = WeaponConfig;
```

#### 2.4 Создаем `js/config/skills.js`

Все навыки для всех классов в одном месте! Теперь легко балансить игру.

```javascript
// js/config/skills.js
// Конфигурация навыков

const SkillConfig = {
    // Универсальные навыки (доступны всем)
    universal: [
        {
            id: 'skill_hp_1',
            name: 'Крепкое здоровье',
            description: 'Увеличивает максимальное здоровье на 20',
            type: 'passive',
            heroClasses: ['warrior', 'archer', 'mage', 'rogue'],
            levelRequirement: 3,
            effects: { hp: 20 },
            icon: '❤️'
        },
        {
            id: 'skill_hp_2',
            name: 'Железное здоровье',
            description: 'Увеличивает максимальное здоровье на 50',
            type: 'passive',
            heroClasses: ['warrior', 'archer', 'mage', 'rogue'],
            levelRequirement: 9,
            effects: { hp: 50 },
            icon: '💪'
        },
        {
            id: 'skill_attack_1',
            name: 'Острые клинки',
            description: 'Увеличивает атаку на 5',
            type: 'passive',
            heroClasses: ['warrior', 'archer', 'rogue'],
            levelRequirement: 3,
            effects: { attack: 5 },
            icon: '⚔️'
        }
    ],
    
    // Навыки воина
    warrior: [
        {
            id: 'skill_warrior_berserk',
            name: 'Берсерк',
            description: 'Увеличивает урон на 10%, но снижает защиту на 2',
            type: 'passive',
            heroClasses: ['warrior'],
            levelRequirement: 6,
            effects: { attack: 5, defense: -2 },
            icon: '🔥'
        },
        {
            id: 'skill_warrior_shield',
            name: 'Стена щитов',
            description: 'Увеличивает защиту на 8, шанс заблокировать атаку 15%',
            type: 'passive',
            heroClasses: ['warrior'],
            levelRequirement: 6,
            effects: { defense: 8, special: { type: 'block', chance: 0.15 } },
            icon: '🛡️'
        }
    ],
    
    // Навыки лучника
    archer: [
        {
            id: 'skill_archer_precision',
            name: 'Точность',
            description: 'Увеличивает шанс попадания на 15%',
            type: 'passive',
            heroClasses: ['archer'],
            levelRequirement: 6,
            effects: { special: { type: 'accuracy', bonus: 0.15 } },
            icon: '🎯'
        },
        {
            id: 'skill_archer_critical',
            name: 'Меткий глаз',
            description: 'Увеличивает шанс критического удара на 10%',
            type: 'passive',
            heroClasses: ['archer'],
            levelRequirement: 9,
            effects: { critChance: 0.1 },
            icon: '⭐'
        }
    ],
    
    // Навыки мага
    mage: [
        {
            id: 'skill_mage_intelligence',
            name: 'Интеллект',
            description: 'Увеличивает урон магии на 15%',
            type: 'passive',
            heroClasses: ['mage'],
            levelRequirement: 6,
            effects: { attack: 8 },
            icon: '🔮'
        },
        {
            id: 'skill_mage_frost',
            name: 'Ледяная стрела',
            description: 'Замедляет врагов при попадании на 30%',
            type: 'passive',
            heroClasses: ['mage'],
            levelRequirement: 12,
            effects: { special: { type: 'slow', percent: 0.3 } },
            icon: '❄️'
        }
    ],
    
    // Навыки разбойника
    rogue: [
        {
            id: 'skill_rogue_poison',
            name: 'Отравленные клинки',
            description: 'Отравляет врагов, нанося 5 урона в секунду в течение 3 секунд',
            type: 'passive',
            heroClasses: ['rogue'],
            levelRequirement: 6,
            effects: { special: { type: 'poison', damage: 5, duration: 3 } },
            icon: '☠️'
        }
    ]
};

window.SkillConfig = SkillConfig;
```

#### 2.5 Создаем `js/config/locations.js`

Настройки локаций: стоимость входа, типы врагов, сложность.

```javascript
// js/config/locations.js
// Конфигурация локаций

const LocationConfig = {
    forest: {
        name: 'Лес',
        description: 'Таинственный лес, полный гоблинов',
        costType: 'proviziya',
        costAmount: 1,
        enemyTypes: ['goblin', 'skeleton'],
        difficulty: 1,
        backgroundColor: '#1a4a1a',
        decorations: ['tree', 'bush', 'rock']
    },
    
    desert: {
        name: 'Пустыня',
        description: 'Жаркая пустыня, обиталище скелетов',
        costType: 'toplivo',
        costAmount: 1,
        enemyTypes: ['skeleton', 'ghost'],
        difficulty: 1.2,
        backgroundColor: '#8B7355',
        decorations: ['cactus', 'rock', 'sand']
    },
    
    factory: {
        name: 'Завод',
        description: 'Заброшенный завод, полный опасностей',
        costType: 'instrumenty',
        costAmount: 1,
        enemyTypes: ['ghost', 'orc'],
        difficulty: 1.5,
        backgroundColor: '#4a4a4a',
        decorations: ['machine', 'barrel', 'pipe']
    },
    
    dungeon: {
        name: 'Подземелье',
        description: 'Темное подземелье, где обитают боссы',
        costType: 'instrumenty',
        costAmount: 3,
        enemyTypes: ['orc', 'boss'],
        difficulty: 2.0,
        backgroundColor: '#2a2a2a',
        decorations: ['torch', 'skull', 'chest'],
        isLocked: true,
        unlockRequirement: { level: 10 }
    }
};

window.LocationConfig = LocationConfig;
```

---

### Шаг 3: Создаем шаблоны HTML

Теперь самое интересное! Мы выносим весь HTML-код из UIManager.js в отдельные файлы-шаблоны. Каждый шаблон отвечает за свою часть интерфейса.

#### 3.1 Создаем `js/ui/templates/heroCard.js`

```javascript
// js/ui/templates/heroCard.js
// Шаблон карточки героя

const HeroCardTemplate = {
    /**
     * Создает HTML карточки героя
     * @param {Object} hero - объект героя
     * @param {boolean} isSelected - выбран ли герой
     * @param {string} avatarUrl - URL аватара
     * @returns {string} HTML
     */
    render(hero, isSelected, avatarUrl) {
        const learnedSkillsHtml = hero.learnedSkills.map(skillId => {
            const skill = window.GameState.skillManager?.skills.find(s => s.id === skillId);
            return skill ? `<span title="${skill.name}" style="font-size: 1.5rem;">${skill.icon}</span>` : '';
        }).join('');

        return `
            <div class="hero-avatar" style="position: relative;">
                <img src="${avatarUrl}" 
                     alt="${hero.name}" 
                     style="width: 100px; height: 100px; border-radius: 50%; border: 3px solid #e94560; background: #16213e; object-fit: cover;"
                     onerror="this.onerror=null; this.src='images/default_hero.png';">
            </div>
            <h3>${hero.name} (Ур. ${hero.level})</h3>
            <div class="hero-stats">
                <p>❤️ HP: ${hero.currentStats.hp}</p>
                <p>⚔️ Атака: ${hero.currentStats.attack}</p>
                <p>🛡️ Защита: ${hero.currentStats.defense}</p>
            </div>
            <div class="hero-exp">
                <progress value="${hero.exp}" max="${hero.expToNextLevel}"></progress>
                <p>${hero.exp}/${hero.expToNextLevel} опыта</p>
            </div>
            <div class="hero-skills">
                <p>🎯 Уровень: ${hero.level}</p>
                <div class="learned-skills" style="display: flex; gap: 5px; margin-top: 5px; justify-content: center;">
                    ${learnedSkillsHtml}
                </div>
            </div>
            <button class="select-hero-btn" data-hero-id="${hero.id}">Выбрать для боя</button>
            <button class="inventory-hero-btn" data-hero-id="${hero.id}">Инвентарь</button>
        `;
    }
};

window.HeroCardTemplate = HeroCardTemplate;
```

#### 3.2 Создаем `js/ui/templates/skillChoice.js`

```javascript
// js/ui/templates/skillChoice.js
// Шаблон окна выбора навыка

const SkillChoiceTemplate = {
    /**
     * Создает HTML для выбора навыка
     * @param {string} heroName - имя героя
     * @param {number} level - уровень
     * @param {Array} skills - доступные навыки
     * @returns {string} HTML
     */
    render(heroName, level, skills) {
        const skillsHtml = skills.map(skill => {
            const effectsHtml = Object.entries(skill.effects).map(([key, value]) => {
                if (key === 'special') {
                    if (value.type === 'block') return `🛡️ Блок: ${Math.round(value.chance * 100)}%`;
                    if (value.type === 'doubleStrike') return `⚡ Двойной удар: ${Math.round(value.chance * 100)}%`;
                    if (value.type === 'accuracy') return `🎯 Точность: +${Math.round(value.bonus * 100)}%`;
                    if (value.type === 'armorPierce') return `🏹 Игнор брони: ${Math.round(value.percent * 100)}%`;
                    if (value.type === 'attackSpeed') return `⚡ Скорость атаки: +${Math.round(value.bonus * 100)}%`;
                    if (value.type === 'poison') return `☠️ Яд: ${value.damage} урона/${value.duration}с`;
                    if (value.type === 'slow') return `❄️ Замедление: ${Math.round(value.percent * 100)}%`;
                    return '';
                }
                if (key === 'attack') return `⚔️ Атака +${value}`;
                if (key === 'defense') return `🛡️ Защита +${value}`;
                if (key === 'hp') return `❤️ Здоровье +${value}`;
                if (key === 'speed') return `👟 Скорость +${value}`;
                if (key === 'critChance') return `⭐ Крит. шанс +${Math.round(value * 100)}%`;
                if (key === 'critDamage') return `💥 Крит. урон +${Math.round((value - 1.5) * 100)}%`;
                if (key === 'lifesteal') return `💉 Вампиризм +${Math.round(value * 100)}%`;
                return '';
            }).filter(Boolean).join('<br>');

            return `
                <div class="skill-choice-card" data-skill-id="${skill.id}" style="background: #16213e; padding: 15px; border-radius: 10px; text-align: center; cursor: pointer; border: 2px solid #0f3460; transition: all 0.3s;">
                    <div style="font-size: 3rem; margin-bottom: 10px;">${skill.icon}</div>
                    <h3 style="color: #e94560; margin: 10px 0; font-size: 1.1rem;">${skill.name}</h3>
                    <p style="font-size: 0.9rem; margin-bottom: 10px; color: #aaa;">${skill.description}</p>
                    <div style="background: #0f0f1f; padding: 8px; border-radius: 5px; font-size: 0.8rem; color: #4aff4a;">
                        ${effectsHtml}
                    </div>
                </div>
            `;
        }).join('');

        return `
            <h2 style="color: #e94560; text-align: center; margin-bottom: 20px;">Выберите навык для ${heroName} (Уровень ${level})</h2>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 20px;">
                ${skillsHtml}
            </div>
            <p style="text-align: center; margin-top: 20px; color: #888; font-size: 0.9rem;">Нажмите на навык, чтобы изучить его</p>
        `;
    }
};

window.SkillChoiceTemplate = SkillChoiceTemplate;
```

#### 3.3 Создаем `js/ui/templates/inventory.js`

```javascript
// js/ui/templates/inventory.js
// Шаблон инвентаря

const InventoryTemplate = {
    /**
     * Создает HTML инвентаря
     * @param {Object} hero - объект героя
     * @param {Array} inventory - общий инвентарь
     * @returns {string} HTML
     */
    render(hero, inventory) {
        const inventoryHtml = inventory.length > 0 
            ? inventory.map((item) => `
                <div class="inventory-item" data-item-id="${item.id}" data-instance-id="${item.instanceId || item.id}" style="background: #16213e; padding: 10px; border-radius: 5px; text-align: center; cursor: pointer; border: 1px solid #0f3460;" 
                     onmouseover="this.style.borderColor='#e94560'" onmouseout="this.style.borderColor='#0f3460'">
                    <div style="font-size: 2rem;">${item.icon || '📦'}</div>
                    <div style="font-size: 0.8rem; color: #fff;">${item.name}</div>
                    <div style="font-size: 0.7rem; color: #aaa;">${item.type}</div>
                </div>
            `).join('') 
            : '<div style="grid-column: span 4; text-align: center; color: #666;">Инвентарь пуст</div>';

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
            <div style="display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 250px;">
                    <h3 style="color: #4aff4a; margin-bottom: 10px;">Общий инвентарь</h3>
                    <div class="inventory-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; max-height: 300px; overflow-y: auto; padding: 10px; background: #0f0f1f; border-radius: 10px;">
                        ${inventoryHtml}
                    </div>
                </div>
                
                <div style="flex: 1; min-width: 250px;">
                    <h3 style="color: #4aff4a; margin-bottom: 10px;">Экипировка</h3>
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

#### 3.4 Создаем `js/ui/templates/shopItem.js`

```javascript
// js/ui/templates/shopItem.js
// Шаблон предмета магазина

const ShopItemTemplate = {
    /**
     * Создает HTML карточки товара
     * @param {Object} item - предмет
     * @returns {string} HTML
     */
    render(item) {
        let rarityColor = '#ffffff';
        if (item.rarity === 'rare') rarityColor = '#4caaff';
        if (item.rarity === 'epic') rarityColor = '#aa4cff';
        if (item.rarity === 'legendary') rarityColor = '#ffaa4c';

        return `
            <div style="font-size: 3rem;">${item.icon}</div>
            <h3 style="color: ${rarityColor};">${item.name}</h3>
            <p class="item-type">${item.type}</p>
            <p class="item-description">${item.description || 'Нет описания'}</p>
            <p class="item-price">💰 ${item.getPrice()} провизии</p>
            <p class="item-rarity" style="color: ${rarityColor};">${item.rarity}</p>
            <button class="buy-item-btn" data-item-id="${item.id}">Купить</button>
        `;
    },

    /**
     * Создает HTML информации о магазине
     * @param {number} timeLeft - время до обновления
     * @returns {string} HTML
     */
    renderShopInfo(timeLeft) {
        return `
            <div class="shop-info" style="margin-top: 20px; text-align: center;">
                <p>🔄 Ассортимент обновится через: <span id="shopTimer">${timeLeft}</span>с</p>
            </div>
        `;
    }
};

window.ShopItemTemplate = ShopItemTemplate;
```

#### 3.5 Создаем `js/ui/templates/craftItem.js`

```javascript
// js/ui/templates/craftItem.js
// Шаблон рецепта крафта

const CraftItemTemplate = {
    /**
     * Создает HTML отображения материалов
     * @param {Object} materials - доступные материалы
     * @returns {string} HTML
     */
    renderMaterials(materials) {
        return `
            <div class="materials-display" style="background: #16213e; padding: 15px; border-radius: 10px; margin-bottom: 20px; display: flex; gap: 20px; justify-content: center;">
                <div> 🌲 Древесина: <span id="materialWood">${materials.wood}</span></div>
                <div> ⛓️ Железо: <span id="materialIron">${materials.iron}</span></div>
                <div> 🌯 Ткань: <span id="materialCloth">${materials.cloth}</span></div>
            </div>
        `;
    },

    /**
     * Создает HTML карточки рецепта
     * @param {Object} recipe - рецепт
     * @param {Object} canCraft - результат проверки возможности крафта
     * @returns {string} HTML
     */
    renderRecipe(recipe, canCraft) {
        const materialsList = recipe.materials.map(m =>
            `${m.itemId === 'material_wood' ? '🌲' : m.itemId === 'material_iron' ? '⛓️' : '🌯'} ${m.quantity}`
        ).join(' + ');

        return `
            <div style="font-size: 2rem;">${recipe.resultItem.icon}</div>
            <h4>${recipe.name}</h4>
            <p>${recipe.resultItem.description || 'Нет описания'}</p>
            <p class="craft-materials">Требуется: ${materialsList}</p>
            <p class="craft-level">Требуемый уровень: ${recipe.requiredLevel}</p>
            <button class="craft-item-btn" data-recipe-id="${recipe.id}" ${!canCraft.success ? 'disabled' : ''}>
                ${canCraft.success ? 'Скрафтить' : canCraft.message}
            </button>
        `;
    }
};

window.CraftItemTemplate = CraftItemTemplate;
```

#### 3.6 Создаем `js/ui/templates/notification.js`

```javascript
// js/ui/templates/notification.js
// Шаблон уведомления

const NotificationTemplate = {
    /**
     * Создает HTML уведомления
     * @param {string} message - текст уведомления
     * @param {string} type - тип ('success' или 'error')
     * @param {number} duration - длительность в мс
     * @returns {string} HTML
     */
    render(message, type = 'success', duration = 2000) {
        return `<div style="
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#4aff4a' : '#e94560'};
            color: ${type === 'success' ? '#000' : '#fff'};
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-weight: bold;
            animation: fadeInOut ${duration}ms;
        ">${message}</div>`;
    }
};

window.NotificationTemplate = NotificationTemplate;
```

---

### Шаг 4: Обновляем класс Hero с использованием конфигурации

Теперь класс Hero будет брать настройки из конфигурационного файла:

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
        
        // Максимальное здоровье
        this.maxHp = this.baseStats.hp;
        
        // Текущие характеристики
        this.currentStats = { ...this.baseStats };
        
        // Снаряжение на основе конфигурации
        this.equipment = this.initEquipmentSlots(classConfig.equipmentSlots);
        
        // Навыки
        this.learnedSkills = [];
        this.skillPoints = 0;
        this.pendingSkillLevel = 0;
        
        // Боевые характеристики
        this.critChance = 0;
        this.critDamage = 1.5;
        this.lifesteal = 0;
        this.specialEffects = [];
        
        // Конфигурация класса
        this.classConfig = classConfig;
    }
    
    initEquipmentSlots(slotConfig) {
        const slots = {};
        for (const slotName of Object.keys(slotConfig)) {
            slots[slotName] = null;
        }
        return slots;
    }
    
    // Добавить опыт
    addExp(amount) {
        this.exp += amount;
        
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
        
        this.baseStats.hp += 10;
        this.maxHp = this.baseStats.hp;
        this.baseStats.attack += 2;
        this.baseStats.defense += 1;
        
        if (this.level % 3 === 0) {
            this.pendingSkillLevel = this.level;
            this.skillPoints = (this.skillPoints || 0) + 1;
        }
        
        this.updateCurrentStats();
    }
    
    // Проверить, нужно ли выбрать навык
    hasPendingSkill() {
        return this.pendingSkillLevel > 0;
    }
    
    // Обновить текущие статы
    updateCurrentStats() {
        this.currentStats = { ...this.baseStats };
        
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
        
        if (this.currentStats.hp > this.maxHp) {
            this.currentStats.hp = this.maxHp;
        }
    }
    
    // Экипировать предмет
    equip(item, slot) {
        const validSlots = this.getValidSlotsForItem(item);
        
        if (!validSlots.includes(slot)) return false;
        
        if (this.equipment[slot]) {
            window.GameState.addToInventory(this.equipment[slot]);
        }
        
        this.equipment[slot] = item;
        window.GameState.removeFromInventory(item.instanceId || item.id);
        this.updateCurrentStats();
        return true;
    }
    
    // Снять предмет
    unequip(slot) {
        const item = this.equipment[slot];
        if (!item) return false;
        
        window.GameState.addToInventory(item);
        this.equipment[slot] = null;
        this.updateCurrentStats();
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
    
    // Применить урон с учетом критов
    calculateDamage(baseDamage) {
        let damage = baseDamage;
        if (Math.random() < this.critChance) {
            damage *= this.critDamage;
        }
        return Math.floor(damage);
    }
    
    // Восстановление здоровья
    heal(amount) {
        this.currentStats.hp = Math.min(this.currentStats.hp + amount, this.maxHp);
    }
}

window.Hero = Hero;
```

---

### Шаг 5: Обновляем SkillManager с использованием конфигурации

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
        this.type = type;
        this.heroClasses = heroClasses;
        this.levelRequirement = levelRequirement;
        this.effects = effects;
        this.icon = icon;
        this.isUnlocked = false;
    }
    
    // Применить эффекты навыка к герою
    apply(hero) {
        if (this.effects.attack) hero.baseStats.attack += this.effects.attack;
        if (this.effects.defense) hero.baseStats.defense += this.effects.defense;
        if (this.effects.hp) {
            hero.baseStats.hp += this.effects.hp;
            hero.maxHp += this.effects.hp;
            hero.currentStats.hp += this.effects.hp;
        }
        if (this.effects.speed) hero.baseStats.speed += this.effects.speed;
        if (this.effects.critChance) hero.critChance = (hero.critChance || 0) + this.effects.critChance;
        if (this.effects.critDamage) hero.critDamage = (hero.critDamage || 1.5) + this.effects.critDamage;
        if (this.effects.lifesteal) hero.lifesteal = (hero.lifesteal || 0) + this.effects.lifesteal;
        if (this.effects.special) {
            hero.specialEffects = hero.specialEffects || [];
            hero.specialEffects.push(this.effects.special);
        }
        
        hero.updateCurrentStats();
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
                    skillData.type,
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
            !hero.learnedSkills.includes(skill.id)
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
        
        if (!hero.learnedSkills) hero.learnedSkills = [];
        if (hero.learnedSkills.includes(skillId)) return false;
        
        hero.learnedSkills.push(skillId);
        skill.apply(hero);
        
        return true;
    }
}

window.Skill = Skill;
window.SkillManager = SkillManager;
```

---

### Шаг 6: Обновляем ArenaEnemy с использованием конфигурации

В файле `js/arena/GameEntity.js` находим класс `ArenaEnemy` и обновляем его конструктор:

```javascript
// В js/arena/GameEntity.js - обновленный конструктор ArenaEnemy

class ArenaEnemy extends ArenaEntity {
    constructor(worldX, worldY, difficulty) {
        super(worldX, worldY, 20);
        
        this.difficulty = difficulty;
        
        // Получаем конфигурацию врагов
        const enemyTypes = Object.keys(window.EnemyTypeConfig);
        const typeKey = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        const config = window.EnemyTypeConfig[typeKey];
        
        this.type = typeKey;
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
        
        // Особые эффекты
        this.slowed = false;
        this.slowTimer = 0;
        this.effects = config.effects || [];
        
        this.attackCooldown = 0;
    }
    
    // ... остальные методы без изменений
}
```

---

### Шаг 7: Обновляем UIManager для использования шаблонов

Теперь самый важный шаг - полностью заменяем `js/ui/UIManager.js` на новую версию, которая использует все созданные шаблоны:

```javascript
// js/ui/UIManager.js (полностью обновленная версия)
// Менеджер пользовательского интерфейса

class UIManager {
    constructor() {
        this.screens = {
            lobby: document.getElementById('screenLobby'),
            heroes: document.getElementById('screenHeroes'),
            shop: document.getElementById('screenShop'),
            craft: document.getElementById('screenCraft'),
            arena: document.getElementById('screenArena')
        };

        this.navButtons = document.querySelectorAll('.nav-btn');
        this.resourceElements = {
            proviziya: document.querySelector('#proviziya span'),
            toplivo: document.querySelector('#toplivo span'),
            instrumenty: document.querySelector('#instrumenty span')
        };

        this.gameHeader = document.querySelector('.game-header');
        this.shopTimer = null;

        if (this.gameHeader) {
            this.gameHeader.style.display = 'flex';
            this.gameHeader.style.visibility = 'visible';
        }

        this.initEventListeners();
        this.subscribeToState();
        this.updateResourcesUI();
        this.renderHeroes();

        if (window.GameState.shop) this.renderShop();
        if (window.GameState.recipeManager) this.renderCraft();
    }

    initEventListeners() {
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const screenId = e.target.dataset.screen;
                this.showScreen(screenId);
                this.setActiveNavButton(e.target);

                if (screenId === 'heroes') this.renderHeroes();
                else if (screenId === 'shop') this.renderShop();
                else if (screenId === 'craft') this.renderCraft();
            });
        });

        const closeModal = document.querySelector('.close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                document.getElementById('heroModal').style.display = 'none';
                this.handleModalClose();
            });
        }

        window.addEventListener('click', (e) => {
            const modal = document.getElementById('heroModal');
            if (e.target === modal) {
                modal.style.display = 'none';
                this.handleModalClose();
            }
        });
    }

    handleModalClose() {
        if (window.currentArena?.hero?.heroData) {
            const hero = window.currentArena.hero.heroData;
            if (hero.pendingSkillLevel > 0) {
                hero.pendingSkillLevel = 0;
                window.currentArena.skillChoiceShown = false;
                window.currentArena.resume();
            }
        }
    }

    showScreen(screenId) {
        Object.values(this.screens).forEach(screen => screen?.classList.remove('active'));
        this.screens[screenId]?.classList.add('active');

        if (this.gameHeader) {
            this.gameHeader.style.display = screenId === 'arena' ? 'none' : 'flex';
            this.gameHeader.style.visibility = screenId === 'arena' ? 'hidden' : 'visible';
        }
    }

    setActiveNavButton(activeBtn) {
        this.navButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    subscribeToState() {
        window.GameState.subscribe(() => {
            this.updateResourcesUI();
            if (this.screens.heroes.classList.contains('active')) this.renderHeroes();
            else if (this.screens.shop.classList.contains('active')) this.renderShop();
            else if (this.screens.craft.classList.contains('active')) this.renderCraft();
        });
    }

    updateResourcesUI() {
        const r = window.GameState.resources;
        if (this.resourceElements.proviziya) this.resourceElements.proviziya.textContent = r.proviziya.toFixed(1);
        if (this.resourceElements.toplivo) this.resourceElements.toplivo.textContent = r.toplivo.toFixed(1);
        if (this.resourceElements.instrumenty) this.resourceElements.instrumenty.textContent = r.instrumenty.toFixed(1);
    }

    getHeroAvatarUrl(hero) {
        return window.spriteManager 
            ? window.spriteManager.getAvatarUrl(hero.type, hero.name)
            : `images/heroes/${hero.type}.png?t=${Date.now()}`;
    }

    renderHeroes() {
        const container = document.getElementById('heroesList');
        if (!container) return;

        container.innerHTML = '';

        window.GameState.heroes.forEach(hero => {
            const heroCard = document.createElement('div');
            heroCard.className = 'hero-card';
            if (hero.id === window.GameState.currentHeroId) {
                heroCard.style.border = '2px solid #e94560';
            }

            const avatarUrl = this.getHeroAvatarUrl(hero);
            heroCard.innerHTML = window.HeroCardTemplate.render(hero, hero.id === window.GameState.currentHeroId, avatarUrl);
            container.appendChild(heroCard);
        });

        this.addHeroEventListeners();
    }

    addHeroEventListeners() {
        document.querySelectorAll('.select-hero-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                window.GameState.selectHero(e.target.dataset.heroId);
                this.renderHeroes();
            });
        });

        document.querySelectorAll('.inventory-hero-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.showHeroInventory(e.target.dataset.heroId));
        });
    }

    renderShop() {
        const container = document.getElementById('shopItems');
        if (!container) return;

        container.innerHTML = '';

        if (!window.GameState.shop) {
            container.innerHTML = '<p>Магазин не инициализирован</p>';
            return;
        }

        const currentHero = window.GameState.getCurrentHero();
        if (!currentHero) {
            container.innerHTML = '<p>Сначала выберите героя</p>';
            return;
        }

        window.GameState.shop.dailyItems.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'shop-item';
            itemCard.innerHTML = window.ShopItemTemplate.render(item);
            container.appendChild(itemCard);
        });

        document.querySelectorAll('.buy-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.dataset.itemId;
                const currentHero = window.GameState.getCurrentHero();

                if (!currentHero) {
                    alert('Сначала выберите героя!');
                    return;
                }

                const result = window.GameState.shop.buyItem(itemId, currentHero.id);
                if (result.success) {
                    this.showNotification(result.message);
                    this.renderShop();
                } else {
                    this.showNotification(result.message, 'error');
                }
            });
        });

        const timeLeft = Math.max(0, 30 - Math.floor((Date.now() - window.GameState.shop.lastUpdate) / 1000));
        const shopInfo = document.createElement('div');
        shopInfo.innerHTML = window.ShopItemTemplate.renderShopInfo(timeLeft);
        container.appendChild(shopInfo);

        this.startShopTimer();
    }

    startShopTimer() {
        if (this.shopTimer) clearInterval(this.shopTimer);

        this.shopTimer = setInterval(() => {
            const timerElement = document.querySelector('#shopTimer');
            if (timerElement) {
                const lastUpdate = window.GameState.shop.lastUpdate;
                const timeLeft = Math.max(0, 30 - Math.floor((Date.now() - lastUpdate) / 1000));
                timerElement.textContent = timeLeft;

                if (timeLeft <= 0) this.renderShop();
            }
        }, 1000);
    }

    renderCraft() {
        const container = document.getElementById('craftRecipes');
        if (!container) return;

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

        const materials = window.GameState.getMaterials();
        const materialsDiv = document.createElement('div');
        materialsDiv.innerHTML = window.CraftItemTemplate.renderMaterials(materials);
        container.appendChild(materialsDiv);

        const title = document.createElement('h3');
        title.textContent = 'Доступные рецепты:';
        title.style.marginBottom = '15px';
        title.style.color = '#4aff4a';
        container.appendChild(title);

        const unlockedRecipes = window.GameState.recipeManager.getUnlockedRecipes();

        if (unlockedRecipes.length === 0) {
            container.innerHTML += '<p>Нет доступных рецептов</p>';
            return;
        }

        unlockedRecipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'craft-item';

            const canCraft = recipe.canCraft(currentHero, window.GameState.materials);
            recipeCard.innerHTML = window.CraftItemTemplate.renderRecipe(recipe, canCraft);
            container.appendChild(recipeCard);
        });

        document.querySelectorAll('.craft-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.disabled) return;

                const recipeId = e.target.dataset.recipeId;
                const currentHero = window.GameState.getCurrentHero();

                if (!currentHero) {
                    this.showNotification('Сначала выберите героя!', 'error');
                    return;
                }

                const result = window.GameState.craftItem(recipeId, currentHero.id);

                if (result.success) {
                    this.showNotification(result.message);
                    this.renderCraft();
                    if (result.newRecipe) {
                        setTimeout(() => this.showNotification(`🔓 Открыт новый рецепт: ${result.newRecipe.name}!`), 100);
                    }
                } else {
                    this.showNotification(result.message, 'error');
                }
            });
        });
    }

    showSkillChoice(hero, skills) {
        const modal = document.getElementById('heroModal');
        const modalBody = document.getElementById('modalBody');

        if (!modal || !modalBody) {
            if (window.currentArena) {
                window.currentArena.skillChoiceShown = false;
                window.currentArena.resume();
            }
            return;
        }

        if (!skills || skills.length === 0) {
            hero.pendingSkillLevel = 0;
            if (window.currentArena) {
                window.currentArena.skillChoiceShown = false;
                window.currentArena.resume();
            }
            return;
        }

        modalBody.innerHTML = window.SkillChoiceTemplate.render(hero.name, hero.pendingSkillLevel, skills);
        modal.style.display = 'block';

        this.setupSkillChoiceCards(hero, modal);
    }

    setupSkillChoiceCards(hero, modal) {
        const cards = document.querySelectorAll('.skill-choice-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseover', () => {
                card.style.borderColor = '#e94560';
                card.style.transform = 'scale(1.02)';
                card.style.boxShadow = '0 0 15px rgba(233,69,96,0.5)';
            });
            
            card.addEventListener('mouseout', () => {
                card.style.borderColor = '#0f3460';
                card.style.transform = 'scale(1)';
                card.style.boxShadow = 'none';
            });

            card.addEventListener('click', () => {
                const skillId = card.dataset.skillId;
                const skill = window.GameState.skillManager?.skills.find(s => s.id === skillId);

                if (skill) {
                    const success = window.GameState.skillManager.learnSkill(hero, skillId);

                    if (success) {
                        hero.pendingSkillLevel = 0;
                        modal.style.display = 'none';

                        if (window.currentArena) {
                            window.currentArena.updateSkillSlots();
                        }

                        this.showNotification(`✨ Герой изучил навык: ${skill.name}`);
                        this.renderHeroes();

                        if (window.currentArena) {
                            window.currentArena.skillChoiceShown = false;
                            window.currentArena.resume();
                        }
                    } else {
                        this.showNotification('❌ Не удалось изучить навык', 'error');
                    }
                }
            });
        });

        const closeModal = document.querySelector('.close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                hero.pendingSkillLevel = 0;
                modal.style.display = 'none';
                if (window.currentArena) {
                    window.currentArena.skillChoiceShown = false;
                    window.currentArena.resume();
                }
            });
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.innerHTML = window.NotificationTemplate.render(message, type);
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }

    showHeroInventory(heroId) {
        const hero = window.GameState.heroes.find(h => h.id === heroId);
        if (!hero) return;

        const modal = document.getElementById('heroModal');
        const modalBody = document.getElementById('modalBody');
        if (!modalBody) return;

        const inventory = window.GameState.inventory || [];

        modalBody.innerHTML = window.InventoryTemplate.render(hero, inventory);

        document.querySelectorAll('.inventory-item').forEach(el => {
            el.addEventListener('click', (e) => {
                const itemId = e.currentTarget.dataset.itemId;
                const instanceId = e.currentTarget.dataset.instanceId;
                const item = inventory.find(i => i.id === itemId && (i.instanceId === instanceId || !i.instanceId));

                if (item) this.showEquipMenu(hero, item);
            });
        });

        document.querySelectorAll('.unequip-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const heroId = e.target.dataset.heroId;
                const slot = e.target.dataset.slot;
                const hero = window.GameState.heroes.find(h => h.id === heroId);

                if (hero) {
                    hero.unequip(slot);
                    this.showHeroInventory(heroId);
                }
            });
        });

        document.getElementById('closeInventoryBtn').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.style.display = 'block';
    }

    showEquipMenu(hero, item) {
        const validSlots = hero.getValidSlotsForItem(item);
        const modal = document.getElementById('heroModal');
        const modalBody = document.getElementById('modalBody');

        if (validSlots.length === 0) {
            alert('Этот предмет нельзя экипировать данному герою');
            return;
        }

        modalBody.innerHTML = window.InventoryTemplate.renderEquipMenu(hero, item, validSlots);

        document.querySelectorAll('.equip-slot-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const slot = e.target.dataset.slot;

                if (hero.equip(item, slot)) {
                    this.showNotification('✅ Предмет экипирован!');
                    this.showHeroInventory(hero.id);
                } else {
                    this.showNotification('❌ Не удалось экипировать предмет', 'error');
                }
            });
        });

        document.getElementById('cancelEquipBtn').addEventListener('click', () => {
            this.showHeroInventory(hero.id);
        });
    }

    updateArenaUI(arena) {
        if (!arena?.hero) return;

        const hpPercent = (arena.hero.hp / arena.hero.maxHp) * 100;
        const expPercent = ((arena.hero.exp % 100) / 100) * 100;

        const hpBar = document.getElementById('arenaHpBar');
        const hpText = document.getElementById('arenaHpText');
        const expBar = document.getElementById('arenaExpBar');
        const expText = document.getElementById('arenaExpText');
        const timer = document.getElementById('arenaTimer');

        if (hpBar) hpBar.style.width = `${hpPercent}%`;
        if (hpText) hpText.textContent = `${Math.floor(arena.hero.hp)}/${arena.hero.maxHp}`;

        if (expBar) expBar.style.width = `${expPercent}%`;
        if (expText) expText.textContent = `Ур. ${arena.hero.level} (${arena.hero.exp % 100}/100)`;

        const minutes = Math.floor(arena.gameTime / 60);
        const seconds = Math.floor(arena.gameTime % 60);
        if (timer) timer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        this.updateSkillSlots(arena);
    }

    updateSkillSlots(arena) {
        const skillSlots = document.querySelectorAll('.skill-slot');
        if (!skillSlots.length || !arena.hero?.heroData) return;

        const learnedSkills = arena.hero.heroData.learnedSkills || [];

        skillSlots.forEach(slot => {
            slot.innerHTML = '';
            slot.classList.remove('active');
        });

        learnedSkills.forEach((skillId, index) => {
            if (index < skillSlots.length) {
                const skill = window.GameState.skillManager?.skills.find(s => s.id === skillId);
                if (skill) {
                    skillSlots[index].innerHTML = skill.icon;
                    skillSlots[index].classList.add('active');
                    skillSlots[index].title = skill.name;
                }
            }
        });
    }

    showBattleResults(arena) {
        const modal = document.getElementById('heroModal');
        const modalBody = document.getElementById('modalBody');

        const minutes = Math.floor(arena.gameTime / 60);
        const seconds = Math.floor(arena.gameTime % 60);
        const kills = arena.enemies?.length || 0;

        modalBody.innerHTML = `
            <h2 style="color: #e94560; text-align: center; margin-bottom: 20px;">🏆 Результаты боя</h2>
            <div style="text-align: center; margin: 30px 0;">
                <div style="font-size: 4rem; margin-bottom: 20px;">⚔️</div>
                <p style="font-size: 1.2rem; margin: 10px 0;">Время: ${minutes}:${seconds.toString().padStart(2, '0')}</p>
                <p style="font-size: 1.2rem; margin: 10px 0;">Убито врагов: ${kills}</p>
                <p style="font-size: 1.2rem; margin: 10px 0;">Достигнут уровень: ${arena.hero.level}</p>
            </div>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button id="closeResultsBtn" style="background: #4aff4a; color: #000; padding: 10px 30px; border: none; border-radius: 5px; cursor: pointer;">Закрыть</button>
            </div>
        `;

        modal.style.display = 'block';

        document.getElementById('closeResultsBtn').addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
}

window.UIManager = UIManager;
```

---

### Шаг 8: Обновляем порядок подключения скриптов в index.html

Это самый важный шаг! Порядок подключения должен быть строго таким:

```html
<!-- Конфигурации - сначала загружаем все настройки -->
<script src="js/config/heroClasses.js"></script>
<script src="js/config/enemyTypes.js"></script>
<script src="js/config/weapons.js"></script>
<script src="js/config/skills.js"></script>
<script src="js/config/locations.js"></script>

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
<script src="js/arena/SpriteManager.js"></script>
<script src="js/arena/SurvivorsArena.js"></script>
<script src="js/arena/ArenaController.js"></script>

<!-- UI -->
<script src="js/ui/UIManager.js"></script>
<script src="js/game.js"></script>
```

---

## ✅ Тестирование после рефакторинга

После внесения всех изменений, запустите игру и проверьте:

### Проверка загрузки
- [ ] При запуске появляется индикатор "Загрузка спрайтов..."
- [ ] В консоли видны сообщения о загрузке PNG-файлов
- [ ] В конце загрузки появляется уведомление "✅ Спрайты загружены!"

### Проверка героев в меню
- [ ] В меню "Герои" у каждого героя есть аватарка
- [ ] Все 4 героя отображаются с правильными статами
- [ ] Под карточкой героя есть иконки навыков

### Проверка инвентаря и экипировки
- [ ] При нажатии "Инвентарь" открывается модальное окно
- [ ] Видны предметы в общем инвентаре
- [ ] Можно экипировать предметы в слоты
- [ ] Статы героя меняются при экипировке

### Проверка магазина
- [ ] В магазине отображаются предметы
- [ ] Можно купить предмет (если есть ресурсы)
- [ ] Таймер обновления работает

### Проверка крафта
- [ ] Отображаются доступные материалы
- [ ] Видны открытые рецепты
- [ ] Можно скрафтить предмет (если есть материалы)

### Проверка арены
- [ ] Можно начать бой
- [ ] Герой виден на арене
- [ ] Враги спавнятся с правильными статами
- [ ] Навыки работают

---

## 🎯 Преимущества новой структуры

### Для разработчиков:
1. **Легко менять баланс** - все статы в одном месте
2. **Легко добавлять новое** - просто дописываем в конфиг
3. **Меньше ошибок** - код стал проще и понятнее

### Для кода:
1. **Чистые классы** - каждый отвечает за свою область
2. **Переиспользуемые шаблоны** - HTML отделен от логики
3. **Меньше дублирования** - конфигурации централизованы

### Для учеников:
1. **Понятная структура** - сразу видно где что лежит
2. **Проще вносить изменения** - не нужно копаться в больших файлах
3. **Легче отлаживать** - ошибки локализованы

---

## 🎯 Самостоятельные задания

Для закрепления материала выполните одно или несколько заданий:

### Уровень 1 (Легкий)
1. **Добавить нового героя** - создайте класс "Паладин" в конфигурации
2. **Добавить нового врага** - создайте "Зомби" в enemyTypes.js
3. **Изменить цвета** - поменяйте цветовую схему для одного из классов

### Уровень 2 (Средний)
4. **Новый тип оружия** - добавьте арбалет с уникальными характеристиками
5. **Сезонные навыки** - создайте конфигурацию для зимних навыков
6. **Динамическая сложность** - сделайте, чтобы враги становились сильнее с каждым уровнем героя

### Уровень 3 (Сложный)
7. **Новый шаблон** - создайте шаблон для отображения достижений
8. **Система модификаторов** - добавьте возможность временных баффов через конфиг
9. **Генератор врагов** - создайте функцию, которая генерирует врагов на основе конфига

### Уровень 4 (Экспертный)
10. **Визуальный редактор** - сделайте простую HTML-страницу для редактирования конфигов
11. **Валидация конфигов** - добавьте проверку, что все обязательные поля заполнены
12. **Автоматическое тестирование** - напишите скрипты для проверки баланса

---

## ❗ Решение проблем

### Проблема: "HeroClassConfig is not defined"
**Причина:** Конфигурация не загрузилась до класса Hero
**Решение:** Проверьте порядок скриптов - конфиги должны быть ПЕРЕД core классами

### Проблема: "Cannot read property 'render' of undefined"
**Причина:** Шаблон не загрузился до UIManager
**Решение:** Убедитесь, что templates загружаются ДО UIManager.js

### Проблема: Враги имеют неправильные статы
**Причина:** Неправильный множитель сложности
**Решение:** Проверьте формулу `config.baseHp * difficulty` в конструкторе ArenaEnemy

### Проблема: Не применяются эффекты навыков
**Причина:** Метод apply() в Skill.js не обновляет статы
**Решение:** Добавьте `hero.updateCurrentStats()` в конце метода apply()

---

## 🏁 Заключение

Поздравляю! Вы успешно провели рефакторинг проекта до версии 7. Теперь у вас:

- ✅ **Чистая архитектура** - каждый класс отвечает за свою область
- ✅ **Гибкие настройки** - все параметры в конфигах
- ✅ **Красивый код** - методы короткие и понятные
- ✅ **Легкая поддержка** - изменения в одном месте

> [!TIP]
> Такая структура позволит вам легко добавлять новые фичи в следующих версиях. Балансировка игры теперь занимает минуты, а не часы!

> [!IMPORTANT]
> Не забудьте сделать коммит в git после успешного тестирования!
