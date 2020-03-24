import { Component, OnInit, Input } from '@angular/core';
import { users } from 'src/app/models/users.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-end-user-details',
  templateUrl: './end-user-details.component.html',
  styleUrls: ['./end-user-details.component.scss']
})
export class EndUserDetailsComponent implements OnInit {
  @Input() altText = false;
  @Input() details: users = new users();
  public userDetails: users = new users();
  public isCollapsed = true;
  constructor(public activeModal: NgbActiveModal) {

  }

  ngOnInit() {
    this.userDetails = this.details;

  }

}
