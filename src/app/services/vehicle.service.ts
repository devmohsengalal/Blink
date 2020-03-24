import { CookieService } from 'ngx-cookie-service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { UrlsService } from './urls.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization':'Bearer '+ this.cookieService.get('Token')
    })
  };
  constructor(private url:UrlsService, private http:HttpClient, private cookieService: CookieService) { }

  public getUrl="/api/Vehicle/List";
  public addUrl="/api/Vehicle/Add";
  public editUrl="/api/Vehicle/Edit";
  public removeUrl="/api/Vehicle/Remove";


  listVehicle(vehicle:any): Observable<any>{
    return this.http.post(this.url.vehicle+this.getUrl,vehicle ,this.httpOptions);
  }
  editVehicle(vehicle:any){
    return this.http.post(this.url.vehicle+this.editUrl,vehicle,this.httpOptions);
  }
  addVehicle(vehicle:any){
    return this.http.post(this.url.vehicle+this.addUrl,vehicle,this.httpOptions);
  }
  removeVehicle(vehicle:any){
    return this.http.post(this.url.vehicle+this.removeUrl,vehicle,this.httpOptions);
  }
}
