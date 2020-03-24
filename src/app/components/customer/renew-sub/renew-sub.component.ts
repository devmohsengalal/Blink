import { ErrorServService } from 'src/app/services/error-serv.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomerService } from './../../../services/customer.service';
import { Component, OnDestroy } from '@angular/core';
import { NgbDateStruct, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { CustSearchModalComponent } from 'src/app/shared/cust-search-modal/cust-search-modal.component';
import { RenewSubResultComponent } from './renew-sub-result/renew-sub-result.component';

@Component({
  selector: 'app-renew-sub',
  templateUrl: './renew-sub.component.html',
  styleUrls: ['./renew-sub.component.scss']
})
export class RenewSubComponent implements OnDestroy {
  ListCustomer: Subscription;
  RenewSubscription: Subscription;
  renewForm: FormGroup;
  isSubmitted = false;
  customerName: string = "";
  model: NgbDateStruct;
  model2: NgbDateStruct;
  public showLoader: boolean;
  constructor(private customer: CustomerService, private NgbDateParserFormatter: NgbDateParserFormatter,
    private err: ErrorServService, private tostr: ToastrService, public AuthService: AuthService,
    private modalService: NgbModal) {

    let customerID = this.AuthService.customerID;
    let isOwner = this.AuthService.isOwner;
    this.renewForm = new FormGroup({
      'customerId': new FormControl(null, Validators.required),
      'subscriptionFrom': new FormControl("", Validators.required),
      'subscriptionTo': new FormControl("", Validators.required),
      'noOfEndUsers': new FormControl("")
    })
    if (isOwner == false) {
      this.renewForm.get('customerId').setValue(customerID);
      this.custHidden = true;
    } else {
      this.custHidden = false;
    }
  }
  custHidden: Boolean = false;
  open() {
    const modalRef = this.modalService.open(CustSearchModalComponent, {
      size: "lg"
    });
    modalRef.result.then((res) => {
      this.renewForm.get('customerId').setValue(res.id);
      this.customerName = res.name;
    });
  }


  renewSubscription() {
    this.isSubmitted = true;
    if (this.renewForm.valid) {
      this.showLoader = true
      this.renewForm.get('subscriptionFrom').setValue(this.NgbDateParserFormatter.format(this.renewForm.get('subscriptionFrom').value));
      this.renewForm.get('subscriptionTo').setValue(this.NgbDateParserFormatter.format(this.renewForm.get('subscriptionTo').value));
      this.RenewSubscription = this.customer.RenewSubscription(this.renewForm.value).subscribe(res => {
        if (res.statusCode == 200) {
          this.tostr.success('Success', 'Subscribed');
          this.gotToDetails({ form: this.renewForm.value, result: res });

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
        this.showLoader = false;
      })
    }
  }

  gotToDetails(row) {
    this.showLoader = true;
    const modalRef = this.modalService.open(RenewSubResultComponent, {
      size: "lg",
    });
    modalRef.componentInstance.details = row;
    this.showLoader = false;
  }
  ngOnDestroy(): void {
    this.ListCustomer ? this.ListCustomer.unsubscribe() : null;
    this.RenewSubscription ? this.RenewSubscription.unsubscribe() : null;
  }
}
