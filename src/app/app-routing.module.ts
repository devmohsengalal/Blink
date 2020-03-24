import { CustomerDetailsComponent } from './components/customer/customer-details/customer-details.component';
import { CustomerComponent } from './components/customer/customer/customer.component';
import { AccountFormComponent } from './components/Accounts/account-form/account-form.component';
import { AccountComponent } from './components/Accounts/account/account.component';
import { UserManagementComponent } from './components/ُEndUser/UserManagement/user-management/user-management.component';
import { AccidentDetailsComponent } from './components/Accident/accident-details/accident-details.component';
import { AccidentReportsComponent } from './components/Accident/accident-reports/accident-reports.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

// Components
import { ContentComponent } from './layouts/content/content.component';
// Routes

import { LoginWithImageComponent } from './pages/login-with-image/login-with-image.component';
import { TestComponent } from './components/test/test.component';
import { SubTypeComponent } from './components/sub-type/sub-type.component';
import { IncidentReportsComponent } from './components/Incident/incident-reports/incident-reports.component';
import { TripReportsComponent } from './components/trip/trip-reports/trip-reports.component';
import { TripDetailsComponent } from './components/trip/trip-details/trip-details.component';
import { IncidentDetailsComponent } from './components/Incident/incident-details/incident-details.component';
import { GroupComponent } from './components/ُEndUser/group/group.component';
import { RolesFormComponent } from './components/roles/roles-form/roles-form.component';
import { RoleSearchComponent } from './components/roles/role-search/role-search.component';
import { CountriesComponent } from './components/countries/countries.component';
import { StateComponent } from './components/state/state.component';
import { AccountDetailsComponent } from './components/Accounts/account-details/account-details.component';
import { VehicleComponent } from './components/vehicle/vehicle.component';
import { VehicleForComponent } from './components/vehicle/vehicle-for/vehicle-for.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { UserFormComponent } from './components/ُEndUser/UserManagement/user-form/user-form.component';
import { CustomerFormComponent } from './components/customer/customer-form/customer-form.component';
import { AuthGuard } from './services/auth.guard';
import { RenewSubComponent } from './components/customer/renew-sub/renew-sub.component';
import { ImportUserSheetComponent } from './components/ُEndUser/UserManagement/import-user-sheet/import-user-sheet.component';
import { NotificationComponent } from './components/notification/notification.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path:'login',
    component: LoginWithImageComponent,
    data : {title : 'login'}
  },
  { 
  	path: 'dashboard', 
    component: ContentComponent,
    children:[
      {
        path:'default',
        component: TestComponent,
        canActivate: [AuthGuard],
        data : {title : 'dashboard'}
      },
      {
        path:'SubscriptionType',
        canActivate: [AuthGuard],
        component: SubTypeComponent
      },
      {
        path:'Notifications',
        canActivate: [AuthGuard],
        component: NotificationComponent
      },
      {
        path:'AccidentReports',
        canActivate: [AuthGuard],
        component: AccidentReportsComponent
      },
      {
        path:'IncidentReports',
        canActivate: [AuthGuard],
        component: IncidentReportsComponent
      },
      
      {
        path:'TripReports',
        canActivate: [AuthGuard],
        component: TripReportsComponent,
      },
      {
        path:'UserManagement',
        canActivate: [AuthGuard],
        component: UserManagementComponent,
      }, 
        {
        path:'UserForm',
        canActivate: [AuthGuard],
        component: UserFormComponent,
      },
      {
        path:'UserFormAdd',
        canActivate: [AuthGuard],
        component: UserFormComponent,
      },
      {
        path:'Group',
        canActivate: [AuthGuard],
        component: GroupComponent,
      },
      {
        path:'RolesFormAdd',
        canActivate: [AuthGuard],
        component: RolesFormComponent,
      },
      {
        path:'RolesForm',
        canActivate: [AuthGuard],
        component: RolesFormComponent,
      },
      {
        path:'RolesList',
        canActivate: [AuthGuard],
        component:RoleSearchComponent
      },
      {
        path:'Countries',
        canActivate: [AuthGuard],
        component:CountriesComponent
      },
      {
        path:'Accounts',
        canActivate: [AuthGuard],
        component:AccountComponent
      },
      {
        path:'AccountFormAdd',
        canActivate: [AuthGuard],
        component: AccountFormComponent,
      },
      {
        path:'AccountForm',
        canActivate: [AuthGuard],
        component: AccountFormComponent,
      },
      {
        path:'State',
        canActivate: [AuthGuard],
        component:StateComponent
      },
      {
        path:'vehicle',
        canActivate: [AuthGuard],
        component: VehicleComponent,
      },
      {
        path:'vehicle-form',
        canActivate: [AuthGuard],
        component: VehicleForComponent,
      }, 
      {
        path:'vehicle-formAdd',
        canActivate: [AuthGuard],
        component: VehicleForComponent,
      }, 
      {
        path:'Customer',
        canActivate: [AuthGuard],
        component: CustomerComponent,
      }, 
      {
        path:'CustomerFormAdd',
        canActivate: [AuthGuard],
        component: CustomerFormComponent,
      },
      {
        path:'CustomerForm',
        canActivate: [AuthGuard],
        component: CustomerFormComponent,
      },
      {
        path:'RenewSubscription',
        canActivate: [AuthGuard],
        component: RenewSubComponent,
      },
      {
        path:'import-user-sheet',
        canActivate: [AuthGuard],
        component: ImportUserSheetComponent
      }

    ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules, anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})

export class AppRoutingModule {
}