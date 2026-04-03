using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace API.DTOs;

public record UpdateSollicitatieDto(
    [MinLength(3)][property: JsonPropertyName("bedrijfsnaam")] string? Bedrijfsnaam,
    [MinLength(3)][property: JsonPropertyName("locatie")] string? Locatie,
    [property: JsonPropertyName("functie")] string? Functie,
    [property: JsonPropertyName("datum")] DateTime? Datum,
    [property: JsonPropertyName("status")] string? Status,
    [property: JsonPropertyName("link")] string? Link,
    [property: JsonPropertyName("notities")] string? Notities);
