import { SubscriptionTypeService } from 'src/app/services/subscription-type.service';
import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { customer } from 'src/app/models/customer.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ErrorServService } from 'src/app/services/error-serv.service';
import { ToastrService } from 'ngx-toastr';
import { SubListComponent } from './sub-list/sub-list.component';
import { subscriptionList } from 'src/app/models/subscriptionList.model';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit, OnDestroy {
  @Input() altText = false;
  @Input() details: customer = new customer();;
  public account: Subscription;
  showLoader = false;
  public subscription: subscriptionList = new subscriptionList();
  truncateString(str, num) {
    if (str.length > num)
      return str.slice(0, num > 3 ? num - 3 : num) + '...';
    return str;
  }

  public customerDetails: customer = new customer();

  public accImage;
  fullApiKey = "";
  truncateApiKey = "";
  isFull = false;
  public isCollapsed = true;
  myImgUrl = 'https://www.startupdelta.org/wp-content/uploads/2018/04/No-profile-LinkedIn.jpg';
  constructor(private route: ActivatedRoute, public activeModal: NgbActiveModal, private modalService: NgbModal, private err: ErrorServService, private tostr: ToastrService, private subService: SubscriptionTypeService) { }
  ngOnInit() {
    this.fullApiKey = this.details.apiKey;
    this.customerDetails = this.details;
    this.truncateApiKey = this.truncateString(this.customerDetails.apiKey, 100);
    this.customerDetails.apiKey = this.truncateApiKey;
    this.GetSuplist()
  }
  gotToDetails(row) {
    this.showLoader = true;
    const modalRef = this.modalService.open(SubListComponent, {
      size: "lg",
    });
    modalRef.componentInstance.details = row;
    this.showLoader = false;
  }

  GetSuplist() {
    this.rows = this.customerDetails.subscriptionlst;
    this.temp = this.customerDetails.subscriptionlst;
  }
  readThis(inputValue: any): void {
    const file: File = inputValue.files[0];
    let myReader: FileReader = new FileReader();


    myReader.onloadend = (e) => {
      this.accImage = myReader.result.toString().split(',')[1];
    }
    myReader.readAsDataURL(file);
  }

  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }
  showFull(entre: boolean) {
    if (entre) {
      this.customerDetails.apiKey = this.fullApiKey;
    }
    else {
      this.customerDetails.apiKey = this.truncateApiKey;
    }
  }
  copyText() {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.fullApiKey;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
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
  ngOnDestroy(): void {

    this.account ? this.account.unsubscribe() : null;

  }
}
