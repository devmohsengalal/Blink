
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from "./shared/shared.module";
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http'; 
import {NgSelectizeModule} from 'ng-selectize';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SelectDropDownModule } from 'ngx-select-dropdown'
import { AppConfigService } from '../AppConfigService'
import { APP_INITIALIZER } from '@angular/core';
import { AgmCoreModule } from '@agm/core';


import { AppComponent } from './app.component';
import { ContentComponent } from './layouts/content/content.component';
import { LoginWithImageComponent } from './pages/login-with-image/login-with-image.component';
import { TestComponent } from './components/test/test.component';
import { SubTypeComponent } from './components/sub-type/sub-type.component';
import { AccidentReportsComponent } from './components/Accident/accident-reports/accident-reports.component';
import { IncidentReportsComponent } from './components/Incident/incident-reports/incident-reports.component';
import { TripReportsComponent } from './components/trip/trip-reports/trip-reports.component';
import { TripDetailsComponent } from './components/trip/trip-details/trip-details.component';
import { AccidentDetailsComponent } from './components/Accident/accident-details/accident-details.component';
import { IncidentDetailsComponent } from './components/Incident/incident-details/incident-details.component';
import { GroupComponent } from './components/ُEndUser/group/group.component';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { NgProgressModule } from 'ngx-progressbar';
import { RolesFormComponent } from './components/roles/roles-form/roles-form.component';
import { NgbTabsetModule, NgbModal, NgbModalConfig, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { UserManagementComponent } from './components/ُEndUser/UserManagement/user-management/user-management.component';
import { RoleSearchComponent } from './components/roles/role-search/role-search.component';
import { CountriesComponent } from './components/countries/countries.component';
import { DatePipe } from '@angular/common';
import { AccountComponent } from './components/Accounts/account/account.component';
import { AccountDetailsComponent } from './components/Accounts/account-details/account-details.component';
import { NgxModalComponent } from './shared/ngx-modal/ngx-modal.component';
import { StateComponent } from './components/state/state.component';
import { AccountFormComponent } from './components/Accounts/account-form/account-form.component';
import { VehicleComponent } from './components/vehicle/vehicle.component';
import { VehicleForComponent } from './components/vehicle/vehicle-for/vehicle-for.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { UserFormComponent } from './components/ُEndUser/UserManagement/user-form/user-form.component';
import { CustomerComponent } from './components/customer/customer/customer.component';
import { CustomerFormComponent } from './components/customer/customer-form/customer-form.component';
import { CustomerDetailsComponent } from './components/customer/customer-details/customer-details.component';
import { RenewSubComponent } from './components/customer/renew-sub/renew-sub.component';
import { CookieService } from 'ngx-cookie-service';
import {SwappingSquaresSpinnerModule, SelfBuildingSquareSpinnerModule} from "angular-epic-spinners";
import { CustSearchModalComponent } from './shared/cust-search-modal/cust-search-modal.component';
import { RoleDetailsComponent } from './components/roles/role-details/role-details.component';
import { ImportUserSheetComponent } from './components/ُEndUser/UserManagement/import-user-sheet/import-user-sheet.component';
import { EndUserDetailsComponent } from './components/ُEndUser/end-user-details/end-user-details.component';
import { SubListComponent } from './components/customer/customer-details/sub-list/sub-list.component';
import { VehicleDetailsComponent } from './components/vehicle/vehicle-details/vehicle-details.component';
import { RenewSubResultComponent } from './components/customer/renew-sub/renew-sub-result/renew-sub-result.component';
import { NotificationComponent } from './components/notification/notification.component';
import { PhoneNumDirective } from './phone-num.directive';
import { ChangePasswordComponent } from './components/Accounts/change-password/change-password.component';
@NgModule({
  declarations: [
    AppComponent,
    ContentComponent,
    LoginWithImageComponent,
    TestComponent,
    SubTypeComponent,
    AccidentReportsComponent,
    IncidentReportsComponent,
    TripReportsComponent,
    TripDetailsComponent,
    AccidentDetailsComponent,
    IncidentDetailsComponent,
    GroupComponent,
    RolesFormComponent,
    UserManagementComponent,
    RoleSearchComponent,
    CountriesComponent,
    AccountComponent,
    StateComponent,
    AccountDetailsComponent,
    AccountFormComponent,
    VehicleComponent,
    VehicleForComponent,
    PageNotFoundComponent,
    UserFormComponent,
    CustomerComponent,
    CustomerFormComponent,
    CustomerDetailsComponent,
    RenewSubComponent,
    CustSearchModalComponent,
    RoleDetailsComponent,
    ImportUserSheetComponent,
    EndUserDetailsComponent,
    SubListComponent,
    VehicleDetailsComponent,
    RenewSubResultComponent,
    NotificationComponent,
    PhoneNumDirective,
    ChangePasswordComponent,
  ],
  imports: [
    SwappingSquaresSpinnerModule,
    SelfBuildingSquareSpinnerModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgSelectizeModule,
    DataTablesModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    NgProgressModule,
    NgbTabsetModule,
    NgxDatatableModule,
    NgbModule,
    SelectDropDownModule,
    NgbPaginationModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDEN6pAJzW2cNyk4-zpEscPa3PG_hDJ_Uw'
    })
  ],
  entryComponents: [NgxModalComponent,CustSearchModalComponent,
    AccidentDetailsComponent,AccountDetailsComponent,
    IncidentDetailsComponent,TripDetailsComponent,
    CustomerDetailsComponent,RoleDetailsComponent,
    EndUserDetailsComponent,SubListComponent, 
    VehicleDetailsComponent,RenewSubResultComponent,ChangePasswordComponent],
  providers: [{
    provide: APP_INITIALIZER,
    multi: true,
    deps: [AppConfigService],
    useFactory: (appConfigService: AppConfigService) => {
      return () => {
        //Make sure to return a promise!
        return appConfigService.loadAppConfig();
      };
    }
  },ToastrService,DatePipe,NgbModalConfig, NgbModal,DatePipe,CookieService],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
