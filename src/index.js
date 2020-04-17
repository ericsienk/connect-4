import { Game } from './game/game.component.js';
import { Board } from './board/board.component.js';
import { Piece } from './board/piece/piece.component.js';
import { Engine } from './engine/engine.js';
import { GameService } from './game/game.service.js';
import { OnlineBroker } from './game/online/online.broker.js';
import { Settings } from './game/settings/settings.component.js';

const components = [
    Game,
    Board,
    Piece,
    Settings
];

const onlineBroker = new OnlineBroker();
const gameService = new GameService(onlineBroker);

const services = {
    'gameService': gameService
}

let app = { destroy: () => true };

function render() {
    resetBtn.classList.add('hide');
    const main = document.getElementById('main');

    main.classList.add('hide');
    app.destroy();
    gameService.flushSubscribers();

    Array.from(main.querySelector('game')).forEach((e) => e.remove());
    
    app = new Engine(document.getElementById('context'), components, services);
    app.render();

    gameService.retrieveNewGame(() => {
        console.log('Retrieving new game message!');
        render();
    });

    setTimeout(() => {
        main.classList.remove('hide');
    }, 100);

    setTimeout(() => {
        resetBtn.classList.remove('hide');
    }, 3000);
}

const resetBtn = document.querySelector('#resetGameBtn');

resetBtn.addEventListener('click', () => {
    if (gameService.connected) {
        gameService.sendNewGame(() => {
            render();
        });
    } else {
        render();
    }
});

render();