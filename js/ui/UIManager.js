// ==============================
// Менеджер отрисовки
// ==============================
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

        // Принудительно показываем основной хедер при старте
        if (this.gameHeader) {
            this.gameHeader.style.display = 'flex';
            this.gameHeader.style.visibility = 'visible';
        }

        this.initEventListeners();
        this.subscribeToState();
        this.updateResourcesUI();
        this.renderHeroes();

        if (window.GameState.shop) {
            this.renderShop();
        }

        if (window.GameState.recipeManager) {
            this.renderCraft();
        }
    }

    initEventListeners() {
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const screenId = e.target.dataset.screen;
                this.showScreen(screenId);
                this.setActiveNavButton(e.target);

                if (screenId === 'heroes') {
                    this.renderHeroes();
                } else if (screenId === 'shop') {
                    this.renderShop();
                } else if (screenId === 'craft') {
                    this.renderCraft();
                }
            });
        });

        document.querySelector('.close-modal').addEventListener('click', () => {
            document.getElementById('heroModal').style.display = 'none';
        });
    }

    showScreen(screenId) {
        // Скрываем все экраны
        Object.values(this.screens).forEach(screen => {
            if (screen) screen.classList.remove('active');
        });

        // Показываем нужный экран
        const targetScreen = this.screens[screenId];
        if (targetScreen) {
            targetScreen.classList.add('active');
        }

        // Управляем отображением основного хедера
        if (this.gameHeader) {
            if (screenId === 'arena') {
                // В бою полностью скрываем основной хедер
                this.gameHeader.style.display = 'none';
                this.gameHeader.style.visibility = 'hidden';
                console.log('Скрываем основной хедер в бою');
            } else {
                // Вне боя показываем основной хедер
                this.gameHeader.style.display = 'flex';
                this.gameHeader.style.visibility = 'visible';
                console.log('Показываем основной хедер');
            }
        }
    }

    setActiveNavButton(activeBtn) {
        this.navButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    subscribeToState() {
        window.GameState.subscribe(() => {
            this.updateResourcesUI();

            // Обновляем текущий экран если нужно
            if (this.screens.heroes.classList.contains('active')) {
                this.renderHeroes();
            } else if (this.screens.shop.classList.contains('active')) {
                this.renderShop();
            } else if (this.screens.craft.classList.contains('active')) {
                this.renderCraft();
            }
        });
    }

    updateResourcesUI() {
        if (this.resourceElements.proviziya) {
            this.resourceElements.proviziya.textContent = window.GameState.resources.proviziya.toFixed(1);
        }
        if (this.resourceElements.toplivo) {
            this.resourceElements.toplivo.textContent = window.GameState.resources.toplivo.toFixed(1);
        }
        if (this.resourceElements.instrumenty) {
            this.resourceElements.instrumenty.textContent = window.GameState.resources.instrumenty.toFixed(1);
        }
    }

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

            heroCard.innerHTML = `
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
    <div class="learned-skills" style="display: flex; gap: 5px; margin-top: 5px;">
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

    // Отрисовка магазина
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

            let rarityColor = '#ffffff';
            if (item.rarity === 'rare') rarityColor = '#4caaff';
            if (item.rarity === 'epic') rarityColor = '#aa4cff';
            if (item.rarity === 'legendary') rarityColor = '#ffaa4c';

            itemCard.innerHTML = `
                <div style="font-size: 3rem;">${item.icon}</div>
                <h3 style="color: ${rarityColor};">${item.name}</h3>
                <p class="item-type">${item.type}</p>
                <p class="item-description">${item.description}</p>
                <p class="item-price">💰 ${item.getPrice()} провизии</p>
                <p class="item-rarity" style="color: ${rarityColor};">${item.rarity}</p>
                <button class="buy-item-btn" data-item-id="${item.id}">Купить</button>
            `;

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
                    alert(result.message);
                    this.renderShop();
                } else {
                    alert(result.message);
                }
            });
        });

        const shopInfo = document.createElement('div');
        shopInfo.className = 'shop-info';
        shopInfo.style.marginTop = '20px';
        shopInfo.style.textAlign = 'center';
        shopInfo.innerHTML = `
            <p>🔄 Ассортимент обновится через: <span id="shopTimer">30</span>с</p>
        `;
        container.appendChild(shopInfo);

        this.startShopTimer();
    }

    // Отрисовка крафта
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

        // Отображаем доступные материалы
        const materials = window.GameState.getMaterials();
        const materialsDiv = document.createElement('div');
        materialsDiv.className = 'materials-display';
        materialsDiv.style.cssText = `
            background: #16213e;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            display: flex;
            gap: 20px;
            justify-content: center;
        `;
        materialsDiv.innerHTML = `
            <div> 🌲 <span id="materialWood">${materials.wood}</span></div>
            <div> ⛓️ <span id="materialIron">${materials.iron}</span></div>
            <div> 🌯 <span id="materialCloth">${materials.cloth}</span></div>
        `;
        container.appendChild(materialsDiv);

        // Заголовок с открытыми рецептами
        const title = document.createElement('h3');
        title.textContent = 'Доступные рецепты:';
        container.appendChild(title);

        // Отображаем открытые рецепты
        const unlockedRecipes = window.GameState.recipeManager.getUnlockedRecipes();

        if (unlockedRecipes.length === 0) {
            container.innerHTML += '<p>Нет доступных рецептов</p>';
            return;
        }

        unlockedRecipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'craft-item';

            // Проверяем, можно ли скрафтить
            const canCraft = recipe.canCraft(currentHero, window.GameState.inventory);

            // Собираем строку с материалами
            const materialsList = recipe.materials.map(m =>
                `${m.itemId === 'material_wood' ? '🌲' : m.itemId === 'material_iron' ? '⛓️' : '🌯'} ${m.quantity}`
            ).join(' + ');

            recipeCard.innerHTML = `
                <div style="font-size: 2rem;">${recipe.resultItem.icon}</div>
                <h4>${recipe.name}</h4>
                <p>${recipe.resultItem.description}</p>
                <p class="craft-materials">Требуется: ${materialsList}</p>
                <p class="craft-level">Требуемый уровень: ${recipe.requiredLevel}</p>
                <button class="craft-item-btn" data-recipe-id="${recipe.id}" ${!canCraft.success ? 'disabled' : ''}>
                    ${canCraft.success ? 'Скрафтить' : canCraft.message}
                </button>
            `;

            // Если нельзя скрафтить, делаем кнопку серой
            if (!canCraft.success) {
                recipeCard.querySelector('button').style.background = '#666';
                recipeCard.querySelector('button').style.cursor = 'not-allowed';
            }

            container.appendChild(recipeCard);
        });

        // Добавляем обработчики крафта
        document.querySelectorAll('.craft-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.disabled) return;

                const recipeId = e.target.dataset.recipeId;
                const currentHero = window.GameState.getCurrentHero();

                if (!currentHero) {
                    alert('Сначала выберите героя!');
                    return;
                }

                const result = window.GameState.craftItem(recipeId, currentHero.id);

                if (result.success) {
                    alert(result.message);
                    this.renderCraft(); // Обновляем экран крафта

                    // Если открылся новый рецепт, показываем уведомление
                    if (result.newRecipe) {
                        setTimeout(() => {
                            alert(`🔓 Открыт новый рецепт: ${result.newRecipe.name}!`);
                        }, 100);
                    }
                } else {
                    alert(result.message);
                }
            });
        });
    }

    startShopTimer() {
        if (this.shopTimer) clearInterval(this.shopTimer);

        this.shopTimer = setInterval(() => {
            const timerElement = document.querySelector('#shopTimer');
            if (timerElement) {
                const lastUpdate = window.GameState.shop.lastUpdate;
                const timeLeft = Math.max(0, 30 - Math.floor((Date.now() - lastUpdate) / 1000));
                timerElement.textContent = timeLeft;

                if (timeLeft <= 0) {
                    this.renderShop();
                }
            }
        }, 1000);
    }

    // Показать окно выбора навыка
    // Показать окно выбора навыка
    showSkillChoice(hero, skills) {
        console.log('showSkillChoice вызван с навыками:', skills);
        const modal = document.getElementById('heroModal');
        const modalBody = document.getElementById('modalBody');

        if (!modal || !modalBody) {
            console.error('Модальное окно не найдено!');
            if (window.currentArena) {
                window.currentArena.resume();
            }
            return;
        }

        if (skills.length === 0) {
            console.log('Нет доступных навыков, продолжаем игру');
            hero.pendingSkillLevel = 0;
            if (window.currentArena) {
                window.currentArena.resume();
            }
            return;
        }

        modalBody.innerHTML = `
        <h2>Выберите навык для ${hero.name} (Уровень ${hero.pendingSkillLevel})</h2>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 20px;">
            ${skills.map(skill => `
                <div class="skill-choice-card" style="background: #16213e; padding: 20px; border-radius: 10px; text-align: center; cursor: pointer; border: 2px solid #0f3460; transition: all 0.3s;" 
                     onmouseover="this.style.borderColor='#e94560'" 
                     onmouseout="this.style.borderColor='#0f3460'"
                     data-skill-id="${skill.id}">
                    <div style="font-size: 3rem;">${skill.icon}</div>
                    <h3 style="color: #e94560; margin: 10px 0;">${skill.name}</h3>
                    <p style="font-size: 0.9rem; margin-bottom: 10px;">${skill.description}</p>
                    <div style="background: #0f3460; padding: 5px; border-radius: 5px; font-size: 0.8rem;">
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
    `;

        modal.style.display = 'block';
        console.log('Модальное окно отображено');

        // Добавляем обработчики для карточек навыков
        document.querySelectorAll('.skill-choice-card').forEach(card => {
            card.addEventListener('click', () => {
                const skillId = card.dataset.skillId;
                const skill = window.GameState.skillManager.skills.find(s => s.id === skillId);

                if (skill) {
                    console.log('Выбран навык:', skill.name);
                    window.GameState.skillManager.learnSkill(hero, skillId);
                    hero.pendingSkillLevel = 0;
                    modal.style.display = 'none';
                    alert(`Герой изучил навык: ${skill.name}`);
                    this.renderHeroes(); // Обновляем отображение героев

                    // Возобновляем игру
                    if (window.currentArena) {
                        window.currentArena.resume();
                    }
                }
            });
        });

        // Добавляем обработчик для закрытия модального окна (если закроют без выбора)
        const closeModal = document.querySelector('.close-modal');
        if (closeModal) {
            // Удаляем предыдущие обработчики, чтобы не было дублирования
            const newCloseModal = closeModal.cloneNode(true);
            closeModal.parentNode.replaceChild(newCloseModal, closeModal);

            newCloseModal.addEventListener('click', () => {
                console.log('Модальное окно закрыто без выбора');
                hero.pendingSkillLevel = 0;
                modal.style.display = 'none';
                if (window.currentArena) {
                    window.currentArena.resume();
                }
            });
        }
    }

    showHeroInventory(heroId) {
        const hero = window.GameState.heroes.find(h => h.id === heroId);
        if (!hero) return;

        const modalBody = document.getElementById('modalBody');
        if (!modalBody) return;

        // Получаем общий инвентарь
        const inventory = window.GameState.inventory || [];

        modalBody.innerHTML = `
            <h2>Инвентарь ${hero.name} (${hero.type})</h2>
            <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                <div style="flex: 1;">
                    <h3>Общий инвентарь</h3>
                    <div class="inventory-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; max-height: 300px; overflow-y: auto; padding: 10px; background: #0f0f1f; border-radius: 10px;">
                        ${inventory.length > 0 ? inventory.map((item, index) => {
            if (item) {
                return `<div class="inventory-item" data-item-id="${item.id}" data-instance-id="${item.instanceId}" style="background: #16213e; padding: 10px; border-radius: 5px; text-align: center; cursor: pointer; border: 1px solid #0f3460;" 
                                         onmouseover="this.style.borderColor='#e94560'" onmouseout="this.style.borderColor='#0f3460'">
                                    <div style="font-size: 2rem;">${item.icon || '📦'}</div>
                                    <div style="font-size: 0.8rem;">${item.name}</div>
                                    <div style="font-size: 0.7rem; color: #aaa;">${item.type}</div>
                                </div>`;
            }
            return '';
        }).join('') : '<div style="grid-column: span 4; text-align: center; color: #666;">Инвентарь пуст</div>'}
                    </div>
                </div>
                
                <div style="flex: 1;">
                    <h3>Экипировка</h3>
                    <div class="equipment-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                        ${Object.entries(hero.equipment).map(([slot, item]) => `
                            <div class="equipment-slot" data-slot="${slot}" style="background: #16213e; padding: 10px; border-radius: 5px; text-align: center; min-height: 100px; border: 2px solid #0f3460;">
                                <div style="font-size: 0.8rem; color: #e94560; margin-bottom: 5px;">${slot}</div>
                                ${item ? `
                                    <div style="font-size: 2rem;">${item.icon || '📦'}</div>
                                    <div style="font-size: 0.8rem;">${item.name}</div>
                                    <button class="unequip-btn" data-hero-id="${hero.id}" data-slot="${slot}" style="font-size: 0.7rem; padding: 2px 5px; margin-top: 5px;">Снять</button>
                                ` : '<div style="color: #666; padding: 20px 0;">Пусто</div>'}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
                <button id="closeInventoryBtn" style="width: auto; padding: 10px 30px;">Закрыть</button>
            </div>
        `;

        // Добавляем обработчики для предметов в инвентаре
        document.querySelectorAll('.inventory-item').forEach(el => {
            el.addEventListener('click', (e) => {
                const itemId = e.currentTarget.dataset.itemId;
                const instanceId = e.currentTarget.dataset.instanceId;
                const item = inventory.find(i => i.id === itemId && i.instanceId === instanceId);

                if (!item) return;

                // Показываем меню экипировки
                this.showEquipMenu(hero, item);
            });
        });

        // Добавляем обработчики для кнопок снятия
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
            document.getElementById('heroModal').style.display = 'none';
        });

        document.getElementById('heroModal').style.display = 'block';
    }

    showEquipMenu(hero, item) {
        const validSlots = hero.getValidSlotsForItem(item);

        if (validSlots.length === 0) {
            alert('Этот предмет нельзя экипировать данному герою');
            return;
        }

        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <h2>Экипировка предмета</h2>
            <div style="text-align: center; margin: 20px 0;">
                <div style="font-size: 4rem;">${item.icon || '📦'}</div>
                <h3>${item.name}</h3>
                <p>${item.description || ''}</p>
            </div>
            
            <h3>Выберите слот для экипировки:</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 20px 0;">
                ${validSlots.map(slot => `
                    <button class="equip-slot-btn" data-slot="${slot}" style="background: #16213e; padding: 15px; border: 2px solid #0f3460;">
                        ${slot}
                        ${hero.equipment[slot] ? `<br><small>(занято: ${hero.equipment[slot].name})</small>` : ''}
                    </button>
                `).join('')}
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
                <button id="cancelEquipBtn" style="width: auto; padding: 10px 30px; background: #666;">Отмена</button>
            </div>
        `;

        document.querySelectorAll('.equip-slot-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const slot = e.target.dataset.slot;

                if (hero.equip(item, slot)) {
                    alert('Предмет экипирован!');
                    this.showHeroInventory(hero.id);
                } else {
                    alert('Не удалось экипировать предмет');
                }
            });
        });

        document.getElementById('cancelEquipBtn').addEventListener('click', () => {
            this.showHeroInventory(hero.id);
        });
    }

}

// Делаем глобальной
window.UIManager = UIManager;