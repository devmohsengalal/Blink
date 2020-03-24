import {ActivatedRoute} from '@angular/router';
import {VehicleService} from '../../../../services/vehicle.service';
import {ToastrService} from 'ngx-toastr';
import {UsersService} from '../../../../services/users.service';
import {Component,OnInit} from '@angular/core';
import { FormGroup,FormControl,Validators} from '@angular/forms';
import {group} from 'src/app/models/group.model';
import {userAddEdit} from 'src/app/models/userAddEdit.model';
import {Subscription, forkJoin} from 'rxjs';
import {AuthService} from 'src/app/services/auth.service';
import {ErrorServService} from 'src/app/services/error-serv.service';

import {customer} from 'src/app/models/customer.model';
import { CountriesService } from 'src/app/services/countries.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})

export class UserFormComponent implements OnInit {
  getGroups: Subscription;
  listVehicle: Subscription;
  listCountry: Subscription;
  ListCustomer: Subscription;
  userParam: Subscription;
  countrySub: Subscription;
  getUsers: Subscription;
  editUsers: Subscription;
  addUsers: Subscription;
  customerName: string = "";
  public id;
  public addEdit = "";
  isSubmitted = false;
  custHidden = false;
  public selected = false;
  public show = true;
  public userMangement: userAddEdit = new userAddEdit();
  public group: group = new group();
  public userForm: FormGroup;
  public accImage;
  public showLoader: boolean;
  myImgUrl = 'https://www.startupdelta.org/wp-content/uploads/2018/04/No-profile-LinkedIn.jpg';
  constructor(private _user: UsersService, private err: ErrorServService, private tostr: ToastrService,
    private UsersService: UsersService, private VehicleService: VehicleService,
    private route: ActivatedRoute,
    public AuthService: AuthService,  private countryService: CountriesService) {
    this.userMangement.customer = new customer();
    this.formMethod()
    this.customerId = this.AuthService.customerID;

    // let isOwner = this.AuthService.isOwner;
    // if (isOwner == false) {

    //   this.userForm.get('customerId').setValue(customerID);
    //   this.custHidden = true;
    // } else {
    //   this.custHidden = false;
    // }
    this.config = {
      displayKey: "name", //if objects array passed which key to be displayed defaults to description
      search: true, //true/false for the search functionlity defaults to false,
      height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder: 'Select Group', // text to be displayed when no item is selected defaults to Select,
      customComparator: () => {}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
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
      placeholder: 'Select Vehicle', // text to be displayed when no item is selected defaults to Select,
      customComparator: () => {}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
      limitTo: this.dropdownOptions2.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
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
      customComparator: () => {}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
      limitTo: this.dropdownOptions4.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
      moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
      noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
      searchPlaceholder: 'Search', // label thats displayed in search input,
      searchOnKey: 'name' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    };
  }
  // open() {
  //   const modalRef = this.modalService.open(CustSearchModalComponent, {
  //     size: "lg"
  //   });
  //   modalRef.result.then((res) => {
  //     this.userForm.get('customerId').setValue(res.id);
  //     this.customerName = res.name;
  //   });
  // }
  customerId:number=0;
  config;
  dropdownOptions: any[] = [];
  config2;
  dropdownOptions2: any[] = [];
  // config3;
  // dropdownOptions3: any[] = [];
  config4;
  dropdownOptions4: any[] = [];

  selectionChangedGroup(e) {
    this.userForm.get('endUserGroupId').setValue(e.value);
  }

  selectionChangedCountry(e) {
    this.userForm.get('countryCode').setValue(e.value);
    console.log(e.value);
    
  }

  selectionChangedVehicle(e) {
   if(e.value)
   {
    this.userForm.get('vehicleId').setValue(e.value);
   }
   else
   {
    this.userForm.get('vehicleId').setValue(null);
   }
  }
  public Vehicle = {
    pageInfo: {
      pageIndex: 0,
      pageSize: 0
    },
    orderInfoLst: [{
      fieldName: "",
      type: ""
    }],
    vehicleSearch: {
      customerId:this.customerId
    }
  };
  public searchList = {
    pageInfo: {
      pageIndex: 0,
      pageSize: 0
    },
    orderInfoLst: [{
      fieldName: "",
      type: ""
    }],
    customerSearch: {}
  };
  public user = {
    endUserId: this.id,

    pageInfo: {
      pageIndex: 1,
      pageSize: 1
    }
  }

