
import { customer } from "./customer.model";
import { VehicleAddEditDto } from "./vehicleAdd-Edit.model";

export class userAddEdit{
  public customerId?:number;
  public name?:string;
  public countryCode?:string;
  public endUserGroupId?:any;
  public phone?:string;
  public photo?:string;
  public email?:string;
  public isActive?:boolean;
  public vehicleId?:number;
  public customerName?:string
  public customer?:customer;
  public vehicleDto?:VehicleAddEditDto;
}