import { Game } from './game/game.component.js';
import { Board } from './board/board.component.js';
import { Piece } from './board/piece/piece.component.js';
import { Engine } from './engine/engine.js';
import { GameService } from './game/game.service.js';
import { OnlineBroker } from './game/online/online.broker.js';
import { Settings } from './game/settings/settings.component.js';
import { EngineController } from './engine/engine.controller.js';
import { NewGame } from './game/settings/new-game.component.js';

const components = [
    Game,
    Board,
    Piece,
    Settings,
    NewGame
];

const services = {};
const onlineBroker = new OnlineBroker();
const gameService = new GameService(onlineBroker);
const engineController = new EngineController('#context', (context) => {
    gameService.flushSubscribers();
    return new Engine(context, components, services);
});

services['gameService'] = gameService;
services['engineController'] = engineController;
    
engineController.start();