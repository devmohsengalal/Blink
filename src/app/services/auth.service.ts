import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { UrlsService } from './urls.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map'
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,private urls:UrlsService,private router:Router,public cookieService:CookieService) { }
  public customerID=0;
  public customerName="";
  public isOwner=false;
  public accountID=0;
  public roleId=0;
  public roles=[];
  public isValid=false;
  public Token='';
  public timeZone=(-(new Date().getTimezoneOffset() / 60)).toString();
  public permitions=[];
  public Authorization;
  toTimeZone(date:string){
   if(!(date==null || date ==""))
    {
      const day=date!=null?date.split('T')[0]:null;
      const time=date!=null?date.split('T')[1]:null;
      const hours= time!=null?time.split(':')[0]:null;
      const min= time!=null?time.split(':')[1]:null;
      const sec= time!=null?time.split(':')[2]:null;
      const result=day+'T'+(Number(hours)+Number(this.timeZone))+':'+min+':'+sec;
      return result;
    }
    return date;
}
  hasModule(role:number)
  {
    
   if(this.permitions)
   {
    return this.permitions.findIndex(x=>x.id==role)!=-1;
   }
   return false
  }
  hasRole(role:number)
  {
    return this.roles.findIndex(x=>x.id==role)!=-1;
  }
  validate(): Observable<any>
  {
    this.Authorization=this.cookieService.get('Token');
    return this.http.get(this.urls.accountUrl+"/api/Token/Dashboard/Validate",{
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization':'Bearer '+ this.Authorization
      })
    })
  }
  login(body:any): Observable<any>
  {
    return this.http.post(this.urls.accountUrl+"/api/Login", body,httpOptions).pipe(
      catchError(this.handleError)
    );
  }
 
  logout()
  {
    this.cookieService.delete('Token');
    this.cookieService.delete('Username');
    this.router.navigate(['/login']);
    localStorage.removeItem('permitions');
    localStorage.removeItem('roles');
  
  }

  private handleError(error: HttpErrorResponse) {
    console.log('General error' , error);
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  };
}
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};
