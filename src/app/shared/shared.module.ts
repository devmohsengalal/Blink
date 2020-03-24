import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './menu/sidebar/sidebar.component';
import { ChatSidebarComponent } from './chat-sidebar/chat-sidebar.component';
import { ToggleFullscreenDirective } from "./directives/fullscreen.directive";
import { NgxModalComponent } from './ngx-modal/ngx-modal.component';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, SidebarComponent, ChatSidebarComponent, ToggleFullscreenDirective, NgxModalComponent],
  imports: [CommonModule, RouterModule],
  exports: [HeaderComponent, FooterComponent,
     SidebarComponent, ChatSidebarComponent, ToggleFullscreenDirective]
})
export class SharedModule { }
