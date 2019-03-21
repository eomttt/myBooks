import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController, Events, Platform, normalizeURL } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Crop, CropOptions } from '@ionic-native/crop';
import { File } from '@ionic-native/file';
import { Base64 } from '@ionic-native/base64';

@Component({
  selector: 'my-book',
  templateUrl: 'my-book.html'
})
export class MyBookComponent {

  @ViewChild('bookInputImage') bookInputImageEl: ElementRef;

  FINDING_BOOK_URL = 'https://book.naver.com/search/search.nhn?query=';

  _book: any;
  _index: any;
  _emitData: any;

  @Input()
  set book(data) {
    this._book = data;
  }
  get book() {
    return this._book;
  }

  @Input()
  set index(data) {
    this._index = data;
  }
  get index() {
    return this._index;
  }

  @Input()
  set emitData(data) {
    this._emitData = data;
  }
  get emitData() {
    return this._emitData
  }

  @Output()
  findBook = new EventEmitter();

  @Output()
  setMyBook = new EventEmitter();

  bookInputData = {
    title: '',
    text: '',
    image: ''
  };

  constructor(private alertCtrl: AlertController,
              private http: HttpClient,
              private platform: Platform,
              private camera: Camera,
              private crop: Crop,
              private file: File,
              private base64: Base64,
              private events: Events) {

  }

  ngOnInit() {
    this._addEvents();
  }

  ngOnDestroy() {
    this._removeEvents();
  }

  ngOnChanges(changes) {

  }

  public setMyBookStyle() {
    if (this.isMakingMyBook()) {
      return {
        'margin-left': '12.5%'
      };
    } else {
      if (this.index % 2 === 0) {
        // Nothing
      } else {
        return {'margin-left': '25%'};
      }
    }
  }

  public setInputImageStyle() {
    if (!!this.bookInputImageEl) {
      const width = this.bookInputImageEl.nativeElement.offsetWidth;
      const style = { height: width * 1.414 + 'px'};

      return style;
    }
  }

  public async setDirectImage() {
    try {
      let imageUri: any = await this._getImageFromLibrary();
      console.log("AAAA", imageUri);
      let croppedImageUri: any = await this._openCropImage(imageUri);
      console.log("BBBB", croppedImageUri);
      let imageFile: any = await this._resolveLocalFileSystemUrl(croppedImageUri);
      console.log("CCC", imageFile);

      let newImageUri = null;

      if (this.platform.is('ios')) {
        newImageUri = normalizeURL(croppedImageUri);
      } else {
        newImageUri = await this._genBase64Url(croppedImageUri);
        newImageUri = newImageUri.replace(/(\r\n|\n|\r)/gm, '');
      }

      this.bookInputData.image = newImageUri;

      console.log("DDDD", newImageUri);
    } catch(error) {
      if (error === 'No Image Selected') {
        console.log('No image selected');
      } else {

      }
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

  private _genBase64Url(url) {
    return new Promise(async (resolve, reject) => {
      try {
        let base64File: any = await this.base64.encodeFile(url);
        let imageSrc = base64File.split(',');

        let base64Image = 'data:image/jpeg;base64,' + imageSrc[1];

        resolve(base64Image);
      } catch(error) {
        console.log('Gen base64 url error.', error);
        reject(error);
      }
    });
  }

  public researchBook() {
    let alert = this.alertCtrl.create({
      title: '책을 검색해 보세요.',
      inputs: [
        {
          name: 'researchText',
          placeholder: '책 제목을 입력해주세요.'
        }
      ],
      buttons: [
        {
          text: '취소',
          handler: () => {
            // Nothing
          }
        },{
          text: '검색',
          handler: (data) => {
            this._findingBook(data.researchText);
          }
        }
      ]
    });
    alert.present();
  }

  public isMakingMyBook() {
    return this.index === null || this.index === undefined;
  }

  /**
   * Private function
   */

  private async _findingBook(researchText) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'KakaoAK 2e780152a42673e30ed1cc206aedc7da',
      })
    };
    let requestUrl = 'https://dapi.kakao.com/v3/search/book?query=' + researchText;

    this.http.get(requestUrl, httpOptions).subscribe((data: any) => {
      console.log('Finded data', data);
      this.findBook.emit(data.documents);
    }, (error) => {
      console.log('Find book error', error);
      this._showFindErrorModal(error.error);
    })
  }

  private _emitMyBookData() {
    console.log('Emit making book data');

    let makingBookTitle = this._getBookTitle(),
        makingBookImage = this._getBookImage();

    if (!!!makingBookTitle || makingBookTitle === '') {
      this._showInputAlarmModal('책 제목을 입력해주세요.');
      return;
    }

    if (!!!makingBookImage || makingBookImage === '') {
      this._showInputAlarmModal('책 사진을 올려주세요.');
      return;
    }

    this.setMyBook.emit({
      title: this._getBookTitle(),
      image: this._getBookImage(),
      text: this.bookInputData.text
    });
  }

  private _getBookTitle() {
    if (!!this.book.title) {
      return this.book.title;
    }

    return this.bookInputData.title;
  }

  private _getBookImage() {
    if (!!this.book.image) {
      return this.book.image;
    }

    return this.bookInputData.image;
  }

  private _showFindErrorModal(error) {
    let alert = this.alertCtrl.create({
      title: '알림',
      message: '검색에 실패하였습니다. <br> 잠시 후 다시 시도해주세요. 반복적으로 문제가 발생할 경우 문의하기를 사용해주세요. <br>' + error.message,
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

  private _showInputAlarmModal(content) {
    let alert = this.alertCtrl.create({
      title: '알림',
      message: content,
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

  private _addEvents() {
    if (this.isMakingMyBook()) {
      this.events.subscribe('addBookPage.emit.myBookComp', () => {
        this._emitMyBookData();
      });
    }
  }

  private _removeEvents() {
    if (this.isMakingMyBook()) {
      this.events.unsubscribe('addBookPage.emit.myBookComp');
    }
  }
}
