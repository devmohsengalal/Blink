import { Detailscelltower } from "./details.celltower.model";
import { DetailsEnduser } from "./details.enduser.model";

export class Details{
   public endUser:DetailsEnduser;
    public endUserId;
    public latitude;
    public longitude;
    public severity;
    public reportedBy;
    public date;
    public startLat;
    public startLong;
    public isEnded;
    public endLat;
    public endLong;
    public startTime;
    public endTime;
    public cellTowerInfo:Detailscelltower;
    public incidentType:{
        name:string
    }
}