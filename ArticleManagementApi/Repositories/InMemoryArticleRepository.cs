using ArticleManagementApi.Models;
using System.Collections.Concurrent;

namespace ArticleManagementApi.Repositories;

public class InMemoryArticleRepository : IArticleRepository
{
    private readonly ConcurrentDictionary<int, Article> _articles;
    private int _nextId = 1;

    public InMemoryArticleRepository()
    {
        _articles = new ConcurrentDictionary<int, Article>();
        SeedData();
    }

    public Task<IEnumerable<Article>> GetAllAsync()
    {
        var articles = _articles.Values.OrderBy(a => a.ArticleNumber).AsEnumerable();
        return Task.FromResult(articles);
    }

    public Task<IEnumerable<Article>> GetFilteredAsync(
        string? articleCategory = null,
        string? bicycleCategory = null,
        string? material = null,
        string? sortBy = null,
        bool sortDescending = false)
    {
        var query = _articles.Values.AsQueryable();

        // Apply filters
        if (!string.IsNullOrEmpty(articleCategory))
        {
            query = query.Where(a => a.ArticleCategory.Equals(articleCategory, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrEmpty(bicycleCategory))
        {
            // Split the comma-separated bicycle categories from the filter
            var filterCategories = bicycleCategory.Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(c => c.Trim())
                .ToList();

            // Filter articles that match any of the selected bicycle categories
            query = query.Where(a => 
                filterCategories.Any(filterCat => 
                    a.BicycleCategory.Split(',', StringSplitOptions.RemoveEmptyEntries)
                        .Any(articleCat => articleCat.Trim().Equals(filterCat, StringComparison.OrdinalIgnoreCase))
                )
            );
        }

        if (!string.IsNullOrEmpty(material))
        {
            query = query.Where(a => a.Material.Equals(material, StringComparison.OrdinalIgnoreCase));
        }

        // Apply sorting
        if (!string.IsNullOrEmpty(sortBy))
        {
            query = sortBy.ToLower() switch
            {
                "articlenumber" => sortDescending ? query.OrderByDescending(a => a.ArticleNumber) : query.OrderBy(a => a.ArticleNumber),
                "name" => sortDescending ? query.OrderByDescending(a => a.Name) : query.OrderBy(a => a.Name),
                "articlecategory" => sortDescending ? query.OrderByDescending(a => a.ArticleCategory) : query.OrderBy(a => a.ArticleCategory),
                "bicyclecategory" => sortDescending ? query.OrderByDescending(a => a.BicycleCategory) : query.OrderBy(a => a.BicycleCategory),
                "material" => sortDescending ? query.OrderByDescending(a => a.Material) : query.OrderBy(a => a.Material),
                "netweightingramm" => sortDescending ? query.OrderByDescending(a => a.NetWeightInGramm) : query.OrderBy(a => a.NetWeightInGramm),
                "lengthinmm" => sortDescending ? query.OrderByDescending(a => a.LengthInMm) : query.OrderBy(a => a.LengthInMm),
                "widthinmm" => sortDescending ? query.OrderByDescending(a => a.WidthInMm) : query.OrderBy(a => a.WidthInMm),
                "heightinmm" => sortDescending ? query.OrderByDescending(a => a.HeightInMm) : query.OrderBy(a => a.HeightInMm),
                _ => query.OrderBy(a => a.ArticleNumber)
            };
        }
        else
        {
            query = query.OrderBy(a => a.ArticleNumber);
        }

        return Task.FromResult(query.AsEnumerable());
    }

    public Task<Article?> GetByIdAsync(int id)
    {
        _articles.TryGetValue(id, out var article);
        return Task.FromResult(article);
    }

    public Task<Article?> GetByArticleNumberAsync(int articleNumber)
    {
        var article = _articles.Values.FirstOrDefault(a => a.ArticleNumber == articleNumber);
        return Task.FromResult(article);
    }

    public Task<Article> CreateAsync(Article article)
    {
        article.Id = _nextId++;
        article.CreatedAt = DateTime.UtcNow;
        article.UpdatedAt = DateTime.UtcNow;
        
        _articles.TryAdd(article.Id, article);
        return Task.FromResult(article);
    }

    public Task<Article?> UpdateAsync(int id, Article article)
    {
        if (!_articles.TryGetValue(id, out var existingArticle))
        {
            return Task.FromResult<Article?>(null);
        }

        article.Id = id;
        article.CreatedAt = existingArticle.CreatedAt;
        article.UpdatedAt = DateTime.UtcNow;
        
        _articles.TryUpdate(id, article, existingArticle);
        return Task.FromResult<Article?>(article);
    }

    public Task<bool> DeleteAsync(int id)
    {
        return Task.FromResult(_articles.TryRemove(id, out _));
    }

    public Task<bool> ExistsAsync(int id)
    {
        return Task.FromResult(_articles.ContainsKey(id));
    }

    public Task<bool> ArticleNumberExistsAsync(int articleNumber, int? excludeId = null)
    {
        var exists = _articles.Values.Any(a => a.ArticleNumber == articleNumber && (excludeId == null || a.Id != excludeId));
        return Task.FromResult(exists);
    }

    private void SeedData()
    {
        var sampleArticles = new[]
        {
            new Article
            {
                Id = _nextId++,
                ArticleNumber = 100291,
                Name = "e-Cargo bike hub speed 10x",
                ArticleCategory = "Hub",
                BicycleCategory = "e-Cargo bike",
                Material = "Aluminium",
                LengthInMm = 110,
                WidthInMm = 100,
                HeightInMm = 20,
                NetWeightInGramm = 210,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Article
            {
                Id = _nextId++,
                ArticleNumber = 100292,
                Name = "Road hub flex",
                ArticleCategory = "Hub",
                BicycleCategory = "Road",
                Material = "Steel",
                LengthInMm = 100,
                WidthInMm = 90,
                HeightInMm = 20,
                NetWeightInGramm = 300,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Article
            {
                Id = _nextId++,
                ArticleNumber = 100293,
                Name = "Gravel hub speed pro",
                ArticleCategory = "Hub",
                BicycleCategory = "Gravel, e-Gravel",
                Material = "Alloy",
                LengthInMm = 90,
                WidthInMm = 80,
                HeightInMm = 30,
                NetWeightInGramm = 120,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Article
            {
                Id = _nextId++,
                ArticleNumber = 100294,
                Name = "e-Trekking hub speed flex",
                ArticleCategory = "Hub",
                BicycleCategory = "e-Trekking",
                Material = "Carbon",
                LengthInMm = 130,
                WidthInMm = 80,
                HeightInMm = 20,
                NetWeightInGramm = 200,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Article
            {
                Id = _nextId++,
                ArticleNumber = 100295,
                Name = "e-City cranks vario",
                ArticleCategory = "Crank arm",
                BicycleCategory = "e-City, e-Trekking",
                Material = "Aluminium",
                LengthInMm = 170,
                WidthInMm = 10,
                HeightInMm = 30,
                NetWeightInGramm = 100,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Article
            {
                Id = _nextId++,
                ArticleNumber = 100296,
                Name = "Road cranks vario 4",
                ArticleCategory = "Crank arm",
                BicycleCategory = "Road",
                Material = "Alloy",
                LengthInMm = 200,
                WidthInMm = 15,
                HeightInMm = 20,
                NetWeightInGramm = 110,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Article
            {
                Id = _nextId++,
                ArticleNumber = 100297,
                Name = "Fold crank 5",
                ArticleCategory = "Crank arm",
                BicycleCategory = "Foldable",
                Material = "Nickel",
                LengthInMm = 150,
                WidthInMm = 10,
                HeightInMm = 20,
                NetWeightInGramm = 350,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        foreach (var article in sampleArticles)
        {
            _articles.TryAdd(article.Id, article);
        }
    }
}