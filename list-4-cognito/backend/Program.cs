using Microsoft.AspNetCore.Authentication.JwtBearer;
using Tic_Tac_Toe;
using Tic_Tac_Toe.Service;
using Tic_Tac_Toe.SignalRConfig;

var builder = WebApplication.CreateBuilder(args);

const string DEFAULT_METHOD = "http";
const string DEFAULT_IP_ADDRESS = "localhost";
const int DEFAULT_PORT = 3000;

const string CORS_NAME = "AllowSpecificOrigin";
// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

builder.Services.AddAuthorization();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer();

builder.Services.ConfigureOptions<JwtBearerConfigureOptions>();

builder.Services.AddScoped<GameService, GameService>();

string method = Environment.GetEnvironmentVariable("METHOD") ?? DEFAULT_METHOD;
string environmentIpAddress = Environment.GetEnvironmentVariable("IP_ADDRESS") ?? DEFAULT_IP_ADDRESS;

if (!int.TryParse(Environment.GetEnvironmentVariable("FRONTEND_PORT") ?? DEFAULT_PORT.ToString(), out int frontendPort))
    frontendPort = DEFAULT_PORT;

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: CORS_NAME,
        builder =>
        {
            builder.WithOrigins(
                    $"{method}://{environmentIpAddress}:{(frontendPort == 80 ? string.Empty : frontendPort)}"
                )
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

app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

app.UseCors(CORS_NAME);

app.MapControllers();

app.MapHub<GameHub>("/GameHub");

app.Run();
