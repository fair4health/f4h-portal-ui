import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { UsecaseComponent } from './usecase/usecase.component';
import { NewusecaseComponent } from './newusecase/newusecase.component';

import { CoverPageComponent } from './cover-page/cover-page.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UseCaseListComponent } from './use-case-list/use-case-list.component';
import { UseCaseMenuComponent } from './use-case-menu/use-case-menu.component';
import { FeatureSetCreationComponent } from './feature-set-creation/feature-set-creation.component';
import { FeatureSetListComponent } from './feature-set-list/feature-set-list.component';
import { DataSetCreationComponent } from './data-set-creation/data-set-creation.component';
import { DataSetDashboardComponent } from './data-set-dashboard/data-set-dashboard.component';
import { ModelDashboardComponent } from './model-dashboard/model-dashboard.component';
import { ModelCreationComponent } from './model-creation/model-creation.component';

const routes: Routes = [
  { path: '', component: CoverPageComponent},
  { path: 'login', component: LoginComponent},
  { path: 'uclist', component: UseCaseListComponent},
  { path: 'ucmenu', component: UseCaseMenuComponent},
  { path: 'fscreation', component: FeatureSetCreationComponent},
  { path: 'fslist', component: FeatureSetListComponent},
  { path: 'dscreation', component: DataSetCreationComponent},
  { path: 'dsdashboard', component: DataSetDashboardComponent},
  { path: 'mdashboard', component: ModelDashboardComponent},
  { path: 'mcreation', component: ModelCreationComponent},

  { path: 'usecase', component: UsecaseComponent },
  { path: 'newusecase', component: NewusecaseComponent },

  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
