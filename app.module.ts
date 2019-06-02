import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AuthModule} from './redux/auth/auth.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {StoreModule} from '@ngrx/store';
// import {SimpleReducer} from './simple.reducer';
import {AppRoutingModule} from './app.routing.module';
import {metaReducers, reducers} from '../app/redux/reducers';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from '@ngrx/effects';
// import {LoginComponent} from './redux/login/login.component';
// import {DashboardComponent} from './redux/dashboard/dashboard.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DashboardModule} from './redux/dashboard/dashboard.module';
import {FullscreenComponent} from './fullscreen';
import { HttpClientModule } from  '@angular/common/http';
import {ToggleFullscreenDirective} from './screenfull-dir';
import {AgGridModule} from "ag-grid-angular";
import {InputGroupComponent} from './primecomponent/inputgroup/ipgroup';
import {AgGridRndComponent} from './ag-grid-rnd';
import {CheckboxModule} from 'primeng/checkbox';
import {RadioButtonModule} from 'primeng/radiobutton';
import {DialogModule} from 'primeng/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ButtonModule} from 'primeng/button';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import {AgGridRndAPiComponent} from './ag-grid-callapi';
import { AngularResizedEventModule } from 'angular-resize-event';
import { ResizableModule } from 'angular-resizable-element';
import { NgxEchartsModule } from 'ngx-echarts';
import {ChartComponent} from './charts/charts';
import {ScatterChartComponent} from './charts/scatter';
import {BarChart1Component} from './charts/barchart1';
import {MarketRepayComponent} from './market-repay/market-repay';
import {TreeChart1Component} from './charts/treeChart';
import {CandlestickComponent} from './charts/candlestick';
import {ParallelchartComponent} from './charts/parallel';
import { ErrorMessageDirective } from './directive/errorMessage';
import {TooltipModule} from 'primeng/tooltip';
import { GrowlModule } from 'primeng/growl';
import {MarketRepayShaileshComponent} from './market-repay/marketrepay-shailesh';
import {AppService} from './app.service';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; 
import{ConfirmationBoxComponent} from './generic/confirmation/confirmation';
import{ConfirmationService} from './generic/confirmation/confirmation.service';
import {MultiplePopopComponent} from './multiple_popop/multiple-popop';
import {AmChartComponent} from './amchart/main-amchart';
// import{ ValueAxisAMComponent} from './amchart/valueaxis/value-axis';
import {MultipleValueAxisAMComponent} from './amchart/multiple-axis/multiple-axis';
import {EventMarkerAxisAMComponent} from './amchart/event-markers/event-marker';
import { AmChartsModule } from "@amcharts/amcharts3-angular";
import {MarketPriceGraphComponent} from './amchart/priceGraph/priceGraph';
import {LineChartComponent} from './charts/lineChart';
import {TooltipDirective} from  './tooltip-directive';
import {TooltipInputComponent} from './tooltip-framework.component';
import { from } from 'rxjs';
import {PrimeNgModule} from './prime-ng.module';
import {ToasterService} from './toster.service';
import {MessageService} from 'primeng/api';
@NgModule({
  declarations: [
    AppComponent,ChartComponent,FullscreenComponent,ToggleFullscreenDirective,AgGridRndComponent,TreeChart1Component,
    InputGroupComponent,CandlestickComponent,ConfirmationBoxComponent,
    MultiplePopopComponent,
    MarketRepayShaileshComponent,AmChartComponent
    ,MarketPriceGraphComponent,
    AgGridRndAPiComponent,ScatterChartComponent,
    MultipleValueAxisAMComponent,EventMarkerAxisAMComponent,
    BarChart1Component,ParallelchartComponent,
    TooltipDirective,TooltipInputComponent,
    MarketRepayComponent,ErrorMessageDirective,LineChartComponent
  ],
  imports: [
    BrowserModule,AppRoutingModule,BrowserModule,AuthModule,DashboardModule,NgxEchartsModule,TooltipModule,GrowlModule,
    FormsModule,ReactiveFormsModule,HttpClientModule,AgGridModule.withComponents(
      [TooltipInputComponent]
  ),AmChartsModule,
    environment.production ? ServiceWorkerModule.register('/ngsw-worker.js') : []
    // StoreModule.forRoot({message:SimpleReducer})
    , StoreModule.forRoot(reducers, { metaReducers })
    ,EffectsModule.forRoot([]),    NgIdleKeepaliveModule.forRoot(),
    PrimeNgModule,
    CheckboxModule,ResizableModule,RadioButtonModule,DialogModule,BrowserAnimationsModule,ButtonModule,AngularFontAwesomeModule
  ],
  providers: [AppService,ConfirmationService,ToasterService,MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { 

 
}
