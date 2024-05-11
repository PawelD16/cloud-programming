namespace Tic_Tac_Toe.Data.Model
{
    public class GameMove
    {
        public TicToe MoveType { get; set; }
        public int CoordinateX { get; set; }
        public int CoordinateY { get; set; }

        public required string GameId { get; set; }

    }
}
