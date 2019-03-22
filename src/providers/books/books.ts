import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Crop, CropOptions } from '@ionic-native/crop';
import { File } from '@ionic-native/file';
import { Base64 } from '@ionic-native/base64';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable()
export class BooksProvider {

  mockData = [
    {
      id: '1',
      title: 'Harry Potter Number one',
      text: 'First Readed book',
      image: 'https://firebasestorage.googleapis.com/v0/b/mybookeom.appspot.com/o/1.png?alt=media&token=4bc8dd49-d81a-4e3f-99f0-d74ef1644919'
    },
    {
      id: '2',
      title: 'Load of ring',
      text: 'Good at me',
      image: 'https://firebasestorage.googleapis.com/v0/b/mybookeom.appspot.com/o/2.png?alt=media&token=f868f629-1a88-4200-ad9f-65c2986c35ea'
    },
    {
      id: '3',
      title: 'Cafe homes',
      text: 'I like americano',
      image: 'https://firebasestorage.googleapis.com/v0/b/mybookeom.appspot.com/o/3.png?alt=media&token=12c69962-67f4-4c30-8dc3-f555992e7085'
    },
    {
      id: '4',
      title: 'Nami supermarket',
      text: 'Good bamletter',
      image: 'https://firebasestorage.googleapis.com/v0/b/mybookeom.appspot.com/o/4.png?alt=media&token=07180560-5e4e-4308-8e15-47876d3ad22a'
    },
    {
      id: '5',
      title: 'Young is heart',
      text: 'Im young let',
      image: 'https://firebasestorage.googleapis.com/v0/b/mybookeom.appspot.com/o/5.png?alt=media&token=ea0f0854-e055-4819-9b93-30d64ec73e36'
    },
    {
      id: '6',
      title: 'Good psycologist',
      text: 'Psychologist is amazing',
      image: 'https://firebasestorage.googleapis.com/v0/b/mybookeom.appspot.com/o/6.png?alt=media&token=35285554-9544-49ca-aa18-ff073cd4704a'
    },
    {
      id: '7',
      title: 'Black comedies',
      text: 'I like comedies',
      image: 'https://firebasestorage.googleapis.com/v0/b/mybookeom.appspot.com/o/7.png?alt=media&token=d3796350-b614-470e-b89b-97933da5df82'
    },
    {
      id: '8',
      title: 'Good at ballet',
      text: 'I can do everything',
      image: 'https://firebasestorage.googleapis.com/v0/b/mybookeom.appspot.com/o/8.png?alt=media&token=4e98782f-5467-409d-bf0a-dc286ede2085'
    },
    {
      id: '9',
      title: 'Dont sleep for history',
      text: 'Very fun',
      image: 'https://firebasestorage.googleapis.com/v0/b/mybookeom.appspot.com/o/9.png?alt=media&token=70419794-c99b-445b-b8a6-a85b05c4fdae'
    },
  ];

  constructor(private http: HttpClient,
              private platform: Platform,
              private camera: Camera,
              private crop: Crop,
              private file: File,
              private base64: Base64,
              private uniqueDeviceID: UniqueDeviceID,
              private angularFbSt: AngularFireStorage,
              private angularFbDb: AngularFireDatabase) {

  }

  public getMyBooks() {
    return new Promise((resolve, reject) => {
      resolve(this.mockData)
    });
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
