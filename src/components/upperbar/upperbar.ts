import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the UpperbarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'upperbar',
  templateUrl: 'upperbar.html'
})
export class UpperbarComponent {

  _leftText: any = null;
  _rightText: any = null;
  _centerText: any = null;


  @Input()
  set leftText(data) {
    this._leftText = data;
  }
  get leftText() {
    return this._leftText;
  }

  @Input()
  set rightText(data) {
    this._rightText = data;
  }
  get rightText() {
    return this._rightText;
  }

  @Input()
  set centerText(data) {
    this._centerText = data;
  }
  get centerText() {
    return this._centerText;
  }

  @Output()
  clickLeft = new EventEmitter();

  @Output()
  clickRight = new EventEmitter();

  constructor() {

  }

  public clickLeftSide() {
    this.clickLeft.emit();
  }

  public clickRightSide() {
    this.clickRight.emit();
  }

}
