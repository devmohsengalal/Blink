import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Details } from 'src/app/models/details.model';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DetailsEnduser } from 'src/app/models/details.enduser.model';
import { Detailscelltower } from 'src/app/models/details.celltower.model';

@Component({
  selector: 'app-accident-details',
  templateUrl: './accident-details.component.html',
  styleUrls: ['./accident-details.component.scss']
})
export class AccidentDetailsComponent implements OnInit {
  @Input() altText = false;
  @Input() details: Details = new Details();
  public id: number;
  public trip: Subscription;
  public acc: Subscription;
  public showLoader: boolean;
  public accidentDetails: Details = new Details();
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.accidentDetails.endUser = new DetailsEnduser();
    this.accidentDetails.cellTowerInfo = new Detailscelltower();
    this.accidentDetails = this.details;
  }
}
