using Tic_Tac_Toe.Data.Model;

namespace Tic_Tac_Toe.Data
{
    public class GameStorage
    {
        public Dictionary<string, Game> Games { get; private set; } = [];

        private static GameStorage? instance = null;

        public static GameStorage Instance
        {
            get
            {
                instance ??= new();
                return instance;
            }
        }

        private GameStorage() { }

        public static bool UpsertGame(Game game)
        {
            return Instance.Games.TryAdd(game.Id, game);
        }

        public static Game? FindGameInStorage(string gameId)
        {
            return Instance.Games.GetValueOrDefault(gameId);
        }
    }
}
