using API.Data;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddScoped<ISollicitatieService, SollicitatieService>();

/*
 builder.Services.AddDbContext<SollicitatieContext>(options =>
    options.UseSqlite("Data Source=sollicitaties.db"));
builder.Services.AddOpenApi();
*/

var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
builder.Services.AddDbContext<SollicitatieContext>(options => {
    if (!string.IsNullOrWhiteSpace(databaseUrl)) {
        var uri = new Uri(databaseUrl);
        var userInfo = uri.UserInfo.Split(':');
        var connectionString =
            $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Username={userInfo[0]};Password={userInfo[1]};SSL Mode=Require;Trust Server Certificate=true";
        options.UseNpgsql(connectionString);
    }
    else {
        options.UseNpgsql("Host=localhost;Database=sollicitaties;Username=postgres;Password=postgres");

    }
    
    options.ConfigureWarnings(w => 
        w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
});


builder.Services.AddOpenApi();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<SollicitatieContext>();
    
    // db.Database.EnsureDeleted();
    db.Database.Migrate();
    
    db.Database.Migrate();
}


if (app.Environment.IsDevelopment()) app.MapOpenApi();

app.MapControllers(); 
app.Run();