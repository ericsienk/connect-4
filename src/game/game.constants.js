export const Players = {
    Yellow: {
        name: 'Yellow',
        value: 2
    },
    Red: {
        name: 'Red',
        value: 1
    }
}

export const PlayerArray = [Players.Red.name, Players.Yellow.name];

export const DefaultGrid = {
    rows: 6,
    columns: 7
}

export const GameActions = {
    Move: '[Move] Player moves a piece',
    NEW: '[New] Play requested a new game'
}