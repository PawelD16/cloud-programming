using Tic_Tac_Toe.Data;
using Tic_Tac_Toe.Data.Model;
using Tic_Tac_Toe.Utils;

namespace Tic_Tac_Toe.Service
{
    public class GameService
    {
        private const int BOARD_SIDE_SIZE = 3;

        private static readonly Func<InvalidDataException> GAME_DOESNT_EXIST_EXCEPTION = () => new InvalidDataException("Game doesn't exist.");
        private static readonly Func<InvalidDataException> NO_GAME_FOUND = () => new InvalidDataException("No game to connect to.");
        private static readonly Func<InvalidDataException> PLAYER_2_ALREADY_SET = () => new InvalidDataException("There is already a player2.");
        private static readonly Func<InvalidDataException> GAME_FINISHED = () => new InvalidDataException("Game already finished.");

        public TicToe[,] GetGameBoardCopy(string gameId)
        {
            return GetGameById(gameId).GetBoardCopy();
        }

        public Game CreateGame(Player player1)
        {
            Game game = new(BOARD_SIDE_SIZE)
            {
                Id = UUIDGenerator.GenerateUUID(),
                Player1 = player1,
                GameState = GameState.NEW,
            };

            GameStorage.UpsertGame(game);

            return game;
        }

        public Game ConnectToGame(Player player2, string gameId)
        {
            Game game = GetGameById(gameId);

            if (game.Player2 != null)
                throw PLAYER_2_ALREADY_SET();

            return SetPlayer2(game, player2);
        }

        public Game ConnectToRandomGame(Player player2)
        {
            Game game = GameStorage.Instance
                .Games
                .Values
                .Where(_ => _.Player2 == null && _.GameState == GameState.NEW)
                .FirstOrDefault()
                ?? throw NO_GAME_FOUND();

            return SetPlayer2(game, player2);
        }

        public GameMoveStatus MakeMove(GameMove gameMove)
        {
            Game game = GetGameById(gameMove.GameId);

            if (game.GameState == GameState.FINISHED)
                throw GAME_FINISHED();

            MoveStatus movestatus = game.MakeMove(gameMove);

            GameStorage.UpsertGame(game);

            return new()
            {
                Game = game,
                MoveStatus = movestatus,
            };
        }

        private static Game GetGameById(string gameId)
        {
            return GameStorage.FindGameInStorage(gameId)
                ?? throw GAME_DOESNT_EXIST_EXCEPTION();
        }

        private static Game SetPlayer2(Game game, Player player2)
        {
            game.Player2 = player2;
            game.GameState = GameState.IN_PROGRESS;

            GameStorage.UpsertGame(game);

            return game;
        }
    }
}
