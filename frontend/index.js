const url = "https://localhost:8080";

const apiUrl = `${url}/api/Game`;
let playerName;
let gameId;
let tictoe;
let gameState;

const tictoeMapping = {
    Player1: {number: 1, symbol: "X"},
    Player2: {number: 2, symbol: "O"}
};

const moveStatusMapping = {
    made: 0,
    win: 1,
    draw: 2,
    illegal: 3
};

const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${url}/GameHub`)
    .configureLogging(signalR.LogLevel.Information)
    .build();

function setPlayerName() {
    const playerNameInput = document.getElementById("playerName");
    if (playerNameInput.value == undefined || playerNameInput.value == "")
        return;
    playerName = playerNameInput.value;
}


async function startGame() {

    setPlayerName();
    
    if (playerName == undefined) {
        alert("Set player name to start game");
        return;
    }

    const player = buildPlayerObject();
    console.log(JSON.stringify(player));
    const response = await fetch(`${apiUrl}/Start`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(player),
    });
    handleNewGameReturned(await response.json());

    tictoe = tictoeMapping.Player1; // X is the starter

    await joinGame(gameId);
}

async function connectToGameGeneric(isRandom) {
    setPlayerName();

    if (playerName == undefined) {
        alert("Set player name to join game");
        return;
    }

    const connectionRequest = isRandom ? buildPlayerObject() : buildGameObject();
    
    const response = await fetch(`${apiUrl}/${isRandom ? "ConnectToRandom" : "Connect"}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(connectionRequest),
    });
    handleNewGameReturned(await response.json());

    tictoe = tictoeMapping.Player2; // O is the joiner

    presetCells();

    await joinGame(gameId);
}

async function connectToGame() {
    await connectToGameGeneric(false);
}

async function connectToRandomGame() {
    await connectToGameGeneric(true);
}

async function makeMove(cellIndex) {

    if (playerName == undefined || gameId == undefined || tictoe == undefined) {
        alert("You must connect to a game and enter your name to play");
        return;
    }

    const cell = document.querySelector(`[data-cell-index="${cellIndex}"]`);
    if (cell.innerText !== "" || checkIfGameIsOver()) {
        return;
    }

    console.log(`Move made on cell index: ${cellIndex}`);

    const gameMove = buildGameMoveObject(cellIndex);

    const response = await fetch(`${apiUrl}/MakeMove`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameMove),
    });

    const gameMoveStatus = await response.json();

    handleNewGameReturned(gameMoveStatus.game);    
}

function findTicToeSymbolByNumber(number) {
    for (var key in tictoeMapping)
        if (tictoeMapping.hasOwnProperty(key))
            if (tictoeMapping[key].number === number)
                return tictoeMapping[key].symbol;
}

// SignalR connection
connection.on("ReceiveMove", function (gameMoveMoveStatus) {
    console.log("Move received", gameMoveMoveStatus);
    const gameMove = gameMoveMoveStatus.gameMove;

    const cellIndex = gameMove.coordinateX + gameMove.coordinateY * 3;
    const currentSymbol = findTicToeSymbolByNumber(gameMove.moveType);
    const shouldBeDisabled = currentSymbol == tictoe.symbol;

    document.querySelectorAll('.cell').forEach(cell => { cell.disabled = shouldBeDisabled; });

    const cell = document.querySelector(`[data-cell-index="${cellIndex}"]`);

    handleMoveStatus(gameMoveMoveStatus.moveStatus, cell, currentSymbol);
});

async function presetCells() {

    const response = await fetch(`${apiUrl}/CurrentState?gameId=${gameId}`, { method: 'GET' });

    const cellsSymbols = await response.json();

    document.querySelectorAll('.cell').forEach(cell => {
        const cellIndex = cell.getAttribute('data-cell-index');
        const symbol = findTicToeSymbolByNumber(cellsSymbols[cellIndex]);
        if (symbol != undefined)
            cell.innerText = symbol;
    });
}

async function startSignalRConnection() {
    try {
        await connection.start();
        console.log("SignalR Connected.");
    } catch (err) {
        console.error(err);
        setTimeout(startSignalRConnection, 5000);
    }
}

async function joinGame(gameId) {
    await connection.invoke("JoinGame", gameId)
        .catch(err => console.error(err.toString()));

    console.log(`Joined game: ${gameId}`);
}

async function leaveGame(gameId) {
    await connection.invoke("LeaveGame", gameId)
        .catch(err => console.error(err.toString()));
    console.log(`Left game: ${gameId}`);
}

document.querySelectorAll('.cell').forEach(cell => {
    var cellIndex = cell.getAttribute('data-cell-index');

    cell.addEventListener('click', function() { makeMove(cellIndex) });
});

function checkIfGameIsOver() {
    return gameState >= 2;
}

function handleMoveStatus(moveStatus, cell, playerSymbol) {
    switch (moveStatus) {
        case moveStatusMapping.made:
            cell.innerText = playerSymbol;
            break;
        case moveStatusMapping.win:
            cell.innerText = playerSymbol;
            handleWin(playerSymbol);
            break;
        case moveStatusMapping.draw:
            alert("Draw");
            break;
        case moveStatusMapping.illegal:
            handleIllegalMove();
            break;
        default:
            console.log(`Sorry, we are out of ${moveStatus}.`);
    }
}

function handleIllegalMove() {
    if (playerSymbol == tictoe.symbol)
        alert("Illegal move");
}

function handleWin(playerSymbol) {
    if (playerSymbol == tictoe.symbol)
        alert("You won!");
    else
        alert("You lost!");

}

function handleNewGameReturned(game) {
    gameId = game.id;
    gameState = game.gameState;
}

function buildPlayerObject() {
    return { login: playerName };
}

function buildGameObject() {
    return {
        player: buildPlayerObject(), 
        gameId: document.getElementById("gameIdInput").value 
    };
}

function buildGameMoveObject(cellIndex) {
    return { 
        moveType: tictoe.number, 
        coordinateX: cellIndex % 3,
        coordinateY: Math.floor(cellIndex / 3),
        gameId: gameId 
    };
}

window.addEventListener('beforeunload', function (e) {
    if (gameId == undefined)
        return;

    leaveGame(gameId);
});

startSignalRConnection();
