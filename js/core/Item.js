// Базовый класс предмета
class Item {
    constructor(id, name, type, rarity, basePrice, icon = '📦') {
        this.id = id;
        this.name = name;
        this.type = type; // 'weapon', 'armor', 'consumable', 'material'
        this.rarity = rarity; // 'common', 'rare', 'epic', 'legendary'
        this.basePrice = basePrice;
        this.icon = icon;
        this.description = '';
    }
    
    // Получить цену в зависимости от редкости (может быть модифицирована)
    getPrice() {
        return this.basePrice;
    }
}

// Класс оружия
class Weapon extends Item {
    constructor(id, name, rarity, basePrice, stats, icon = '⚔️') {
        super(id, name, 'weapon', rarity, basePrice, icon);
        this.damage = stats.damage || 0;
        this.range = stats.range || 1; // 1 - ближний бой, 2+ - дальний
        this.attackSpeed = stats.attackSpeed || 1.0;
        this.bonusStats = stats.bonusStats || {};
        this.description = `Урон: ${this.damage}, Дальность: ${this.range}`;
    }
}

// Класс брони
class Armor extends Item {
    constructor(id, name, rarity, basePrice, stats, icon = '🛡️') {
        super(id, name, 'armor', rarity, basePrice, icon);
        this.defense = stats.defense || 0;
        this.bonusHp = stats.bonusHp || 0;
        this.bonusStats = stats.bonusStats || {};
        this.description = `Защита: ${this.defense}, HP: +${this.bonusHp}`;
    }
}

// Класс расходника
class Consumable extends Item {
    constructor(id, name, rarity, basePrice, effect, value, icon = '💗') {
        super(id, name, 'consumable', rarity, basePrice, icon);
        this.effect = effect; // 'heal', 'buff', 'resource'
        this.value = value;
        this.usableInBattle = true;
        this.description = `${effect === 'heal' ? 'Восстанавливает' : 'Дает'} ${value}`;
    }
}

// Класс материала для крафта
class Material extends Item {
    constructor(id, name, rarity, basePrice, icon = '🔨') {
        super(id, name, 'material', rarity, basePrice, icon);
        this.description = 'Используется для крафта';
    }
}

// Делаем глобальными
window.Item = Item;
window.Weapon = Weapon;
window.Armor = Armor;
window.Consumable = Consumable;
window.Material = Material;