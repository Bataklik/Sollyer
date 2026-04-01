using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public record UpdateSollicitatieDto(
    [MinLength(3)] string? Bedrijfsnaam,
    [MinLength(3)] string? Locatie,
    DateTime? Datum,
    string? Status,
    string? Link,
    string? Notities);