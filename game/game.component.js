import { Component } from "../engine/component.js";
import { PlayerArray, Players } from './game.constants.js';

export class Game extends Component {
    constructor(gameService) {
        super(() => {
            this.gameService = gameService;
            this.thinking = false;
            this.winner = '';
            this.turnIndex = 0;
            this.players = PlayerArray;
            this.gameId = '';
            this.options = {
                onlinePlayerColor: null,
                playerGoingNext: this.players[this.turnIndex % 2],
                onWinner: (winner) => {
                    this.winner = winner;
                },
                onPieceClick: (moveData) => {
                    this.togglePlayerGoingNext();

                    if (moveData.color === this.options.onlinePlayerColor) {
                        this.gameService.sendMove(moveData, () => {
                            console.log('Player recieved action!');
                        });
                    }
                },
                scope: {}
            };

            this.gameService.retrieveMoves((moveData) => {
                this.options.scope.movePiece(moveData);
            });

            super.onClick('#generateCodeBtn', () => {
                this.thinking = true;
                this.gameService.creatSession((gameId) => {
                    this.thinking = false;
                    super.setInput('input', gameId);
                }, () => {
                        this.online = true;
                        this.options.onlinePlayerColor = Players.Red.name;
                        console.log('Start game!');
                });
            });

            super.onClick('#connectCodeBtn', () => {
                this.gameService.connectSession(super.getInput('input'), () => {
                    this.online = true;
                    this.options.onlinePlayerColor = Players.Yellow.name;
                    console.log('Start game!');
                });
            });
        });
    }

    togglePlayerGoingNext() {
        this.turnIndex++;
        this.options.playerGoingNext = this.players[this.turnIndex % 2];
    }

    static template = `
        <input>
        <button id="generateCodeBtn">Generate Code</button>
        <button id="connectCodeBtn">Connect Code</button>
        <button id="sendDataBtn">Send Data</button>
        <span>Thinking: {{this.thinking}}</span>
        <div>Player that goes next: {{this.options.playerGoingNext}}</div>
        <div style="display: inline-block">{{this.winner}}</div>
        <board options="{{this.options}}"></board>
    `;
    static selector = 'game';
}