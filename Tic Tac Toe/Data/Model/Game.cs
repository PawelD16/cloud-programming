using Microsoft.AspNetCore.OpenApi;
using Microsoft.AspNetCore.Http.HttpResults;
namespace Tic_Tac_Toe.Data.Model
{
    public class Game(int boardSideSize)
    {
        public required string Id { get; set; }

        public required Player Player1 { get; set; }
        public Player? Player2 { get; set; }

        public required GameState GameState { get; set; }
        private TicToe[,] Board { get; set; } = new TicToe[boardSideSize, boardSideSize];

        public TicToe Winner { get; set; }

        public int AmountOfMovesDone { get; set; } = 0;

        public MoveStatus MakeMove(GameMove gameMove)
        {
            if (gameMove.CoordinateX < 0 ||
                gameMove.CoordinateX >= GetBoardSideLength() ||
                gameMove.CoordinateY < 0 ||
                gameMove.CoordinateY >= GetBoardSideLength() ||
                Board[gameMove.CoordinateX, gameMove.CoordinateY] != TicToe.NONE)
                return MoveStatus.ILLEGAL;

            Board[gameMove.CoordinateX, gameMove.CoordinateY] = gameMove.MoveType;
            ++AmountOfMovesDone;

            if (AmountOfMovesDone >= GetBoardSideLength())
                return MoveStatus.DRAW;

            if (CheckWinner(gameMove.MoveType, Board, GetBoardSideLength()))
            {
                Winner = gameMove.MoveType;
                return MoveStatus.WIN;
            }

            return MoveStatus.MADE;
        }

        private int GetBoardSideLength()
        {
            return Board.GetLength(0);
        }

        private static bool CheckWinner(TicToe stateToCheck, TicToe[,] board, int winSize)
        {
            for (int i = 0; i < board.GetLength(0); ++i)
                for (int j = 0; j < board.GetLength(0); ++j)
                    if (board[i, j] == stateToCheck)
                        if (CheckDirection(i, j, 1, 0, stateToCheck, board, winSize) || // Horizontal
                            CheckDirection(i, j, 0, 1, stateToCheck, board, winSize) || // Vertical
                            CheckDirection(i, j, 1, 1, stateToCheck, board, winSize) || // Diagonal (down-right)
                            CheckDirection(i, j, 1, -1, stateToCheck, board, winSize))  // Diagonal (down-left)
                            return true;

            return false;
        }

        private static bool CheckDirection(int startX, int startY, int dx, int dy, TicToe stateToCheck, TicToe[,] board, int winSize)
        {
            int count = 1;

            int x = startX + dx;
            int y = startY + dy;
            while (x >= 0 && x < board.GetLength(0) && y >= 0 && y < board.GetLength(0) && board[x, y] == stateToCheck)
            {
                count++;
                if (count >= winSize)
                    return true;

                x += dx;
                y += dy;
            }

            if (count < winSize)
            {
                x = startX - dx;
                y = startY - dy;
                while (x >= 0 && x < board.GetLength(0) && y >= 0 && y < board.GetLength(0) && board[x, y] == stateToCheck)
                {
                    count++;
                    if (count >= winSize)
                        return true;

                    x -= dx;
                    y -= dy;
                }
            }

            return false;
        }
    }
}
