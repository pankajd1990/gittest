<aside class="main-sidebar">

    <form action="#" method="get" class="srchMenuFrm">
            <div class="ui-fluid">
                 <input type='text' class="menu-search" pInputText  placeholder="Search..." (keyup)="srchMenu($event);">                              
            </div>
    </form>
    <section class="sidebar" style="height: auto;">
        <ul class="sidebar-menu tree" data-widget="tree" *ngIf="menuSrch">     
                    <ng-container *ngTemplateOutlet="recursiveMenu; context:{$implicit:{ menus: srchedmenus.Menu,submenu:'no' }}">
                    </ng-container>
        </ul>
        <ul class="sidebar-menu tree" data-widget="tree" *ngIf="!menuSrch">
     
            <ng-container *ngTemplateOutlet="recursiveMenu; context:{$implicit:{ menus: menus.Menu,submenu:'no' }}">
            </ng-container>
        </ul>
    </section>
  </aside>
  <ng-template #recursiveMenu let-Json1 >
      <ng-container *ngFor="let menu of Json1.menus">           
            <li  class="treeview " *ngIf="menu.routerLink!='userDashboard'">
                    <a href="#" title="{{menu.label}}" [ngClass]="sharedService.tabArray[sharedService.currentActiveTab] && sharedService.tabArray[sharedService.currentActiveTab].menuId==menu.id ? 'text-white': ''"   (click)="toggleMenu($event,menu.items ? menu.items.length:0,menu.id,menu.label,menu.routerLink);">
                            <i class="fa fa-dashboard"  ></i> <span>{{menu.label}}</span>
                            <span *ngIf="menu.items"  class="pull-right-container">
                              <i  class="fa fa-angle-left pull-right"></i>
                            </span>
                    </a>       
                          <ul class="treeview-menu" *ngIf="menu.items">
                                  <ng-container *ngTemplateOutlet="recursiveMenu;   context:{ $implicit:{ menus: menu.items,submenu:'yes' }}"></ng-container>
                          </ul>                   
                </li>
      </ng-container>
   
  </ng-template>



declare var $;
import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, AfterViewInit, AfterViewChecked, AfterContentInit } from '@angular/core';

import { RestService } from '../../../ngs-service/rest.service';
import { SharedService } from '../../../ngs-service/shared.service';
import { survConst } from '../../../ngs-utility/surv.constant';
import { ToastMessageService } from '../../../ngs-service/toast.message.service';
import * as _ from 'lodash'; 
@Component({
  selector: 'menu-component',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})

export class MenuComponent implements OnInit {

  menus: any = [];
  srchMenuList:any=[];
  menuSrch:boolean=false;
  srchedmenus:any=[];
  constructor(public sharedService: SharedService, public restService: RestService,
    private componentFactoryResolver: ComponentFactoryResolver, public toastMsgService: ToastMessageService) {

  }




