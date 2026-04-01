using System.Text.Json;
using API.Data;
using API.DTOs;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class SollicitatieService : ISollicitatieService {

    private readonly SollicitatieContext _context;

    public SollicitatieService(SollicitatieContext context) {
        _context = context;
    }

    public async Task<IEnumerable<SollicitatieResponseDto>> GetAllAsync() {
        return await _context.Sollicitaties
            .Include(s => s.BedrijfInfo)
            .Select(s => ToDto(s))
            .ToListAsync();
    }
    public async Task<SollicitatieResponseDto?> GetByIdAsync(int id) {
        var sollicitatie = await _context.Sollicitaties
            .Include(s => s.BedrijfInfo)
            .FirstOrDefaultAsync(s => s.Id == id);

        return sollicitatie is null ? null : ToDto(sollicitatie);
    }
    public async Task<SollicitatieResponseDto?> CreateAsync(CreateSollicitatieDto dto) {
        var bedrijf = new BedrijfInfo(dto.Bedrijfsnaam, dto.Locatie);
        var sollicitatie = new Sollicitatie{
            BedrijfInfo = bedrijf,
            Datum = dto.Datum ?? DateTime.Today,
            Status = Enum.Parse<SollicitatieStatus>(dto.Status),
            Link = dto.Link,
            Notities = dto.Notities ?? string.Empty
        };
        _context.Sollicitaties.Add(sollicitatie);
        await _context.SaveChangesAsync();
        return ToDto(sollicitatie);
    }
    public Task UpdateAsync(int id, UpdateSollicitatieDto dto) {
        throw new NotImplementedException();
    }

    private static SollicitatieResponseDto ToDto(Sollicitatie s) => new(
        s.Id,
        s.BedrijfInfo.Naam,
        s.BedrijfInfo.Locatie,
        s.Datum,
        s.Status.ToString(),
        s.Link,
        s.Notities
    );

    public async Task<bool> DeleteAsync(int id) {
        var sollicitatie = await  _context.Sollicitaties
            .FindAsync(id);
        if (sollicitatie is null) return false;
        
        _context.Sollicitaties.Remove(sollicitatie);
        await _context.SaveChangesAsync();
        return true;
    }
}