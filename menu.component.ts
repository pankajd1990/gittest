import { Component, OnInit, AfterViewInit, AfterViewChecked, AfterContentInit } from '@angular/core';
declare var $;
@Component({
  selector: 'menu-component',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {

  menus: any;

  ngOnInit() {
    this.menus = {
      "application": "Administration",
      "Menu": [{
        "id": 3001, "label": "DashBoard",
        "items": [{ "routerLink": "stockwatch", "id": 300101, "label": "Stock Watch" },
        { "routerLink": "securityinfo", "id": 300102, "label": "Security Info" }]
      },
        ],
    };

  }

  toggleMenu(event) {
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