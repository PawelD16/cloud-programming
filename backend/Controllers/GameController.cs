using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Tic_Tac_Toe.Data.Dto;
using Tic_Tac_Toe.Data.Model;
using Tic_Tac_Toe.Service;
using Tic_Tac_Toe.SignalRConfig;
using Tic_Tac_Toe.Utils;

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

        [Route("Start")]
        [HttpPost]
        public ActionResult<Game> Start([FromBody] Player player)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(gameService.CreateGame(player));
        }

        [Route("Connect")]
        [HttpPost]
        public ActionResult<Game> Connect([FromBody] ConnectionRequest connectionRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(gameService.ConnectToGame(connectionRequest.Player, connectionRequest.GameId));
        }

        [Route("ConnectToRandom")]
        [HttpPost]
        public ActionResult<Game> ConnectToRandom([FromBody] Player player)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(gameService.ConnectToRandomGame(player));
        }

        [Route("MakeMove")]
        [HttpPost]
        public async Task<ActionResult<GameMoveStatus>> MakeMove([FromBody] GameMove gameMove)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            GameMoveStatus gameMoveStatus = gameService.MakeMove(gameMove);
            GameMoveMoveStatus gameMoveMoveStatus = new()
            {
                GameMove = gameMove,
                MoveStatus = gameMoveStatus.MoveStatus
            };

            if (gameMoveStatus.MoveStatus == MoveStatus.WIN)
                gameMoveMoveStatus.Winner = gameMove.MoveType;

            await gameHubContext.Clients.Group(gameMove.GameId.ToString()).SendAsync("ReceiveMove", gameMoveMoveStatus);

            return Ok(gameMoveStatus);
        }

        [Route("CurrentState")]
        [HttpGet]
        public ActionResult<TicToe[]> CurrentState(string gameId)
        {
            return Ok(gameService.GetGameBoardCopy(gameId).ToOneDimesional());
        }
    }
}
