using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SollicitatieController : ControllerBase {
    private readonly ISollicitatieService _service;

    public SollicitatieController(ISollicitatieService sollicitatieService) {
        _service = sollicitatieService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() {
        var sollicitaties = await _service
            .GetAllAsync();

        return Ok(sollicitaties);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id) {
        var sollicitatie = await _service
            .GetByIdAsync(id);
        if (sollicitatie == null) return NotFound();
        return Ok(sollicitatie);
    }

    [HttpPost]
    public async Task<IActionResult> CreateSollicitatie(CreateSollicitatieDto dto) {
if (string.IsNullOrEmpty(dto.Bedrijfsnaam) ||
            string.IsNullOrEmpty(dto.Status) ||
            string.IsNullOrEmpty(dto.Locatie)) return BadRequest();

        var sollicitatie = await _service.CreateAsync(dto);
        if (sollicitatie == null) return BadRequest();
        return CreatedAtAction(
            nameof(GetById),
            new{ id = sollicitatie.id }, sollicitatie
        );
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSollicitatie(int id, UpdateSollicitatieDto dto)
    {
        var result = await _service.UpdateAsync(id, dto);
        return result ? NoContent() : NotFound(); 
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSollicitatie(int id) {
        var result = await _service.DeleteAsync(id);
        return result ? NoContent() : NotFound();
    }
}