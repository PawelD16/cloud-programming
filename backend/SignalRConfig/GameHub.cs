using Microsoft.AspNetCore.SignalR;
using Tic_Tac_Toe.Data.Model;

namespace Tic_Tac_Toe.SignalRConfig
{
    public class GameHub : Hub
    {
        public async Task JoinGame(string gameId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
        }

        public Task LeaveGame(string gameId)
        {
            return Groups.RemoveFromGroupAsync(Context.ConnectionId, gameId);
        }
    }
}
