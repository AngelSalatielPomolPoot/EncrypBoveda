import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentosRoutingModule } from './documentos-routing.module';
import { DocumentosComponent } from './documentos.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DocumentosComponent
  ],
  imports: [
    CommonModule,
    DocumentosRoutingModule,
    FormsModule

  ]
})
export class DocumentosModule { }
