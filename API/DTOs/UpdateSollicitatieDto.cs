namespace API.DTOs;

public record UpdateSollicitatieDto(
    string bedrijfsnaam,
    string locatie,
    string status,
    string link,
    string notities);