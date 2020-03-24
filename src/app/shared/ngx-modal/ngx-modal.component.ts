import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ngx-modal',
  templateUrl: './ngx-modal.component.html',
  styleUrls: ['./ngx-modal.component.scss']
})
export class NgxModalComponent implements OnInit {

  @Input() name;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {
  }

}
