import { Directive,HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appPhoneNum]'
})
export class PhoneNumDirective {

  regexStr = '^[+]*[0-9]*$';
  @Input() isAlphaNumeric: boolean;

  constructor(private el: ElementRef) { }


  @HostListener('keypress', ['$event']) onKeyPress(event) {
    return new RegExp(this.regexStr).test(event.key);
  }

}
