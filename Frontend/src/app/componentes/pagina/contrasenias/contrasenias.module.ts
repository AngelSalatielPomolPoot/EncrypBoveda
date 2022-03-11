import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContraseniasRoutingModule } from './contrasenias-routing.module';
import { ContraseniasComponent } from './contrasenias.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ContraseniasComponent,
  ],
  imports: [
    CommonModule,
    ContraseniasRoutingModule,
    FormsModule
  ]
})
export class ContraseniasModule { }
