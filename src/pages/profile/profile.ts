import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { GooglePlus } from '@ionic-native/google-plus';

// Import services
import { AuthProvider } from '../../providers/auth/auth';

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
              private authPvdr: AuthProvider,
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

  public register() {
    this.googlePlus.login().then((res) => {
      console.log("AAAA", res);
    }).catch((error) => {
      console.log("BBB", error);
    })
  }

}
