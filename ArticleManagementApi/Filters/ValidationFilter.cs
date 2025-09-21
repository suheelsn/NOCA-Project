using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using ArticleManagementApi.DTOs;

namespace ArticleManagementApi.Filters;

public class ValidationFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        if (!context.ModelState.IsValid)
        {
            var errors = context.ModelState
                .Where(x => x.Value?.Errors.Count > 0)
                .ToDictionary(
                    kvp => kvp.Key,
                    kvp => kvp.Value?.Errors.Select(e => e.ErrorMessage).ToArray() ?? Array.Empty<string>()
                );

            var validationErrorResponse = new ValidationErrorResponse
            {
                Message = "Validation failed",
                StatusCode = 400,
                TraceId = context.HttpContext.TraceIdentifier,
                Errors = errors
            };

            context.Result = new BadRequestObjectResult(validationErrorResponse);
        }
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        // No implementation needed
    }
}