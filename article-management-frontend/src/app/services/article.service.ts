import { Injectable } from '@angular/core';
import { AxiosResponse } from 'axios';
import { apiClient } from './api.config';
import {
    Article,
    CreateArticle,
    UpdateArticle,
    ArticleFilters,
    SortOptions
} from '../models';

@Injectable({
    providedIn: 'root'
})
export class ArticleService {

    private readonly articlesEndpoint = '/articles';
    private apiClient = apiClient;

    constructor() { }

    /**
     * Get all articles with optional filtering and sorting
     */
    async getArticles(
        filters?: ArticleFilters,
        sortOptions?: SortOptions
    ): Promise<Article[]> {
        try {
            const params = this.buildQueryParams(filters, sortOptions);
            const response: AxiosResponse<Article[]> = await this.apiClient.get(
                this.articlesEndpoint,
                { params }
            );

            // Convert date strings to Date objects
            return response.data.map(article => ({
                ...article,
                createdAt: new Date(article.createdAt),
                updatedAt: new Date(article.updatedAt)
            }));
        } catch (error) {
            console.error('Error fetching articles:', error);
            throw this.handleError(error, 'Failed to fetch articles');
        }
    }

    /**
     * Get a single article by ID
     */
    async getArticle(id: number): Promise<Article> {
        try {
            const response: AxiosResponse<Article> = await this.apiClient.get(
                `${this.articlesEndpoint}/${id}`
            );

            // Convert date strings to Date objects
            return {
                ...response.data,
                createdAt: new Date(response.data.createdAt),
                updatedAt: new Date(response.data.updatedAt)
            };
        } catch (error) {
            console.error(`Error fetching article ${id}:`, error);
            throw this.handleError(error, `Failed to fetch article with ID ${id}`);
        }
    }

    /**
     * Create a new article
     */
    async createArticle(article: CreateArticle): Promise<Article> {
        try {
            const response: AxiosResponse<Article> = await this.apiClient.post(
                this.articlesEndpoint,
                article
            );

            // Convert date strings to Date objects
            return {
                ...response.data,
                createdAt: new Date(response.data.createdAt),
                updatedAt: new Date(response.data.updatedAt)
            };
        } catch (error) {
            console.error('Error creating article:', error);
            throw this.handleError(error, 'Failed to create article');
        }
    }

    /**
     * Update an existing article
     */
    async updateArticle(id: number, article: UpdateArticle): Promise<Article> {
        try {
            const response: AxiosResponse<Article> = await this.apiClient.put(
                `${this.articlesEndpoint}/${id}`,
                article
            );

            // Convert date strings to Date objects
            return {
                ...response.data,
                createdAt: new Date(response.data.createdAt),
                updatedAt: new Date(response.data.updatedAt)
            };
        } catch (error) {
            console.error(`Error updating article ${id}:`, error);
            throw this.handleError(error, `Failed to update article with ID ${id}`);
        }
    }

    /**
     * Delete an article
     */
    async deleteArticle(id: number): Promise<void> {
        try {
            await this.apiClient.delete(`${this.articlesEndpoint}/${id}`);
        } catch (error) {
            console.error(`Error deleting article ${id}:`, error);
            throw this.handleError(error, `Failed to delete article with ID ${id}`);
        }
    }

    /**
     * Build query parameters for filtering and sorting
     */
    private buildQueryParams(
        filters?: ArticleFilters,
        sortOptions?: SortOptions
    ): Record<string, any> {
        const params: Record<string, any> = {};

        if (filters) {
            if (filters.articleCategory) {
                params['articleCategory'] = filters.articleCategory;
            }

            if (filters.bicycleCategories && filters.bicycleCategories.length > 0) {
                // Join multiple bicycle categories with comma
                params['bicycleCategory'] = filters.bicycleCategories.join(',');
            }

            if (filters.material) {
                params['material'] = filters.material;
            }

            // Add dimension and weight filters if needed
            if (filters.minWeight !== undefined) {
                params['minWeight'] = filters.minWeight;
            }
            if (filters.maxWeight !== undefined) {
                params['maxWeight'] = filters.maxWeight;
            }
            if (filters.minLength !== undefined) {
                params['minLength'] = filters.minLength;
            }
            if (filters.maxLength !== undefined) {
                params['maxLength'] = filters.maxLength;
            }
            if (filters.minWidth !== undefined) {
                params['minWidth'] = filters.minWidth;
            }
            if (filters.maxWidth !== undefined) {
                params['maxWidth'] = filters.maxWidth;
            }
            if (filters.minHeight !== undefined) {
                params['minHeight'] = filters.minHeight;
            }
            if (filters.maxHeight !== undefined) {
                params['maxHeight'] = filters.maxHeight;
            }
        }

        if (sortOptions) {
            params['sortBy'] = sortOptions.field;
            params['sortDescending'] = sortOptions.direction === 'desc';
        }

        return params;
    }

    /**
     * Handle and transform errors for consistent error messaging
     */
    private handleError(error: any, defaultMessage: string): Error {
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            if (status === 400 && data.errors) {
                // Validation errors
                const validationErrors = Object.values(data.errors).flat().join(', ');
                return new Error(`Validation failed: ${validationErrors}`);
            } else if (status === 404) {
                return new Error('Article not found');
            } else if (data.message) {
                return new Error(data.message);
            }
        } else if (error.request) {
            // Network error
            return new Error('Network error - please check your connection');
        }

        return new Error(defaultMessage);
    }
}