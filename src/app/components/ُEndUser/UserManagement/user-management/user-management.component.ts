import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../../../services/users.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { users } from 'src/app/models/users.model';
import { group } from 'src/app/models/group.model';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { ErrorServService } from 'src/app/services/error-serv.service';
import { CustSearchModalComponent } from 'src/app/shared/cust-search-modal/cust-search-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EndUserDetailsComponent } from '../../end-user-details/end-user-details.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})

export class UserManagementComponent implements OnInit, OnDestroy {
  public pageCount = 1;
  getGroups: Subscription;
  customerName: string = "";
  ListCustomer: Subscription;
  getUsers: Subscription;
  delUsers: Subscription;
  public selected = false;
  public show = true;
  public custHidden = false;
  public userMangement: users = new users();
  public group: group = new group();
  public userForm: FormGroup;
  public showLoader: boolean;
  isSubmitted = false;
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
  constructor(private _user: UsersService, private err: ErrorServService, private tostr: ToastrService,
    private UsersService: UsersService,
    private _router: Router, private auth: AuthService, private modalService: NgbModal,
    public AuthService: AuthService) {
    let customerID = this.auth.customerID;
    let isOwner = this.auth.isOwner;

    this.userForm = new FormGroup({
      customerId: new FormControl(0),
      endUserId: new FormControl(0),
      name: new FormControl(""),
      endUseGroupId: new FormControl(0),
      email: new FormControl(""),
      phone: new FormControl("", Validators.pattern("[+]?([0-9]*)")),
      isActive: new FormControl(null),
      maximum: new FormControl("10"),
    })

    if (isOwner == false) {
      this.userForm.get('customerId').setValue(customerID);
      this.custHidden = true;
    } else {
      this.custHidden = false;
    }

    this.config = {
      displayKey: "name", //if objects array passed which key to be displayed defaults to description
      search: true, //true/false for the search functionlity defaults to false,
      height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder: 'Select Group', // text to be displayed when no item is selected defaults to Select,
      customComparator: () => { }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
      limitTo: this.dropdownOptions.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
      moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
      noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
      searchPlaceholder: 'Search', // label thats displayed in search input,
      searchOnKey: 'name' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    };
    this.config4 = {
      displayKey: "name", //if objects array passed which key to be displayed defaults to description
      search: false, //true/false for the search functionlity defaults to false,
      height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder: 'Status', // text to be displayed when no item is selected defaults to Select,
      customComparator: () => { }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
      limitTo: this.dropdownOptions4.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
      moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
      noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
      searchPlaceholder: 'Search', // label thats displayed in search input,
      searchOnKey: 'name' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    };
  }

  config;
  dropdownOptions: any[] = [];
  open() {
    const modalRef = this.modalService.open(CustSearchModalComponent, {
      size: "lg"
    });
    modalRef.result.then((res) => {
      this.userForm.get('customerId').setValue(res.id);
      this.customerName = res.name;
    });
  }
  config4;
  dropdownOptions4: any[] = [{ id: 1, name: "Active" }, { id: 2, name: "Not Active" }];

  selectionChangedGroup(e) {
    this.userForm.get('endUseGroupId').setValue(e.value.id);
  }

  selectionChangedStatus(e) {
    if (e.value && e.value.id == 1) {
      this.userForm.get('isActive').setValue(true);
    }
    else if (e.value && e.value.id == 2) {
      this.userForm.get('isActive').setValue(false);
    }
    else {
      this.userForm.get('isActive').setValue(null);
    }
  }
  public pageChanged(event: any): void {
    this.searchPage(event);
  };
  ngOnInit() {
    this.showLoader = true
    this.getGroups = this.UsersService.getGroups().subscribe(
      (res: any) => {
        if (res.statusCode == 200) {
          this.dropdownOptions = res.data.map(x => {
            let obj = { id: x.id, name: x.name };
            return obj;
          });
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
      }
    );
    this.search()
  }

  onEdit(row) {
    this._router.navigate(['/dashboard/UserForm'], { queryParams: { user_id: row.id ,customer_id:row.customerId} });
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
    this.search();
  }
  search() {
    this.showLoader = true;
    this.isSubmitted = true;
    let searchModel = {
      "pageInfo": {
        "pageIndex": this.pageIndex,
        "pageSize": this.userForm.get('maximum').value
      },
      endUserId: this.userForm.get('endUserId').value,
      customerId: this.userForm.get('customerId').value,
      endUseGroupId: this.userForm.get('endUseGroupId').value,
      isActive: this.userForm.get('isActive').value,
      name: this.userForm.get('name').value,
      phone: this.userForm.get('phone').value,

    }
    this.show = false;
    this.getUsers = this._user.getUsers(searchModel).subscribe(
      (res: any) => {
        if (res.statusCode == 200) {
          this.temp = res.data;
          this.rows = res.data;
          this.pageCount = res.pagesCount;
          this.PageCounter();
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
      }, (err) => { this.showLoader = false })
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
        this.delUsers = this._user.delUsers(row.id).subscribe(
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
  endUserDetails: Subscription;
  gotToDetails(row) {
    this.showLoader = true;
    let user = {
      endUserId: row.id,
      pageInfo: {
        pageIndex: 1,
        pageSize: 1
      }
    }
    this.endUserDetails = this._user.getUsers(user).subscribe(
      (res: any) => {
        const modalRef = this.modalService.open(EndUserDetailsComponent, {
          size: "lg",
        });
        if (res.statusCode == 200) {
          this.userMangement = res.data.filter(x => row.id == x.id)[0];

          modalRef.componentInstance.details = this.userMangement;
        }
        else {
          modalRef.componentInstance.altText = true;
        }
        this.showLoader = false;
      }, (err) => {
        this.tostr.error(err);
        this.showLoader = false;
      })
  }
  ngOnDestroy(): void {
    this.getGroups ? this.getGroups.unsubscribe() : null;
    this.endUserDetails ? this.endUserDetails.unsubscribe() : null;
    this.ListCustomer ? this.ListCustomer.unsubscribe() : null;
    this.getUsers ? this.getUsers.unsubscribe() : null;
    this.delUsers ? this.delUsers.unsubscribe() : null;
  }
}
