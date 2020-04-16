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
                    super.setClass('#winner', 'hide', false);
                    super.setClass('#turn', 'hide', true);
                    setTimeout(() => {
                        super.setClass('.confetti', 'hide', false);
                    }, 750);
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
                    this.playerColor = online ? player.name : this.board.playerGoingNext;
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

    static selector = 'game';
    static template = /*html*/`
        ${Array.from(Array(10)).map(() =>'<div class="confetti hide"></div>').join('')}
        <div id="game-settings">
            <settings options="{{this.settings}}"></settings>
        </div>
        <div id="game-board" class="hide">
            <div class="info-bar">
                <span id="turn" class="info-bar-item">
                    <span class="bold">
                        {{this.board.playerGoingNext + 's turn'}}
                    </span>
                </span>
                <span id="winner" class="hide info-bar-item">
                    <span class="bold">{{this.winner + ' won!'}}</span>
                </span>
            </div>
            <board options="{{this.board}}"></board>
        </div>
    `;
}