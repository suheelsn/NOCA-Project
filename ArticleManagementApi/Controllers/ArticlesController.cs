using Microsoft.AspNetCore.Mvc;
using ArticleManagementApi.Services;
using ArticleManagementApi.DTOs;
using FluentValidation;

namespace ArticleManagementApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArticlesController : ControllerBase
{
    private readonly IArticleService _articleService;
    private readonly ILogger<ArticlesController> _logger;
    private readonly IValidator<CreateArticleDto> _createValidator;
    private readonly IValidator<UpdateArticleDto> _updateValidator;

    public ArticlesController(
        IArticleService articleService, 
        ILogger<ArticlesController> logger,
        IValidator<CreateArticleDto> createValidator,
        IValidator<UpdateArticleDto> updateValidator)
    {
        _articleService = articleService;
        _logger = logger;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    /// <summary>
    /// Get all articles with optional filtering and sorting
    /// </summary>
    /// <param name="articleCategory">Filter by article category</param>
    /// <param name="bicycleCategory">Filter by bicycle category</param>
    /// <param name="material">Filter by material</param>
    /// <param name="sortBy">Sort by field (netWeight, articleCategory)</param>
    /// <param name="sortDescending">Sort in descending order</param>
    /// <returns>List of articles</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ArticleDto>>> GetArticles(
        [FromQuery] string? articleCategory = null,
        [FromQuery] string? bicycleCategory = null,
        [FromQuery] string? material = null,
        [FromQuery] string? sortBy = null,
        [FromQuery] bool sortDescending = false)
    {
        _logger.LogInformation("Getting articles with filters - ArticleCategory: {ArticleCategory}, BicycleCategory: {BicycleCategory}, Material: {Material}, SortBy: {SortBy}, SortDescending: {SortDescending}",
            articleCategory, bicycleCategory, material, sortBy, sortDescending);

        var articles = await _articleService.GetAllAsync(articleCategory, bicycleCategory, material, sortBy, sortDescending);
        return Ok(articles);
    }

    /// <summary>
    /// Get a specific article by ID
    /// </summary>
    /// <param name="id">Article ID</param>
    /// <returns>Article details</returns>
    [HttpGet("{id}")]
    public async Task<ActionResult<ArticleDto>> GetArticle(int id)
    {
        _logger.LogInformation("Getting article with ID: {Id}", id);

        var article = await _articleService.GetByIdAsync(id);
        
        if (article == null)
        {
            _logger.LogWarning("Article with ID {Id} not found", id);
            throw new KeyNotFoundException($"Article with ID {id} not found");
        }

        return Ok(article);
    }

    /// <summary>
    /// Create a new article
    /// </summary>
    /// <param name="createArticleDto">Article creation data</param>
    /// <returns>Created article</returns>
    [HttpPost]
    public async Task<ActionResult<ArticleDto>> CreateArticle([FromBody] CreateArticleDto createArticleDto)
    {
        var validationResult = await _createValidator.ValidateAsync(createArticleDto);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        _logger.LogInformation("Creating new article with number: {ArticleNumber}", createArticleDto.ArticleNumber);

        var createdArticle = await _articleService.CreateAsync(createArticleDto);
        
        return CreatedAtAction(
            nameof(GetArticle), 
            new { id = createdArticle.Id }, 
            createdArticle);
    }

    /// <summary>
    /// Update an existing article
    /// </summary>
    /// <param name="id">Article ID</param>
    /// <param name="updateArticleDto">Article update data</param>
    /// <returns>Updated article</returns>
    [HttpPut("{id}")]
    public async Task<ActionResult<ArticleDto>> UpdateArticle(int id, [FromBody] UpdateArticleDto updateArticleDto)
    {
        var validationResult = await _updateValidator.ValidateAsync(updateArticleDto);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        _logger.LogInformation("Updating article with ID: {Id}", id);

        var updatedArticle = await _articleService.UpdateAsync(id, updateArticleDto);
        
        if (updatedArticle == null)
        {
            _logger.LogWarning("Article with ID {Id} not found for update", id);
            throw new KeyNotFoundException($"Article with ID {id} not found");
        }

        return Ok(updatedArticle);
    }
}