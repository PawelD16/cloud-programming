using Tic_Tac_Toe.Service;
using Tic_Tac_Toe.SignalRConfig;

var builder = WebApplication.CreateBuilder(args);

const string DEFAULT_METHOD = "http";
const string DEFAULT_IP_ADDRESS = "localhost";
const int DEFAULT_PORT = 80;

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

builder.Services.AddScoped<GameService, GameService>();

// builder.Services.AddRouting(options => options.LowercaseUrls = true);

string method = Environment.GetEnvironmentVariable("METHOD") ?? DEFAULT_METHOD;
string environmentIpAddress = Environment.GetEnvironmentVariable("IP_ADDRESS") ?? DEFAULT_IP_ADDRESS;

if (!int.TryParse(Environment.GetEnvironmentVariable("FRONTEND_PORT") ?? DEFAULT_PORT.ToString(), out int frontendPort))
    frontendPort = DEFAULT_PORT;

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AllowSpecificOrigin",
        builder =>
        {
            builder.WithOrigins($"{method}://{environmentIpAddress}:{frontendPort}")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors("AllowSpecificOrigin");

app.MapControllers();

app.MapHub<GameHub>("/GameHub");

app.Run();
