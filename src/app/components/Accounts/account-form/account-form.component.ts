import { ErrorServService } from './../../../services/error-serv.service';
import { AuthService } from 'src/app/services/auth.service';
import { StateService } from './../../../services/state.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from './../../../services/account.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Accounts } from 'src/app/models/account.model';
import { RolesService } from 'src/app/services/roles.service';
import { CustomerService } from 'src/app/services/customer.service';
import { Subscription, forkJoin } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustSearchModalComponent } from 'src/app/shared/cust-search-modal/cust-search-modal.component';
import { CountriesService } from 'src/app/services/countries.service';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss']
})
export class AccountFormComponent implements OnInit {
  ListCustomer: Subscription;
  roleSearch: Subscription;
  getState: Subscription;
  getAccount: Subscription;
  accountParam: Subscription;
  addAccount: Subscription;
  editAccount: Subscription;
  customerName: string = "";
  isCountry = true;
  public accForm: FormGroup;
  public selected: boolean;
  public addEdit;
  public id;
  public accImage;
  public showLoader: boolean;
  custHidden: boolean;
  myImgUrl = 'https://www.startupdelta.org/wp-content/uploads/2018/04/No-profile-LinkedIn.jpg';
  public account: Accounts = new Accounts();
  isSubmitted = false;
  constructor(private acc: AccountService, private tostr: ToastrService, private route: ActivatedRoute,
    private role: RolesService, private state: StateService, private customer: CustomerService,
    public AuthService: AuthService, private err: ErrorServService, private modalService: NgbModal,
    public CountriesService: CountriesService) { 
    let isOwner = this.AuthService.isOwner;
    this.formMethod();

    this.accForm.get('customerId').setValue(this.AuthService.customerID);

    this.accForm.get('custName').setValue('@'+this.AuthService.customerName);

   
    if (isOwner == false) {
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
    this.config3 = {
      displayKey: "name", //if objects array passed which key to be displayed defaults to description
      search: true, //true/false for the search functionlity defaults to false,
      height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder: 'Select State', // text to be displayed when no item is selected defaults to Select,
      customComparator: () => { }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
      limitTo: this.dropdownOptions3.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
      moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
      noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
      searchPlaceholder: 'Search', // label thats displayed in search input,
      searchOnKey: 'name' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    };
    this.config4 = {
      displayKey: "name", //if objects array passed which key to be displayed defaults to description
      search: true, //true/false for the search functionlity defaults to false,
      height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder: 'Select Country', // text to be displayed when no item is selected defaults to Select,
      customComparator: () => { }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
      limitTo: this.dropdownOptions4.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
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
      this.accForm.get('customerId').setValue(res.id);
      this.customerName = res.name;
      this.accForm.get('custName').setValue('@'+res.name);
      this.searchRole.roleSearch.customerId = res.id;
      // roleSearch
      this.roleSearch = this.role.roleSearch(this.searchRole).subscribe(
        (res: any) => {
          if (res.statusCode == 200) {
            this.dropdownOptions = res.data.map(x => {
              let obj = {
                id: x.id,
                name: x.name
              };
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
        });
    });
  }
  config;
  dropdownOptions: any[] = [];
  config3;
  dropdownOptions3: any[] = [];
  config4;
  dropdownOptions4: any[] = [];
  countryList: Subscription;

  selectionChangedRole(e) {
    if (e.value) {
      this.accForm.get('roleId').setValue(e.value);
    }
  }

  selectionChangedCountry(e) {
    if (e.value) {
      this.accForm.get('stateId').setValue(null);
      this.getState = this.state.getState(e.value.id).subscribe(
        (res: any) => {
          if (res.statusCode == 200) {
            this.dropdownOptions3 = res.data.map(x => {
              let obj = {
                id: x.id,
                name: x.name
              };
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

              // names must be equal
              return 0;
            });
            this.isCountry = false;
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
    if (e.value) {
      this.accForm.get('stateId').setValue(e.value);
    }
  }
  public searchRole = {
    pageInfo: {
      pageIndex: 0,
      pageSize: 0
    },
    orderInfoLst: [{
      fieldName: "",
      type: ""
    }],
    roleSearch: {
      customerId: this.AuthService.customerID
    }
  };
  ngOnInit() {
this.checkAddEdit();
  }
  checkAddEdit() {
    this.accountParam = this.route.queryParams.subscribe(params => {
      this.id = params['account_id'];
      if (this.id != undefined) {

        this.addEdit = "Edit"
        this.isCountry = false;
        this.selected = true;
        forkJoin(
          
          this.CountriesService.getCountries(),
          this.state.getState(),
          this.acc.getAccount(this.id)
        ).subscribe(([country, state,acc]) => {
        this.subResponse(null,country,state,acc,true);
        })
      } else {
        this.selected = false;
        this.addEdit = "Add"
        this.accForm.get('stateId').setValue(null);
        this.accForm.get('roleId').setValue(null);
    
        forkJoin(
          this.role.roleSearch(this.searchRole),
          this.CountriesService.getCountries(),
          this.state.getState(),
        ).subscribe(([role, country, state]) => {
          this.subResponse(role,country,state,null,false);
        })
      }
    })
  }
  subResponse(role,country,state,acc,isEdit:boolean)
  {
    if(isEdit)
    {
      if (acc.statusCode == 200) {
        this.account = acc.data;
        let userName=this.account.userName.split('@');
        

        this.accForm.setValue({
          'id': this.id,
          'roleId': null,
          'fullName': this.account.fullName,
          'userName': userName[0],
          'email': this.account.email,
          'phoneNumber': this.account.phoneNumber,
          'stateId': null,
          'isActive': this.account.isActive,
          'countryId': null,
          'customerId': this.account.customerId,
          'custName': "@"+userName[1],
          'password': ''
        });
        this.customerName = this.account.customerName;
      }

      //country

      if (country.statusCode == 200) {
        this.dropdownOptions4 = country.data.map(x => {
          let obj = {
            id: x.id,
            name: x.name
          };
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
          // names must be equal
          return 0;
        });
        this.accForm.get('countryId').setValue({
          id: this.account.countryId,
          name: this.filteringDrop(this.account.countryId, this.dropdownOptions4)
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
        this.dropdownOptions3 = state.data.map(x => {
          let obj = {
            id: x.id,
            name: x.name
          };
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
          this.accForm.get('stateId').setValue({
            id: this.account.stateId,
            name: this.filteringDrop(this.account.stateId, this.dropdownOptions3)
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

      //role

        this.searchRole.roleSearch.customerId = this.account.customerId
        this.role.roleSearch(this.searchRole).subscribe(
          (res)=>{
            if (res.statusCode == 200) {
              this.dropdownOptions = res.data.map(x => {
                let obj = {
                  id: x.id,
                  name: x.name
                };
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
      
                this.accForm.get('roleId').setValue({
                  id: this.account.roleId,
                  name: this.filteringDrop(this.account.roleId, this.dropdownOptions)
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
        )
     
    }
    else
    {
      //country

      if (country.statusCode == 200) {
        this.dropdownOptions4 = country.data.map(x => {
          let obj = {
            id: x.id,
            name: x.name
          };
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
          // names must be equal
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
        this.dropdownOptions3 = state.data.map(x => {
          let obj = {
            id: x.id,
            name: x.name
          };
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

      //role
      if (role.statusCode == 200) {
        this.dropdownOptions = role.data.map(x => {
          let obj = {
            id: x.id,
            name: x.name
          };
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
      } else if (role.statusCode == 204) {
        if (Number(role.data)) {
          this.tostr.error("Error", this.err.ErrorServ(role.data));
        } else {
          let arr: any[] = role.data;
          if (Array.isArray(arr)) {
            arr.forEach(element => {
              this.tostr.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
            });
          }
        }
      }
    }
  }
  filteringDrop(id, arr) {
    if (arr.filter(x => x.id == id).length > 0) {
      let name = arr.filter(x => x.id == id)[0].name;
      return name;
    }
    return null
  }

  formMethod() {
    this.accForm = new FormGroup({
      id: new FormControl("0"),
      roleId: new FormControl(0, Validators.required),
      fullName: new FormControl("", Validators.required),
      userName: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z0-9]*$")]),
      email: new FormControl("", [Validators.required, Validators.email]),
      phoneNumber: new FormControl(null, [Validators.required, Validators.pattern("[+]([0-9]*)")]),
      stateId: new FormControl(null, Validators.required),
      isActive: new FormControl(false),
      customerId: new FormControl(null, Validators.required),
      countryId: new FormControl(null),
      custName: new FormControl(""),
      password: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(100)])
    })
  }

  add() {
    this.isSubmitted = true
    
    if (this.accForm.valid) {
      this.showLoader = true;
      let added = this.accForm.value;    
      const userName=this.accForm.get("userName").value;
      const custName=this.accForm.get('custName').value;
      added.photo = this.accImage;
      added.userName=userName+custName;
      added.roleId = this.accForm.value.roleId.id;
      added.stateId = this.accForm.value.stateId.id;
      this.accForm.get('id').setValue(0);
      this.addAccount = this.acc.addAccount(added).subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.tostr.success('Success', 'Added');
          this.accForm.reset()
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
      }, (err => {
        this.tostr.error(err, 'Error');
        this.showLoader = false;
      }))
    }
  }

  edit() {    
    this.isSubmitted = true;
    this.accForm.get('password').setValue('dummy data');
    let edited = this.accForm.value;
    console.log(this.accForm.value.stateId);
    
    
    edited.customerId = this.accForm.value.customerId;

    const userName=this.accForm.get("userName").value;
    const custName=this.accForm.get('custName').value;
    edited.userName=userName+custName;
    edited.roleId = this.accForm.value.roleId.id;
    edited.stateId = this.accForm.value.stateId.id;
    if (this.accForm.valid) {
      this.editAccount = this.acc.editAccount(edited).subscribe((res: any) => {
        this.showLoader = true;
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
      }, (err => {
        this.tostr.error(err, 'Error');
        this.showLoader = false;
      }))
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
