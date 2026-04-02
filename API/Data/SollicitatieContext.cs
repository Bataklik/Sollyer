using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class SollicitatieContext:DbContext {
    public SollicitatieContext(DbContextOptions<SollicitatieContext> options) 
        : base(options) { }
    
    public DbSet<Sollicitatie> Sollicitaties { get; set; }
    public DbSet<BedrijfInfo> Bedrijven { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder) { }
    
}