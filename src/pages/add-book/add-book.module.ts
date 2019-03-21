import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddBookPage } from './add-book';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    AddBookPage,
  ],
  imports: [
    IonicPageModule.forChild(AddBookPage),
    ComponentsModule,
  ],
})
export class AddBookPageModule {}
