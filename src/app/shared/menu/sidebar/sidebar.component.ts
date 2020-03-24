import { Component, OnInit } from '@angular/core';
import { MENUITEMS, Menu } from './sidebar-items';
import { Router, ActivatedRoute } from "@angular/router";
import * as $ from 'jquery';

import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
   
   public menuItems: Menu[];

   constructor(private router: Router,
        private route: ActivatedRoute,private cookieService:CookieService,public AuthService:AuthService) {
    }
    username:string=this.cookieService.get("Username");
   ngOnInit() {
       $.getScript('./assets/js/sidebar-menu.js');
       this.menuItems = MENUITEMS.filter(menuItem => menuItem);
   }

}
