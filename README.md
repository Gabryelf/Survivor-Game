[![Итерация 6 - Готова](https://img.shields.io/badge/Итерация_6-Отладка_и_изображения-00e600?style=for-the-badge)](##-итерация-1-скелет-и-навигация)

> [!NOTE]
> Обновлено 01.03.2026

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
Раньше все спрайты (герои, враги, предметы) рисовались программно с помощью Canvas. Это было некрасиво и однообразно. Теперь мы загружаем настоящие PNG-картинки из папки `/images`.

**Что изменилось:**
- **Асинхронная загрузка** — игра показывает индикатор загрузки, пока подгружаются картинки
- **Вариации врагов** — гоблины могут появляться с разными спрайтами (goblin_1, goblin_2)
- **Fallback-спрайты** — если картинка не загрузилась, создаётся цветной круг с вопросительным знаком
- **Аватары для UI** — в меню героев теперь отображаются настоящие аватарки

### 🔥 Система навыков
Раньше герои просто повышали уровень и увеличивали характеристики. Теперь каждые 3 уровня можно выбрать уникальный навык.

**Как это работает:**
- На уровнях 3, 6, 9, 12 и т.д. игра останавливается
- Появляется модальное окно с 3 случайными навыками
- Вы выбираете один навык, он применяется к герою
- Навыки бывают универсальные (для всех классов) и классовые (только для воина/лучника/мага/разбойника)

### ⚔️ Улучшенная боевая система
Каждый класс героя теперь имеет уникальное оружие и способности:

| Класс | Оружие | Способность |
|-------|--------|-------------|
| Воин | Меч (ближний бой) | Может ставить блок, двойной удар |
| Лучник | Лук (дальний бой) | Критические попадания, пробивание брони |
| Маг | Посох (магия) | Создаёт магические лучи, замедляет врагов |
| Разбойник | Кинжалы (быстрый бой) | Ставит ловушки, отравляет врагов |

### 🔂 Расходники в бою
Герой теперь может взять с собой в бой до 3 расходников (зелий) из инвентаря:
- **Зелье лечения** — восстанавливает HP
- **Зелье силы** — временно увеличивает атаку

### 🎨 Визуальные улучшения
- Герои и враги теперь "подпрыгивают" при движении (анимация)
- При получении урона сущности вспыхивают красным
- В слотах навыков отображаются иконки изученных навыков
- Canvas правильно подстраивается под размер экрана на мобильных устройствах

---

## 📁 Структура папок для изображений

Создайте в корне вашего проекта папку `images` со следующей структурой:

```
images/
├── heroes/               # Аватарки героев в меню и спрайты на арене
│   ├── warrior.png       # Воин
│   ├── archer.png        # Лучник
│   ├── elementalist.png  # Маг
│   └── assasin.png       # Разбойник 
├── enemies/              # Спрайты врагов
│   ├── peasant.png       # Крестьянин
│   ├── ronin.png         # Ронин
│   ├── bandit.png        # Бандит
│   └── raider.png        # Рейдер
└── items/                # Предметы
    ├── gem_yellow.png    # Кристалл опыта
    └── potion_red.png    # Зелье
```

> **⚠️ ВАЖНО:** Названия файлов должны точно соответствовать указанным, потому что в коде прописаны именно эти пути. Если у вас другие названия, измените пути в `SpriteManager.js`.

**Что делать, если у вас нет PNG-файлов?**
- **Вариант 1:** Нарисуйте простые картинки в Paint или любом графическом редакторе
- **Вариант 2:** Скачайте бесплатные спрайты с сайтов вроде OpenGameArt.org
- **Вариант 3:** Используйте те которые есть в репозитории, они работают и менять названия не надо!
- **Вариант 4:** Ничего не делайте — SpriteManager сам создаст цветные круги-заглушки

---

## 🔧 Какие файлы нужно изменить

| Файл | Что нужно сделать |
|------|-------------------|
| `js/arena/SpriteManager.js` | **Создать новый файл** (раньше его не было) |
| `js/game.js` | **Полностью заменить** на новую версию |
| `js/ui/UIManager.js` | **Добавить 4 новых метода**, изменить 1 метод |
| `js/arena/SurvivorsArena.js` | **Добавить 5 новых методов**, изменить 2 метода |
| `js/arena/GameEntity.js` | **Обновить 3 класса**, добавить 1 новый класс |
| `js/core/Hero.js` | **Изменить 2 метода** |
| `arena_style.css` | **Добавить стили** в конец файла |
| `index.html` | **Проверить порядок** подключения скриптов |

---

## 📝 Пошаговая инструкция

### Шаг 1: Создаём папку images

1. В корне вашего проекта (там же, где лежит `index.html`) создайте папку `images`
2. Внутри создайте папки: `heroes`, `enemies`, `items`
3. Положите в них PNG-файлы с названиями из таблицы выше

Если у вас нет картинок, создайте пустые файлы с правильными названиями (игра будет использовать заглушки).

---

### Шаг 2: Создаём новый файл или обновляем старый полностью SpriteManager.js

Создайте файл `js/arena/SpriteManager.js` и скопируйте в него этот код:

```javascript
// js/arena/SpriteManager.js
// Менеджер спрайтов - загружает картинки из папки /images

class SpriteManager {
    constructor() {
        // Здесь будут храниться загруженные спрайты
        // Map - это как объект, но лучше для хранения изображений
        this.sprites = new Map();
        
        // Флаг, что все спрайты загружены
        this.loaded = false;
        
        // Пути к картинкам - ВАЖНО: названия должны совпадать с файлами в папке images
        this.spritePaths = {
            // Герои
            warrior: 'images/heroes/warrior.png',
            archer: 'images/heroes/archer.png',
            mage: 'images/heroes/elementalist.png',    // Обратите внимание: elementalist.png
            rogue: 'images/heroes/assasin.png',        // Обратите внимание: assasin.png
            
            // Враги с вариациями (для разнообразия)
            goblin: 'images/enemies/peasant.png',      // Основной гоблин
            goblin_1: 'images/enemies/peasant.png',    // Вариант 1
            goblin_2: 'images/enemies/peasant.png',    // Вариант 2
            skeleton: 'images/enemies/ronin.png',
            skeleton_1: 'images/enemies/ronin.png',
            ghost: 'images/enemies/bandit.png',
            orc: 'images/enemies/raider.png',
            
            // Предметы
            expGem: 'images/items/gem_yellow.png',
            potion: 'images/items/potion_red.png',
            
            // Запасной спрайт (если ничего не загрузилось)
            default_hero: 'images/default_hero.png'
        };
    }

    // Асинхронная загрузка всех спрайтов
    async loadSprites() {
        console.log('🎨 Загрузка спрайтов из локальной папки /images...');
        
        // Создаём массив промисов (обещаний) для загрузки каждой картинки
        const loadPromises = [];

        // Перебираем все пути из spritePaths
        for (const [key, path] of Object.entries(this.spritePaths)) {
            // Для каждого ключа (например 'warrior') загружаем картинку
            // .catch - если ошибка, просто пишем предупреждение, но не останавливаем загрузку
            loadPromises.push(this.loadImage(key, path).catch(err => {
                console.warn(`⚠️ Не удалось загрузить ${key} из ${path}, создаю fallback`);
            }));
        }

        // Ждём, пока ВСЕ картинки загрузятся (или упадут с ошибкой)
        await Promise.allSettled(loadPromises);
        
        this.loaded = true;
        console.log(`✅ Загружено спрайтов: ${this.sprites.size}`);
    }

    // Загрузка одной картинки
    loadImage(key, path) {
        return new Promise((resolve, reject) => {
            // Создаём HTML-элемент Image
            const img = new Image();
            
            // Когда картинка загрузится
            img.onload = () => {
                // Создаём canvas, чтобы обработать изображение
                const canvas = document.createElement('canvas');
                canvas.width = 64;
                canvas.height = 64;
                const ctx = canvas.getContext('2d');
                
                // Включаем сглаживание, чтобы картинка была чёткой
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                
                // Вырезаем квадрат по центру изображения (чтобы не было искажений)
                const size = Math.min(img.width, img.height);
                const sourceX = (img.width - size) / 2;
                const sourceY = (img.height - size) / 2;
                
                // Рисуем изображение на canvas (с отступами 2 пикселя)
                ctx.drawImage(img, sourceX, sourceY, size, size, 2, 2, 60, 60);
                
                // Добавляем красивую обводку
                ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(32, 32, 30, 0, Math.PI * 2);
                ctx.stroke();
                
                // Сохраняем canvas в хранилище
                this.sprites.set(key, canvas);
                console.log(`✅ Загружен: ${key}`);
                resolve();
            };
            
            // Если ошибка загрузки
            img.onerror = (err) => {
                console.error(`❌ Ошибка загрузки ${key} из ${path}:`, err);
                reject(err);
            };
            
            // Добавляем timestamp, чтобы браузер не кэшировал картинки при разработке
            img.src = path + '?t=' + Date.now();
        });
    }

    // Получить спрайт по ключу
    getSprite(key) {
        // Для врагов с вариациями - выбираем случайный вариант
        if (key === 'goblin' || key === 'skeleton') {
            // Создаём массив возможных вариантов: [goblin, goblin_1, goblin_2]
            const variants = [`${key}`, `${key}_1`, `${key}_2`].filter(v => this.sprites.has(v));
            
            // Если есть хоть один вариант, возвращаем случайный
            if (variants.length > 0) {
                return this.sprites.get(variants[Math.floor(Math.random() * variants.length)]);
            }
        }
        
        // Если спрайт не найден, возвращаем заглушку
        return this.sprites.get(key) || this.sprites.get('default_hero') || this.createFallbackOnDemand(key);
    }

    // Создать заглушку на лету (если картинка не загрузилась)
    createFallbackOnDemand(key) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Красный круг
        ctx.fillStyle = '#e94560';
        ctx.beginPath();
        ctx.arc(32, 32, 30, 0, Math.PI * 2);
        ctx.fill();
        
        // Вопросительный знак
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('?', 32, 36);
        
        return canvas;
    }

    // Для аватарок в HTML-тегах <img> (в меню героев)
    getAvatarUrl(type, seed = null) {
        // Возвращаем путь к PNG
        const path = this.spritePaths[type] || this.spritePaths.default_hero || 'images/default_hero.png';
        return path + '?t=' + Date.now();
    }
}

// Делаем класс доступным глобально
window.SpriteManager = SpriteManager;
```

**Что здесь происходит:**
- **constructor()** — создаёт хранилище для спрайтов и определяет пути к картинкам
- **loadSprites()** — загружает все картинки асинхронно (игра не ждёт, пока загрузятся все)
- **loadImage()** — загружает одну картинку и преобразует её в canvas для лучшего контроля
- **getSprite()** — возвращает спрайт по ключу (с учётом вариаций врагов)
- **createFallbackOnDemand()** — создаёт заглушку, если картинка не загрузилась
- **getAvatarUrl()** — возвращает путь к картинке для использования в теге `<img>`

---

### Шаг 3: Обновляем game.js

**Полностью замените** содержимое файла `js/game.js` на этот код:

```javascript
// js/game.js - точка входа в игру

// Ждём, пока загрузится DOM, потом выполняем код
// async означает, что функция будет работать асинхронно
document.addEventListener('DOMContentLoaded', async () => {
    // Показываем шапку игры
    const gameHeader = document.querySelector('.game-header');
    if (gameHeader) {
        gameHeader.style.display = 'flex';
        gameHeader.style.visibility = 'visible';
    }
    
    // Показываем индикатор загрузки
    showLoadingIndicator('Загрузка спрайтов из папки images...');
    
    try {
        // Создаём менеджер спрайтов и сохраняем его в глобальной переменной
        window.spriteManager = new SpriteManager();
        
        // Загружаем спрайты и ждём, пока они загрузятся (await)
        await window.spriteManager.loadSprites();
        
        // Инициализируем игру
        initializeGame();
        
        // Прячем индикатор загрузки
        hideLoadingIndicator();
        
        // Показываем уведомление об успехе
        showNotification('✅ Спрайты загружены!', 2000);
        
    } catch (error) {
        // Если произошла ошибка при загрузке спрайтов
        console.error('Ошибка загрузки:', error);
        hideLoadingIndicator();
        
        // Всё равно запускаем игру (будут использоваться заглушки)
        initializeGame();
        showNotification('⚠️ Используются заглушки вместо спрайтов', 3000);
    }
});

// Функция для показа индикатора загрузки
function showLoadingIndicator(text) {
    // Удаляем старый индикатор, если он есть
    const existing = document.getElementById('loadingIndicator');
    if (existing) existing.remove();
    
    // Создаём новый
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

// Функция для скрытия индикатора загрузки
function hideLoadingIndicator() {
    const loader = document.getElementById('loadingIndicator');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }
}

// Функция для показа уведомлений
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
    
    // Удаляем уведомление через указанное время
    setTimeout(() => notif.remove(), duration);
}

// Функция инициализации игры
function initializeGame() {
    console.log('🎮 Инициализация игры...');
    
    // СОЗДАЁМ ГЕРОЕВ
    const warrior = new window.Hero('1', 'Воин', { hp: 120, attack: 18, defense: 12, speed: 8 }, 'warrior');
    const archer = new window.Hero('2', 'Лучник', { hp: 80, attack: 22, defense: 6, speed: 15 }, 'archer');
    const mage = new window.Hero('3', 'Маг', { hp: 70, attack: 25, defense: 4, speed: 12 }, 'mage');
    const rogue = new window.Hero('4', 'Разбойник', { hp: 90, attack: 16, defense: 8, speed: 18 }, 'rogue');
    
    // Добавляем героев в общее состояние игры
    window.GameState.heroes.push(warrior, archer, mage, rogue);
    window.GameState.selectHero('1'); // Выбираем первого героя (Воина)
    
    // ДОБАВЛЯЕМ ТЕСТОВЫЕ ПРЕДМЕТЫ В ИНВЕНТАРЬ
    window.GameState.addToInventory(new window.Weapon('weapon_sword_1', 'Деревянный меч', 'common', 10, { damage: 5, range: 1 }, '⚔️'));
    window.GameState.addToInventory(new window.Weapon('weapon_bow_1', 'Короткий лук', 'common', 15, { damage: 7, range: 3 }, '🏹'));
    window.GameState.addToInventory(new window.Armor('armor_cloth_1', 'Тканевая броня', 'common', 8, { defense: 3, hp: 5 }, '👕'));
    
    // ИНИЦИАЛИЗИРУЕМ СИСТЕМЫ
    window.GameState.initShop();      // Магазин
    window.GameState.initRecipes();   // Крафт
    window.GameState.initSkills();    // Навыки
    
    // ЗАПУСКАЕМ UI
    window.ui = new window.UIManager();
    
    // СОЗДАЁМ КОНТРОЛЛЕР АРЕНЫ
    window.arenaController = new window.ArenaController();
    
    console.log('✅ Игра готова!');
}

// ОБРАБОТЧИКИ КНОПОК ЛОКАЦИЙ
document.querySelectorAll('.start-match-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Получаем данные о локации из атрибутов data-
        const location = e.target.closest('.location-card').dataset.location;
        const costType = e.target.dataset.costType;
        
        // Получаем текущего выбранного героя
        const hero = window.GameState.getCurrentHero();
        
        // Проверки
        if (!hero) {
            showNotification('❌ Сначала выберите героя!', 2000);
            return;
        }
        
        if (window.GameState.resources[costType] < 1) {
            showNotification(`❌ Не хватает ${costType}!`, 2000);
            return;
        }
        
        // Тратим ресурс
        window.GameState.updateResource(costType, -1);
        
        // Запускаем экспедицию
        const started = window.arenaController.startExpedition(location, hero);
        
        // Если не удалось запустить, возвращаем ресурс
        if (!started) {
            window.GameState.updateResource(costType, 1);
        }
    });
});

// Добавляем CSS-анимацию для уведомлений
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

Так же перейдите в скрипт ArenaController.js и замените весь код там на этот, мы
поменяем некоторые технические характеристики для лучшего отображения спрайтов и
загрузки данных.

```javascript
class ArenaController {
    constructor() {
        // Создаём менеджер спрайтов
        if (!window.spriteManager) {
            window.spriteManager = new SpriteManager();
        }
        this.arena = null;
        this.initEventListeners();
    }
    
    initEventListeners() {
        const pauseBtn = document.getElementById('pauseBtn');
        const resumeBtn = document.getElementById('resumeBtn');
        const exitBtn = document.getElementById('exitArenaBtn');
        
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                if (this.arena) {
                    this.arena.togglePause();
                }
            });
        }
        
        if (resumeBtn) {
            resumeBtn.addEventListener('click', () => {
                if (this.arena) {
                    this.arena.togglePause();
                }
            });
        }
        
        if (exitBtn) {
            exitBtn.addEventListener('click', () => {
                if (this.arena) {
                    this.arena.exitArena();
                }
            });
        }
    }
    
    startExpedition(location, hero) {
        if (!hero) {
            alert('Сначала выберите героя в меню "Герои"!');
            return false;
        }
        
        console.log('Starting expedition with hero:', hero);
        
        // Сохраняем текущее состояние героя
        hero.currentStats.hp = hero.baseStats.hp;
        
        // Создаём арену
        this.arena = new SurvivorsArena('gameCanvas');
        this.arena.init(hero);
        
        // Переключаем экран
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('screenArena').classList.add('active');
        
        // Скрываем навигацию
        document.querySelector('.game-nav').style.display = 'none';
        
        // Принудительно скрываем основной хедер
        const gameHeader = document.querySelector('.game-header');
        if (gameHeader) {
            gameHeader.style.display = 'none';
            gameHeader.style.visibility = 'hidden';
        }
        
        // Даем время на перерисовку DOM
        setTimeout(() => {
            // Запускаем арену
            this.arena.start();
        }, 100);
        
        return true;
    }
}

