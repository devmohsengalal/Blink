
import { Component, OnInit, Input } from '@angular/core';
import { Details } from 'src/app/models/details.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.component.html',
  styleUrls: ['./trip-details.component.scss']
})
export class TripDetailsComponent implements OnInit {
  @Input() altText = false;
  @Input() details: Details = new Details();;
  public tripSearch: Details = new Details();;

  constructor(
    public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.tripSearch = this.details;
  }

}
