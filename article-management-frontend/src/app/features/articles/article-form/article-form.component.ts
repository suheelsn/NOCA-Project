import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, map, startWith } from 'rxjs';
import { Article, CreateArticle, UpdateArticle } from '../../../models';
import { getArticleCategories, getBicycleCategories, getMaterials } from '../../../models/article-enums';
import { ArticleService } from '../../../services';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './article-form.component.html',
  styleUrl: './article-form.component.css'
})
export class ArticleFormComponent implements OnInit {
  @Input() article: Article | null = null;
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() formSubmit = new EventEmitter<CreateArticle | UpdateArticle>();
  @Output() formCancel = new EventEmitter<void>();

  articleForm!: FormGroup;
  loading = false;
  error: string | null = null;

  // Dropdown options
  articleCategories: string[] = [];
  bicycleCategories: string[] = [];
  materials: string[] = [];

  // Filtered options for autocomplete
  filteredArticleCategories!: Observable<string[]>;
  filteredBicycleCategories!: Observable<string[]>;
  filteredMaterials!: Observable<string[]>;

  constructor(
    private formBuilder: FormBuilder,
    private articleService: ArticleService
  ) { }

  ngOnInit(): void {
    // Initialize dropdown options from enums
    this.articleCategories = getArticleCategories();
    this.bicycleCategories = getBicycleCategories();
    this.materials = getMaterials();

    this.initializeForm();
    this.setupAutocomplete();
    if (this.article && this.mode === 'edit') {
      this.populateForm();
    }
  }

  private initializeForm(): void {
    this.articleForm = this.formBuilder.group({
      articleNumber: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern(/^\d+$/)
        ]
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ]
      ],
      articleCategory: ['', Validators.required],
      bicycleCategory: ['', Validators.required],
      material: ['', Validators.required],
      lengthInMm: [
        '',
        [
          Validators.required,
          Validators.min(0.1),
          Validators.max(10000)
        ]
      ],
      widthInMm: [
        '',
        [
          Validators.required,
          Validators.min(0.1),
          Validators.max(10000)
        ]
      ],
      heightInMm: [
        '',
        [
          Validators.required,
          Validators.min(0.1),
          Validators.max(10000)
        ]
      ],
      netWeightInGramm: [
        '',
        [
          Validators.required,
          Validators.min(0.1),
          Validators.max(100000)
        ]
      ]
    });
  }

  private setupAutocomplete(): void {
    // Setup filtered options for autocomplete
    this.filteredArticleCategories = this.articleForm.get('articleCategory')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterOptions(value || '', this.articleCategories))
    );

    this.filteredBicycleCategories = this.articleForm.get('bicycleCategory')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterOptions(value || '', this.bicycleCategories))
    );

    this.filteredMaterials = this.articleForm.get('material')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterOptions(value || '', this.materials))
    );
  }

  private filterOptions(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }

  private populateForm(): void {
    if (this.article) {
      this.articleForm.patchValue({
        articleNumber: this.article.articleNumber,
        name: this.article.name,
        articleCategory: this.article.articleCategory,
        bicycleCategory: this.article.bicycleCategory,
        material: this.article.material,
        lengthInMm: this.article.lengthInMm,
        widthInMm: this.article.widthInMm,
        heightInMm: this.article.heightInMm,
        netWeightInGramm: this.article.netWeightInGramm
      });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.articleForm.valid) {
      this.loading = true;
      this.error = null;

      try {
        const formValue = this.articleForm.value;

        if (this.mode === 'create') {
          const createArticle: CreateArticle = {
            articleNumber: Number(formValue.articleNumber),
            name: formValue.name.trim(),
            articleCategory: formValue.articleCategory,
            bicycleCategory: formValue.bicycleCategory,
            material: formValue.material,
            lengthInMm: Number(formValue.lengthInMm),
            widthInMm: Number(formValue.widthInMm),
            heightInMm: Number(formValue.heightInMm),
            netWeightInGramm: Number(formValue.netWeightInGramm)
          };

          await this.articleService.createArticle(createArticle);
          this.formSubmit.emit(createArticle);
        } else {
          const updateArticle: UpdateArticle = {
            articleNumber: Number(formValue.articleNumber),
            name: formValue.name.trim(),
            articleCategory: formValue.articleCategory,
            bicycleCategory: formValue.bicycleCategory,
            material: formValue.material,
            lengthInMm: Number(formValue.lengthInMm),
            widthInMm: Number(formValue.widthInMm),
            heightInMm: Number(formValue.heightInMm),
            netWeightInGramm: Number(formValue.netWeightInGramm)
          };

          if (this.article) {
            await this.articleService.updateArticle(this.article.id, updateArticle);
            this.formSubmit.emit(updateArticle);
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An unexpected error occurred';
      } finally {
        this.loading = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  onReset(): void {
    this.articleForm.reset();
    this.error = null;
    if (this.article && this.mode === 'edit') {
      this.populateForm();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.articleForm.controls).forEach(key => {
      const control = this.articleForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // Helper methods for template
  getFieldError(fieldName: string): string | null {
    const control = this.articleForm.get(fieldName);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (control.errors['minlength']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['maxlength']) {
        return `${this.getFieldDisplayName(fieldName)} must not exceed ${control.errors['maxlength'].requiredLength} characters`;
      }
      if (control.errors['min']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${control.errors['min'].min}`;
      }
      if (control.errors['max']) {
        return `${this.getFieldDisplayName(fieldName)} must not exceed ${control.errors['max'].max}`;
      }
      if (control.errors['pattern']) {
        return `${this.getFieldDisplayName(fieldName)} must be a valid number`;
      }
    }
    return null;
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      articleNumber: 'Article Number',
      name: 'Name',
      articleCategory: 'Article Category',
      bicycleCategory: 'Bicycle Category',
      material: 'Material',
      lengthInMm: 'Length',
      widthInMm: 'Width',
      heightInMm: 'Height',
      netWeightInGramm: 'Net Weight'
    };
    return displayNames[fieldName] || fieldName;
  }

  hasFieldError(fieldName: string): boolean {
    const control = this.articleForm.get(fieldName);
    return !!(control && control.errors && control.touched);
  }

  get isFormValid(): boolean {
    return this.articleForm.valid;
  }

  get formTitle(): string {
    return this.mode === 'create' ? 'Add New Article' : 'Edit Article';
  }

  get submitButtonText(): string {
    return this.mode === 'create' ? 'Create Article' : 'Update Article';
  }
}