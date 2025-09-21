using System.ComponentModel.DataAnnotations;

namespace ArticleManagementApi.Models;

public class Article
{
    public int Id { get; set; }
    
    [Required]
    public int ArticleNumber { get; set; }
    
    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string ArticleCategory { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string BicycleCategory { get; set; } = string.Empty;
    
    [Required]
    [StringLength(50)]
    public string Material { get; set; } = string.Empty;
    
    [Range(1, int.MaxValue, ErrorMessage = "Length must be greater than 0")]
    public int LengthInMm { get; set; }
    
    [Range(1, int.MaxValue, ErrorMessage = "Width must be greater than 0")]
    public int WidthInMm { get; set; }
    
    [Range(1, int.MaxValue, ErrorMessage = "Height must be greater than 0")]
    public int HeightInMm { get; set; }
    
    [Range(1, int.MaxValue, ErrorMessage = "Net weight must be greater than 0")]
    public int NetWeightInGramm { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}