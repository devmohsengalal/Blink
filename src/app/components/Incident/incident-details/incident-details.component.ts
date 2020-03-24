import { Component, OnInit, Input } from '@angular/core';
import { Details } from 'src/app/models/details.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-incident-details',
  templateUrl: './incident-details.component.html',
  styleUrls: ['./incident-details.component.scss']
})
export class IncidentDetailsComponent implements OnInit {
  public incidentDetails: Details = new Details();
  @Input() altText = false;
  @Input() details: Details = new Details();
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.incidentDetails = this.details;
  }

}
