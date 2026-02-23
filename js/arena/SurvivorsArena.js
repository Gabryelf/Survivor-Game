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

        this.killCount = 0;
        this.totalExpGained = 0;
        this.battleResult = null;
        this.pendingSkillChoice = false;

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

    // Добавить в начало файла после определения класса
checkForLevelUp() {
    const heroData = this.hero.heroData;
    const oldLevel = heroData.level;
    
    // Проверяем, не накопилось ли опыта на новый уровень
    while (heroData.exp >= heroData.expToNextLevel) {
        const gainedLevel = heroData.levelUp();
        
        // Если это 3-й уровень и мы получили очко навыка
        if (gainedLevel && heroData.level % 3 === 0) {
            console.log('Сработал выбор навыка на уровне', heroData.level);
            this.showSkillChoice();
        }
    }
    
    // Обновляем UI если уровень изменился
    if (oldLevel !== heroData.level) {
        this.updateUI();
    }
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

    // Исправить метод gameLoop для корректного завершения
    gameLoop(timestamp) {
        if (!this.isRunning) return;

        const deltaTime = Math.min((timestamp - this.lastTimestamp) / 1000, 0.1);
        this.lastTimestamp = timestamp;

        if (!this.isPaused && !this.pendingSkillChoice && this.hero && this.hero.hp > 0) {
            this.update(deltaTime);
        }

        this.draw();

        // Проверяем смерть героя
        if (this.hero && this.hero.hp <= 0 && !this.battleResult) {
            this.gameOver(false);
        }

        requestAnimationFrame((ts) => this.gameLoop(ts));
    }


    // для показа выбора навыка
    showSkillChoice() {
        if (!this.hero || this.pendingSkillChoice) return;
        
        const heroData = this.hero.heroData;
        
        // Проверяем, есть ли очки навыков
        if (heroData.skillPoints <= 0) {
            console.log('Нет очков навыков');
            return;
        }
        
        console.log('Показываем выбор навыка, очков:', heroData.skillPoints);
        
        this.pause();
        this.pendingSkillChoice = true;
        
        const choices = heroData.getSkillChoices();
        console.log('Доступные навыки:', choices);
        
        if (choices.length === 0) {
            console.log('Нет доступных навыков');
            this.pendingSkillChoice = false;
            this.resume();
            return;
        }
        
        const modal = document.getElementById('skillChoiceModal');
        const choicesContainer = document.getElementById('skillChoices');
        
        choicesContainer.innerHTML = '';
        
        choices.forEach(skill => {
            const card = document.createElement('div');
            card.className = 'skill-choice-card';
            card.innerHTML = `
                <div class="skill-choice-icon">${skill.icon}</div>
                <div class="skill-choice-name">${skill.name}</div>
                <div class="skill-choice-desc">${skill.getDescription()}</div>
            `;
            
            card.addEventListener('click', () => {
                const success = heroData.learnSkill(skill.id);
                if (success) {
                    console.log('Навык изучен:', skill.name);
                    this.pendingSkillChoice = false;
                    modal.style.display = 'none';
                    this.updateUI(); // Обновляем отображение навыков
                    this.resume();
                }
            });
            
            choicesContainer.appendChild(card);
        });
        
        modal.style.display = 'block';
    }

    update(deltaTime) {
        if (this.pendingSkillChoice) return;
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

            // При убийстве врага
            if (enemy.hp <= 0) {
                this.killCount++;
                this.totalExpGained += enemy.expValue;
                this.hero.onEnemyKilled(); // Вызываем метод обработки убийства
                this.spawnExpGem(enemy.worldX, enemy.worldY, enemy.expValue);
            }

            return enemy.hp > 0;
        });

        // Обновляем кристаллы опыта
        this.expGems = this.expGems.filter(gem => {
            gem.update(deltaTime, this.worldWidth, this.worldHeight);

            const distance = Math.hypot(gem.worldX - this.hero.worldX, gem.worldY - this.hero.worldY);
            if (distance < this.hero.radius + gem.radius + this.hero.expMagnet) {
                this.hero.addExp(gem.value);
                this.checkForLevelUp();
                return false;
            }
            return true;
        });


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

    // Обновить метод updateUI для отображения навыков
    updateUI() {
        if (!this.hero) return;
        
        const heroData = this.hero.heroData;
        
        // HP бар
        const hpPercent = (this.hero.hp / this.hero.maxHp) * 100;
        document.getElementById('arenaHpBar').style.width = `${hpPercent}%`;
        document.getElementById('arenaHpText').textContent = `${Math.floor(this.hero.hp)}/${this.hero.maxHp}`;
        
        // EXP бар - исправляем расчёт процента
        const expPercent = (heroData.exp / heroData.expToNextLevel) * 100;
        document.getElementById('arenaExpBar').style.width = `${expPercent}%`;
        document.getElementById('arenaExpText').textContent = `Ур. ${heroData.level}`;
        
        // Таймер
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = Math.floor(this.gameTime % 60);
        document.getElementById('arenaTimer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Иконка оружия
        if (this.hero.heroData.equipment && this.hero.heroData.equipment.weapon) {
            const weapon = this.hero.heroData.equipment.weapon;
            document.getElementById('arenaWeaponEmoji').textContent = weapon.icon || '⚔️';
            
            if (this.hero.weapons[0]) {
                const cooldownPercent = (this.hero.weapons[0].cooldown / (this.hero.weapons[0].data.cooldown || 1)) * 100;
                document.getElementById('arenaWeaponCooldown').style.height = `${cooldownPercent}%`;
            }
        }
        
        // Навыки
        const skillsContainer = document.getElementById('arenaSkillIcons');
        skillsContainer.innerHTML = '';
        
        heroData.skills.forEach(skill => {
            const slot = document.createElement('div');
            slot.className = 'skill-slot';
            slot.title = `${skill.name} (Ур. ${skill.level})\n${skill.getDescription()}`;
            slot.textContent = skill.icon;
            skillsContainer.appendChild(slot);
        });
        
        // Добавляем пустые слоты до 3
        for (let i = heroData.skills.length; i < 3; i++) {
            const empty = document.createElement('div');
            empty.className = 'skill-slot empty';
            empty.textContent = '?';
            skillsContainer.appendChild(empty);
        }
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
        this.ctx.fillText(`Позиция: ${Math.floor(this.hero.worldX)}, ${Math.floor(this.hero.worldY)}`, 10, 70);
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

            // Рисуем только если видно на экране
            if (screenX + dec.size < 0 || screenX - dec.size > this.screenWidth ||
                screenY + dec.size < 0 || screenY - dec.size > this.screenHeight) {
                return;
            }

            if (dec.type === 0) { // Дерево
                // Ствол
                this.ctx.fillStyle = '#8B4513';
                this.ctx.fillRect(screenX - 5, screenY - dec.size / 2, 10, dec.size);
                // Крона
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

    //  завершение боя
    gameOver(isVictory = false) {
        this.isRunning = false;
        
        const heroData = this.hero.heroData;
        
        if (isVictory) {
            // Начисляем опыт
            const expGained = this.totalExpGained;
            heroData.addExp(expGained);
            
            // Начисляем ресурсы через GameState
            const rewards = window.GameState.addBattleRewards(
                this.gameTime,
                this.killCount,
                true
            );
            
            this.battleResult = {
                victory: true,
                time: this.gameTime,
                kills: this.killCount,
                expGained: expGained,
                level: heroData.level,
                rewards: rewards.rewards
            };
        } else {
            // Поражение - штраф 50% опыта за этот бой
            const expLoss = Math.floor(this.totalExpGained * 0.5);
            heroData.exp = Math.max(0, heroData.exp - expLoss);
            
            this.battleResult = {
                victory: false,
                time: this.gameTime,
                kills: this.killCount,
                expLoss: expLoss
            };
        }
        
        this.showBattleResult();
    }

    // Метод для показа результатов боя
    showBattleResult() {
        const modal = document.getElementById('battleResultModal');
        const title = document.getElementById('resultTitle');
        const rewards = document.getElementById('resultRewards');
        
        title.className = this.battleResult.victory ? 'victory' : 'defeat';
        title.textContent = this.battleResult.victory ? 'Победа!' : 'Поражение...';
        
        let rewardsHtml = '';
        
        if (this.battleResult.victory) {
            const r = this.battleResult.rewards;
            rewardsHtml = `
                <div class="reward-item">✨ Опыт: +${this.battleResult.expGained}</div>
                <div class="reward-item">🍞 Провизия: +${r.expeditionResources.proviziya}</div>
                <div class="reward-item">⛽ Топливо: +${r.expeditionResources.toplivo}</div>
                <div class="reward-item">🔧 Инструменты: +${r.expeditionResources.instrumenty}</div>
                <div class="reward-item">🪵 Древесина: +${r.craftingMaterials.material_wood || 0}</div>
                <div class="reward-item">⛓️ Железо: +${r.craftingMaterials.material_iron || 0}</div>
                <div class="reward-item">🧶 Ткань: +${r.craftingMaterials.material_cloth || 0}</div>
                ${r.item ? `<div class="reward-item">🎁 Найден предмет: ${r.item.name}</div>` : ''}
                <div class="reward-item">⚔️ Убито врагов: ${this.battleResult.kills}</div>
                <div class="reward-item">⏱️ Время: ${Math.floor(this.battleResult.time)} сек</div>
            `;
        } else {
            rewardsHtml = `
                <div class="reward-item">💔 Потеряно опыта: ${this.battleResult.expLoss}</div>
                <div class="reward-item">⚔️ Убито врагов: ${this.battleResult.kills}</div>
                <div class="reward-item">⏱️ Время: ${Math.floor(this.battleResult.time)} сек</div>
            `;
        }
        
        rewards.innerHTML = rewardsHtml;
        modal.style.display = 'block';
    }


    // Обновить метод exitArena
    exitArena() {
        this.stop();

        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('screenLobby').classList.add('active');
        document.querySelector('.game-nav').style.display = 'flex';

        // Обновляем данные героя
        if (this.hero && this.hero.heroData) {
            // Восстанавливаем HP для меню
            this.hero.heroData.currentStats.hp = this.hero.heroData.baseStats.hp;
            window.GameState.notify();
        }

        // Скрываем все модальные окна
        document.getElementById('skillChoiceModal').style.display = 'none';
        document.getElementById('pauseMenu').style.display = 'none';
        document.getElementById('battleResultModal').style.display = 'none';

        this.pendingSkillChoice = false;
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

window.SurvivorsArena = SurvivorsArena;