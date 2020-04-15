import { Game } from './game/game.component.js';
import { Board } from './board/board.component.js';
import { Piece } from './board/piece/piece.component.js';
import { Engine } from './engine/engine.js';
import { GameService } from './game/game.service.js';
import { OnlineBroker } from './game/online/online.broker.js';

const components = [
    Game,
    Board,
    Piece
];

const onlineBroker = new OnlineBroker();
const gameService = new GameService(onlineBroker);

const services = {
    'gameService': gameService
}

const app = new Engine(document.getElementById('main'), components, services);

app.render();
