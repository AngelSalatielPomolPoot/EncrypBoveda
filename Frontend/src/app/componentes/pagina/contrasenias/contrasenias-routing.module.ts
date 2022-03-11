import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContraseniasComponent } from './contrasenias.component';

const routes: Routes = [{ path: '', component: ContraseniasComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContraseniasRoutingModule { }
