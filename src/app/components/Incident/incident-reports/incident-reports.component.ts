import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { accidentReports } from 'src/app/models/accidentReports.model';
import { FormGroup, FormControl } from '@angular/forms';
import { AccidentReportsService } from 'src/app/services/accident-reports.service';
import { DatatableComponent } from '@swimlane/ngx-datatable/release/components';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';
import { _localeFactory } from '@angular/core/src/application_module';
import { Subscription } from 'rxjs';
import { ErrorServService } from 'src/app/services/error-serv.service';
import { ToastrService } from 'ngx-toastr';
import { CustSearchModalComponent } from 'src/app/shared/cust-search-modal/cust-search-modal.component';
import { NgbModal, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { IncidentDetailsComponent } from '../incident-details/incident-details.component';

@Component({
  selector: 'app-incident-reports',
  templateUrl: './incident-reports.component.html',
  styleUrls: ['./incident-reports.component.scss']
})
export class IncidentReportsComponent implements OnInit, OnDestroy {
  ListCustomer: Subscription;
  customerName: string = "";
  getUsers: Subscription;
  model: NgbDateStruct;
  model2: NgbDateStruct;
  listIncidentReports: Subscription;
  public incidentSearch: accidentReports;
  public incidentForm: FormGroup;
  custHidden = false;
  public show = true;
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

  constructor(private incident: AccidentReportsService, private err: ErrorServService,
    private tostr: ToastrService, private UsersService: UsersService, private auth: AuthService,
    public AuthService: AuthService, private NgbDateParserFormatter: NgbDateParserFormatter,
    private modalService: NgbModal) {
    let customerID = this.auth.customerID;
    let isOwner = this.auth.isOwner;
    this.incidentForm = new FormGroup({
      customerId: new FormControl(0),
      name: new FormControl(""),
      endUserId: new FormControl(0),
      phone: new FormControl(""),
      startDate: new FormControl(""),
      endDate: new FormControl(""),
      maximum: new FormControl("10"),
    })

    if (isOwner == false) {
      this.incidentForm.get('customerId').setValue(customerID);
      this.custHidden = true;
    } else {
      this.custHidden = false;
    }

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

  config2;
  dropdownOptions2: any[] = [];
  getUserSearch = {
    pageInfo: {
      "pageIndex": 0,
      "pageSize": 0
    }
  }
  open() {
    const modalRef = this.modalService.open(CustSearchModalComponent, {
      size: "lg"
    });
    modalRef.result.then((res) => {
      this.incidentForm.get('customerId').setValue(res.id);
      this.customerName = res.name;
    });
  }

  ngOnInit() {
    this.showLoader = true
    this.getUsers = this.UsersService.getUsers(this.getUserSearch).subscribe(
      (res: any) => {
        if (res.statusCode == 200) {
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
        this.showLoader = false
      }
    );
    this.search()
  }
  public pageChanged(event: any): void {
    this.searchPage(event);
  };
  selectionChangedCustomer(e) {
    this.incidentForm.get('customerId').setValue(e.value.id);
  }

  selectionChangedUser(e) {
    this.incidentForm.get('endUserId').setValue(e.value.id);
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
      element.date=element.date!=null?new Date(element.date+"Z").toISOString():null;
    });
  }
  search() {
    this.showLoader = true
    let incSearch = {
      pageInfo: {
        "pageIndex": this.pageIndex,
        "pageSize": this.incidentForm.get('maximum').value
      },
      "customerId": this.incidentForm.get('customerId').value,
      "endUserId": this.incidentForm.get('endUserId').value,
      "name": this.incidentForm.get('name').value,
      "phone": this.incidentForm.get('phone').value,
      "startDate": this.NgbDateParserFormatter.format(this.incidentForm.get('startDate').value),
      "endDate": this.NgbDateParserFormatter.format(this.incidentForm.get('endDate').value),
    }

    this.listIncidentReports = this.incident.listIncidentReports(incSearch).subscribe(
      (res: any) => {
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

  getIncidentDetails: Subscription;

  goToDetails(row) {
    this.showLoader = true;
    this.getIncidentDetails = this.incident.getIncidentDetails(row.id).subscribe((res: any) => {
      this.showLoader = false;
      const modalRef = this.modalService.open(IncidentDetailsComponent, {
        size: "lg",
      });
      if (res.statusCode == 200) {
        modalRef.componentInstance.details = res.data;
      } else {
        modalRef.componentInstance.altText = true;
      }
    }, (err) => {
      this.tostr.error(err);
      this.showLoader = false;
    })
  }

  ngOnDestroy(): void {
    this.ListCustomer ? this.ListCustomer.unsubscribe() : null;
    this.getUsers ? this.getUsers.unsubscribe() : null;
    this.listIncidentReports ? this.listIncidentReports.unsubscribe() : null;

  }
}
