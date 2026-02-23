[![Итерация 6 - Готова](https://img.shields.io/badge/Итерация_6-Отладка_и_изображения-00e600?style=for-the-badge)](##-итерация-1-скелет-и-навигация)

> [!NOTE]
> Обновлено 23.02.2026

<br>

> [!IMPORTANT]
> Внимательно читаем инструкцию и определяем участки для изменения, лучше всего комментировать эти места.

<br>

> [!WARNING]
> Выполнить нужно одно или более самостоятельных задания. Не выполненые самостоятельные задания, которые находятся в конце документа - это снижение бала за домашнее задание и возможное снижение итогового бала за зачет.

---

# 🎮 Arena Survivors — Версия 6: Система навыков и улучшенная боевая механика

> **Пошаговое руководство по внедрению новых методов и изменений**  
> *В этой версии мы добавили систему навыков для героев, улучшенную боевую систему, SpriteManager для загрузки локальных изображений и специальные способности классов*

---

## ✨ Что нового в версии 6

### 🖼️ SpriteManager — загрузка локальных изображений
- **Асинхронная загрузка** спрайтов из папки `/images`
- **Поддержка множества форматов** — герои, враги, предметы
- **Вариации врагов** — случайный выбор спрайта (goblin_1, goblin_2)
- **Fallback-спрайты** — если изображение не загрузилось, создаётся заглушка
- **Аватары для UI** — метод `getAvatarUrl()` для использования в `<img>`
- **Прогресс-бар загрузки** — индикатор загрузки спрайтов

### 🔥 Система навыков
- **Skill.js** — новый класс для управления навыками героев
- **SkillManager** — менеджер, который хранит все навыки и выдаёт случайные для выбора
- **Выбор навыка каждые 3 уровня** — модальное окно с 3 случайными навыками
- **Типы навыков** — универсальные и классовые (воин, лучник, маг, разбойник)

### ⚔️ Улучшенная боевая система
- **4 класса героев** с уникальным оружием и способностями:
  - Воин — ближний бой, двойной удар, блок
  - Лучник — дальний бой, критические попадания
  - Маг — магические лучи и снаряды
  - Разбойник — ловушки, отравление, удары в спину

### 🔂 Расходники в бою
- Герой берёт в бой до 3 расходников из инвентаря
- Зелья лечения восстанавливают HP
- Зелья силы временно увеличивают атаку

### 🎨 Визуальные улучшения
- Новый UI на арене с прогресс-барами
- Отображение изученных навыков
- Анимации движения и получения урона
- Все спрайты загружаются из локальной папки `/images`

---

Отлично! Я проанализировал оба набора файлов (версии 5 и 6) и подготовил **полное интеграционное руководство**, которое позволит разработчику обновить игру с версии 5 до версии 6.

---

# 🎮 Arena Survivors — Руководство по миграции с версии 5 на версию 6

## 📋 Содержание
1. [Обзор изменений](#обзор-изменений)
2. [Структура файлов](#структура-файлов)
3. [Пошаговая инструкция](#пошаговая-инструкция)
4. [Тестирование](#тестирование)
5. [Решение проблем](#решение-проблем)

---

## 🔍 Обзор изменений

### 🆕 **Что нового в версии 6**

1. **Система спрайтов из локальных PNG-файлов**
   - Замена программно генерируемых спрайтов на реальные изображения
   - Асинхронная загрузка с индикатором прогресса
   - Поддержка вариаций врагов (goblin_1, goblin_2)

2. **Улучшенная боевая система**
   - 4 класса героев с уникальными способностями
   - Расходники в бою (зелья)
   - Улучшенные анимации

3. **Исправления багов**
   - Проблема с отображением канваса на мобильных устройствах
   - Утечки памяти в обработчиках событий
   - Стабильность системы навыков

### 📁 **Новые и изменённые файлы**

| Файл | Статус | Изменения |
|------|--------|-----------|
| `js/arena/SpriteManager.js` | **Новый** | Полностью переработан для загрузки PNG |
| `js/arena/GameEntity.js` | Изменён | Добавлена поддержка спрайтов, улучшены анимации |
| `js/arena/SurvivorsArena.js` | Изменён | Исправлена камера, добавлен MutationObserver |
| `js/ui/UIManager.js` | Изменён | Добавлены аватарки, улучшено модальное окно |
| `js/game.js` | Изменён | Асинхронная загрузка, индикатор прогресса |
| `js/core/Hero.js` | Изменён | Улучшено логирование, исправлен levelUp |
| `arena_style.css` | Изменён | Добавлены стили для мобильной версии |

---

## 📁 Структура папок для изображений

Создайте следующую структуру папок в корне проекта:

```
images/
├── heroes/
│   ├── warrior.png
│   ├── archer.png
│   ├── elementalist.png
│   └── assasin.png
├── enemies/
│   ├── peasant.png
│   ├── ronin.png
│   ├── bandit.png
│   └── raider.png
└── items/
    ├── gem_yellow.png
    └── potion_red.png
```

> **Примечание:** Если у вас нет PNG-файлов, SpriteManager автоматически создаст цветные заглушки.

---

## 🔧 Пошаговая инструкция

### Шаг 1: Создание нового файла SpriteManager.js

Создайте файл `js/arena/SpriteManager.js` и скопируйте в него следующий код:

```javascript
// js/arena/SpriteManager.js
// Менеджер спрайтов для локальных изображений

class SpriteManager {
    constructor() {
        this.sprites = new Map();
        this.loaded = false;
        this.loadingPromises = new Map();
        
        // Пути к локальным спрайтам
        this.spritePaths = {
            // Герои
            warrior: 'images/heroes/warrior.png',
            archer: 'images/heroes/archer.png',
            mage: 'images/heroes/elementalist.png',
            rogue: 'images/heroes/assasin.png',
            
            // Враги с вариациями
            goblin: 'images/enemies/peasant.png',
            goblin_1: 'images/enemies/peasant.png',
            goblin_2: 'images/enemies/peasant.png',
            skeleton: 'images/enemies/ronin.png',
            skeleton_1: 'images/enemies/ronin.png',
            ghost: 'images/enemies/bandit.png',
            orc: 'images/enemies/raider.png',
            
            // Предметы
            expGem: 'images/items/gem_yellow.png',
            potion: 'images/items/potion_red.png',
            
            // Запасной
            default_hero: 'images/default_hero.png'
        };
    }

    async loadSprites() {
        console.log('🎨 Загрузка спрайтов из локальной папки /images...');
        const loadPromises = [];

        for (const [key, path] of Object.entries(this.spritePaths)) {
            loadPromises.push(this.loadImage(key, path).catch(err => {
                console.warn(`⚠️ Не удалось загрузить ${key} из ${path}, создаю fallback`);
            }));
        }

        await Promise.allSettled(loadPromises);
        this.loaded = true;
        console.log(`✅ Загружено спрайтов: ${this.sprites.size}`);
    }

    loadImage(key, path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                // Создаем canvas с изображением
                const canvas = document.createElement('canvas');
                canvas.width = 64;
                canvas.height = 64;
                const ctx = canvas.getContext('2d');
                
                // Включаем сглаживание
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                
                // Рисуем изображение по центру с сохранением пропорций
                const size = Math.min(img.width, img.height);
                const sourceX = (img.width - size) / 2;
                const sourceY = (img.height - size) / 2;
                
                ctx.drawImage(img, sourceX, sourceY, size, size, 2, 2, 60, 60);
                
                // Добавляем легкую обводку
                ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(32, 32, 30, 0, Math.PI * 2);
                ctx.stroke();
                
                this.sprites.set(key, canvas);
                console.log(`✅ Загружен: ${key}`);
                resolve();
            };
            
            img.onerror = (err) => {
                console.error(`❌ Ошибка загрузки ${key} из ${path}:`, err);
                reject(err);
            };
            
            // Добавляем timestamp для избежания кэширования при разработке
            img.src = path + '?t=' + Date.now();
        });
    }

    getSprite(key) {
        // Для врагов с вариациями
        if (key === 'goblin' || key === 'skeleton') {
            const variants = [`${key}`, `${key}_1`, `${key}_2`].filter(v => this.sprites.has(v));
            if (variants.length > 0) {
                return this.sprites.get(variants[Math.floor(Math.random() * variants.length)]);
            }
        }
        
        return this.sprites.get(key) || this.sprites.get('default_hero') || this.createFallbackOnDemand(key);
    }

    createFallbackOnDemand(key) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#e94560';
        ctx.beginPath();
        ctx.arc(32, 32, 30, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('?', 32, 36);
        
        return canvas;
    }

    // Для аватарок в меню (HTML img)
    getAvatarUrl(type, seed = null) {
        const path = this.spritePaths[type] || this.spritePaths.default_hero || 'images/default_hero.png';
        return path + '?t=' + Date.now();
    }
}

window.SpriteManager = SpriteManager;
```

---

### Шаг 2: Обновление game.js

Замените содержимое `js/game.js` на следующий код:

```javascript
// js/game.js - точка входа

document.addEventListener('DOMContentLoaded', async () => {
    const gameHeader = document.querySelector('.game-header');
    if (gameHeader) {
        gameHeader.style.display = 'flex';
        gameHeader.style.visibility = 'visible';
    }
    
    // Показываем загрузку
    showLoadingIndicator('Загрузка спрайтов из папки images...');
    
    try {
        // Создаем менеджер спрайтов
        window.spriteManager = new SpriteManager();
        
        // Загружаем локальные спрайты
        await window.spriteManager.loadSprites();
        
        // Инициализируем игру
        initializeGame();
        
        hideLoadingIndicator();
        showNotification('✅ Спрайты загружены!', 2000);
        
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        hideLoadingIndicator();
        
        // Пробуем инициализироваться без спрайтов
        initializeGame();
        showNotification('⚠️ Используются заглушки вместо спрайтов', 3000);
    }
});

function showLoadingIndicator(text) {
    const existing = document.getElementById('loadingIndicator');
    if (existing) existing.remove();
    
    const loader = document.createElement('div');
    loader.id = 'loadingIndicator';
    loader.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #16213e;
        color: #e94560;
        padding: 20px 40px;
        border-radius: 10px;
        z-index: 9999;
        border: 2px solid #e94560;
        font-size: 18px;
        box-shadow: 0 0 30px rgba(233,69,96,0.3);
    `;
    loader.textContent = text || 'Загрузка...';
    document.body.appendChild(loader);
}

function hideLoadingIndicator() {
    const loader = document.getElementById('loadingIndicator');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }
}

function showNotification(text, duration) {
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #e94560;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 10000;
        animation: fadeInOut ${duration}ms;
    `;
    notif.textContent = text;
    document.body.appendChild(notif);
    
    setTimeout(() => notif.remove(), duration);
}

function initializeGame() {
    console.log('🎮 Инициализация игры...');
    
    // Создаем героев
    const warrior = new window.Hero('1', 'Воин', { hp: 120, attack: 18, defense: 12, speed: 8 }, 'warrior');
    const archer = new window.Hero('2', 'Лучник', { hp: 80, attack: 22, defense: 6, speed: 15 }, 'archer');
    const mage = new window.Hero('3', 'Маг', { hp: 70, attack: 25, defense: 4, speed: 12 }, 'mage');
    const rogue = new window.Hero('4', 'Разбойник', { hp: 90, attack: 16, defense: 8, speed: 18 }, 'rogue');
    
    // Добавляем в состояние
    window.GameState.heroes.push(warrior, archer, mage, rogue);
    window.GameState.selectHero('1');
    
    // Добавляем тестовые предметы
    window.GameState.addToInventory(new window.Weapon('weapon_sword_1', 'Деревянный меч', 'common', 10, { damage: 5, range: 1 }, '⚔️'));
    window.GameState.addToInventory(new window.Weapon('weapon_bow_1', 'Короткий лук', 'common', 15, { damage: 7, range: 3 }, '🏹'));
    window.GameState.addToInventory(new window.Armor('armor_cloth_1', 'Тканевая броня', 'common', 8, { defense: 3, hp: 5 }, '👕'));
    
    // Инициализируем системы
    window.GameState.initShop();
    window.GameState.initRecipes();
    window.GameState.initSkills();
    
    // Запускаем UI
    window.ui = new window.UIManager();
    
    // Создаем контроллер арены
    window.arenaController = new window.ArenaController();
    
    console.log('✅ Игра готова!');
}

// Обработчики кнопок локаций
document.querySelectorAll('.start-match-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const location = e.target.closest('.location-card').dataset.location;
        const costType = e.target.dataset.costType;
        
        const hero = window.GameState.getCurrentHero();
        
        if (!hero) {
            showNotification('❌ Сначала выберите героя!', 2000);
            return;
        }
        
        if (window.GameState.resources[costType] < 1) {
            showNotification(`❌ Не хватает ${costType}!`, 2000);
            return;
        }
        
        window.GameState.updateResource(costType, -1);
        
        const started = window.arenaController.startExpedition(location, hero);
        
        if (!started) {
            window.GameState.updateResource(costType, 1);
        }
    });
});

// Добавляем анимацию для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -20px); }
        10% { opacity: 1; transform: translate(-50%, 0); }
        90% { opacity: 1; transform: translate(-50%, 0); }
        100% { opacity: 0; transform: translate(-50%, -20px); }
    }
`;
document.head.appendChild(style);
```

---

### Шаг 3: Обновление UIManager.js

Найдите в файле `js/ui/UIManager.js` и добавьте/измените следующие методы:

#### 3.1 Добавьте метод `getHeroAvatarUrl()` после метода `updateResourcesUI()`:

```javascript
// Вставьте этот код после метода updateResourcesUI()
// примерно в районе строки 100

getHeroAvatarUrl(hero) {
    if (window.spriteManager) {
        return window.spriteManager.getAvatarUrl(hero.type, hero.name);
    }
    // Запасной вариант
    return `images/heroes/${hero.type}.png?t=${Date.now()}`;
}
```

#### 3.2 Замените метод `renderHeroes()` полностью:

Найдите метод `renderHeroes()` (примерно строка 120) и замените его на:

```javascript
// Отрисовка списка героев
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

        // Получаем URL аватара
        const avatarUrl = this.getHeroAvatarUrl(hero);

        heroCard.innerHTML = `
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
                    ${hero.learnedSkills.map(skillId => {
                        const skill = window.GameState.skillManager?.skills.find(s => s.id === skillId);
                        return skill ? `<span title="${skill.name}" style="font-size: 1.5rem;">${skill.icon}</span>` : '';
                    }).join('')}
                </div>
            </div>
            <button class="select-hero-btn" data-hero-id="${hero.id}">Выбрать для боя</button>
            <button class="inventory-hero-btn" data-hero-id="${hero.id}">Инвентарь</button>
        `;

        container.appendChild(heroCard);
    });

    // Добавляем обработчики после создания всех карточек
    this.addHeroEventListeners();
}

// Добавьте где-нибудь после renderHeroes()
addHeroEventListeners() {
    document.querySelectorAll('.select-hero-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const heroId = e.target.dataset.heroId;
            window.GameState.selectHero(heroId);
            this.renderHeroes();
        });
    });

    document.querySelectorAll('.inventory-hero-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const heroId = e.target.dataset.heroId;
            this.showHeroInventory(heroId);
        });
    });
}
```

#### 3.3 Замените метод `showSkillChoice()` полностью:

Найдите метод `showSkillChoice()` (примерно строка 350) и замените его на:

```javascript
// Показать окно выбора навыка
showSkillChoice(hero, skills) {
    console.log('showSkillChoice вызван с навыками:', skills);
    const modal = document.getElementById('heroModal');
    const modalBody = document.getElementById('modalBody');

    if (!modal || !modalBody) {
        console.error('Модальное окно не найдено!');
        if (window.currentArena) {
            window.currentArena.skillChoiceShown = false;
            window.currentArena.resume();
        }
        return;
    }

    if (!skills || skills.length === 0) {
        console.log('Нет доступных навыков, продолжаем игру');
        hero.pendingSkillLevel = 0;
        if (window.currentArena) {
            window.currentArena.skillChoiceShown = false;
            window.currentArena.resume();
        }
        return;
    }

    modalBody.innerHTML = `
        <h2 style="color: #e94560; text-align: center; margin-bottom: 20px;">Выберите навык для ${hero.name} (Уровень ${hero.pendingSkillLevel})</h2>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 20px;">
            ${skills.map(skill => `
                <div class="skill-choice-card" data-skill-id="${skill.id}" style="background: #16213e; padding: 15px; border-radius: 10px; text-align: center; cursor: pointer; border: 2px solid #0f3460; transition: all 0.3s;">
                    <div style="font-size: 3rem; margin-bottom: 10px;">${skill.icon}</div>
                    <h3 style="color: #e94560; margin: 10px 0; font-size: 1.1rem;">${skill.name}</h3>
                    <p style="font-size: 0.9rem; margin-bottom: 10px; color: #aaa;">${skill.description}</p>
                    <div style="background: #0f0f1f; padding: 8px; border-radius: 5px; font-size: 0.8rem; color: #4aff4a;">
                        ${Object.entries(skill.effects).map(([key, value]) => {
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
                        }).filter(Boolean).join('<br>')}
                    </div>
                </div>
            `).join('')}
        </div>
        <p style="text-align: center; margin-top: 20px; color: #888; font-size: 0.9rem;">Нажмите на навык, чтобы изучить его</p>
    `;

    modal.style.display = 'block';
    console.log('Модальное окно отображено');

    // Добавляем обработчики для карточек навыков
    this.setupSkillChoiceCards(hero, modal);
}
```

#### 3.4 Добавьте метод `setupSkillChoiceCards()` после `showSkillChoice()`:

```javascript
// Добавьте этот метод после showSkillChoice()

