using FluentValidation;
using ArticleManagementApi.DTOs;

namespace ArticleManagementApi.Validators;

public class CreateArticleDtoValidator : AbstractValidator<CreateArticleDto>
{
    public CreateArticleDtoValidator()
    {
        RuleFor(x => x.ArticleNumber)
            .NotEmpty().WithMessage("Article number is required")
            .GreaterThan(0).WithMessage("Article number must be greater than 0");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(200).WithMessage("Name cannot exceed 200 characters")
            .MinimumLength(2).WithMessage("Name must be at least 2 characters long");

        RuleFor(x => x.ArticleCategory)
            .NotEmpty().WithMessage("Article category is required")
            .MaximumLength(100).WithMessage("Article category cannot exceed 100 characters");

        RuleFor(x => x.BicycleCategory)
            .NotEmpty().WithMessage("Bicycle category is required")
            .MaximumLength(100).WithMessage("Bicycle category cannot exceed 100 characters");

        RuleFor(x => x.Material)
            .NotEmpty().WithMessage("Material is required")
            .MaximumLength(50).WithMessage("Material cannot exceed 50 characters");

        RuleFor(x => x.LengthInMm)
            .GreaterThan(0).WithMessage("Length must be greater than 0")
            .LessThanOrEqualTo(10000).WithMessage("Length cannot exceed 10000mm");

        RuleFor(x => x.WidthInMm)
            .GreaterThan(0).WithMessage("Width must be greater than 0")
            .LessThanOrEqualTo(10000).WithMessage("Width cannot exceed 10000mm");

        RuleFor(x => x.HeightInMm)
            .GreaterThan(0).WithMessage("Height must be greater than 0")
            .LessThanOrEqualTo(10000).WithMessage("Height cannot exceed 10000mm");

        RuleFor(x => x.NetWeightInGramm)
            .GreaterThan(0).WithMessage("Net weight must be greater than 0")
            .LessThanOrEqualTo(100000).WithMessage("Net weight cannot exceed 100000g");
    }


}