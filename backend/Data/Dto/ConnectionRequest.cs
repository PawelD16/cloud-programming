using Tic_Tac_Toe.Data.Model;

namespace Tic_Tac_Toe.Data.Dto
{
    public class ConnectionRequest
    {
        public required Player Player { get; set; }

        public required string GameId { get; set; }
    }
}
