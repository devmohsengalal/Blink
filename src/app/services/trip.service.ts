import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { UrlsService } from './urls.service';
import { accidentReports } from '../models/accidentReports.model';


@Injectable({
  providedIn: 'root'
})
export class TripService {

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization':'Bearer '+ this.cookieService.get('Token')
    })
  };

  public listUrl="/api/TripReports/list";
  public getUrl="/api/TripReports/get?id=";
  
   constructor(private url:UrlsService, private http:HttpClient, private cookieService:CookieService) { }

   listTripReports(trip:any){
     return this.http.post(this.url.tripUrl+this.listUrl,trip ,this.httpOptions);
   }
   getTripDetails(id:number){
     return this.http.post(this.url.tripUrl+this.getUrl+ id ,'',this.httpOptions);
   }
 
}
