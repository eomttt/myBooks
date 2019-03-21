import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'find-book',
  templateUrl: 'find-book.html'
})
export class FindBookComponent {

  _book: any
  _index: any

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
  select = new EventEmitter;

  constructor() {

  }

  public setSelectedStyle() {
    if (!!this.book.select) {
      return {
        'border': '1px solid #488aff'
      };
    }
  }

  public selectBook() {
    this.select.emit(this.index);
  }

}
