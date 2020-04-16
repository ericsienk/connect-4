import { Component } from "../engine/component.js";
import { BoardService } from "./board.service.js";
import { DefaultGrid } from '../game/game.constants.js';

function getColumn(index) {
    return /*html*/`
        <div class="board-column" id="boardColumn${index}">
            ${Array.from(Array(DefaultGrid.rows).keys()).map((a, i) => `
                    <piece id="piece${i}Row${index}" options={{this.options}}></piece>
            `).join('')}
        </div>`;
}

export class Board extends Component {
    constructor() {
        super(() => {
            this.service = new BoardService(DefaultGrid.rows, DefaultGrid.columns);
            super.onClick('.board-column', (event, columnElement, columnIndex) => {
                const color = this.options.board.playerGoingNext;
                if (!this.isMoveAllowed(event, color)) {
                    return; // ignore invalid moves
                }

                const playerMove = this.service.claimSpot(columnIndex, color);
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

    static selector = 'board';
    static template = /*html*/`
        <div class="board-container">
            ${Array.from(Array(DefaultGrid.columns).keys()).map((a, i) => getColumn(i)).join('')}
        </div>`;
}