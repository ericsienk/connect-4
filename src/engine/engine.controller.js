export class EngineController {
    constructor(selector, onCreateEngine) {
        this.context = document.querySelector(selector);
        this.onCreateEngine = onCreateEngine;
        this.initialContextHTML = this.context.innerHTML;
        this.context.classList.add('hide');
    }

    start() {
        this.engine = this.onCreateEngine(this.context);
        setTimeout(() => {
            this.context.classList.remove('hide');
        }, 100);
    }

    restart() {
        this.context.classList.add('hide');
        this.engine.destroy();
        this.context.innerHTML = this.initialContextHTML;
        delete this.engine;
        this.start();
    }
}