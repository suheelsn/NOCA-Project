using AutoMapper;
using ArticleManagementApi.Models;
using ArticleManagementApi.DTOs;

namespace ArticleManagementApi.Mappings;

public class ArticleMappingProfile : Profile
{
    public ArticleMappingProfile()
    {
        // Article to ArticleDto mapping
        CreateMap<Article, ArticleDto>();
        
        // CreateArticleDto to Article mapping
        CreateMap<CreateArticleDto, Article>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));
        
        // UpdateArticleDto to Article mapping
        CreateMap<UpdateArticleDto, Article>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));
    }
}