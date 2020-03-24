import { PermissionsModel } from 'src/app/models/Permissions.model';
export class AcoountDetails{
    public roleName: string;
    public fullName: string;
    public userName: string;
    public isActive: boolean;
    public email: string;
    public phoneNumber: string;
    public isCustomerAdmin: boolean;
    public customerName: string;
    public photo:string
    public stateName: string;
    public addedDate: string;
    public modifiedByName: string;
    public addedByName:string;
    public modifiedDate: string;
    public premission: PermissionsModel
}