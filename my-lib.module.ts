import { NgModule,InjectionToken } from '@angular/core';
import { MyLibComponent } from './my-lib.component';
import {MyLibService, BASE_URL} from './my-lib.service';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [MyLibComponent],
  imports: [
    HttpModule
  ],
  exports: [MyLibComponent],
  providers:[MyLibService],
  
})
export class MyLibModule {
  static forRoot(host: {}) {
    return {
      ngModule: MyLibModule,
      providers: [{
        provide: BASE_URL,
        useValue: host
      }]
    }
  }

 }


