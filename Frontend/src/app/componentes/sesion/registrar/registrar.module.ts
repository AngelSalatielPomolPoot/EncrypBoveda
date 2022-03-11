import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrarRoutingModule } from './registrar-routing.module';
import { RegistrarComponent } from './registrar.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RegistrarComponent
  ],
  imports: [
    CommonModule,
    RegistrarRoutingModule,
    FormsModule,
  ]
})
export class RegistrarModule { }
