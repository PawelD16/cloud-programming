﻿using Tic_Tac_Toe.Controllers;
using Tic_Tac_Toe.Service;
using Tic_Tac_Toe.SignalRConfig;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

builder.Services.AddScoped<GameService, GameService>();

// builder.Services.AddRouting(options => options.LowercaseUrls = true);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AllowSpecificOrigin",
        builder =>
        {
            builder.WithOrigins(
                    "http://localhost:5500",
                    "https://localhost:5500",
                    "http://localhost:8081",
                    "https://localhost:8081",
                    "http://localhost:8080",
                    "https://localhost:8080",
                    "http://localhost:3000",
                    "https://localhost:3000"
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

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors("AllowSpecificOrigin");

app.MapControllers();

app.MapHub<GameHub>("/GameHub");

app.Run();
