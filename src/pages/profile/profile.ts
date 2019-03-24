import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, Events } from 'ionic-angular';

import { GooglePlus } from '@ionic-native/google-plus';
import { InAppBrowser } from '@ionic-native/in-app-browser';

// Import services
import { AuthProvider } from '../../providers/auth/auth';
import { BooksProvider } from '../../providers/books/books';
import { AdmobProvider } from '../../providers/admob/admob';

import { MainPage } from '../main/main';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  nowView = 'profile';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private authPvdr: AuthProvider,
              private booksPvdr: BooksProvider,
              private admobPvdr: AdmobProvider,
              private googlePlus: GooglePlus,
              private inAppBrowser: InAppBrowser,
              private events: Events,
              private platform: Platform) {
  }

  ionViewDidEnter() {
    this.admobPvdr.showBanner();
  }

  ionViewWillLeave() {
    this.admobPvdr.hideBanner();
  }


  public isAuthUser() {
    return this.authPvdr.isAuthentication();
  }

  public openContact() {
    this.admobPvdr.showInterstitial();

    this.events.subscribe('admobPvdr.closeInterstitial.profilePage', () => {
      this.events.unsubscribe('admobPvdr.closeInterstitial.profilePage');

      this._openWeb('https://open.kakao.com/o/skpWswjb');
    });
  }

  public openPrivacyPolicy() {
    this.admobPvdr.showInterstitial();

    this.events.subscribe('admobPvdr.closeInterstitial.profilePage', () => {
      this.events.unsubscribe('admobPvdr.closeInterstitial.profilePage');

      this._openWeb('https://firebasestorage.googleapis.com/v0/b/mybookeom.appspot.com/o/views%2Fmybooks-privacy.html?alt=media&token=e04563a9-6ccc-484a-8bb0-d2dad4b01b3b');
    });
  }

  public openTerms() {
    this.admobPvdr.showInterstitial();

    this.events.subscribe('admobPvdr.closeInterstitial.profilePage', () => {
      this.events.unsubscribe('admobPvdr.closeInterstitial.profilePage');

      this._openWeb('https://firebasestorage.googleapis.com/v0/b/mybookeom.appspot.com/o/views%2Fmybooks-terms.html?alt=media&token=aaf13069-31e2-4c06-9e06-27c9938fa7d4');
    });
  }

  public downLoadBamletter() {
    this.admobPvdr.showInterstitial();

    this.events.subscribe('admobPvdr.closeInterstitial.profilePage', () => {
      this.events.unsubscribe('admobPvdr.closeInterstitial.profilePage');

      if (this.platform.is('android')) {
        window.open('https://goo.gl/Ed6d1F', '_system');
      } else if (this.platform.is('ios')) {
        let browser = this.inAppBrowser.create('https://goo.gl/VvVub8', '_system');
        browser.show();
      } else {
        // Default value
      }  
    }); 
  }

  public login() {
    this.googlePlus.login({}).then(async (res) => {
      console.log('Google login res. ', res);
      await this._setUserInfo(res);
      await this._migrationBooks();

      this.navCtrl.setRoot(MainPage);
    }).catch((error) => {
      this._showFailLoginAlarm(error);
    })
  }

  public logOut() {
    let alert = this.alertCtrl.create({
      title: '알림',
      message: '로그아웃 후에 "나의 책"을 작성 할 경우 저장되지 않습니다. 그래도 진행 하시겠습니까?',
      buttons: [
        {
          text: '취소',
          handler: () => {
            // Nothing
          }
        }, {
          text: '로그아웃',
          handler: () => {
            this._logOut();
          }
        }
      ]
    })
    alert.present();
  }

  /**
   * Private function
   */
 
  private _logOut() {
    this.admobPvdr.showInterstitial();

    this.events.subscribe('admobPvdr.closeInterstitial.profilePage', () => {
      this.events.unsubscribe('admobPvdr.closeInterstitial.profilePage');

      this.authPvdr.setUserInfo(null);
      this.navCtrl.setRoot(MainPage);
    });
  }

  private _openWeb(url) {
    if (this.platform.is('android')) {
      window.open(url, '_system');
    } else if (this.platform.is('ios')) {
      let browser = this.inAppBrowser.create(url, '_system');
      browser.show();
    } else {
      // Default value
    }
  }

  private _migrationBooks() {
    return this.booksPvdr.migrationDeviceIdToUserId();
  }

  private _setUserInfo(userInfo) {
    return this.authPvdr.setUserInfo(userInfo);
  }

  private _showFailLoginAlarm(error) {
     let alert = this.alertCtrl.create({
      title: '알림',
      message: '로그인에 실패하였습니다. <br> 잠시 후 다시 시도해주세요. 반복적으로 문제가 발생할 경우 문의하기를 사용해주세요. <br>' + error.message,
      buttons: [
        {
          text: '확인',
          handler: () => {
            // Nothing
          }
        }
      ]
    });
    alert.present();
  }

}
