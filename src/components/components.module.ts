import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { UnderbarComponent } from './underbar/underbar';
@NgModule({
	declarations: [UnderbarComponent],
	imports: [CommonModule, IonicModule],
	exports: [UnderbarComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule {}
