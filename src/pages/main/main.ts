import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

    }
  }

  private _setMyBooks(newBooks) {
    this.myBooks = this.myBooks.concat(newBooks);
  }

  private _active() {
    this._getMyBooks();
  }

}
