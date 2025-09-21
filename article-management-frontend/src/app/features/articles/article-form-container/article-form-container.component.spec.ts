import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ArticleFormContainerComponent } from './article-form-container.component';
import { ArticleService } from '../../../services';
import { Article } from '../../../models';

describe('ArticleFormContainerComponent', () => {
    let component: ArticleFormContainerComponent;
    let fixture: ComponentFixture<ArticleFormContainerComponent>;
    let mockArticleService: jasmine.SpyObj<ArticleService>;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockActivatedRoute: any;

    const mockArticle: Article = {
        id: 1,
        articleNumber: 12345,
        name: 'Test Article',
        articleCategory: 'Category A',
        bicycleCategory: 'Mountain',
        material: 'Aluminum',
        lengthInMm: 100,
        widthInMm: 50,
        heightInMm: 25,
        netWeightInGramm: 150,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    beforeEach(async () => {
        const articleServiceSpy = jasmine.createSpyObj('ArticleService', ['getArticle']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        mockActivatedRoute = {
            snapshot: {
                paramMap: {
                    get: jasmine.createSpy('get')
                },
                queryParams: {}
            }
        };

        await TestBed.configureTestingModule({
            imports: [
                ArticleFormContainerComponent,
                NoopAnimationsModule
            ],
            providers: [
                { provide: ArticleService, useValue: articleServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: ActivatedRoute, useValue: mockActivatedRoute }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ArticleFormContainerComponent);
        component = fixture.componentInstance;
        mockArticleService = TestBed.inject(ArticleService) as jasmine.SpyObj<ArticleService>;
        mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize in create mode when no id parameter', async () => {
        mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);

        await component.ngOnInit();

        expect(component.mode).toBe('create');
        expect(component.article).toBeNull();
        expect(mockArticleService.getArticle).not.toHaveBeenCalled();
    });

    it('should initialize in edit mode and load article when id parameter exists', async () => {
        mockActivatedRoute.snapshot.paramMap.get.and.returnValue('1');
        mockArticleService.getArticle.and.returnValue(Promise.resolve(mockArticle));

        await component.ngOnInit();

        expect(component.mode).toBe('edit');
        expect(component.article).toEqual(mockArticle);
        expect(mockArticleService.getArticle).toHaveBeenCalledWith(1);
    });

    it('should handle error when loading article fails', async () => {
        mockActivatedRoute.snapshot.paramMap.get.and.returnValue('1');
        mockArticleService.getArticle.and.returnValue(Promise.reject(new Error('Article not found')));

        await component.ngOnInit();

        expect(component.error).toBe('Article not found');
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/articles']);
    });

    it('should navigate back when form is submitted', () => {
        const mockFormData = {
            articleNumber: 12345,
            name: 'Test Article',
            articleCategory: 'Category A',
            bicycleCategory: 'Mountain',
            material: 'Aluminum',
            lengthInMm: 100,
            widthInMm: 50,
            heightInMm: 25,
            netWeightInGramm: 150
        };

        component.onFormSubmit(mockFormData);

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/articles'], { queryParams: {} });
    });

    it('should navigate back when form is cancelled', () => {
        component.onFormCancel();

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/articles'], { queryParams: {} });
    });

    it('should navigate back with query parameters preserved', () => {
        mockActivatedRoute.snapshot.queryParams = { sortField: 'name', sortDirection: 'asc' };

        component.navigateBack();

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/articles'], {
            queryParams: { sortField: 'name', sortDirection: 'asc' }
        });
    });
});