window.ArenaController = ArenaController;
```

Вернитесь в Hero.js и исправте переменную skills в конструкторе и добавте 
методы для новой обработки инвенторя, конечный вариант скрипта должен выглядеть так.
Теперь у нас есть метод определяющий куда и какую вещь поставить, сами ячейки героя по типу и
методы ответственные за событие одеть / снять.

```javascript
// ==============================
// Класс героя в игре.
// ==============================
class Hero {
    constructor(id, name, baseStats, type) {
        this.id = id;
        this.name = name;
        this.type = type; // 'warrior', 'archer', 'mage', 'rogue'
        this.level = 1;
        this.exp = 0;
        this.expToNextLevel = 100;
        this.isUnlocked = true;
        
        // Базовые характеристики
        this.baseStats = {
            hp: baseStats.hp || 100,
            attack: baseStats.attack || 10,
            defense: baseStats.defense || 5,
            speed: baseStats.speed || 10
        };
        
        // Максимальное здоровье (для удобства)
        this.maxHp = this.baseStats.hp;
        
        // Текущие характеристики (с учетом снаряжения и навыков)
        this.currentStats = { ...this.baseStats };
        
        // Инвентарь общий для всех героев (хранится в GameState)
        // Каждый герой имеет только ссылки на ID предметов
        
        // Снаряжение (зависит от класса)
        this.equipment = this.initEquipmentSlots();
        
        // Навыки
        this.learnedSkills = [];
        this.skillPoints = 0; // Очки навыков (получаются каждые 3 уровня)
        this.pendingSkillLevel = 0; // Уровень, на котором нужно выбрать навык
        
        // Боевые характеристики
        this.critChance = 0;
        this.critDamage = 1.5;
        this.lifesteal = 0;
        this.specialEffects = [];
    }
    
