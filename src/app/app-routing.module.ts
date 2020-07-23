import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { UsecaseComponent } from './usecase/usecase.component';
import { NewusecaseComponent } from './newusecase/newusecase.component';

import { CoverPageComponent } from './cover-page/cover-page.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', component: CoverPageComponent},
  { path: 'login', component: LoginComponent},
  { path: 'usecase', component: UsecaseComponent },
  { path: 'newusecase', component: NewusecaseComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
