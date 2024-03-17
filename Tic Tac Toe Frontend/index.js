const gameBoard = document.getElementById('gameBoard');
const cells = document.querySelectorAll('[data-cell]');
const statusMessage = document.getElementById('statusMessage');
let gameId = 'someGameId'; // This should be dynamically assigned based on the game session
let currentPlayer = 'X'; // This can be X or O, and could be assigned by the server

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/gameHub")
    .build();

connection.start().then(function () {
    console.log("Connected to the game hub.");
    connection.invoke("JoinGame", gameId);
}).catch(function (err) {
    return console.error(err.toString());
});

connection.on("ReceiveMove", function (gameMove) {
    console.log("Move received", gameMove);
    // Update the UI based on the received move
    cells[gameMove.cellIndex].innerText = gameMove.player;
    checkForWinOrDraw();
});

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(index), { once: true });
});

function handleCellClick(index) {
    // Check if cell is already filled
    if (cells[index].innerText !== '') return;

    // Make a move
    cells[index].innerText = currentPlayer;
    checkForWinOrDraw();
    
    // Notify the server about the move
    const gameMove = { gameId, cellIndex: index, player: currentPlayer };
    connection.invoke("NotifyMoveMade", gameId, gameMove);
}

function checkForWinOrDraw() {
    // Implement the logic to check for win or draw
    // Update statusMessage based on game status
}

// Additional game logic (e.g., switching players, restarting the game) goes here
