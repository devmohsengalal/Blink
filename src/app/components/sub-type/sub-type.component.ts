import { FormGroup, Validators, FormControl } from '@angular/forms';
import { SubscriptionTypeService } from './../../services/subscription-type.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { sub } from '../../models/sub.model';
import { subscriptionList } from 'src/app/models/subscriptionList.model';
import { ToastrService } from 'ngx-toastr';
import { DatatableComponent } from "@swimlane/ngx-datatable/release";
import Swal from 'sweetalert2'
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { ErrorServService } from 'src/app/services/error-serv.service';

@Component({
  selector: 'app-sub-type',
  templateUrl: './sub-type.component.html',
  styleUrls: ['./sub-type.component.scss']
})
export class SubTypeComponent implements OnInit, OnDestroy {
  getSubscribtion: Subscription;
  addSubscribtion: Subscription;
  delSubscribtion: Subscription;
  editSubscribtion: Subscription;
  isSubmitted = false
  public selected = false;
  public subForm: FormGroup;
  public subscription: sub;
  public subList: subscriptionList = new subscriptionList();
  public showLoader: boolean;

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
  constructor(private sub: SubscriptionTypeService, private err: ErrorServService, private tostr: ToastrService,
    public AuthService: AuthService) { }

  ngOnInit() {
    this.subForm = new FormGroup({
      name: new FormControl("", Validators.required),
      id: new FormControl("0")
    })
    this.search();
  }

  search() {
    this.showLoader = true
    this.getSubscribtion = this.sub.getSubscribtion(this.subList).subscribe(
      (res: any) => {
        if (res.statusCode == 200) {
          this.rows = res.data;
          this.temp = res.data;
          this.showLoader = false
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
      })
  }

  add(f: sub) {
    this.isSubmitted = true;
    if (this.subForm.valid) {
      this.addSubscribtion = this.sub.addSubscribtion(f).subscribe((res: any) => {
        this.showLoader = true
        if (res.statusCode == 200) {
          this.tostr.success('Success', 'Added')
          this.search();
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

  onDelete(row) {
    Swal({
      title: 'Delete ' + row.name + ' ?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00c292',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.delSubscribtion = this.sub.delSubscribtion({ id: row.id }).subscribe(
          (res: any) => {
            if (res.statusCode == 200) {
              Swal(
                'Deleted!',
                row.name + ' has been deleted.',
                'success'
              )
              this.search();
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


  onEdit(sub: sub) {
    this.selected = true;
    this.subForm.setValue({
      'name': sub.name,
      'id': sub.id
    })
  }

  edit(f: sub) {
    this.isSubmitted = true;
    if (this.subForm.valid) {
      this.editSubscribtion = this.sub.editSubscribtion(f).subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.tostr.success('Success', 'Edited');
          this.search();
          this.selected = false;
          this.subForm.reset();
          this.showLoader = false
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
  ngOnDestroy(): void {
    this.getSubscribtion ? this.getSubscribtion.unsubscribe() : null;
    this.addSubscribtion ? this.addSubscribtion.unsubscribe() : null;
    this.delSubscribtion ? this.delSubscribtion.unsubscribe() : null;
    this.editSubscribtion ? this.editSubscribtion.unsubscribe() : null;
  }
}