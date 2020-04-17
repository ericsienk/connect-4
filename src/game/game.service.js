import { GameActions, PlayerArray } from "./game.constants.js";

let sessionState = null;
export class GameService {
    constructor(onlineBroker) { 
        this.onlineBroker = onlineBroker;
        this.gameCount = -1;
    }

    hasGameSession() {
        return Boolean(sessionState);
    }

    getNewGameSession() {
        if (sessionState && sessionState.playerGoingNext) {
            sessionState.playerGoingNext = this.whoGoesFirst();
        }

        return sessionState;
    }

    saveGameSession(data) {
        sessionState = data;
    }

    whoGoesFirst() {
        this.gameCount++;
        return PlayerArray[this.gameCount % 2];
    }

    creatSession(onGameId, onConnected) {
        this.onlineBroker.creatSession(onGameId, () => {
            onConnected(this.whoGoesFirst());
            this.connected = true;
        });
    }
    
    connectSession(gameId, onConnected) {
        this.onlineBroker.connectSession(gameId, () => {
            onConnected(this.whoGoesFirst());
            this.connected = true;
        });
    }
    
    retrieveMoves(onRetrieve) {
        this.onlineBroker.subscribe(GameActions.Move, onRetrieve);
    }

    sendMove(moveData, onRetrieve) {
        this.onlineBroker.send(GameActions.Move, moveData, onRetrieve);
    }

    sendNewGame(onRetrieve) {
        this.onlineBroker.send(GameActions.NEW, {}, onRetrieve);
    }

    retrieveNewGame(onRetrieve) {
        this.onlineBroker.subscribe(GameActions.NEW, onRetrieve);
    }

    flushSubscribers() {
        this.onlineBroker.subscriberMap = {};
    }
}