import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { GooglePlus } from '@ionic-native/google-plus';

// Import services
import { AuthProvider } from '../../providers/auth/auth';
import { BooksProvider } from '../../providers/books/books';

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
              private googlePlus: GooglePlus) {
  }

  ionViewDidLoad() {
  }

  public isAuthUser() {
    return this.authPvdr.isAuthentication();
  }

  public openContact() {

  }

  public openPrivacyPolicy() {

  }

  public openTerms() {

  }

  public downLoadBamletter() {

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
            this.authPvdr.setUserInfo(null);
          }
        }
      ]
    })
    alert.present();
  }

  /**
   * Private function
   */
  
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
