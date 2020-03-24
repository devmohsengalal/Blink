import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { group } from 'src/app/models/group.model';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { ErrorServService } from 'src/app/services/error-serv.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit, OnDestroy {
  getGroups: Subscription;
  addGroups: Subscription;
  delGroups: Subscription;
  editUsers: Subscription;
  public isDeleted: string = "";
  public selected = false;
  public userGroups: group;
  public groupForm: FormGroup;
  public custHidden = false;
  public deletedForm: FormGroup;
  public showLoader: boolean;
  isSubmitted = false;
  //DataTable
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

  constructor(private _group: UsersService, private err: ErrorServService, private tostr: ToastrService, public AuthService: AuthService) {
  }
  ngOnInit() {
    this.deletedForm = new FormGroup({
      isDeleted: new FormControl("", Validators.required),
    })
    this.groupForm = new FormGroup({
      name: new FormControl("", Validators.required),
      id: new FormControl(0),
    })
    this.search();
  }

  search() {
    this.showLoader = true
    this.getGroups = this._group.getGroups().subscribe(
      (res: any) => {
        if (res.statusCode == 200) {
          this.rows = res.data;
          this.temp = res.data;
        } else if (res.statusCode == 204) {
          if (Number(res.data)) {
            this.tostr.error("Error", this.err.ErrorServ(res.data));
          } else {
            let arr: any[] = res.data;
            if (Array.isArray(arr)) {
              arr.forEach(element => {
                this.tostr.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
              });
            }
          }
        }
        this.showLoader = false
      }, (err) => this.showLoader = false)
  }

  add() {
    this.isSubmitted = true
    if (this.groupForm.valid) {
      this.addGroups = this._group.addGroups(this.groupForm.value).subscribe((res: any) => {
        this.showLoader = true
        if (res.statusCode == 200) {
          this.tostr.success('Success', 'Added');
          this.groupForm.reset();
          this.search();
        } else if (res.statusCode == 204) {
          if (Number(res.data)) {
            this.tostr.error("Error", this.err.ErrorServ(res.data));
          } else {
            let arr: any[] = res.data;
            if (Array.isArray(arr)) {
              arr.forEach(element => {
                this.tostr.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
              });
            }
          }
        }
        this.showLoader = false
      }, (err => {
        this.tostr.error(err, 'Error');
        this.showLoader = false
      }))
    }
  }

  onDelete(row) {
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
        this.delGroups = this._group.delGroups(row.id).subscribe(
          (res: any) => {
            if (res.statusCode == 200) {
              Swal(
                'Deleted!',
                row.name + ' has been deleted.',
                'success'
              )
              this.search();
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

  onEdit(f) {
    this.selected = true;
    window.scroll(0, 0);
    this.groupForm.setValue({
      'name': f.name,
      'id': f.id,
    })
  }

  filteringDrop(id, arr) {
    if (arr.filter(x => x.id == id).length > 0) {
      let name = arr.filter(x => x.id == id)[0].name;
      return name;
    }
  }

  edit() {
    this.isSubmitted = true
    if (this.groupForm.valid) {
      this.editUsers = this._group.editGroups(this.groupForm.value).subscribe(
        (res: any) => {
          this.showLoader = true
          if (res.statusCode == 200) {
            this.tostr.success('Success', 'Edited');
            this.selected = false;
            this.groupForm.reset();
            this.search();
          } else if (res.statusCode == 204) {
            if (Number(res.data)) {
              this.tostr.error("Error", this.err.ErrorServ(res.data));
            } else {
              let arr: any[] = res.data;
              if (Array.isArray(arr)) {
                arr.forEach(element => {
                  this.tostr.error(element.fieldName, element.isRepeated ? 'data is repeated' : null);
                });
              }
            }
          }

          this.showLoader = false

        }, (err => {
          this.tostr.error(err, 'Error');
          this.showLoader = false
        }))
    }
  }

  ngOnDestroy(): void {
    this.getGroups ? this.getGroups.unsubscribe() : null;
    this.addGroups ? this.addGroups.unsubscribe() : null;
    this.delGroups ? this.delGroups.unsubscribe() : null;
    this.editUsers ? this.editUsers.unsubscribe() : null;
  }
}
