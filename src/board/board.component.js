import { Component } from "../engine/component.js";
import { BoardService } from "./board.service.js";
import { DefaultGrid } from '../game/game.constants.js';

export class Board extends Component {
    constructor() {
        super(() => {
            this.service = new BoardService(DefaultGrid.rows, DefaultGrid.columns);
            super.onClick('.board-column', (event, columnElement, columnIndex) => {
                const color = this.options.board.playerGoingNext;
                if (!this.isMoveAllowed(event, color)) {
                    console.log(`Ignoring move :: trusted ${event.isTrusted} :: ${JSON.stringify(this.options.board)}`);
                    return; // ignore invalid moves
                }

                const playerMove = this.service.claimSpot(columnIndex, color);
                if (!playerMove) {
                    console.log(`Space already taken :: move - ${JSON.stringify(playerMove)}`)
                    return; // piece has already been taken
                }

                columnElement.querySelectorAll('button')[playerMove.row].click();
                this.options.board.onPieceClick({columnIndex, color});

                this.isWinner = playerMove.isWinner;
                if (playerMove.isWinner) {
                    this.options.board.onWinner(color);
                }
            });

            this.options = {
                board: this.attr.options,
            }

            this.attr.options.scope.movePiece = (moveData) => {
                console.log(`Online opponent move :: ${JSON.stringify(moveData)}`);
                Array.from(this.context.querySelectorAll('.board-column'))[moveData.columnIndex].click(moveData);
            };
        });
    }

    isMoveAllowed(event, color) {
        // if local play, online opponent move, online move color matches player's color
        return !this.isWinner && (
            !this.attr.options.onlinePlayerColor ||
            !event.isTrusted ||
            (this.attr.options.onlinePlayerColor === color)
        );
    }

    static getColumn = function (index) {
        return /*html*/`
            <div class="board-column" id="boardColumn${index}">
                ${Array.from(Array(DefaultGrid.rows).keys()).map((a, i) => `
                        <piece id="piece${i}Row${index}" options={{this.options}}></piece>
                `).join('')}
            </div>`;
    };

    static selector = 'board';
    static template = /*html*/`
        <div class="board-container">
            ${Array.from(Array(DefaultGrid.columns).keys()).map((a, i) => Board.getColumn(i)).join('')}
        </div>`;
}