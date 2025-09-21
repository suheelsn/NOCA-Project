using ArticleManagementApi.DTOs;

namespace ArticleManagementApi.Services;

public interface IArticleService
{
    Task<IEnumerable<ArticleDto>> GetAllAsync(
        string? articleCategory = null,
        string? bicycleCategory = null,
        string? material = null,
        string? sortBy = null,
        bool sortDescending = false);
    
    Task<ArticleDto?> GetByIdAsync(int id);
    
    Task<ArticleDto> CreateAsync(CreateArticleDto createArticleDto);
    
    Task<ArticleDto?> UpdateAsync(int id, UpdateArticleDto updateArticleDto);
}