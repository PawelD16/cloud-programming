namespace Tic_Tac_Toe.Data.Model
{
    public class GameMoveStatus
    {
        public required Game Game {  get; set; }

        public MoveStatus MoveStatus { get; set; }
    }
}
