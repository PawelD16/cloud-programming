using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Numerics;
using Tic_Tac_Toe.Data.Dto;
using Tic_Tac_Toe.Data.Model;
using Tic_Tac_Toe.Service;
using Tic_Tac_Toe.SignalRConfig;
using Tic_Tac_Toe.Utils;

namespace Tic_Tac_Toe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class GameController : ControllerBase
    {
        private readonly GameService _gameService;
        private readonly IHubContext<GameHub> _gameHubContext;

        public GameController(GameService gameService, IHubContext<GameHub> gameHubContext)
        {
            _gameService = gameService;
            _gameHubContext = gameHubContext;
        }


        [Route("HelloWorld")]
        [HttpGet]
        public ActionResult<string> Start() => Ok("HelloWorld");

        [Route("Start")]
        [HttpPost]
        public ActionResult<Game> Start([FromBody] Player player) => ModelState.IsValid
            ? Ok(_gameService.CreateGame(player))
            : BadRequest(ModelState);

        [Route("Connect")]
        [HttpPost]
        public ActionResult<Game> Connect([FromBody] ConnectionRequest connectionRequest) => ModelState.IsValid
            ? Ok(_gameService.ConnectToGame(connectionRequest.Player, connectionRequest.GameId))
            : BadRequest(ModelState);

        [Route("ConnectToRandom")]
        [HttpPost]
        public ActionResult<Game> ConnectToRandom([FromBody] Player player) => ModelState.IsValid 
            ? Ok(_gameService.ConnectToRandomGame(player)) 
            : BadRequest(ModelState);

        [Route("MakeMove")]
        [HttpPost]
        public async Task<ActionResult<GameMoveStatus>> MakeMove([FromBody] GameMove gameMove)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            GameMoveStatus gameMoveStatus = _gameService.MakeMove(gameMove);
            GameMoveMoveStatus gameMoveMoveStatus = new()
            {
                GameMove = gameMove,
                MoveStatus = gameMoveStatus.MoveStatus
            };

            if (gameMoveStatus.MoveStatus == MoveStatus.WIN)
                gameMoveMoveStatus.Winner = gameMove.MoveType;

            await _gameHubContext.Clients.Group(gameMove.GameId.ToString()).SendAsync("ReceiveMove", gameMoveMoveStatus);

            return Ok(gameMoveStatus);
        }

        [Route("CurrentState")]
        [HttpGet]
        public ActionResult<TicToe[]> CurrentState(string gameId) => Ok(_gameService.GetGameBoardCopy(gameId).ToOneDimesional());
        
    }
}
