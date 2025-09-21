import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ArticleFilterComponent } from './article-filter.component';
import { ArticleFilters } from '../../../models';

describe('ArticleFilterComponent', () => {
  let component: ArticleFilterComponent;
  let fixture: ComponentFixture<ArticleFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ArticleFilterComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatChipsModule,
        MatTooltipModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ArticleFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.filterForm.get('articleCategory')?.value).toBe('');
    expect(component.filterForm.get('bicycleCategories')?.value).toEqual([]);
    expect(component.filterForm.get('material')?.value).toBe('');
  });

  it('should load filter options from enums', () => {
    expect(component.articleCategories.length).toBeGreaterThan(0);
    expect(component.bicycleCategories.length).toBeGreaterThan(0);
    expect(component.materials.length).toBeGreaterThan(0);
  });

  it('should emit filters when form changes', () => {
    spyOn(component.filtersChanged, 'emit');

    component.filterForm.patchValue({
      articleCategory: 'Hub',
      material: 'Aluminium'
    });

    expect(component.filtersChanged.emit).toHaveBeenCalledWith({
      articleCategory: 'Hub',
      material: 'Aluminium'
    });
  });

  it('should emit filters with bicycle categories array', () => {
    spyOn(component.filtersChanged, 'emit');

    component.filterForm.patchValue({
      bicycleCategories: ['Road', 'Gravel']
    });

    expect(component.filtersChanged.emit).toHaveBeenCalledWith({
      bicycleCategories: ['Road', 'Gravel']
    });
  });

  it('should clear all filters', () => {
    spyOn(component.filtersCleared, 'emit');

    // Set some values first
    component.filterForm.patchValue({
      articleCategory: 'Hub',
      bicycleCategories: ['Road'],
      material: 'Aluminium'
    });

    component.clearFilters();

    expect(component.filterForm.get('articleCategory')?.value).toBe('');
    expect(component.filterForm.get('bicycleCategories')?.value).toEqual([]);
    expect(component.filterForm.get('material')?.value).toBe('');
    expect(component.filtersCleared.emit).toHaveBeenCalled();
  });

  it('should detect active filters correctly', () => {
    expect(component.hasActiveFilters()).toBeFalsy();

    component.filterForm.patchValue({
      articleCategory: 'Hub'
    });

    expect(component.hasActiveFilters()).toBeTruthy();
  });

  it('should count active filters correctly', () => {
    expect(component.getActiveFiltersCount()).toBe(0);

    component.filterForm.patchValue({
      articleCategory: 'Hub',
      bicycleCategories: ['Road', 'Gravel'],
      material: 'Aluminium'
    });

    expect(component.getActiveFiltersCount()).toBe(3);
  });

  it('should remove bicycle category correctly', () => {
    component.filterForm.patchValue({
      bicycleCategories: ['Road', 'Gravel', 'e-City']
    });

    component.removeBicycleCategory('Gravel');

    expect(component.filterForm.get('bicycleCategories')?.value).toEqual(['Road', 'e-City']);
  });

  it('should not emit empty filters', () => {
    spyOn(component.filtersChanged, 'emit');

    component.filterForm.patchValue({
      articleCategory: '',
      bicycleCategories: [],
      material: ''
    });

    expect(component.filtersChanged.emit).toHaveBeenCalledWith({});
  });
});
