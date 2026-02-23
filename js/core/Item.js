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

class Accessory extends Item {
    constructor(id, name, rarity, basePrice, stats, icon = '💍') {
        super(id, name, 'accessory', rarity, basePrice, icon);
        this.stats = stats;
        this.special = stats.special || null;
        
        const bonuses = [];
        if (stats.attack) bonuses.push(`⚔️ +${stats.attack} атаки`);
        if (stats.defense) bonuses.push(`🛡️ +${stats.defense} защиты`);
        if (stats.hp) bonuses.push(`❤️ +${stats.hp} здоровья`);
        if (stats.speed) bonuses.push(`👟 +${stats.speed} скорости`);
        if (stats.critChance) bonuses.push(`⭐ +${Math.round(stats.critChance*100)}% крит. шанса`);
        if (stats.critDamage) bonuses.push(`💥 +${Math.round((stats.critDamage-1.5)*100)}% крит. урона`);
        
        this.description = bonuses.join(', ');
    }
}

// Класс щита
class Shield extends Item {
    constructor(id, name, rarity, basePrice, stats, icon = '🛡️') {
        super(id, name, 'shield', rarity, basePrice, icon);
        this.stats = stats;
        this.blockChance = stats.blockChance || 0;
        this.description = `Защита: +${stats.defense || 0}, Блок: ${Math.round((stats.blockChance || 0)*100)}%`;
    }
}

// Делаем глобальными
window.Accessory = Accessory;
window.Shield = Shield;
window.Item = Item;
window.Weapon = Weapon;
window.Armor = Armor;
window.Consumable = Consumable;
window.Material = Material;