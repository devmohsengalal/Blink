

import { Component, OnInit, Input } from '@angular/core';
import { AcoountDetails } from 'src/app/models/accounDetails.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  isSubmitted=false;
  @Input() id = 0;
  password:string;
  constructor(public activeModal: NgbActiveModal,private _accountService:AccountService,private _toastr:ToastrService) { }
  ngOnInit() {
  }
  changePass(Form:NgForm){
    this.isSubmitted=true;
    if(Form.valid){
      this._accountService.changeAdminPassword({id:this.id,password:this.password}).subscribe(res=>{
        if(res.statusCode==200)
        {
          this._toastr.success("Password Changed Successfuly");
        }
        else
        this._toastr.error("Password Did Not Change Successfuly","Error");
      },err=>{
        this._toastr.error("Password Did Not Change Successfuly","Error")
      })
    }
  }
}
