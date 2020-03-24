import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { sub } from '../models/sub.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { UrlsService } from './urls.service';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionTypeService {

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization':'Bearer '+ this.cookieService.get('Token')
    })
  };

  public getUrl="/api/SubscriptionType/List";
  public addUrl="/api/SubscriptionType/Add";
  public editUrl="/api/SubscriptionType/Edit";
  public delUrl="/api/SubscriptionType/Remove";

  constructor(private url:UrlsService, private http:HttpClient, private cookieService:CookieService) { }

  getSubscribtion(sub:any):Observable<any>{
    return this.http.post(this.url.cloudUrl+this.getUrl,sub ,this.httpOptions);
  }
  addSubscribtion(sub:sub){
    return this.http.post(this.url.cloudUrl+this.addUrl,sub ,this.httpOptions);
  }
  editSubscribtion(sub:sub){
    return this.http.post(this.url.cloudUrl+this.editUrl,sub ,this.httpOptions);
  }
  delSubscribtion(id:any){
    return this.http.post(this.url.cloudUrl+this.delUrl,id ,this.httpOptions);
  }

}
