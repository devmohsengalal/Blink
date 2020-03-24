import { Component, OnInit, Input } from '@angular/core';
import { roleDtoModel } from 'src/app/models/roleDto.models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.scss']
})
export class RoleDetailsComponent implements OnInit {
  @Input() altText = false;
  @Input() details: roleDtoModel = new roleDtoModel();
  public role: roleDtoModel = new roleDtoModel();
  constructor(public activeModal: NgbActiveModal) { }
  ngOnInit() {
    this.role = this.details;
  }
}
