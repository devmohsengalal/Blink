import { Injectable } from '@angular/core';
import { OnInit } from '@angular/core';
import { AppConfigService } from '../../AppConfigService';

@Injectable({
  providedIn: 'root'
})
export class UrlsService {

  //constructor() { }
  public accountUrl = this.appConfigService.apiAccountUrl;//="http://account.blinkapp.net";
  public cloudUrl = this.appConfigService.apiCloudUrl;//="http://cloud.blinkapp.net";
  public accidentUrl = this.appConfigService.apiAccidentUrl;//="http://accident.blinkapp.net";
  public incidentUrl = this.appConfigService.apiIncidentUrl;//="http://incident.blinkapp.net";
  public tripUrl = this.appConfigService.apiTripUrl;//="http://trip.blinkapp.net";
  public userUrl = this.appConfigService.apiUserUrl;//="http://enduser.blinkapp.net";
  public RoleUrl = this.appConfigService.apiRoleUrl;//="http://role.blinkapp.net";
  public vehicle = this.appConfigService.apiVehicleUrl;//="http://vehicle.blinkapp.net";
  public notification = this.appConfigService.apiNotificationUrl;//="http://notification.blinkapp.net"

  apiBaseUrl: string;

  constructor(private appConfigService: AppConfigService) {}

}
