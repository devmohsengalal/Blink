import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VehicleSearchDto } from 'src/app/models/vehicleSearch.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.scss']
})
export class VehicleDetailsComponent implements OnInit {
  @Input() altText = false;
  @Input() details: VehicleSearchDto = new VehicleSearchDto();
  public vehicleDetails: VehicleSearchDto = new VehicleSearchDto();

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.vehicleDetails = this.details[0]
  }

}