  ngOnInit() {
    this.showLoader = true;
    // this.formMethod()
    this.checkAddEdit()
  }


  checkAddEdit() {
    this.userParam = this.route.queryParams.subscribe(params => {
      this.id = params['user_id'];
      this.user.endUserId=this.id;
      if (this.id != undefined) {
        this.customerId=params['customer_id'];
        this.Vehicle.vehicleSearch.customerId=this.customerId;
        this.selected = true;
        this.addEdit = "Edit";
        forkJoin(
          this.UsersService.getGroups(),
          this.VehicleService.listVehicle(this.Vehicle),
          this.countryService.getCountries(),
          this._user.getUsers(this.user),
        ).subscribe(([group, vehicle,country,user]) => {
        this.subResponse(group, vehicle,country,user,true);
        })
      } else {
        this.selected = false;
        this.addEdit = "Add";
        this.selected = false;
        this.addEdit = "Add"
        this.userForm.get('endUserGroupId').setValue(null);
        this.userForm.get('countryCode').setValue(null);
        this.userForm.get('vehicleId').setValue(null);
        // this.userForm.reset();
        this.Vehicle.vehicleSearch.customerId=this.customerId;
        forkJoin(
          this.UsersService.getGroups(),
          this.VehicleService.listVehicle(this.Vehicle),
          this.countryService.getCountries(),
        ).subscribe(([ group, vehicle,country]) => {
          this.subResponse( group, vehicle,country,null,false);
        })
      }
    })
  }
  subResponse(group, vehicle,country,user,isEdit:boolean)
  {
    this.showLoader=false;
    if(isEdit)
    {
        if (user.statusCode == 200) {
          this.userMangement = user.data.filter(x => this.id == x.id)[0];
          this.userForm.setValue({
            'id': this.id,
            'endUserGroupId': null,
            'name': this.userMangement.name,
            'countryCode': null,
            'email': this.userMangement.email,
            'phone': this.userMangement.phone,
            'isActive': this.userMangement.isActive,
            'vehicleId': null,
          })
          this.customerName = this.userMangement.customer.name;
        }


      if (group.statusCode == 200) {
        this.dropdownOptions = group.data.map(x => {
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

         this.userForm.get('endUserGroupId').setValue(this.userMangement.endUserGroupId != null ? {
          id: this.userMangement.endUserGroupId,
          name: this.filteringDrop(this.userMangement.endUserGroupId, this.dropdownOptions)
        } : null);
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
      //state

      if (vehicle.statusCode == 200) {
          this.dropdownOptions2 = vehicle.data.map(x => {
            let obj = {
              id: x.id,
              name: x.type
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

           this.userForm.get('vehicleId').setValue(this.userMangement.vehicleId != null ? {
            id: this.userMangement.vehicleId,
            name: this.filteringDrop(this.userMangement.vehicleId, this.dropdownOptions2)
          } : null);
        } else if (vehicle.statusCode == 204) {
          if (Number(vehicle.data)) {
            this.tostr.error("Error", this.err.ErrorServ(vehicle.data));
          } else {
            let arr: any[] = vehicle.data;
            if (Array.isArray(arr)) {
              arr.forEach(element => {
                this.tostr.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
              });
            }
          }
        }


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
          return 0;
        });
        // console.log('code',this.userMangement.countryCode);
        
         this.userForm.get('countryCode').setValue({
          id: this.userMangement.countryCode,
          name: this.filteringDrop(this.userMangement.countryCode, this.dropdownOptions4)
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

      // if (customer.statusCode == 200) {
      //   this.dropdownOptions3 = customer.data.map(x => {
      //     let obj = {
      //       id: x.id,
      //       name: x.name
      //     };
      //     return obj;
      //   });
      // } else if (customer.statusCode == 204) {
      //   if (Number(customer.data)) {
      //     this.tostr.error("Error", this.err.ErrorServ(customer.data));
      //   } else {
      //     let arr: any[] = customer.data;
      //     if (Array.isArray(arr)) {
      //       arr.forEach(element => {
      //         this.tostr.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
      //       });
      //     }
      //   }
      // }
  }
    else
    {
      if (group.statusCode == 200) {
        this.dropdownOptions = group.data.map(x => {
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
      //state

      if (vehicle.statusCode == 200) {
          this.dropdownOptions2 = vehicle.data.map(x => {
            let obj = {
              id: x.id,
              name: x.type
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
          
        } else if (vehicle.statusCode == 204) {
          if (Number(vehicle.data)) {
            this.tostr.error("Error", this.err.ErrorServ(vehicle.data));
          } else {
            let arr: any[] = vehicle.data;
            if (Array.isArray(arr)) {
              arr.forEach(element => {
                this.tostr.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
              });
            }
          }
        }

      //subscription

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

      // if (customer.statusCode == 200) {
      //   this.dropdownOptions3 = customer.data.map(x => {
      //     let obj = {
      //       id: x.id,
      //       name: x.name
      //     };
      //     return obj;
      //   });
      // } else if (customer.statusCode == 204) {
      //   if (Number(customer.data)) {
      //     this.tostr.error("Error", this.err.ErrorServ(customer.data));
      //   } else {
      //     let arr: any[] = customer.data;
      //     if (Array.isArray(arr)) {
      //       arr.forEach(element => {
      //         this.tostr.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
      //       });
      //     }
      //   }
      // }
    }
    
  }

  formMethod() {
    this.userForm = new FormGroup({
      id: new FormControl("0"),
      name: new FormControl("", Validators.required),
      endUserGroupId: new FormControl(null, Validators.required),
      vehicleId: new FormControl(""),
      email: new FormControl("", Validators.email),
      countryCode: new FormControl(null, Validators.required),
      phone: new FormControl("", [Validators.required, Validators.pattern("[+]([0-9]*)"), Validators.minLength(11), Validators.maxLength(14)]),
      isActive: new FormControl(false),
    })
  }

  filteringDrop(id, arr) {
    if (arr.filter(x => x.id == id).length > 0) {
      let name = arr.filter(x => x.id == id)[0].name;
      return name;
    }
    return null;
  }

  edit(f) {
    this.isSubmitted = true;
    if (this.userForm.valid) {
      let edited = f;
      edited.endUserGroupId = this.userForm.get('endUserGroupId').value.id;
      
      edited.vehicleId = this.userForm.get('vehicleId').value==null || this.userForm.get('vehicleId').value.name==null?0:this.userForm.get('vehicleId').value.id;
      edited.countryCode=this.userForm.get('countryCode').value.id;
      this.editUsers = this._user.editUsers(edited).subscribe(
        (res: any) => {
          this.showLoader = true
          if (res.statusCode == 200) {
            this.tostr.success('Success', 'Edited');
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
        }, (err => {
          this.tostr.error(err, 'Error');
          this.showLoader = false
        }))
    }
  }

  add() {
    this.isSubmitted = true;
    
    if (this.userForm.valid) {
      let added = this.userForm.value;
      added.endUserGroupId = this.userForm.get('endUserGroupId').value.id;
      // added.customerId = this.userForm.get('customerId').value.id;
      added.vehicleId = this.userForm.get('vehicleId').value.id;
      added.countryCode=this.userForm.get('countryCode').value.id;
      added.id=0;
      this.addUsers = this._user.addUsers(added).subscribe(
        (res: any) => {
          this.showLoader = true
          if (res.statusCode == 200) {
            this.tostr.success('Success', 'Added');
            // this.userForm.reset();

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
        }, (err => {
          this.tostr.error(err, 'Error');
          this.showLoader = false
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
