using ArticleManagementApi.Models;

namespace ArticleManagementApi.Repositories;

public interface IArticleRepository
{
    Task<IEnumerable<Article>> GetAllAsync();
    Task<IEnumerable<Article>> GetFilteredAsync(
        string? articleCategory = null,
        string? bicycleCategory = null,
        string? material = null,
        string? sortBy = null,
        bool sortDescending = false);
    Task<Article?> GetByIdAsync(int id);
    Task<Article?> GetByArticleNumberAsync(int articleNumber);
    Task<Article> CreateAsync(Article article);
    Task<Article?> UpdateAsync(int id, Article article);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
    Task<bool> ArticleNumberExistsAsync(int articleNumber, int? excludeId = null);
}