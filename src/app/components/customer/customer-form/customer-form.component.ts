import { CountriesService } from 'src/app/services/countries.service';
import { ErrorServService } from './../../../services/error-serv.service';
import { customer } from './../../../models/customer.model';
import { CustomerService } from './../../../services/customer.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StateService } from 'src/app/services/state.service';
import { SubscriptionTypeService } from 'src/app/services/subscription-type.service';
import { subscriptionList } from 'src/app/models/subscriptionList.model';
import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  public customerParam;
  public addEdit;
  countryList;
  getState;
  public id;
  public selected = false;
  isSubmitted = false;
  public customerList: customer;
  public customerForm: FormGroup;
  model: NgbDateStruct;
  model2: NgbDateStruct;
  public accImage;
  customerType: ""
  public showLoader: boolean
  myImgUrl = 'https://www.startupdelta.org/wp-content/uploads/2018/04/No-profile-LinkedIn.jpg';
  public subList: subscriptionList = new subscriptionList()

  constructor(private route: ActivatedRoute, private customerService: CustomerService, private err: ErrorServService,
    private tostr: ToastrService, private state: StateService, private sub: SubscriptionTypeService,
    private NgbDateParserFormatter: NgbDateParserFormatter, public AuthService: AuthService, private CountriesService: CountriesService) {
    this.formMethod();
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
      search: true, //true/false for the search functionlity defaults to false,
      height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder: 'Select License', // text to be displayed when no item is selected defaults to Select,
      customComparator: () => { }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
      limitTo: this.dropdownOptions4.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
      moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
      noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
      searchPlaceholder: 'Search', // label thats displayed in search input,
      searchOnKey: 'name' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    };
    this.config6 = {
      displayKey: "name", //if objects array passed which key to be displayed defaults to description
      search: true, //true/false for the search functionlity defaults to false,
      height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder: 'Select Country', // text to be displayed when no item is selected defaults to Select,
      customComparator: () => { }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
      limitTo: this.dropdownOptions6.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
      moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
      noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
      searchPlaceholder: 'Search', // label thats displayed in search input,
      searchOnKey: 'name' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    };

  }

  config;
  dropdownOptions: any[] = [];
  config4;
  dropdownOptions4: any[] = [];
  config2;
  dropdownOptions2: any[] = [];
  config6;
  dropdownOptions6: any[] = [];
  config5;
  dropdownOptions5: any[] = [];


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

  permissions = [];
  selectionChangedModule(e) {
    if (e.value) {
      let arr = e.value;
      this.permissions = arr.map(x => {
        return x.id
      });
    }
  }

  selectionChangedCountry(e) {
    if (e.value) {
      this.getState = this.state.getState(e.value.id).subscribe(
        (res: any) => {
          if (res.statusCode == 200) {
            this.customerForm.get('stateId').reset();
            this.dropdownOptions = [];
            this.dropdownOptions = res.data.map(x => {
              let obj = { id: x.id, name: x.name };
              return obj;
            }).sort(function (a, b) {
              var nameA = a.name.toUpperCase(); // ignore upper and lowercase
              var nameB = b.name.toUpperCase(); // ignore upper and lowercase
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
              return 0;
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

  custedit;

  ngOnInit() {
    this.showLoader=true;
this.checkAddEdit();
  }


  checkAddEdit() {
    this.customerParam = this.route.queryParams.subscribe(params => {
      this.id = params['customer_Id'];
      if (this.id != undefined) {
        this.selected = true;
        this.addEdit = "Edit";
        this.customerForm.get('customerType').disable();
        forkJoin(
          this.CountriesService.getCountries(),
          this.state.getState(),
          this.sub.getSubscribtion(this.subList),
          this.customerService.getModules("0"),
          this.customerService.custDetails(this.id),
        ).subscribe(([country, state,sub,permission,customer]) => {
        this.subResponse(country,state,sub,permission,customer,true);
        })
      } else {
        this.selected = false;
        this.addEdit = "Add";
        this.customerForm.get('stateId').setValue(null);
        this.customerForm.get('permissions').setValue(null);
        this.customerForm.get('subscriptionTypeId').setValue(null);
        // this.customerForm.reset();

        forkJoin(
          this.CountriesService.getCountries(),
          this.state.getState(),
          this.sub.getSubscribtion(this.subList),
          this.customerService.getModules("0")
        ).subscribe(([ country, state,sub,permission]) => {
          this.subResponse( country, state,sub,permission,null,false);
        })
      }
    })
  }
  subResponse(country,state,sub,permission,customer,isEdit:boolean)
  {
    this.showLoader=false;
    if(isEdit)
    {
      if (customer.statusCode == 200) {
        this.customerList = customer.data;
          this.customerForm.setValue({
            'id': this.id,
            'customerType': this.customerList.customerType,
            'contactName': this.customerList.contactName,
            'contactPhone': this.customerList.contactPhone,
            'contactEmail': this.customerList.contactEmail,
            'email': this.customerList.email,
            'title': this.customerList.title,
            'name': this.customerList.name,
            'address': this.customerList.address,
            'subscriptionFrom': this.sanitizeDate(this.customerList.subscriptionFrom),
            'subscriptionTo': this.sanitizeDate(this.customerList.subscriptionTo),
            'noOfEndUsers': this.customerList.noOfEndUsers,
            'stateId': null,
            'countryId': null,
            'permissions': null,
            'isActive': this.customerList.isActive,
            'phone': this.customerList.phone,
            'subscriptionTypeId': null
          });
          this.dropdownOptions4 = [];
      }

      //country

     if (country.statusCode == 200) {
          this.dropdownOptions6 = country.data.map(x => {
            let obj = { id: x.id, name: x.name };
            return obj;
          }).sort(function (a, b) {
            var nameA = a.name.toUpperCase(); // ignore upper and lowercase
            var nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
          this.customerForm.get('countryId').setValue({ id: this.customerList.countryId, name: this.filteringDrop(this.customerList.countryId, this.dropdownOptions6) });
        } else if (country.statusCode == 204) {
          if (Number(country.data)) {
            this.tostr.error("Error", this.err.ErrorServ(country.data));
          } else {
            let arr: any[] = country.data;
            if (Array.isArray(arr)) {
              arr.forEach(element => {
                this.tostr.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
              });
            }
          }
        }

      //state

      if (state.statusCode == 200) {
        this.dropdownOptions = state.data.map(x => {
          let obj = { id: x.id, name: x.name };
          return obj;
        }).sort(function(a, b) {
          var nameA = a.name.toUpperCase(); // ignore upper and lowercase
          var nameB = b.name.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
        
          // names must be equal
          return 0;
        });
    
        this.customerForm.get('stateId').setValue({ id: this.customerList.stateId, name: this.filteringDrop(this.customerList.stateId, this.dropdownOptions) });
      } else if (state.statusCode == 204) {
        if (Number(state.data)) {
          this.tostr.error("Error", this.err.ErrorServ(state.data));
        } else {
          let arr: any[] = state.data;
          if (Array.isArray(arr)) {
            arr.forEach(element => {
              this.tostr.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
            });
          }
        }
      }

      //subscription

      if (sub.statusCode == 200) {
        this.dropdownOptions2 = sub.data.map(x => {
          let obj = { id: x.id, name: x.name };
          return obj;
        });

        this.customerForm.get('subscriptionTypeId').setValue({ id: this.customerList.subscriptionTypeId, name: this.filteringDrop(this.customerList.subscriptionTypeId, this.dropdownOptions2) });
       
      } else if (sub.statusCode == 204) {
        if (Number(sub.data)) {
          this.tostr.error("Error", this.err.ErrorServ(sub.data));
        } else {
          let arr: any[] = sub.data;
          if (Array.isArray(arr)) {
            arr.forEach(element => {
              this.tostr.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
            });
          }
        }
      }
      if (permission.statusCode == 200) {
        this.dropdownOptions4 = permission.data.map(x => {
          let obj = { id: x.id, name: x.name };
          return obj;
        });
        
         this.customerForm.get('permissions').setValue(this.customerList.moduleslst);
      }else if (permission.statusCode == 204) {
        if (Number(permission.data)) {
          this.tostr.error("Error", this.err.ErrorServ(permission.data));
        } else {
          let arr: any[] = permission.data;
          if (Array.isArray(arr)) {
            arr.forEach(element => {
              this.tostr.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
            });
          }
        }
      }

    }
    else
    {
      //country

      if (country.statusCode == 200) {
        this.dropdownOptions6 = country.data.map(x => {
          let obj = { id: x.id, name: x.name };
          return obj;
        }).sort(function (a, b) {
          var nameA = a.name.toUpperCase(); // ignore upper and lowercase
          var nameB = b.name.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
      } else if (country.statusCode == 204) {
        if (Number(country.data)) {
          this.tostr.error("Error", this.err.ErrorServ(country.data));
        } else {
          let arr: any[] = country.data;
          if (Array.isArray(arr)) {
            arr.forEach(element => {
              this.tostr.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
            });
          }
        }
      }

    //state

    if (state.statusCode == 200) {
      this.dropdownOptions = state.data.map(x => {
        let obj = { id: x.id, name: x.name };
        return obj;
      }).sort(function(a, b) {
        var nameA = a.name.toUpperCase(); // ignore upper and lowercase
        var nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
      
        // names must be equal
        return 0;
      });

    } else if (state.statusCode == 204) {
      if (Number(state.data)) {
        this.tostr.error("Error", this.err.ErrorServ(state.data));
      } else {
        let arr: any[] = state.data;
        if (Array.isArray(arr)) {
          arr.forEach(element => {
            this.tostr.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
          });
        }
      }
    }

    //subscription

    if (sub.statusCode == 200) {
      this.dropdownOptions2 = sub.data.map(x => {
        let obj = { id: x.id, name: x.name };
        return obj;
      });

    } else if (sub.statusCode == 204) {
      if (Number(sub.data)) {
        this.tostr.error("Error", this.err.ErrorServ(sub.data));
      } else {
        let arr: any[] = sub.data;
        if (Array.isArray(arr)) {
          arr.forEach(element => {
            this.tostr.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
          });
        }
      }
    }
    if (permission.statusCode == 200) {
      this.dropdownOptions4 = permission.data.map(x => {
        let obj = { id: x.id, name: x.name };
        return obj;
      });
  
    }else if (permission.statusCode == 204) {
      if (Number(permission.data)) {
        this.tostr.error("Error", this.err.ErrorServ(permission.data));
      } else {
        let arr: any[] = permission.data;
        if (Array.isArray(arr)) {
          arr.forEach(element => {
            this.tostr.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
          });
        }
      }
    }
    }
  }




  sanitizeDate(date: string): any {
    if (!date) {
      return null;
    }
    const dataArray: any[] = date.split('/');
    const month = Number(dataArray[0]);
    const day = Number(dataArray[1]);
    const year = Number(dataArray[2]);
    let obj = {
      year: year,
      month: month
      , day: day
    }
    return obj;
  }

  filteringDrop(id, arr) {
    if (arr.filter(x => x.id == id).length > 0) {
      let name = arr.filter(x => x.id == id)[0].name;
      return name;
    }
  }

  formMethod() {
    this.customerForm = new FormGroup({
      id: new FormControl(""),
      customerType: new FormControl(null, Validators.required),
      contactName: new FormControl("", Validators.required),
      contactPhone: new FormControl("", [Validators.required, Validators.pattern("[+]([0-9]*)"), Validators.minLength(11), Validators.maxLength(14)]),
      contactEmail: new FormControl("", [Validators.required, Validators.email]),
      email: new FormControl("", [Validators.required, Validators.email]),
      title: new FormControl(""),
      name: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z0-9]*$")]),
      countryId:new FormControl(null),
      stateId: new FormControl(0, Validators.required),
      isActive: new FormControl(false),
      phone: new FormControl("", [Validators.required, Validators.pattern("[+]([0-9]*)"), Validators.minLength(11), Validators.maxLength(14)]),
      address: new FormControl("", Validators.required),
      subscriptionTypeId: new FormControl(0, Validators.required),
      subscriptionFrom: new FormControl("", Validators.required),
      subscriptionTo: new FormControl("", Validators.required),
      permissions: new FormControl("", Validators.required),
      noOfEndUsers: new FormControl(0, Validators.required),
    });
    return this.customerForm;
  }

  add() {
    this.isSubmitted = true;
    
    if (this.customerForm.valid) {
      this.showLoader = true
      this.customerForm.get('subscriptionFrom').setValue(this.NgbDateParserFormatter.format(this.customerForm.get('subscriptionFrom').value));
      this.customerForm.get('subscriptionTo').setValue(this.NgbDateParserFormatter.format(this.customerForm.get('subscriptionTo').value));
      let added = this.customerForm.value;
      added.id = 0;
      added.isActive = (added.isActive == null ? false : true);
      added.moduleslst = this.permissions;
      added.logo = this.accImage;
      this.customerService.addCustomer(added).subscribe((res: any) => {

        if (res.statusCode == 200) {
          this.tostr.success('Success', 'Added');
          this.customerForm.reset();
          this.isSubmitted = false;
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
        this.showLoader = false;
      }, err => { this.tostr.error(err, 'Error'); this.showLoader = false; })
    }
  }

  edit() {

    this.isSubmitted = true;
    if (this.customerForm.valid) {
      // this.customerForm.get('subscriptionFrom').setValue(this.NgbDateParserFormatter.format(this.customerForm.get('subscriptionFrom').value));
      // this.customerForm.get('subscriptionTo').setValue(this.NgbDateParserFormatter.format(this.customerForm.get('subscriptionTo').value));
      this.showLoader = true
      let edited = this.customerForm.value;
      edited.moduleslst = this.permissions;
      edited.stateId = this.customerForm.get('stateId').value.id;
      edited.subscriptionTypeId = this.customerForm.get('subscriptionTypeId').value.id;
      edited.subscriptionFrom=this.NgbDateParserFormatter.format(this.customerForm.get('subscriptionFrom').value);
      edited.subscriptionTo=this.NgbDateParserFormatter.format(this.customerForm.get('subscriptionTo').value);
      this.customerService.editCustomer(edited).subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.tostr.success('Success', 'Edited');
          this.isSubmitted = false;
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
        this.showLoader = false;
      }, err => {
        this.tostr.error(err, 'Error');
        this.showLoader = false;
      })
    }
  }

  AccountImageListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    const file: File = inputValue.files[0];
    let myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.accImage = myReader.result.toString().split(',')[1];
    }
    myReader.readAsDataURL(file);
  }

}
