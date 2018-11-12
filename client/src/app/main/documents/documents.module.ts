import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {DocumentsComponent} from './documents.component';



@NgModule({
  declarations: [
    DocumentsComponent,
  ],
  imports: [
    BrowserModule,
  ],
  exports: [
    DocumentsComponent
  ],
})
export class DocumentsModule { }
