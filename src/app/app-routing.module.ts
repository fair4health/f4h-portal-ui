import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { UsecaseComponent } from './usecase/usecase.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'usecase', component: UsecaseComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
