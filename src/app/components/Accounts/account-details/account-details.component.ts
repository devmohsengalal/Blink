
import { Component, OnInit, Input } from '@angular/core';
import { AcoountDetails } from 'src/app/models/accounDetails.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit {

  @Input() altText = false;
  @Input() details: AcoountDetails = new AcoountDetails();

  public accountDetails: AcoountDetails = new AcoountDetails()
  public accImage;
  public isCollapsed = true;
  myImgUrl = 'https://www.startupdelta.org/wp-content/uploads/2018/04/No-profile-LinkedIn.jpg';
  constructor(public activeModal: NgbActiveModal) { }
  ngOnInit() {
    this.accountDetails = this.details;
  }

  readThis(inputValue: any): void {
    const file: File = inputValue.files[0];
    let myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.accImage = myReader.result.toString().split(',')[1];
    }
    myReader.readAsDataURL(file);
  }
}
