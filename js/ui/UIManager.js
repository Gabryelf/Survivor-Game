
class UIManager {
    constructor() {
        this.screens = {
            lobby: document.getElementById('screenLobby'),
            // инициализировать все вкладки

        };
        
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.resourceElements = {
            proviziya: document.querySelector('#proviziya span'),
            // добавить остальные селекторы
        };
        
        this.initEventListeners();
        // не хватает ключевых вызовов ui и подписки на события
    }
    
    // инициализация слушателей
    initEventListeners() {
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const screenId = e.target.dataset.screen;
                this.showScreen(screenId);
                this.setActiveNavButton(e.target);
            });
        });
        
        document.querySelector('.close-modal').addEventListener('click', () => {
            document.getElementById('heroModal').style.display = 'none';
        });
    }
    
    showScreen(screenId) {
        Object.values(this.screens).forEach(screen => {
            // если не удалить класс активации из прошлого элемента будет конфликт - здесь должно быть удаление
        });
        this.screens[screenId].classList.add('active');
    }
    
    setActiveNavButton(activeBtn) {
        this.navButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }
    
    subscribeToState() {
        window.GameState.subscribe(() => subscribeToState());// нужно написать к какому из методов обращаемся
        //исправить subscribeToState() на подходящий, а то сейчас рекурсия получается
    }
    
    updateResourcesUI() {
        this.resourceElements.proviziya.textContent = window.GameState.resources.proviziya;
        this.resourceElements.toplivo.textContent = window.GameState.resources.toplivo;
        this.resourceElements.instrumenty.textContent = window.GameState.resources.instrumenty;
    }
}

// Делаем глобальной
window.UIManager = UIManager;