setupSkillChoiceCards(hero, modal) {
    const cards = document.querySelectorAll('.skill-choice-card');
    
    cards.forEach(card => {
        // Добавляем hover эффекты
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

        // Обработчик клика
        card.addEventListener('click', () => {
            const skillId = card.dataset.skillId;
            const skill = window.GameState.skillManager?.skills.find(s => s.id === skillId);

            if (skill) {
                console.log('Выбран навык:', skill.name);

                // Изучаем навык
                const success = window.GameState.skillManager.learnSkill(hero, skillId);

                if (success) {
                    hero.pendingSkillLevel = 0;
                    modal.style.display = 'none';

                    // Обновляем слоты навыков на арене
                    if (window.currentArena) {
                        window.currentArena.updateSkillSlots();
                    }

                    this.showNotification(`✨ Герой изучил навык: ${skill.name}`);
                    this.renderHeroes(); // Обновляем отображение героев

                    // Возобновляем игру
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

    // Обновляем обработчик закрытия
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            console.log('Модальное окно закрыто без выбора');
            hero.pendingSkillLevel = 0;
            modal.style.display = 'none';
            if (window.currentArena) {
                window.currentArena.skillChoiceShown = false;
                window.currentArena.resume();
            }
        });
    }
}
```

#### 3.5 Добавьте метод `showNotification()` после `setupSkillChoiceCards()`:

```javascript
// Добавьте этот метод после setupSkillChoiceCards()

showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
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
        animation: fadeInOut 2000ms;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 2000);
}
```

#### 3.6 Улучшите обработчик закрытия модального окна в `initEventListeners()`:

Найдите в методе `initEventListeners()` обработчик `close-modal` (примерно строка 30) и замените его на:

```javascript
const closeModal = document.querySelector('.close-modal');
if (closeModal) {
    closeModal.addEventListener('click', () => {
        document.getElementById('heroModal').style.display = 'none';

        // Если мы на арене и есть ожидающий навык, сбрасываем его
        if (window.currentArena && window.currentArena.hero && window.currentArena.hero.heroData) {
            const hero = window.currentArena.hero.heroData;
            if (hero.pendingSkillLevel > 0) {
                hero.pendingSkillLevel = 0;
                window.currentArena.skillChoiceShown = false;
                window.currentArena.resume();
            }
        }
    });
}
```

---

### Шаг 4: Обновление SurvivorsArena.js

Найдите файл `js/arena/SurvivorsArena.js` и внесите следующие изменения:

#### 4.1 Добавьте новые методы в конструктор:

В конструкторе класса `SurvivorsArena` добавьте новые инициализации после строки `window.currentArena = this;`:

```javascript
// Генерация декораций
this.generateDecorations();

// Инициализация управления
this.initControls();

// Обработчик ресайза
this.initResizeHandler();

// Обработчик изменения ориентации
this.initOrientationHandler();

// Добавляем наблюдатель за изменениями DOM
this.initMutationObserver();
```

#### 4.2 Добавьте метод `initOrientationHandler()`:

После метода `initResizeHandler()` добавьте:

```javascript
initOrientationHandler() {
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            if (this.isRunning) {
                this.resizeCanvas();
            }
        }, 200);
    });
}
```

#### 4.3 Добавьте метод `initMutationObserver()`:

После `initOrientationHandler()` добавьте:

```javascript
initMutationObserver() {
    // Наблюдаем за изменениями в DOM, чтобы поймать момент когда канвас становится видимым
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const screenArena = document.getElementById('screenArena');
                if (screenArena && screenArena.classList.contains('active') && this.isRunning) {
                    // Когда экран арены становится активным, пересчитываем размеры
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
```

#### 4.4 Добавьте метод `updateSkillSlots()`:

После метода `updateUI()` добавьте:

```javascript
updateSkillSlots() {
    const skillSlots = document.querySelectorAll('.skill-slot');
    if (!skillSlots.length || !this.hero || !this.hero.heroData) return;

    const learnedSkills = this.hero.heroData.learnedSkills || [];

    // Сначала очищаем все слоты и убираем класс active
    skillSlots.forEach(slot => {
        slot.innerHTML = '';
        slot.classList.remove('active');
    });

    // Если нет навыков, оставляем слоты пустыми
    if (learnedSkills.length === 0) {
        return;
    }

    // Заполняем только изученными навыками
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
```

#### 4.5 Вызовите `updateSkillSlots()` в методе `updateUI()`:

В методе `updateUI()` после обновления таймера добавьте вызов:

```javascript
// Обновляем слоты навыков
this.updateSkillSlots();
```

#### 4.6 Улучшите метод `checkSkillChoice()`:

Найдите метод `checkSkillChoice()` и замените его на:

```javascript
checkSkillChoice() {
    if (!this.hero || !this.hero.heroData || this.skillChoiceShown) {
        return;
    }
    
    // Проверяем pendingSkillLevel
    const hasPending = this.hero.heroData.pendingSkillLevel > 0;
    
    if (hasPending) {
        console.log(`%c🆕 ОБНАРУЖЕН НАВЫК! Уровень: ${this.hero.heroData.pendingSkillLevel}`, 'color: #4aff4a; font-size: 14px; font-weight: bold');
        
        // Ставим флаг ДО паузы
        this.skillChoiceShown = true;
        this.pause();
        
        // Получаем доступные навыки
        const skills = window.GameState.skillManager.getRandomSkillsForHero(
            this.hero.heroData, 
            this.hero.heroData.pendingSkillLevel
        );
        
        console.log('Доступные навыки:', skills.map(s => s.name));
        
        // Показываем модальное окно с выбором
        setTimeout(() => {
            if (window.ui) {
                console.log('Показываем окно выбора навыка');
                window.ui.showSkillChoice(this.hero.heroData, skills);
            } else {
                console.error('❌ UI не найден!');
                // Сбрасываем флаги если UI не найден
                this.skillChoiceShown = false;
                this.hero.heroData.pendingSkillLevel = 0;
                this.resume();
            }
        }, 500);
    }
}
```

---

### Шаг 5: Обновление GameEntity.js

Найдите файл `js/arena/GameEntity.js` и внесите следующие изменения:

#### 5.1 Обновите класс `ArenaEntity`:

Замените весь класс `ArenaEntity` на:

```javascript
class ArenaEntity {
    constructor(worldX, worldY, radius, color = '#ffffff') {
        this.worldX = worldX;
        this.worldY = worldY;
        this.radius = radius || 20;
        this.vx = 0;
        this.vy = 0;
        this.speed = 0;
        this.color = color;
        this.isActive = true;
        
        // Для анимации
        this.animationTimer = 0;
        this.animationFrame = 0;
        this.hitEffect = 0;
        this.bobOffset = 0;
        this.bobSpeed = 8;
        
        // Спрайт менеджер
        this.spriteManager = window.spriteManager;
    }
    
    getScreenX(cameraX) {
        return this.worldX - cameraX;
    }
    
    getScreenY(cameraY) {
        return this.worldY - cameraY;
    }
    
    update(deltaTime, worldWidth, worldHeight) {
        // Двигаем
        this.worldX += this.vx * this.speed * deltaTime * 60;
        this.worldY += this.vy * this.speed * deltaTime * 60;
        
        // Границы мира
        this.worldX = Math.max(this.radius, Math.min(worldWidth - this.radius, this.worldX));
        this.worldY = Math.max(this.radius, Math.min(worldHeight - this.radius, this.worldY));
        
        // Анимация - если движется, то подпрыгивает
        if (this.vx !== 0 || this.vy !== 0) {
            this.animationTimer += deltaTime * this.bobSpeed;
            this.bobOffset = Math.sin(this.animationTimer) * 3;
        } else {
            this.bobOffset = 0;
        }
        
        // Эффект получения урона
        if (this.hitEffect > 0) {
            this.hitEffect -= deltaTime;
        }
    }
    
    draw(ctx, cameraX, cameraY) {
        // Будет переопределено в наследниках
    }
}
```

#### 5.2 Обновите класс `ArenaHero`:

В конструкторе `ArenaHero` добавьте/обновите следующие строки:

```javascript
constructor(worldX, worldY, heroData) {
    super(worldX, worldY, 24, '#4aff4a');
    
    this.heroData = heroData;
    this.hp = heroData.currentStats.hp;
    this.maxHp = heroData.maxHp || heroData.currentStats.hp;
    this.level = heroData.level;
    this.exp = heroData.exp;
    this.speed = heroData.currentStats.speed || 5;
    
    this.attack = heroData.currentStats.attack || 10;
    this.defense = heroData.currentStats.defense || 5;
    
    this.expMagnet = 100;
    this.weapons = [];
    this.skillEffects = [];
    
    // Тип героя
    this.heroType = heroData.type;
    
    // Ключ спрайта для героя
    this.spriteKey = this.heroType;

    // Оружие
    this.weapons = [];
    this.loadWeapons();

    // Сбор опыта
    this.expMagnet = 150;
    this.level = heroData.level;
    this.exp = heroData.exp;

    // Для анимации
    this.animationFrame = 0;
    this.lastAttackTime = 0;
    this.bobSpeed = 10;

    // Специальные способности
    this.traps = [];
    this.trapCooldown = 0;
    this.trapInterval = 5;

    // Для мага
    this.magicBeam = null;
    this.magicCooldown = 0;
    this.magicInterval = 8;

    // Расходники в бою
    this.battleConsumables = [];
    this.loadConsumables();

    // Убеждаемся что у heroData есть массив для навыков
    if (!this.heroData.learnedSkills) {
        this.heroData.learnedSkills = [];
    }
}
```

#### 5.3 Обновите метод `draw()` в `ArenaHero`:

Замените метод `draw()` на:

```javascript
draw(ctx, cameraX, cameraY) {
    const screenX = this.getScreenX(cameraX);
    const screenY = this.getScreenY(cameraY) + this.bobOffset;
    
    if (screenX + this.radius < 0 || screenX - this.radius > ctx.canvas.width ||
        screenY + this.radius < 0 || screenY - this.radius > ctx.canvas.height) {
        return;
    }
    
    ctx.save();
    
    // Эффект получения урона
    if (this.hitEffect > 0) {
        ctx.globalAlpha = 0.7;
        ctx.filter = 'brightness(1.5)';
    }
    
    // Получаем спрайт героя
    let sprite = this.spriteManager ? this.spriteManager.getSprite(this.spriteKey) : null;
    
    if (sprite) {
        // Небольшой наклон при движении
        if (this.vx !== 0 || this.vy !== 0) {
            ctx.translate(screenX, screenY);
            ctx.rotate(Math.sin(this.animationTimer * 2) * 0.03);
            ctx.translate(-screenX, -screenY);
        }
        
        ctx.drawImage(sprite, screenX - 24, screenY - 24, 48, 48);
    } else {
        // Fallback - цветной круг
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Иконка класса
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        let icon = '⚔️';
        if (this.heroType === 'archer') icon = '🏹';
        if (this.heroType === 'mage') icon = '🔮';
        if (this.heroType === 'rogue') icon = '🗡️';
        
        ctx.fillText(icon, screenX, screenY);
    }
    
    ctx.restore();
    
    // Полоска здоровья
    const hpPercent = this.hp / this.maxHp;
    const barWidth = 40;
    const barHeight = 4;
    
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(screenX - barWidth/2, screenY - this.radius - 8, barWidth, barHeight);
    
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(screenX - barWidth/2, screenY - this.radius - 8, barWidth * hpPercent, barHeight);
    
    // Уровень
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(`Lv.${this.level}`, screenX - 15, screenY - this.radius - 12);
    
    // Имя героя
    ctx.font = '10px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(this.heroData.name, screenX, screenY - 35);
    
    // Рисуем расходники
    if (this.battleConsumables.length > 0) {
        ctx.font = '10px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'left';
        for (let i = 0; i < this.battleConsumables.length; i++) {
            const item = this.battleConsumables[i];
            if (item) {
                ctx.fillText(item.icon, screenX - 30 + i * 20, screenY - 45);
            }
        }
    }
    
    // Рисуем оружие
    this.weapons.forEach(w => w.draw(ctx, cameraX, cameraY));
    
    // Рисуем ловушки для разбойника
    if (this.heroType === 'rogue') {
        this.traps.forEach(trap => trap.draw(ctx, cameraX, cameraY));
    }
    
    // Рисуем магию для мага
    if (this.heroType === 'mage' && this.magicBeam) {
        this.magicBeam.draw(ctx, cameraX, cameraY);
    }
}
```

#### 5.4 Обновите класс `ArenaEnemy`:

В методе `update()` класса `ArenaEnemy` добавьте обработку замедления:

```javascript
// Добавьте в начало метода update():
if (this.slowed) {
    this.slowTimer -= deltaTime;
    if (this.slowTimer <= 0) {
        this.slowed = false;
        this.speed *= 2;
        this.bobSpeed *= 2;
    }
}
```

#### 5.5 Обновите метод `draw()` в `ArenaEnemy`:

Замените метод `draw()` на:

```javascript
draw(ctx, cameraX, cameraY) {
    const screenX = this.getScreenX(cameraX);
    const screenY = this.getScreenY(cameraY) + this.bobOffset;
    
    if (screenX + this.radius < 0 || screenX - this.radius > ctx.canvas.width ||
        screenY + this.radius < 0 || screenY - this.radius > ctx.canvas.height) {
        return;
    }
    
    ctx.save();
    
    // Эффект получения урона
    if (this.hitEffect > 0) {
        ctx.globalAlpha = 0.8;
        ctx.filter = 'brightness(1.8) sepia(1)';
    }
    
    // Получаем спрайт врага
    let sprite = this.spriteManager ? this.spriteManager.getSprite(this.spriteKey) : null;
    
    if (sprite) {
        // Небольшой наклон при движении
        if (this.vx !== 0 || this.vy !== 0) {
            ctx.translate(screenX, screenY);
            ctx.rotate(Math.sin(this.animationTimer * 2) * 0.03);
            ctx.translate(-screenX, -screenY);
        }
        
        ctx.drawImage(sprite, screenX - 20, screenY - 20, 40, 40);
    } else {
        // Fallback - цветной круг
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
    
    // Полоска здоровья
    const hpPercent = this.hp / this.maxHp;
    const barWidth = 30;
    const barHeight = 3;
    
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(screenX - barWidth/2, screenY - this.radius - 5, barWidth, barHeight);
    
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(screenX - barWidth/2, screenY - this.radius - 5, barWidth * hpPercent, barHeight);
    
    // Индикатор замедления
    if (this.slowed) {
        ctx.fillStyle = '#00aaff';
        ctx.beginPath();
        ctx.arc(screenX - 15, screenY - 15, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}
```

#### 5.6 Добавьте класс `ArenaTrap`:

Добавьте класс `ArenaTrap` в конец файла:

```javascript
class ArenaTrap {
    constructor(x, y) {
        this.worldX = x;
        this.worldY = y;
        this.radius = 15;
        this.isActive = true;
        this.lifetime = 10;
        this.triggered = false;
        this.hitEnemies = new Set();
    }

    update(deltaTime) {
        this.lifetime -= deltaTime;
        if (this.lifetime <= 0) {
            this.isActive = false;
        }

        if (!this.triggered) {
            const arena = window.currentArena;
            if (arena && arena.enemies) {
                arena.enemies.forEach(enemy => {
                    if (!this.hitEnemies.has(enemy)) {
                        const distance = Math.hypot(enemy.worldX - this.worldX, enemy.worldY - this.worldY);
                        if (distance < this.radius + enemy.radius) {
                            enemy.takeDamage(15);
                            enemy.slowDown();
                            this.hitEnemies.add(enemy);
                            this.triggered = true;

                            if (enemy.hp <= 0) {
                                arena.spawnExpGem(enemy.worldX, enemy.worldY, enemy.expValue);
                            }
                        }
                    }
                });
            }
        }
    }

    draw(ctx, cameraX, cameraY) {
        const screenX = this.worldX - cameraX;
        const screenY = this.worldY - cameraY;

        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.triggered ? '#888888' : '#ffaa00';
        ctx.globalAlpha = 0.5;
        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.fillStyle = '#aa5500';
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const x = screenX + Math.cos(angle) * this.radius;
            const y = screenY + Math.sin(angle) * this.radius;
            ctx.beginPath();
            ctx.moveTo(screenX, screenY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = '#aa5500';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        ctx.font = '10px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(Math.ceil(this.lifetime) + 'с', screenX, screenY - 15);
    }
}

// Не забудьте добавить класс в window в конце файла
window.ArenaTrap = ArenaTrap;
```

---

### Шаг 6: Обновление Hero.js

Найдите файл `js/core/Hero.js` и внесите следующие изменения:

#### 6.1 Улучшите метод `addExp()`:

Замените метод `addExp()` на:

```javascript
addExp(amount) {
    this.exp += amount;
    console.log(`Герой ${this.name} получил ${amount} опыта. Всего: ${this.exp}/${this.expToNextLevel}`);
    
    let leveledUp = false;
    
    // Проверяем, хватает ли опыта для повышения уровня
    while (this.exp >= this.expToNextLevel) {
        this.levelUp();
        leveledUp = true;
    }
    
    return leveledUp;
}
```

#### 6.2 Улучшите метод `levelUp()`:

Замените метод `levelUp()` на:

```javascript
levelUp() {
    this.level++;
    this.exp -= this.expToNextLevel;
    this.expToNextLevel = Math.floor(this.expToNextLevel * 1.5);
    
    // Улучшаем характеристики
    this.baseStats.hp += 10;
    this.maxHp = this.baseStats.hp;
    this.baseStats.attack += 2;
    this.baseStats.defense += 1;
    
    // Каждые 3 уровня даем возможность выбрать навык
    if (this.level % 3 === 0) {
        this.pendingSkillLevel = this.level;
        console.log(`%c✨✨✨ ГЕРОЙ ${this.name} ДОСТИГ УРОВНЯ ${this.level} - МОЖЕТ ВЫБРАТЬ НАВЫК! ✨✨✨`, 'color: #e94560; font-size: 14px; font-weight: bold');
        console.log(`pendingSkillLevel установлен в: ${this.pendingSkillLevel}`);
        
        // Добавляем очко навыков
        this.skillPoints = (this.skillPoints || 0) + 1;
    } else {
        console.log(`Герой ${this.name} достиг уровня ${this.level}`);
    }
    
    // Обновляем текущие статы
    this.updateCurrentStats();
}
```

---

### Шаг 7: Обновление arena_style.css

Добавьте в конец файла `arena_style.css` следующие стили:

```css
/* Исправления для мобильной версии */
@media (max-width: 768px) {
    /* Фиксируем нижнюю навигацию */
    .game-nav {
        position: sticky;
        bottom: 0;
        z-index: 100;
        background-color: #000000;
        padding: 5px;
    }
    
    .nav-btn {
        font-size: 0.9rem;
        padding: 8px 5px;
    }
    
    /* Улучшаем адаптацию canvas */
    #gameCanvas {
        min-height: 200px; /* Минимальная высота */
    }
    
    /* Убеждаемся что контейнер арены занимает всю высоту */
    .arena-game-container {
        height: 100%;
    }
}

/* Портретный режим на мобильных */
@media (max-width: 768px) and (orientation: portrait) {
    .arena-header {
        padding: 5px 10px;
    }
    
    .progress-bar-container {
        min-width: 120px;
    }
    
    .arena-stats {
        gap: 5px;
    }
    
    .skill-slot {
        width: 35px;
        height: 35px;
        font-size: 18px;
    }
}

/* Альбомный режим на мобильных */
@media (max-width: 1024px) and (orientation: landscape) {
    .arena-header {
        padding: 5px 15px;
    }
    
    #gameCanvas {
        min-height: 300px;
    }
}

/* Анимации */
@keyframes fadeInOut {
    0% { opacity: 0; transform: translate(-50%, -20px); }
    10% { opacity: 1; transform: translate(-50%, 0); }
    90% { opacity: 1; transform: translate(-50%, 0); }
    100% { opacity: 0; transform: translate(-50%, -20px); }
}

/* Эффекты для навыков */
.skill-slot {
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
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
```

---

### Шаг 8: Создание папки images

Создайте структуру папок, как описано выше. Если у вас нет PNG-файлов, вы можете:

1. **Создать заглушки**: Нарисуйте простые фигуры в любом графическом редакторе
2. **Скачать бесплатные спрайты**: Используйте ресурсы вроде OpenGameArt.org
3. **Оставить как есть**: SpriteManager создаст цветные круги с иконками

---

## ✅ Тестирование

После внесения всех изменений, проверьте следующие функции:

### Проверка загрузки
- [ ] При запуске появляется индикатор "Загрузка спрайтов..."
- [ ] В консоли видны сообщения о загрузке PNG-файлов
- [ ] Если PNG не найдены, создаются цветные заглушки

### Проверка героев
- [ ] В меню героев отображаются аватарки из папки `/images/heroes/`
- [ ] У всех 4 героев (Воин, Лучник, Маг, Разбойник) разные аватарки
- [ ] При наведении на аватарку нет ошибок в консоли

### Проверка арены
- [ ] Герой на арене имеет спрайт (не цветной круг)
- [ ] Враги имеют разные спрайты (гоблины, скелеты и т.д.)
- [ ] Кристаллы опыта отображаются как жёлтые ромбы
- [ ] Камера правильно следует за героем
- [ ] Canvas правильно ресайзится при повороте экрана

### Проверка навыков
- [ ] На уровнях 3, 6, 9 появляется модальное окно с выбором навыка
- [ ] В окне 3 случайных навыка
- [ ] После выбора навык применяется
- [ ] Навыки отображаются в слотах на арене

### Проверка боя
- [ ] У каждого класса своё оружие (меч, лук, посох, кинжалы)
- [ ] Разбойник ставит ловушки
- [ ] Маг создаёт магические лучи
- [ ] Враги замедляются от ловушек
- [ ] При получении урона есть визуальный эффект (красная вспышка)

---

## ❗ Решение проблем

### Проблема: Спрайты не загружаются
**Решение:**
- Проверьте пути в `spritePaths` - они должны быть относительными от корня проекта
- Проверьте, что папки существуют: `images/heroes/`, `images/enemies/`, `images/items/`
- Откройте вкладку Network в DevTools - посмотрите, загружаются ли PNG-файлы
- Если файлов нет, создайте их или используйте заглушки

### Проблема: Герой не виден на арене
**Решение:**
- Проверьте метод `getSprite()` в `SpriteManager.js`
- Убедитесь, что `spriteKey` установлен правильно (warrior, archer, mage, rogue)
- Временно замените спрайт на цветной круг для отладки

### Проблема: Камера "убегает" от героя
**Решение:**
- Проверьте метод `updateCamera()` - он должен вызываться после каждого обновления позиции героя
- Убедитесь, что `this.hero` не null
- Добавьте `console.log` для отслеживания позиций

### Проблема: Навыки не появляются
**Решение:**
- Проверьте метод `checkSkillChoice()` - вызывается ли он каждый кадр?
- Убедитесь, что `hero.pendingSkillLevel` правильно устанавливается в `levelUp()`
- Проверьте, что `skillChoiceShown` сбрасывается после выбора

### Проблема: Модальное окно не закрывается
**Решение:**
- Проверьте обработчики событий в `setupSkillChoiceCards()`
- Убедитесь, что `close-modal` имеет правильный обработчик
- Добавьте обработчик клика вне модального окна

### Проблема: Тормоза на мобильных устройствах
**Решение:**
- Уменьшите `maxEnemies` в `SurvivorsArena` (например, до 20)
- Проверьте, что нет утечек памяти в обработчиках событий
- Используйте throttle для обработчиков resize

---

## 📚 Что изменилось в коде

### Ключевые изменения:

1. **Асинхронная загрузка** - игра теперь ждёт загрузки спрайтов
2. **MutationObserver** - отслеживает изменения DOM для правильного ресайза
3. **Улучшенная камера** - теперь правильно центрируется
4. **Анимации** - герои и враги подпрыгивают при движении
5. **Спецэффекты** - вспышки при получении урона, замедление врагов
6. **Стабильность** - исправлены утечки памяти, улучшена обработка ошибок

### Файлы, которые остались без изменений:
- `js/core/Item.js` (не менялся)
- `js/core/Shop.js` (не менялся)
- `js/core/Recipe.js` (не менялся)
- `index.html` (не менялся, но проверьте порядок подключения скриптов)

---

## 🏁 Заключение

Поздравляю! Вы успешно обновили игру до версии 6. Теперь у вас:

- ✅ **Красивые спрайты** из локальных PNG-файлов
- ✅ **Улучшенная боевая система** с 4 классами героев
- ✅ **Стабильная работа** на мобильных устройствах
- ✅ **Визуальные эффекты** для атак и получения урона
- ✅ **Система навыков** с выбором каждые 3 уровня

- > [!TIP]
> Тестируем - герои теперь должны быть с аватарками и отображением в карточке навыков которые они изучили в виде иконок, в бою все сущности должны быть отрисованы спрайтами, навыки должны даваться герою каждые 3 уровня.  **Переходим к версии 0.0.7 в следующую ветку**

