import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { fetchAuthSession } from "aws-amplify/auth";

const METHOD = process.env.REACT_APP_METHOD || "http";
const ENVIRONMENT_IP_ADDRRESS = process.env.REACT_APP_IP_ADDRESS || "localhost";
const BACKEND_PORT = parseInt(process.env.REACT_APP_BACKEND_PORT) || 8080;

const URL = `${METHOD}://${ENVIRONMENT_IP_ADDRRESS}:${BACKEND_PORT}`;
console.log(URL);
const API_BASE_URL = `${URL}/api/Game`;

export const TIC_TOE_MAPPING = {
  Player1: { number: 1, symbol: "X" },
  Player2: { number: 2, symbol: "O" }
};

export const findTicToeSymbolByNumber = (number) => {
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

const getJWTToken = async () => {
  try {
    const session = await fetchAuthSession();
    return session.tokens.idToken;
  } catch (error) {
    console.error("Error getting authentication token:", error);
    return null;
  }
}

export const makeApiCall = async (method, url, isJson, body) => {
  const authToken = await getJWTToken();

  const response = await fetch(`${API_BASE_URL}/${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    // mode: 'cors'
  });

  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.status}`);
  }

  return isJson ? response.json() : response.text();
}

export const post = async (url, body) => makeApiCall("POST", url, true, body)

export const get = async (url) => makeApiCall("GET", url, false);

export const helloWorldCall = async () => get("HelloWorld");

export const startGame = async (playerName) => post("Start", buildPlayerObject(playerName));

export const connectToRandomGame = async (playerName) => post("ConnectToRandom", buildPlayerObject(playerName));

export const connectToGame = async (playerName, gameId) => post("Connect", buildGameObject(playerName, gameId));

export const makeMove = async (cellIndex, moveType, gameId) => post("MakeMove", buildGameMoveObject(cellIndex, moveType, gameId));

export const establishSignalRConnection = async () => {
  const authToken = await getJWTToken();
  console.log(authToken);
  const newConnection = new HubConnectionBuilder()
    .withUrl(`${URL}/GameHub`, {
      accessTokenFactory: () => authToken
    })
    .configureLogging(LogLevel.Information)
    .build();

  return newConnection;
}

export const leaveGameSignalR = async (connection, gameId) => {
  if (!gameId)
    return;

  await connection.invoke("LeaveGame", gameId)
    .catch(err => console.error(err.toString()));
  console.log(`Left game: ${gameId}`);
}

export const joinGameSignalR = async (connection, gameId) => {
  await connection.invoke("JoinGame", gameId)
    .catch(err => console.error(err.toString()));

  console.log(`Joined game: ${gameId}`);
}

export const presetCells = async (board, gameId) => {
  const newBoard = [...board];

  const cellsSymbols = await get(`CurrentState?gameId=${gameId}`)

  newBoard.forEach((_, index) => {
    newBoard[index] = findTicToeSymbolByNumber(cellsSymbols[index]);
  });

  return newBoard;
}

export const handleIllegalMove = (playerSymbol, tictoe) => {
  if (playerSymbol === tictoe.symbol)
    alert("Illegal move");
};

export const handleWin = (playerSymbol, tictoe) => {
  if (playerSymbol === tictoe.symbol)
    alert("You won!");
  else
    alert("You lost!");
};

const buildPlayerObject = (playerName) => {
  return { login: playerName };
}

const buildGameObject = (playerName, gameId) => {
  return {
    player: buildPlayerObject(playerName),
    gameId: gameId
  };
}

const buildGameMoveObject = (cellIndex, moveType, gameId) => {
  return {
    moveType: moveType,
    coordinateX: cellIndex % 3,
    coordinateY: Math.floor(cellIndex / 3),
    gameId: gameId
  };
}
