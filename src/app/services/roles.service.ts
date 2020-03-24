import { Injectable } from '@angular/core';
import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UrlsService } from './urls.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  constructor(private http: HttpClient,private urls:UrlsService,
    private router:Router,private cookieService:CookieService) { 
      
    }
    getAllPermissionsTitle(): Observable<any>
  {
    return this.http.get(this.urls.RoleUrl+"/api/Module/ListForCustomers",this.httpOptions());
  }

// getPermissionsTitle method
  getPermissionsTitle(x): Observable<any>
  {
    return this.http.get(this.urls.RoleUrl+"/api/Module/ListForRole?customerId="+x,this.httpOptions());
  }

  // getPermissionsTitle method
  getPermissions(arr:any[]=[]): Observable<any>
  {
    return this.http.post(this.urls.RoleUrl+"/api/Module/ListPermissions",arr,this.httpOptions()).pipe(
      catchError(this.handleError)
    );
  }

  addRole(role:any):Observable<any>
  {
    return this.http.post(this.urls.RoleUrl+"/api/Role/Add",role,this.httpOptions()).pipe(
      catchError(this.handleError)
    );
  }
  editRole(role:any):Observable<any>
  {
    return this.http.post(this.urls.RoleUrl+"/api/Role/edit",role,this.httpOptions()).pipe(
      catchError(this.handleError)
    );
  }

  deleteRole(role:any):Observable<any>
  {
    return this.http.post(this.urls.RoleUrl+"/api/Role/Remove",role,this.httpOptions()).pipe(
      catchError(this.handleError)
    );
  }

  roleSearch(role:any):Observable<any>
  {
    return this.http.post(this.urls.RoleUrl+"/api/Role/list",role,this.httpOptions()).pipe(
      catchError(this.handleError)
    );
  }
  roleDetails(roleid:any):Observable<any>
  {
    return this.http.get(this.urls.RoleUrl+"/api/Role/Details?roleId="+roleid,this.httpOptions())
  }

  /** GLOBAL ERROR HANDLING */
  private handleError(error: HttpErrorResponse) {
    console.log('General error' , error);
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
   httpOptions() {
    return {headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization':'Bearer '+ this.cookieService.get('Token')
    })
  }};
}

