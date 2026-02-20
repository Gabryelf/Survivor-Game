[![Итерация 1 - Готова](https://img.shields.io/badge/Итерация_5-Арена_и_Враги-5e3830?style=for-the-badge)](##-итерация-1-скелет-и-навигация)

> [!NOTE]
> Обновлено 20.02.2026

<br>

> [!IMPORTANT]
> Внимательно реализуем каждый класс и метод из руководства, важно ошибки фиксить сразу, что бы потом не запутаться.

<br>

> [!WARNING]
> Не выполненые самостоятельные задания, которые находятся в конце документа - это снижение бала за домашнее задание и возможное снижение итогового бала за зачет.


---

# 🛡️ Arena Survivors v0.0.5: Добавляем боевую арену (Survivors-style)

Привет, команда! В четвертой версии у нас появилась система крафта. Теперь мы добавим **настоящую боевую арену** в стиле Survivors-like игр:

**Что нового:**
- Большой мир (2400x1800), камера следит за героем
- Враги спавнятся волнами, сложность растёт со временем
- Система оружия (ближний и дальний бой)
- Кристаллы опыта, которые выпадают из врагов
- Джойстик для мобильных устройств
- Пауза и выход с арены

**Важно:** Мы не переписываем игру, а **добавляем новые файлы и методы** в существующий код. Каждый шаг — это конкретное место, куда нужно вставить код.

---

## 📁 Новая структура проекта

Мы добавляем новую папку `arena/` с пятью файлами:

```
arena-survivors/
├── index.html
├── style.css
├── arena_style.css (НОВЫЙ)
├── js/
│   ├── core/ ...
│   ├── arena/ (НОВАЯ ПАПКА)
│   │   ├── GameEntity.js (НОВЫЙ)
│   │   ├── SpriteManager.js (НОВЫЙ)
│   │   ├── SurvivorsArena.js (НОВЫЙ)
│   │   └── ArenaController.js (НОВЫЙ)
│   ├── ui/ ...
│   └── game.js (обновляем)
```

---

## 🎨 Шаг 1. Создаём `arena_style.css`

Это новый файл стилей для арены. Создайте его в корневой папке.

```css
/* ==============================
   Survivors-style арена
   ============================== */

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

---

## 📁 Шаг 2. Создаём `js/arena/GameEntity.js`

Этот файл содержит все классы сущностей на арене. Создайте папку `arena` и в ней этот файл.

### Шаг 2.1. Базовый класс ArenaEntity

```javascript
// ==============================
// Базовый класс для всех сущностей на арене
// ==============================
class ArenaEntity {
    /**
     * Создаёт новую сущность
     * @param {number} x - Координата X в мире
     * @param {number} y - Координата Y в мире
     * @param {number} radius - Радиус сущности
     * @param {string} color - Цвет
     */
    constructor(x, y, radius, color) {
        this.worldX = x; // Координаты в мире
        this.worldY = y;
        this.radius = radius;
        this.color = color;
        this.vx = 0;
        this.vy = 0;
        this.speed = 0;
        this.isActive = true;
    }
    
    /**
     * Получить экранные координаты с учётом камеры
     * @param {number} cameraX - Смещение камеры по X
     * @returns {number} - Координата на экране
     */
    getScreenX(cameraX) {
        return this.worldX - cameraX;
    }
    
    getScreenY(cameraY) {
        return this.worldY - cameraY;
    }
    
    /**
     * Обновление сущности
     * @param {number} deltaTime - Время с прошлого кадра
     * @param {number} worldWidth - Ширина мира
     * @param {number} worldHeight - Высота мира
     */
    update(deltaTime, worldWidth, worldHeight) {
        if (!this.isActive) return;
        
        // Обновление позиции на основе скорости
        this.worldX += this.vx * this.speed * deltaTime;
        this.worldY += this.vy * this.speed * deltaTime;
        
        // Границы мира
        this.worldX = Math.max(this.radius, Math.min(worldWidth - this.radius, this.worldX));
        this.worldY = Math.max(this.radius, Math.min(worldHeight - this.radius, this.worldY));
    }
    
    /**
     * Отрисовка сущности
     * @param {CanvasRenderingContext2D} ctx - Контекст канваса
     * @param {number} cameraX - Смещение камеры по X
     * @param {number} cameraY - Смещение камеры по Y
     */
    draw(ctx, cameraX, cameraY) {
        if (!this.isActive) return;
        
        const screenX = this.getScreenX(cameraX);
        const screenY = this.getScreenY(cameraY);
        
        // Рисуем только если видно на экране
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

### Шаг 2.2. Класс ArenaHero (герой на арене)

Добавьте после `ArenaEntity`:

```javascript
// ==============================
// Класс героя на арене
// ==============================
class ArenaHero extends ArenaEntity {
    /**
     * Создаёт героя на арене
     * @param {number} x - Координата X
     * @param {number} y - Координата Y
     * @param {Object} heroData - Данные героя из GameState
     */
    constructor(x, y, heroData) {
        super(x, y, 20, '#4aff4a');
        this.heroData = heroData;
        this.hp = heroData.currentStats.hp;
        this.maxHp = heroData.baseStats.hp;
        this.attack = heroData.currentStats.attack;
        this.speed = heroData.currentStats.speed * 3;
        
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
        
        // Спрайт менеджер
        this.spriteManager = window.spriteManager;
    }
    
    /**
     * Загружает оружие из экипировки героя
     */
    loadWeapons() {
        if (this.heroData.equipment && this.heroData.equipment.weapon) {
            this.weapons.push(new ArenaWeapon(this, this.heroData.equipment.weapon));
        } else {
            // Оружие по умолчанию
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
    
    /**
     * Получение урона
     * @param {number} amount - Количество урона
     */
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
    
    draw(ctx, cameraX, cameraY) {
        if (!this.isActive) return;
        
        const screenX = this.getScreenX(cameraX);
        const screenY = this.getScreenY(cameraY);
        
        // Получаем спрайт героя
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
    
    /**
     * Добавление опыта
     * @param {number} amount - Количество опыта
     */
    addExp(amount) {
        this.exp += amount;
        while (this.exp >= 100) {
            this.levelUp();
        }
    }
    
    /**
     * Повышение уровня на арене
     */
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
}
```

### Шаг 2.3. Класс ArenaEnemy (враг)

Добавьте после `ArenaHero`:

```javascript
// ==============================
// Класс врага на арене
// ==============================
class ArenaEnemy extends ArenaEntity {
    /**
     * Создаёт врага
     * @param {number} x - Координата X
     * @param {number} y - Координата Y
     * @param {number} difficulty - Множитель сложности
     */
    constructor(x, y, difficulty = 1) {
        super(x, y, 18, '#ff4a4a');
        
        this.difficulty = difficulty;
        this.hp = 20 + 10 * difficulty;
        this.maxHp = this.hp;
        this.attack = 3 + 2 * difficulty;
        this.speed = 10 + 2 * difficulty;
        this.expValue = 5 + 5 * difficulty;
        
        // Тип врага
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
        this.damageInterval = 1.0 / this.type.attackSpeed;
        
        this.spriteManager = window.spriteManager;
    }
    
    update(deltaTime, hero, worldWidth, worldHeight) {
        super.update(deltaTime, worldWidth, worldHeight);
        
        if (hero && hero.isActive) {
            const dx = hero.worldX - this.worldX;
            const dy = hero.worldY - this.worldY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                this.vx = dx / distance;
                this.vy = dy / distance;
            }
            
            // Атака при касании
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
        this.color = '#ffffff';
        setTimeout(() => this.color = this.type.color, 100);
        return this.hp <= 0;
    }
    
    draw(ctx, cameraX, cameraY) {
        if (!this.isActive) return;
        
        const screenX = this.getScreenX(cameraX);
        const screenY = this.getScreenY(cameraY);
        
        // Получаем спрайт врага
        const sprite = this.spriteManager.getSprite(this.spriteKey);
        
        // Рисуем спрайт
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

### Шаг 2.4. Классы оружия и снарядов

Добавьте после `ArenaEnemy`:

```javascript
// ==============================
// Класс оружия на арене
// ==============================
class ArenaWeapon {
    constructor(owner, weaponData) {
        this.owner = owner;
        this.data = weaponData;
        this.cooldown = 0;
        this.projectiles = [];
    }
    
    update(deltaTime) {
        if (this.cooldown > 0) {
            this.cooldown -= deltaTime;
        }
        
        if (this.cooldown <= 0) {
            this.attack();
            this.cooldown = this.data.cooldown || 1.0;
        }
        
        this.projectiles = this.projectiles.filter(p => p.isActive);
        this.projectiles.forEach(p => p.update(deltaTime));
    }
    
    attack() {
        if (this.data.type === 'melee' || !this.data.type) {
            this.projectiles.push(new MeleeProjectile(this.owner, this.data));
        } else {
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
        
        // Рисуем кулдаун
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

// ==============================
// Класс снаряда дальнего боя
// ==============================
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
            this.isActive = false;
            return;
        }
        
        const dx = this.target.worldX - this.worldX;
        const dy = this.target.worldY - this.worldY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 10) {
            this.target.takeDamage(this.damage);
            this.isActive = false;
        } else {
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

// ==============================
// Класс снаряда ближнего боя
// ==============================
class MeleeProjectile {
    constructor(owner, data) {
        this.owner = owner;
        this.data = data;
        this.lifetime = 0.2;
        this.isActive = true;
        this.hitEnemies = new Set();
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
        
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.data.range || 60, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}
```

### Шаг 2.5. Класс ExpGem (кристалл опыта)

Добавьте в конце файла:

```javascript
// ==============================
// Класс кристалла опыта
// ==============================
class ExpGem extends ArenaEntity {
    constructor(x, y, value) {
        super(x, y, 10, '#ffd700');
        this.value = value;
        this.spriteManager = window.spriteManager;
        this.floatOffset = 0;
        this.floatDir = 1;
    }
    
    update(deltaTime, worldWidth, worldHeight) {
        super.update(deltaTime, worldWidth, worldHeight);
        
        // Анимация парения
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

// Делаем все классы глобальными
window.ArenaEntity = ArenaEntity;
window.ArenaHero = ArenaHero;
window.ArenaEnemy = ArenaEnemy;
window.ArenaWeapon = ArenaWeapon;
window.ExpGem = ExpGem;
```

---

## 📁 Шаг 3. Создаём `js/arena/SpriteManager.js`

Этот файл отвечает за создание и хранение спрайтов.

```javascript
// ==============================
// Менеджер спрайтов для загрузки и отображения изображений
// ==============================
class SpriteManager {
    constructor() {
        this.sprites = {};
        this.loaded = false;
        this.loadSprites();
    }
    
    loadSprites() {
        // Создаём спрайты через canvas для простоты
        this.createHeroSprites();
        this.createEnemySprites();
        this.createEffectSprites();
        this.loaded = true;
        console.log('Спрайты загружены');
    }
    
    createHeroSprites() {
        // Создаём спрайт героя (меч)
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

// Делаем глобальным
window.SpriteManager = SpriteManager;
```

---

## 📁 Шаг 4. Создаём `js/arena/SurvivorsArena.js`

Это основной класс арены, управляющий игровым циклом.

### Шаг 4.1. Конструктор и основные поля

```javascript
// ==============================
// Основной класс арены в стиле Survivors
// ==============================
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
```

### Шаг 4.2. Методы инициализации и управления

Добавьте после конструктора:

```javascript
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
```

### Шаг 4.3. Игровой цикл и обновление

Добавьте методы игрового цикла:

```javascript
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
        
        // Обновляем героя
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
```

### Шаг 4.4. Вспомогательные методы

Добавьте остальные методы:

```javascript
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
```

### Шаг 4.5. Методы отрисовки

Добавьте методы для рисования:

```javascript
    draw() {
        // Очищаем канвас
        this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
        
        // Рисуем фон
        this.drawBackground();
        this.drawDecorations();
        this.drawGrid();
        
        // Рисуем сущности
        this.expGems.forEach(gem => gem.draw(this.ctx, this.cameraX, this.cameraY));
        this.enemies.forEach(enemy => enemy.draw(this.ctx, this.cameraX, this.cameraY));
        
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
```

### Шаг 4.6. Методы управления состоянием

Добавьте в конце файла:

```javascript
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
        
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('screenLobby').classList.add('active');
        document.querySelector('.game-nav').style.display = 'flex';
        
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

// Делаем глобальным
window.SurvivorsArena = SurvivorsArena;
```

---

## 📁 Шаг 5. Создаём `js/arena/ArenaController.js`

Этот класс связывает арену с основной игрой.

```javascript
// ==============================
// Контроллер арены (связывает с основной игрой)
// ==============================
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
    
    /**
     * Начинает вылазку на арену
     * @param {string} location - Название локации
     * @param {Object} hero - Герой
     * @returns {boolean} - Успешно ли началась вылазка
     */
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

## 📝 Шаг 6. Обновляем `index.html`

В самом конце файла, в блоке подключения скриптов, добавьте новые строки для файлов арены:

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

И в начале файла, после `style.css`, добавьте подключение стилей арены:

```html
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="arena_style.css"> <!-- НОВОЕ -->
```

---

## 🚀 Шаг 7. Обновляем `js/game.js`

В файле запуска нужно добавить создание контроллера арены и улучшить обработчик кнопок локаций.

### Шаг 7.1. Добавляем создание контроллера

Найдите место после создания UI и добавьте:

```javascript
// Запуск UI
const ui = new window.UIManager();

// +++ НОВОЕ: создаём контроллер арены
const arenaController = new window.ArenaController();
```

### Шаг 7.2. Обновляем обработчик кнопок локаций

Замените существующий обработчик `start-match-btn` на этот:

```javascript
// Обработчики кнопок локаций
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
        
        // +++ НОВОЕ: начинаем вылазку на арену
        const started = arenaController.startExpedition(location, hero);
        
        if (!started) {
            // Возвращаем ресурс, если не удалось начать
            window.GameState.updateResource(costType, 1);
        }
    });
});
```

### Шаг 7.3. Удаляем старый обработчик

В файле `game.js` есть два одинаковых обработчика. Удалите второй (он начинается с `// Обработчики кнопок локаций` и содержит логику с опытом и наградами). Он больше не нужен, так как награды теперь выдаются на арене.

---

## ✅ Что мы добавили

| Файл | Что нового |
|------|------------|
| `arena_style.css` | Стили для арены (джойстик, пауза, канвас) |
| `GameEntity.js` | Классы ArenaEntity, ArenaHero, ArenaEnemy, ArenaWeapon, ExpGem |
| `SpriteManager.js` | Создание и хранение спрайтов |
| `SurvivorsArena.js` | Основной игровой цикл, физика, отрисовка |
| `ArenaController.js` | Связь арены с основной игрой |
| `index.html` | Подключение новых файлов и стилей |
| `game.js` | Создание контроллера, обновлённый обработчик |

---

## 💻 Как проверить, что всё работает

1. **Выберите героя** на экране "Герои"
2. **Нажмите "Начать"** на любой локации
3. Должен открыться экран арены с зелёным героем в центре
4. **Управляйте героем** стрелками или WASD
5. Враги должны появляться и атаковать героя
6. При убийстве врагов выпадают жёлтые кристаллы опыта
7. При сборе опыта герой повышает уровень (растут характеристики)
8. **Нажмите ESC** — появится меню паузы
9. **Выйдите с арены** — вернётесь в лобби, характеристики героя сохранятся

---

## 💡 Микро-задания для самостоятельной работы

Выберите **одно** задание, которое улучшит код без добавления новых механик:

### 🔹 Задание 1. Добавить проверку границ мира для камеры
Сейчас камера может выйти за границы мира при некоторых условиях. Добавьте проверку в метод `updateCamera`, чтобы этого не происходило.

**Где:** `SurvivorsArena.js`, метод `updateCamera()`

---

### 🔹 Задание 2. Улучшить спавн врагов
Враги спавнятся слишком близко к герою. Добавьте проверку, чтобы они появлялись не ближе 300 пикселей от героя.

**Где:** `SurvivorsArena.js`, метод `spawnEnemy()`

---

### 🔹 Задание 3. Добавить таймер в заголовок страницы
Во время боя на арене обновляйте заголовок страницы (`document.title`) на "⚔️ X:XX - Arena Survivors", где X:XX — текущее время боя.

**Где:** `SurvivorsArena.js`, метод `updateUI()`

---

### 🔹 Задание 4. Улучшить отображение сложности
В углу экрана сейчас просто число. Добавьте звёздочки: "★" для каждой единицы сложности (например, "★★☆" для сложности 2.5).

**Где:** `SurvivorsArena.js`, метод `draw()`, строка с отрисовкой сложности

---

### 🔹 Задание 5. Добавить подсветку активного оружия
Когда оружие готово к атаке (cooldown = 0), рисуйте вокруг героя зелёное свечение.

**Где:** `GameEntity.js`, метод `ArenaHero.draw()`, после отрисовки оружия

---

### 🎯 Как выполнять

1. Выберите одно задание
2. Внесенные изменения пометьте коментариями.
3. Внесите изменения (буквально 3-10 строк кода)
4. Сделайте commit и push
5. В комментариях к домашнему заданию укажите улучшение.

<br>

> [!TIP]
> Тестируем - при выборе локации должна открываться боевая арена, герой в бою должен двигаться и атаковать, враги должны спавниться постоянно и уничтожаться героем, герой должен зарабатывать опыт и матч должен ставиться на паузу, а так же матч можно завершить или проиграть.  **Переходим к версии 0.0.6 в следующую ветку**
