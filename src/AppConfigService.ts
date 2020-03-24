import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';
//in place where you wanted to use `HttpClient`
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })
  export class AppConfigService {
  
    private appConfig: any;
  
    constructor(private http: HttpClient) { }
  
    loadAppConfig() {
      return this.http.get('/assets/config.json')
        .toPromise()
        .then(data => {
          this.appConfig = data;
        });
    }
  
    get apiAccountUrl() {
  
      if (!this.appConfig) {
        throw Error('Config file not loaded!');
      }
  
      return this.appConfig.accountUrl;
    }
    get apiCloudUrl() {
  
      if (!this.appConfig) {
        throw Error('Config file not loaded!');
      }
  
      return this.appConfig.cloudUrl;
    }
    get apiAccidentUrl() {
  
      if (!this.appConfig) {
        throw Error('Config file not loaded!');
      }
  
      return this.appConfig.accidentUrl;
    }
    get apiIncidentUrl() {
  
      if (!this.appConfig) {
        throw Error('Config file not loaded!');
      }
  
      return this.appConfig.incidentUrl;
    }
    get apiTripUrl() {
  
      if (!this.appConfig) {
        throw Error('Config file not loaded!');
      }
  
      return this.appConfig.tripUrl;
    }
    get apiUserUrl() {
  
      if (!this.appConfig) {
        throw Error('Config file not loaded!');
      }
  
      return this.appConfig.userUrl;
    }
    get apiRoleUrl() {
  
      if (!this.appConfig) {
        throw Error('Config file not loaded!');
      }
  
      return this.appConfig.RoleUrl;
    }
    get apiVehicleUrl() {
  
      if (!this.appConfig) {
        throw Error('Config file not loaded!');
      }
  
      return this.appConfig.vehicleUrl;
    }
    get apiNotificationUrl() {
  
      if (!this.appConfig) {
        throw Error('Config file not loaded!');
      }
  
      return this.appConfig.notificationUrl;
    }
  }