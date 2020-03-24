import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DatatableComponent } from "@swimlane/ngx-datatable/release";
import { RolesService } from 'src/app/services/roles.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ErrorServService } from 'src/app/services/error-serv.service';
import { RoleDetailsComponent } from '../role-details/role-details.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-role-search',
  templateUrl: './role-search.component.html',
  styleUrls: ['./role-search.component.scss']
})
export class RoleSearchComponent implements OnInit, OnDestroy {
  roleSearch: Subscription;
  deleteRole: Subscription;
  public showLoader: boolean
  constructor(private RolesService: RolesService, private router: Router, public AuthService: AuthService,
    private err: ErrorServService, private ToastrService: ToastrService, public modalService: NgbModal) {
    this.RoleSearchForm = new FormGroup({
      name: new FormControl('')
    });
    this.isOwner = this.AuthService.isOwner;

  }
  isOwner;
  RoleSearchForm: FormGroup;
  submited: false;
  search = {
    pageInfo: {
      pageIndex: 1,
      pageSize: 10
    },
    orderInfoLst: [
      {
        fieldName: "",
        type: ""
      }
    ],
    roleSearch: {
      name:'',
      customerId:0
    }
  };

  pageIndex = 1;
  pageCount = 1;
  countArr = [];
  PageCounter() {
    let temp = [];
    for (let x = 1; x < this.pageCount; x++) {
      temp.push(x + 1);
    }
    this.countArr = temp;
  }
  public pageChanged(event: any): void {
    this.searchPage(event);
  };
  searchPage(num: number) {
    this.pageIndex = num;
    this.onSubmit();
  }
  ngOnInit() {
this.onSubmit();
  }
  onSubmit() {
    this.showLoader = true
    this.search.roleSearch.name = this.RoleSearchForm.get('name').value;
    if (this.isOwner == true) {
      this.search.roleSearch.customerId=0;
      
    } else {
      this.search.roleSearch.customerId=this.AuthService.customerID;
    }

    this.search.pageInfo.pageIndex = this.pageIndex;
    this.roleSearch = this.RolesService.roleSearch(this.search).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          console.log(res.data);
          
          this.rows = res.data;
          this.temp = res.data;
          this.pageCount = res.pagesCount;
          this.PageCounter();
        } else if (res.statusCode == 204) {
          if (Number(res.data)) {
            this.ToastrService.error("Error", this.err.ErrorServ(res.data));
          } else {
            let arr: any[] = res.data;
            arr.forEach(element => {
              this.ToastrService.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
            });
          }
        }
        else {
          this.ToastrService.error(res.data, 'error')
        }
        this.showLoader = false
      }, (err) => { this.showLoader = false })
  }
  rows = [];
  temp = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
  }

  public roleDetails: Subscription;
  gotToDetails(row) {
    this.showLoader = true;
    this.roleDetails = this.RolesService.roleDetails(row.id).subscribe((res: any) => {
      this.showLoader = false;
      const modalRef = this.modalService.open(RoleDetailsComponent, {
        size: "lg",
      });
      if (res.statusCode == 200) {
        modalRef.componentInstance.details = res.data;
      } else {
        modalRef.componentInstance.altText = true;
      }
    },
      (err) => {
        this.ToastrService.error(err);
        this.showLoader = false;
      })
  }

  delete(row) {
    Swal({
      title: 'Delete ' + row.name + ' ?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00c292',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.deleteRole = this.RolesService.deleteRole({ id: row.id }).subscribe(
          (res: any) => {
            if (res.statusCode == 200) {
              Swal(
                'Deleted!',
                row.name + ' has been deleted.',
                'success'
              )
              this.onSubmit();
            }
            else {
              Swal(
                'error in delete!',
                row.name + ' has not been deleted.',
                'error'
              )
            }
          }
        );
      }
    });
  }
  edit(row) {
    this.router.navigate(['/dashboard/RolesForm'], { queryParams: { role_id: row.id,customer_id:row.customerId } });
  }
  ngOnDestroy(): void {
    this.roleSearch ? this.roleSearch.unsubscribe() : null;
    this.deleteRole ? this.deleteRole.unsubscribe() : null;
  }
}

