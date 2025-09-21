using System.ComponentModel.DataAnnotations;

namespace ArticleManagementApi.DTOs;

public class UpdateArticleDto
{
    [Required(ErrorMessage = "Article number is required")]
    [Range(1, int.MaxValue, ErrorMessage = "Article number must be greater than 0")]
    public int ArticleNumber { get; set; }
    
    [Required(ErrorMessage = "Name is required")]
    [StringLength(200, ErrorMessage = "Name cannot exceed 200 characters")]
    public string Name { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Article category is required")]
    [StringLength(100, ErrorMessage = "Article category cannot exceed 100 characters")]
    public string ArticleCategory { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Bicycle category is required")]
    [StringLength(100, ErrorMessage = "Bicycle category cannot exceed 100 characters")]
    public string BicycleCategory { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Material is required")]
    [StringLength(50, ErrorMessage = "Material cannot exceed 50 characters")]
    public string Material { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Length is required")]
    [Range(1, int.MaxValue, ErrorMessage = "Length must be greater than 0")]
    public int LengthInMm { get; set; }
    
    [Required(ErrorMessage = "Width is required")]
    [Range(1, int.MaxValue, ErrorMessage = "Width must be greater than 0")]
    public int WidthInMm { get; set; }
    
    [Required(ErrorMessage = "Height is required")]
    [Range(1, int.MaxValue, ErrorMessage = "Height must be greater than 0")]
    public int HeightInMm { get; set; }
    
    [Required(ErrorMessage = "Net weight is required")]
    [Range(1, int.MaxValue, ErrorMessage = "Net weight must be greater than 0")]
    public int NetWeightInGramm { get; set; }
}