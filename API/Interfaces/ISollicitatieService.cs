using API.DTOs;

namespace API.Interfaces;

public interface ISollicitatieService {
    
    public Task<IEnumerable<SollicitatieResponseDto>> GetAllAsync();
    public Task<SollicitatieResponseDto?> GetByIdAsync(int id);
    public Task<SollicitatieResponseDto?> CreateAsync(CreateSollicitatieDto dto);
    public Task<bool> UpdateAsync(int id, UpdateSollicitatieDto dto);
    public Task<bool> DeleteAsync(int id);
}