import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { Article, SortOptions, SortField, SortDirection, ArticleFilters } from '../../../models';
import { ArticleService } from '../../../services';
import { ArticleFilterComponent } from '../article-filter/article-filter.component';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSortModule,
    ArticleFilterComponent
  ],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.css'
})
export class ArticleListComponent implements OnInit {
  articles: Article[] = [];
  loading = false;
  error: string | null = null;
  currentSort: SortOptions | null = null;
  currentFilters: ArticleFilters = {};

  displayedColumns: string[] = [
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
  ];

  // Define which columns are sortable
  sortableColumns: SortField[] = ['netWeightInGramm', 'articleCategory'];

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Restore state from query parameters if available
    this.restoreStateFromQueryParams();
    this.loadArticles();
  }

  /**
   * Restore filters and sorting from query parameters
   */
  private restoreStateFromQueryParams(): void {
    const queryParams = this.route.snapshot.queryParams;

    // Restore filters
    if (queryParams['articleCategory']) {
      this.currentFilters.articleCategory = queryParams['articleCategory'];
    }
    if (queryParams['bicycleCategories']) {
      this.currentFilters.bicycleCategories = queryParams['bicycleCategories'].split(',');
    }
    if (queryParams['material']) {
      this.currentFilters.material = queryParams['material'];
    }

    // Restore sort
    if (queryParams['sortField'] && queryParams['sortDirection']) {
      this.currentSort = {
        field: queryParams['sortField'],
        direction: queryParams['sortDirection']
      };
    }
  }

  async loadArticles(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      // Pass both filters and sort options to the service
      const filters = Object.keys(this.currentFilters).length > 0 ? this.currentFilters : undefined;
      const sortOptions = this.currentSort || undefined;

      this.articles = await this.articleService.getArticles(filters, sortOptions);
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to load articles';
      console.error('Error loading articles:', error);
    } finally {
      this.loading = false;
    }
  }

  onEdit(article: Article): void {
    // Navigate to edit form with current state preserved in query params
    this.router.navigate(['/articles/edit', article.id], {
      queryParams: this.buildStateQueryParams()
    });
  }

  onDelete(article: Article): void {
    // TODO: Implement delete functionality (will be implemented in later tasks)
    console.log('Delete article:', article);
  }

  onAddNew(): void {
    // Navigate to create form with current state preserved in query params
    this.router.navigate(['/articles/new'], {
      queryParams: this.buildStateQueryParams()
    });
  }

  /**
   * Build query parameters to preserve current state
   */
  private buildStateQueryParams(): any {
    const params: any = {};

    // Preserve current filters
    if (this.currentFilters.articleCategory) {
      params.articleCategory = this.currentFilters.articleCategory;
    }
    if (this.currentFilters.bicycleCategories && this.currentFilters.bicycleCategories.length > 0) {
      params.bicycleCategories = this.currentFilters.bicycleCategories.join(',');
    }
    if (this.currentFilters.material) {
      params.material = this.currentFilters.material;
    }

    // Preserve current sort
    if (this.currentSort) {
      params.sortField = this.currentSort.field;
      params.sortDirection = this.currentSort.direction;
    }

    return params;
  }

  /**
   * Check if a column is sortable
   */
  isSortable(column: string): boolean {
    return this.sortableColumns.includes(column as SortField);
  }

  /**
   * Handle column header click for sorting
   */
  onSort(column: string): void {
    if (!this.isSortable(column)) {
      return;
    }

    const field = column as SortField;
    let direction: SortDirection = 'asc';

    // If clicking the same column, toggle direction
    if (this.currentSort && this.currentSort.field === field) {
      direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    }

    this.currentSort = { field, direction };
    this.loadArticles();
  }

  /**
   * Get the sort icon for a column
   */
  getSortIcon(column: string): string {
    if (!this.isSortable(column) || !this.currentSort || this.currentSort.field !== column) {
      return 'unfold_more';
    }

    return this.currentSort.direction === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
  }

  /**
   * Get the sort direction for accessibility
   */
  getSortDirection(column: string): string {
    if (!this.currentSort || this.currentSort.field !== column) {
      return '';
    }
    return this.currentSort.direction === 'asc' ? 'ascending' : 'descending';
  }

  /**
   * Handle filter changes from the filter component
   */
  onFiltersChanged(filters: ArticleFilters): void {
    this.currentFilters = filters;
    this.loadArticles();
  }

  /**
   * Handle filter clearing from the filter component
   */
  onFiltersCleared(): void {
    this.currentFilters = {};
    this.loadArticles();
  }

  /**
   * Check if any filters are currently active
   */
  hasActiveFilters(): boolean {
    return Object.keys(this.currentFilters).length > 0;
  }

  /**
   * Get the count of active filters for display
   */
  getActiveFiltersCount(): number {
    let count = 0;
    if (this.currentFilters.articleCategory) count++;
    if (this.currentFilters.bicycleCategories && this.currentFilters.bicycleCategories.length > 0) count++;
    if (this.currentFilters.material) count++;
    return count;
  }
}
