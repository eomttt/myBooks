import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { NativeStorage } from '@ionic-native/native-storage';

@Injectable()
export class AuthProvider {

  AUTH_STORAGE_KEY = 'AK';

  userInfo = null;

  constructor(public http: HttpClient,
              private nativeStorage: NativeStorage) {

  }

  public getUser() {
    return this.userInfo;
  }

  public isAuthentication() {
    return !!this.userInfo;
  }

  public setUserInfo(info) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.nativeStorage.setItem(this.AUTH_STORAGE_KEY, info);
        this.userInfo = info;

        console.log('Set user info', this.userInfo);

        resolve();
      } catch(error) {
        console.log('Set item to native stroage', error);
        reject(error);
      }
    });
  }

  public getUserInfo() {
    return new Promise(async (resolve, reject) => {
      try {
        this.userInfo = await this.nativeStorage.getItem(this.AUTH_STORAGE_KEY);

        console.log('Get user info', this.userInfo);

        resolve();
      } catch(error) {
        console.log('Get item error', error);
        reject(error);
      }
    });
  }

}
