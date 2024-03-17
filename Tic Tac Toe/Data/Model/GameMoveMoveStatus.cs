namespace Tic_Tac_Toe.Data.Model
{
    public class GameMoveMoveStatus
    {
        public required GameMove GameMove { get; set; }
        public required MoveStatus MoveStatus { get; set; }
        public TicToe Winner { get; set; }
    }
}
