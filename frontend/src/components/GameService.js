import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const method = process.env.METHOD || "http";
const environmentIpAddress = process.env.IP_ADDRESS || "localhost";
const backendPort = parseInt(process.env.BACKEND_PORT) || 8080;

const URL = `${method}://${environmentIpAddress}:${backendPort}`;

const API_BASE_URL = `${URL}/api/Game`;

export const TIC_TOE_MAPPING = {
  Player1: { number: 1, symbol: "X" },
  Player2: { number: 2, symbol: "O" }
};

export function findTicToeSymbolByNumber(number) {
  for (var key in TIC_TOE_MAPPING)
    if (TIC_TOE_MAPPING.hasOwnProperty(key))
      if (TIC_TOE_MAPPING[key].number === number)
        return TIC_TOE_MAPPING[key].symbol;
}

export const MOVE_STATUS_MAPPING = {
  made: 0,
  win: 1,
  draw: 2,
  illegal: 3
};

export const EMPTY_BOARD = () => {
  return Array(9).fill(undefined);
};

async function post(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}

export async function startGame(playerName) {
  const url = `${API_BASE_URL}/Start`;
  return post(url, buildPlayerObject(playerName));
}

export async function connectToRandomGame(playerName) {
  const url = `${API_BASE_URL}/ConnectToRandom`;
  return post(url, buildPlayerObject(playerName));
}

export async function connectToGame(playerName, gameId) {
  const url = `${API_BASE_URL}/Connect`;
  return post(url, buildGameObject(playerName, gameId));
}

export async function makeMove(cellIndex, moveType, gameId) {
  const url = `${API_BASE_URL}/MakeMove`;
  return post(url, buildGameMoveObject(cellIndex, moveType, gameId));
}

export function establishSignalRConnection() {
  const newConnection = new HubConnectionBuilder()
    .withUrl(`${URL}/GameHub`)
    .configureLogging(LogLevel.Information)
    .build();

  return newConnection;
}

export async function leaveGameSignalR(connection, gameId) {
  if (!gameId)
    return;

  await connection.invoke("LeaveGame", gameId)
    .catch(err => console.error(err.toString()));
  console.log(`Left game: ${gameId}`);
}

export async function joinGameSignalR(connection, gameId) {
  await connection.invoke("JoinGame", gameId)
    .catch(err => console.error(err.toString()));

  console.log(`Joined game: ${gameId}`);
}

export async function presetCells(board, gameId) {
  const newBoard = [...board];
  const response = await fetch(`${API_BASE_URL}/CurrentState?gameId=${gameId}`, { method: 'GET' });

  const cellsSymbols = await response.json();

  newBoard.forEach((_, index) => {
    newBoard[index] = findTicToeSymbolByNumber(cellsSymbols[index]);
  });

  return newBoard;
}

export function handleIllegalMove(playerSymbol, tictoe) {
  if (playerSymbol === tictoe.symbol)
    alert("Illegal move");
};

export function handleWin(playerSymbol, tictoe) {
  if (playerSymbol === tictoe.symbol)
    alert("You won!");
  else
    alert("You lost!");
};

function buildPlayerObject(playerName) {
  return { login: playerName };
}

function buildGameObject(playerName, gameId) {
  return {
    player: buildPlayerObject(playerName),
    gameId: gameId
  };
}

function buildGameMoveObject(cellIndex, moveType, gameId) {
  return {
    moveType: moveType,
    coordinateX: cellIndex % 3,
    coordinateY: Math.floor(cellIndex / 3),
    gameId: gameId
  };
}
