using ArticleManagementApi.DTOs;
using ArticleManagementApi.Models;
using ArticleManagementApi.Repositories;
using AutoMapper;

namespace ArticleManagementApi.Services;

public class ArticleService : IArticleService
{
    private readonly IArticleRepository _articleRepository;
    private readonly IMapper _mapper;

    public ArticleService(IArticleRepository articleRepository, IMapper mapper)
    {
        _articleRepository = articleRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ArticleDto>> GetAllAsync(
        string? articleCategory = null,
        string? bicycleCategory = null,
        string? material = null,
        string? sortBy = null,
        bool sortDescending = false)
    {
        var articles = await _articleRepository.GetFilteredAsync(
            articleCategory, 
            bicycleCategory, 
            material, 
            sortBy, 
            sortDescending);
        
        return _mapper.Map<IEnumerable<ArticleDto>>(articles);
    }

    public async Task<ArticleDto?> GetByIdAsync(int id)
    {
        var article = await _articleRepository.GetByIdAsync(id);
        return article != null ? _mapper.Map<ArticleDto>(article) : null;
    }

    public async Task<ArticleDto> CreateAsync(CreateArticleDto createArticleDto)
    {
        // Check if article number already exists
        var existingArticle = await _articleRepository.ArticleNumberExistsAsync(createArticleDto.ArticleNumber);
        if (existingArticle)
        {
            throw new InvalidOperationException($"Article with number {createArticleDto.ArticleNumber} already exists.");
        }

        var article = _mapper.Map<Article>(createArticleDto);
        article.CreatedAt = DateTime.UtcNow;
        article.UpdatedAt = DateTime.UtcNow;

        var createdArticle = await _articleRepository.CreateAsync(article);
        return _mapper.Map<ArticleDto>(createdArticle);
    }

    public async Task<ArticleDto?> UpdateAsync(int id, UpdateArticleDto updateArticleDto)
    {
        // Check if article exists
        var existingArticle = await _articleRepository.GetByIdAsync(id);
        if (existingArticle == null)
        {
            return null;
        }

        // Check if article number is being changed and if it conflicts with another article
        if (existingArticle.ArticleNumber != updateArticleDto.ArticleNumber)
        {
            var articleNumberExists = await _articleRepository.ArticleNumberExistsAsync(updateArticleDto.ArticleNumber, id);
            if (articleNumberExists)
            {
                throw new InvalidOperationException($"Article with number {updateArticleDto.ArticleNumber} already exists.");
            }
        }

        var article = _mapper.Map<Article>(updateArticleDto);
        article.Id = id;
        article.CreatedAt = existingArticle.CreatedAt;
        article.UpdatedAt = DateTime.UtcNow;

        var updatedArticle = await _articleRepository.UpdateAsync(id, article);
        return updatedArticle != null ? _mapper.Map<ArticleDto>(updatedArticle) : null;
    }
}