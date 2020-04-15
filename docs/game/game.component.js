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

            this.board = {
                onlinePlayerColor: null,
                playerGoingNext: this.players[this.turnIndex % 2],
                onWinner: (winner) => {
                    this.winner = winner;
                },
                onPieceClick: (moveData) => {
                    this.togglePlayerGoingNext();

                    if (moveData.color === this.board.onlinePlayerColor) {
                        this.gameService.sendMove(moveData, () => {
                            console.log('Player recieved action!');
                        });
                    }
                },
                scope: {}
            };

            this.settings = {
                onStartGame: ({ player, online }) => {
                    console.log(`Starting game as ${JSON.stringify(player)} :: online - ${online}`);
                    this.board.onlinePlayerColor = online ? player.name : null;
                    super.setClass('#game-settings', 'hide', true);
                    super.setClass('#game-board', 'hide', false);
                }
            }

            this.gameService.retrieveMoves((moveData) => {
                this.board.scope.movePiece(moveData);
            });
        });
    }

    togglePlayerGoingNext() {
        this.turnIndex++;
        this.board.playerGoingNext = this.players[this.turnIndex % 2];
    }

    static template = `
        <div id="game-settings">
            <settings options="{{this.settings}}"></settings>
        </div>
        <div id="game-board" class="hide">
            <div>Player that goes next: {{this.board.playerGoingNext}}</div>
            <span>{{this.winner}}</span>
            <board options="{{this.board}}"></board>
        </div>
    `;
    static selector = 'game';
}