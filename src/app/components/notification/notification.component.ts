import { CustomerService } from './../../services/customer.service';
import { AuthService } from 'src/app/services/auth.service';
import { AccidentReportsService } from 'src/app/services/accident-reports.service';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { accidentReports } from 'src/app/models/accidentReports.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalConfig, NgbModal, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { UsersService } from 'src/app/services/users.service';
import { Subscription } from 'rxjs';
import { ErrorServService } from 'src/app/services/error-serv.service';
import { ToastrService } from 'ngx-toastr';
import { CustSearchModalComponent } from 'src/app/shared/cust-search-modal/cust-search-modal.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  cust: Subscription;
  gtuser: Subscription;
  accDetails: Subscription;
  listnoti: Subscription;
  customerName: string = "";
  model: NgbDateStruct;
  model2: NgbDateStruct;
  public show = true;
  custHidden = false
  dtOptions: DataTables.Settings = {};
  public accidentSearch: accidentReports;
  public notiForm: FormGroup;
  public showLoader: boolean;
  constructor(private notification: AccidentReportsService, private UsersService: UsersService, private auth: AuthService, private modalService: NgbModal, public AuthService: AuthService, private err: ErrorServService, private tostr: ToastrService,
    private NgbDateParserFormatter: NgbDateParserFormatter) {
    let customerID = this.auth.customerID;
    let isOwner = this.auth.isOwner;

    this.notiForm = new FormGroup({
      customerId: new FormControl(0),
      endUserId: new FormControl(0),
      phone: new FormControl(""),
      sendDateFrom: new FormControl(""),
      sendDateTo: new FormControl(""),
      maximum: new FormControl("10"),

    })

    if (isOwner == false) {
      this.notiForm.get('customerId').setValue(customerID);
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

    this.config2 = {
      displayKey: "name", //if objects array passed which key to be displayed defaults to description
      search: true, //true/false for the search functionlity defaults to false,
      height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder: 'Select End User', // text to be displayed when no item is selected defaults to Select,
      customComparator: () => { }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
      limitTo: this.dropdownOptions2.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
      moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
      noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
      searchPlaceholder: 'Search', // label thats displayed in search input,
      searchOnKey: 'name' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    };
  }
  open() {
    const modalRef = this.modalService.open(CustSearchModalComponent, {
      size: "lg"
    });
    modalRef.result.then((res) => {
      this.notiForm.get('customerId').setValue(res.id);
      this.customerName = res.name;

    });
  }
  config;
  dropdownOptions: any[] = [];
  config2;
  dropdownOptions2: any[] = [];
  getUserSearch = {
    pageInfo: {
      "pageIndex": 0,
      "pageSize": 0
    }
  }
  rows = [];
  temp = [];

  @ViewChild(DatatableComponent) table: DatatableComponent;
  public pageChanged(event: any): void {
    this.searchPage(event);
  };
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
  }

  ngOnInit(): void {
   
    this.dtOptions = {
      pagingType: 'full_numbers'
    };


    this.showLoader = true;
    let searchModel = {
      "pageInfo": {
        "pageIndex": 0,
        "pageSize": 0
      }
    }
    this.show = false;
    this.gtuser = this.UsersService.getUsers(searchModel).subscribe(
      (res: any) => {

        if (res.statusCode == 200) {
          this.dropdownOptions2 = res.data
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
      }, (err) => {
        this.tostr.error(err);
        this.showLoader = false
      })
    this.search()
  }

  selectionChangedCustomer(e) {
    this.notiForm.get('customerId').setValue(e.value.id);
  }

  selectionChangedUser(e) {
    this.notiForm.get('endUserId').setValue(e.value.id);
  }

  pageIndex = 1;
  pageCount = 1;
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

  changeCurrentTimeFromGMT(Arr){
    Arr.forEach(element => {
      element.sendDate=element.sendDate!=null?new Date(element.sendDate+"Z").toISOString():null;
    });
  }
  search() {

    this.showLoader = true
    let notiSearch = {
      pageInfo: {
        "pageIndex": this.pageIndex,
        "pageSize": this.notiForm.get('maximum').value
      },
      "customerId": this.notiForm.get('customerId').value,
      "endUserId": this.notiForm.get('endUserId').value,
      "phone": this.notiForm.get('phone').value,
      "sendDateFrom": this.NgbDateParserFormatter.format(this.notiForm.get('sendDateFrom').value),
      "sendDateTo": this.NgbDateParserFormatter.format(this.notiForm.get('sendDateTo').value),
    }

    this.listnoti = this.notification.listNotfications(notiSearch).subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.show = false;
        const data=res.data;
        this.changeCurrentTimeFromGMT(data);
        this.rows = data;
        this.temp = data;
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
  ngOnDestroy(): void {
    this.cust ? this.cust.unsubscribe() : null;
    this.listnoti ? this.listnoti.unsubscribe() : null;
    this.gtuser ? this.gtuser.unsubscribe() : null;
  }
}
