import { GameActions } from "./game.constants.js";

export class GameService {
    constructor(onlineBroker) { 
        this.onlineBroker = onlineBroker;
    }

    creatSession(onGameId, onConnected) {
        this.onlineBroker.creatSession(onGameId, () => {
            onConnected();
        });
    }
    
    connectSession(gameId, onConnected) {
        this.onlineBroker.connectSession(gameId, () => {
            onConnected();
        });
    }
    
    retrieveMoves(onRetrieve) {
        this.onlineBroker.subscribe(GameActions.Move, onRetrieve);
    }

    sendMove(moveData, onRetrieve) {
        this.onlineBroker.send(GameActions.Move, moveData, onRetrieve);
    }
}