  ngOnInit() {   
    this.sharedService.menuData.subscribe((data) => {
      if(data) {
        this.menus = data;          
        if(this.menus.Menu && this.menus['Menu'].length  > 0) {    
          let menu = this.menus.Menu;
          this.printList(menu);    
          console.log(  this.srchMenuList);
          let defaultMenu =  menu.filter((ele)=>{
             return ele.routerLink==survConst.DEFALUTTABMENU
          });        
          if (defaultMenu.length) {
             this.sharedService.switchToView({menuId: defaultMenu[0].id, menuLable: defaultMenu[0].label,menuRouter:defaultMenu[0].routerLink,type:'open'});
          }       
        }
      }       
    });

    this.sharedService.openMenu.subscribe((data) => {
 
      if (data) {
        this.toggleMenu(data.event, data.subMenuCnt, data.menuId, data.menuLable,data.routerLink); 
      } 
    });  

 

    $(".treeview").mouseout(()=>{
      console.log("hover menu");
    })

  }

 
  toggleMenu(event, subMenuCnt, menuId, menuLable,routerLink) {
    if (subMenuCnt == 0) {
      let checkMenuOpen = this.sharedService.tabArray.findIndex((ele) => {
        return ele.menuId == menuId;
      });
      if (checkMenuOpen >= 0) {
        this.toastMsgService.showMessage("info", "This Menu is already opened", "Info");
        return;
      }
      let cntTabsAvailable = this.sharedService.tabArray.filter((ele) => {
        return ele.isAvailable == 1;
      });
      if (cntTabsAvailable.length == 0) {
        this.toastMsgService.showMessage("info", "Can not open more than " + survConst.NO_OF_TABS_ALLOWED, "Info");
        return;
      }
      this.sharedService.switchToView({ menuId: menuId, menuLable: menuLable,menuRouter:routerLink,type:'open' });     
    }
    else {
      /*  menu open/close code by pankaj 27052019  */
        let atag = $(event.target).closest("a");
        $(atag).toggleClass("text-white");
        let parentul= $(atag).parents("ul").eq(0);     
        let ind= $(atag).parent().index()
        $(parentul).children().each( (index, element) => {  
          $(element).trigger("mouseover");    
        if (ind!=index) {
        
          $(element).children("a").removeClass("text-white");
          //$(element).children("ul").css("display", "none");

        }           
     });
      if ($(atag).closest("li").hasClass("treeview")) {
          let currlist = $(atag).parent().index();
          console.log(currlist);
          $("ul.sidebar-menu > li:not(:eq(" + currlist + ")) ul.treeview-menu").css({display:'none'});
          // if ($("ul.sidebar-menu > li:not(:eq(" + currlist + ")) ul.treeview-menu").hasClass("menu-open")) {
          
          //   $("ul.sidebar-menu > li a").removeClass("text-white");
          //   $("ul.sidebar-menu > li").removeClass("active");
          // }
          $(atag).next('ul.treeview-menu').slideToggle().toggleClass("menu-open");
         // $(atag).toggleClass("text-white");
         // $(atag).parent().toggleClass("active");
      }
      else {
        
        $(atag).next('ul.treeview-menu').slideToggle().addClass("menu-open");
      }
    }
  }

  ngAfterViewInit() {

  }
  

  printList(dashitems){

   dashitems.forEach(value => {      
      if (value.routerLink=="snapshot") {
         survConst.SNAPSHOTMENUDETAIL  =value;
      }
      if (value.routerLink=="stockwatchCM") {
        survConst.STOCKWATCHMENUDETAIL  =value;
     }
  
      let menuSplit = value.label.split(" ");   
      if (value.hasOwnProperty('items')) {
        value["menuSpilt"] = menuSplit;
        value['parentMenu'] = value.label;
        this.srchMenuList.push(value);
        this.printList(value.items);
      } else {
        value["menuSpilt"] = menuSplit;
        this.srchMenuList.push(value);
        
      }
     
  });
  
}
srchMenu(event) {
  let data= event.target.value;
  if (data=="" || data==null) {
    this.menuSrch=false; 
  }
  else {
    this.menuSrch=true; 
    this.srchedmenus['Menu']=[];   
    this.srchMenuList.forEach(ele => {    
      let myReg = new RegExp(data.toLowerCase() + ".*")

        if (ele.label.toLowerCase().match(myReg)) {              
          this.srchedmenus['Menu'].push(ele);
        }
    });              
  }
}
    
       
    

}
  

,{\"routerLink\":\"report\",\"id\":20070102,\"label\":\"Trading After N Days\"},{\"routerLink\":\"\",\"id\":20070104,\"label\":\"Integrated Graph\"},{\"routerLink\":\"report\",\"id\":20070105,\"label\":\"Detailed Price Variation\"}]},{\"id\":200702,\"label\":\"CM - Client Level\",\"items\":[{\"routerLink\":\"report\",\"id\":20070201,\"label\":\"Across Scrips Top Clients on Value Basis\"},{\"routerLink\":\"report\",\"id\":20070202,\"label\":\"CM Security wise Top Clients on Qty Basis\"}

