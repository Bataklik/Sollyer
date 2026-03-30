using API.Data;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddScoped<ISollicitatieService, SollicitatieService>();
builder.Services.AddDbContext<SollicitatieContext>(options =>
    options.UseSqlite("Data Source=sollicitaties.db"));
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment()) app.MapOpenApi();

app.MapControllers();  // ✅ dit miste!
app.Run();