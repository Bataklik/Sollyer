using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public record CreateSollicitatieDto(
    [Required, MinLength(3)] string Bedrijfsnaam, 
    [Required, MinLength(3)] string Locatie,
    DateTime? Datum,
    [Required] string Status, 
    string? Link, 
    string? Notities);