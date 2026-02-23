// Базовый класс навыка
class Skill {
    constructor(id, name, description, icon, classRestriction = null) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.classRestriction = classRestriction; // 'warrior', 'archer', 'mage', null - для всех
        this.level = 0;
        this.maxLevel = 3;
    }
    
    // Применение эффекта навыка к герою
    applyEffect(hero) {
        console.log(`Применён навык ${this.name} к герою ${hero.name}`);
    }
    
    // Получить описание с учётом уровня
    getDescription() {
        return this.description;
    }
}

// Навык увеличения здоровья
class HealthSkill extends Skill {
    constructor() {
        super('health_1', 'Крепкое здоровье', 'Увеличивает максимальное здоровье', '❤️');
    }
    
    applyEffect(hero) {
        hero.baseStats.hp += 20 * (this.level + 1);
        hero.currentStats.hp += 20 * (this.level + 1);
    }
    
    getDescription() {
        return `+${20 * (this.level + 1)} к максимальному здоровью`;
    }
}

// Навык увеличения атаки
class AttackSkill extends Skill {
    constructor() {
        super('attack_1', 'Острые клинки', 'Увеличивает атаку', '⚔️');
    }
    
    applyEffect(hero) {
        hero.baseStats.attack += 5 * (this.level + 1);
        hero.currentStats.attack += 5 * (this.level + 1);
    }
    
    getDescription() {
        return `+${5 * (this.level + 1)} к атаке`;
    }
}

// Навык увеличения защиты
class DefenseSkill extends Skill {
    constructor() {
        super('defense_1', 'Крепкая броня', 'Увеличивает защиту', '🛡️');
    }
    
    applyEffect(hero) {
        hero.baseStats.defense += 3 * (this.level + 1);
        hero.currentStats.defense += 3 * (this.level + 1);
    }
    
    getDescription() {
        return `+${3 * (this.level + 1)} к защите`;
    }
}

// Навык скорости
class SpeedSkill extends Skill {
    constructor() {
        super('speed_1', 'Быстрые ноги', 'Увеличивает скорость передвижения', '👟');
    }
    
    applyEffect(hero) {
        hero.baseStats.speed += 5 * (this.level + 1);
        hero.currentStats.speed += 5 * (this.level + 1);
    }
    
    getDescription() {
        return `+${5 * (this.level + 1)} к скорости`;
    }
}

// Навык вампиризма (воин)
class VampireSkill extends Skill {
    constructor() {
        super('vampire_1', 'Кровавая жажда', 'Восстанавливает здоровье при убийстве', '🧛', 'warrior');
    }
    
    getDescription() {
        return `Восстанавливает ${5 + this.level * 2} HP при убийстве врага`;
    }
}

// Навык двойной выстрел (лучник)
class DoubleShotSkill extends Skill {
    constructor() {
        super('doubleshot_1', 'Двойной выстрел', 'Шанс выпустить 2 стрелы', '🏹', 'archer');
    }
    
    getDescription() {
        return `${10 + this.level * 5}% шанс выпустить 2 стрелы`;
    }
}

// Навык огненный шар (маг)
class FireballSkill extends Skill {
    constructor() {
        super('fireball_1', 'Огненный шар', 'Атака прожигает броню', '🔥', 'mage');
    }
    
    getDescription() {
        return `Атака игнорирует ${5 + this.level * 3} защиты`;
    }
}

// Менеджер навыков
class SkillManager {
    constructor() {
        this.allSkills = [
            new HealthSkill(),
            new AttackSkill(),
            new DefenseSkill(),
            new SpeedSkill(),
            new VampireSkill(),
            new DoubleShotSkill(),
            new FireballSkill()
        ];
    }
    
    // Получить случайные навыки для выбора (3 шт) с учётом класса героя
    getRandomSkillsForHero(heroClass, excludeSkills = []) {
        // Фильтруем подходящие навыки
        const availableSkills = this.allSkills.filter(skill => 
            (!skill.classRestriction || skill.classRestriction === heroClass) &&
            !excludeSkills.includes(skill.id) &&
            skill.level < skill.maxLevel
        );
        
        // Перемешиваем и берём 3
        const shuffled = [...availableSkills].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
    }
    
    // Получить навык по ID
    getSkill(skillId) {
        return this.allSkills.find(s => s.id === skillId);
    }
}

// Делаем глобальными
window.Skill = Skill;
window.HealthSkill = HealthSkill;
window.AttackSkill = AttackSkill;
window.DefenseSkill = DefenseSkill;
window.SpeedSkill = SpeedSkill;
window.VampireSkill = VampireSkill;
window.DoubleShotSkill = DoubleShotSkill;
window.FireballSkill = FireballSkill;
window.SkillManager = SkillManager;