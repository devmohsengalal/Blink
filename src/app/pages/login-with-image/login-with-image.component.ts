import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgProgress } from 'ngx-progressbar';
import { RolesService } from 'src/app/services/roles.service';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-login-with-image',
  templateUrl: './login-with-image.component.html',
  styleUrls: ['./login-with-image.component.scss']
})
export class LoginWithImageComponent implements OnInit,OnDestroy {
  loginsup:Subscription;
  validate:Subscription;
  getPermissionsTitle:Subscription;
  roleSearch:Subscription;
  roleDetails:Subscription;
  constructor(private router:Router,private auth:AuthService,
    private toast:ToastrService,public ngProgress: NgProgress,private cookieService:CookieService,public RolesService:RolesService) { 
      if(this.cookieService.get('Token') && localStorage.getItem('roles'))
      {
        this.router.navigateByUrl("/dashboard/default");
      }
      else
      {
        this.cookieService.delete('Token');
      }
    }


  submitted = false;
  LoginForm: FormGroup;

  ngOnInit() {
    this.LoginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required,Validators.minLength(4),Validators.maxLength(8)]),
      rememberMe:new FormControl(true)
   });
  //  this.loginTest();
  }
  
  get f() { return this.LoginForm.controls; }
  // loginTest()
  // {
  //   let login={
  //     username:'admin',
  //     password:'123456'
  //   }
  //   this.loginsup=this.auth.login(login).subscribe((loginRes:any)=>{
        
  //     if(loginRes.statusCode==200)
  //     {
  //         this.cookieService.set('Token',loginRes.data)
  //         this.cookieService.set('Username',login.username)
  //           this.auth.Token= loginRes.data;
            
  //               this.validate=this.auth.validate().subscribe((res:any)=>{
  //               if(res.statusCode==200)
  //               {
                  
  //                 this.auth.accountID=res.data.accountId;
  //                 this.auth.customerID=res.data.customerId;
  //                 this.auth.isOwner=res.data.isOwner;
  //                 this.auth.roleId=res.data.roleId;
  //                 this.auth.isValid=true;
  //                 this.getPermissionsTitle=this.RolesService.getPermissionsTitle(this.auth.customerID).subscribe((titleRes:any)=>{
  //                   if(titleRes.statusCode==200)
  //                   {
                      
  //                     localStorage.setItem("permitions", JSON.stringify(titleRes.data));
  //                     this.auth.permitions=JSON.parse(localStorage.getItem("permitions"));
                      
  //                           this.roleDetails=this.RolesService.roleDetails(this.auth.roleId).subscribe((res:any)=>{
  //                             if(res.statusCode==200)
  //                             {
  //                               this.ngProgress.done();
                                
  //                               localStorage.setItem("roles", JSON.stringify(res.data.permissionlst));
  //                               this.auth.roles=JSON.parse(localStorage.getItem("roles"));
                               
  //                               this.router.navigateByUrl("/dashboard/default");
                                
  //                             }
  //                             else
  //                             {
  //                               this.auth.logout();
  //                             }
  //                           });
  //                   }
  //                 });
  //               }
  //               else
  //               {
  //                 this.auth.logout();
  //               }
  //             });
                       
  //     }
  //     else
  //     {
  //       this.toast.error('Username or password doesn\'t exist','Not Valid');
  //       this.LoginForm.get('username').reset();
  //       this.LoginForm.get('password').reset();
  //       this.submitted=false;
  //     }
       
  //    });
  // }
  onSubmit(){
    this.submitted=true;
    if(this.LoginForm.valid)
    {
      this.ngProgress.start();
      this.loginsup=this.auth.login(this.LoginForm.value).subscribe((loginRes:any)=>{
        
        if(loginRes.statusCode==200)
        {
            this.cookieService.set('Token',loginRes.data)
            this.cookieService.set('Username',this.LoginForm.controls.username.value)
              this.auth.Token= loginRes.data;
              
                  this.validate=this.auth.validate().subscribe((res:any)=>{
                  if(res.statusCode==200)
                  {
                    
                    this.auth.accountID=res.data.accountId;
                    this.auth.customerID=res.data.customerId;
                    this.auth.isOwner=res.data.isOwner;
                    this.auth.roleId=res.data.roleId;
                    this.auth.customerName=res.data.customerName;
                    this.auth.isValid=true;
                    this.getPermissionsTitle=this.RolesService.getPermissionsTitle(this.auth.customerID).subscribe((titleRes:any)=>{
                      if(titleRes.statusCode==200)
                      {
                        
                        localStorage.setItem("permitions", JSON.stringify(titleRes.data));
                        this.auth.permitions=JSON.parse(localStorage.getItem("permitions"));
                        
                              this.roleDetails=this.RolesService.roleDetails(this.auth.roleId).subscribe((res:any)=>{
                                if(res.statusCode==200)
                                {
                                  this.ngProgress.done();
                                  
                                  localStorage.setItem("roles", JSON.stringify(res.data.permissionlst));
                                  this.auth.roles=JSON.parse(localStorage.getItem("roles"));
                                 
                                  this.router.navigateByUrl("/dashboard/default");
                                  
                                }
                                else
                                {
                                  this.auth.logout();
                                }
                              });
                      }
                    });
                  }
                  else
                  {
                    this.auth.logout();
                  }
                });
                         
        }
        else
        {
          this.toast.error('Username or password doesn\'t exist','Not Valid');
          this.LoginForm.get('username').reset();
          this.LoginForm.get('password').reset();
          this.submitted=false;
        }
         
       });
    }

  }
  ngOnDestroy(): void {

    this.loginsup?this.loginsup.unsubscribe():null;
    this.validate?this.validate.unsubscribe():null;
    this.getPermissionsTitle?this.getPermissionsTitle.unsubscribe():null;
    this.roleSearch?this.roleSearch.unsubscribe():null;
    this.roleDetails?this.roleDetails.unsubscribe():null;
  }
}
