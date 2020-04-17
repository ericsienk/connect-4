import { Component } from "../../engine/component.js";

export class NewGame extends Component {

    constructor(engineController, gameService) {
        super(() => {
            this.engineController = engineController;
            this.gameService = gameService;

            super.onClick('#newGameBtn', () => {
                this.restart();
            });

            this.gameService.retrieveNewGame(() => {
                console.log('Retrieving new game message!');
                this.engineController.restart();
            });        
        });
    }

    restart() {
        if (this.gameService.connected) {
            this.gameService.sendNewGame(() => {
                this.engineController.restart();
            });
        } else {
            this.engineController.restart();
        }
    }

    static services = ['engineController', 'gameService'];
    static selector = 'new-game';
    static template = /*html*/`
        <div id="newGameBtn">
            Restart
        </div>
    `;
}