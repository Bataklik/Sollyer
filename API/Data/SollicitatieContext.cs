using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class SollicitatieContext:DbContext {
    public SollicitatieContext(DbContextOptions<SollicitatieContext> options) 
        : base(options) { }
    
    public DbSet<Sollicitatie> Sollicitaties { get; set; }
    public DbSet<BedrijfInfo> Bedrijven { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        modelBuilder.Entity<BedrijfInfo>().HasData(
            new BedrijfInfo { Id = 1, Naam = "Eniris", Locatie = "Gent" },
            new BedrijfInfo { Id = 2, Naam = "Nuanso", Locatie = "Gent" }
        );
        modelBuilder.Entity<Sollicitatie>().HasData(
            new Sollicitatie { 
                Id = 1, 
                BedrijfInfoId = 1, 
                Datum = DateTime.SpecifyKind(new DateTime(2026, 3, 10), DateTimeKind.Utc), // ✅
                Status = SollicitatieStatus.InBehandeling, 
                Notities = "Vorige stageplek", 
                Link = "https://eniris.io/" 
            },
            new Sollicitatie { 
                Id = 2, 
                BedrijfInfoId = 2, 
                Datum = DateTime.SpecifyKind(new DateTime(2026, 3, 15), DateTimeKind.Utc), // ✅
                Status = SollicitatieStatus.GesprekGepland, 
                Notities = "AI advertising project", 
                Link = "https://www.nuanso.io/" 
            }
        );
    }
    
}