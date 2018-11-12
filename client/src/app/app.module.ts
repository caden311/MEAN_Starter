import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {RouterModule} from '@angular/router';
import {HomeComponent} from './main/home/home.component';
import {HomeModule} from './main/home/home.module';
import {DocumentsModule} from './main/documents/documents.module';
import {DocumentsComponent} from './main/documents/documents.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HomeModule,
    DocumentsModule,
    RouterModule.forRoot([
      {path: '', redirectTo: '/Home', pathMatch: 'full'},
      {path: 'Documents', component: DocumentsComponent},
      {path: 'Home', component: HomeComponent}
      ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
