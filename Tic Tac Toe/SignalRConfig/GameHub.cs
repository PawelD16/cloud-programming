using Microsoft.AspNetCore.SignalR;
using Tic_Tac_Toe.Data.Model;

namespace Tic_Tac_Toe.SignalRConfig
{
    public class GameHub : Hub
    {
        public async Task NotifyMoveMade(string gameId, GameMove gameMove)
        {
            await Clients.OthersInGroup(gameId).SendAsync("ReceiveMove", gameMove);
        }

        public async Task JoinGame(string gameId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
        }
    }
}
