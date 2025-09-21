import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleFormContainerComponent } from './article-form-container/article-form-container.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ArticlesRoutingModule,
    ArticleListComponent,
    ArticleFormContainerComponent
  ]
})
export class ArticlesModule { }
