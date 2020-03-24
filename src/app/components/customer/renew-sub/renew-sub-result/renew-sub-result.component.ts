import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-renew-sub-result',
  templateUrl: './renew-sub-result.component.html',
  styleUrls: ['./renew-sub-result.component.scss']
})
export class RenewSubResultComponent implements OnInit {

  @Input() altText = false;
  @Input() details: { form: any, result: any };

  public subDetails: { form: any, result: any };

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.subDetails = this.details;
  }
  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }
  copyText() {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.subDetails.result.apiKey;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
