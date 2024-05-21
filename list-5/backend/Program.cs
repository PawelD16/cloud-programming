using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using backend;
using backend.Models;
using backend.Services;
using Microsoft.EntityFrameworkCore;

const string DEFAULT_METHOD = "http";
const string DEFAULT_IP_ADDRESS = "localhost";
const int DEFAULT_PORT = 3000;

const string CORS_NAME = "AllowSpecificOrigin";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

builder.Services.Configure<RouteOptions>(options => options.LowercaseUrls = true);

builder.Services.Configure<AwsSettings>(builder.Configuration.GetSection("AWS"));
builder.Services.AddDbContextPool<AppDbContext>(
    options => options.UseNpgsql(
        builder.Configuration.GetConnectionString("list-5-cloud-programming")
    )
);
builder.Services.AddSingleton<S3Service>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

AwsSettings awsSettings = builder.Configuration.GetSection("AWS").Get<AwsSettings>()!;

builder.Services.AddSingleton<IAmazonS3>(sp =>
    new AmazonS3Client(
        credentials: new SessionAWSCredentials(
            awsAccessKeyId: awsSettings.AccessKey,
            awsSecretAccessKey: awsSettings.SecretKey,
            token: awsSettings.Token
        ),
        region: RegionEndpoint.GetBySystemName(awsSettings.Region)  
    )
);

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

app.UseAuthorization();

app.UseCors(CORS_NAME);

app.MapControllers();

app.Run();
