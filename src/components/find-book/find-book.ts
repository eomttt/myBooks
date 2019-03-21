import { Component, Input } from '@angular/core';


@Component({
  selector: 'find-book',
  templateUrl: 'find-book.html'
})
export class FindBookComponent {

  _book: any

  @Input()
  set book(data) {
    this._book = data;
  }
  get _book() {
    return this._book;
  }

  constructor() {
  }

}
