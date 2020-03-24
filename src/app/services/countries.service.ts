import { CookieService } from 'ngx-cookie-service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { UrlsService } from './urls.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization':'Bearer '+ this.cookieService.get('Token')
    })
  };
  constructor(private url:UrlsService, private http:HttpClient, private cookieService: CookieService) { }

  public getUrl="/api/Country/List";
  public addUrl="/api/Country/Add";
  public editUrl="/api/Country/Edit";


  getCountries():Observable<any>{
    return this.http.get(this.url.cloudUrl+this.getUrl ,this.httpOptions);
  }
  editCountries(country:any){
    return this.http.post(this.url.cloudUrl+this.editUrl,country,this.httpOptions);
  }
  addCountries(country:any){
    return this.http.post(this.url.cloudUrl+this.addUrl,country,this.httpOptions);
  }
}
