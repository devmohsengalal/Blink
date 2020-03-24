import { CookieService } from 'ngx-cookie-service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { UrlsService } from './urls.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization':'Bearer '+ this.cookieService.get('Token')
    })
  };
  constructor(private url:UrlsService, private http:HttpClient, private cookieService: CookieService) { }

  public getUrl="/api/state/List";
  public addUrl="/api/state/Add";
  public editUrl="/api/state/Edit";


  getState(id=0): Observable<any>{
    return this.http.get(this.url.cloudUrl+this.getUrl+"?countryId="+id ,this.httpOptions);
  }
  editState(state:any){
    return this.http.post(this.url.cloudUrl+this.editUrl,state,this.httpOptions);
  }
  addState(state:any){
    return this.http.post(this.url.cloudUrl+this.addUrl,state,this.httpOptions);
  }
}
