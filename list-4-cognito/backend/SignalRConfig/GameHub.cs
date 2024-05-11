using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Tic_Tac_Toe.SignalRConfig
{
    public class GameHub : Hub
    {
        public async Task JoinGame(string gameId) => await Groups.AddToGroupAsync(Context.ConnectionId, gameId);

        public Task LeaveGame(string gameId) => Groups.RemoveFromGroupAsync(Context.ConnectionId, gameId);
    }
}
