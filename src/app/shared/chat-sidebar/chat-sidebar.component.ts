import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.scss']
})
export class ChatSidebarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  	 $(".quickview-box-toggle").on("click", function(){
  	 	$("#quickview-wrapper").addClass("open"); 
  	 	$(".bg-overlay").addClass("show");
  	 }); 
  	 $(".destroy").on("click", function(){
  	 	$("#quickview-wrapper").removeClass("open"); 
  	 	$(".bg-overlay").removeClass("show");
  	 }); 
  	 $(".quickview-trigger").on("click", function(){
  	 	$("#chat-quickview").addClass("open");
  	 }); 
  	 $(".destroy-chat").on("click", function(){
  	 	$("#chat-quickview").removeClass("open");
  	 });
  }

}
