import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { ComponentsModule } from '../components/components.module';

// Import pages
import { MainPageModule } from '../pages/main/main.module';
import { AddBookPageModule } from '../pages/add-book/add-book.module';
import { ProfilePageModule } from '../pages/profile/profile.module';

// Import providers
import { BooksProvider } from '../providers/books/books';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    ComponentsModule,
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    MainPageModule,
    AddBookPageModule,
    ProfilePageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BooksProvider
  ]
})
export class AppModule {}
