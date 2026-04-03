using API.Data;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers()
    .AddJsonOptions(opts => {
        opts.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        opts.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });
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
    db.Database.Migrate();
    
    if (!db.Bedrijven.Any())
    {
        db.Bedrijven.AddRange(
            new API.Models.BedrijfInfo { Naam = "Eniris", Locatie = "Gent" },
            new API.Models.BedrijfInfo { Naam = "Nuanso", Locatie = "Gent" }
        );
        db.SaveChanges();

        db.Sollicitaties.AddRange(
            new API.Models.Sollicitatie { BedrijfInfoId = 1, Datum = DateTime.UtcNow, Status = API.Models.SollicitatieStatus.InBehandeling, Notities = "Vorige stageplek", Link = "https://eniris.io/" },
            new API.Models.Sollicitatie { BedrijfInfoId = 2, Datum = DateTime.UtcNow, Status = API.Models.SollicitatieStatus.GesprekGepland, Notities = "AI advertising project", Link = "https://www.nuanso.io/" }
        );
        db.SaveChanges();
    }
}


if (app.Environment.IsDevelopment()) app.MapOpenApi();

app.MapGet("/", () => "Sollyer API is running! 🚀");
app.MapControllers(); 
app.Run();