import { Routes } from '@angular/router';
import { LoadingComponent } from './loading/loading.component';
import { AdminComponent } from './admin/admin.component';

import { HomeComponent } from './home/home.component';

export const routes: Routes = [


    { path: 'admin', component: AdminComponent },
    { path: 'home', component: HomeComponent },
    { path: '', redirectTo: '/admin', pathMatch: 'full' },





];
