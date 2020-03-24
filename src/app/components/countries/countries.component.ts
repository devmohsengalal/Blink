import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CountriesService } from 'src/app/services/countries.service';
import { CountriesDto } from 'src/app/models/countries.model';
import { ToastrService } from 'ngx-toastr';
import { DatatableComponent } from "@swimlane/ngx-datatable/release";
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { ErrorServService } from 'src/app/services/error-serv.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit, OnDestroy {
  getCountries: Subscription;
  addCountries: Subscription;
  editCountries: Subscription;
  isSubmitted = false
  isHidden: boolean = false;
  public subscription;
  public CountryList: CountriesDto = new CountriesDto();
  public CountryForm: FormGroup;
  public showLoader: boolean;
  constructor(private countryService: CountriesService, private err: ErrorServService, private tostr: ToastrService,
    public AuthService: AuthService) { }

  ngOnInit() {
    this.CountryForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      code: new FormControl(null, Validators.required),
      emergencyNumber: new FormControl(null, Validators.required),
      id: new FormControl("0"),
    })
    this.listCountries();
  }

  listCountries() {
    this.showLoader = true
    this.getCountries = this.countryService.getCountries().subscribe((res: any) => {

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
    this.isSubmitted = true
    if (this.CountryForm.valid) {
      this.addCountries = this.countryService.addCountries(this.CountryForm.value).subscribe((res: any) => {
        this.showLoader = true
        if (res.statusCode == 200) {
          this.tostr.success('Success', 'Added')
          this.listCountries();
          this.CountryForm.reset()
          this.isHidden = false;
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
      }, (err => {
        this.tostr.error(err, 'Error');
        this.showLoader = false
      }))
    }
  }

  onEdit(row) {
    window.scroll(0, 0);
    this.isHidden = true;
    this.CountryForm.setValue({
      'name': row.name,
      'emergencyNumber': row.emergencyNumber,
      'code': row.code,
      'id': row.id
    })
  }

  edit() {
    this.isSubmitted = true
    if (this.CountryForm.valid) {
      this.editCountries = this.countryService.editCountries(this.CountryForm.value).subscribe((res: any) => {
        this.showLoader = true
        if (res.statusCode == 200) {
          this.tostr.success('Success', 'Edited');
          this.listCountries();
          this.isHidden = false;
          this.CountryForm.reset();
          this.showLoader = false
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

    this.getCountries ? this.getCountries.unsubscribe() : null;
    this.addCountries ? this.addCountries.unsubscribe() : null;
    this.editCountries ? this.editCountries.unsubscribe() : null;
  }
}
