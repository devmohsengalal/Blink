import { Accounts } from './../models/account.model';
import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { UrlsService } from './urls.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.cookieService.get('Token')
    })
  };
  constructor(private cookieService: CookieService, private url: UrlsService, private http: HttpClient) { }

  public getUrl = "/api/Account/Details?accountId=";
  public listUrl = "/api/Account/List";
  public addUrl = "/api/Account/Add";
  public editUrl = "/api/Account/Edit";
  public delUrl = "/api/Account/Remove";
  public ChangeAdminPasswordUrl = "/api/Account/ChangeAdminPassword"
  getAccount(id: number): Observable<any> {
    return this.http.get(this.url.accountUrl + this.getUrl + id, this.httpOptions);
  }
  editAccount(acc: Accounts) {
    return this.http.post(this.url.accountUrl + this.editUrl, acc, this.httpOptions);
  }
  addAccount(acc: Accounts) {
    return this.http.post(this.url.accountUrl + this.addUrl, acc, this.httpOptions);
  }
  delAccount(id: any) {
    return this.http.post(this.url.accountUrl + this.delUrl, id, this.httpOptions);
  }
  listAccounts(acc: any) {
    return this.http.post(this.url.accountUrl + this.listUrl, acc, this.httpOptions);
  }
  changeAdminPassword(obj: {id:number,password:string}) {
    return this.http.post<{statusCode:number,data:any}>(this.url.accountUrl + this.ChangeAdminPasswordUrl, obj, this.httpOptions);
  }
}