namespace API.DTOs;

public record SollicitatieResponseDto(
    int id,
    string bedrijfsnaam,
    string locatie,
    string functie,
    DateTime? datum,
    string status,
    string? link,
    string notities
    );