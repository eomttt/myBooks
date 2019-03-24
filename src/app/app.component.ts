import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthProvider } from '../providers/auth/auth';
import { AdmobProvider } from '../providers/admob/admob';

import { MainPage } from '../pages/main/main';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav)
  nav: Nav;

  PUBLIC_MODE = false;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private authPvdr: AuthProvider,
              private admobPvdr: AdmobProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this._active();
    });
  }

  private async _active() {
    try {
      this.admobPvdr.init(this.PUBLIC_MODE);
      this.admobPvdr.hideBanner();
      await this.authPvdr.getUserInfo();
    } catch(error) {

    }

    this.nav.setRoot(MainPage);   
  }
}

