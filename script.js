let game = {
    board: [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ],
    nextUp: "X",
    stopped: false,
    xWins: 0,
    oWins: 0,
};

// define place sound
let placeSound = new Audio("./assets/pop.mp3");

// load game if saved
const localSave = localStorage.getItem("ttt-game");
if (localSave) {
    game = JSON.parse(localSave);
    render(false, null);
}

// add click listener to reset button
document.querySelector(".reset").addEventListener("click", () => {
    // clear board
    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
            game.board[row][column] = null;
        }
    }

    // enable tile placement
    game.stopped = false;

    // save game
    localStorage.setItem("ttt-game", JSON.stringify(game));

    render(false, null);
});

// add click listeners to all tiles
document.querySelectorAll("td").forEach((el) => {
    const column = [...el.parentNode.children].indexOf(el);
    const row = [...el.parentNode.parentNode.children].indexOf(el.parentNode);

    // when a cell is clicked
    el.addEventListener("click", () => {
        // if cell is occupied, ignore
        if (game.board[row][column]) return;
        // if game is stopped, ignore
        if (game.stopped) return;

        // set cell to next sign
        game.board[row][column] = game.nextUp;

        // play pop sound when a sign is placed
        placeSound = new Audio("./assets/pop.mp3"); // otherwise it can't play until old sound finishes
        placeSound.volume = 0.5;
        placeSound.play();

        const winSign = detectWin();
        // only check the tie if there is no winner
        const isTied = winSign ? false : detectTie();

        // stop game
        if (winSign || isTied) {
            game.stopped = true;
        }

        // add score
        if (winSign == "X") {
            game.xWins++;
        } else if (winSign == "O") {
            game.oWins++;
        }

        // switch sign
        game.nextUp = game.nextUp == "X" ? "O" : "X";

        // save game
        localStorage.setItem("ttt-game", JSON.stringify(game));

        render(isTied, winSign);
    });
});

function detectWin() {
    let winSign = null;
    WINNING_POSITIONS.forEach((position) => {
        const cell1 = game.board[position[0][0]][position[0][1]];
        const cell2 = game.board[position[1][0]][position[1][1]];
        const cell3 = game.board[position[2][0]][position[2][1]];

        if (cell1 == cell2 && cell1 == cell3 && cell1 != null) {
            winSign = cell1;
        }
    });

    return winSign;
}

function detectTie() {
    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
            if (game.board[row][column] == null) return false;
        }
    }
    return true;
}

function render(isTied, winSign) {
    // loop through every cell and display symbol
    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
            const cell = document.querySelector(
                `tbody :nth-child(${row + 1}) :nth-child(${column + 1})`
            );
            cell.innerHTML = game.board[row][column];
        }
    }

    document.querySelector(".x-wins").innerHTML = "X - " + game.xWins;
    document.querySelector(".o-wins").innerHTML = "O - " + game.oWins;

    if (isTied) {
        document.querySelector(".result-display").innerHTML =
            "It's a tie... :/";
    }

    if (winSign) {
        document.querySelector(".result-display").innerHTML =
            winSign + " has won!";
    }

    // display or hide the game result message
    if (winSign || isTied) {
        document.querySelector(".result-display").classList.remove("hidden");
    } else {
        document.querySelector(".result-display").classList.add("hidden");
    }
}
