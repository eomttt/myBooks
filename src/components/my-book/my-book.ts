import { Component, Input, Output, EventEmitter } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'my-book',
  templateUrl: 'my-book.html'
})
export class MyBookComponent {

  FINDING_BOOK_URL = 'https://book.naver.com/search/search.nhn?query=';

  _book: any;
  _index: any;

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

  @Output()
  findBook = new EventEmitter();

  bookInputData = {
    title: null,
    text: null
  };

  constructor(private alertCtrl: AlertController,
              private http: HttpClient) {

  }

  public setMyBookStyle(index) {
    if (index === null || index === undefined) {
      return {
        'width': '90%',
        'margin-left': '5%'
      };
    } else {
      if (index % 2 === 0) {
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

}
