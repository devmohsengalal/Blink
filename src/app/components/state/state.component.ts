import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatatableComponent } from "@swimlane/ngx-datatable/release";
import { StateService } from 'src/app/services/state.service';
import { StateDto } from 'src/app/models/state.model';
import { Subscription } from 'rxjs';
import { CountriesService } from 'src/app/services/countries.service';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorServService } from 'src/app/services/error-serv.service';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent implements OnInit, OnDestroy {
  getCountries: Subscription;
  getState: Subscription;
  addState: Subscription;
  editState: Subscription;
  isSubmitted = false
  isHidden: boolean = false;
  public subscription;
  public StateList: StateDto = new StateDto();
  public StateForm: FormGroup;
  public showLoader: boolean
  countries: any[] = [];;
  constructor(
    private stateService: StateService,
    public countryService: CountriesService, private err: ErrorServService, public AuthService: AuthService, private tostr: ToastrService) {

    this.config = {
      displayKey: "name", //if objects array passed which key to be displayed defaults to description
      search: true, //true/false for the search functionlity defaults to false,
      height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder: 'Select Country Name', // text to be displayed when no item is selected defaults to Select,
      customComparator: () => { }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
      limitTo: this.dropdownOptions.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
      moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
      noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
      searchPlaceholder: 'Search', // label thats displayed in search input,
      searchOnKey: 'name' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    };
  }
  config;
  dropdownOptions: any[] = [];
  dropdownTemp = [];

  selectionChanged(e) {
    if (e.value) {
      this.StateForm.get('countryId').setValue(e.value.id);
    }
  }
  Country() {
    this.getCountries = this.countryService.getCountries().subscribe(
      (res: any) => {
        if (res.statusCode == 200) {
          this.dropdownTemp = res.data.map(x => {
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
          this.dropdownOptions = this.dropdownTemp;
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
  ngOnInit() {
    this.showLoader = true
    this.Country();
    this.showLoader = false
    this.StateForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      countryId: new FormControl(null, Validators.required),
      id: new FormControl("0"),
    })
    this.listStates();
  }

  listStates() {
    this.showLoader = true
    this.getState = this.stateService.getState().subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.rows = res.data;
        this.temp = res.data;
      }
      this.showLoader = false
    }, (err) => { this.showLoader = false })
  }
  onSubmit() {
    this.onAdd()
  }
  onAdd() {
    this.isSubmitted = true;
    if (this.StateForm.valid) {
      let added = {
        countryId: this.StateForm.get('countryId').value,
        name: this.StateForm.get('name').value
      }
      this.addState = this.stateService.addState(added).subscribe((res: any) => {
        this.showLoader = true
        if (res.statusCode == 200) {
          this.tostr.success('Success', 'Added')
          this.listStates();
          this.StateForm.reset()
          this.isSubmitted = false
          this.isHidden = false;
        } else if (res.statusCode == 204) {
          if (Number(res.data)) {
            this.tostr.error("Error", this.err.ErrorServ(res.data));
          } else {
            let arr: any[] = res.data;
            arr.forEach(element => {
              this.tostr.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
            });
          }
        }

        this.showLoader = false
      }, (err => {
        this.tostr.error(err, 'Error');
        this.showLoader = false
      }))
    }

  }

  onEdit(row) {
    window.scroll(0, 0);
    this.isHidden = true;
    this.Country();
    this.StateForm.patchValue({
      id: row.id,
      name: row.name,
      countryId: { id: row.countryId, name: row.countryName }
    });
    this.countryId = row.countryId;
  }
  countryId;


  edit() {
    this.isSubmitted = true
    if (this.StateForm.valid) {
      let edit = {
        id: this.StateForm.get('id').value,
        name: this.StateForm.get('name').value,
        countryId: this.countryId
      }
      this.editState = this.stateService.editState(edit).subscribe((res: any) => {
        this.showLoader = true

        if (res.statusCode == 200) {
          this.tostr.success('Success', 'Edited');
          this.listStates();
          this.isHidden = false;
          this.isSubmitted = false
          this.StateForm.reset();
        } else if (res.statusCode == 204) {
          if (Number(res.data)) {
            this.tostr.error("Error", this.err.ErrorServ(res.data));
          } else {
            let arr: any[] = res.data;
            arr.forEach(element => {
              this.tostr.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
            });
          }
        }
        this.showLoader = false
      }, (err => {
        this.tostr.error(err, 'Error');
        this.showLoader = false
      }))
    }

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
  updateFilter2(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function (d) {
      return d.countryName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 1;
  }
  ngOnDestroy(): void {

    this.getCountries ? this.getCountries.unsubscribe() : null;
    this.getState ? this.getState.unsubscribe() : null;
    this.addState ? this.addState.unsubscribe() : null;
    this.editState ? this.editState.unsubscribe() : null;
  }
}
