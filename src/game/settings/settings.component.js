import { Component } from "../../engine/component.js";
import { Players } from "../game.constants.js";

export class Settings extends Component {
    constructor(gameService) {
        super(() => {
            this.state = null;
            this.gameService = gameService;
            this.shareUrl = '';
            this.urlParams = new URLSearchParams(window.location.search);

            if (this.gameService.hasGameSession()) {
                const session = this.gameService.getNewGameSession();
                console.log(`Starting new game with previous session: ${JSON.stringify(session)}`);
                this.attr.options.onStartGame(session);
            } else if (this.urlParams.has('session')) {
                const gameId = this.urlParams.get('session');
                this.gameService.connectSession(
                    gameId,
                    (playerGoingNext) => {
                        const session = { player: Players.Yellow, online: true, playerGoingNext: playerGoingNext };
                        this.attr.options.onStartGame(session);
                        this.gameService.saveGameSession(session);
                    }
                );
            }

            super.onClick('#online-mode', () => {
                super.setClass('#online-options', 'hide', false);
                this.loader = 'Generating game session url...';
                this.gameService.creatSession(
                    (gameId) => this.onGameId(gameId),
                    (playerGoingNext) => {
                        const session = { player: Players.Red, online: true, playerGoingNext: playerGoingNext };
                        this.attr.options.onStartGame(session);
                        this.gameService.saveGameSession(session);
                    }
                );
            });

            super.onClick('#offline-mode', () => {
                super.setClass('#online-options', 'hide', true);
                const session = { player: null, online: false };
                this.attr.options.onStartGame(session);
                this.gameService.saveGameSession(session);
            });
        });
    }

    onGameId(gameId) {
        super.setClass('#share-url', 'hide', false);
        super.setInput('#share-url', window.location.href + '?session=' + gameId);
        this.loader = 'Share this url with your opponent. Please wait while your opponent enters the game.';
    }

    static services = ['gameService'];
    static selector = 'settings';
    static template = /*html*/`
        <div class="settings-menu">
            <div class="settings-header">Connect 4</div>
            <div class="settings-options">
                <div class="option">
                    <div>
                        <div class="settings-options-title">Mode</div>
                        <div>
                            <input type="radio" name="mode" id="online-mode"><label for="online-mode">Online</label>
                            <input type="radio" name="mode" id="offline-mode"><label for="offline-mode">Offline</label>
                        </div>
                    </div>
                    <br/>
                    <div id="online-options" class="hide">
                        <div class="settings-options-title">Online Session</div>
                        <div>
                            <div class="caption-text">{{this.loader}}<div>
                            <input id="share-url" onclick="this.select()" class="hide share-url">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}