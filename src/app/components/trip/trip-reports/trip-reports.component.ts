import { ErrorServService } from './../../../services/error-serv.service';
import { TripService } from '../../../services/trip.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { accidentReports } from 'src/app/models/accidentReports.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustSearchModalComponent } from 'src/app/shared/cust-search-modal/cust-search-modal.component';
import { TripDetailsComponent } from '../trip-details/trip-details.component';


@Component({
  selector: 'app-trip-reports',
  templateUrl: './trip-reports.component.html',
  styleUrls: ['./trip-reports.component.scss']
})
export class TripReportsComponent implements OnInit {
  getGroups: Subscription;
  getUsers: Subscription;
  ListCustomer: Subscription;
  listTripReports: Subscription;
  isSubmitted = false;
  customerName: string = "";
  public show = true;
  custHidden = false;
  dtOptions: DataTables.Settings = {};
  public tripSearch: accidentReports;
  public tripForm: FormGroup;
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

  constructor(private trip: TripService, private err: ErrorServService, private tostr: ToastrService, private UsersService: UsersService, private auth: AuthService, public AuthService: AuthService, private modalService: NgbModal, private NgbDateParserFormatter: NgbDateParserFormatter) {
    let customerID = this.auth.customerID;
    let isOwner = this.auth.isOwner;
    this.tripForm = new FormGroup({
      customerId: new FormControl(0),
      username: new FormControl(null),
      endUseGroupId: new FormControl(0),
      endUserId: new FormControl(0),
      phone: new FormControl(null, Validators.pattern("[+]?([0-9]*)")),
      isActive: new FormControl(null),
      startDate: new FormControl(null),
      endDate: new FormControl(null),
      maximum: new FormControl("10"),
    });
    if (isOwner == false) {
      this.tripForm.get('customerId').setValue(customerID);
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
  config2;
  dropdownOptions2: any[] = [];
  config4;
  dropdownOptions4: any[] = [{ id: 1, name: "Active" }, { id: 2, name: "Not Active" }];
  open() {
    const modalRef = this.modalService.open(CustSearchModalComponent, {
      size: "lg"
    });
    modalRef.result.then((res) => {
      console.log(res);
      this.tripForm.get('customerId').setValue(res.id);
      this.customerName = res.name;

    });
  }
  getUserSearch = {
    pageInfo: {
      "pageIndex": 0,
      "pageSize": 0
    }
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
    this.showLoader = true;
    forkJoin(this.UsersService.getGroups(),this.UsersService.getUsers(this.getUserSearch)).subscribe(([group,user])=>{
      this.showLoader = false     
      if (group.statusCode == 200) {
        this.dropdownOptions = group.data.map(x => {
          let obj = { id: x.id, name: x.name };
          return obj;
        });
      } else if (group.statusCode == 204) {
        if (Number(group.data)) {
          this.tostr.error("Error", this.err.ErrorServ(group.data));
        } else {
          let arr: any[] = group.data;
          if (Array.isArray(arr)) {
            arr.forEach(element => {
              this.tostr.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
            });
          }
        }
      }
      if (user.statusCode == 200) {
        this.dropdownOptions2 = user.data.map(x => {
          let obj = { id: x.id, name: x.name };
          return obj;
        });
      } else if (user.statusCode == 204) {
        if (Number(user.data)) {
          this.tostr.error("Error", this.err.ErrorServ(user.data));
        } else {
          let arr: any[] = user.data;
          if (Array.isArray(arr)) {
            arr.forEach(element => {
              this.tostr.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
            });
          }
        }
      }
    })
    this.search()
  }
  public pageChanged(event: any): void {
    this.searchPage(event);
  };
  selectionChangedGroup(e) {
    this.tripForm.get('endUseGroupId').setValue(e.value.id);
  }
  selectionChangedUser(e) {
    this.tripForm.get('endUserId').setValue(e.value.id);
  }
  selectionChangedStatus(e) {
    if (e.value && e.value.id == 1) {
      this.tripForm.get('isActive').setValue(true);
    }
    else if (e.value && e.value.id == 2) {
      this.tripForm.get('isActive').setValue(false);
    }
    else {
      this.tripForm.get('isActive').setValue(null);
    }

  }
  selectionChangedCustomer(e) {
    this.tripForm.get('customerId').setValue(e.value.id);
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
      element.startTime= element.startTime!=null?new Date(element.startTime+"Z").toISOString():null;
      element.endTime= element.endTime!=null?new Date(element.endTime+"Z").toISOString():null;
    });
  }
  search() {
    let form = new accidentReports();
    form = this.tripForm.value;
    form.startDate = this.NgbDateParserFormatter.format(this.tripForm.get('startDate').value);
    form.endDate = this.NgbDateParserFormatter.format(this.tripForm.get('endDate').value);
    form.pageInfo = { pageIndex: this.pageIndex, pageSize: this.tripForm.get('maximum').value };
    this.isSubmitted = true
    this.showLoader = true
    this.listTripReports = this.trip.listTripReports(form).subscribe(
      (res: any) => {
        if (res.statusCode) {
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
  public tripDetails: Subscription;
  goToDetails(row) {
    this.showLoader = true;
    this.tripDetails = this.trip.getTripDetails(row.id).subscribe((res: any) => {
      this.showLoader = false;
      const modalRef = this.modalService.open(TripDetailsComponent, {
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

}
