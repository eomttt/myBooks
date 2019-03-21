import { Component, Input } from '@angular/core';

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

  constructor() {
  }

}
