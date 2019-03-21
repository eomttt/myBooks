import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { UnderbarComponent } from './underbar/underbar';
import { MyBookComponent } from './my-book/my-book';
import { UpperbarComponent } from './upperbar/upperbar';
import { FindBookComponent } from './find-book/find-book';
import { FindBooksComponent } from './find-books/find-books';

@NgModule({
	declarations: [
    UnderbarComponent,
    MyBookComponent,
    UpperbarComponent,
    FindBookComponent,
    FindBooksComponent
  ],
	imports: [
    CommonModule,
    IonicModule
  ],
	exports: [
    UnderbarComponent,
    MyBookComponent,
    UpperbarComponent,
    FindBookComponent,
    FindBooksComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ComponentsModule {}
