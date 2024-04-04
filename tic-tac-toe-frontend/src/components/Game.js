import React, { useState, useEffect, useRef } from "react";
import Board from "./Board";
import {
  startGame,
  connectToGame,
  connectToRandomGame,
  joinGameSignalR,
  presetCells,
  makeMove,
  establishSignalRConnection,
  leaveGameSignalR,
  handleIllegalMove,
  handleWin,
  findTicToeSymbolByNumber,
  TIC_TOE_MAPPING,
  MOVE_STATUS_MAPPING,
  EMPTY_BOARD
} from "./GameService";

function Game() {
  const [connection, setConnection] = useState(undefined);
  const [board, setBoard] = useState(EMPTY_BOARD());

  const gameIdRef = useRef(undefined);
  const playerNameRef = useRef(undefined);
  const tictoeRef = useRef(undefined);
  const isFinishedRef = useRef(false);

  // begin :: SignalR
  const handleLeaveGame = () => {
    if (connection && gameIdRef.current) {
      leaveGameSignalR(connection, gameIdRef.current);
    }
  };

  useEffect(() => {
    setConnection(establishSignalRConnection());
  }, []);

  const handleGameIdChange = async (newGameId) => {
    handleLeaveGame();

    gameIdRef.current = newGameId;
  };

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => console.log("SignalR Connected."))
        .catch(err => console.error("SignalR Connection Error: ", err));

      window.addEventListener('beforeunload', async function (e) {
        handleLeaveGame();
      });

      connection.on("ReceiveMove", (gameMoveMoveStatus) => {
        console.log("Move received", gameMoveMoveStatus);

        const gameMove = gameMoveMoveStatus.gameMove;
        const moveStatus = gameMoveMoveStatus.moveStatus;
        const cellIndex = gameMove.coordinateX + gameMove.coordinateY * 3;
        const currentSymbol = findTicToeSymbolByNumber(gameMove.moveType);

        handleNewBoard(moveStatus, cellIndex, currentSymbol);
      });
    }

    return () => {
      connection?.stop();
    };
  }, [connection]);
  // end :: SignalR

  const handleNewBoard = (moveStatus, cellIndex, currentSymbol) => {
    setBoard(prevBoard => {
      const newBoard = [...prevBoard];
      switch (moveStatus) {
        case MOVE_STATUS_MAPPING.made:
          newBoard[cellIndex] = currentSymbol;
          break;
        case MOVE_STATUS_MAPPING.win:
          newBoard[cellIndex] = currentSymbol;
          isFinishedRef.current = true;
          handleWin(currentSymbol, tictoeRef.current);

          break;
        case MOVE_STATUS_MAPPING.draw:
          alert("Draw");
          isFinishedRef.current = true;
          break;
        case MOVE_STATUS_MAPPING.illegal:
          handleIllegalMove(currentSymbol, tictoeRef.current);
          break;
        default:
          console.log(`Sorry, out of range: ${moveStatus}.`);
      }
      console.log(newBoard);
      return newBoard;
    });
  };

  const handleJoinGame = async () => {
    if (connection) {
      joinGameSignalR(connection, gameIdRef.current);
    }
  };

  const handleStartGame = async () => {
    if (!playerNameRef.current) {
      alert("Set player name to start game");
      return;
    }

    await handleNewGameReturned(await startGame(playerNameRef.current), TIC_TOE_MAPPING.Player1);

    setBoard(EMPTY_BOARD());
  };

  const handleConnectToGame = async () => {
    if (!playerNameRef.current) {
      alert("Set player name to join game");
      return;
    }

    await handleNewGameReturned(await connectToGame(playerNameRef.current, gameIdRef.current), TIC_TOE_MAPPING.Player2);

    setBoard(await presetCells(board, gameIdRef.current));
  };

  const handleConnectToRandomGame = async () => {
    if (!playerNameRef.current) {
      alert("Set player name to join random game");
      return;
    }

    await handleNewGameReturned(await connectToRandomGame(playerNameRef.current), TIC_TOE_MAPPING.Player2);

    setBoard(await presetCells(board, gameIdRef.current));
  };

  const handleMove = async (cellIndex) => {
    if (!gameIdRef.current || !tictoeRef.current || board[cellIndex] || isFinishedRef.current) {
      return;
    }

    await makeMove(cellIndex, tictoeRef.current.number, gameIdRef.current);
  };

  const handleNewGameReturned = async (game, tictoe) => {
    handleGameIdChange(game.id);

    tictoeRef.current = tictoe

    await handleJoinGame();
  };

  return (
    <div>
      <h2>Tic Tac Toe Game</h2>

      <input
        type="text"
        value={playerNameRef.current}
        onChange={(e) => { playerNameRef.current = e.target.value }}
        placeholder="Enter your name" />

      <button onClick={handleStartGame}>
        Start Game
      </button>

      <button onClick={handleConnectToRandomGame}>Connect to Random Game</button>

      <div>
        <input
          type="text"
          onChange={(e) => { handleGameIdChange(e.target.value) }}
          placeholder="Enter Game ID to connect" />

        <button onClick={handleConnectToGame}>Connect to Game</button>
      </div>

      <Board board={board} handleMove={handleMove} />
    </div>
  );
}

export default Game;
