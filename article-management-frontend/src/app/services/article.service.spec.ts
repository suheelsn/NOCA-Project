import { TestBed } from '@angular/core/testing';
import { ArticleService } from './article.service';
import { Article, CreateArticle, UpdateArticle, ArticleFilters, SortOptions } from '../models';

describe('ArticleService', () => {
    let service: ArticleService;
    let mockApiClient: any;

    const mockArticle: Article = {
        id: 1,
        articleNumber: 100291,
        name: 'Test Article',
        articleCategory: 'Hub',
        bicycleCategory: 'e-Cargo bike',
        material: 'Aluminium',
        lengthInMm: 110,
        widthInMm: 100,
        heightInMm: 20,
        netWeightInGramm: 210,
        createdAt: new Date('2023-01-01T00:00:00Z'),
        updatedAt: new Date('2023-01-01T00:00:00Z')
    };

    const mockCreateArticle: CreateArticle = {
        articleNumber: 100291,
        name: 'Test Article',
        articleCategory: 'Hub',
        bicycleCategory: 'e-Cargo bike',
        material: 'Aluminium',
        lengthInMm: 110,
        widthInMm: 100,
        heightInMm: 20,
        netWeightInGramm: 210
    };

    beforeEach(() => {
        // Create mock API client
        mockApiClient = {
            get: jasmine.createSpy('get'),
            post: jasmine.createSpy('post'),
            put: jasmine.createSpy('put'),
            delete: jasmine.createSpy('delete')
        };

        TestBed.configureTestingModule({});
        service = TestBed.inject(ArticleService);

        // Replace the apiClient with our mock
        (service as any).apiClient = mockApiClient;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getArticles', () => {
        it('should fetch all articles without filters', async () => {
            const mockResponse = { data: [mockArticle] };
            mockApiClient.get.and.returnValue(Promise.resolve(mockResponse));

            const result = await service.getArticles();

            expect(mockApiClient.get).toHaveBeenCalledWith('/articles', { params: {} });
            expect(result).toEqual([mockArticle]);
        });

        it('should fetch articles with filters and sorting', async () => {
            const mockResponse = { data: [mockArticle] };
            mockApiClient.get.and.returnValue(Promise.resolve(mockResponse));

            const filters: ArticleFilters = {
                articleCategory: 'Hub',
                bicycleCategories: ['e-Cargo bike'],
                material: 'Aluminium'
            };

            const sortOptions: SortOptions = {
                field: 'name',
                direction: 'asc'
            };

            const result = await service.getArticles(filters, sortOptions);

            expect(mockApiClient.get).toHaveBeenCalledWith('/articles', {
                params: {
                    articleCategory: 'Hub',
                    bicycleCategory: 'e-Cargo bike',
                    material: 'Aluminium',
                    sortBy: 'name',
                    sortDescending: false
                }
            });
            expect(result).toEqual([mockArticle]);
        });

        it('should handle multiple bicycle categories', async () => {
            const mockResponse = { data: [mockArticle] };
            mockApiClient.get.and.returnValue(Promise.resolve(mockResponse));

            const filters: ArticleFilters = {
                bicycleCategories: ['e-Cargo bike', 'Road', 'Gravel']
            };

            await service.getArticles(filters);

            expect(mockApiClient.get).toHaveBeenCalledWith('/articles', {
                params: {
                    bicycleCategory: 'e-Cargo bike,Road,Gravel'
                }
            });
        });

        it('should handle descending sort', async () => {
            const mockResponse = { data: [mockArticle] };
            mockApiClient.get.and.returnValue(Promise.resolve(mockResponse));

            const sortOptions: SortOptions = {
                field: 'netWeightInGramm',
                direction: 'desc'
            };

            await service.getArticles(undefined, sortOptions);

            expect(mockApiClient.get).toHaveBeenCalledWith('/articles', {
                params: {
                    sortBy: 'netWeightInGramm',
                    sortDescending: true
                }
            });
        });

        it('should handle API errors', async () => {
            const errorResponse = {
                response: {
                    status: 500,
                    data: { message: 'Internal server error' }
                }
            };
            mockApiClient.get.and.returnValue(Promise.reject(errorResponse));

            try {
                await service.getArticles();
                fail('Expected error to be thrown');
            } catch (error: any) {
                expect(error.message).toBe('Internal server error');
            }
        });
    });

    describe('getArticle', () => {
        it('should fetch a single article by ID', async () => {
            const mockResponse = { data: mockArticle };
            mockApiClient.get.and.returnValue(Promise.resolve(mockResponse));

            const result = await service.getArticle(1);

            expect(mockApiClient.get).toHaveBeenCalledWith('/articles/1');
            expect(result).toEqual(mockArticle);
        });

        it('should handle 404 error', async () => {
            const errorResponse = {
                response: {
                    status: 404,
                    data: {}
                }
            };
            mockApiClient.get.and.returnValue(Promise.reject(errorResponse));

            try {
                await service.getArticle(999);
                fail('Expected error to be thrown');
            } catch (error: any) {
                expect(error.message).toBe('Article not found');
            }
        });
    });

    describe('createArticle', () => {
        it('should create a new article', async () => {
            const mockResponse = { data: mockArticle };
            mockApiClient.post.and.returnValue(Promise.resolve(mockResponse));

            const result = await service.createArticle(mockCreateArticle);

            expect(mockApiClient.post).toHaveBeenCalledWith('/articles', mockCreateArticle);
            expect(result).toEqual(mockArticle);
        });

        it('should handle validation errors', async () => {
            const errorResponse = {
                response: {
                    status: 400,
                    data: {
                        errors: {
                            Name: ['Name is required'],
                            ArticleNumber: ['Article number must be greater than 0']
                        }
                    }
                }
            };
            mockApiClient.post.and.returnValue(Promise.reject(errorResponse));

            try {
                await service.createArticle(mockCreateArticle);
                fail('Expected error to be thrown');
            } catch (error: any) {
                expect(error.message).toBe('Validation failed: Name is required, Article number must be greater than 0');
            }
        });
    });

    describe('updateArticle', () => {
        it('should update an existing article', async () => {
            const mockResponse = { data: mockArticle };
            mockApiClient.put.and.returnValue(Promise.resolve(mockResponse));

            const updateData: UpdateArticle = { ...mockCreateArticle };
            const result = await service.updateArticle(1, updateData);

            expect(mockApiClient.put).toHaveBeenCalledWith('/articles/1', updateData);
            expect(result).toEqual(mockArticle);
        });
    });

    describe('deleteArticle', () => {
        it('should delete an article', async () => {
            mockApiClient.delete.and.returnValue(Promise.resolve({}));

            await service.deleteArticle(1);

            expect(mockApiClient.delete).toHaveBeenCalledWith('/articles/1');
        });
    });

    describe('error handling', () => {
        it('should handle network errors', async () => {
            const networkError = {
                request: {},
                message: 'Network Error'
            };
            mockApiClient.get.and.returnValue(Promise.reject(networkError));

            try {
                await service.getArticles();
                fail('Expected error to be thrown');
            } catch (error: any) {
                expect(error.message).toBe('Network error - please check your connection');
            }
        });

        it('should handle unknown errors', async () => {
            const unknownError = new Error('Unknown error');
            mockApiClient.get.and.returnValue(Promise.reject(unknownError));

            try {
                await service.getArticles();
                fail('Expected error to be thrown');
            } catch (error: any) {
                expect(error.message).toBe('Failed to fetch articles');
            }
        });
    });
});