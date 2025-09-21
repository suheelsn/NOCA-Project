import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ArticleFormComponent } from './article-form.component';
import { ArticleService } from '../../../services/article.service';
import { Article } from '../../../models';

describe('ArticleFormComponent', () => {
    let component: ArticleFormComponent;
    let fixture: ComponentFixture<ArticleFormComponent>;
    let mockArticleService: jasmine.SpyObj<ArticleService>;

    const mockArticle: Article = {
        id: 1,
        articleNumber: 12345,
        name: 'Test Article',
        articleCategory: 'Frame',
        bicycleCategory: 'Mountain Bike',
        material: 'Aluminum',
        lengthInMm: 100.5,
        widthInMm: 50.2,
        heightInMm: 25.8,
        netWeightInGramm: 250.5,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    beforeEach(async () => {
        const spy = jasmine.createSpyObj('ArticleService', ['createArticle', 'updateArticle']);

        await TestBed.configureTestingModule({
            imports: [
                ArticleFormComponent,
                ReactiveFormsModule,
                NoopAnimationsModule,
                MatCardModule,
                MatFormFieldModule,
                MatInputModule,
                MatSelectModule,
                MatAutocompleteModule,
                MatButtonModule,
                MatIconModule,
                MatProgressSpinnerModule
            ],
            providers: [
                { provide: ArticleService, useValue: spy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ArticleFormComponent);
        component = fixture.componentInstance;
        mockArticleService = TestBed.inject(ArticleService) as jasmine.SpyObj<ArticleService>;
    });

    beforeEach(() => {
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form with empty values in create mode', () => {
        component.mode = 'create';
        component.ngOnInit();

        expect(component.articleForm.get('articleNumber')?.value).toBe('');
        expect(component.articleForm.get('name')?.value).toBe('');
        expect(component.articleForm.get('articleCategory')?.value).toBe('');
        expect(component.articleForm.get('bicycleCategory')?.value).toBe('');
        expect(component.articleForm.get('material')?.value).toBe('');
        expect(component.articleForm.get('lengthInMm')?.value).toBe('');
        expect(component.articleForm.get('widthInMm')?.value).toBe('');
        expect(component.articleForm.get('heightInMm')?.value).toBe('');
        expect(component.articleForm.get('netWeightInGramm')?.value).toBe('');
    });

    it('should populate form with article data in edit mode', () => {
        component.mode = 'edit';
        component.article = mockArticle;
        component.ngOnInit();

        expect(component.articleForm.get('articleNumber')?.value).toBe(mockArticle.articleNumber);
        expect(component.articleForm.get('name')?.value).toBe(mockArticle.name);
        expect(component.articleForm.get('articleCategory')?.value).toBe(mockArticle.articleCategory);
        expect(component.articleForm.get('bicycleCategory')?.value).toBe(mockArticle.bicycleCategory);
        expect(component.articleForm.get('material')?.value).toBe(mockArticle.material);
        expect(component.articleForm.get('lengthInMm')?.value).toBe(mockArticle.lengthInMm);
        expect(component.articleForm.get('widthInMm')?.value).toBe(mockArticle.widthInMm);
        expect(component.articleForm.get('heightInMm')?.value).toBe(mockArticle.heightInMm);
        expect(component.articleForm.get('netWeightInGramm')?.value).toBe(mockArticle.netWeightInGramm);
    });

    it('should validate required fields', () => {
        component.ngOnInit();

        // Test required validation
        expect(component.articleForm.get('articleNumber')?.hasError('required')).toBeTruthy();
        expect(component.articleForm.get('name')?.hasError('required')).toBeTruthy();
        expect(component.articleForm.get('articleCategory')?.hasError('required')).toBeTruthy();
        expect(component.articleForm.get('bicycleCategory')?.hasError('required')).toBeTruthy();
        expect(component.articleForm.get('material')?.hasError('required')).toBeTruthy();
        expect(component.articleForm.get('lengthInMm')?.hasError('required')).toBeTruthy();
        expect(component.articleForm.get('widthInMm')?.hasError('required')).toBeTruthy();
        expect(component.articleForm.get('heightInMm')?.hasError('required')).toBeTruthy();
        expect(component.articleForm.get('netWeightInGramm')?.hasError('required')).toBeTruthy();
    });

    it('should validate numeric fields', () => {
        component.ngOnInit();

        // Test min validation for numeric fields
        component.articleForm.patchValue({
            articleNumber: 0,
            lengthInMm: 0,
            widthInMm: 0,
            heightInMm: 0,
            netWeightInGramm: 0
        });

        expect(component.articleForm.get('articleNumber')?.hasError('min')).toBeTruthy();
        expect(component.articleForm.get('lengthInMm')?.hasError('min')).toBeTruthy();
        expect(component.articleForm.get('widthInMm')?.hasError('min')).toBeTruthy();
        expect(component.articleForm.get('heightInMm')?.hasError('min')).toBeTruthy();
        expect(component.articleForm.get('netWeightInGramm')?.hasError('min')).toBeTruthy();
    });

    it('should validate name length', () => {
        component.ngOnInit();

        // Test minlength validation
        component.articleForm.patchValue({ name: 'a' });
        expect(component.articleForm.get('name')?.hasError('minlength')).toBeTruthy();

        // Test maxlength validation
        const longName = 'a'.repeat(101);
        component.articleForm.patchValue({ name: longName });
        expect(component.articleForm.get('name')?.hasError('maxlength')).toBeTruthy();
    });

    it('should emit formSubmit event on valid form submission in create mode', async () => {
        spyOn(component.formSubmit, 'emit');
        mockArticleService.createArticle.and.returnValue(Promise.resolve(mockArticle));

        component.mode = 'create';
        component.ngOnInit();

        // Fill form with valid data
        component.articleForm.patchValue({
            articleNumber: 12345,
            name: 'Test Article',
            articleCategory: 'Frame',
            bicycleCategory: 'Mountain Bike',
            material: 'Aluminum',
            lengthInMm: 100.5,
            widthInMm: 50.2,
            heightInMm: 25.8,
            netWeightInGramm: 250.5
        });

        await component.onSubmit();

        expect(mockArticleService.createArticle).toHaveBeenCalled();
        expect(component.formSubmit.emit).toHaveBeenCalled();
    });

    it('should emit formSubmit event on valid form submission in edit mode', async () => {
        spyOn(component.formSubmit, 'emit');
        mockArticleService.updateArticle.and.returnValue(Promise.resolve(mockArticle));

        component.mode = 'edit';
        component.article = mockArticle;
        component.ngOnInit();

        await component.onSubmit();

        expect(mockArticleService.updateArticle).toHaveBeenCalledWith(mockArticle.id, jasmine.any(Object));
        expect(component.formSubmit.emit).toHaveBeenCalled();
    });

    it('should emit formCancel event when cancel is clicked', () => {
        spyOn(component.formCancel, 'emit');

        component.onCancel();

        expect(component.formCancel.emit).toHaveBeenCalled();
    });

    it('should reset form when reset is clicked', () => {
        component.ngOnInit();

        // Fill form with data
        component.articleForm.patchValue({
            articleNumber: 12345,
            name: 'Test Article'
        });

        component.onReset();

        expect(component.articleForm.get('articleNumber')?.value).toBe(null);
        expect(component.articleForm.get('name')?.value).toBe(null);
        expect(component.error).toBe(null);
    });

    it('should return correct form title based on mode', () => {
        component.mode = 'create';
        expect(component.formTitle).toBe('Add New Article');

        component.mode = 'edit';
        expect(component.formTitle).toBe('Edit Article');
    });

    it('should return correct submit button text based on mode', () => {
        component.mode = 'create';
        expect(component.submitButtonText).toBe('Create Article');

        component.mode = 'edit';
        expect(component.submitButtonText).toBe('Update Article');
    });

    it('should handle API errors gracefully', async () => {
        const errorMessage = 'API Error';
        mockArticleService.createArticle.and.returnValue(Promise.reject(new Error(errorMessage)));

        component.mode = 'create';
        component.ngOnInit();

        // Fill form with valid data
        component.articleForm.patchValue({
            articleNumber: 12345,
            name: 'Test Article',
            articleCategory: 'Frame',
            bicycleCategory: 'Mountain Bike',
            material: 'Aluminum',
            lengthInMm: 100.5,
            widthInMm: 50.2,
            heightInMm: 25.8,
            netWeightInGramm: 250.5
        });

        await component.onSubmit();

        expect(component.error).toBe(errorMessage);
        expect(component.loading).toBe(false);
    });

    it('should get field error messages correctly', () => {
        component.ngOnInit();

        const control = component.articleForm.get('name');
        if (control) {
            control.markAsTouched();
            control.setErrors({ required: true });
        }

        expect(component.getFieldError('name')).toBe('Name is required');
    });

    it('should check if field has error correctly', () => {
        component.ngOnInit();

        const control = component.articleForm.get('name');
        if (control) {
            control.markAsTouched();
            control.setErrors({ required: true });
        }

        expect(component.hasFieldError('name')).toBe(true);
    });
});