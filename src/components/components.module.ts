import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { UnderbarComponent } from './underbar/underbar';
import { MyBookComponent } from './my-book/my-book';
@NgModule({
	declarations: [
      UnderbarComponent,
      MyBookComponent
  ],
	imports: [
    CommonModule,
    IonicModule
  ],
	exports: [
    UnderbarComponent,
    MyBookComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ComponentsModule {}
