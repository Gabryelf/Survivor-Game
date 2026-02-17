
# 🎮 Arena Survivors — Версия 5: Боевая система и арена

> **Пошаговое руководство по добавлению игровой арены в стиле Vampire Survivors**  
> *В этой версии мы добавим полноценный экран битвы, управление героем, врагов, систему опыта и камеру, следующую за игроком*

---

## 📋 Содержание
1. [Что мы будем делать](#что-мы-будем-делать)
2. [Новые файлы для создания](#новые-файлы-для-создания)
3. [Изменения в существующих файлах](#изменения-в-существующих-файлах)
4. [Пошаговая реализация](#пошаговая-реализация)
   - [Шаг 1: Добавляем стили для арены](#шаг-1-добавляем-стили-для-арены)
   - [Шаг 2: Создаём базовый класс ArenaEntity](#шаг-2-создаём-базовый-класс-arenaentity)
   - [Шаг 3: Создаём класс ArenaHero](#шаг-3-создаём-класс-arenahero)
   - [Шаг 4: Создаём класс ArenaEnemy](#шаг-4-создаём-класс-arenaenemy)
   - [Шаг 5: Создаём классы оружия и снарядов](#шаг-5-создаём-классы-оружия-и-снарядов)
   - [Шаг 6: Создаём SpriteManager](#шаг-6-создаём-spritemanager)
   - [Шаг 7: Создаём главный класс SurvivorsArena](#шаг-7-создаём-главный-класс-survivorsarena)
   - [Шаг 8: Создаём ArenaController](#шаг-8-создаём-arenacontroller)
   - [Шаг 9: Обновляем HTML](#шаг-9-обновляем-html)
   - [Шаг 10: Обновляем game.js](#шаг-10-обновляем-gamejs)
5. [Тестирование](#тестирование)
6. [Задания для самостоятельной работы](#задания-для-самостоятельной-работы)

---

## 🎯 Что мы будем делать

В предыдущей версии у нас были герои, магазин и крафт. Теперь мы добавим **полноценный игровой процесс**:

| Компонент | Описание |
|-----------|----------|
| **Арену в стиле Survivors** | Большой мир, камера следует за героем |
| **Управление WASD/стрелки** | Герой двигается по миру |
| **Враги** | Спавнятся за экраном, бегут к герою |
| **Оружие** | Автоматически атакует врагов |
| **Система опыта** | Кристаллы опыта, повышение уровня |
| **Джойстик для мобилок** | Управление с телефона |
| **Пауза и выход** | Меню паузы, возврат в лобби |

---

## 📁 Новые файлы для создания

Нам нужно создать **5 новых файлов**:

```
js/arena/
├── GameEntity.js        # Базовые классы сущностей на арене
├── SpriteManager.js     # Менеджер спрайтов (создание и хранение)
├── SurvivorsArena.js    # Главный класс арены (игровой цикл)
└── ArenaController.js   # Контроллер для запуска/остановки арены
```

И один новый CSS-файл:
```
arena_style.css          # Стили специально для арены
```

---

## 📝 Пошаговая реализация

### Шаг 1: Добавляем стили для арены (`arena_style.css`)

Создайте файл `arena_style.css` в корневой папке:

```css
/* Survivors-style арена */
.arena-game-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #000;
    position: relative;
}

.arena-header {
    background: rgba(0, 0, 0, 0.8);
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
}

.arena-stats {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.stat {
    color: white;
    font-size: 1.2rem;
}

#gameCanvas {
    flex: 1;
    width: 100%;
    background: #1a1a2e;
    display: block;
    touch-action: none; /* Отключаем скролл на мобилках */
}

.joystick-container {
    position: absolute;
    bottom: 30px;
    left: 30px;
    width: 120px;
    height: 120px;
    z-index: 20;
    display: none; /* Показываем только на мобилках */
}

.joystick-base {
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(5px);
    border: 2px solid rgba(255, 255, 255, 0.3);
}

.joystick-thumb {
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.1s;
}

.pause-menu {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #16213e;
    padding: 30px;
    border-radius: 10px;
    text-align: center;
    z-index: 100;
}

.pause-menu h3 {
    color: white;
    margin-bottom: 20px;
}

.pause-menu button {
    margin: 10px;
    min-width: 150px;
}

/* Для мобильных устройств */
@media (max-width: 768px) {
    .joystick-container {
        display: block;
    }
    
    .arena-stats {
        font-size: 0.9rem;
        gap: 10px;
    }
}
```

**Объяснение:**
- `touch-action: none` на canvas — отключает скролл при касании
- Джойстик появляется только на мобильных (`max-width: 768px`)
- Меню паузы центрируется поверх всего

---

### Шаг 2: Создаём базовый класс ArenaEntity (`js/arena/GameEntity.js`)

Этот файл содержит базовые классы для всех сущностей на арене.

#### 2.1 Базовый класс ArenaEntity

```javascript
// Базовый класс для всех сущностей на арене
class ArenaEntity {
    constructor(x, y, radius, color) {
        this.worldX = x; // Координаты в мире (не на экране!)
        this.worldY = y;
        this.radius = radius;
        this.color = color;
        this.vx = 0;     // Скорость по X (направление)
        this.vy = 0;     // Скорость по Y (направление)
        this.speed = 0;   // Скорость движения
        this.isActive = true;
    }
    
    // Получить экранные координаты с учетом смещения камеры
    getScreenX(cameraX) {
        return this.worldX - cameraX;
    }
    
    getScreenY(cameraY) {
        return this.worldY - cameraY;
    }
    
    update(deltaTime, worldWidth, worldHeight) {
        if (!this.isActive) return;
        
        // Обновление позиции на основе скорости
        this.worldX += this.vx * this.speed * deltaTime;
        this.worldY += this.vy * this.speed * deltaTime;
        
        // Границы мира (не даём выйти за края)
        this.worldX = Math.max(this.radius, Math.min(worldWidth - this.radius, this.worldX));
        this.worldY = Math.max(this.radius, Math.min(worldHeight - this.radius, this.worldY));
    }
    
    draw(ctx, cameraX, cameraY) {
        if (!this.isActive) return;
        
        const screenX = this.getScreenX(cameraX);
        const screenY = this.getScreenY(cameraY);
        
        // Рисуем только если видно на экране (оптимизация)
        if (screenX + this.radius < 0 || screenX - this.radius > ctx.canvas.width ||
            screenY + this.radius < 0 || screenY - this.radius > ctx.canvas.height) {
            return;
        }
        
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}
```

**Ключевые моменты:**
- Разделение на **мировые координаты** и **экранные координаты**
- Камера сдвигает все объекты
- Отсечение невидимых объектов (не рисуем то, что за экраном)

---

### Шаг 3: Класс ArenaHero (добавить в `GameEntity.js`)

```javascript
// Класс героя на арене
class ArenaHero extends ArenaEntity {
    constructor(x, y, heroData) {
        super(x, y, 20, '#4aff4a');
        this.heroData = heroData;        // Ссылка на данные героя из GameState
        this.hp = heroData.currentStats.hp;
        this.maxHp = heroData.baseStats.hp;
        this.attack = heroData.currentStats.attack;
        this.speed = heroData.currentStats.speed * 3; // Скорость передвижения
        
        // Оружие
        this.weapons = [];
        this.loadWeapons();
        
        // Сбор опыта
        this.expMagnet = 150; // Радиус притяжения кристаллов
        this.level = heroData.level;
        this.exp = heroData.exp;
        
        // Для анимации
        this.animationFrame = 0;
        this.lastAttackTime = 0;
        
        // Спрайт менеджер
        this.spriteManager = window.spriteManager;
    }
    
    loadWeapons() {
        // Если у героя есть оружие в экипировке, используем его
        if (this.heroData.equipment && this.heroData.equipment.weapon) {
            this.weapons.push(new ArenaWeapon(this, this.heroData.equipment.weapon));
        } else {
            // Иначе базовое оружие (кулаки)
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
    
    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
        
        // Визуальная обратная связь (красный цвет при получении урона)
        this.color = '#ff0000';
        setTimeout(() => this.color = '#4aff4a', 100);
        
        return this.hp <= 0; // true если герой умер
    }
    
    update(deltaTime, worldWidth, worldHeight) {
        super.update(deltaTime, worldWidth, worldHeight);
        
        // Обновляем оружие
        this.weapons.forEach(w => w.update(deltaTime));
        
        // Анимация
        this.animationFrame += deltaTime * 10;
    }
    
    draw(ctx, cameraX, cameraY) {
        if (!this.isActive) return;
        
        const screenX = this.getScreenX(cameraX);
        const screenY = this.getScreenY(cameraY);
        
        // Получаем спрайт героя (разный для лука и меча)
        const sprite = this.spriteManager.getSprite('hero', 
            this.heroData.equipment && this.heroData.equipment.weapon && 
            this.heroData.equipment.weapon.type === 'ranged' ? 'bow' : 'default'
        );
        
        // Рисуем спрайт
        ctx.drawImage(sprite, screenX - 20, screenY - 20, 40, 40);
        
        // Полоска здоровья
        const hpPercent = this.hp / this.maxHp;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(screenX - 20, screenY - 30, 40, 4);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(screenX - 20, screenY - 30, 40 * hpPercent, 4);
        
        // Имя героя
        ctx.font = '12px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(this.heroData.name, screenX, screenY - 35);
        
        // Рисуем оружие
        this.weapons.forEach(w => w.draw(ctx, cameraX, cameraY));
    }
    
    addExp(amount) {
        this.exp += amount;
        // Каждые 100 опыта - новый уровень
        while (this.exp >= 100) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.level++;
        this.exp -= 100;
        
        // Улучшаем характеристики
        this.maxHp += 10;
        this.hp = this.maxHp;
        this.attack += 2;
        
        // Обновляем данные героя в GameState
        this.heroData.level = this.level;
        this.heroData.exp = this.exp;
        this.heroData.baseStats.hp = this.maxHp;
        this.heroData.baseStats.attack = this.attack;
    }
}
```

---

### Шаг 4: Класс ArenaEnemy (добавить в `GameEntity.js`)

```javascript
// Класс врага на арене
class ArenaEnemy extends ArenaEntity {
    constructor(x, y, difficulty = 1) {
        super(x, y, 18, '#ff4a4a');
        
        this.difficulty = difficulty;
        this.hp = 20 + 5 * difficulty;
        this.maxHp = this.hp;
        this.attack = 3 + 2 * difficulty;
        this.speed = 30 + 8 * difficulty;
        this.expValue = 5 + 5 * difficulty; // Сколько опыта даёт
        
        // Тип врага (разные спрайты)
        const enemyTypes = [
            { name: 'Гоблин', sprite: 'goblin', color: '#0f8a0f', attackSpeed: 1.0 },
            { name: 'Скелет', sprite: 'skeleton', color: '#aaa', attackSpeed: 0.8 },
            { name: 'Призрак', sprite: 'ghost', color: '#aa4aff', attackSpeed: 0.6 },
            { name: 'Орк', sprite: 'goblin', color: '#8B4513', attackSpeed: 1.2 }
        ];
        
        this.type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        this.color = this.type.color;
        this.spriteKey = this.type.sprite;
        this.name = this.type.name;
        
        this.damageCooldown = 0;
        this.damageInterval = this.type.attackSpeed;
        
        this.spriteManager = window.spriteManager;
    }
    
    update(deltaTime, hero, worldWidth, worldHeight) {
        super.update(deltaTime, worldWidth, worldHeight);
        
        if (hero && hero.isActive) {
            // Вектор к герою
            const dx = hero.worldX - this.worldX;
            const dy = hero.worldY - this.worldY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                this.vx = dx / distance; // Направление к герою
                this.vy = dy / distance;
            }
            
            // Атака, если подошли вплотную
            if (distance < this.radius + hero.radius) {
                this.damageCooldown -= deltaTime;
                if (this.damageCooldown <= 0) {
                    hero.takeDamage(this.attack);
                    this.damageCooldown = this.damageInterval;
                }
            }
        }
    }
    
    takeDamage(amount) {
        this.hp -= amount;
        this.color = '#ffffff'; // Белый при получении урона
        setTimeout(() => this.color = this.type.color, 100);
        return this.hp <= 0;
    }
    
    draw(ctx, cameraX, cameraY) {
        if (!this.isActive) return;
        
        const screenX = this.getScreenX(cameraX);
        const screenY = this.getScreenY(cameraY);
        
        // Получаем спрайт врага
        const sprite = this.spriteManager.getSprite(this.spriteKey);
        ctx.drawImage(sprite, screenX - 20, screenY - 20, 40, 40);
        
        // Полоска здоровья
        const hpPercent = this.hp / this.maxHp;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(screenX - 20, screenY - 30, 40, 4);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(screenX - 20, screenY - 30, 40 * hpPercent, 4);
    }
}
```

---

### Шаг 5: Классы оружия и снарядов (добавить в `GameEntity.js`)

```javascript
// Класс оружия на арене
class ArenaWeapon {
    constructor(owner, weaponData) {
        this.owner = owner;           // Кто владеет оружием (герой)
        this.data = weaponData;        // Данные оружия
        this.cooldown = 0;             // Текущее время перезарядки
        this.projectiles = [];          // Созданные снаряды
    }
    
    update(deltaTime) {
        // Уменьшаем кулдаун
        if (this.cooldown > 0) {
            this.cooldown -= deltaTime;
        }
        
        // Если кулдаун прошел - атакуем
        if (this.cooldown <= 0) {
            this.attack();
            this.cooldown = this.data.cooldown || 1.0;
        }
        
        // Обновляем снаряды
        this.projectiles = this.projectiles.filter(p => p.isActive);
        this.projectiles.forEach(p => p.update(deltaTime));
    }
    
    attack() {
        if (this.data.type === 'melee' || !this.data.type) {
            // Ближний бой - создаём область атаки
            this.projectiles.push(new MeleeProjectile(this.owner, this.data));
        } else {
            // Дальний бой - ищем цель и стреляем
            const arena = window.currentArena;
            if (arena && arena.enemies.length > 0) {
                const target = arena.enemies[Math.floor(Math.random() * arena.enemies.length)];
                if (target && target.isActive) {
                    this.projectiles.push(new RangedProjectile(this.owner, this.data, target));
                }
            }
        }
    }
    
    draw(ctx, cameraX, cameraY) {
        this.projectiles.forEach(p => p.draw(ctx, cameraX, cameraY));
        
        // Рисуем кулдаун (круговая шкала)
        if (this.cooldown > 0) {
            const screenX = this.owner.getScreenX(cameraX);
            const screenY = this.owner.getScreenY(cameraY);
            
            ctx.beginPath();
            ctx.arc(screenX, screenY, 30, 0, Math.PI * 2 * (1 - this.cooldown / (this.data.cooldown || 1.0)));
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
}

// Класс снаряда дальнего боя
class RangedProjectile {
    constructor(owner, data, target) {
        this.owner = owner;
        this.worldX = owner.worldX;
        this.worldY = owner.worldY;
        this.data = data;
        this.target = target;
        this.speed = 300;
        this.radius = 6;
        this.isActive = true;
        this.damage = data.damage || 5;
    }
    
    update(deltaTime) {
        if (!this.target || !this.target.isActive) {
            this.isActive = false; // Цель умерла
            return;
        }
        
        // Летим к цели
        const dx = this.target.worldX - this.worldX;
        const dy = this.target.worldY - this.worldY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 10) {
            // Долетели
            this.target.takeDamage(this.damage);
            this.isActive = false;
        } else {
            // Продолжаем движение
            this.worldX += (dx / distance) * this.speed * deltaTime;
            this.worldY += (dy / distance) * this.speed * deltaTime;
        }
    }
    
    draw(ctx, cameraX, cameraY) {
        const screenX = this.worldX - cameraX;
        const screenY = this.worldY - cameraY;
        
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffaa00';
        ctx.fill();
        ctx.shadowColor = '#ff0';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// Класс атаки ближнего боя
class MeleeProjectile {
    constructor(owner, data) {
        this.owner = owner;
        this.data = data;
        this.lifetime = 0.2; // Атака длится 0.2 секунды
        this.isActive = true;
        this.hitEnemies = new Set(); // Каких врагов уже задели
    }
    
    update(deltaTime) {
        this.lifetime -= deltaTime;
        if (this.lifetime <= 0) {
            this.isActive = false;
        }
    }
    
    draw(ctx, cameraX, cameraY) {
        const screenX = this.owner.getScreenX(cameraX);
        const screenY = this.owner.getScreenY(cameraY);
        
        // Рисуем радиус атаки
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.data.range || 60, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

// Класс кристалла опыта
class ExpGem extends ArenaEntity {
    constructor(x, y, value) {
        super(x, y, 10, '#ffd700');
        this.value = value;
        this.spriteManager = window.spriteManager;
        this.floatOffset = 0; // Для анимации парения
        this.floatDir = 1;
    }
    
    update(deltaTime, worldWidth, worldHeight) {
        super.update(deltaTime, worldWidth, worldHeight);
        
        // Анимация парения вверх-вниз
        this.floatOffset += deltaTime * 2 * this.floatDir;
        if (Math.abs(this.floatOffset) > 5) {
            this.floatDir *= -1;
        }
    }
    
    draw(ctx, cameraX, cameraY) {
        if (!this.isActive) return;
        
        const screenX = this.getScreenX(cameraX);
        const screenY = this.getScreenY(cameraY) + this.floatOffset;
        
        const sprite = this.spriteManager.getSprite('expGem');
        ctx.drawImage(sprite, screenX - 10, screenY - 10, 20, 20);
    }
}
```

---

### Шаг 6: Создаём SpriteManager (`js/arena/SpriteManager.js`)

```javascript
// Менеджер спрайтов для загрузки и отображения изображений
class SpriteManager {
    constructor() {
        this.sprites = {};
        this.loaded = false;
        this.loadSprites();
    }
    
    loadSprites() {
        // Создаём спрайты через canvas (в реальном проекте тут были бы PNG)
        this.createHeroSprites();
        this.createEnemySprites();
        this.createEffectSprites();
        this.loaded = true;
        console.log('Спрайты загружены');
    }
    
    createHeroSprites() {
        // Создаём спрайт героя через canvas (временное решение)
        const canvas = document.createElement('canvas');
        canvas.width = 40;
        canvas.height = 40;
        const ctx = canvas.getContext('2d');
        
        // Тело героя
        ctx.fillStyle = '#4aff4a';
        ctx.beginPath();
        ctx.arc(20, 20, 18, 0, Math.PI * 2);
        ctx.fill();
        
        // Глаза
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(14, 15, 4, 0, Math.PI * 2);
        ctx.arc(26, 15, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Зрачки
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(14, 15, 2, 0, Math.PI * 2);
        ctx.arc(26, 15, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Меч
        ctx.fillStyle = '#aaa';
        ctx.fillRect(32, 10, 15, 5);
        ctx.fillRect(44, 5, 5, 15);
        
        this.sprites.hero = canvas;
        
        // Герой с луком
        const canvasBow = document.createElement('canvas');
        canvasBow.width = 40;
        canvasBow.height = 40;
        const ctxBow = canvasBow.getContext('2d');
        
        // Тело
        ctxBow.fillStyle = '#4aff4a';
        ctxBow.beginPath();
        ctxBow.arc(20, 20, 18, 0, Math.PI * 2);
        ctxBow.fill();
        
        // Глаза
        ctxBow.fillStyle = '#fff';
        ctxBow.beginPath();
        ctxBow.arc(14, 15, 4, 0, Math.PI * 2);
        ctxBow.arc(26, 15, 4, 0, Math.PI * 2);
        ctxBow.fill();
        ctxBow.fillStyle = '#000';
        ctxBow.beginPath();
        ctxBow.arc(14, 15, 2, 0, Math.PI * 2);
        ctxBow.arc(26, 15, 2, 0, Math.PI * 2);
        ctxBow.fill();
        
        // Лук
        ctxBow.strokeStyle = '#8B4513';
        ctxBow.lineWidth = 3;
        ctxBow.beginPath();
        ctxBow.arc(30, 15, 10, 0, Math.PI);
        ctxBow.stroke();
        
        this.sprites.heroBow = canvasBow;
    }
    
    createEnemySprites() {
        // Гоблин
        const canvasGoblin = document.createElement('canvas');
        canvasGoblin.width = 40;
        canvasGoblin.height = 40;
        const ctxGoblin = canvasGoblin.getContext('2d');
        
        ctxGoblin.fillStyle = '#0f8a0f';
        ctxGoblin.beginPath();
        ctxGoblin.arc(20, 20, 15, 0, Math.PI * 2);
        ctxGoblin.fill();
        
        // Уши
        ctxGoblin.fillStyle = '#0f8a0f';
        ctxGoblin.beginPath();
        ctxGoblin.arc(10, 10, 8, 0, Math.PI * 2);
        ctxGoblin.arc(30, 10, 8, 0, Math.PI * 2);
        ctxGoblin.fill();
        
        // Глаза
        ctxGoblin.fillStyle = '#ff0';
        ctxGoblin.beginPath();
        ctxGoblin.arc(15, 18, 3, 0, Math.PI * 2);
        ctxGoblin.arc(25, 18, 3, 0, Math.PI * 2);
        ctxGoblin.fill();
        ctxGoblin.fillStyle = '#000';
        ctxGoblin.beginPath();
        ctxGoblin.arc(15, 18, 1, 0, Math.PI * 2);
        ctxGoblin.arc(25, 18, 1, 0, Math.PI * 2);
        ctxGoblin.fill();
        
        this.sprites.goblin = canvasGoblin;
        
        // Скелет
        const canvasSkeleton = document.createElement('canvas');
        canvasSkeleton.width = 40;
        canvasSkeleton.height = 40;
        const ctxSkeleton = canvasSkeleton.getContext('2d');
        
        ctxSkeleton.fillStyle = '#ddd';
        ctxSkeleton.beginPath();
        ctxSkeleton.arc(20, 20, 15, 0, Math.PI * 2);
        ctxSkeleton.fill();
        
        // Глазницы
        ctxSkeleton.fillStyle = '#000';
        ctxSkeleton.beginPath();
        ctxSkeleton.arc(15, 15, 3, 0, Math.PI * 2);
        ctxSkeleton.arc(25, 15, 3, 0, Math.PI * 2);
        ctxSkeleton.fill();
        
        this.sprites.skeleton = canvasSkeleton;
        
        // Призрак
        const canvasGhost = document.createElement('canvas');
        canvasGhost.width = 40;
        canvasGhost.height = 40;
        const ctxGhost = canvasGhost.getContext('2d');
        
        ctxGhost.fillStyle = '#aa4aff';
        ctxGhost.globalAlpha = 0.7;
        ctxGhost.beginPath();
        ctxGhost.arc(20, 20, 15, 0, Math.PI * 2);
        ctxGhost.fill();
        
        ctxGhost.globalAlpha = 1;
        ctxGhost.fillStyle = '#fff';
        ctxGhost.beginPath();
        ctxGhost.arc(15, 15, 3, 0, Math.PI * 2);
        ctxGhost.arc(25, 15, 3, 0, Math.PI * 2);
        ctxGhost.fill();
        
        this.sprites.ghost = canvasGhost;
    }
    
    createEffectSprites() {
        // Кристалл опыта
        const canvasExp = document.createElement('canvas');
        canvasExp.width = 20;
        canvasExp.height = 20;
        const ctxExp = canvasExp.getContext('2d');
        
        ctxExp.fillStyle = '#ffd700';
        ctxExp.beginPath();
        ctxExp.moveTo(10, 2);
        ctxExp.lineTo(18, 10);
        ctxExp.lineTo(10, 18);
        ctxExp.lineTo(2, 10);
        ctxExp.closePath();
        ctxExp.fill();
        
        // Блик
        ctxExp.fillStyle = '#fff';
        ctxExp.beginPath();
        ctxExp.arc(8, 8, 2, 0, Math.PI * 2);
        ctxExp.fill();
        
        this.sprites.expGem = canvasExp;
    }
    
    getSprite(type, variant = 'default') {
        if (type === 'hero') {
            return variant === 'bow' ? this.sprites.heroBow : this.sprites.hero;
        }
        return this.sprites[type] || this.sprites.goblin;
    }
}

window.SpriteManager = SpriteManager;
```

**Объяснение:**
- Мы создаём спрайты программно через Canvas
- В реальном проекте тут были бы загруженные PNG
- Менеджер хранит все спрайты и раздаёт их по запросу

---

### Шаг 7: Создаём главный класс SurvivorsArena (`js/arena/SurvivorsArena.js`)

```javascript
// Основной класс арены в стиле Survivors
class SurvivorsArena {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Размеры канваса (экрана)
        this.screenWidth = 800;
        this.screenHeight = 600;
        this.canvas.width = this.screenWidth;
        this.canvas.height = this.screenHeight;
        
        // Размеры мира (гораздо больше экрана)
        this.worldWidth = 2400;
        this.worldHeight = 1800;
        
        // Камера (следит за героем)
        this.cameraX = 0;
        this.cameraY = 0;
        
        // Состояние игры
        this.isRunning = false;
        this.isPaused = false;
        this.gameTime = 0;
        this.difficulty = 1;
        
        // Сущности
        this.hero = null;
        this.enemies = [];
        this.expGems = [];
        
        // Параметры спавна
        this.spawnTimer = 0;
        this.spawnInterval = 1.5;
        this.maxEnemies = 30;
        
        // Управление
        this.keys = {};
        this.joystick = { active: false, dirX: 0, dirY: 0 };
        
        // Декорации (камни, деревья)
        this.decorations = [];
        this.generateDecorations();
        
        // Время последнего кадра
        this.lastTimestamp = 0;
        
        // Для глобального доступа
        window.currentArena = this;
        
        this.initControls();
    }
    
    generateDecorations() {
        // Создаём декорации по всему миру
        for (let i = 0; i < 50; i++) {
            this.decorations.push({
                x: Math.random() * this.worldWidth,
                y: Math.random() * this.worldHeight,
                type: Math.floor(Math.random() * 3), // 0-дерево, 1-камень, 2-куст
                size: 20 + Math.random() * 30
            });
        }
    }
    
    // Обновление камеры (следит за героем)
    updateCamera() {
        if (!this.hero) return;
        
        // Камера следует за героем, но не выходит за границы мира
        this.cameraX = this.hero.worldX - this.screenWidth / 2;
        this.cameraY = this.hero.worldY - this.screenHeight / 2;
        
        // Ограничиваем камеру границами мира
        this.cameraX = Math.max(0, Math.min(this.worldWidth - this.screenWidth, this.cameraX));
        this.cameraY = Math.max(0, Math.min(this.worldHeight - this.screenHeight, this.cameraY));
    }
    
    init(heroData) {
        console.log('Инициализация арены с героем:', heroData);
        
        // Размещаем героя в центре мира
        this.hero = new ArenaHero(this.worldWidth / 2, this.worldHeight / 2, heroData);
        this.enemies = [];
        this.expGems = [];
        this.gameTime = 0;
        this.difficulty = 1;
        this.spawnTimer = 0;
        
        // Обновляем камеру
        this.updateCamera();
        
        // Создаем начальных врагов
        for (let i = 0; i < 5; i++) {
            this.spawnEnemy();
        }
        
        console.log('Арена инициализирована, врагов:', this.enemies.length);
    }
    
    start() {
        this.isRunning = true;
        this.isPaused = false;
        this.lastTimestamp = performance.now();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
    
    pause() {
        this.isPaused = true;
    }
    
    resume() {
        this.isPaused = false;
        this.lastTimestamp = performance.now();
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
        
        if (!this.isPaused && this.hero) {
            this.update(deltaTime);
        }
        
        this.draw();
        
        requestAnimationFrame((ts) => this.gameLoop(ts));
    }
    
    update(deltaTime) {
        // Обновляем игровое время
        this.gameTime += deltaTime;
        this.difficulty = 1 + Math.floor(this.gameTime / 60) * 0.5;
        
        // Обновляем UI
        this.updateUI();
        
        // Управление героем
        this.handleHeroMovement(deltaTime);
        
        // Обновляем героя (передаём размеры мира)
        this.hero.update(deltaTime, this.worldWidth, this.worldHeight);
        
        // Обновляем камеру
        this.updateCamera();
        
        // Проверяем смерть героя
        if (this.hero.hp <= 0) {
            this.gameOver();
            return;
        }
        
        // Спавн врагов
        this.spawnTimer -= deltaTime;
        if (this.spawnTimer <= 0 && this.enemies.length < this.maxEnemies) {
            this.spawnEnemy();
            this.spawnTimer = this.spawnInterval / this.difficulty;
        }
        
        // Обновляем врагов
        this.enemies = this.enemies.filter(enemy => {
            enemy.update(deltaTime, this.hero, this.worldWidth, this.worldHeight);
            
            // Проверяем попадания от оружия
            this.hero.weapons.forEach(weapon => {
                weapon.projectiles.forEach(projectile => {
                    if (projectile instanceof MeleeProjectile && !projectile.hitEnemies.has(enemy)) {
                        if (this.checkMeleeHit(this.hero, enemy, projectile.data.range || 60)) {
                            enemy.takeDamage(projectile.data.damage || 5);
                            projectile.hitEnemies.add(enemy);
                            
                            if (enemy.hp <= 0) {
                                this.spawnExpGem(enemy.worldX, enemy.worldY, enemy.expValue);
                            }
                        }
                    }
                });
            });
            
            return enemy.hp > 0;
        });
        
        // Обновляем кристаллы опыта
        this.expGems = this.expGems.filter(gem => {
            gem.update(deltaTime, this.worldWidth, this.worldHeight);
            
            const distance = Math.hypot(gem.worldX - this.hero.worldX, gem.worldY - this.hero.worldY);
            if (distance < this.hero.radius + gem.radius + this.hero.expMagnet) {
                this.hero.addExp(gem.value);
                return false;
            }
            return true;
        });
    }
    
    handleHeroMovement(deltaTime) {
        let moveX = 0, moveY = 0;
        
        // Клавиатура
        if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) moveY -= 1;
        if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) moveY += 1;
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) moveX -= 1;
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) moveX += 1;
        
        // Джойстик
        if (this.joystick.active) {
            moveX = this.joystick.dirX;
            moveY = this.joystick.dirY;
        }
        
        if (moveX !== 0 || moveY !== 0) {
            const length = Math.sqrt(moveX * moveX + moveY * moveY);
            this.hero.vx = moveX / length;
            this.hero.vy = moveY / length;
        } else {
            this.hero.vx = 0;
            this.hero.vy = 0;
        }
    }
    
    checkMeleeHit(hero, enemy, range) {
        const distance = Math.hypot(hero.worldX - enemy.worldX, hero.worldY - enemy.worldY);
        return distance < hero.radius + enemy.radius + range;
    }
    
    spawnEnemy() {
        // Спавним врага за пределами видимости камеры
        let x, y;
        const viewMargin = 200;
        
        do {
            x = Math.random() * this.worldWidth;
            y = Math.random() * this.worldHeight;
        } while (
            x > this.cameraX - viewMargin && 
            x < this.cameraX + this.screenWidth + viewMargin &&
            y > this.cameraY - viewMargin && 
            y < this.cameraY + this.screenHeight + viewMargin
        );
        
        const enemy = new ArenaEnemy(x, y, this.difficulty);
        this.enemies.push(enemy);
    }
    
    spawnExpGem(x, y, value) {
        this.expGems.push(new ExpGem(x, y, value));
    }
    
    updateUI() {
        document.getElementById('arenaHp').textContent = Math.floor(this.hero.hp);
        document.getElementById('arenaMaxHp').textContent = this.hero.maxHp;
        document.getElementById('arenaAttack').textContent = this.hero.attack;
        document.getElementById('arenaLevel').textContent = this.hero.level;
        
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = Math.floor(this.gameTime % 60);
        document.getElementById('arenaTimer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    draw() {
        // Очищаем канвас
        this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
        
        // Рисуем фон (траву)
        this.drawBackground();
        
        // Рисуем декорации
        this.drawDecorations();
        
        // Рисуем сетку (для ориентира)
        this.drawGrid();
        
        // Рисуем кристаллы опыта
        this.expGems.forEach(gem => gem.draw(this.ctx, this.cameraX, this.cameraY));
        
        // Рисуем врагов
        this.enemies.forEach(enemy => enemy.draw(this.ctx, this.cameraX, this.cameraY));
        
        // Рисуем героя
        if (this.hero) {
            this.hero.draw(this.ctx, this.cameraX, this.cameraY);
        }
        
        // Рисуем информацию
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`Сложность: ${this.difficulty.toFixed(1)}x`, 10, 30);
        this.ctx.fillText(`Врагов: ${this.enemies.length}`, 10, 50);
    }
    
    drawBackground() {
        // Текстура травы (градиент)
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.screenHeight);
        gradient.addColorStop(0, '#1a4a1a');
        gradient.addColorStop(1, '#2a5a2a');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
    }
    
    drawDecorations() {
        this.decorations.forEach(dec => {
            const screenX = dec.x - this.cameraX;
            const screenY = dec.y - this.cameraY;
            
            if (screenX + dec.size < 0 || screenX - dec.size > this.screenWidth ||
                screenY + dec.size < 0 || screenY - dec.size > this.screenHeight) {
                return;
            }
            
            if (dec.type === 0) { // Дерево
                this.ctx.fillStyle = '#8B4513';
                this.ctx.fillRect(screenX - 5, screenY - dec.size/2, 10, dec.size);
                this.ctx.fillStyle = '#0a8a0a';
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY - dec.size/2 - 10, dec.size/2, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (dec.type === 1) { // Камень
                this.ctx.fillStyle = '#888';
                this.ctx.beginPath();
                this.ctx.ellipse(screenX, screenY, dec.size/2, dec.size/3, 0, 0, Math.PI * 2);
                this.ctx.fill();
            } else { // Куст
                this.ctx.fillStyle = '#2a8a2a';
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY, dec.size/2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }
    
    drawGrid() {
        const cellSize = 80;
        const startX = Math.floor(this.cameraX / cellSize) * cellSize;
        const startY = Math.floor(this.cameraY / cellSize) * cellSize;
        
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let x = startX; x < this.cameraX + this.screenWidth; x += cellSize) {
            const screenX = x - this.cameraX;
            this.ctx.beginPath();
            this.ctx.moveTo(screenX, 0);
            this.ctx.lineTo(screenX, this.screenHeight);
            this.ctx.stroke();
        }
        
        for (let y = startY; y < this.cameraY + this.screenHeight; y += cellSize) {
            const screenY = y - this.cameraY;
            this.ctx.beginPath();
            this.ctx.moveTo(0, screenY);
            this.ctx.lineTo(this.screenWidth, screenY);
            this.ctx.stroke();
        }
    }
    
    togglePause() {
        if (this.isPaused) {
            this.resume();
            document.getElementById('pauseMenu').style.display = 'none';
        } else {
            this.pause();
            document.getElementById('pauseMenu').style.display = 'block';
        }
    }
    
    gameOver() {
        this.isRunning = false;
        alert('💀 Игра окончена! Вы продержались ' + Math.floor(this.gameTime) + ' секунд');
        this.exitArena();
    }
    
    exitArena() {
        this.stop();
        
        // Возвращаемся в лобби
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('screenLobby').classList.add('active');
        document.querySelector('.game-nav').style.display = 'flex';
        
        // Сохраняем прогресс героя
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
                e.preventDefault(); // Отключаем скролл страницы стрелками
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
        
        // Джойстик для мобилок
        const joystickBase = document.querySelector('.joystick-base');
        const joystickThumb = document.getElementById('joystickThumb');
        
        if (joystickBase && joystickThumb) {
            let joystickActive = false;
            
            joystickBase.addEventListener('touchstart', (e) => {
                e.preventDefault();
                joystickActive = true;
                this.joystick.active = true;
            });
            
            joystickBase.addEventListener('touchmove', (e) => {
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
                
                this.joystick.dirX = dx / maxRadius;
                this.joystick.dirY = dy / maxRadius;
            });
            
            joystickBase.addEventListener('touchend', (e) => {
                e.preventDefault();
                joystickActive = false;
                this.joystick.active = false;
                joystickThumb.style.transform = 'translate(0, 0)';
            });
        }
    }
}

window.SurvivorsArena = SurvivorsArena;
```

---

### Шаг 8: Создаём ArenaController (`js/arena/ArenaController.js`)

```javascript
class ArenaController {
    constructor() {
        // Создаём менеджер спрайтов
        window.spriteManager = new SpriteManager();
        this.arena = null;
        this.initEventListeners();
    }
    
    initEventListeners() {
        document.getElementById('pauseBtn').addEventListener('click', () => {
            if (this.arena) {
                this.arena.togglePause();
            }
        });
        
        document.getElementById('resumeBtn').addEventListener('click', () => {
            if (this.arena) {
                this.arena.togglePause();
            }
        });
        
        document.getElementById('exitArenaBtn').addEventListener('click', () => {
            if (this.arena) {
                this.arena.exitArena();
            }
        });
    }
    
    startExpedition(location, hero) {
        if (!hero) {
            alert('Сначала выберите героя в меню "Герои"!');
            return false;
        }
        
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
        
        // Запускаем арену
        this.arena.start();
        
        return true;
    }
}

window.ArenaController = ArenaController;
```

---

### Шаг 9: Обновляем HTML

В `index.html` нужно добавить:

1. Подключение новых CSS-файлов:
```html
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="arena_style.css"> <!-- НОВЫЙ -->
```

2. Новый экран арены внутри `<main class="game-screen">`:

```html
<!-- Экран 5: Арена (Survivors-style) -->
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

3. Подключение новых скриптов (порядок важен!):

```html
<!-- Core классы -->
<script src="js/core/GameState.js"></script>
<script src="js/core/Item.js"></script>
<script src="js/core/Hero.js"></script>
<script src="js/core/Shop.js"></script>
<script src="js/core/Recipe.js"></script>

<!-- Классы арены (НОВЫЕ) -->
<script src="js/arena/GameEntity.js"></script>
<script src="js/arena/SpriteManager.js"></script>
<script src="js/arena/SurvivorsArena.js"></script>
<script src="js/arena/ArenaController.js"></script>

<!-- UI -->
<script src="js/ui/UIManager.js"></script>
<script src="js/game.js"></script>
```

---

### Шаг 10: Обновляем game.js

Замените обработчики кнопок локаций на новый код:

```javascript
// ==============================
// Глобальный файл - точка запуска.
// ==============================

// Создаем героев через класс Hero
const warrior = new window.Hero('1', 'Воин', { hp: 120, attack: 18, defense: 12, speed: 8 }, 'warrior');
const archer = new window.Hero('2', 'Лучник', { hp: 80, attack: 22, defense: 6, speed: 15 }, 'archer');
const mage = new window.Hero('3', 'Маг', { hp: 70, attack: 25, defense: 4, speed: 12 }, 'mage');

// Добавляем тестовые предметы в инвентарь
warrior.addToInventory(new window.Consumable('consumable_hp_small', 'Малое зелье здоровья', 'common', 5, 'heal', 30, '🧪'));
warrior.addToInventory(new window.Weapon('weapon_sword_1', 'Деревянный меч', 'common', 10, { damage: 5, range: 1 }, '⚔️'));

// Добавляем героев в состояние
window.GameState.heroes.push(warrior);
window.GameState.heroes.push(archer);
window.GameState.heroes.push(mage);

// Автоматически выбираем первого героя
window.GameState.selectHero('1');

// Инициализируем магазин
window.GameState.initShop();

// Инициализируем систему крафта
window.GameState.initRecipes();

// Запуск UI
const ui = new window.UIManager();
const arenaController = new window.ArenaController();

// НОВЫЙ ОБРАБОТЧИК: Начало вылазки на арену
document.querySelectorAll('.start-match-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const location = e.target.closest('.location-card').dataset.location;
        const costType = e.target.dataset.costType;
        
        const hero = window.GameState.getCurrentHero();
        
        if (!hero) {
            alert('Сначала выберите героя в меню "Герои"!');
            return;
        }
        
        if (window.GameState.resources[costType] < 1) {
            alert(`Не хватает ${costType}!`);
            return;
        }
        
        // Тратим ресурс
        window.GameState.updateResource(costType, -1);
        
        // Начинаем вылазку
        const started = arenaController.startExpedition(location, hero);
        
        if (!started) {
            // Возвращаем ресурс, если не удалось начать
            window.GameState.updateResource(costType, 1);
        }
    });
});

console.log('Игра запущена! Магазин, крафт и арена инициализированы.');
```

**Важно:** Удалите старые обработчики, которые давали только опыт и материалы. Теперь матч запускает настоящую арену.

---

## 🧪 Тестирование

После всех изменений проверьте:

### Проверка запуска арены
- [ ] Выберите героя
- [ ] Нажмите "Начать" на любой локации
- [ ] Должен открыться экран арены с канвасом
- [ ] Навигация внизу должна исчезнуть

### Проверка управления
- [ ] WASD или стрелки — движение героя
- [ ] Герой не выходит за границы мира
- [ ] Камера следует за героем

### Проверка боя
- [ ] Враги спавнятся и бегут к герою
- [ ] Оружие автоматически атакует (желтый круг)
- [ ] При получении урона герой краснеет
- [ ] При смерти врага выпадает кристалл опыта

### Проверка системы опыта
- [ ] Кристаллы притягиваются к герою
- [ ] При сборе опыта шкала заполняется
- [ ] При достижении 100 опыта — уровень повышается
- [ ] Характеристики растут

### Проверка паузы
- [ ] ESC открывает меню паузы
- [ ] Кнопка "Продолжить" возвращает в игру
- [ ] Кнопка "Выйти с арены" возвращает в лобби

### Проверка мобильного управления
- [ ] На мобильных устройствах появляется джойстик
- [ ] Джойстик работает и двигает героя

---

## 📚 Что мы изучили в этой версии

1. **Игровой цикл** — requestAnimationFrame, deltaTime
2. **Камера и координаты** — мировые vs экранные координаты
3. **Обработка ввода** — клавиатура и тач-события
4. **Оптимизация** — отсечение невидимых объектов
5. **Композиция** — Arena содержит Hero, Enemy, Weapon
6. **Анимация** — простые эффекты (краснение при получении урона)
7. **Мобильная адаптация** — джойстик для телефонов

---

## 🎯 Задания для самостоятельной работы

1. **Добавить новый тип врага**
   - Создайте "Вампира" с красным цветом
   - Добавьте в enemyTypes

2. **Улучшить UI на арене**
   - Добавьте отображение текущего оружия
   - Показывать иконку меча или лука

4. **Разные типы оружия**
   - Сделайте так, чтобы лук стрелял снарядами, а меч бил по площади
   - Реализуйте магический посох с медленной, но мощной атакой

5. **Боссы**
   - Каждые 2 минуты спавнить большого врага с высоким HP
   - Босс даёт много опыта и редкие материалы

6. **Укрытия на арене**
   - Добавьте деревья и камни, за которыми можно прятаться
   - Враги должны обходить препятствия

7. **Сложность по времени**
   - Увеличивайте скорость спавна и характеристики врагов со временем

8. **Разные локации**
   - Лес: зеленые враги, много деревьев
   - Пустыня: желтые враги, меньше препятствий
   - Завод: механические враги, металлические декорации

---

## 🐛 Возможные проблемы и их решение

| Проблема | Решение |
|----------|---------|
| Герой не двигается | Проверьте `handleHeroMovement()` и `keys` |
| Враги не спавнятся | Проверьте `spawnTimer` и `spawnEnemy()` |
| Оружие не атакует | Проверьте `update()` в ArenaWeapon |
| Нет спрайтов | Проверьте SpriteManager и `window.spriteManager` |
| Джойстик не работает на телефоне | Проверьте touch-события и `preventDefault()` |
| Вылетает при выходе с арены | Проверьте `exitArena()` и `window.currentArena` |

---

## 🏁 Заключение

Поздравляю! Вы добавили в игру **полноценный игровой процесс в стиле Vampire Survivors**. Теперь игрок может:

1. 🎮 Выбрать героя и начать битву
2. 🏃 Бегать по большому миру с камерой
3. 👾 Убивать врагов, собирать опыт
4. ⬆️ Повышать уровень и становиться сильнее
5. 📱 Играть на телефоне через джойстик

**Следующие шаги:** 
- Добавить больше оружия и типов врагов
- Реализовать выбор умений при повышении уровня
- Создать разные локации с уникальными врагами

---

