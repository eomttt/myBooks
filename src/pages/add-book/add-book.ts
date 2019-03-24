import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';

// Import providers
import { BooksProvider } from '../../providers/books/books';
import { AdmobProvider } from '../../providers/admob/admob';
import { AuthProvider } from '../../providers/auth/auth';

// Import pages
import { MainPage } from '../main/main';
import { ProfilePage } from '../profile/profile';

/**
 * Generated class for the AddBookPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-book',
  templateUrl: 'add-book.html',
})
export class AddBookPage {

  upperbarLeftText = '취소';
  upperbarRightText = '확인';

  newAddingBook = {};

  findBookList = [];
  showFindBookList = false;

  constructor(public alertCtrl: AlertController,
              public navCtrl: NavController,
              public navParams: NavParams,
              private booksPvdr: BooksProvider,
              private admobPvdr: AdmobProvider,
              private authPvdr: AuthProvider,
              private events: Events) {
  }

  ionViewDidEnter() {
    this.admobPvdr.showBanner();
  }

  ionViewWillLeave() {
    this.admobPvdr.hideBanner();
  }


  public findBook(data) {
    this.findBookList = data;
    this.showFindBookList = true;
  }

  public clickCancleButton() {
    if (this.showFindBookList) {
      this.showFindBookList = false;
    } else {
      this.navCtrl.pop();
    }
  }

  public clickConfirmButton() {
    if (this.showFindBookList) {
      let selectedBook = this._getSelectedBook();

      if (!!selectedBook) {
        this.newAddingBook = {
          title: selectedBook.title,
          image: selectedBook.thumbnail
        };
      }

      this.showFindBookList = false;
    } else {
      this.events.publish('addBookPage.emit.myBookComp');
    }
  }

  public async setMyBook(data) {
    if (this.authPvdr.isAuthentication()) {
      this._setMyBook(data);
    } else {
      if (this._isOverDemo()) {
        this._showLoginAlarm();
      } else if (this._isShowWarn()) {
        this._showLoginWarnAlarm(data);
      } else {
        this._setMyBook(data);
      }
    }
  }

  private _isOverDemo() {
    return this.booksPvdr.getBooksLen() >= 5;
  }

  private _isShowWarn() {
    return this.booksPvdr.getBooksLen() >= 3 ;
  }

  private _showLoginWarnAlarm(data) {
    let alert = this.alertCtrl.create({
      title: '알림',
      message: '로그인을 하지 않으면 최대 5장 까지 밖에 저장 할 수 없습니다. 로그인은 프로필 창에서 가능합니다.',
      buttons: [
        {
          text: '확인',
          handler: () => {
            this._setMyBook(data);
          }
        }
      ]
    });
    alert.present();     
  }

  private _showLoginAlarm() {
    let alert = this.alertCtrl.create({
      title: '알림',
      message: '로그인을 해야 더 저장 할 수 있습니다. (로그인을 하지 않으면 최대 5장 까지만 저장됩니다.)',
      buttons: [
        {
          text: '취소',
          handler: () => {
            // Nothing
          }
        },
        {
          text: '로그인 하기',
          handler: () => {
            this.navCtrl.setRoot(ProfilePage);
          }
        }
      ]
    });
    alert.present();    
  }

  private async _setMyBook(data) {
    try {
      console.log('Set my book.', data);
      await this.booksPvdr.setBooksData(data);

      if (this._isShowAdPaper()) {
        this._showAddBookAdInterstital();
      } else {
        this.navCtrl.setRoot(MainPage);
      }
    } catch(error) {
      this._showAddBookError();
    }    
  }

  private _isShowAdPaper() {
    return this.booksPvdr.getBooksLen() % 3 === 0 && this.booksPvdr.getBooksLen() !== 0;
  }

  public selectedBook(index) {
    for (let i=0, len=this.findBookList.length; i<len; i++) {
      this.findBookList[i].select = false;
    }

    this.findBookList[index].select = true;
  }

  /*
   * Private function
   */

  private _showAddBookAdInterstital() {
    this.admobPvdr.showInterstitial();

    this.events.subscribe('admobPvdr.closeInterstitial.addBookPage', () => {
      this.events.unsubscribe('admobPvdr.closeInterstitial.addBookPage');
      this.navCtrl.setRoot(MainPage);
    });
  }

  private _getSelectedBook() {
    let selectedIndex = null;

    for (let i=0, len=this.findBookList.length; i<len; i++) {
      if (this.findBookList[i].select) {
        selectedIndex = i;
        break;
      }
    }

    if (selectedIndex !== null) {
      return this.findBookList[selectedIndex];
    } else {
      return null;
    }
  }

  private _showAddBookError() {
    let alert = this.alertCtrl.create({
      title: '알림',
      message: '저장에 실패하였습니다. <br> 잠시 후 다시 시도해주세요. 반복적으로 문제가 발생할 경우 문의하기를 사용해주세요. <br>',
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
