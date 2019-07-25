import { Component,AfterViewInit,OnInit } from '@angular/core';
declare var $;


@Component({
  selector: 'my-slider',
  templateUrl: './slider.html',
  styleUrls:['./slider.css']
  
})
export class SliderComponent implements OnInit {
  title = 'app';
  empid:number=10;
  name:string='pankaj';
  private active="active";
  public menus:any;
 

  ngOnInit() {
    this.menus = {
      "application": "Administration",
      "Menu": [{
        "id": 3001, "label": "DashBoard Administrationpankaj",
        "items": [{ "routerLink": "stockwatch", "id": 300101, "label": "Stock Watch" },
        { "routerLink": "securityinfo", "id": 300102, "label": "Security Info",
           "items": [{ "routerLink": "stockwatch", "id": 300101, "label": "Stock Watch ss  ss   ss  sss  ss  ss  ss  ss"
            ,"items":[{ "routerLink": "stockwatch", "id": 300101, "label": "Stock Watch"}]
          
          
          }]
      
        }]
        },
        {
          "id": 3001, "label": "DashBoard Administrationpankaj",
          "items": [{ "routerLink": "stockwatch", "id": 300101, "label": "Stock Watch" },
          { "routerLink": "securityinfo", "id": 300102, "label": "Security Info",
             "items": [{ "routerLink": "stockwatch", "id": 300101, "label": "Stock Watch" }]
        
          }]
          },
          {
            "id": 3001, "label": "DashBoard Administrationpankaj",
            "items": [{ "routerLink": "stockwatch", "id": 300101, "label": "Stock Watch" },
            { "routerLink": "securityinfo", "id": 300102, "label": "Security Info",
               "items": [{ "routerLink": "stockwatch", "id": 300101, "label": "Stock Watch" }]
          
            }]
            }


        ],
    };

    this.menus.Menu.forEach((ele)=>{
         let menuSplit= ele.label.split(" ");
         ele["menuSpilt"]=menuSplit

    })
    console.log( this.menus);

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

