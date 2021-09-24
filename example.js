

let state = {
    width: 6,
    height: 6,
    next_player: true,
    next_stone_id: 1,
    next_color_id: 1,

    worlds: [{
        2: {
            5: {
                id: 2,
                player1: true,
                colorID: null
            }
        },
        3: {
            5: {
                id: 1,
                player1: false,
                colorID: null
            }
        },
    },{
        3: {
            4: {
                id: 2,
                player1: true,
                colorID: null
            },
            5: {
                id: 1,
                player1: false,
                colorID: null
            }
        },
    }]
}

