import { Component, OnInit,HostListener,Inject } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError,RouteConfigLoadStart	,RoutesRecognized } from '@angular/router';
import  {AppService} from './app.service';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { slideInAnimation } from './app.annimation';
import { AlertComponent } from '../../node_modules_bkp/ngx-bootstrap';
// import { NgxSpinnerService } from 'ngx-spinner';
import { DOCUMENT } from '@angular/platform-browser';
import { window } from '../../node_modules_bkp/ngx-bootstrap/utils/facade/browser';
declare var $;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [ slideInAnimation ]
})
export class AppComponent implements OnInit {


 
  constructor(private router: Router,private appser:AppService) {
    
            router.events.subscribe( (event: Event) => {
    
                if (event instanceof NavigationStart) {
                  console.log("loading");
                }
    
                if (event instanceof NavigationEnd) {
                  console.log("loading done...");
                }
    
                if (event instanceof NavigationError) {
                    // Hide loading indicator
                    // Present error to user
                    console.log("error...");
                }
                   
               if(event instanceof RoutesRecognized){
                console.log("Route recognize...");
               }
               if(event instanceof RouteConfigLoadStart){
                console.log("Route reconfig start...");
               }


            });
      this.appser.setTitle='Angular 2';


    


      
}

ngOnInit() {
  /** spinner starts on init */
  //this.spinner.show();
//this.appser.spinner=true;


  setTimeout(() => {
    this.appser.setServiceValue();
  }, 20000);

if(this.appser.spinner==true){
  alert("true");
}
window.addEventListener('scroll', this.scroll, true); //third parameter


}

scroll(event){


  var offset = $(".main-header").offset();
  //$('.main-header').addClass('move');
 // $('.main-header').addClass('fixed');

  if ( Math.floor(event.target.scrollTop) > $(".main-header").outerHeight()){
    $('.main-header').addClass('fixed',1000);
} else {
     $('.main-header').removeClass('fixed',1000);
} 

if (Math.floor(event.target.scrollTop) > 100) {
  $('#back2Top').fadeIn();
} else {
  $('#back2Top').fadeOut();
}

}
gototop() {
  event.preventDefault();
  $("html, body").animate({ scrollTop: 0 }, "slow");
}

}
