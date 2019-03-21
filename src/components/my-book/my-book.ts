import { Component, Input, Output, EventEmitter } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController, Events } from 'ionic-angular';

@Component({
  selector: 'my-book',
  templateUrl: 'my-book.html'
})
export class MyBookComponent {

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

  public setDirectImage() {
    // TO DO: Take picture or Get from library
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
