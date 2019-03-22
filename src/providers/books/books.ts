import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Crop, CropOptions } from '@ionic-native/crop';
import { File } from '@ionic-native/file';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable()
export class BooksProvider {

  GET_BOOK_COUNT = 5;

  booksData = [];
  booksId = [];

  isGetAllBooks = false;

  constructor(private http: HttpClient,
              private platform: Platform,
              private camera: Camera,
              private crop: Crop,
              private file: File,
              private uniqueDeviceID: UniqueDeviceID,
              private angularFbSt: AngularFireStorage,
              private angularFbDb: AngularFireDatabase) {

  }

  public initBooks() {
    this.booksData = [];
    this.booksId = [];

    this.isGetAllBooks = false;
  }

  public getMyBooks(firstGet) {
    return new Promise(async (resolve, reject) => {
      try {
        let serverData = await this._getBooksFromServer();
        let assignedData: any = this._assignMyBooks(serverData);

        this._setMyBooks(assignedData, firstGet);

        resolve(this.booksData);
      } catch(error) {
        reject(error);
        console.log('Get my books error', error);
      }
    });
  }

  public isFinGetBooks() {
    return this.isGetAllBooks;
  }

  public setBooksData(saveData) {
    return new Promise(async (resolve, reject) => {
      try {
        let deviceUniqueId = await this.uniqueDeviceID.get();
        let databaseRef = this.angularFbDb.list(deviceUniqueId + '/books');
        databaseRef.valueChanges();

        await databaseRef.push(saveData);
        resolve();
      } catch(error) {
        console.log('Save books data error. ', error);
        reject(error);
      }
    });
  }

