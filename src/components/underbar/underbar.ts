import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

// Import pages
import { MainPage } from '../../pages/main/main';
import { AddBookPage } from '../../pages/add-book/add-book';
import { ProfilePage } from '../../pages/profile/profile';

@Component({
  selector: 'underbar',
  templateUrl: 'underbar.html'
})
export class UnderbarComponent {

  _nowView: any;

  @Input()
  set nowView(data) {
    this._nowView = data;
  }
  get nowView() {
    return this._nowView;
  }

  constructor(private navCtrl: NavController) {

  }

  public setShowViewStyle() {
    return {'background-color': '#333333'};
  }

  public isNowView(view) {
    return this.nowView === view;
  }

  public openMainPage() {
    this.navCtrl.setRoot(MainPage);
  }

  public openAddBookPage() {
    this.navCtrl.push(AddBookPage);
  }

  public openProfilePage() {
    if (this.isNowView('main')) {
      this.navCtrl.push(ProfilePage);
    }
  }

}
