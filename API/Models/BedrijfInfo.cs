namespace API.Models;

public class BedrijfInfo {
    public BedrijfInfo() { }

    public BedrijfInfo(int id, string naam, string locatie) {
        Id = id;
        Naam = naam;
        Locatie = locatie;
    }

    public BedrijfInfo(string naam, string locatie) {
        Naam = naam;
        Locatie = locatie;
    }
    
    public int Id { get; set; }
    public string Naam { get; set; } = string.Empty;
    public string Locatie { get; set; } = string.Empty;
}