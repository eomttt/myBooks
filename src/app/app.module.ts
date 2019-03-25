import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { File } from '@ionic-native/file';
import { Base64 } from '@ionic-native/base64';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { GooglePlus } from '@ionic-native/google-plus';
import { NativeStorage } from '@ionic-native/native-storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AdMobFree } from '@ionic-native/admob-free';

import { AngularFireModule } from '@angular/fire';
import { firebaseConfig } from '../environment';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { MyApp } from './app.component';
import { ComponentsModule } from '../components/components.module';
import { AngularCropperjsModule } from 'angular-cropperjs';

// Import pages
import { MainPageModule } from '../pages/main/main.module';
import { AddBookPageModule } from '../pages/add-book/add-book.module';
import { ProfilePageModule } from '../pages/profile/profile.module';

// Import providers
import { BooksProvider } from '../providers/books/books';
import { AuthProvider } from '../providers/auth/auth';
import { AdmobProvider } from '../providers/admob/admob';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    ComponentsModule,
    BrowserModule,
    HttpModule,
    HttpClientModule,
    AngularCropperjsModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireStorageModule,
    AngularFireDatabaseModule,
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
    Camera,
    Crop,
    File,
    Base64,
    UniqueDeviceID,
    GooglePlus,
    NativeStorage,
    InAppBrowser,
    AdMobFree,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BooksProvider,
    AuthProvider,
    AdmobProvider
  ]
})
export class AppModule {}
