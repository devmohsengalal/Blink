import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RolesService } from 'src/app/services/roles.service';
import { PermissionsTitleModel } from 'src/app/models/PermissionsTitle.model';
import { PermissionsModel } from 'src/app/models/Permissions.model';
import { roleDtoModel } from 'src/app/models/roleDto.models';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, forkJoin } from 'rxjs';
import { ErrorServService } from 'src/app/services/error-serv.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustSearchModalComponent } from 'src/app/shared/cust-search-modal/cust-search-modal.component';

@Component({
  selector: 'app-roles-form',
  templateUrl: './roles-form.component.html',
  styleUrls: ['./roles-form.component.scss']
})
export class RolesFormComponent implements OnInit, OnDestroy {
  queryParams: Subscription;
  getPermissionsTitle: Subscription;
  getPermissions: Subscription;
  roleDetails: Subscription;
  editRole: Subscription;
  addRole: Subscription;
  customerName: string = "";
  constructor(private RolesService: RolesService,
    private route: ActivatedRoute, public AuthService: AuthService,
    public modalService:NgbModal,
    private err: ErrorServService, private ToastrService: ToastrService) {
    this.queryParams = this.route.queryParams
      .filter(params => params['role_id']&&params['customer_id'])
      .subscribe(params => {
        this.customerId=params['customer_id'];
        this.RoleID = params['role_id'];
        this.isEdit = true;

      });

    if (this.isEdit) {
      this.cardheader = "Role Details"
    } else {
      this.cardheader = "Add Role";
      this.customerId=this.AuthService.customerID;   
    }
    let isOwner = this.AuthService.isOwner;
    this.RoleForm = new FormGroup({
      RoleName: new FormControl('', Validators.required),
      customerId: new FormControl(null, Validators.required),
    });
    this.RoleForm.get('customerId').setValue(this.AuthService.customerID);

    if (isOwner == false) {
      this.custHidden = true;
      
    } else {

      this.custHidden = false;
    }
  }
  customerId:number=0;
  custHidden:boolean;
  cardheader: string = '';
  isEdit = false;
  RoleForm: FormGroup;
  PermissionsTitleList: PermissionsTitleModel[] = new Array<PermissionsTitleModel>();
  PermissionsList: PermissionsModel[] = new Array<PermissionsModel>();
  submited = false;
  RoleID: number = null;
  AddedRole: roleDtoModel = new roleDtoModel();
  public showLoader: boolean;
  open() {
    const modalRef = this.modalService.open(CustSearchModalComponent, {
      size: "lg"
    });
    modalRef.result.then((res) => {
      this.RoleForm.get('customerId').setValue(res.id);
      this.RolesService.getPermissionsTitle( this.RoleForm.get('customerId').value).subscribe((res)=>{
       if(res.data.length>0)
       {
        this.PermissionsTitleList = res.data;
        this.PermissionsTitleList.forEach(el => {
          el.chkText = "Select All"
        });
       }
       else
       {
        this.PermissionsTitleList=[];
       }
      });
      this.customerName = res.name;
    });
  }
  ngOnInit() {
    this.showLoader = true;
    this.AddedRole.permissionIds = [];
   
    this.checkAddEdit();
    
  }
  checkAddEdit()
  {
    if (this.isEdit) {
      forkJoin(
        this.RolesService.getPermissionsTitle(this.customerId),
        this.RolesService.getPermissions(),
        this.RolesService.roleDetails(this.RoleID)
      ).subscribe(([PermissionsTitle,Permissions,roleDetails])=>{
        this.subResponse(PermissionsTitle,Permissions,roleDetails);
        this.showLoader=false;
      },(err)=>{
        this.showLoader=false;
      })
    }
    else
    {
      forkJoin(
        this.RolesService.getPermissionsTitle(this.AuthService.customerID),
        this.RolesService.getPermissions()
      ).subscribe(([PermissionsTitle,Permissions])=>{
        this.subResponse(PermissionsTitle,Permissions,null);
        this.showLoader=false;
      },(err)=>{
        this.showLoader=false;
      })
    }
  }
  subResponse(PermissionsTitle,Permissions,roleDetails)
  {
    if (PermissionsTitle.statusCode == 200) {
      this.PermissionsTitleList = PermissionsTitle.data;
          this.PermissionsTitleList.forEach(el => {
            el.chkText = "Select All"
          });
    }
    if (Permissions.statusCode == 200) {
      this.PermissionsList = Permissions.data;
    }
    if(this.isEdit)
    {
      if (roleDetails.statusCode == 200) {

        const data = roleDetails.data;
        this.RoleForm.setValue({
          RoleName: data.name,
          customerId:this.customerId
        });
        this.customerName = data.customerName;
        data.permissionlst.forEach(element => {
          let index = this.PermissionsList.findIndex(el => el.id == element.id);
          this.PermissionsList[index].checked = true;
        });
  
      } else if (roleDetails.statusCode == 204) {
        if (Number(roleDetails.data)) {
          this.ToastrService.error("Error", this.err.ErrorServ(roleDetails.data));
        } else {
          let arr: any[] = roleDetails.data;
          if (Array.isArray(arr)) {
            arr.forEach(element => {
              this.ToastrService.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
            });
          }
        }
      }
    }
  }
  me(e, roleId) {
    let isChecked = e.target.checked;
    let i = this.PermissionsList.findIndex(x => x.id == roleId);
    if (isChecked) {
      this.PermissionsList[i].checked = true;
    } else {

      this.PermissionsList[i].checked = false;
    }

    return e;
  }
  checkAll(e, item) {
    let isChecked = e.target.checked;
    let moduleId = item.id;
    let i = this.PermissionsTitleList.findIndex(x => x.id == moduleId);
    this.PermissionsTitleList[i].checked = isChecked;
    this.PermissionsTitleList[i].chkText = isChecked ? "Remove Selected" : "Select all"
    this.PermissionsList.forEach((el) => {
      if (el.moduleId == moduleId) {
        el.checked = isChecked;
      }
    });
  }

