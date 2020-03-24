import { ErrorServService } from './../../../services/error-serv.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { VehicleAddEditDto } from 'src/app/models/vehicleAdd-Edit.model';
import { VehicleSearchDto } from 'src/app/models/vehicleSearch.model';
import { VehicleService } from 'src/app/services/vehicle.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustSearchModalComponent } from 'src/app/shared/cust-search-modal/cust-search-modal.component';

@Component({
  selector: 'app-vehicle-for',
  templateUrl: './vehicle-for.component.html',
  styleUrls: ['./vehicle-for.component.scss']
})
export class VehicleForComponent implements OnInit {
  isSubmitted = false;
  ListCustomer: Subscription;
  vehicleParams: Subscription;
  listVehicle: Subscription;
  addVehicle: Subscription;
  editVehicle: Subscription;
  customerName: any = "";
  showLoader: boolean;
  isHidden: boolean = false;
  public subscription;
  public id;
  public addEdit;
  public custHidden = false;
  public vehicleList: VehicleSearchDto = new VehicleSearchDto();
  public vehicleAddEdit: VehicleAddEditDto = new VehicleAddEditDto();
  public vehicleForm: FormGroup;

  constructor(
    private VehicleService: VehicleService,
    private tostr: ToastrService,
    public AuthService: AuthService,
    private route: ActivatedRoute, private auth: AuthService, private err: ErrorServService, private modalService: NgbModal) {

    let isOwner = this.auth.isOwner;
    this.formMethod()
    if (isOwner == false) {

      this.custHidden = true;
    } else {
      this.custHidden = false;
    }
  }

  ngOnInit() {
    this.formMethod()
    this.showLoader = true;
    this.vehicleParams = this.route.queryParams.subscribe(params => {
      this.id = params['id'];

      if (this.id != undefined) {
        this.custHidden = true;
        this.addEdit = "Edit"
        this.isHidden = true;
        let Vehicle = {
          pageInfo: {
            pageIndex: 0,
            pageSize: 0
          },
          orderInfoLst: [
            {
              fieldName: "",
              type: ""
            }],
          vehicleSearch: { id: this.id }
        };
        this.listVehicle = this.VehicleService.listVehicle(Vehicle).subscribe((res: any) => {
          this.vehicleAddEdit = res.data[0];
          this.vehicleForm.setValue({
            'id': this.vehicleAddEdit.id,
            'type': this.vehicleAddEdit.type,
            'model': this.vehicleAddEdit.model,
            'color': this.vehicleAddEdit.color,
            'description': this.vehicleAddEdit.description
          })
          
        })
      } else {
        this.isHidden = false;
        this.addEdit = "Add"
        this.vehicleForm.reset()
      }
      this.showLoader = false
    })
  }

  formMethod() {
    this.vehicleForm = new FormGroup({
      id: new FormControl(0),
      type: new FormControl("", Validators.required),
      model: new FormControl("", Validators.required),
      color: new FormControl("", Validators.required),
      description: new FormControl("")
    })
  }

  onSubmit() {
    this.onAdd()
  }

  onAdd() {
    this.isSubmitted = true;
    let added = this.vehicleAddEdit;
    added.type = this.vehicleForm.get('type').value;
    added.model = this.vehicleForm.get('model').value;
    added.color = this.vehicleForm.get('color').value;
    added.description = this.vehicleForm.get('description').value;
    if (this.vehicleForm.valid) {
      this.showLoader = true
      this.addVehicle = this.VehicleService.addVehicle(added).subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.tostr.success('Success', 'Added')
          this.vehicleForm.reset()
          this.isSubmitted = false;
          this.isHidden = false;
        } else if (res.statusCode == 204) {
          if (Number(res.data)) {
            this.tostr.error("Error", this.err.ErrorServ(res.data));
          } else {
            let arr: any[] = res.data;
            if (Array.isArray(arr)) {
              arr.forEach(element => {
                this.tostr.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
              });
            }
          }
        }

        this.showLoader = false
      }, (err => {
        this.tostr.error(err, 'Error');
        this.showLoader = false
      }))
    }
  }

  edit() {
    this.isSubmitted = true;
    if (this.vehicleForm.valid) {
      this.showLoader = true
      this.editVehicle = this.VehicleService.editVehicle(this.vehicleForm.value).subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.tostr.success('Success', 'Edited');
          this.isHidden = false;
        } else if (res.statusCode == 204) {
          if (Number(res.data)) {
            this.tostr.error("Error", this.err.ErrorServ(res.data));
          } else {
            let arr: any[] = res.data;
            if (Array.isArray(arr)) {
              arr.forEach(element => {
                this.tostr.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
              });
            }
          }
        }
        this.showLoader = false
      }, (err => {
        this.tostr.error(err, 'Error');
        this.showLoader = false
      }))
    }
  }

}
