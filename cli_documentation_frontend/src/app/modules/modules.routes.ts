import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DocumentationComponent } from './documentation/documentation.component';

export const ModulesRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, data: { title: 'Home Page' } },
  { path: 'doc/:type', component: DocumentationComponent, data: { title: 'Documentation Page' } },
];