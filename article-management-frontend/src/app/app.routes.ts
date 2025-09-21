import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/articles',
        pathMatch: 'full'
    },
    {
        path: 'articles',
        loadChildren: () => import('./features/articles/articles.module').then(m => m.ArticlesModule)
    }
];
