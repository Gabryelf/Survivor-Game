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

// Класс героя на арене
class ArenaHero extends ArenaEntity {
    constructor(x, y, heroData) {
        super(x, y, 20, '#4aff4a');
        this.heroData = heroData;
        this.hp = heroData.currentStats.hp;
        this.maxHp = heroData.baseStats.hp;
        this.attack = heroData.currentStats.attack;
        this.speed = heroData.currentStats.speed * 3;
        this.kills = 0;
        this.vampirismHeal = 0;

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

    // Добавить метод для обработки убийства врага
    onEnemyKilled() {
        this.kills++;

        // Применяем навык вампиризма, если есть
        const vampireSkill = this.heroData.skills.find(s => s.id === 'vampire_1');
        if (vampireSkill) {
            const healAmount = 5 + vampireSkill.level * 2;
            this.hp = Math.min(this.hp + healAmount, this.maxHp);
            this.vampirismHeal += healAmount;
        }
    }

    // Добавить метод для расчета урона с учётом навыков
    calculateDamage(baseDamage, target) {
        let damage = baseDamage;

        // Навык мага - игнорирование брони
        const fireballSkill = this.heroData.skills.find(s => s.id === 'fireball_1');
        if (fireballSkill) {
            const ignoreArmor = 5 + fireballSkill.level * 3;
            // Упрощённо: уменьшаем защиту цели
            target.defense = Math.max(0, target.defense - ignoreArmor);
        }

        return damage;
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

// Класс оружия на арене
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
        ctx.drawImage(sprite, screenX - 10, screenY - 10, 20, 20);
    }
}

window.ArenaEntity = ArenaEntity;
window.ArenaHero = ArenaHero;
window.ArenaEnemy = ArenaEnemy;
window.ArenaWeapon = ArenaWeapon;
window.ExpGem = ExpGem;