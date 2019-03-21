import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddBookPage');
  }

  public findBook(data) {
    this.findBookList = this.findBookList.concat(data);
    this.showFindBookList = true;
  }

  public clickCancleButton() {

  }

  public clickConfirmButton() {

  }

}
