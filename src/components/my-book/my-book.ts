import { Component, Input } from '@angular/core';

@Component({
  selector: 'my-book',
  templateUrl: 'my-book.html'
})
export class MyBookComponent {

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

  constructor() {

  }

  public setMyBookStyle(index) {
    if (index % 2 === 0) {
      // Nothing
    } else {
      return {'margin-left': '25%'};
    }
  }

}
