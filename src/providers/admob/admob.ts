import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';

// Import plugins
import { AdMobFree } from '@ionic-native/admob-free';


/*
  Generated class for the AdmobProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AdmobProvider {

  interstitialId = null;
  interstitialReady = false;

  bannerId = null;
  bannerReady = false;

  constructor(public http: HttpClient,
              private platform: Platform,
              private events: Events,
              private admobFree: AdMobFree) {
  }

  /**
   * Public function
   */

  public init(publicMode) {
    this._registerAdEvents();

    if (this.platform.is('android')) {
      this.interstitialId = 'ca-app-pub-3940256099942544/1033173712';
      this.bannerId = 'ca-app-pub-3940256099942544/6300978111';
    } else if (this.platform.is('ios')) {
      this.interstitialId = 'ca-app-pub-3940256099942544/4411468910';
      this.bannerId = 'ca-app-pub-3940256099942544/6300978111';
    }

    if (publicMode) {
      if (this.platform.is('android')) {
        this.interstitialId = 'ca-app-pub-9152190009267204/1926882819';
        this.bannerId = 'ca-app-pub-9152190009267204/4689132748';
      } else if (this.platform.is('ios')) {
        this.interstitialId = 'ca-app-pub-9152190009267204/5322012976';
        this.bannerId = 'ca-app-pub-9152190009267204/1843477556';
      }
    }

    this._prepareInterstitial(false);
    this._prepareBanner(false);
  }


  public showInterstitial() {
    if (!this.interstitialReady) {
      console.log('Interstitial not ready.');
      this._prepareInterstitial(true);
    } else {
      this.admobFree.interstitial.show();
    }
  }

  public showBanner() {
    if (!this.bannerReady) {
      console.log('Banner not ready.');
      this._prepareBanner(true);
    } else {
      this.admobFree.banner.show();
    }
  }

  public hideBanner() {
    this.admobFree.banner.hide();
  }

  /**
   * Private function
   */

  private _registerAdEvents() {
    document.addEventListener('admob.interstitial.events.LOAD_FAIL', (event) => {
      console.log('admob.interstitial.events.LOAD_FAIL ', event);
    });

    document.addEventListener('admob.interstitial.events.LOAD', (event) => {
      console.log('admob.interstitial.events.LOAD ', event);
    });

    document.addEventListener('admob.interstitial.events.REWARD', (event) => {
      console.log('admob.interstitial.events.REWARD ', event);
    });

    document.addEventListener('admob.interstitial.events.OPEN', (event) => {
      console.log('admob.interstitial.events.OPEN ', event);
    });

    document.addEventListener('admob.interstitial.events.CLOSE', (event) => {
      console.log('admob.interstitial.events.CLOSE ', event);
      this._closeInterstitial();
    });

    document.addEventListener('admob.banner.events.LOAD_FAIL', (event) => {
      console.log('admob.banner.events.LOAD_FAIL ', event);
    });

    document.addEventListener('admob.banner.events.LOAD', (event) => {
      console.log('admob.banner.events.LOAD ', event);
    });

    document.addEventListener('admob.banner.events.REWARD', (event) => {
      console.log('admob.banner.events.REWARD ', event);
    });

    document.addEventListener('admob.banner.events.OPEN', (event) => {
      console.log('admob.banner.events.OPEN ', event);
    });

    document.addEventListener('admob.banner.events.CLOSE', (event) => {
      console.log('admob.banner.events.CLOSE ', event);
    });
  }

  private _closeInterstitial() {
    this.events.publish('admobPvdr.closeInterstitial.profilePage');
    this.events.publish('admobPvdr.closeInterstitial.addBookPage');

    this.interstitialReady = false;
    this._prepareInterstitial(false);
  }

  private _prepareInterstitial(isAutoShow) {
    const interstitialConfig = {
      id: this.interstitialId,
      isTesting: false,
      autoShow: isAutoShow
    };

    this.admobFree.interstitial.config(interstitialConfig);
    this.admobFree.interstitial.prepare().then(() => {
      this.interstitialReady = true;
      console.log('Interstitial prepared.');
    }).catch((error) => {
      console.log('Error to prepare Interstitial. ', error);
    });
  }

  private _prepareBanner(isAutoShow) {
    const bannerConfig = {
      id: this.bannerId,
      isTesting: false,
      autoShow: isAutoShow
    };

    this.admobFree.banner.config(bannerConfig);
    this.admobFree.banner.prepare().then(() => {
      this.bannerReady = true;
      console.log('Banner prepared.');
    }).catch((error) => {
      console.log('Error to prepare Banner. ', error);
    });
  }


}
