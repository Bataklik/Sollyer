namespace API.DTOs;

public record SollicitatieResponseDto(
    int id,
    string bedrijfsnaam,
    string locatie,
    DateTime? datum,
    string status,
    string? link,
    string notities
    );