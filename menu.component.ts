declare var $;
import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, AfterViewInit, AfterViewChecked, AfterContentInit } from '@angular/core';

import { RestService } from '../../../ngs-service/rest.service';
import { SharedService } from '../../../ngs-service/shared.service';
import { survConst } from '../../../ngs-utility/surv.constant';
import { ToastMessageService } from '../../../ngs-service/toast.message.service';

@Component({
  selector: 'menu-component',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})

export class MenuComponent implements OnInit {

  menus: any = [];
  constructor(public sharedService: SharedService, public restService: RestService,
    private componentFactoryResolver: ComponentFactoryResolver, public toastMsgService: ToastMessageService) {

  }

  ngOnInit() {
    var data = {
      uadUserId: 'batchUser',
      uadUserPsswrd: 'Batch@1234'
    }
   this.restService.postRequest('loginUser', data,false).subscribe(data => { this.loginUserCallBack(data) 
  });
  }

  loginUserCallBack(data) {
    if (data.responseCode == 0) {
      this.restService.postRequest('surveillanceLogin').subscribe(data => { this.surveillanceLoginCallBack(data) });
    } else {

    }
  }

  surveillanceLoginCallBack(data) {
    if (data.responseCode == 0) {
      this.menus = JSON.parse(data.resultData);
      //if(this.menus.length > 0) {
        this.sharedService.switchToView({ menuId: 200105, menuLable: 'User Dashboard',menuRouter:'userDashboard',type:'open' });
      //}
    }

  }

  toggleMenu(event, subMenuCnt, menuId, menuLable,routerLink) {
    if (subMenuCnt == 0) {
      let checkMenuOpen = this.sharedService.tabArray.findIndex((ele) => {
        return ele.menuId == menuId;
      });
      if (checkMenuOpen >= 0) {
        this.toastMsgService.showMessage("info", "This Menu is already opened", "Warning");
        return;
      }
      let cntTabsAvailable = this.sharedService.tabArray.filter((ele) => {
        return ele.isAvailable == 1;
      });
      if (cntTabsAvailable.length == 0) {
        this.toastMsgService.showMessage("info", "Can not open more than " + survConst.NO_OF_TABS_ALLOWED, "Warning");
        return;
      }
      this.sharedService.switchToView({ menuId: menuId, menuLable: menuLable,menuRouter:routerLink,type:'open' });     
    }
    else {
      /*  menu open/close code by pankaj 27052019  */
      let atag = $(event.target).closest("a");
      if ($(atag).closest("ul").hasClass("sidebar-menu")) {
          let currlist = $(atag).parent().index();
          if ($("ul.sidebar-menu > li:not(:eq(" + currlist + ")) ul.treeview-menu").hasClass("menu-open")) {
            $("ul.sidebar-menu > li:not(:eq(" + currlist + ")) ul.treeview-menu").slideUp().removeClass("menu-open");
            $("ul.sidebar-menu > li a").removeClass("text-white");
            $("ul.sidebar-menu > li").removeClass("active");
          }
          $(atag).next('ul.treeview-menu').slideToggle().toggleClass("menu-open");
          $(atag).toggleClass("text-white");
          $(atag).parent().toggleClass("active");
      }
      else {
        $(atag).next('ul.treeview-menu').slideToggle().addClass("menu-open");
      }
    }
  }

  ngAfterViewInit() {

  }

}