  filterItemsOfType(id: number, list: PermissionsModel[]) {
    return list.filter(x => x.moduleId == id);
  }
  fillPermissionIds() {
    this.PermissionsList.forEach(element => {
      if (element.checked) {
        this.AddedRole.permissionIds.push(element.id);
      }
    });

  }
  onSubmit() {
    this.submited = true;
    if (this.RoleForm.valid) {
      this.showLoader = true
      this.AddedRole.name = this.RoleForm.get('RoleName').value;
      this.AddedRole.customerId = this.RoleForm.get('customerId').value;

      this.fillPermissionIds();
      if (this.isEdit) {
        this.AddedRole.id = this.RoleID;
        this.editRole = this.RolesService.editRole(this.AddedRole).subscribe(
          (res: any) => {
            if (res.statusCode == 200) {
              this.ToastrService.success(this.AddedRole.name + ' has been edited successfully', 'Success');
            } else if (res.statusCode == 204) {
              if (Number(res.data)) {
                this.ToastrService.error("Error", this.err.ErrorServ(res.data));
              } else {
                let arr: any[] = res.data;
                if (Array.isArray(arr)) {
                  arr.forEach(element => {
                    this.ToastrService.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
                  });
                }
              }
            } else {
              this.ToastrService.error(this.AddedRole.name + ' has not been edited', 'error');
            }
            this.showLoader = false
            this.AddedRole.permissionIds = [];
          },(err)=>{
            this.showLoader=false;
          });
      } else {
        this.addRole = this.RolesService.addRole(this.AddedRole).subscribe(
          (res: any) => {
            if (res.statusCode == 200) {
              this.ToastrService.success('New Role Has been Added', 'Sucess');
            } else if (res.statusCode == 204) {
              if (Number(res.data)) {
                this.ToastrService.error("Error", this.err.ErrorServ(res.data));
              } else {
                let arr: any[] = res.data;
                if (Array.isArray(arr)) {
                  arr.forEach(element => {
                    this.ToastrService.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
                  });
                }
              }
            } else {
              this.ToastrService.error(this.AddedRole.name + ' Role has not been added', 'error');
            }
            this.showLoader = false
            this.AddedRole.permissionIds = [];
          },(err)=>{
            this.showLoader=false;
          }
        );
      }
    }
  }
  ngOnDestroy(): void {

    this.queryParams ? this.queryParams.unsubscribe() : null;
    this.getPermissionsTitle ? this.getPermissionsTitle.unsubscribe() : null;
    this.getPermissions ? this.getPermissions.unsubscribe() : null;
    this.roleDetails ? this.roleDetails.unsubscribe() : null;
    this.editRole ? this.editRole.unsubscribe() : null;
    this.addRole ? this.addRole.unsubscribe() : null;
  }
}
