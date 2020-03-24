import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorServService {

  constructor() { }
  arr = [
    { id: 0, title: "Server Error" },
    { id: 1, title: "Not Found" },
    { id: 2, title: "Redundunt Phone" },
    { id: 3, title: "Redundunt Username" },
    { id: 4, title: "Access Denied" },
    { id: 5, title: "Validate Data" },
    { id: 6, title: "Dublicated Name" },
    { id: 7, title: "Item Is Deleted" },
    { id: 8, title: "Member Not Found" },
    { id: 9, title: "User Not Found" },
    { id: 10, title: "Data Not Saved" },
    { id: 11, title: "Invalid Admin" },
    { id: 12, title: "Invalid Vehicle" },
    { id: 13, title: "Invalid Customer" },
    { id: 14, title: "Invalid Group" },
    { id: 15, title: "Reached Max Length Of EndUser" },
    { id: 16, title: "User Is Deactive " },
    { id: 17, title: "Member Is Added To User" },
    { id: 18, title: "Subscription Is Expired" },
    { id: 19, title: "Invalid Incident Type" },
    { id: 20, title: "Invalid Counrty" },
    { id: 21, title: "Invalid State" },
    { id: 22, title: "Invalid SubscriptionType" }
  ]
  ErrorServ(data) {
    if (this.arr.filter(x => data == x.id).length > 0) {
      let titles = this.arr.filter(x => x.id == data)[0].title
      return titles;
    }
  }
}
