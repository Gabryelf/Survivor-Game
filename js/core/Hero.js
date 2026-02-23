// ==============================
// Класс героя в игре. Типы героев и их характеристики. Инвентарь и снаряжение героев.
// ==============================
class Hero {
    constructor(id, name, baseStats, type) {
        this.id = id;
        this.name = name;
        this.type = type; // 'warrior', 'archer', 'mage' и т.д.
        this.level = 1;
        this.exp = 0;
        this.expToNextLevel = 100; // Опыта до следующего уровня
        this.isUnlocked = true; // По умолчанию разблокирован (первый герой)
        this.skills = []; // Массив полученных навыков
        this.skillManager = new SkillManager();

        // Базовые характеристики
        this.baseStats = {
            hp: baseStats.hp || 100,
            attack: baseStats.attack || 10,
            defense: baseStats.defense || 5,
            speed: baseStats.speed || 10
        };

        // Текущие характеристики (с учетом снаряжения)
        this.currentStats = { ...this.baseStats };

        // Инвентарь героя (9 слотов)
        this.inventory = new Array(9).fill(null);

        // Навыки героя
        this.skills = [];

        // Доступные очки навыков (каждые 3 уровня)
        this.skillPoints = 0;

        // Снаряжение (оружие, броня и т.д.)
        this.equipment = {
            weapon: null,
            armor: null,
            accessory: null
        };
    }

    // Добавить опыт
    addExp(amount) {
        this.exp += amount;
        while (this.exp >= this.expToNextLevel) {
            this.levelUp();
        }
    }

    // Повышение уровня
    levelUp() {
        this.level++;
        this.exp -= this.expToNextLevel;
        this.expToNextLevel = Math.floor(this.expToNextLevel * 1.5); // Увеличиваем требование опыта

        // Улучшаем характеристики
        this.baseStats.hp += 10;
        this.baseStats.attack += 2;
        this.baseStats.defense += 1;

        // Каждые 3 уровня даем очко навыка
        if (this.level % 3 === 0) {
            this.skillPoints++;
        }

        // Обновляем текущие статы
        this.updateCurrentStats();
    }

    // Обновить текущие статы с учетом снаряжения
    updateCurrentStats() {
        this.currentStats = { ...this.baseStats };

        // Добавляем бонусы от снаряжения
        if (this.equipment.weapon) {
            this.currentStats.attack += this.equipment.weapon.bonusAttack || 0;
        }
        if (this.equipment.armor) {
            this.currentStats.defense += this.equipment.armor.bonusDefense || 0;
            this.currentStats.hp += this.equipment.armor.bonusHp || 0;
        }
    }

    // Экипировать предмет
    equip(item, slot) {
        if (slot === 'weapon' || slot === 'armor' || slot === 'accessory') {
            this.equipment[slot] = item;
            this.updateCurrentStats();
        }
    }

    // Положить предмет в инвентарь (в первый свободный слот)
    addToInventory(item) {
        const emptySlot = this.inventory.findIndex(slot => slot === null);
        if (emptySlot !== -1) {
            this.inventory[emptySlot] = item;
            return true;
        }
        return false; // Инвентарь полон
    }

    // Использовать расходник (по индексу в инвентаре)
    useConsumable(slotIndex) {
        const item = this.inventory[slotIndex];
        if (item && item.type === 'consumable') {
            // Применяем эффект расходника
            if (item.effect === 'heal') {
                this.currentStats.hp = Math.min(
                    this.currentStats.hp + item.value,
                    this.baseStats.hp + (this.equipment.armor?.bonusHp || 0)
                );
            }
            // Удаляем использованный предмет
            this.inventory[slotIndex] = null;
            return true;
        }
        return false;
    }

    // Получить случайные навыки для выбора
    getSkillChoices() {
        const excludeSkills = this.skills.map(s => s.id);
        // Используем глобальный skillManager
        return window.skillManager.getRandomSkillsForHero(this.type, excludeSkills);
    }

    // Изучить навык
    learnSkill(skillId) {
        const skill = window.skillManager.getSkill(skillId);
        if (!skill) return false;

        // Проверяем, есть ли уже такой навык
        const existingSkill = this.skills.find(s => s.id === skillId);
        if (existingSkill) {
            if (existingSkill.level < existingSkill.maxLevel) {
                existingSkill.level++;
                existingSkill.applyEffect(this);
            } else {
                return false; // Максимальный уровень
            }
        } else {
            // Создаём новый экземпляр навыка
            const SkillClass = skill.constructor;
            const newSkill = new SkillClass();
            newSkill.level = 1;
            newSkill.applyEffect(this);
            this.skills.push(newSkill);
        }

        this.skillPoints--;
        return true;
    }

    // Обновить метод levelUp
    levelUp() {
        this.level++;
        this.exp -= this.expToNextLevel;
        this.expToNextLevel = Math.floor(this.expToNextLevel * 1.5);

        // Базовое увеличение характеристик
        this.baseStats.hp += 10;
        this.baseStats.attack += 2;
        this.baseStats.defense += 1;

        // Обновляем текущие статы
        this.updateCurrentStats();

        // Каждые 3 уровня даем очко навыка
        if (this.level % 3 === 0) {
            this.skillPoints++;
            console.log('Получено очко навыка! Уровень:', this.level);
            // Возвращаем true, чтобы UI знал, что нужно показать выбор
            return true;
        }
        return false;
    }

}

// Делаем глобальным
window.Hero = Hero;