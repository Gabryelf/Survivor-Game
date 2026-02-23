// Базовый класс для всех сущностей на арене
class ArenaEntity {
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

        // Границы мира
        this.worldX = Math.max(this.radius, Math.min(worldWidth - this.radius, this.worldX));
        this.worldY = Math.max(this.radius, Math.min(worldHeight - this.radius, this.worldY));
    }

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

// Базовый класс героя на арене
class ArenaHero extends ArenaEntity {
    constructor(x, y, heroData) {
        super(x, y, 20, '#4aff4a');
        this.heroData = heroData;
        this.hp = heroData.currentStats.hp;
        this.maxHp = heroData.baseStats.hp;
        this.attack = heroData.currentStats.attack;
        this.speed = heroData.currentStats.speed * 3;

        // Тип героя
        this.heroType = heroData.type; // 'warrior', 'archer', 'mage', 'rogue'

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

        // Специальные способности
        this.traps = []; // Для разбойника
        this.trapCooldown = 0;
        this.trapInterval = 5; // Ловушка каждые 5 секунд

        // Для мага
        this.magicBeam = null;
        this.magicCooldown = 0;
        this.magicInterval = 8; // Магия каждые 8 секунд

        // Спрайт менеджер
        this.spriteManager = window.spriteManager;

        // Расходники в бою (3 слота для зелий)
        this.battleConsumables = [];
        this.loadConsumables();
    }

