import { CookieService } from 'ngx-cookie-service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { UrlsService } from './urls.service';
import { Injectable } from '@angular/core';
import { users } from '../models/users.model';
import { group } from '../models/group.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.cookieService.get('Token')
    })
  };
  constructor(private url: UrlsService, private http: HttpClient, private cookieService: CookieService) { }
  public getUrl = "/api/UserManagement/list";
  public addUrl = "/api/UserManagement/add";
  public importUrl = "/api/UserManagement/add/list"
  public editUrl = "/api/UserManagement/edit";
  public delUrl = "/api/UserManagement/delete/";
  public statusUrl = "/api/UserManagement/changeStatus/";

  getUsers(user: any): Observable<any> {
    return this.http.post(this.url.userUrl + this.getUrl, user, this.httpOptions);
  }
  editUsers(user: users) {
    return this.http.post(this.url.userUrl + this.editUrl, user, this.httpOptions);
  }
  addUsers(user: users) {
    return this.http.post(this.url.userUrl + this.addUrl, user, this.httpOptions);
  }
  importUsers(user: any) {
    return this.http.post(this.url.userUrl + this.importUrl, user, this.httpOptions);
  }
  delUsers(id: number) {
    return this.http.get(this.url.userUrl + this.delUrl + id, this.httpOptions);
  }
  changeStatus(id: number, status: boolean) {
    return this.http.get(this.url.userUrl + this.statusUrl + id + "/" + status, this.httpOptions);
  }
  public getGroupUrl = "/api/Group/list";
  public addGroupUrl = "/api/Group/add";
  public editGroupUrl = "/api/Group/edit";
  public delGroupUrl = "/api/Group/delete?groupId=";

  getGroups(): Observable<any> {
    return this.http.get(this.url.userUrl + this.getGroupUrl, this.httpOptions);
  }
  editGroups(group: group) {
    return this.http.post(this.url.userUrl + this.editGroupUrl, group, this.httpOptions);
  }
  addGroups(group: group) {
    return this.http.post(this.url.userUrl + this.addGroupUrl, group, this.httpOptions);
  }
  delGroups(id: number) {
    return this.http.post(this.url.userUrl + this.delGroupUrl + id, '', this.httpOptions);
  }
}