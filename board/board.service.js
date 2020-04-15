import { Players, PlayerArray } from '../game/game.constants.js';

export class BoardService {
    constructor(numberOfRows = 6, numberOfColumns = 7) {
        this.grid = Array.from(Array(numberOfRows).keys())
            .map(() => Array.from(Array(numberOfColumns).keys())
                .map(() => 0));

        const horizontal = () => this._checkLineStrategy(
            { size: 3 }, { size: 7 }, (x, y) => [{ x, y }, { x: x + 1, y }, { x: x + 2, y }, { x: x + 3, y }]
        );

        const vertical = () => this._checkLineStrategy(
            { size: 6 }, { size: 4 }, (x, y) => [{ x, y }, { x, y: y + 1 }, { x, y: y + 2 }, { x, y: y + 3 }]
        );

        const diagonalRight = () => this._checkLineStrategy(
            { size: 3 }, { size: 4 }, (x, y) => [{ x, y }, { x: x + 1, y: y + 1 }, { x: x + 2, y: y + 2 }, { x: x + 3, y: y + 3 }]
        );

        const diagonalLeft = () => this._checkLineStrategy(
            { initial: 3, size: 6 }, { size: 4 }, (x, y) => [{ x, y }, { x: x - 1, y: y + 1 }, { x: x - 2, y: y + 2 }, { x: x - 3, y: y + 3 }]
        );

        this.winnerStrategies = [horizontal, vertical, diagonalLeft, diagonalRight];
    }

    determineAvailableRowSpot(col) {
        for (let i = this.grid.length - 1; i > 0; i--) {
            if (!this.grid[i][col]) {
                return i;
            }
        }
    }

    claimSpot(col, color) {
        const row = this.determineAvailableRowSpot(col);
        this.grid[row][col] = (color === Players.Red.name) ? Players.Red.value : Players.Yellow.value;
        const moveData = this.hasWinner();
        return {
            row,
            col,
            color,
            isWinner: Boolean(moveData.player),
            winningPieces: moveData.winningPieces
        }
    }

    _checkLineStrategy(row, col, onGetLine) {
        for (let r = row.inital || 0; r < row.size; r++) {
            for (let c = col.inital || 0; c < col.size; c++) {
                const line = onGetLine(r, c);
                const lineCheck = (
                    this.grid[line[0].x][line[0].y] !== 0 &&
                    this.grid[line[0].x][line[0].y] === this.grid[line[1].x][line[1].y] &&
                    this.grid[line[0].x][line[0].y] === this.grid[line[2].x][line[2].y] &&
                    this.grid[line[0].x][line[0].y] === this.grid[line[3].x][line[3].y]
                );

                if (lineCheck) {
                    return line;
                }
            }
        }

        return [];
    }

    hasWinner() {
        let line = [];
        for (let i = 0; i < this.winnerStrategies.length; i++) {
            line = this.winnerStrategies[i]();
            if (line.length) {
                return {
                    winningPieces: line,
                    player: PlayerArray[this.grid[line[0].x][line[0].y] - 1]
                };
            }
        }

        return { winningPieces: [], player: null };
    }
}