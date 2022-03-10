import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TarjetasRoutingModule } from './tarjetas-routing.module';
import { TarjetasComponent } from './tarjetas.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TarjetasComponent
  ],
  imports: [
    CommonModule,
    TarjetasRoutingModule,
    FormsModule
  ]
})
export class TarjetasModule { }
