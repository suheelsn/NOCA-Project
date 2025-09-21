using System.Net;
using System.Text.Json;
using ArticleManagementApi.DTOs;
using FluentValidation;

namespace ArticleManagementApi.Middleware;

public class GlobalExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlingMiddleware> _logger;

    public GlobalExceptionHandlingMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        
        var traceId = context.TraceIdentifier;
        
        object response = exception switch
        {
            ValidationException validationEx => new ValidationErrorResponse
            {
                Message = "Validation failed",
                StatusCode = (int)HttpStatusCode.BadRequest,
                TraceId = traceId,
                Errors = validationEx.Errors
                    .GroupBy(e => e.PropertyName)
                    .ToDictionary(
                        g => g.Key,
                        g => g.Select(e => e.ErrorMessage).ToArray()
                    )
            },
            ArgumentException argEx => new ErrorResponse
            {
                Message = argEx.Message,
                StatusCode = (int)HttpStatusCode.BadRequest,
                TraceId = traceId
            },
            KeyNotFoundException => new ErrorResponse
            {
                Message = "The requested resource was not found",
                StatusCode = (int)HttpStatusCode.NotFound,
                TraceId = traceId
            },
            _ => new ErrorResponse
            {
                Message = "An internal server error occurred",
                StatusCode = (int)HttpStatusCode.InternalServerError,
                TraceId = traceId,
                Detail = exception.Message
            }
        };

        var statusCode = exception switch
        {
            ValidationException => (int)HttpStatusCode.BadRequest,
            ArgumentException => (int)HttpStatusCode.BadRequest,
            KeyNotFoundException => (int)HttpStatusCode.NotFound,
            _ => (int)HttpStatusCode.InternalServerError
        };

        context.Response.StatusCode = statusCode;

        var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(jsonResponse);
    }
}