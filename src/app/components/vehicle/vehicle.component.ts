import { Router } from '@angular/router';
import { VehicleDetailsComponent } from './vehicle-details/vehicle-details.component';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatatableComponent } from "@swimlane/ngx-datatable/release";
import { Subscription } from 'rxjs';
import { VehicleAddEditDto } from 'src/app/models/vehicleAdd-Edit.model';
import { VehicleSearchDto } from 'src/app/models/vehicleSearch.model';
import { VehicleService } from 'src/app/services/vehicle.service';
import Swal from 'sweetalert2'
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustSearchModalComponent } from 'src/app/shared/cust-search-modal/cust-search-modal.component';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit, OnDestroy {
  ListCustomer: Subscription;
  public pageCount = 1;
  listVehiclesub: Subscription;
  removeVehicle: Subscription;
  customerName: string = "";
  isHidden: boolean = false;
  public subscription;
  public vehicleList: VehicleSearchDto = new VehicleSearchDto();
  public vehicleAddEdit: VehicleAddEditDto = new VehicleAddEditDto();
  public vehicleForm: FormGroup;
  public custHidden = false;
  showLoader: boolean;

  constructor(
    private VehicleService: VehicleService, private tostr: ToastrService,
    private _router: Router, public loaderService: LoaderService, public AuthService: AuthService,
    private auth: AuthService, private modalService: NgbModal) {
    let customerID = this.auth.customerID;
    let isOwner = this.auth.isOwner;

    this.vehicleForm = new FormGroup({
      id: new FormControl(0),
      type: new FormControl(""),
      model: new FormControl(""),
      color: new FormControl(""),
      customerId: new FormControl(0),
      maximum: new FormControl("10"),
    })

    if (isOwner == false) {
      this.vehicleForm.get('customerId').setValue(customerID);
      this.custHidden = true;
    } else {
      this.custHidden = false;
    }
  }
  open() {
    const modalRef = this.modalService.open(CustSearchModalComponent, {
      size: "lg"
    });
    modalRef.result.then((res) => {
      this.vehicleForm.get('customerId').setValue(res.id);
      this.customerName = res.name;
    });
  }
  public pageChanged(event: any): void {
    this.searchPage(event);
  };
  ngOnInit() {
    this.listVehicle()
  }
  pageIndex = 1;

  countArr = [];
  PageCounter() {
    let temp = [];
    for (let x = 1; x < this.pageCount; x++) {
      temp.push(x + 1);
    }
    this.countArr = temp;
  }
  searchPage(num: number) {
    this.pageIndex = num;
    this.listVehicle();
  }
  listVehicle() {

    let Vehicle = {
      pageInfo: {
        pageIndex: 0,
        pageSize: this.vehicleForm.get('maximum').value
      },
      orderInfoLst: [
        {
          fieldName: "",
          type: ""
        }],
      vehicleSearch: this.vehicleForm.value
    };
    this.showLoader = true
    this.listVehiclesub = this.VehicleService.listVehicle(Vehicle).subscribe((res: any) => {
      this.rows = res.data;
      this.temp = res.data;
      this.showLoader = false
    });
  }

  onEdit(row) {
    this._router.navigate(['/dashboard/vehicle-form'], { queryParams: { id: row.id } });
  }

  delete(row) {
    Swal({
      title: 'Delete ' + row.type + ' ?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00c292',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.removeVehicle = this.VehicleService.removeVehicle({ id: row.id }).subscribe(
          (res: any) => {
            if (res.statusCode == 200) {
              Swal(
                'Deleted!',
                row.name + ' has been deleted.',
                'success'
              )
              this.listVehicle();
            }
            else {
              Swal(
                'error in delete!',
                row.name + ' has not been deleted.',
                'error'
              )
            }
          }
        );
      }
    });
  }
  rows = [];

  temp = [];

  @ViewChild(DatatableComponent) table: DatatableComponent;

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
  }
  vehicleDetails: Subscription;
  gotToDetails(row) {
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
      vehicleSearch: {
        id: row.id
      }
    };
    this.showLoader = true;
    this.vehicleDetails = this.VehicleService.listVehicle(Vehicle).subscribe((res: any) => {
      this.showLoader = false;
      const modalRef = this.modalService.open(VehicleDetailsComponent, {
        size: "lg",
      });
      if (res.statusCode == 200) {
        modalRef.componentInstance.details = res.data;
      } else {
        modalRef.componentInstance.altText = true;
      }
    },
      (err) => {
        this.tostr.error(err);
        this.showLoader = false;
      })
  }
  ngOnDestroy(): void {
    this.ListCustomer ? this.ListCustomer.unsubscribe() : null;
    this.listVehiclesub ? this.listVehiclesub.unsubscribe() : null;
    this.removeVehicle ? this.removeVehicle.unsubscribe() : null;
  }
}
