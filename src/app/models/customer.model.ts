import { PermissionsModel } from "./Permissions.model";

export class customer{
    public customerType?:string
    public stateName?:string;
    public addedByUserName?:string;
    public addedDate?:string;
    public modifiedByUserName?:string;
    public modifiedDate?:string;
    public contactName: string;
    public contactPhone: string;
    public contactEmail: string;
    public title: string;
    public name: string;
    public email: string;
    public isActive: boolean;
    public phone: string;
    public address: string;
    public subscriptionTypeId: number;
    public subscriptionType:string;
    public stateId: number;
    public logo:string
    public type: number;
    public noOfEndUsers:number;
    public subscriptionFrom:string;
    public subscriptionTo:string;
    public moduleslst:PermissionsModel;
    public apiKey: any;
    public subscriptionlst:any;
    public addedByName?: string;
    public modifiedByName?:string
    public countryId?:number;
}