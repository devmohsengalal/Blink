import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustSearchModalComponent } from 'src/app/shared/cust-search-modal/cust-search-modal.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorServService } from 'src/app/services/error-serv.service';

const {
  read,
  write,
  utils
} = XLSX;

@Component({
  selector: 'app-import-user-sheet',
  templateUrl: './import-user-sheet.component.html',
  styleUrls: ['./import-user-sheet.component.scss']
})
export class ImportUserSheetComponent {
  isSubmitted = false;
  importForm: FormGroup;
  arrayBuffer: any;
  file: File;
  custHidden = false;
  customerName = "";
  Array = [];
  showLoader = false;
  constructor(public modalService: NgbModal, public AuthService: AuthService,
    public UsersService: UsersService, public ToastrService: ToastrService, public ErrorServService: ErrorServService) {
    let customerID = this.AuthService.customerID;
    let isOwner = this.AuthService.isOwner;
    this.importForm = new FormGroup({
      customerId: new FormControl("", Validators.required)
    })
    if (isOwner == false) {
      this.importForm.get('customerId').setValue(customerID);
      this.custHidden = true;
    } else {
      this.custHidden = false;
    }
  }

  downloadFile() {
    const blob = new Blob(["/src/assets/Blink Notes.xlsx"]);
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }

  incomingfile(event) {
    this.file = event.target.files[0];
  }

  Upload() {
    let fileReader = new FileReader();
    this.isSubmitted = true;
    if (this.importForm.valid) {

      fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, {
          type: "binary"
        });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        this.Array = XLSX.utils.sheet_to_json(worksheet, {
          raw: true
        });
        
        let obj = {
          customerId: this.importForm.get('customerId').value,
          lstUser: this.Array
        }
       if(this.Array.length <= 200)
       {
        this.showLoader = true;
        this.UsersService.importUsers(obj).subscribe((res: any) => {
          if (res.statusCode == 200) {
            this.ToastrService.success('Excel Sheet has been imported Successfully', 'Success')
          }
          else {
            this.ToastrService.error(this.ErrorServService.ErrorServ(res.data), 'Error')
          }
          this.showLoader = false;
        }, (err) => {
          let errors = err.error.errors;
          Object.keys(errors).forEach(function (key) {
            this.ToastrService.error(errors[key], 'Error');
          }.bind(this));
          this.showLoader = false;
        })
       }
       else
       {
        this.ToastrService.warning('Maximum number of end users exceeded', 'Warning');
       }
      }
    }
    fileReader.readAsArrayBuffer(this.file);
  }

  open() {
    const modalRef = this.modalService.open(CustSearchModalComponent, {
      size: "lg"
    });
    modalRef.result.then((res) => {
      this.importForm.get('customerId').setValue(res.id);
      this.customerName = res.name;
    });
  }
}
