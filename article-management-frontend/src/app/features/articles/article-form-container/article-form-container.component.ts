import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ArticleFormComponent } from '../article-form/article-form.component';
import { Article, CreateArticle, UpdateArticle } from '../../../models';
import { ArticleService } from '../../../services';

@Component({
  selector: 'app-article-form-container',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ArticleFormComponent
  ],
  template: `
    <div class="form-container">
      <!-- Navigation Header -->
      <div class="navigation-header">
        <button mat-button (click)="navigateBack()" class="back-button">
          <mat-icon>arrow_back</mat-icon>
          Back to Articles
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Loading article...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error && !loading" class="error-container">
        <mat-icon color="warn">error</mat-icon>
        <p>{{ error }}</p>
        <button mat-button color="primary" (click)="navigateBack()">
          <mat-icon>arrow_back</mat-icon>
          Back to Articles
        </button>
      </div>

      <!-- Form -->
      <app-article-form
        *ngIf="!loading && !error"
        [article]="article"
        [mode]="mode"
        (formSubmit)="onFormSubmit($event)"
        (formCancel)="onFormCancel()">
      </app-article-form>
    </div>
  `,
  styles: [`
    .form-container {
      padding: 16px;
    }

    .navigation-header {
      margin-bottom: 16px;
    }

    .back-button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .loading-container,
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 16px;
      text-align: center;
    }

    .error-container mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    .loading-container p,
    .error-container p {
      margin: 16px 0;
      color: rgba(0, 0, 0, 0.6);
    }
  `]
})
export class ArticleFormContainerComponent implements OnInit {
  article: Article | null = null;
  mode: 'create' | 'edit' = 'create';
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService
  ) { }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.mode = 'edit';
      await this.loadArticle(Number(id));
    } else {
      this.mode = 'create';
    }
  }

  private async loadArticle(id: number): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      this.article = await this.articleService.getArticle(id);
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to load article';
      console.error('Error loading article:', error);
      // Navigate back to list if article not found
      this.router.navigate(['/articles']);
    } finally {
      this.loading = false;
    }
  }

  onFormSubmit(articleData: CreateArticle | UpdateArticle): void {
    // Navigate back to article list after successful submission
    this.navigateBack();
  }

  onFormCancel(): void {
    // Navigate back to article list
    this.navigateBack();
  }

  navigateBack(): void {
    // Preserve query parameters when navigating back
    const queryParams = this.route.snapshot.queryParams;
    this.router.navigate(['/articles'], { queryParams });
  }
}