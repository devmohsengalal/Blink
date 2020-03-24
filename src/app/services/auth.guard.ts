import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError} from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { RolesService } from './roles.service';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router,public cookieService : CookieService,private AuthService:AuthService,private RolesService:RolesService){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
     
      
      
       if(this.cookieService.get('Token'))
      {
        this.AuthService.permitions=JSON.parse(localStorage.getItem("permitions"));
        this.AuthService.roles=JSON.parse(localStorage.getItem("roles"));
        if(this.AuthService.isValid)
      {
     

        return true;
      }
      else
      {
        return  this.AuthService.validate().map((res:any)=>{
          if(res.statusCode==200)
          {
            this.AuthService.accountID=res.data.accountId;
            this.AuthService.customerID=res.data.customerId;
            this.AuthService.isOwner=res.data.isOwner;
            this.AuthService.customerName=res.data.customerName;
            this.AuthService.isValid=true;
            this.AuthService.roleId=res.data.roleId;
            return true;
          }
          else
          {
            this.AuthService.logout();
            return false;
          }
        },catchError((err) => {
          
          this.AuthService.logout();
          return of(false);
        }));
      }
      }
      else
      {
        this.AuthService.logout();
        return false
      }

  }
  
}
