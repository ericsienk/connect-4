import { Component } from '../../engine/component.js';

export class Piece extends Component {
    constructor() {
        super(() => {
            this.pieceColor = 'default'
            super.onClick('.slot button', (event, element) => {
                if (!this.playerHasClaimed) {
                    const slot = element.parentElement;
                    slot.classList.remove(this.pieceColor);
                    slot.classList.add(this.attr.options.board.playerGoingNext);
                    this.pieceColor = this.attr.options.board.playerGoingNext;
                    this.playerHasClaimed = true;
                    event.stopImmediatePropagation();
                }
            });
        });
    }

    static selector = 'piece';
    static template = /*html*/`
    <div class="slot-container">
        <div class="slot default">
            <button style="display:none"></button>
        </div>
    <div>`;
}