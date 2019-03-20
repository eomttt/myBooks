import { Component, Input } from '@angular/core';

@Component({
  selector: 'underbar',
  templateUrl: 'underbar.html'
})
export class UnderbarComponent {

  _nowView: any;

  @Input()
  set nowView(data) {
    this._nowView = data;
  }
  get nowView() {
    return this._nowView;
  }

  constructor() {

  }

  public isNowView(view) {
    return this.nowView === view;
  }

  public setShowViewStyle() {
    return {'background-color': 'black'};
  }

}
