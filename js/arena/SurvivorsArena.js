// Основной класс арены в стиле Survivors
class SurvivorsArena {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Временные размеры до реального расчета
        this.screenWidth = 800;
        this.screenHeight = 600;

        // Размеры мира
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
        this.maxEnemies = 40;

        this.skillChoiceShown = false;

        // Управление
        this.keys = {};
        this.joystick = { active: false, dirX: 0, dirY: 0 };

        // Декорации
        this.decorations = [];

        // Время последнего кадра
        this.lastTimestamp = 0;

        // Для глобального доступа
        window.currentArena = this;

        // Сначала устанавливаем размеры канваса
        this.resizeCanvas();

        // Потом генерируем декорации
        this.generateDecorations();

        // Инициализируем управление
        this.initControls();

        // Обработчик ресайза
        this.initResizeHandler();
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        if (!container) return;

        // Получаем доступную высоту (минус хедер)
        const headerHeight = 60; // Примерная высота хедера
        const containerWidth = container.clientWidth;
        const containerHeight = window.innerHeight - headerHeight - 50; // Отнимаем хедер и немного запаса

        if (containerWidth > 0 && containerHeight > 0) {
            this.screenWidth = containerWidth;
            this.screenHeight = containerHeight;
            this.canvas.width = containerWidth;
            this.canvas.height = containerHeight;

            console.log('Canvas resized to:', this.screenWidth, 'x', this.screenHeight);
        }
    }

    initResizeHandler() {
        window.addEventListener('resize', () => {
            if (this.isRunning) {
                this.resizeCanvas();

                // Обновляем камеру
                if (this.hero) {
                    this.updateCamera();
                }
            }
        });
    }

    generateDecorations() {
        this.decorations = [];
        // Создаём декорации по всему миру
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

        // Сначала обновляем размеры канваса
        this.resizeCanvas();

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
        for (let i = 0; i < 8; i++) {
            this.spawnEnemy();
        }

        // Скрываем меню паузы при старте
        const pauseMenu = document.getElementById('pauseMenu');
        if (pauseMenu) {
            pauseMenu.style.display = 'none';
        }

        console.log('Арена инициализирована, врагов:', this.enemies.length);
        console.log('Canvas размер:', this.screenWidth, 'x', this.screenHeight);
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

        if (!this.isPaused && this.hero) {
            this.update(deltaTime);
        }

        this.draw();

        requestAnimationFrame((ts) => this.gameLoop(ts));
    }

    update(deltaTime) {
        this.gameTime += deltaTime;
        this.difficulty = 1 + Math.floor(this.gameTime / 60) * 0.5;

        this.updateUI();
        this.checkSkillChoice(); // Проверяем, нужно ли выбрать навык

        if (this.isPaused) return; // Если игра на паузе, не обновляем дальше

        this.handleHeroMovement(deltaTime);
        this.hero.update(deltaTime, this.worldWidth, this.worldHeight);
        this.updateCamera();


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

        // Обновляем врагов и проверяем попадания
        this.enemies = this.enemies.filter(enemy => {
            enemy.update(deltaTime, this.hero, this.worldWidth, this.worldHeight);

            // Проверяем попадания от оружия
            if (this.hero && this.hero.weapons) {
                this.hero.weapons.forEach(weapon => {
                    if (weapon && weapon.projectiles) {
                        if (weapon.data && weapon.data.type === 'ranged') {
                            weapon.projectiles.forEach(projectile => {
                                if (projectile && projectile.isActive && projectile.target === enemy) {
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
                                }
                            });
                        } else {
                            weapon.projectiles.forEach(projectile => {
                                if (projectile && projectile.isActive && projectile.hitEnemies && !projectile.hitEnemies.has(enemy)) {
                                    if (this.checkMeleeHit(this.hero, enemy, (projectile.data && projectile.data.range) || 60)) {
                                        enemy.takeDamage((projectile.data && projectile.data.damage) || 5);
                                        projectile.hitEnemies.add(enemy);

                                        if (enemy.hp <= 0) {
                                            this.spawnExpGem(enemy.worldX, enemy.worldY, enemy.expValue);
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
            }

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
            this.hero.vx = moveX / length;
            this.hero.vy = moveY / length;
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

        const enemy = new ArenaEnemy(x, y, this.difficulty);
        this.enemies.push(enemy);
    }

    spawnExpGem(x, y, value) {
        this.expGems.push(new ExpGem(x, y, value));
    }

    updateUI() {
        if (!this.hero) return;

        // Обновляем прогресс бары
        const hpPercent = (this.hero.hp / this.hero.maxHp) * 100;
        const expPercent = ((this.hero.exp % 100) / 100) * 100;

        const hpBar = document.getElementById('arenaHpBar');
        const hpText = document.getElementById('arenaHpText');
        const expBar = document.getElementById('arenaExpBar');
        const expText = document.getElementById('arenaExpText');
        const timer = document.getElementById('arenaTimer');

        if (hpBar) hpBar.style.width = `${hpPercent}%`;
        if (hpText) hpText.textContent = `${Math.floor(this.hero.hp)}/${this.hero.maxHp}`;

        if (expBar) expBar.style.width = `${expPercent}%`;
        if (expText) expText.textContent = `Ур. ${this.hero.level} (${this.hero.exp % 100}/100)`;

        // Обновляем время
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = Math.floor(this.gameTime % 60);
        if (timer) timer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    draw() {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);

        this.drawBackground();
        this.drawDecorations();
        this.drawGrid();

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
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.screenHeight);
        gradient.addColorStop(0, '#1a4a1a');
        gradient.addColorStop(1, '#2a5a2a');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
    }

    drawDecorations() {
        if (!this.decorations) return;

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
        alert('💀 Игра окончена! Вы продержались ' + Math.floor(this.gameTime) + ' секунд');
        this.exitArena();
    }

    exitArena() {
        this.stop();

        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('screenLobby').classList.add('active');
        document.querySelector('.game-nav').style.display = 'flex';

        // Показываем основной хедер
        const gameHeader = document.querySelector('.game-header');
        if (gameHeader) {
            gameHeader.style.display = 'flex';
            gameHeader.style.visibility = 'visible';
        }

        // Скрываем меню паузы
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
        // Клавиатура
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

        // Джойстик для мобильных
        const joystickBase = document.querySelector('.joystick-base');
        const joystickThumb = document.getElementById('joystickThumb');

        if (joystickBase && joystickThumb) {
            let joystickActive = false;

            // Добавляем обработчики с опцией passive: false для предотвращения скролла
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

                this.joystick.dirX = dx / maxRadius;
                this.joystick.dirY = dy / maxRadius;
            };

            const touchEndHandler = (e) => {
                e.preventDefault();
                joystickActive = false;
                this.joystick.active = false;
                joystickThumb.style.transform = 'translate(0, 0)';
            };

            // Добавляем обработчики с опциями
            joystickBase.addEventListener('touchstart', touchStartHandler, { passive: false });
            joystickBase.addEventListener('touchmove', touchMoveHandler, { passive: false });
            joystickBase.addEventListener('touchend', touchEndHandler, { passive: false });
            joystickBase.addEventListener('touchcancel', touchEndHandler, { passive: false });
        }
    }

    checkSkillChoice() {
        if (!this.hero || !this.hero.heroData) {
            return;
        }
        
        // Проверяем напрямую pendingSkillLevel
        const hasPending = this.hero.heroData.pendingSkillLevel > 0;
        
        if (hasPending && !this.skillChoiceShown) {
            console.log(`%c🆕 ОБНАРУЖЕН НАВЫК! Уровень: ${this.hero.heroData.pendingSkillLevel}`, 'color: #4aff4a; font-size: 12px');
            this.skillChoiceShown = true;
            this.pause(); // Ставим игру на паузу
            
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
                    console.error('❌ UI не найден! window.ui =', window.ui);
                    this.resume();
                }
            }, 500);
        }
    }

}

window.SurvivorsArena = SurvivorsArena;