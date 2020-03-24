import { group } from "./group.model";

export class users{
  public customerId:number;
  public name:string;
  public countryCode:string;
  public endUseGroupId:group;
  public phone?:string;
  public email?:string;
  public isActive?:boolean;
  public isVerified?:boolean;
  public vehicleId?:number;

}