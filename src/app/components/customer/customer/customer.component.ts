import { CountriesService } from './../../../services/countries.service';
import { ErrorServService } from 'src/app/services/error-serv.service';
import Swal from 'sweetalert2'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomerService } from './../../../services/customer.service';
import { customer } from './../../../models/customer.model';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Router, ActivatedRoute } from '@angular/router';
import { StateService } from 'src/app/services/state.service';
import { SubscriptionTypeService } from 'src/app/services/subscription-type.service';
import { subscriptionList } from 'src/app/models/subscriptionList.model';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerDetailsComponent } from '../customer-details/customer-details.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  getState: Subscription;
  getSubscribtion: Subscription;
  ListCustomer: Subscription;
  deleteCust: Subscription;
  isSubmitted = false;
  countryList: Subscription;
  customerForm: FormGroup;
  public customerList: customer;
  public subList: subscriptionList = new subscriptionList()
  public showLoader: boolean;
  pageIndex = 1;
  pageCount = 1;
  //DataTable
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
  constructor(private customer: CustomerService, private _router: Router,
    private route: ActivatedRoute, private state: StateService,
    private sub: SubscriptionTypeService, public AuthService: AuthService,
    private err: ErrorServService, private tostr: ToastrService, private CountriesService: CountriesService,
    public modalService: NgbModal) {

    this.config2 = {
      displayKey: "name", //if objects array passed which key to be displayed defaults to description
      search: true, //true/false for the search functionlity defaults to false,
      height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder: 'Select Subscriptiion Type', // text to be displayed when no item is selected defaults to Select,
      customComparator: () => { }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
      limitTo: this.dropdownOptions2.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
      moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
      noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
      searchPlaceholder: 'Search', // label thats displayed in search input,
      searchOnKey: 'name' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    };

    this.config = {
      displayKey: "name", //if objects array passed which key to be displayed defaults to description
      search: true, //true/false for the search functionlity defaults to false,
      height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder: 'Select State', // text to be displayed when no item is selected defaults to Select,
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
    this.config5 = {
      displayKey: "name", //if objects array passed which key to be displayed defaults to description
      search: false, //true/false for the search functionlity defaults to false,
      height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder: 'select Country', // text to be displayed when no item is selected defaults to Select,
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
  config5;
  dropdownOptions5: any[] = [];
  config4;
  dropdownOptions4: any[] = [{ id: 1, name: "Active" }, { id: 2, name: "Not Active" }];

  selectionChangedState(e) {
    if (e.value) {
      this.customerForm.get('stateId').setValue(e.value.id);
    }
  }

  selectionChanged(e) {
    if (e.value) {
      this.customerForm.get('subscriptionTypeId').setValue(e.value.id);
    }
  }
  selectionChangedCountry(e) {
    if (e.value) {
      this.getState = this.state.getState(e.value.id).subscribe(
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
        }
      );
    }
  }
  selectionChangedStatus(e) {
    if (e.value && e.value.id == 1) {
      this.customerForm.get('isActive').setValue(true);
    }
    else if (e.value && e.value.id == 2) {
      this.customerForm.get('isActive').setValue(false);
    }
    else {
      this.customerForm.get('isActive').setValue(null);
    }

  }
  ngOnInit() {

    this.showLoader = true
    forkJoin(
      this.CountriesService.getCountries(),
      this.state.getState(),
      this.sub.getSubscribtion(this.subList)
    ).subscribe(([res1, res2, res3]) => {
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

      if (res2.statusCode == 200) {
        this.dropdownOptions = res2.data.map(x => {
          let obj = { id: x.id, name: x.name };
          return obj;
        });
      } else if (res2.statusCode == 204) {
        if (Number(res2.data)) {
          this.tostr.error("Error", this.err.ErrorServ(res2.data));
        } else {
          let arr: any[] = res2.data;
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
      } else if (res3.statusCode == 204) {
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
      this.showLoader = false

    });

    this.customerForm = new FormGroup({
      type: new FormControl("1"),
      contactName: new FormControl(""),
      contactPhone: new FormControl("", Validators.pattern("[+]?([0-9]*)")),
      contactEmail: new FormControl(""),
      email: new FormControl(""),
      name: new FormControl(""),
      stateId: new FormControl(0),
      isActive: new FormControl(null),
      phone: new FormControl("", Validators.pattern("[+]?([0-9]*)")),
      subscriptionTypeId: new FormControl(0),
      maximum: new FormControl("10"),
    });
    this.search()
  }

  page(e) {
  }

  selectedMessage = "selected";
  totalMessage = "total";

  public pageChanged(event: any): void {
    this.searchPage(event);
  };

  search() {
    this.isSubmitted = true;
    this.showLoader = true
    let searchList = {
      pageInfo: {
        pageIndex: this.pageIndex,
        pageSize: this.customerForm.get('maximum').value
      },
      orderInfoLst: [
        {
          fieldName: "",
          type: ""
        }],
      customerSearch: this.customerForm.value
    };

    this.ListCustomer = this.customer.ListCustomer(searchList).subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.temp = res.data;
        this.rows = res.data;
        this.pageCount = res.pagesCount;
        this.PageCounter();
      }
      else if (res.statusCode == 204) {
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
    }, (err) => this.showLoader = false)
  }

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

  onEdit(row) {
    this._router.navigate(['/dashboard/CustomerForm'], { queryParams: { customer_Id: row.id } });
  }

  public custDetails: Subscription;

  gotToDetails(row) {
    this.showLoader = true;
    this.custDetails = this.customer.custDetails(row.id).subscribe((res: any) => {
      this.showLoader = false;
      const modalRef = this.modalService.open(CustomerDetailsComponent, {
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

  delete(row) {
    Swal({
      title: 'Delete ' + row.contactName + ' ?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00c292',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.deleteCust = this.customer.deleteCust({ id: row.id }).subscribe(
          (res: any) => {
            if (res.statusCode == 200) {
              Swal(
                'Deleted!',
                row.contactName + ' has been deleted.',
                'success'
              )
              this.search();
            }
            else {
              Swal(
                'error in delete!',
                row.contactName + ' has not been deleted.',
                'error'
              )
            }
          }
        );
      }
    });
  }


  
}
