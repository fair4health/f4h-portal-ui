/**
 * @license
 * Copyright (C) 2020  Atos Spain SA. All rights reserved.
 *
 * Use of this source code is governed by a license style Apache License, Version 2.0 that can be
 * found in the LICENSE file at https://github.com/fair4health/f4h-portal-ui/blob/master/LICENSE
 *
 * The software is provided "AS IS", without any warranty of any kind, express or implied,
 * including but not limited to the warranties of merchantability, fitness for a particular
 * purpose and noninfringement, in no event shall the authors or copyright holders be
 * liable for any claim, damages or other liability, whether in action of contract, tort or
 * otherwise, arising from, out of or in connection with the software or the use or other
 * dealings in the software.
 *
 * See README file for the full disclaimer information and LICENSE file for full license
 * information in the project root.
 */

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
  { path: 'fsdetails', component: FeatureSetCreationComponent},
  { path: 'dscreation', component: DataSetCreationComponent},
  { path: 'dsdashboard', component: DataSetDashboardComponent},
  { path: 'dsdetails', component: DataSetCreationComponent},
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
