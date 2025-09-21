namespace ArticleManagementApi.DTOs;

public class ValidationErrorResponse
{
    public string Message { get; set; } = "Validation failed";
    public Dictionary<string, string[]> Errors { get; set; } = new();
    public int StatusCode { get; set; } = 400;
    public string TraceId { get; set; } = string.Empty;
}