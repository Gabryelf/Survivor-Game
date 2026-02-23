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

## 📋 Содержание
1. [Что нового в версии 6](#что-нового-в-версии-6)
2. [Новые файлы и структура](#новые-файлы-и-структура)
3. [Ключевые изменения в классах](#ключевые-изменения-в-классах)
   - [Skill.js — новая система навыков](#skilljs--новая-система-навыков)
   - [Hero.js — расширение класса](#herojs--расширение-класса)
   - [SpriteManager.js — загрузка локальных изображений](#spritemanagerjs--загрузка-локальных-изображений)
   - [GameEntity.js — новые боевые классы](#gameentityjs--новые-боевые-классы)
   - [SurvivorsArena.js — улучшения игрового цикла](#survivorsarenajs--улучшения-игрового-цикла)
   - [UIManager.js — интерфейс выбора навыков](#uimanagerjs--интерфейс-выбора-навыков)
   - [game.js — асинхронная загрузка](#gamejs--асинхронная-загрузка)
4. [Пошаговое внедрение](#пошаговое-внедрение)
5. [Тестирование новых возможностей](#тестирование-новых-возможностей)
6. [Задания для самостоятельной работы](#задания-для-самостоятельной-работы)

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

## 📁 Новые файлы и структура

### Новые файлы:
```
js/core/Skill.js              # Классы Skill и SkillManager
js/arena/SpriteManager.js      # Менеджер спрайтов (загрузка изображений)
```

### Новая папка для изображений:
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

### Изменённые файлы:
```
js/core/Hero.js                # Добавлены методы: levelUp(), hasPendingSkill(), calculateDamage()
js/arena/GameEntity.js         # Добавлены: ArenaTrap, MagicBeam, RangedProjectile, MagicProjectile
js/arena/SurvivorsArena.js     # Добавлены: checkSkillChoice(), updateSkillSlots(), специальные атаки
js/ui/UIManager.js             # Добавлены: showSkillChoice(), setupSkillChoiceCards(), getHeroAvatarUrl()
js/game.js                      # Асинхронная загрузка, индикатор прогресса, новый герой
```

---

## 🔍 Ключевые изменения в классах

### 1. SpriteManager.js — загрузка локальных изображений

#### Конструктор и структура данных
```javascript
class SpriteManager {
    constructor() {
        this.sprites = new Map();        // Хранилище загруженных спрайтов
        this.loaded = false;              // Флаг завершения загрузки
        this.loadingPromises = new Map(); // Для отслеживания загрузки
        
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
        };
    }
}
```

**Что изменилось:**
- Используется `Map` вместо обычного объекта для лучшей производительности
- Добавлены вариации врагов (`goblin_1`, `goblin_2`)
- Все пути указывают на локальные PNG-файлы

#### Метод loadSprites() — асинхронная загрузка
```javascript
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
```

**Что изменилось:**
- **Асинхронная загрузка** — использует `async/await`
- **Promise.allSettled** — не прерывает загрузку при ошибках
- **Fallback-механизм** — при ошибке создаётся заглушка

#### Метод loadImage() — загрузка одного спрайта
```javascript
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
```

**Что изменилось:**
- **Canvas-обработка** — изображения преобразуются в canvas для лучшего контроля
- **Сглаживание** — включено для чётких спрайтов
- **Timestamp** — добавляется к URL для избежания кэширования

#### Метод getSprite() — получение спрайта
```javascript
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
```

**Что изменилось:**
- **Вариации врагов** — случайный выбор спрайта для разнообразия
- **Цепочка fallback** — сначала ищет по ключу, потом default_hero, потом создаёт заглушку

#### Метод createFallbackOnDemand() — создание заглушки
```javascript
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
```

**Что изменилось:**
- **Динамическое создание** — если спрайт не загрузился, создаётся на лету
- **Узнаваемый стиль** — красный круг с вопросительным знаком

#### Метод getAvatarUrl() — для HTML-элементов
```javascript
getAvatarUrl(type, seed = null) {
    const path = this.spritePaths[type] || this.spritePaths.default_hero || 'images/default_hero.png';
    return path + '?t=' + Date.now();
}
```

**Что изменилось:**
- **Для UI** — возвращает путь для использования в `<img src="...">`
- **Timestamp** — для избежания кэширования при разработке

---

### 2. game.js — асинхронная инициализация

#### Полностью новый код с загрузчиком
```javascript
document.addEventListener('DOMContentLoaded', async () => {
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
```

**Что изменилось:**
- **Асинхронная загрузка** — игра ждёт загрузки спрайтов
- **Индикатор загрузки** — показывает пользователю процесс
- **Обработка ошибок** — если спрайты не загрузились, использует заглушки

#### Новые вспомогательные функции
```javascript
function showLoadingIndicator(text) {
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
    `;
    loader.textContent = text || 'Загрузка...';
    document.body.appendChild(loader);
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
```

#### Добавлен новый герой
```javascript
const rogue = new window.Hero('4', 'Разбойник', { hp: 90, attack: 16, defense: 8, speed: 18 }, 'rogue');
window.GameState.heroes.push(rogue);
```

#### Добавлены тестовые предметы
```javascript
window.GameState.addToInventory(new window.Weapon('weapon_sword_1', 'Деревянный меч', 'common', 10, { damage: 5, range: 1 }, '⚔️'));
window.GameState.addToInventory(new window.Weapon('weapon_bow_1', 'Короткий лук', 'common', 15, { damage: 7, range: 3 }, '🏹'));
```

---

### 3. UIManager.js — интеграция со SpriteManager

#### Новый метод getHeroAvatarUrl()
```javascript
getHeroAvatarUrl(hero) {
    if (window.spriteManager) {
        return window.spriteManager.getAvatarUrl(hero.type, hero.name);
    }
    // Запасной вариант
    return `images/heroes/${hero.type}.png?t=${Date.now()}`;
}
```

#### Обновлённый renderHeroes() с аватарками
```javascript
renderHeroes() {
    container.innerHTML = '';
    
    window.GameState.heroes.forEach(hero => {
        const avatarUrl = this.getHeroAvatarUrl(hero);
        
        heroCard.innerHTML = `
            <div class="hero-avatar">
                <img src="${avatarUrl}" 
                     alt="${hero.name}" 
                     style="width: 100px; height: 100px; border-radius: 50%; border: 3px solid #e94560;"
                     onerror="this.onerror=null; this.src='images/default_hero.png';">
            </div>
            <h3>${hero.name} (Ур. ${hero.level})</h3>
            <!-- остальное -->
        `;
    });
}
```

**Что изменилось:**
- **Аватарки** — теперь используются реальные PNG из папки `/images`
- **Обработка ошибок** — если изображение не загрузилось, подставляется default_hero.png

---

### 4. GameEntity.js — использование спрайтов

#### В классе ArenaHero
```javascript
class ArenaHero extends ArenaEntity {
    constructor(worldX, worldY, heroData) {
        super(worldX, worldY, 24, '#4aff4a');
        // ...
        this.spriteKey = this.heroType; // 'warrior', 'archer', 'mage', 'rogue'
        this.spriteManager = window.spriteManager;
    }
    
    draw(ctx, cameraX, cameraY) {
        // Получаем спрайт героя
        let sprite = this.spriteManager ? this.spriteManager.getSprite(this.spriteKey) : null;
        
        if (sprite) {
            // Рисуем спрайт
            ctx.drawImage(sprite, screenX - 24, screenY - 24, 48, 48);
        } else {
            // Fallback - цветной круг
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
```

#### В классе ArenaEnemy
```javascript
class ArenaEnemy extends ArenaEntity {
    constructor(worldX, worldY, difficulty) {
        // ...
        this.spriteKey = this.type; // 'goblin', 'skeleton', 'ghost', 'orc'
        this.spriteManager = window.spriteManager;
    }
    
    draw(ctx, cameraX, cameraY) {
        let sprite = this.spriteManager ? this.spriteManager.getSprite(this.spriteKey) : null;
        
        if (sprite) {
            ctx.drawImage(sprite, screenX - 20, screenY - 20, 40, 40);
        } else {
            // Fallback - цветной круг
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
```

#### В классе ExpGem
```javascript
class ExpGem extends ArenaEntity {
    draw(ctx, cameraX, cameraY) {
        let sprite = this.spriteManager ? this.spriteManager.getSprite('expGem') : null;
        
        if (sprite) {
            ctx.drawImage(sprite, screenX - 12, screenY - 12, 24, 24);
        } else {
            // Fallback - жёлтый круг
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
```

**Что изменилось:**
- **Все сущности** теперь пытаются получить спрайт из SpriteManager
- **Единообразная обработка** — если спрайт не найден, используется цветной круг
- **Вариации врагов** — SpriteManager сам выбирает случайный вариант

---

### 5. Остальные изменения (кратко)

#### Skill.js (новый)
```javascript
class Skill {
    constructor(id, name, description, type, heroClasses, levelRequirement, effects, icon = '✨')
    apply(hero) { /* применяет эффекты */ }
}

class SkillManager {
    constructor() { this.skills = []; this.initSkills(); }
    getRandomSkillsForHero(hero, level) { /* возвращает 3 случайных навыка */ }
    learnSkill(hero, skillId) { /* изучает навык */ }
}
```

#### Hero.js (дополнения)
- Добавлены `learnedSkills`, `skillPoints`, `pendingSkillLevel`
- Методы: `hasPendingSkill()`, `calculateDamage()`, `getValidSlotsForItem()`
- Обновлён `levelUp()` с проверкой на навыки каждые 3 уровня

#### SurvivorsArena.js (дополнения)
- Добавлен `skillChoiceShown` для отслеживания показа модального окна
- Метод `checkSkillChoice()` — проверяет, нужно ли показать выбор навыка
- Метод `updateSkillSlots()` — обновляет отображение навыков в интерфейсе

---

## 📝 Пошаговое внедрение

### Шаг 1: Создаём папку для изображений
```
images/
├── heroes/          # warrior.png, archer.png, elementalist.png, assasin.png
├── enemies/         # peasant.png, ronin.png, bandit.png, raider.png
└── items/           # gem_yellow.png, potion_red.png
```

### Шаг 2: Создаём файл SpriteManager.js
1. Создайте `js/arena/SpriteManager.js`
2. Скопируйте код класса SpriteManager
3. Проверьте пути к изображениям

### Шаг 3: Обновляем game.js
1. Добавьте асинхронную загрузку
2. Добавьте индикатор загрузки
3. Добавьте четвёртого героя (разбойник)
4. Добавьте тестовые предметы

### Шаг 4: Создаём Skill.js
1. Создайте `js/core/Skill.js`
2. Добавьте классы Skill и SkillManager
3. Добавьте все навыки в `initSkills()`

### Шаг 5: Обновляем Hero.js
1. Добавьте новые свойства
2. Реализуйте новые методы
3. Обновите `levelUp()` для навыков

### Шаг 6: Обновляем GameEntity.js
1. Добавьте использование спрайтов во всех draw-методах
2. Добавьте новые классы (ArenaTrap, MagicBeam и т.д.)
3. Обновите ArenaHero с новыми методами

### Шаг 7: Обновляем SurvivorsArena.js
1. Добавьте `skillChoiceShown`
2. Реализуйте `checkSkillChoice()` и `updateSkillSlots()`
3. Вызывайте `checkSkillChoice()` в update()

### Шаг 8: Обновляем UIManager.js
1. Добавьте `getHeroAvatarUrl()`
2. Обновите `renderHeroes()` с использованием аватарок
3. Добавьте `showSkillChoice()` и `setupSkillChoiceCards()`
4. Обновите `showHeroInventory()` для экипировки

### Шаг 9: Добавляем стили
В `style.css` добавьте:
```css
/* Индикатор загрузки */
#loadingIndicator {
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
}

/* Карточки навыков */
.skill-choice-card {
    background: #16213e;
    padding: 15px;
    border-radius: 10px;
    text-align: center;
    cursor: pointer;
    border: 2px solid #0f3460;
    transition: all 0.3s;
}

.skill-choice-card:hover {
    border-color: #e94560;
    transform: scale(1.02);
}
```

---

## ‼️ Тестирование новых возможностей

### Проверка загрузки спрайтов
- [ ] При запуске появляется индикатор "Загрузка спрайтов..."
- [ ] В консоли видны сообщения о загрузке
- [ ] Герои отображаются с аватарками в меню
- [ ] На арене герои и враги имеют спрайты

### Проверка вариаций врагов
- [ ] Гоблины и скелеты появляются с разными спрайтами
- [ ] Нет двух одинаковых врагов подряд

### Проверка системы навыков
- [ ] На уровнях 3, 6, 9 появляется модальное окно
- [ ] В окне 3 случайных навыка
- [ ] После выбора навык применяется
- [ ] Навыки отображаются в слотах на арене

### Проверка классов героев
- [ ] Разбойник появился в списке героев
- [ ] У каждого класса своё оружие
- [ ] Маг создаёт лучи, разбойник ставит ловушки

---

## 🎯 Задания для самостоятельной работы

1. **Добавить новые спрайты**
   - Положите свои PNG в папку `images/heroes/`
   - Обновите `spritePaths` в SpriteManager.js

2. **Улучшить индикатор загрузки**
   - Добавьте процент загрузки
   - Лучше всего сделать это на сплошном фоне перекрывая игру

3. **Анимация появления спрайтов**
   - Добавьте эффект появления (fade-in) при отрисовке

4. **Кэширование спрайтов**
   - Сохраняйте загруженные спрайты в localStorage
   - При повторном запуске загружайте из кэша

5. **Динамическая смена спрайтов**
   - При экипировке оружия меняйте спрайт героя
   - Воин с мечом выглядит иначе, чем с топором

6. **Спрайты для навыков**
   - Добавьте иконки для каждого навыка
   - Отображайте их в слотах на арене

7. **Погодные эффекты**
   - Добавьте частицы (листья, снег) поверх спрайтов

8. **Анимации атак**
   - Создайте спрайт-листы с кадрами анимации
   - Реализуйте проигрывание анимации при атаке

9. **Генератор спрайтов**
   - Если PNG не найден, генерируйте спрайт по характеристикам
   - Воин с высоким уровнем выглядит иначе

10. **Смена времени суток**
    - Наложите цветовой фильтр на все спрайты
    - Ночью всё темнее, днём ярче

11. **Редактор спрайтов в игре**
    - Добавьте возможность менять цвета спрайтов
    - Кастомизация героев

---

## 🐛 Возможные проблемы и их решение

| Проблема | Решение |
|----------|---------|
| Спрайты не загружаются | Проверьте пути в `spritePaths` и наличие файлов |
| Изображения слишком большие | SpriteManager сам обрезает их до 64x64 |
| Белый фон вокруг спрайтов | Убедитесь, что PNG с прозрачностью |
| Герой не виден на арене | Проверьте `getSprite()` и `drawImage()` |
| Мерцание спрайтов | Убедитесь, что канвас очищается каждый кадр |
| Индикатор загрузки не исчезает | Проверьте `hideLoadingIndicator()` |
| Навыки не появляются | Проверьте `pendingSkillLevel` в Hero.js |

---

## 📚 Что мы изучили в этой версии

1. **Асинхронная загрузка** — `async/await`, промисы, индикаторы загрузки
2. **Работа с Canvas** — создание и модификация изображений
3. **Управление ресурсами** — кэширование, fallback-механизмы
4. **Интеграция графики** — связь SpriteManager с игровыми сущностями
5. **Пользовательский опыт** — уведомления, индикаторы, обратная связь
6. **Масштабируемость** — легкое добавление новых спрайтов и классов

---

## 🏁 Заключение

В этой версии мы сделали игру **по-настоящему красивой и профессиональной**:

1. 🖼️ **Все спрайты загружаются из локальных PNG** — игра выглядит как надо
2. ⚔️ **4 класса героев** с уникальными способностями
3. 🔥 **Система навыков** с выбором каждые 3 уровня
4. 👌 **Расходники работают в бою**
5. 🎨 **Улучшенный UI** с прогресс-барами и аватарками
