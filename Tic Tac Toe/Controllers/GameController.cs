using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Tic_Tac_Toe.Controllers.Dto;
using Tic_Tac_Toe.Data.Model;
using Tic_Tac_Toe.Service;
using Tic_Tac_Toe.SignalRConfig;

namespace Tic_Tac_Toe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly GameService gameService;
        private readonly IHubContext<GameHub> gameHubContext;

        public GameController(
            GameService gameService,
            IHubContext<GameHub> gameHubContext)
        {
            this.gameService = gameService;
            this.gameHubContext = gameHubContext;
        }

        [HttpPost]
        public ActionResult<Game> Start([FromBody] Player player)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(gameService.CreateGame(player));
        }

        [HttpPost]
        public ActionResult<Game> Connect([FromBody] ConnectionRequest connectionRequest)
        {
            return Ok(gameService.ConnectToGame(connectionRequest.Player, connectionRequest.GameId));
        }

        [HttpPost]
        public ActionResult<Game> ConnectToRandom([FromBody] Player player)
        {
            return Ok(gameService.ConnectToRandomGame(player));
        }

        [HttpPost]
        public async Task<ActionResult<GameMoveStatus>> MakeMove([FromBody] GameMove gameMove)
        {
            GameMoveStatus gameMoveStatus = gameService.MakeMove(gameMove);

            await gameHubContext.Clients.Group(gameMoveStatus.Game.Id.ToString()).SendAsync("ReceiveMove", gameMove);

            return Ok(gameMoveStatus);
        }

    }
}
