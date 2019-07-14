import { Component,OnInit,HostListener } from '@angular/core';
import {Store} from '@ngrx/store';
import {Post} from './post.model';
import  * as PostActions from './post.action';
import { Observable } from 'rxjs';
import {AppService} from './app.service';
import { Router } from '@angular/router';
import {ToasterService} from './toster.service';
import { HttpClient } from "@angular/common/http";
interface AppState{
  message:string;
  post:Post
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {


 

  title = 'serviceWorker1';
  message$:Observable<string>;
  post$:Observable<Post>;
  counter:number=0;
  public time1="00:00:00";
  constructor(private store:Store<AppState>,private http: HttpClient,private appservice:AppService,private router: Router,private toasterService:ToasterService){
   this.message$=this.store.select('message');
   this.post$=this.store.select('post');
  // this.router.navigate(['candlestick']);

 




  this.startTime();

  }
  ngOnInit() {
    setInterval(()=> {

      var currentTime = new Date(),
          hours:any = currentTime.getHours(),
          minutes:any = currentTime.getMinutes(),
          seconds:any =currentTime.getSeconds(),
          ampm = hours > 11 ? 'PM' : 'AM';
    
          hours += hours < 10 ? '0' : '';
          minutes += minutes < 10 ? '0' : '';
    
     this.time1= hours + ":" + minutes +":"+seconds+ ampm;
    }, 1000);
  }
  hindiMessage(){
  this.store.dispatch({type:'Hindi'})
  }
  marathiMessage(){
    this.store.dispatch({type:'Marathi'})
  }
  EditText(){
    this.store.dispatch(new PostActions.EditText('aa'))
  }

  startTime() {
    var now = new Date();
    this.http.post('http://localhost/ang1/blog/public/starttime',{id:1,starttm:this.convertDate(now)}).subscribe(data => {
    this.appservice.loginId=data['data'].id;
    this.appservice.start();

  });
  }
convertDate(date) {
 
  return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();;
}

@HostListener('document:click', ['$event'])
onClick1(targetElement) {
  if (!targetElement.target.closest('.tooltip1')) {
    
        if (document.querySelector('.tooltip1') != null) {          
            var elem=  document.querySelector('.tooltip1');
           document.body.removeChild(elem);
        }
  } 
}


}
