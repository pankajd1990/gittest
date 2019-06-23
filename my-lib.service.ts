import { Injectable,Inject,Optional } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class MyLibService {
  public config;
  constructor(private http: Http,@Optional() config: BASE_URL) { 
     if(config) {
       console.log(config);
       this.config=config;
     }



  }
  testCall() {
    console.log(this.config);
    
  this.http.get("/pankaj").subscribe(res => console.log(res.text())); (1)
  }
}
export class BASE_URL {
  userName = 'Philip Marlowe';
}




