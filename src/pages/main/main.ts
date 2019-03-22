import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

// Import providers
import { BooksProvider } from '../../providers/books/books';


@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

  nowView = 'main';

  myBooks = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private booksPvdr: BooksProvider) {
  }

  ionViewWillLoad() {
    this._active();
  }

  ionViewDidLoad() {

  }

  /**
   * Private function
   */

  private async _getMyBooks() {
    try {
      let books = await this.booksPvdr.getMyBooks();

      this._setMyBooks(books);
    } catch(error) {
      this._showGetBooksError(error);
    }
  }

  private _setMyBooks(newBooks) {
    console.log('Set new books', newBooks);
    this.myBooks = this.myBooks.concat(newBooks);
  }

  /**
   * Private function
   */

  private _showGetBooksError(error) {
    let alert = this.alertCtrl.create({
      title: '알림',
      message: '책을 가져오는데에 실패했습니다. <br> 잠시 후 다시 시도해주세요. 반복적으로 문제가 발생할 경우 문의하기를 사용해주세요. <br>' + error.message,
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

  private _active() {
    this._getMyBooks();
  }

}
