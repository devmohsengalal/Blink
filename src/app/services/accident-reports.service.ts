
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UrlsService } from './urls.service';
import { Injectable } from '@angular/core';
import { accidentReports } from '../models/accidentReports.model';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AccidentReportsService {
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization':'Bearer '+ this.cookieService.get('Token')
    })
  };
 public listUrl="/api/AccidentReports/list";
 public getUrl="/api/AccidentReports/get?id=";
 public getNoti="/api/NotificationsManagement/list";
 public listIncUrl="/api/IncidentsReports/list";
 public getIncUrl="/api/IncidentsReports/get?id=";

  constructor(private url:UrlsService, private http:HttpClient,private cookieService:CookieService) { }
  listAccidentReports(acc:accidentReports): Observable<any>{
    return this.http.post(this.url.accidentUrl+this.listUrl,acc ,this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  listNotfications(acc:accidentReports): Observable<any>{
    return this.http.post(this.url.notification+this.getNoti,acc ,this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  getAccidentDetails(id:number): Observable<any>{
    return this.http.post(this.url.accidentUrl+this.getUrl+id,'' ,this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  listIncidentReports(inc:any): Observable<any>{
    return this.http.post(this.url.incidentUrl+this.listIncUrl,inc ,this.httpOptions);
  }
  getIncidentDetails(id:number): Observable<any>{
    return this.http.post(this.url.incidentUrl+this.getIncUrl+id,'' ,this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
private handleError(error: HttpErrorResponse) {
  console.log('General error' , error);
  if (error.error instanceof ErrorEvent) {
    console.error('An error occurred:', error.error.message);
  } else {
 
  }
  return throwError(
    'Something bad happened; please try again later.');
};

}