    initEquipmentSlots() {
        // Создаем слоты в зависимости от класса
        switch(this.type) {
            case 'warrior':
                return {
                    weapon1: null,  // Оружие 1
                    weapon2: null,  // Оружие 2 или щит
                    armor: null,    // Броня
                    accessory: null // Аксессуар
                };
            case 'archer':
                return {
                    weapon1: null,  // Лук
                    armor: null,    // Броня
                    accessory1: null, // Аксессуар 1
                    accessory2: null  // Аксессуар 2
                };
            case 'mage':
                return {
                    weapon1: null,  // Посох
                    accessory1: null, // Аксессуар 1
                    accessory2: null, // Аксессуар 2
                    accessory3: null  // Аксессуар 3
                };
            case 'rogue':
                return {
                    weapon1: null,  // Кинжал 1
                    weapon2: null,  // Кинжал 2
                    accessory1: null, // Аксессуар 1
                    accessory2: null  // Аксессуар 2
                };
            default:
                return {
                    weapon1: null,
                    armor: null,
                    accessory: null
                };
        }
    }
    
    // Добавить опыт
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
    
    // Повышение уровня
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
    
    // Проверить, нужно ли выбрать навык
    hasPendingSkill() {
        const hasPending = this.pendingSkillLevel > 0;
        if (hasPending) {
            console.log(`hasPendingSkill() = true (pendingLevel: ${this.pendingSkillLevel})`);
        }
        return hasPending;
    }
    
    // Обновить текущие статы с учетом снаряжения и навыков
    updateCurrentStats() {
        this.currentStats = { ...this.baseStats };
        
        // Добавляем бонусы от снаряжения
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
            
            // Особые эффекты предметов
            if (item.special) {
                if (item.special.critChance) this.critChance += item.special.critChance;
                if (item.special.critDamage) this.critDamage += item.special.critDamage;
                if (item.special.lifesteal) this.lifesteal += item.special.lifesteal;
            }
        });
        
        // Убеждаемся, что текущее HP не превышает максимум
        if (this.currentStats.hp > this.maxHp) {
            this.currentStats.hp = this.maxHp;
        }
    }
    
    // Экипировать предмет
    equip(item, slot) {
        // Проверяем, подходит ли предмет для этого слота
        const validSlots = this.getValidSlotsForItem(item);
        
        if (!validSlots.includes(slot)) {
            console.log('Предмет нельзя экипировать в этот слот');
            return false;
        }
        
        // Если в слоте уже есть предмет, возвращаем его в инвентарь
        if (this.equipment[slot]) {
            window.GameState.addToInventory(this.equipment[slot]);
        }
        
        // Экипируем новый предмет
        this.equipment[slot] = item;
        
        // Удаляем предмет из инвентаря (по instanceId)
        window.GameState.removeFromInventory(item.instanceId || item.id);
        
        this.updateCurrentStats();
        return true;
    }
    
    // Снять предмет
    unequip(slot) {
        const item = this.equipment[slot];
        if (!item) return false;
        
        // Добавляем в инвентарь
        window.GameState.addToInventory(item);
        
        // Очищаем слот
        this.equipment[slot] = null;
        
        this.updateCurrentStats();
        return true;
    }
    
    // Получить допустимые слоты для предмета
    getValidSlotsForItem(item) {
        const slots = [];
        
        switch(item.type) {
            case 'weapon':
                if (this.type === 'warrior') {
                    slots.push('weapon1', 'weapon2');
                } else if (this.type === 'rogue') {
                    slots.push('weapon1', 'weapon2');
                } else {
                    slots.push('weapon1');
                }
                break;
            case 'shield':
                if (this.type === 'warrior') {
                    slots.push('weapon2'); // Щит можно поставить во второй слот оружия
                }
                break;
            case 'armor':
                if (['warrior', 'archer'].includes(this.type)) {
                    slots.push('armor');
                }
                break;
            case 'accessory':
                if (this.type === 'warrior') {
                    slots.push('accessory');
                } else if (this.type === 'archer') {
                    slots.push('accessory1', 'accessory2');
                } else if (this.type === 'mage') {
                    slots.push('accessory1', 'accessory2', 'accessory3');
                } else if (this.type === 'rogue') {
                    slots.push('accessory1', 'accessory2');
                }
                break;
        }
        
        return slots;
    }
    
    // Получить все экипированные предметы
    getEquippedItems() {
        return Object.values(this.equipment).filter(item => item !== null);
    }
    
    // Применить урон с учетом критов и эффектов
    calculateDamage(baseDamage) {
        let damage = baseDamage;
        
        // Критический удар
        if (Math.random() < this.critChance) {
            damage *= this.critDamage;
        }
        
        return Math.floor(damage);
    }
    
    // Восстановление здоровья (для вампиризма)
    heal(amount) {
        this.currentStats.hp = Math.min(this.currentStats.hp + amount, this.maxHp);
    }
}

