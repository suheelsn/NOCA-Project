namespace ArticleManagementApi.DTOs;

public class ArticleDto
{
    public int Id { get; set; }
    public int ArticleNumber { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ArticleCategory { get; set; } = string.Empty;
    public string BicycleCategory { get; set; } = string.Empty;
    public string Material { get; set; } = string.Empty;
    public int LengthInMm { get; set; }
    public int WidthInMm { get; set; }
    public int HeightInMm { get; set; }
    public int NetWeightInGramm { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}