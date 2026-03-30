namespace API.DTOs;

public record CreateSollicitatieDto(
    string bedrijfsnaam, 
    string locatie,
    DateTime? datum,
    string status, 
    string? link, 
    string? notities);