// Делаем глобальным
window.Hero = Hero;
```

**Что изменилось:**
1. **Асинхронная загрузка** — добавили `async/await` для загрузки спрайтов
2. **Индикатор загрузки** — показываем пользователю, что игра загружается
3. **Обработка ошибок** — если спрайты не загрузились, используем заглушки
4. **Уведомления** — показываем красивые всплывающие сообщения

---

### Шаг 4: Обновляем UIManager.js

Откройте файл `js/ui/UIManager.js`. Мы добавим 4 новых метода и изменим один существующий.

#### 4.1 Добавьте метод getHeroAvatarUrl()

Найдите место **после метода `updateResourcesUI()`** (примерно строка 100) и вставьте этот код:

```javascript
// Получить путь к аватарке героя (для тега <img>)
getHeroAvatarUrl(hero) {
    // Если есть SpriteManager, используем его
    if (window.spriteManager) {
        return window.spriteManager.getAvatarUrl(hero.type, hero.name);
    }
    // Запасной вариант - прямой путь к папке
    return `images/heroes/${hero.type}.png?t=${Date.now()}`;
}
```

**Объяснение:** Этот метод возвращает путь к PNG-файлу героя, чтобы его можно было использовать в теге `<img src="...">`.

#### 4.2 Замените метод renderHeroes() полностью

Найдите метод `renderHeroes()` (примерно строка 120) и **полностью замените** его на этот код:

```javascript
// Отрисовка списка героев в меню
renderHeroes() {
    const container = document.getElementById('heroesList');
    if (!container) return;

    container.innerHTML = '';

    // Перебираем всех героев
    window.GameState.heroes.forEach(hero => {
        const heroCard = document.createElement('div');
        heroCard.className = 'hero-card';
        
        // Если это текущий выбранный герой, выделяем его рамкой
        if (hero.id === window.GameState.currentHeroId) {
            heroCard.style.border = '2px solid #e94560';
        }

        // Получаем URL аватара
        const avatarUrl = this.getHeroAvatarUrl(hero);

        // Создаём HTML карточки героя
        heroCard.innerHTML = `
            <div class="hero-avatar" style="position: relative;">
                <!-- Аватарка героя - теперь это реальная картинка! -->
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
                <!-- Отображение изученных навыков в виде иконок -->
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

    // Добавляем обработчики для кнопок
    this.addHeroEventListeners();
}
```

**Что изменилось:**
1. **Аватарки** — теперь используются реальные PNG (раньше были цветные круги)
2. **Иконки навыков** — отображаются изученные навыки под карточкой героя
3. **Обработка ошибок** — если картинка не загрузилась, подставляется default_hero.png

#### 4.3 Добавьте метод addHeroEventListeners()

После метода `renderHeroes()` добавьте этот код:

```javascript
// Обработчики для кнопок в карточках героев
addHeroEventListeners() {
    // Кнопка "Выбрать для боя"
    document.querySelectorAll('.select-hero-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const heroId = e.target.dataset.heroId;
            window.GameState.selectHero(heroId);
            this.renderHeroes(); // Перерисовываем, чтобы обновить выделение
        });
    });

    // Кнопка "Инвентарь"
    document.querySelectorAll('.inventory-hero-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const heroId = e.target.dataset.heroId;
            this.showHeroInventory(heroId);
        });
    });
}
```

**Объяснение:** Этот метод добавляет обработчики событий на кнопки в карточках героев. Раньше этот код был внутри `renderHeroes()`, но мы вынесли его отдельно для лучшей организации.

#### 4.4 Замените метод showSkillChoice() полностью

Найдите метод `showSkillChoice()` (примерно строка 350) и **полностью замените** его на этот код:

```javascript
// Показать окно выбора навыка (вызывается, когда герой достигает 3,6,9... уровня)
showSkillChoice(hero, skills) {
    console.log('showSkillChoice вызван с навыками:', skills);
    const modal = document.getElementById('heroModal');
    const modalBody = document.getElementById('modalBody');

    // Проверяем, есть ли модальное окно
    if (!modal || !modalBody) {
        console.error('Модальное окно не найдено!');
        if (window.currentArena) {
            window.currentArena.skillChoiceShown = false;
            window.currentArena.resume();
        }
        return;
    }

    // Если нет доступных навыков, просто продолжаем игру
    if (!skills || skills.length === 0) {
        console.log('Нет доступных навыков, продолжаем игру');
        hero.pendingSkillLevel = 0;
        if (window.currentArena) {
            window.currentArena.skillChoiceShown = false;
            window.currentArena.resume();
        }
        return;
    }

    // Создаём HTML для модального окна с 3 навыками
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
                            // Преобразуем эффекты навыка в читаемый текст
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

#### 4.5 Добавьте метод setupSkillChoiceCards()

После метода `showSkillChoice()` добавьте этот код:

```javascript
// Настройка обработчиков для карточек навыков
setupSkillChoiceCards(hero, modal) {
    const cards = document.querySelectorAll('.skill-choice-card');
    
    cards.forEach(card => {
        // Эффект при наведении
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

        // Обработчик клика на навык
        card.addEventListener('click', () => {
            const skillId = card.dataset.skillId;
            const skill = window.GameState.skillManager?.skills.find(s => s.id === skillId);

            if (skill) {
                console.log('Выбран навык:', skill.name);

                // Изучаем навык
                const success = window.GameState.skillManager.learnSkill(hero, skillId);

                if (success) {
                    hero.pendingSkillLevel = 0; // Сбрасываем ожидание
                    modal.style.display = 'none'; // Закрываем окно

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

    // Обработчик для кнопки закрытия окна
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

#### 4.6 Добавьте метод showNotification()

После метода `setupSkillChoiceCards()` добавьте этот код:

```javascript
// Показать всплывающее уведомление
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
    
    // Удаляем через 2 секунды
    setTimeout(() => notification.remove(), 2000);
}
```

#### 4.7 Улучшите обработчик закрытия модального окна

В методе `initEventListeners()` найдите обработчик для `.close-modal` (примерно строка 30) и замените его на:

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

Создаем новый скрипт в папке core Skill.js и реализуем логику первичных скилов
Далее мы разделим эту логику на конфиг и менеджер, но уже в следующих частях, когда
будем реализовывать полноценную систему навыков и умений.

```javascript
// ==============================
// Класс навыков для героев
// ==============================

class Skill {
    constructor(id, name, description, type, heroClasses, levelRequirement, effects, icon = '✨') {
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type; // 'passive', 'active', 'ultimate'
        this.heroClasses = heroClasses; // Массив классов, которые могут взять навык ['warrior', 'archer']
        this.levelRequirement = levelRequirement; // Уровень, на котором доступен
        this.effects = effects; // Объект с эффектами
        this.icon = icon;
        this.isUnlocked = false;
    }
    
    // Применить эффекты навыка к герою
    apply(hero) {
        console.log(`Применяем навык ${this.name} к герою ${hero.name}`);
        
        if (this.effects.attack) {
            hero.baseStats.attack += this.effects.attack;
            console.log(`+${this.effects.attack} к атаке`);
        }
        if (this.effects.defense) {
            hero.baseStats.defense += this.effects.defense;
            console.log(`+${this.effects.defense} к защите`);
        }
        if (this.effects.hp) {
            hero.baseStats.hp += this.effects.hp;
            hero.maxHp += this.effects.hp;
            hero.currentStats.hp += this.effects.hp;
            console.log(`+${this.effects.hp} к здоровью`);
        }
        if (this.effects.speed) {
            hero.baseStats.speed += this.effects.speed;
            console.log(`+${this.effects.speed} к скорости`);
        }
        if (this.effects.critChance) {
            hero.critChance = (hero.critChance || 0) + this.effects.critChance;
            console.log(`+${Math.round(this.effects.critChance * 100)}% к крит. шансу`);
        }
        if (this.effects.critDamage) {
            hero.critDamage = (hero.critDamage || 1.5) + this.effects.critDamage;
            console.log(`+${Math.round(this.effects.critDamage * 100)}% к крит. урону`);
        }
        if (this.effects.lifesteal) {
            hero.lifesteal = (hero.lifesteal || 0) + this.effects.lifesteal;
            console.log(`+${Math.round(this.effects.lifesteal * 100)}% к вампиризму`);
        }
        if (this.effects.special) {
            // Специальные эффекты (например, двойной удар, отравление и т.д.)
            hero.specialEffects = hero.specialEffects || [];
            hero.specialEffects.push(this.effects.special);
            console.log(`Добавлен специальный эффект: ${this.effects.special.type}`);
        }
        
        hero.updateCurrentStats();
        console.log('Новые статы:', hero.currentStats);
    }
}

// Менеджер навыков
class SkillManager {
    constructor() {
        this.skills = [];
        this.initSkills();
    }
    
    initSkills() {
        // Универсальные навыки (доступны всем)
        this.skills.push(
            new Skill(
                'skill_hp_1',
                'Крепкое здоровье',
                'Увеличивает максимальное здоровье на 20',
                'passive',
                ['warrior', 'archer', 'mage', 'rogue'],
                3,
                { hp: 20 },
                '❤️'
            ),
            new Skill(
                'skill_hp_2',
                'Железное здоровье',
                'Увеличивает максимальное здоровье на 50',
                'passive',
                ['warrior', 'archer', 'mage', 'rogue'],
                9,
                { hp: 50 },
                '💪'
            ),
            new Skill(
                'skill_attack_1',
                'Острые клинки',
                'Увеличивает атаку на 5',
                'passive',
                ['warrior', 'archer', 'rogue'],
                3,
                { attack: 5 },
                '⚔️'
            ),
            new Skill(
                'skill_attack_2',
                'Мастерство оружия',
                'Увеличивает атаку на 12',
                'passive',
                ['warrior', 'archer', 'rogue'],
                9,
                { attack: 12 },
                '🗡️'
            ),
            new Skill(
                'skill_defense_1',
                'Крепкая броня',
                'Увеличивает защиту на 3',
                'passive',
                ['warrior', 'archer', 'mage'],
                3,
                { defense: 3 },
                '🛡️'
            ),
            new Skill(
                'skill_speed_1',
                'Быстрые ноги',
                'Увеличивает скорость на 5',
                'passive',
                ['warrior', 'archer', 'rogue'],
                3,
                { speed: 5 },
                '👟'
            )
        );
        
        // Навыки воина
        this.skills.push(
            new Skill(
                'skill_warrior_berserk',
                'Берсерк',
                'Увеличивает урон на 10%, но снижает защиту на 2',
                'passive',
                ['warrior'],
                6,
                { attack: 5, defense: -2 },
                '🔥'
            ),
            new Skill(
                'skill_warrior_shield',
                'Стена щитов',
                'Увеличивает защиту на 8, шанс заблокировать атаку 15%',
                'passive',
                ['warrior'],
                6,
                { defense: 8, special: { type: 'block', chance: 0.15 } },
                '🛡️'
            ),
            new Skill(
                'skill_warrior_dual',
                'Двойной удар',
                '10% шанс нанести двойной урон',
                'passive',
                ['warrior'],
                12,
                { special: { type: 'doubleStrike', chance: 0.1 } },
                '⚡'
            ),
            new Skill(
                'skill_warrior_charge',
                'Заряд',
                'Увеличивает скорость на 10 и урон на 8 при движении вперед',
                'passive',
                ['warrior'],
                15,
                { speed: 10, attack: 8 },
                '🏃'
            )
        );
        
        // Навыки лучника
        this.skills.push(
            new Skill(
                'skill_archer_precision',
                'Точность',
                'Увеличивает шанс попадания на 15%',
                'passive',
                ['archer'],
                6,
                { special: { type: 'accuracy', bonus: 0.15 } },
                '🎯'
            ),
            new Skill(
                'skill_archer_critical',
                'Меткий глаз',
                'Увеличивает шанс критического удара на 10%',
                'passive',
                ['archer'],
                9,
                { critChance: 0.1 },
                '⭐'
            ),
            new Skill(
                'skill_archer_piercing',
                'Пробивающая стрела',
                'Игнорирует 20% защиты врага',
                'passive',
                ['archer'],
                12,
                { special: { type: 'armorPierce', percent: 0.2 } },
                '🏹'
            ),
            new Skill(
                'skill_archer_rapid',
                'Быстрая стрельба',
                'Увеличивает скорость атаки на 25%',
                'passive',
                ['archer'],
                15,
                { special: { type: 'attackSpeed', bonus: 0.25 } },
                '⚡'
            )
        );
        
        // Навыки мага
        this.skills.push(
            new Skill(
                'skill_mage_intelligence',
                'Интеллект',
                'Увеличивает урон магии на 15%',
                'passive',
                ['mage'],
                6,
                { attack: 8 },
                '🔮'
            ),
            new Skill(
                'skill_mage_mana',
                'Магический резерв',
                'Увеличивает длительность магии на 1 секунду',
                'passive',
                ['mage'],
                9,
                { special: { type: 'magicDuration', bonus: 1.0 } },
                '💙'
            ),
            new Skill(
                'skill_mage_frost',
                'Ледяная стрела',
                'Замедляет врагов при попадании на 30%',
                'passive',
                ['mage'],
                12,
                { special: { type: 'slow', percent: 0.3 } },
                '❄️'
            ),
            new Skill(
                'skill_mage_chain',
                'Цепная молния',
                'Магия может поразить до 3 дополнительных врагов',
                'passive',
                ['mage'],
                15,
                { special: { type: 'chain', targets: 3 } },
                '⚡'
            )
        );
        
        // Навыки разбойника
        this.skills.push(
            new Skill(
                'skill_rogue_poison',
                'Отравленные клинки',
                'Отравляет врагов, нанося 5 урона в секунду в течение 3 секунд',
                'passive',
                ['rogue'],
                6,
                { special: { type: 'poison', damage: 5, duration: 3 } },
                '☠️'
            ),
            new Skill(
                'skill_rogue_stealth',
                'Незаметность',
                'Враги реже атакуют разбойника',
                'passive',
                ['rogue'],
                9,
                { special: { type: 'threat', reduction: 0.3 } },
                '👤'
            ),
            new Skill(
                'skill_rogue_backstab',
                'Удар в спину',
                'Атака со спины наносит на 50% больше урона',
                'passive',
                ['rogue'],
                12,
                { special: { type: 'backstab', bonus: 0.5 } },
                '🗡️'
            ),
            new Skill(
                'skill_rogue_trapmaster',
                'Мастер ловушек',
                'Ловушки действуют на 50% дольше и наносят на 50% больше урона',
                'passive',
                ['rogue'],
                15,
                { special: { type: 'trapMastery', damageBonus: 0.5, durationBonus: 0.5 } },
                '🔒'
            )
        );
        
        console.log('Навыки инициализированы:', this.skills.length);
    }
    
    // Получить доступные навыки для героя на определенном уровне
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
        console.log(`Доступно навыков для героя ${hero.name} на уровень ${level}:`, available.length);
        
        if (available.length === 0) {
            // Если нет доступных навыков, герой пропускает выбор
            hero.pendingSkillLevel = 0;
            return [];
        }
        
        // Перемешиваем и берем до 3 навыков
        const shuffled = [...available].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(3, shuffled.length));
    }
    
    // Изучить навык
    learnSkill(hero, skillId) {
        const skill = this.skills.find(s => s.id === skillId);
        if (!skill) {
            console.error('Навык не найден:', skillId);
            return false;
        }
        
        if (!hero.learnedSkills) {
            hero.learnedSkills = [];
        }
        
        if (hero.learnedSkills.includes(skillId)) {
            console.log('Навык уже изучен');
            return false;
        }
        
        hero.learnedSkills.push(skillId);
        skill.apply(hero);
        
        console.log(`Герой ${hero.name} изучил навык: ${skill.name}`);
        return true;
    }
}

window.Skill = Skill;
window.SkillManager = SkillManager;
```

---

### Шаг 5: Обновляем SurvivorsArena.js

Откройте файл `js/arena/SurvivorsArena.js`. Мы добавим 5 новых методов и изменим 2 существующих.

#### 5.1 Добавьте новые методы в конструктор

В конструкторе класса `SurvivorsArena` найдите строку `window.currentArena = this;` и **сразу после неё** добавьте:

```javascript
// Генерация декораций (деревья, камни и т.д.)
this.generateDecorations();

// Инициализация управления (клавиатура, джойстик)
this.initControls();

// Обработчик изменения размера окна
this.initResizeHandler();

// Обработчик поворота экрана на мобильных устройствах
this.initOrientationHandler();

// Наблюдатель за изменениями DOM (для правильного ресайза)
this.initMutationObserver();
```

**Объяснение:** Эти вызовы инициализируют все новые функции, которые мы добавили для улучшения работы на мобильных устройствах.

#### 5.2 Сделаем метод для адаптации канваса. Добавьте метод initResizeHandler() и после него initOrientationHandler()
для оптимизации canvas
```javascript
resizeCanvas() {
        const container = this.canvas.parentElement;
        if (!container) return;

        // Получаем размеры контейнера
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        if (containerWidth > 0 && containerHeight > 0) {
            // Сохраняем старые размеры для проверки
            const oldWidth = this.screenWidth;
            const oldHeight = this.screenHeight;
            
            this.screenWidth = containerWidth;
            this.screenHeight = containerHeight;
            this.canvas.width = containerWidth;
            this.canvas.height = containerHeight;

            console.log('Canvas resized from', oldWidth, 'x', oldHeight, 'to', this.screenWidth, 'x', this.screenHeight);

            // Если герой уже существует, обновляем камеру сразу
            if (this.hero) {
                this.updateCamera();
            }
        }
    }
```

И далее добавляем другие вспомогательные методы

```javascript
 initResizeHandler() {
        // Используем throttle для оптимизации
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

```

После метода `initResizeHandler()` добавьте этот код:

```javascript
// Обработчик поворота экрана (для мобильных устройств)
initOrientationHandler() {
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            if (this.isRunning) {
                this.resizeCanvas(); // Пересчитываем размеры канваса
            }
        }, 200); // Ждём 200мс, чтобы браузер успел повернуться
    });
}
```

**Объяснение:** Когда пользователь поворачивает телефон, размер экрана меняется. Этот метод пересчитывает размер канваса, чтобы игра правильно отображалась.

#### 5.3 Добавьте метод initMutationObserver()

После `initOrientationHandler()` добавьте этот код:

```javascript
// Наблюдатель за изменениями DOM
initMutationObserver() {
    // MutationObserver следит за изменениями в DOM-дереве
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // Если изменился класс у экрана арены (стал активным)
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const screenArena = document.getElementById('screenArena');
                if (screenArena && screenArena.classList.contains('active') && this.isRunning) {
                    // Когда экран арены становится видимым, пересчитываем размеры
                    setTimeout(() => {
                        this.resizeCanvas();
                    }, 50);
                }
            }
        });
    });

    const screenArena = document.getElementById('screenArena');
    if (screenArena) {
        // Начинаем следить за изменениями атрибута class
        observer.observe(screenArena, { attributes: true });
    }
}
```

**Объяснение:** Этот хитрый метод нужен, чтобы канвас правильно ресайзился, когда мы переключаемся на экран арены. Без него на некоторых устройствах канвас мог быть слишком маленьким.

#### 5.4 Добавьте метод updateSkillSlots()

После метода `updateUI()` добавьте этот код:

```javascript
// Обновление слотов навыков на панели арены
updateSkillSlots() {
    const skillSlots = document.querySelectorAll('.skill-slot');
    if (!skillSlots.length || !this.hero || !this.hero.heroData) return;

    const learnedSkills = this.hero.heroData.learnedSkills || [];

    // Очищаем все слоты
    skillSlots.forEach(slot => {
        slot.innerHTML = '';
        slot.classList.remove('active');
    });

    // Если нет навыков, ничего не делаем
    if (learnedSkills.length === 0) return;

    // Заполняем слоты иконками изученных навыков
    learnedSkills.forEach((skillId, index) => {
        if (index < skillSlots.length) {
            const skill = window.GameState.skillManager?.skills.find(s => s.id === skillId);
            if (skill) {
                skillSlots[index].innerHTML = skill.icon;
                skillSlots[index].classList.add('active');
                skillSlots[index].title = skill.name; // Всплывающая подсказка
            }
        }
    });
}
```

**Объяснение:** Когда герой изучает новый навык, его иконка появляется в одном из слотов на панели арены. Этот метод обновляет эти слоты.

#### 5.5 Вызовите updateSkillSlots() в методе updateUI()

В методе `updateUI()` найдите место, где обновляется таймер, и **после него** добавьте:

```javascript
// Обновляем слоты навыков
this.updateSkillSlots();
```

#### 5.6 Улучшите метод checkSkillChoice()

Найдите метод `checkSkillChoice()` и **замените** его на этот улучшенный код:

```javascript
// Проверка, нужно ли показать окно выбора навыка
checkSkillChoice() {
    if (!this.hero || !this.hero.heroData || this.skillChoiceShown) {
        return;
    }
    
    // Проверяем, есть ли ожидающий уровень для выбора навыка
    const hasPending = this.hero.heroData.pendingSkillLevel > 0;
    
    if (hasPending) {
        console.log(`%c🆕 ОБНАРУЖЕН НАВЫК! Уровень: ${this.hero.heroData.pendingSkillLevel}`, 'color: #4aff4a; font-size: 14px; font-weight: bold');
        
        // Ставим флаг, что окно уже показано (чтобы не показывать снова)
        this.skillChoiceShown = true;
        this.pause(); // Ставим игру на паузу
        
        // Получаем 3 случайных навыка, доступных герою
        const skills = window.GameState.skillManager.getRandomSkillsForHero(
            this.hero.heroData, 
            this.hero.heroData.pendingSkillLevel
        );
        
        console.log('Доступные навыки:', skills.map(s => s.name));
        
        // Показываем окно выбора через небольшую задержку
        setTimeout(() => {
            if (window.ui) {
                console.log('Показываем окно выбора навыка');
                window.ui.showSkillChoice(this.hero.heroData, skills);
            } else {
                console.error('❌ UI не найден!');
                // Если что-то пошло не так, сбрасываем флаги и продолжаем
                this.skillChoiceShown = false;
                this.hero.heroData.pendingSkillLevel = 0;
                this.resume();
            }
        }, 500);
    }
}
```

---

### Шаг 6: Обновляем GameEntity.js

Откройте файл `js/arena/GameEntity.js`. Нам нужно обновить несколько классов.

#### 6.1 Обновите класс ArenaEntity

Найдите класс `ArenaEntity` и **замените** его на этот код:

```javascript
// Базовый класс для всех сущностей на арене
class ArenaEntity {
    constructor(worldX, worldY, radius, color = '#ffffff') {
        this.worldX = worldX;          // Координаты в мире
        this.worldY = worldY;
        this.radius = radius || 20;     // Радиус для коллизий
        this.vx = 0;                    // Скорость по X
        this.vy = 0;                    // Скорость по Y
        this.speed = 0;                  // Базовая скорость
        this.color = color;
        this.isActive = true;
        
        // Для анимации
        this.animationTimer = 0;
        this.animationFrame = 0;
        this.hitEffect = 0;              // Эффект получения урона (0-1)
        this.bobOffset = 0;               // Смещение для подпрыгивания
        this.bobSpeed = 8;                 // Скорость подпрыгивания
        
        // Спрайт менеджер
        this.spriteManager = window.spriteManager;
    }
    
    // Получить X на экране с учётом камеры
    getScreenX(cameraX) {
        return this.worldX - cameraX;
    }
    
    // Получить Y на экране с учётом камеры
    getScreenY(cameraY) {
        return this.worldY - cameraY;
    }
    
    // Обновление позиции и анимации
    update(deltaTime, worldWidth, worldHeight) {
        // Двигаем сущность
        this.worldX += this.vx * this.speed * deltaTime * 60;
        this.worldY += this.vy * this.speed * deltaTime * 60;
        
        // Не даём выйти за границы мира
        this.worldX = Math.max(this.radius, Math.min(worldWidth - this.radius, this.worldX));
        this.worldY = Math.max(this.radius, Math.min(worldHeight - this.radius, this.worldY));
        
        // Анимация подпрыгивания при движении
        if (this.vx !== 0 || this.vy !== 0) {
            this.animationTimer += deltaTime * this.bobSpeed;
            this.bobOffset = Math.sin(this.animationTimer) * 3; // Подпрыгивание на 3 пикселя
        } else {
            this.bobOffset = 0;
        }
        
        // Уменьшаем эффект получения урона
        if (this.hitEffect > 0) {
            this.hitEffect -= deltaTime;
        }
    }
    
    draw(ctx, cameraX, cameraY) {
        // Будет переопределено в наследниках
    }
}
```

**Что изменилось:**
1. **Анимация подпрыгивания** — добавили `bobOffset` и `bobSpeed`
2. **Эффект получения урона** — добавили `hitEffect`
3. **Спрайт менеджер** — теперь сущности могут использовать спрайты

#### 6.2 Обновите конструктор ArenaHero

Найдите конструктор класса `ArenaHero` и **замените** его на этот код:

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
    
    this.expMagnet = 150;                 // Радиус притягивания опыта
    this.weapons = [];
    this.skillEffects = [];
    
    // Тип героя
    this.heroType = heroData.type;
    
    // Ключ спрайта для героя (warrior, archer, mage, rogue)
    this.spriteKey = this.heroType;

    // Загружаем оружие
    this.loadWeapons();

    // Для анимации
    this.animationFrame = 0;
    this.lastAttackTime = 0;
    this.bobSpeed = 10; // Герой подпрыгивает быстрее

    // Специальные способности для разных классов
    this.traps = [];                     // Ловушки для разбойника
    this.trapCooldown = 0;
    this.trapInterval = 5;                // Ловушка каждые 5 секунд

    this.magicBeam = null;                // Магический луч для мага
    this.magicCooldown = 0;
    this.magicInterval = 8;                // Магия каждые 8 секунд

    // Расходники в бою (зелья)
    this.battleConsumables = [];
    this.loadConsumables();

    // Убеждаемся, что у heroData есть массив для навыков
    if (!this.heroData.learnedSkills) {
        this.heroData.learnedSkills = [];
    }
}
```

Так же реализуем методы для подгрузки инвентаря в бою

```javascript
loadWeapons() {
        if (this.heroData.equipment && this.heroData.equipment.weapon) {
            this.weapons.push(new ArenaWeapon(this, this.heroData.equipment.weapon));
        } else {
            this.weapons.push(new ArenaWeapon(this, {
                name: 'Кулаки',
                damage: 5,
                range: 60,
                cooldown: 0.5,
                type: 'melee',
                icon: '👊'
            }));
        }
    }

    loadConsumables() {
        // Загружаем расходники из инвентаря (первые 3)
        if (this.heroData.inventory) {
            const consumables = this.heroData.inventory.filter(item => item && item.type === 'consumable');
            this.battleConsumables = consumables.slice(0, 3).map(item => ({ ...item }));
        }
    }
    
    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
        
        // Визуальная обратная связь
        this.color = '#ff0000';
        setTimeout(() => this.color = '#4aff4a', 100);
        
        return this.hp <= 0;
    }
    
    update(deltaTime, worldWidth, worldHeight) {
        super.update(deltaTime, worldWidth, worldHeight);
        
        // Обновляем оружие
        this.weapons.forEach(w => w.update(deltaTime));
        
        // Анимация
        this.animationFrame += deltaTime * 10;
    }
```

#### 6.3 Добавте метод draw() в ArenaHero

В конце вставьте новый метод отрисовки `draw()` класса `ArenaHero` :

```javascript
draw(ctx, cameraX, cameraY) {
    const screenX = this.getScreenX(cameraX);
    const screenY = this.getScreenY(cameraY) + this.bobOffset; // Добавляем подпрыгивание
    
    // Не рисуем, если сущность за пределами экрана
    if (screenX + this.radius < 0 || screenX - this.radius > ctx.canvas.width ||
        screenY + this.radius < 0 || screenY - this.radius > ctx.canvas.height) {
        return;
    }
    
    ctx.save();
    
    // Эффект получения урона (красная вспышка)
    if (this.hitEffect > 0) {
        ctx.globalAlpha = 0.7;
        ctx.filter = 'brightness(1.5)';
    }
    
    // Получаем спрайт героя
    let sprite = this.spriteManager ? this.spriteManager.getSprite(this.spriteKey) : null;
    
    if (sprite) {
        // Небольшой наклон при движении для эффекта бега
        if (this.vx !== 0 || this.vy !== 0) {
            ctx.translate(screenX, screenY);
            ctx.rotate(Math.sin(this.animationTimer * 2) * 0.03);
            ctx.translate(-screenX, -screenY);
        }
        
        // Рисуем спрайт
        ctx.drawImage(sprite, screenX - 24, screenY - 24, 48, 48);
    } else {
        // Если спрайта нет, рисуем цветной круг
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
    
    // Расходники (зелья)
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

Добавим методы заработка опыта и повышения уровня в бою если еще не сделали этого ранее 

```javascript
 addExp(amount) {
        this.exp += amount;
        while (this.exp >= 100) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.level++;
        this.exp -= 100;
        
        this.maxHp += 10;
        this.hp = this.maxHp;
        this.attack += 2;
        
        this.heroData.level = this.level;
        this.heroData.exp = this.exp;
        this.heroData.baseStats.hp = this.maxHp;
        this.heroData.baseStats.attack = this.attack;
    }
```

#### 6.4 Обновите класс ArenaEnemy

В методе `update()` класса `ArenaEnemy` найдите место, где обрабатывается замедление, и добавьте:

```javascript
// Добавьте в начало метода update():
if (this.slowed) {
    this.slowTimer -= deltaTime;
    if (this.slowTimer <= 0) {
        this.slowed = false;
        this.speed *= 2;          // Возвращаем нормальную скорость
        this.bobSpeed *= 2;       // Возвращаем нормальную скорость анимации
    }
}
```

#### 6.5 Обновите метод draw() в ArenaEnemy

Найдите метод `draw()` класса `ArenaEnemy` и **замените** его на этот код:

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
        // Если спрайта нет, рисуем цветной круг
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

---

### Шаг 7: Обновляем Hero.js

Откройте файл `js/core/Hero.js`. Нам нужно улучшить два метода.

#### 7.1 Улучшите метод addExp()

Найдите метод `addExp()` и **замените** его на этот код:

```javascript
    // В классе ArenaHero замените метод addExp на этот:
    addExp(amount) {
        this.exp += amount;
        console.log(`Получено опыта: ${amount}, всего: ${this.exp}`);
        
        // Проверяем, достаточно ли опыта для повышения уровня
        while (this.exp >= 100) {
            this.levelUp();
        }
    }
```

**Что изменилось:** Добавили цикл `while` вместо `if`, чтобы герой мог повысить несколько уровней сразу, если получил много опыта.

#### 7.2 Улучшите метод levelUp()

Найдите метод `levelUp()` и **замените** его на этот код:

```javascript
// Повышение уровня
    levelUp() {
        this.level++;
        this.exp -= 100;
        
        this.maxHp += 10;
        this.hp = this.maxHp;
        this.attack += 2;
        
        // Обновляем данные героя
        this.heroData.level = this.level;
        this.heroData.exp = this.exp;
        this.heroData.baseStats.hp = this.maxHp;
        this.heroData.baseStats.attack = this.attack;
        
        // Проверяем, нужно ли дать навык (каждые 3 уровня)
        if (this.level % 3 === 0) {
            console.log(`🏆 Достигнут уровень ${this.level}! Можно выбрать навык.`);
            this.heroData.pendingSkillLevel = this.level;
        }
        
        console.log(`Уровень повышен до ${this.level}!`);
    }
```

**Что изменилось:**
1. **Яркое сообщение** — теперь видно, когда можно выбрать навык
2. **skillPoints** — добавили счётчик очков навыков (понадобится в будущем)

---

### Шаг 8: Доработаем отображения классов Арены и обновляем arena_style.css

Нужно дополнить метод обновления визуальных элементов в скрипте UIManager.js, 
найдите метод updateUI() и checkSkillChoice(), замените их полностью.

```javascript
// В классе SurvivorsArena замените метод updateUI на этот:
updateUI() {
    // Проверяем, что все элементы существуют
    const hpEl = document.getElementById('arenaHp');
    const maxHpEl = document.getElementById('arenaMaxHp');
    const attackEl = document.getElementById('arenaAttack');
    const levelEl = document.getElementById('arenaLevel');
    const timerEl = document.getElementById('arenaTimer');
    const expBar = document.getElementById('expProgressBar');
    const expText = document.getElementById('expText');
    
    if (hpEl) hpEl.textContent = Math.floor(this.hero.hp);
    if (maxHpEl) maxHpEl.textContent = this.hero.maxHp;
    if (attackEl) attackEl.textContent = this.hero.attack;
    if (levelEl) levelEl.textContent = this.hero.level;
    
    const minutes = Math.floor(this.gameTime / 60);
    const seconds = Math.floor(this.gameTime % 60);
    if (timerEl) timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Обновляем прогресс-бар опыта
    if (expBar && expText) {
        const expPercent = (this.hero.exp / 100) * 100;
        expBar.style.width = Math.min(expPercent, 100) + '%';
        expText.textContent = `${this.hero.exp}/100`;
    }

    this.updateSkillSlots();
    this.checkSkillChoice(); // Проверяем, не пора ли выбрать навык
}

// В классе UIManager, найдите метод showSkillChoice и замените его на этот:

showSkillChoice(hero, skills) {
    console.log('showSkillChoice вызван с навыками:', skills);
    const modal = document.getElementById('heroModal');
    const modalBody = document.getElementById('modalBody');

    // Проверяем, есть ли модальное окно
    if (!modal || !modalBody) {
        console.error('Модальное окно не найдено!');
        if (window.currentArena) {
            window.currentArena.skillChoiceShown = false;
            window.currentArena.resume();
        }
        return;
    }

    // Если нет доступных навыков, просто продолжаем игру
    if (!skills || skills.length === 0) {
        console.log('Нет доступных навыков, продолжаем игру');
        hero.pendingSkillLevel = 0;
        if (window.currentArena) {
            window.currentArena.skillChoiceShown = false;
            window.currentArena.resume();
        }
        return;
    }

    // Создаём HTML для модального окна с 3 навыками
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
        // Преобразуем эффекты навыка в читаемый текст
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

После добавьте метод для взаимодействия с карточками навыков во время выбора
навыка в бою в момент повышения каждого третьего уровня.
```javascript
setupSkillChoiceCards(hero, modal) {
    const skillCards = document.querySelectorAll('.skill-choice-card');
    console.log('Найдено карточек навыков:', skillCards.length);
    
    skillCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const skillId = card.dataset.skillId;
            console.log('Клик по навыку:', skillId);
            
            // Изучаем навык
            const success = window.GameState.skillManager.learnSkill(hero, skillId);
            
            if (success) {
                console.log('Навык успешно изучен!');
                
                // Сбрасываем ожидающий уровень
                hero.pendingSkillLevel = 0;
                
                // Закрываем модальное окно
                modal.style.display = 'none';
                
                // Обновляем отображение героя на арене
                if (window.currentArena) {
                    window.currentArena.skillChoiceShown = false;
                    window.currentArena.resume();
                    
                    // Обновляем слоты навыков
                    window.currentArena.updateSkillSlots();
                }
                
                // Показываем уведомление
                this.showNotification('✅ Навык изучен!');
            } else {
                console.error('Не удалось изучить навык');
                this.showNotification('❌ Ошибка при изучении навыка', 'error');
            }
        });
        
        // Добавляем эффект наведения
        card.addEventListener('mouseenter', () => {
            card.style.borderColor = '#e94560';
            card.style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.borderColor = '#0f3460';
            card.style.transform = 'scale(1)';
        });
    });
}
```


Откройте файл `arena_style.css` и **замените** эти стили на прежние:

```css
/* ========== НОВЫЕ СТИЛИ ДЛЯ ВЕРСИИ 6 ========== */

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

/* Верхняя панель с информацией */
.arena-header {
    background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1f 100%);
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #e94560;
    flex-shrink: 0;
    z-index: 10;
}

/* Статистика на арене */
.arena-stats {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    align-items: center;
    flex: 1;
}

.arena-stats .stat {
    background: #16213e;
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 5px;
}

/* Прогресс бары */
.progress-bar-container {
    background: #16213e;
    padding: 5px 15px;
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
    background: linear-gradient(90deg, #4aff4a, #00aa00);
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

/* Кнопка паузы */
.pause-btn {
    background: #e94560;
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

/* Canvas для игры - занимает все доступное пространство */
#gameCanvas {
    display: block;
    width: 100%;
    flex: 1;
    background: #000;
    object-fit: cover; /* Растягивается на всю доступную область */
    min-height: 0; /* Важно для flexbox */
}

/* Джойстик для мобильных устройств - по умолчанию скрыт */
.joystick-container {
    display: none;
    position: absolute;
    bottom: 30px;
    left: 30px;
    width: 120px;
    height: 120px;
    z-index: 20;
}

/* Показываем джойстик только на мобильных устройствах и планшетах */
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

/* Меню паузы */
.pause-menu {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.95);
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    z-index: 30;
    border: 2px solid #e94560;
    min-width: 300px;
}

.pause-menu h3 {
    color: #e94560;
    margin-bottom: 20px;
    font-size: 24px;
}

.pause-menu button {
    width: 100%;
    margin: 10px 0;
    padding: 12px;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.resume-btn {
    background: #4aff4a;
    color: #000;
}

.resume-btn:hover {
    background: #6aff6a;
}

.exit-arena-btn {
    background: #e94560;
    color: white;
}

.exit-arena-btn:hover {
    background: #ff6b8b;
}

/* Навыки на арене */
.arena-skills {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.skill-slot {
    background: #16213e;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    position: relative;
    border: 1px solid #0f3460;
}

.skill-slot.active {
    border-color: #e94560;
    box-shadow: 0 0 10px rgba(233, 69, 96, 0.5);
}

.skill-cooldown {
    position: absolute;
    bottom: -5px;
    right: -5px;
    background: #e94560;
    color: white;
    font-size: 10px;
    padding: 2px 4px;
    border-radius: 10px;
    min-width: 16px;
    text-align: center;
}

/* Адаптация для мобильных устройств */
@media (max-width: 768px) {
    .arena-stats {
        gap: 10px;
    }
    
    .progress-bar-container {
        min-width: 150px;
    }
    
    .arena-stats .stat {
        padding: 3px 10px;
        font-size: 0.9rem;
    }
    
    .joystick-container {
        width: 100px;
        height: 100px;
        bottom: 20px;
        left: 20px;
    }
    
    .joystick-thumb {
        width: 40px;
        height: 40px;
    }
}

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

/* Улучшенные стили для статистики */
#arenaKills {
    font-weight: bold;
    color: #ffd700;
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

Так же добавим метод для реализации нового меню инвенторя в UIManager в конце файла

```javascript
showEquipMenu(hero, item) {
        const validSlots = hero.getValidSlotsForItem(item);
        const modal = document.getElementById('heroModal');
        const modalBody = document.getElementById('modalBody');

        if (validSlots.length === 0) {
            alert('Этот предмет нельзя экипировать данному герою');
            return;
        }

        modalBody.innerHTML = `
            <h2 style="color: #e94560; margin-bottom: 20px;">Экипировка предмета</h2>
            <div style="text-align: center; margin: 20px 0;">
                <div style="font-size: 4rem;">${item.icon || '📦'}</div>
                <h3 style="color: #fff; margin: 10px 0;">${item.name}</h3>
                <p style="color: #aaa;">${item.description || ''}</p>
            </div>
            
            <h3 style="color: #4aff4a; margin-bottom: 10px;">Выберите слот для экипировки:</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 20px 0;">
                ${validSlots.map(slot => `
                    <button class="equip-slot-btn" data-slot="${slot}" style="background: #16213e; padding: 15px; border: 2px solid #0f3460; color: white; cursor: pointer; border-radius: 5px;">
                        ${slot.charAt(0).toUpperCase() + slot.slice(1)}
                        ${hero.equipment[slot] ? `<br><small style="color: #ffaa00;">(занято: ${hero.equipment[slot].name})</small>` : ''}
                    </button>
                `).join('')}
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
                <button id="cancelEquipBtn" style="width: auto; padding: 10px 30px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer;">Отмена</button>
            </div>
        `;

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
```

---

### Шаг 9: Проверяем порядок подключения скриптов в index.html

Это **самый важный шаг!** Если скрипты подключены в неправильном порядке, игра не будет работать.

Откройте файл `index.html` и найдите секцию со скриптами. Она должна выглядеть **точно так**:

```html
<!-- Core классы -->
<script src="js/core/GameState.js"></script>
<script src="js/core/Item.js"></script>
<script src="js/core/Hero.js"></script>
<script src="js/core/Shop.js"></script>
<script src="js/core/Recipe.js"></script>
<script src="js/core/Skill.js"></script>

<!-- Классы арены - ВАЖНО: GameEntity.js должен быть ПЕРВЫМ среди арены -->
<script src="js/arena/GameEntity.js"></script>      <!-- Сначала GameEntity (определяет ArenaHero) -->
<script src="js/arena/SpriteManager.js"></script>
<script src="js/arena/SurvivorsArena.js"></script>  <!-- Потом SurvivorsArena (использует ArenaHero) -->
<script src="js/arena/ArenaController.js"></script>

<!-- UI -->
<script src="js/ui/UIManager.js"></script>
<script src="js/game.js"></script>
```

А так же убедитесь что ваш 5 экран выглядит именно так

```html
<div class="screen" id="screenArena">
                <div class="arena-game-container">
                    <!-- Верхняя панель с информацией -->
                    <div class="arena-header">
                        <div class="arena-stats">
                            <div class="stat">❤️ <span id="arenaHp">100</span>/<span id="arenaMaxHp">100</span></div>
                            <div class="stat">⚔️ <span id="arenaAttack">15</span></div>
                            <div class="stat">⏱️ <span id="arenaTimer">0:00</span></div>
                            <div class="stat">🎯 Ур. <span id="arenaLevel">1</span></div>
                        </div>
                        
                        <!-- Добавляем прогресс-бар опыта -->
                        <div class="progress-bar-container">
                            <div class="progress-bar">
                                <div class="progress-bar-fill" id="expProgressBar" style="width: 0%"></div>
                                <span class="progress-text" id="expText">0/100</span>
                            </div>
                        </div>
                        
                        <!-- Добавляем слоты навыков -->
                        <div class="arena-skills" id="arenaSkills">
                            <div class="skill-slot" id="skillSlot1"></div>
                            <div class="skill-slot" id="skillSlot2"></div>
                            <div class="skill-slot" id="skillSlot3"></div>
                            <div class="skill-slot" id="skillSlot4"></div>
                            <div class="skill-slot" id="skillSlot5"></div>
                        </div>
                        
                        <button class="pause-btn" id="pauseBtn">⏸️</button>
                    </div>

                    <!-- Canvas для игры -->
                    <canvas id="gameCanvas" width="800" height="600"></canvas>

                    <!-- Джойстик для мобильных устройств -->
                    <div class="joystick-container" id="joystickContainer">
                        <div class="joystick-base">
                            <div class="joystick-thumb" id="joystickThumb"></div>
                        </div>
                    </div>

                    <!-- Пауза/меню выхода -->
                    <div class="pause-menu" id="pauseMenu" style="display: none;">
                        <h3>Пауза</h3>
                        <button class="resume-btn" id="resumeBtn">Продолжить</button>
                        <button class="exit-arena-btn" id="exitArenaBtn">Выйти с арены</button>
                    </div>
                </div>
            </div>
```

**Почему важен порядок:**
- `GameEntity.js` определяет класс `ArenaHero`
- `SurvivorsArena.js` использует класс `ArenaHero` в методе `init()`
- Если `SurvivorsArena.js` загрузится раньше, будет ошибка `ArenaHero is not defined`

---

## ✅ Тестирование

После внесения всех изменений, запустите игру и проверьте:

### Проверка загрузки
- [ ] При запуске появляется индикатор "Загрузка спрайтов..."
- [ ] В консоли видны сообщения о загрузке PNG-файлов
- [ ] В конце загрузки появляется уведомление "✅ Спрайты загружены!"

### Проверка героев в меню
- [ ] В меню "Герои" у каждого героя есть аватарка (картинка)
- [ ] У всех 4 героев разные аватарки
- [ ] Под карточкой героя есть иконки навыков (пока пусто)

### Проверка начала боя
- [ ] При нажатии "Начать" на любой локации, открывается экран арены
- [ ] В консоли нет ошибок
- [ ] Герой виден на арене (зелёный круг или спрайт)

### Проверка спрайтов на арене
- [ ] Герой имеет спрайт (не цветной круг)
- [ ] Враги имеют разные спрайты
- [ ] Кристаллы опыта жёлтые

### Проверка анимаций
- [ ] Герой подпрыгивает при движении
- [ ] Враги подпрыгивают при движении
- [ ] При получении урона есть красная вспышка

### Проверка навыков
- [ ] Поднимите героя до 3 уровня (убейте несколько врагов)
- [ ] На 3 уровне игра останавливается
- [ ] Появляется модальное окно с 3 навыками
- [ ] После выбора навыка, его иконка появляется в слотах на панели

---

## ❗ Решение проблем

### Проблема: "ArenaHero is not defined"
**Причина:** Неправильный порядок подключения скриптов в `index.html`
**Решение:** Проверьте, что `GameEntity.js` загружается **до** `SurvivorsArena.js`

### Проблема: "Identifier 'ArenaTrap' has already been declared"
**Причина:** Класс `ArenaTrap` определён дважды (в двух разных файлах)
**Решение:** Найдите второе определение `class ArenaTrap` и удалите его. Оно должно быть только в `GameEntity.js`

### Проблема: Спрайты не загружаются (404 ошибки в консоли)
**Причина:** Неправильные пути к файлам или отсутствуют сами файлы
**Решение:** 
- Проверьте, что папка `images` лежит в корне проекта (рядом с `index.html`)
- Проверьте названия файлов — они должны точно совпадать с `spritePaths` в `SpriteManager.js`
- Если файлов нет, создайте пустые с правильными названиями (игра создаст заглушки)

### Проблема: Герой не виден на арене
**Причина:** Проблема с камерой или отрисовкой
**Решение:**
- Проверьте, что `this.hero` не `null` в методе `draw()`
- Добавьте временно `console.log('Hero position:', this.hero.worldX, this.hero.worldY)`
- Убедитесь, что `updateCamera()` вызывается после обновления позиции героя

### Проблема: Навыки не появляются
**Причина:** `pendingSkillLevel` не устанавливается или не проверяется
**Решение:**
- Проверьте метод `levelUp()` в `Hero.js` — должен быть `if (this.level % 3 === 0)`
- Проверьте метод `checkSkillChoice()` в `SurvivorsArena.js` — вызывается ли он каждый кадр?
- Добавьте `console.log` чтобы увидеть, когда `hasPending` становится `true`

### Проблема: Модальное окно не закрывается
**Причина:** Проблема с обработчиками событий
**Решение:**
- Проверьте, что у кнопки закрытия есть класс `close-modal`
- Проверьте, что обработчик в `setupSkillChoiceCards()` работает
- Добавьте обработчик клика вне модального окна

### Проблема: Тормоза на мобильных устройствах
**Причина:** Слишком много врагов или эффектов
**Решение:**
- Уменьшите `maxEnemies` в `SurvivorsArena.js` (например, с 40 до 20)
- Убедитесь, что в `update()` нет утечек памяти
- Используйте `throttle` для обработчиков `resize`

---

## 🎯 Самостоятельные задания

Для закрепления материала выполните одно или несколько заданий:

1. **Добавить новые спрайты**
   - Положите свои PNG в папку `images/heroes/`
   - Обновите `spritePaths` в `SpriteManager.js`

2. **Улучшить индикатор загрузки**
   - Добавьте процент загрузки (сколько спрайтов загружено из скольких)
   - Сделайте анимацию вращающегося круга

3. **Анимация появления спрайтов**
   - Добавьте эффект появления (fade-in) при отрисовке новых сущностей
   - Используйте `ctx.globalAlpha`

4. **Кэширование спрайтов**
   - Сохраняйте загруженные спрайты в `localStorage`
   - При повторном запуске загружайте из кэша

5. **Динамическая смена спрайтов**
   - При экипировке оружия меняйте спрайт героя
   - Воин с мечом выглядит иначе, чем с топором

6. **Спрайты для навыков**
   - Добавьте иконки для каждого навыка
   - Отображайте их в слотах на арене

7. **Погодные эффекты**
   - Добавьте частицы (листья, снег) поверх спрайтов
   - Сделайте их зависимыми от локации

8. **Генератор спрайтов**
   - Если PNG не найден, генерируйте спрайт по характеристикам
   - Воин с высоким уровнем выглядит иначе, чем новичок

9. **Смена времени суток**
   - Наложите цветовой фильтр на все спрайты
   - Ночью всё темнее, днём ярче

10. **Анимации атак**
    - Создайте спрайт-листы с кадрами анимации
    - Реализуйте проигрывание анимации при атаке

---

## 🏁 Заключение

Поздравляю! Вы успешно обновили игру до версии 6. Теперь у вас:

- ✅ **Красивые спрайты** из локальных PNG-файлов
- ✅ **Улучшенная боевая система** с 4 классами героев
- ✅ **Стабильная работа** на мобильных устройствах
- ✅ **Визуальные эффекты** для атак и получения урона
- ✅ **Система навыков** с выбором каждые 3 уровня

> [!TIP]
> После тестирования и убедившись, что всё работает, можете смело переходить к версии 0.0.7!

