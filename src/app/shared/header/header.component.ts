import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public auth:AuthService,public _router:Router) { }

  ngOnInit() {
  	 $.getScript('assets/js/script.js');
  }
  goTodetails()
  {
    this._router.navigate(['/dashboard/AccountForm'], { queryParams: { account_id: this.auth.accountID } });
  }
}
