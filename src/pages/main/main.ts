import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Content } from 'ionic-angular';

// Import providers
import { BooksProvider } from '../../providers/books/books';


@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {
  @ViewChild(Content) content: Content;

  nowView = 'main';

  myBooks: any;

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

  ionViewDidEnter() {
    this.content.resize();
  }

  public async loadMore(infiniteScroll) {
    try {
      await this._getMyBooks(false);
      infiniteScroll.complete();
    } catch(error) {
      infiniteScroll.complete();
    }
  }

  public hasNextBook() {
    return !this.booksPvdr.isFinGetBooks();
  }

  /**
   * Private function
   */

  private _getMyBooks(firstGet) {
    return new Promise(async (resolve, reject) => {
      try {
        this.myBooks = await this.booksPvdr.getMyBooks(firstGet);

        resolve();
      } catch(error) {
        this._showGetBooksError(error);
        reject();
      }
    });
  }

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
    this._getMyBooks(true);
  }

}
