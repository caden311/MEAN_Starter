import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HomeComponent} from './home.component';
import {DocumentsModule} from '../documents/documents.module';


@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    BrowserModule,
  ],
  exports: [
    HomeComponent
  ],
})
export class HomeModule { }
