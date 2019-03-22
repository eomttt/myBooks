import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';

// Import providers
import { BooksProvider } from '../../providers/books/books';

// Import pages
import { MainPage } from '../main/main';

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
              private events: Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddBookPage');
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
    try {
      console.log('Set my book.', data);
      await this.booksPvdr.setBooksData(data);
      this.navCtrl.setRoot(MainPage);
    } catch(error) {
      this._showAddBookError();
    }
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
