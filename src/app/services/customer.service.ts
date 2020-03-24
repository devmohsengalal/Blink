import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UrlsService } from './urls.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  
  constructor(private http: HttpClient,private urls:UrlsService,
    private router:Router,private cookieService:CookieService) { }

  // getPermissionsTitle method
  ListCustomer(arr:any): Observable<any>
  {
    return this.http.post(this.urls.cloudUrl+"/api/Customer/List",arr,this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  getModules(id): Observable<any>
  {
    return this.http.get(this.urls.RoleUrl+"/api/Module/ListForCustomers?customerId="+id,this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }


  RenewSubscription(role:any):Observable<any>
  {
    return this.http.post(this.urls.cloudUrl+"/api/Customer/RenewSubscription",role,this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  addCustomer(role:any):Observable<any>
  {
    return this.http.post(this.urls.cloudUrl+"/api/Customer/Add",role,this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  editCustomer(role:any):Observable<any>
  {
    return this.http.post(this.urls.cloudUrl+"/api/Customer/Edit",role,this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  custDetails(id:any):Observable<any>
  {
    return this.http.post(this.urls.cloudUrl+"/api/Customer/Details?customerId="+id,'',this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteCust(id:any):Observable<any>
  {
    return this.http.post(this.urls.cloudUrl+"/api/Customer/Remove",id,this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  ActiveDeactive(role:any):Observable<any>
  {
    return this.http.post(this.urls.cloudUrl+"/api/Customer/ActiveDeactive",role,this.httpOptions).pipe(
      catchError(this.handleError)
    );
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
   httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization':'Bearer '+ this.cookieService.get('Token')
    })
  };
}