    loadWeapons() {
        // Загружаем оружие из экипировки
        if (this.heroData.equipment && this.heroData.equipment.weapon) {
            this.weapons.push(new ArenaWeapon(this, this.heroData.equipment.weapon, this.heroType));
        } else {
            // Базовое оружие в зависимости от типа героя
            let baseWeapon;
            switch (this.heroType) {
                case 'warrior':
                    baseWeapon = {
                        name: 'Меч',
                        damage: 8,
                        range: 70,
                        cooldown: 0.4,
                        type: 'melee',
                        icon: '⚔️'
                    };
                    break;
                case 'archer':
                    baseWeapon = {
                        name: 'Лук',
                        damage: 12,
                        range: 300,
                        cooldown: 1.2,
                        type: 'ranged',
                        accuracy: 0.8, // 80% точность
                        icon: '🏹'
                    };
                    break;
                case 'mage':
                    baseWeapon = {
                        name: 'Посох',
                        damage: 5,
                        range: 200,
                        cooldown: 0.8,
                        type: 'magic',
                        icon: '🔮'
                    };
                    break;
                case 'rogue':
                    baseWeapon = {
                        name: 'Кинжалы',
                        damage: 6,
                        range: 50,
                        cooldown: 0.25, // Очень быстрая атака
                        type: 'melee',
                        icon: '🗡️'
                    };
                    break;
                default:
                    baseWeapon = {
                        name: 'Кулаки',
                        damage: 5,
                        range: 60,
                        cooldown: 0.5,
                        type: 'melee',
                        icon: '👊'
                    };
            }
            this.weapons.push(new ArenaWeapon(this, baseWeapon, this.heroType));
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

        // Обновляем специальные способности
        if (this.heroType === 'rogue') {
            this.updateTraps(deltaTime);
        } else if (this.heroType === 'mage') {
            this.updateMagic(deltaTime);
        }

        // Анимация
        this.animationFrame += deltaTime * 10;
    }

    updateTraps(deltaTime) {
        // Обновляем кулдаун ловушек
        if (this.trapCooldown > 0) {
            this.trapCooldown -= deltaTime;
        }

        // Ставим новую ловушку
        if (this.trapCooldown <= 0) {
            this.traps.push(new ArenaTrap(this.worldX, this.worldY));
            this.trapCooldown = this.trapInterval;
        }

        // Обновляем существующие ловушки
        this.traps = this.traps.filter(trap => trap.isActive);
        this.traps.forEach(trap => trap.update(deltaTime));
    }

    updateMagic(deltaTime) {
        // Обновляем кулдаун магии
        if (this.magicCooldown > 0) {
            this.magicCooldown -= deltaTime;
        }

        // Активируем магию только если прошло достаточно времени
        if (this.magicCooldown <= 0 && !this.magicBeam) {
            // Создаем магию только если герой движется или атакует
            if (Math.abs(this.vx) > 0.1 || Math.abs(this.vy) > 0.1) {
                this.magicBeam = new MagicBeam(this);
                this.magicCooldown = 5.0; // Кулдаун 5 секунд
            }
        }

        // Обновляем магический луч
        if (this.magicBeam) {
            this.magicBeam.update(deltaTime);
            if (!this.magicBeam.isActive) {
                this.magicBeam = null;
            }
        }
    }


    useConsumable(slotIndex) {
        if (slotIndex < 0 || slotIndex >= this.battleConsumables.length) return false;

        const item = this.battleConsumables[slotIndex];
        if (!item) return false;

        // Применяем эффект
        if (item.effect === 'heal') {
            this.hp = Math.min(this.hp + item.value, this.maxHp);
            this.battleConsumables.splice(slotIndex, 1);
            return true;
        } else if (item.effect === 'buff') {
            // Временный бафф
            this.attack += item.value;
            setTimeout(() => {
                this.attack -= item.value;
            }, 10000); // 10 секунд
            this.battleConsumables.splice(slotIndex, 1);
            return true;
        }

        return false;
    }

    draw(ctx, cameraX, cameraY) {
        if (!this.isActive) return;

        const screenX = this.getScreenX(cameraX);
        const screenY = this.getScreenY(cameraY);

        // Рисуем спрайт в зависимости от типа
        let spriteType = 'hero';
        if (this.heroType === 'archer') spriteType = 'heroBow';
        else if (this.heroType === 'mage') spriteType = 'heroMage';
        else if (this.heroType === 'rogue') spriteType = 'heroRogue';

        const sprite = this.spriteManager.getSprite(spriteType);

        // Рисуем спрайт
        if (sprite) {
            ctx.drawImage(sprite, screenX - 20, screenY - 20, 40, 40);
        } else {
            // Запасной вариант
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

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

        // Рисуем ловушки для разбойника
        if (this.heroType === 'rogue') {
            this.traps.forEach(trap => trap.draw(ctx, cameraX, cameraY));
        }

        // Рисуем магический луч для мага
        if (this.magicBeam) {
            this.magicBeam.draw(ctx, cameraX, cameraY);
        }

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
    }

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
}

// Класс врага на арене
class ArenaEnemy extends ArenaEntity {
    constructor(x, y, difficulty = 1) {
        super(x, y, 18, '#ff4a4a');

        this.difficulty = difficulty;
        this.hp = 20 + 5 * difficulty;
        this.maxHp = this.hp;
        this.attack = 3 + 2 * difficulty;
        this.speed = 30 + 8 * difficulty;
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
        this.damageInterval = this.type.attackSpeed;

        // Эффекты
        this.slowed = false;
        this.slowTimer = 0;

        this.spriteManager = window.spriteManager;
    }

    update(deltaTime, hero, worldWidth, worldHeight) {
        super.update(deltaTime, worldWidth, worldHeight);

        // Обновляем эффекты
        if (this.slowed) {
            this.slowTimer -= deltaTime;
            if (this.slowTimer <= 0) {
                this.slowed = false;
                this.speed *= 2; // Возвращаем нормальную скорость
            }
        }

        if (hero && hero.isActive) {
            const dx = hero.worldX - this.worldX;
            const dy = hero.worldY - this.worldY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                this.vx = dx / distance;
                this.vy = dy / distance;
            }

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

    slowDown() {
        if (!this.slowed) {
            this.slowed = true;
            this.speed /= 2; // Уменьшаем скорость вдвое
            this.slowTimer = 3; // На 3 секунды
        }
    }

    draw(ctx, cameraX, cameraY) {
        if (!this.isActive) return;

        const screenX = this.getScreenX(cameraX);
        const screenY = this.getScreenY(cameraY);

        // Получаем спрайт врага
        const sprite = this.spriteManager.getSprite(this.spriteKey);

        // Рисуем спрайт
        if (sprite) {
            ctx.drawImage(sprite, screenX - 20, screenY - 20, 40, 40);
        } else {
            // Запасной вариант
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        // Полоска здоровья
        const hpPercent = this.hp / this.maxHp;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(screenX - 20, screenY - 30, 40, 4);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(screenX - 20, screenY - 30, 40 * hpPercent, 4);

        // Индикатор замедления
        if (this.slowed) {
            ctx.fillStyle = '#00aaff';
            ctx.beginPath();
            ctx.arc(screenX - 15, screenY - 15, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// Класс оружия на арене
class ArenaWeapon {
    constructor(owner, weaponData, heroType = 'warrior') {
        this.owner = owner;
        this.data = weaponData;
        this.heroType = heroType;
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
        const arena = window.currentArena;
        if (!arena || !arena.enemies || arena.enemies.length === 0) return;

        if (this.data.type === 'ranged' || this.heroType === 'archer') {
            // Стрельба из лука
            const target = this.selectTarget();
            if (target) {
                const accuracy = this.data.accuracy || 0.8;
                this.projectiles.push(new RangedProjectile(this.owner, this.data, target, accuracy));
            }
        } else if (this.data.type === 'magic' || this.heroType === 'mage') {
            // Магия - множественная атака
            const angle = 25 * Math.PI / 180; // 25 градусов
            //this.projectiles.push(new MagicProjectile(this.owner, this.data, angle));
        } else {
            // Ближний бой
            this.projectiles.push(new MeleeProjectile(this.owner, this.data));
        }
    }

    selectTarget() {
        const arena = window.currentArena;
        if (!arena || !arena.enemies || arena.enemies.length === 0) return null;

        // Выбираем ближайшего врага
        let closestEnemy = null;
        let closestDistance = Infinity;

        arena.enemies.forEach(enemy => {
            if (!enemy.isActive) return;
            const distance = Math.hypot(enemy.worldX - this.owner.worldX, enemy.worldY - this.owner.worldY);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        });

        return closestEnemy;
    }

    draw(ctx, cameraX, cameraY) {
        this.projectiles.forEach(p => p.draw(ctx, cameraX, cameraY));

        // Рисуем кулдаун
        if (this.cooldown > 0 && this.owner) {
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
    constructor(owner, data, target, accuracy = 0.8) {
        this.owner = owner;
        this.worldX = owner.worldX;
        this.worldY = owner.worldY;
        this.data = data;
        this.target = target;
        this.speed = 400;
        this.radius = 6;
        this.isActive = true;
        this.damage = data.damage || 5;

        // Расчет траектории с учетом промаха
        const dx = target.worldX - this.worldX;
        const dy = target.worldY - this.worldY;
        const distance = Math.hypot(dx, dy);

        if (Math.random() > accuracy) { // Промах
            // Смещаем цель на случайный угол
            const missAngle = (Math.random() - 0.5) * 0.5; // До 0.5 радиан (≈28 градусов)
            const angle = Math.atan2(dy, dx) + missAngle;

            this.vx = Math.cos(angle);
            this.vy = Math.sin(angle);

            // Летим на ту же дистанцию, но в другом направлении
            this.targetX = this.worldX + Math.cos(angle) * distance;
            this.targetY = this.worldY + Math.sin(angle) * distance;
        } else {
            // Точное попадание
            this.vx = dx / distance;
            this.vy = dy / distance;
            this.targetX = target.worldX;
            this.targetY = target.worldY;
        }
    }

    update(deltaTime) {
        const dx = this.targetX - this.worldX;
        const dy = this.targetY - this.worldY;
        const distance = Math.hypot(dx, dy);

        if (distance < 10) {
            this.isActive = false;
        } else {
            this.worldX += this.vx * this.speed * deltaTime;
            this.worldY += this.vy * this.speed * deltaTime;
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

// Класс магического снаряда (цепная или площадная атака)
class MagicProjectile {
    constructor(owner, data, spreadAngle) {
        this.owner = owner;
        this.data = data;
        this.lifetime = 2.0; // Длится 2 секунды
        this.isActive = true;
        this.hitEnemies = new Set();
        this.damage = data.damage || 5;
        this.spreadAngle = spreadAngle;

        // Создаем несколько лучей в конусе
        this.beams = [];
        const numBeams = 5;
        const baseAngle = Math.atan2(owner.vx, owner.vy) || 0;

        for (let i = 0; i < numBeams; i++) {
            const angleOffset = (i - (numBeams - 1) / 2) * spreadAngle / numBeams;
            const angle = baseAngle + angleOffset;

            this.beams.push({
                vx: Math.cos(angle),
                vy: Math.sin(angle),
                x: owner.worldX,
                y: owner.worldY
            });
        }
    }

    update(deltaTime) {
        this.lifetime -= deltaTime;
        if (this.lifetime <= 0) {
            this.isActive = false;
        }

        // Обновляем позиции лучей
        const speed = 300;
        this.beams.forEach(beam => {
            beam.x += beam.vx * speed * deltaTime;
            beam.y += beam.vy * speed * deltaTime;
        });

        // Проверяем попадания
        const arena = window.currentArena;
        if (arena && arena.enemies) {
            arena.enemies.forEach(enemy => {
                if (!this.hitEnemies.has(enemy)) {
                    this.beams.forEach(beam => {
                        const distance = Math.hypot(beam.x - enemy.worldX, beam.y - enemy.worldY);
                        if (distance < enemy.radius + 20) {
                            enemy.takeDamage(this.damage);
                            this.hitEnemies.add(enemy);

                            if (enemy.hp <= 0) {
                                arena.spawnExpGem(enemy.worldX, enemy.worldY, enemy.expValue);
                            }
                        }
                    });
                }
            });
        }
    }

    draw(ctx, cameraX, cameraY) {
        this.beams.forEach(beam => {
            const screenX = beam.x - cameraX;
            const screenY = beam.y - cameraY;

            ctx.beginPath();
            ctx.arc(screenX, screenY, 10, 0, Math.PI * 2);
            ctx.fillStyle = '#aa00ff';
            ctx.globalAlpha = 0.6;
            ctx.fill();
            ctx.globalAlpha = 1;

            // Линия от владельца
            const ownerScreenX = this.owner.getScreenX(cameraX);
            const ownerScreenY = this.owner.getScreenY(cameraY);

            ctx.beginPath();
            ctx.moveTo(ownerScreenX, ownerScreenY);
            ctx.lineTo(screenX, screenY);
            ctx.strokeStyle = '#aa00ff';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }
}

// Класс снаряда ближнего боя
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
        if (!this.owner) return;

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

// Класс ловушки для разбойника
class ArenaTrap {
    constructor(x, y) {
        this.worldX = x;
        this.worldY = y;
        this.radius = 15;
        this.isActive = true;
        this.lifetime = 10; // Живет 10 секунд
        this.triggered = false;
        this.hitEnemies = new Set();
    }

    update(deltaTime) {
        this.lifetime -= deltaTime;
        if (this.lifetime <= 0) {
            this.isActive = false;
        }

        // Проверяем врагов в зоне
        if (!this.triggered) {
            const arena = window.currentArena;
            if (arena && arena.enemies) {
                arena.enemies.forEach(enemy => {
                    if (!this.hitEnemies.has(enemy)) {
                        const distance = Math.hypot(enemy.worldX - this.worldX, enemy.worldY - this.worldY);
                        if (distance < this.radius + enemy.radius) {
                            // Ловушка сработала
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

        // Рисуем ловушку
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.triggered ? '#888888' : '#ffaa00';
        ctx.globalAlpha = 0.5;
        ctx.fill();

        // Рисуем шипы
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

        // Таймер
        ctx.font = '10px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(Math.ceil(this.lifetime) + 'с', screenX, screenY - 15);
    }
}

// Класс магического луча для мага
class MagicBeam {
    constructor(owner) {
        this.owner = owner;
        this.lifetime = 1.0; // Длится 1 секунду
        this.isActive = true;
        this.hitEnemies = new Set();
        this.beams = [];
        this.damagePerBeam = 8;

        // Создаем 4 луча в конусе перед героем
        const directionX = owner.vx || 1; // Направление движения
        const directionY = owner.vy || 0;

        // Нормализуем направление
        const length = Math.sqrt(directionX * directionX + directionY * directionY);
        const baseAngle = length > 0 ? Math.atan2(directionY, directionX) : 0;

        // Создаем лучи с разбросом -30, -10, +10, +30 градусов
        const angles = [
            baseAngle - 30 * Math.PI / 180,
            baseAngle - 10 * Math.PI / 180,
            baseAngle + 10 * Math.PI / 180,
            baseAngle + 30 * Math.PI / 180
        ];

        angles.forEach(angle => {
            this.beams.push({
                x: owner.worldX,
                y: owner.worldY,
                vx: Math.cos(angle),
                vy: Math.sin(angle),
                active: true,
                hitEnemies: new Set()
            });
        });
    }

    update(deltaTime) {
        this.lifetime -= deltaTime;
        if (this.lifetime <= 0) {
            this.isActive = false;
            return;
        }

        const speed = 400; // Скорость лучей

        // Обновляем позиции лучей и проверяем попадания
        this.beams.forEach(beam => {
            if (!beam.active) return;

            beam.x += beam.vx * speed * deltaTime;
            beam.y += beam.vy * speed * deltaTime;

            // Проверяем попадания
            const arena = window.currentArena;
            if (arena && arena.enemies) {
                arena.enemies.forEach(enemy => {
                    if (!beam.hitEnemies.has(enemy)) {
                        const distance = Math.hypot(beam.x - enemy.worldX, beam.y - enemy.worldY);
                        if (distance < enemy.radius + 15) {
                            enemy.takeDamage(this.damagePerBeam);
                            beam.hitEnemies.add(enemy);

                            if (enemy.hp <= 0) {
                                arena.spawnExpGem(enemy.worldX, enemy.worldY, enemy.expValue);
                            }
                        }
                    }
                });
            }
        });
    }

    draw(ctx, cameraX, cameraY) {
        const ownerX = this.owner.getScreenX(cameraX);
        const ownerY = this.owner.getScreenY(cameraY);

        this.beams.forEach(beam => {
            if (!beam.active) return;

            const beamX = beam.x - cameraX;
            const beamY = beam.y - cameraY;

            // Рисуем линию
            ctx.beginPath();
            ctx.moveTo(ownerX, ownerY);
            ctx.lineTo(beamX, beamY);
            ctx.strokeStyle = '#aa4aff';
            ctx.lineWidth = 4;
            ctx.stroke();

            // Рисуем шар на конце
            ctx.beginPath();
            ctx.arc(beamX, beamY, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#aa4aff';
            ctx.shadowColor = '#ff00ff';
            ctx.shadowBlur = 15;
            ctx.fill();
            ctx.shadowBlur = 0;
        });
    }
}

// Класс кристалла опыта
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
        if (sprite) {
            ctx.drawImage(sprite, screenX - 10, screenY - 10, 20, 20);
        } else {
            // Запасной вариант
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#ffd700';
            ctx.fill();
        }
    }
}

window.ArenaEntity = ArenaEntity;
window.ArenaHero = ArenaHero;
window.ArenaEnemy = ArenaEnemy;
window.ArenaWeapon = ArenaWeapon;
window.ExpGem = ExpGem;