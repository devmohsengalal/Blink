import { CountriesService } from 'src/app/services/countries.service';
import { StateService } from 'src/app/services/state.service';
import { AccountService } from '../../../services/account.service';
import { Accounts } from '../../../models/account.model';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { roleDtoModel } from 'src/app/models/roleDto.models';
import { RolesService } from 'src/app/services/roles.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'
import { CustomerService } from 'src/app/services/customer.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { ErrorServService } from 'src/app/services/error-serv.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustSearchModalComponent } from 'src/app/shared/cust-search-modal/cust-search-modal.component';
import { AccountDetailsComponent } from '../account-details/account-details.component';
import { forkJoin } from 'rxjs';
import { ChangePasswordComponent } from '../change-password/change-password.component';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  page = 1;
  roleSearch: Subscription;
  ListCustomer: Subscription;
  countryList: Subscription;
  getState: Subscription;
  listAccounts: Subscription;
  delAccount: Subscription;
  isSubmitted = false;
  customerName: string = "";
  public roles: roleDtoModel = new roleDtoModel()
  public selected = false;
  public accForm: FormGroup;
  public account: Accounts = new Accounts();
  public showLoader: boolean;
  custHidden: boolean;
  //DataTable
  rows = [];
  temp = [];

  @ViewChild(DatatableComponent) table: DatatableComponent;

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function (d) {
      return d.userName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
  }
  //End DataTable
  constructor(private acc: AccountService, private role: RolesService, private _router: Router,
    private route: ActivatedRoute, private customer: CustomerService, private state: StateService,
    public AuthService: AuthService, private err: ErrorServService, private tostr: ToastrService,
    private modalService: NgbModal, private CountriesService: CountriesService) {

    let customerID = this.AuthService.customerID;
    let isOwner = this.AuthService.isOwner;
    this.accForm = new FormGroup({
      roleId: new FormControl(null),
      name: new FormControl(null),
      fullName: new FormControl(null),
      username: new FormControl(null),
      email: new FormControl(null),
      phone: new FormControl(null, Validators.pattern("[+]?([0-9]*)")),
      stateId: new FormControl(null),
      isActive: new FormControl(null),
      customerId: new FormControl(null),
      maximum: new FormControl("10")
    })
    if (isOwner == false) {
      this.accForm.get('customerId').setValue(customerID);
      this.custHidden = true;
    } else {
      this.custHidden = false;
    }

    this.config = {
      displayKey: "name", //if objects array passed which key to be displayed defaults to description
      search: true, //true/false for the search functionlity defaults to false,
      height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder: 'Select Role', // text to be displayed when no item is selected defaults to Select,
      customComparator: () => { }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
      limitTo: this.dropdownOptions.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
      moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
      noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
      searchPlaceholder: 'Search', // label thats displayed in search input,
      searchOnKey: 'name' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    };
    this.config2 = {
      displayKey: "name", //if objects array passed which key to be displayed defaults to description
      search: true, //true/false for the search functionlity defaults to false,
      height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder: 'Select State', // text to be displayed when no item is selected defaults to Select,
      customComparator: () => { }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
      limitTo: this.dropdownOptions2.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
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
    this.config5 = {
      displayKey: "name", //if objects array passed which key to be displayed defaults to description
      search: true, //true/false for the search functionlity defaults to false,
      height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder: 'Select Country', // text to be displayed when no item is selected defaults to Select,
      customComparator: () => { }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
      limitTo: this.dropdownOptions5.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
      moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
      noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
      searchPlaceholder: 'Search', // label thats displayed in search input,
      searchOnKey: 'name' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    };
  }

  config;
  dropdownOptions: any[] = [];
  config2;
  dropdownOptions2: any[] = [];
  config4;
  dropdownOptions4: any[] = [{ id: 1, name: "Active" }, { id: 2, name: "Not Active" }];
  config5;
  dropdownOptions5: any[] = [];
  selectionChangedRole(e) {
    if (e.value) {
      this.accForm.get('roleId').setValue(e.value.id);
    }
  }

  selectionChangedCountry(e) {
    if (e.value) {
      this.getState = this.state.getState(e.value.id).subscribe(
        (res: any) => {
          if (res.statusCode == 200) {
            this.accForm.get('stateId').reset();
            this.dropdownOptions2 = [];
            this.dropdownOptions2 = res.data.map(x => {
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
        }
      );
    }
  }
  selectionChangedState(e) {
    this.accForm.get('stateId').setValue(e.value.id);
  }
  selectionChangedStatus(e) {
    if (e.value && e.value.id == 1) {
      this.accForm.get('isActive').setValue(true);
    }
    else if (e.value && e.value.id == 2) {
      this.accForm.get('isActive').setValue(false);
    }
    else {
      this.accForm.get('isActive').setValue(null);
    }
  }

  ngOnInit() {
    this.showLoader = true;
    forkJoin(
      this.CountriesService.getCountries(),
      this.role.roleSearch(this.searchRole),
      this.state.getState()
    ).subscribe(([res1, res2, res3]) => {
      if (res2.statusCode == 200) {
        this.dropdownOptions = res2.data.map(x => {
          let obj = { id: x.id, name: x.name };
          return obj;
        });
      }

      if (res1.statusCode == 200) {
        this.dropdownOptions5 = res1.data.map(x => {
          let obj = { id: x.id, name: x.name };
          return obj;
        });
      } else if (res1.statusCode == 204) {
        if (Number(res1.data)) {
          this.tostr.error("Error", this.err.ErrorServ(res1.data));
        } else {
          let arr: any[] = res1.data;
          if (Array.isArray(arr)) {
            arr.forEach(element => {
              this.tostr.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
            });
          }
        }
      }
      if (res3.statusCode == 200) {
        this.dropdownOptions2 = res3.data.map(x => {
          let obj = { id: x.id, name: x.name };
          return obj;
        });
      }
      else if (res3.statusCode == 204) {
        if (Number(res3.data)) {
          this.tostr.error("Error", this.err.ErrorServ(res3.data));
        } else {
          let arr: any[] = res3.data;
          if (Array.isArray(arr)) {
            arr.forEach(element => {
              this.tostr.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
            });
          }
        }
      }
      this.showLoader = false;
    });
    this.search();
  }
  pageIndex = 1;
  pageCount = 1;
  countArr = [];
  public pageChanged(event: any): void {
    //this method will trigger every page click 
    this.searchPage(event);
  };
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

  public searchRole = {
    "pageInfo": {
      "pageIndex": 0,
      "pageSize": 0
    },
    "orderInfoLst": [
      {
        "fieldName": "",
        "type": ""
      }
    ],
    "roleSearch": {
    }
  };
  open() {
    const modalRef = this.modalService.open(CustSearchModalComponent, {
      size: "lg"
    });
    modalRef.result.then((res) => {
      this.accForm.get('customerId').setValue(res.id);
      this.customerName = res.name;
    });
  }
  search() {
    let searchModel = {
      pageInfo: {
        pageIndex: this.pageIndex,
        pageSize: this.accForm.get("maximum").value
      },
      orderInfoLst: [
        {
          fieldName: "",
          type: ""
        }
      ],
      accountSearch: {}
    }
    this.isSubmitted = true;
    this.showLoader = true
    searchModel.accountSearch = this.accForm.value;
    this.listAccounts = this.acc.listAccounts(searchModel).subscribe(
      (res: any) => {
        if (res.statusCode == 200) {
          this.rows = res.data;
          this.temp = res.data;
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
      title: 'Delete ' + row.userName + ' ?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00c292',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.delAccount = this.acc.delAccount({ id: row.id }).subscribe(
          (res: any) => {
            if (res.statusCode == 200) {
              Swal(
                'Deleted!',
                row.userName + ' has been deleted.',
                'success'
              )
              this.search();
            }
            else {
              Swal(
                'error in delete!',
                row.userName + ' has not been deleted.',
                'error'
              )
            }
          }
        );
      }
    });
  }

  onEdit(row) {
    this._router.navigate(['/dashboard/AccountForm'], { queryParams: { account_id: row.id } });
  }

  accDetails: Subscription;

  gotToDetails(row) {
    this.showLoader = true;
    this.accDetails = this.acc.getAccount(row.id).subscribe((res: any) => {
      this.showLoader = false;
      const modalRef = this.modalService.open(AccountDetailsComponent, {
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
  onChangePass(row)
  {
    const modalRef = this.modalService.open(ChangePasswordComponent, {
      size: "lg",
    });
    modalRef.componentInstance.id = row.id;
    modalRef.result.then((res)=>{
      console.log(res);
      
    })
  }

  ngOnDestroy(): void {
    this.roleSearch ? this.roleSearch.unsubscribe() : null;
    this.ListCustomer ? this.ListCustomer.unsubscribe() : null;
    this.getState ? this.getState.unsubscribe() : null;
    this.listAccounts ? this.listAccounts.unsubscribe() : null;
    this.delAccount ? this.delAccount.unsubscribe() : null;
    this.accDetails ? this.accDetails.unsubscribe() : null;
  }
}
