import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatOptionModule } from '@angular/material/core';
import { ArticleFilters } from '../../../models';
import { getArticleCategories, getBicycleCategories, getMaterials } from '../../../models/article-enums';

@Component({
  selector: 'app-article-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
    MatOptionModule
  ],
  templateUrl: './article-filter.component.html',
  styleUrl: './article-filter.component.css'
})
export class ArticleFilterComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<ArticleFilters>();
  @Output() filtersCleared = new EventEmitter<void>();

  filterForm: FormGroup;

  // Available filter options
  articleCategories: string[] = [];
  bicycleCategories: string[] = [];
  materials: string[] = [];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      articleCategory: [''],
      bicycleCategories: [[]],
      material: ['']
    });
  }

  ngOnInit(): void {
    // Initialize filter options from enums
    this.articleCategories = getArticleCategories();
    this.bicycleCategories = getBicycleCategories();
    this.materials = getMaterials();

    // Subscribe to form changes and emit filter updates
    this.filterForm.valueChanges.subscribe(() => {
      this.onFiltersChange();
    });
  }

  /**
   * Handle form changes and emit filter updates
   */
  private onFiltersChange(): void {
    const formValue = this.filterForm.value;
    const filters: ArticleFilters = {};

    // Only include non-empty values in the filters
    if (formValue.articleCategory) {
      filters.articleCategory = formValue.articleCategory;
    }

    if (formValue.bicycleCategories && formValue.bicycleCategories.length > 0) {
      filters.bicycleCategories = formValue.bicycleCategories;
    }

    if (formValue.material) {
      filters.material = formValue.material;
    }

    this.filtersChanged.emit(filters);
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.filterForm.reset({
      articleCategory: '',
      bicycleCategories: [],
      material: ''
    });
    this.filtersCleared.emit();
  }

  /**
   * Check if any filters are active
   */
  hasActiveFilters(): boolean {
    const formValue = this.filterForm.value;
    return !!(
      formValue.articleCategory ||
      (formValue.bicycleCategories && formValue.bicycleCategories.length > 0) ||
      formValue.material
    );
  }

  /**
   * Get count of active filters for display
   */
  getActiveFiltersCount(): number {
    const formValue = this.filterForm.value;
    let count = 0;

    if (formValue.articleCategory) count++;
    if (formValue.bicycleCategories && formValue.bicycleCategories.length > 0) count++;
    if (formValue.material) count++;

    return count;
  }

  /**
   * Remove a specific bicycle category from the multi-select
   */
  removeBicycleCategory(categoryToRemove: string): void {
    const currentCategories = this.filterForm.get('bicycleCategories')?.value || [];
    const updatedCategories = currentCategories.filter((category: string) => category !== categoryToRemove);
    this.filterForm.patchValue({ bicycleCategories: updatedCategories });
  }

  /**
   * Handle bicycle category checkbox changes
   */
  onBicycleCategoryChange(category: string, event: any): void {
    const currentCategories = this.filterForm.get('bicycleCategories')?.value || [];
    let updatedCategories: string[];

    if (event.target.checked) {
      // Add category if checked
      updatedCategories = [...currentCategories, category];
    } else {
      // Remove category if unchecked
      updatedCategories = currentCategories.filter((cat: string) => cat !== category);
    }

    this.filterForm.patchValue({ bicycleCategories: updatedCategories });
  }

  /**
   * Check if a bicycle category is currently selected
   */
  isBicycleCategorySelected(category: string): boolean {
    const currentCategories = this.filterForm.get('bicycleCategories')?.value || [];
    return currentCategories.includes(category);
  }

  /**
   * TrackBy function for bicycle categories to improve performance
   */
  trackByCategory(index: number, category: string): string {
    return category;
  }
}
