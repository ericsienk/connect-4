import { Component } from "../../engine/component.js";
import { Players } from "../game.constants.js";

export class Settings extends Component {
    constructor(gameService) {
        super(() => {
            this.gameService = gameService;
            this.shareUrl = '';
            this.urlParams = new URLSearchParams(window.location.search);

            if (this.urlParams.has('session')) {
                const gameId = this.urlParams.get('session');
                this.gameService.connectSession(
                    gameId,
                    () => this.attr.options.onStartGame({ player: Players.Yellow, online: true })
                );
            }

            super.onClick('#online-mode', () => {
                super.setClass('#online-options', 'hide', false);
                this.loader = 'Generating game session url...';
                this.gameService.creatSession(
                    (gameId) => this.onGameId(gameId),
                    () => this.attr.options.onStartGame({ player: Players.Red, online: true })
                );
            });

            super.onClick('#offline-mode', () => {
                super.setClass('#online-options', 'hide', true);
                this.attr.options.onStartGame({ player: null, online: false });
            });
        });
    }

    onGameId(gameId) {
        super.setClass('#share-url', 'hide', false);
        super.setInput('#share-url', window.location.href + '?session=' + gameId);
        this.loader = 'Share this url with your opponent. Waiting for opponent to join...';
    }

    static selector = 'settings';
    static template = `
        <div class="settings-menu">
            <div class="settings-header">Connect 4 Settings</div>
            <div class="settings-options">
                <div class="option">
                    <div>
                        <div>Mode</div>
                        <div>
                            <input type="radio" name="mode" id="online-mode">Online
                            <input type="radio" name="mode" id="offline-mode">Offline
                        </div>
                    </div>
                    <div id="online-options" class="hide">
                        <div>Online Session</div>
                        <div>
                            <div>{{this.loader}}<div>
                            <input id="share-url" class="hide">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}