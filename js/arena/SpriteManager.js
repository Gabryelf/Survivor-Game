// Менеджер спрайтов для загрузки и отображения изображений
class SpriteManager {
    constructor() {
        this.sprites = {};
        this.loaded = false;
        this.loadSprites();
    }
    
    loadSprites() {
        this.createHeroSprites();
        this.createEnemySprites();
        this.createEffectSprites();
        this.loaded = true;
        console.log('Спрайты загружены');
    }
    
    createHeroSprites() {
        // Воин
        const canvasWarrior = document.createElement('canvas');
        canvasWarrior.width = 40;
        canvasWarrior.height = 40;
        const ctxWarrior = canvasWarrior.getContext('2d');
        
        ctxWarrior.fillStyle = '#4aff4a';
        ctxWarrior.beginPath();
        ctxWarrior.arc(20, 20, 18, 0, Math.PI * 2);
        ctxWarrior.fill();
        
        ctxWarrior.fillStyle = '#fff';
        ctxWarrior.beginPath();
        ctxWarrior.arc(14, 15, 4, 0, Math.PI * 2);
        ctxWarrior.arc(26, 15, 4, 0, Math.PI * 2);
        ctxWarrior.fill();
        ctxWarrior.fillStyle = '#000';
        ctxWarrior.beginPath();
        ctxWarrior.arc(14, 15, 2, 0, Math.PI * 2);
        ctxWarrior.arc(26, 15, 2, 0, Math.PI * 2);
        ctxWarrior.fill();
        
        // Шлем
        ctxWarrior.fillStyle = '#aaa';
        ctxWarrior.fillRect(10, 5, 20, 10);
        
        this.sprites.heroWarrior = canvasWarrior;
        
        // Лучник
        const canvasArcher = document.createElement('canvas');
        canvasArcher.width = 40;
        canvasArcher.height = 40;
        const ctxArcher = canvasArcher.getContext('2d');
        
        ctxArcher.fillStyle = '#4aff4a';
        ctxArcher.beginPath();
        ctxArcher.arc(20, 20, 18, 0, Math.PI * 2);
        ctxArcher.fill();
        
        ctxArcher.fillStyle = '#fff';
        ctxArcher.beginPath();
        ctxArcher.arc(14, 15, 4, 0, Math.PI * 2);
        ctxArcher.arc(26, 15, 4, 0, Math.PI * 2);
        ctxArcher.fill();
        ctxArcher.fillStyle = '#000';
        ctxArcher.beginPath();
        ctxArcher.arc(14, 15, 2, 0, Math.PI * 2);
        ctxArcher.arc(26, 15, 2, 0, Math.PI * 2);
        ctxArcher.fill();
        
        // Лук
        ctxArcher.strokeStyle = '#8B4513';
        ctxArcher.lineWidth = 3;
        ctxArcher.beginPath();
        ctxArcher.arc(30, 15, 10, 0, Math.PI);
        ctxArcher.stroke();
        
        this.sprites.heroArcher = canvasArcher;
        
        // Маг
        const canvasMage = document.createElement('canvas');
        canvasMage.width = 40;
        canvasMage.height = 40;
        const ctxMage = canvasMage.getContext('2d');
        
        ctxMage.fillStyle = '#aa4aff';
        ctxMage.beginPath();
        ctxMage.arc(20, 20, 18, 0, Math.PI * 2);
        ctxMage.fill();
        
        ctxMage.fillStyle = '#fff';
        ctxMage.beginPath();
        ctxMage.arc(14, 15, 4, 0, Math.PI * 2);
        ctxMage.arc(26, 15, 4, 0, Math.PI * 2);
        ctxMage.fill();
        ctxMage.fillStyle = '#000';
        ctxMage.beginPath();
        ctxMage.arc(14, 15, 2, 0, Math.PI * 2);
        ctxMage.arc(26, 15, 2, 0, Math.PI * 2);
        ctxMage.fill();
        
        // Посох
        ctxMage.strokeStyle = '#8B4513';
        ctxMage.lineWidth = 4;
        ctxMage.beginPath();
        ctxMage.moveTo(32, 5);
        ctxMage.lineTo(38, 30);
        ctxMage.stroke();
        
        // Кристалл
        ctxMage.fillStyle = '#ff00ff';
        ctxMage.beginPath();
        ctxMage.arc(35, 8, 5, 0, Math.PI * 2);
        ctxMage.fill();
        
        this.sprites.heroMage = canvasMage;
        
        // Разбойник
        const canvasRogue = document.createElement('canvas');
        canvasRogue.width = 40;
        canvasRogue.height = 40;
        const ctxRogue = canvasRogue.getContext('2d');
        
        ctxRogue.fillStyle = '#4a4aff';
        ctxRogue.beginPath();
        ctxRogue.arc(20, 20, 18, 0, Math.PI * 2);
        ctxRogue.fill();
        
        ctxRogue.fillStyle = '#fff';
        ctxRogue.beginPath();
        ctxRogue.arc(14, 15, 4, 0, Math.PI * 2);
        ctxRogue.arc(26, 15, 4, 0, Math.PI * 2);
        ctxRogue.fill();
        ctxRogue.fillStyle = '#000';
        ctxRogue.beginPath();
        ctxRogue.arc(14, 15, 2, 0, Math.PI * 2);
        ctxRogue.arc(26, 15, 2, 0, Math.PI * 2);
        ctxRogue.fill();
        
        // Капюшон
        ctxRogue.fillStyle = '#333';
        ctxRogue.fillRect(10, 5, 20, 12);
        
        // Кинжалы
        ctxRogue.fillStyle = '#aaa';
        ctxRogue.fillRect(28, 12, 10, 3);
        ctxRogue.fillRect(30, 8, 3, 10);
        
        this.sprites.heroRogue = canvasRogue;
        
        // Для обратной совместимости
        this.sprites.hero = canvasWarrior;
        this.sprites.heroBow = canvasArcher;
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
        
        // Зелье
        const canvasPotion = document.createElement('canvas');
        canvasPotion.width = 20;
        canvasPotion.height = 20;
        const ctxPotion = canvasPotion.getContext('2d');
        
        ctxPotion.fillStyle = '#ff4a4a';
        ctxPotion.beginPath();
        ctxPotion.ellipse(10, 12, 6, 8, 0, 0, Math.PI * 2);
        ctxPotion.fill();
        
        ctxPotion.fillStyle = '#fff';
        ctxPotion.fillRect(8, 4, 4, 4);
        
        this.sprites.potion = canvasPotion;
    }
    
    getSprite(type, variant = 'default') {
        if (type === 'hero') {
            return this.sprites.heroWarrior || this.sprites.hero;
        }
        if (type === 'heroWarrior') return this.sprites.heroWarrior;
        if (type === 'heroArcher') return this.sprites.heroArcher;
        if (type === 'heroMage') return this.sprites.heroMage;
        if (type === 'heroRogue') return this.sprites.heroRogue;
        if (type === 'heroBow') return this.sprites.heroArcher || this.sprites.heroBow;
        
        return this.sprites[type] || this.sprites.goblin;
    }
}

// Делаем глобальным
window.SpriteManager = SpriteManager;