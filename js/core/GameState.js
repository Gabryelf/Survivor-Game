// Хранилище состояния игры (глобальная переменная)
const GameState = {
    resources: {
        // ресурсы для миссий
        proviziya: 10,
        toplivo: 5,
        instrumenty: 3
    },
    heroes: [],
    currentHeroId: null,
    inventory: {
        // ресурсы для крафта
        wood: 0,
        metal: 0,
        cloth: 0
    },
    _listeners: [],
    subscribe(callback) {
        this._listeners.push(callback);
    },
    notify() {
        this._listeners.forEach(cb => cb(this));
    },
    updateResource(type, amount) {
        if (this.resources[type] !== undefined) {
            this.resources[type] = Math.max(0, this.resources[type] + 1);//добавить логически подходящую величину вместо 1
            this.notify();
        }
    }
};

// Делаем глобальной
window.GameState = GameState;