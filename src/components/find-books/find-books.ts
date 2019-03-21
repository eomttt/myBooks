import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'find-books',
  templateUrl: 'find-books.html'
})
export class FindBooksComponent {

  _bookList: any;

  @Input()
  set bookList(data) {
    this._bookList = data;
  }
  get bookList() {
    return this._bookList;
  }

  @Output()
  select = new EventEmitter();

  constructor() {
  }

  public selectedBook(data) {
    this.select.emit(data);
  }

  public hasBooks() {
    if (!!this.bookList) {
      return this.bookList.length > 0;
    }

    return false;
  }

}