  public findingBook(researchText) {
    return new Promise(async (resolve, reject) => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'KakaoAK 2e780152a42673e30ed1cc206aedc7da',
        })
      };
      let requestUrl = 'https://dapi.kakao.com/v3/search/book?query=' + researchText;

      this.http.get(requestUrl, httpOptions).subscribe((data: any) => {
        console.log('Finded data', data);
        resolve(data.documents)
      }, (error) => {
        reject(error);
      })
    });
  }

  public setCustomBookImage() {
    return new Promise(async (resolve, reject) => {
      try {
        let imageUri: any = await this._getImageFromLibrary();
        console.log('Library image uri: ' + imageUri);

        let croppedImageUri: any = await this._openCropImage(imageUri);
        console.log('Cropped image uri: ' + croppedImageUri);

        let imageFile: any = await this._resolveLocalFileSystemUrl(croppedImageUri);
        console.log('Image file: ', imageFile);

        let blobFile: any = await this._blobFileUri(imageFile);
        console.log('Blob image file: ', blobFile);

        let imageName: any = await this._genImageName();
        let uploadedRes = await this._setToImageInDb(blobFile, imageName);
        console.log('Uploaded image result: ', uploadedRes);

        let newImageUri: any = await this._getImageInDb(imageName);
        console.log('New image uri: ', newImageUri);

        resolve(newImageUri);
      } catch(error) {
        reject(error);
      }
    });
  }


  /*
   * Private function
   */

  private _getBooksFromServer() {
    return new Promise(async (resolve, reject) => {
      try {
        let deviceUniqueId = await this.uniqueDeviceID.get();
        let databaseRef = this.angularFbDb.database.ref(deviceUniqueId + '/books');

        let booksDataLen = this.booksData.length;
        let data: any = {};

        if (booksDataLen > 0) {
          data = await databaseRef.orderByKey().limitToLast(this.GET_BOOK_COUNT + 1).endAt(this.booksId[booksDataLen - 1]).once('value');
        } else {
          data = await databaseRef.orderByKey().limitToLast(this.GET_BOOK_COUNT).once('value');
        }

        resolve(data.val());
      } catch(error) {
        reject(error);
      }
    });
  }

  private _assignMyBooks(data) {
    let booksValue = [],
        booksKey = [];

    let newBook = {};

    Object.keys(data)
      .sort()
      .reverse()
      .map((key) => {
        newBook = {
          id: key
        };

        Object.assign(newBook, data[key]);

        booksKey.push(key);
        booksValue.push(newBook);
    });

    return {
      values: booksValue,
      keys: booksKey
    };
  }

  private _setMyBooks(assignedData, firstGet) {
    if (!firstGet) {
      assignedData.values.shift();
      assignedData.keys.shift();
    }

    if (assignedData.values.length > 0) {
      if (assignedData.values.length < this.GET_BOOK_COUNT) {
        console.log('Get all books.');
        this.isGetAllBooks = true;
      }
      this.booksData = this.booksData.concat(assignedData.values);
      this.booksId = this.booksId.concat(assignedData.keys);
    } else {
      console.log('Get no books. (has no)');
      this.isGetAllBooks = true;
    }
  }

  private _getImageFromLibrary() {
    return new Promise(async (resolve, reject) => {
      const options: CameraOptions = {
        quality: 30,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: false,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 1000,
        targetHeight: 1414
      };

      try {
        let fileUri: any = await this.camera.getPicture(options);

        if (this.platform.is('ios')) {

        } else if (this.platform.is('android')) {
          fileUri = 'file://' + fileUri;
        }

        resolve(fileUri);

      } catch(error) {
        console.log('Get image error.', error);
        if (error === 'has no access to assets') {
          resolve(null);
        } else {
          reject(error);
        }
      }
    });
  }

  private _openCropImage(imageUri) {
    return new Promise(async (resolve, reject) => {
      try {
        const options: CropOptions = {
          targetWidth: 1,
          targetHeight: 1
        };

        let croppedImage = await this.crop.crop(imageUri, options);
        resolve(croppedImage);
      } catch(error) {
        console.log('Cropped image error.', error);
        reject(error);
      }
    });
  }

  private _resolveLocalFileSystemUrl(url) {
    return new Promise(async (resolve, reject) => {
      try {
        let fileEntry: any = await this.file.resolveLocalFilesystemUrl(url);

        fileEntry.file((fileData) => {
          resolve(fileData);
        });
      } catch(error) {
        console.log('Resolve local file system error. ', error);
        reject(error);
      }
    });
  }

  private _blobFileUri(fileData) {
    return new Promise(async (resolve, reject) => {
      try {
        const fileReader = new FileReader();
        fileReader.onloadend = (evt: any) => {
          console.log('File Reader Result: ', evt);
          let blob = new Blob([evt.target.result], { type: "image/jpeg" });
          resolve(blob);
        };
        fileReader.onerror = function (error) {
            console.log("Failed file read: " + error.toString());
            reject(error)
        };
        fileReader.readAsArrayBuffer(fileData);
      } catch(error) {
        console.log('Blob file uri error', error);
        reject(error);
      }
    });
  }

  private _genImageName() {
    return new Promise(async (resolve, reject) => {
      try {
        let nowTime = new Date();
        let uniqueId = await this.uniqueDeviceID.get();
        let name = uniqueId + ',' + nowTime.getTime();

        resolve(name);
      } catch(error) {
        reject(error);
      }
    });
  }

  private _setToImageInDb(imageFile, imageName) {
    return new Promise(async (resolve, reject) => {
      let storageRef = this.angularFbSt.storage.ref('user_book_image');
      try {
        let imageRef = storageRef.child(imageName);
        let result = await imageRef.put(imageFile);
        resolve(result);
      } catch(error) {
        console.log('Set image in database.', error);
        reject(error);
      }
    });
  }

  private _getImageInDb(imageName) {
    return new Promise(async (resolve, reject) => {
      let storageRef = this.angularFbSt.storage.ref('user_book_image');
      try {
        let imageUrl = await storageRef.child(imageName).getDownloadURL();

        resolve(imageUrl);
      } catch(error) {
        console.log('Get image in database.', error);
        reject(error);
      }
    });
  }
}
