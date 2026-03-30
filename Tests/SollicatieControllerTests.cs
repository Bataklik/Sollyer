using API.Controllers;
using API.DTOs;
using API.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
namespace Tests;

public class SollicatieControllerTests {
    private readonly Mock<ISollicitatieService> _mockService;
    private readonly SollicatieController _controller;

    public SollicatieControllerTests() {
        _mockService = new Mock<ISollicitatieService>();
        _controller = new SollicatieController(_mockService.Object);
    }

    [Fact]
    public async Task GetAll_ReturnsOkWithSollicitaties() {
        // Arrange
        var fakeSollicitaties = new List<SollicitatieResponseDto>{
            new(1, "Eniris", "Gent", DateTime.Today, "InBehandeling", "Vorige stageplek", null),
            new(2, "Nuanso", "Gent", DateTime.Today, "GesprekGepland", "AI project", null)
        };

        _mockService
            .Setup(s => s.GetAllAsync())
            .ReturnsAsync(fakeSollicitaties);
        
        // Act
        var result = await _controller.GetAll();
        
        // Assert
        var okResult = result
            .Should()
            .BeOfType<OkObjectResult>()
            .Subject;
        var data  = okResult
            .Value
            .Should()
            .BeAssignableTo<IEnumerable<SollicitatieResponseDto>>()
            .Subject;

        data.Should()
            .HaveCount(fakeSollicitaties.Count);
    }

    [Fact]
    public async Task GetById_ReturnsOkWithSollicitatie() {
        var toFindId = 2;

        // Arrange
        var fakeSollicitatie = new SollicitatieResponseDto(
            2,
            "Nuanso",
            "Gent",
            DateTime.Today,
            "GesprekGepland",
            "AI project", "Side project");
     

        _mockService
            .Setup(s => s.GetByIdAsync(toFindId))
            .ReturnsAsync(fakeSollicitatie);
        
        // Act
        var result = await _controller.GetById(toFindId);
        
        // Assert 
        var okResult = result
            .Should()
            .BeOfType<OkObjectResult>()
            .Subject;

        okResult
            .Value
            .Should()
            .BeEquivalentTo(fakeSollicitatie);
    }
    
    [Fact]
    public async Task GetById_ReturnsNotFound_WhenNotExists() {
        var toFindId = 999;

        // Arrange
        _mockService
            .Setup(s => s.GetByIdAsync(toFindId))
            .ReturnsAsync((SollicitatieResponseDto?)null);
        
        // Act
        var result = await _controller.GetById(toFindId);
        
        // Assert 
        result
            .Should()
            .BeOfType<NotFoundResult>();
    }
}