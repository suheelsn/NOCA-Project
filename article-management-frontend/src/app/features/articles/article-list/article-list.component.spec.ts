import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ArticleListComponent } from './article-list.component';
import { ArticleService } from '../../../services';
import { Article } from '../../../models';

describe('ArticleListComponent', () => {
    let component: ArticleListComponent;
    let fixture: ComponentFixture<ArticleListComponent>;
    let mockArticleService: jasmine.SpyObj<ArticleService>;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

    const mockArticles: Article[] = [
        {
            id: 1,
            articleNumber: 12345,
            name: 'Test Article 1',
            articleCategory: 'Category A',
            bicycleCategory: 'Mountain',
            material: 'Aluminum',
            lengthInMm: 100,
            widthInMm: 50,
            heightInMm: 25,
            netWeightInGramm: 150,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];

    beforeEach(async () => {
        const articleServiceSpy = jasmine.createSpyObj('ArticleService', ['getArticles']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
            snapshot: {
                queryParams: {}
            }
        });

        await TestBed.configureTestingModule({
            imports: [
                ArticleListComponent,
                NoopAnimationsModule
            ],
            providers: [
                { provide: ArticleService, useValue: articleServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: ActivatedRoute, useValue: activatedRouteSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ArticleListComponent);
        component = fixture.componentInstance;
        mockArticleService = TestBed.inject(ArticleService) as jasmine.SpyObj<ArticleService>;
        mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        mockActivatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;

        // Mock the service to return empty array by default
        mockArticleService.getArticles.and.returnValue(Promise.resolve([]));
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with correct default values', () => {
        expect(component.articles).toEqual([]);
        expect(component.loading).toBeFalse();
        expect(component.error).toBeNull();
        expect(component.displayedColumns).toEqual([
            'articleNumber',
            'name',
            'articleCategory',
            'bicycleCategory',
            'material',
            'lengthInMm',
            'widthInMm',
            'heightInMm',
            'netWeightInGramm',
            'actions'
        ]);
    });

    it('should load articles on init', async () => {
        mockArticleService.getArticles.and.returnValue(Promise.resolve(mockArticles));

        await component.loadArticles();

        expect(mockArticleService.getArticles).toHaveBeenCalled();
        expect(component.articles).toEqual(mockArticles);
        expect(component.loading).toBeFalse();
        expect(component.error).toBeNull();
    });

    it('should handle error when loading articles fails', async () => {
        const errorMessage = 'Failed to load articles';
        mockArticleService.getArticles.and.returnValue(Promise.reject(new Error(errorMessage)));

        await component.loadArticles();

        expect(component.articles).toEqual([]);
        expect(component.loading).toBeFalse();
        expect(component.error).toBe(errorMessage);
    });

    it('should set loading state during article loading', () => {
        mockArticleService.getArticles.and.returnValue(new Promise(() => { })); // Never resolves

        component.loadArticles();

        expect(component.loading).toBeTrue();
        expect(component.error).toBeNull();
    });

    it('should navigate to edit form when onEdit is called', () => {
        const article = mockArticles[0];

        component.onEdit(article);

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/articles/edit', article.id], {
            queryParams: jasmine.any(Object)
        });
    });

    it('should call console.log when onDelete is called', () => {
        spyOn(console, 'log');
        const article = mockArticles[0];

        component.onDelete(article);

        expect(console.log).toHaveBeenCalledWith('Delete article:', article);
    });

    it('should navigate to create form when onAddNew is called', () => {
        component.onAddNew();

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/articles/new'], {
            queryParams: jasmine.any(Object)
        });
    });

    describe('Sorting functionality', () => {
        it('should initialize with no current sort', () => {
            expect(component.currentSort).toBeNull();
        });

        it('should identify sortable columns correctly', () => {
            expect(component.isSortable('netWeightInGramm')).toBeTrue();
            expect(component.isSortable('articleCategory')).toBeTrue();
            expect(component.isSortable('name')).toBeFalse();
            expect(component.isSortable('articleNumber')).toBeFalse();
        });

        it('should set sort to ascending when clicking unsorted column', async () => {
            mockArticleService.getArticles.and.returnValue(Promise.resolve(mockArticles));
            spyOn(component, 'loadArticles').and.callThrough();

            component.onSort('netWeightInGramm');

            expect(component.currentSort).toEqual({
                field: 'netWeightInGramm',
                direction: 'asc'
            });
            expect(component.loadArticles).toHaveBeenCalled();
        });

        it('should toggle sort direction when clicking same column twice', async () => {
            mockArticleService.getArticles.and.returnValue(Promise.resolve(mockArticles));
            spyOn(component, 'loadArticles').and.callThrough();

            // First click - ascending
            component.onSort('netWeightInGramm');
            expect(component.currentSort?.direction).toBe('asc');

            // Second click - descending
            component.onSort('netWeightInGramm');
            expect(component.currentSort?.direction).toBe('desc');

            // Third click - ascending again
            component.onSort('netWeightInGramm');
            expect(component.currentSort?.direction).toBe('asc');
        });

        it('should change sort field when clicking different sortable column', async () => {
            mockArticleService.getArticles.and.returnValue(Promise.resolve(mockArticles));
            spyOn(component, 'loadArticles').and.callThrough();

            // Sort by weight first
            component.onSort('netWeightInGramm');
            expect(component.currentSort?.field).toBe('netWeightInGramm');
            expect(component.currentSort?.direction).toBe('asc');

            // Sort by category
            component.onSort('articleCategory');
            expect(component.currentSort?.field).toBe('articleCategory');
            expect(component.currentSort?.direction).toBe('asc');
        });

        it('should not sort when clicking non-sortable column', () => {
            spyOn(component, 'loadArticles');
            const initialSort = component.currentSort;

            component.onSort('name');

            expect(component.currentSort).toBe(initialSort);
            expect(component.loadArticles).not.toHaveBeenCalled();
        });

        it('should pass sort options to service when loading articles', async () => {
            const sortOptions = { field: 'netWeightInGramm' as const, direction: 'desc' as const };
            component.currentSort = sortOptions;
            mockArticleService.getArticles.and.returnValue(Promise.resolve(mockArticles));

            await component.loadArticles();

            expect(mockArticleService.getArticles).toHaveBeenCalledWith(undefined, sortOptions);
        });

        it('should return correct sort icon for unsorted column', () => {
            expect(component.getSortIcon('netWeightInGramm')).toBe('unfold_more');
        });

        it('should return correct sort icon for ascending sort', () => {
            component.currentSort = { field: 'netWeightInGramm', direction: 'asc' };
            expect(component.getSortIcon('netWeightInGramm')).toBe('keyboard_arrow_up');
        });

        it('should return correct sort icon for descending sort', () => {
            component.currentSort = { field: 'netWeightInGramm', direction: 'desc' };
            expect(component.getSortIcon('netWeightInGramm')).toBe('keyboard_arrow_down');
        });

        it('should return unfold_more icon for different column when one is sorted', () => {
            component.currentSort = { field: 'netWeightInGramm', direction: 'asc' };
            expect(component.getSortIcon('articleCategory')).toBe('unfold_more');
        });

        it('should return correct sort direction for accessibility', () => {
            component.currentSort = { field: 'netWeightInGramm', direction: 'asc' };
            expect(component.getSortDirection('netWeightInGramm')).toBe('ascending');

            component.currentSort = { field: 'netWeightInGramm', direction: 'desc' };
            expect(component.getSortDirection('netWeightInGramm')).toBe('descending');

            expect(component.getSortDirection('articleCategory')).toBe('');
        });

        it('should return empty string for sort direction when no sort is active', () => {
            component.currentSort = null;
            expect(component.getSortDirection('netWeightInGramm')).toBe('');
        });
    });
});