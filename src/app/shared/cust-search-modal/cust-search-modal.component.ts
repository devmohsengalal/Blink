import { Component, OnInit, Input, ViewChild, OnDestroy  } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorServService } from 'src/app/services/error-serv.service';
import { FormGroup, FormControl } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { StateService } from 'src/app/services/state.service';
import { SubscriptionTypeService } from 'src/app/services/subscription-type.service';
import { subscriptionList } from 'src/app/models/subscriptionList.model';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';
@Component({
  selector: 'app-cust-search-modal',
  templateUrl: './cust-search-modal.component.html',
  styleUrls: ['./cust-search-modal.component.scss']
})
export class CustSearchModalComponent implements OnInit,OnDestroy {
  getState:Subscription;
  getSubscribtion:Subscription;
  ListCustomer:Subscription;
  deleteCust:Subscription;
  public pageCount = 1;


  customerForm: FormGroup;
  public customerList: customer;
  public subList: subscriptionList = new subscriptionList()
public showLoader:boolean;
  //DataTable
  rows = [];
  temp = [];

  @ViewChild(DatatableComponent) table: DatatableComponent;

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  constructor(private customer: CustomerService,  private state: StateService,
      private sub: SubscriptionTypeService ,  public AuthService:AuthService, private err:ErrorServService,
       private tostr: ToastrService,public activeModal: NgbActiveModal) {

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
    this.config4={
      displayKey:"name", //if objects array passed which key to be displayed defaults to description
      search:false, //true/false for the search functionlity defaults to false,
      height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder:'Status', // text to be displayed when no item is selected defaults to Select,
      customComparator: ()=>{}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
      limitTo: this.dropdownOptions4.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
      moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
      noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
      searchPlaceholder:'Search', // label thats displayed in search input,
      searchOnKey: 'name' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
       };
  }

  config;
  dropdownOptions: any[] = [];
  config2;
  dropdownOptions2: any[] = [];
  config4;
  dropdownOptions4:any[]=[{id:1,name:"Active"},{id:2,name:"Not Active"}];

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
  selectionChangedStatus(e)
  {
    if(e.value && e.value.id==1)
    {
      this.customerForm.get('isActive').setValue(true);
    }
    else if (e.value && e.value.id==2)
    {
      this.customerForm.get('isActive').setValue(false);
    }
    else
    {
      this.customerForm.get('isActive').setValue(null);
    }
    
  }
  public pageChanged(event:any):void {
    //this method will trigger every page click 
        this.searchPage(event);
      };
      pageIndex = 1;

  countArr=[];
  PageCounter()
  {
    let temp=[];
    for(let x=1;x<this.pageCount;x++)
    {
      temp.push(x+1);
    }
    this.countArr=temp;
  }
  searchPage(num:number)
  {
    this.pageIndex=num;
    this.search(); 
  }
  ngOnInit() {

    forkJoin(this.state.getState(),this.sub.getSubscribtion(this.subList)).subscribe(([state,sub])=>{
      if (state.statusCode == 200) {
        this.dropdownOptions = state.data.map(x => {
          let obj = { id: x.id, name: x.name };
          return obj;
        });
      }else if (state.statusCode == 204) {
        if(Number(state.data)){          
          this.tostr.error("Error",this.err.ErrorServ(state.data));
        }else{
          let arr:any[]=state.data;
          arr.forEach(element => {
            this.tostr.error(element.fieldName, element.isRepeated?'data is repeated':null);
          });
        }
      }

      if (sub.statusCode == 200) {
        this.dropdownOptions2 = sub.data.map(x => {
          let obj = { id: x.id, name: x.name };
          return obj;
        });
      }else if (sub.statusCode == 204) {
        if(Number(sub.data)){          
          this.tostr.error("Error",this.err.ErrorServ(sub.data));
        }else{
          let arr:any[]=sub.data;
          arr.forEach(element => {
            this.tostr.error(element.fieldName, element.isRepeated?'data is repeated':null);
          });
        }
      }
    })


    this.customerForm = new FormGroup({
      type: new FormControl("1"),
      contactName: new FormControl(""),
      contactPhone: new FormControl(""),
      contactEmail: new FormControl(""),
      email: new FormControl(""),
      name: new FormControl(""),
      stateId: new FormControl(0),
      isActive: new FormControl(null),
      phone: new FormControl(""),
      subscriptionTypeId: new FormControl(0),
      maximum: new FormControl("10"),
    });
    this.search();
  }

  search() {
    this.showLoader=true
    let searchList = {
      pageInfo: {
        "pageIndex": this.pageIndex,
        "pageSize": this.customerForm.get('maximum').value
      },
      orderInfoLst: [
        {
          fieldName: "",
          type: ""
        }],
      customerSearch: this.customerForm.value
    };
    this.ListCustomer=this.customer.ListCustomer(searchList).subscribe((res: any) => {

      if (res.statusCode == 200) {

        this.temp = res.data;
        this.rows = res.data;
        this.showLoader=false
      }else if (res.statusCode == 204) {
        if(Number(res.data)){          
          this.tostr.error("Error",this.err.ErrorServ(res.data));
        }else{
          let arr:any[]=res.data;
          arr.forEach(element => {
            this.tostr.error(element.fieldName, element.isRepeated?'data is repeated':null);
          });
        }
      }

    })
  }

  selectCustomer(row) {
    let customer={id:row.id,name:row.name}
    this.activeModal.close(customer);
  }

  ngOnDestroy(): void {

    this.getState?this.getState.unsubscribe():null;
    this.getSubscribtion?this.getSubscribtion.unsubscribe():null;
    this.ListCustomer?this.ListCustomer.unsubscribe():null;
    this.deleteCust?this.deleteCust.unsubscribe():null;
  }
}