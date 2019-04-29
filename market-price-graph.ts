declare var require: any;
import * as $ from 'jquery'
import * as echarts from 'echarts';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, HostBinding, OnDestroy,OnChanges,Input,AfterViewInit,NgZone } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import Fingerprint2 from 'fingerprintjs2sync';
import { RestService, Command } from '../../../../ng-service/rest.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { thisConstants } from '../market.replay.constant';
import { marketReplayGraphConfig } from '../../../../ng-component/market-component/market.replay/marketReplay-graphs.conf';
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";

@Component({
  selector:'market-price-graph',
  templateUrl: './market-price-graph.html',
  styleUrls: ['./market-price-graph.css'],
})

export class MarketPriceGraphComponent implements OnChanges,OnDestroy,AfterViewInit  {

    public browserFingerPrint:any;
    public graphconfig: marketReplayGraphConfig = new marketReplayGraphConfig();
    public formGraphData: FormGroup;
    public priceDataArr:any=[];
    public priceChart;
    public playCounter:number=0;
    public isPlaying:boolean=false;
    public gotoSeqNo;
    public enaplay:boolean=true;
    public mainDataArr=[];
    @Input('runId') runId;
    @Input('mrSeqNo') mrSeqNo;
    @Input('headerDate') headerDate;
    @Input('headerFrom') headerFrom;

    public price=10;
   constructor(public cookieService: CookieService,  public restService: RestService,private AmCharts: AmChartsService,private zone: NgZone) {

   }
   ngOnInit() {
    this.browserFingerPrint = (new Fingerprint2()).getSync().fprint;
    this.formGraphData = new FormGroup({
        mrRecordTimeString:new FormControl('', [Validators.pattern(thisConstants.patterns.time)])
      });

  
     
let data={"responseCode":0,"responseMsg":"SUCCESS","resultData":{"file_name":"Order Log","file_Data":"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","fileFormat":".xlsx"}};
      var base64 = require('base64-js');
      var FileSaver = require('file-saver');
      if (data.responseMsg == "SUCCESS") {
          if (data.resultData && data.resultData.file_Data) {
              var base64file = data.resultData.file_Data;
              var file = new Blob([base64.toByteArray(base64file)]);
              FileSaver.saveAs(file, data.resultData.file_name + data.resultData.fileFormat);
          }
      } 
     
   }
   ngOnChanges() {    
  

   }

    playingGraph(goto:boolean=false) {
        this.isPlaying=true;
        if (goto) {
            this.fetchGraphData();      
        }
        else {
            if (this.priceDataArr.length > 0) {
                this.insertGraphData();
              } else {         
                this.fetchGraphData();           
              }
        }              
      }
  
   fetchGraphData() {

    var randomToken = this.cookieService.get('random-token'); 
    var randomFinger = this.browserFingerPrint + randomToken;
    let tempObj = this.formGraphData.getRawValue();              
    let jsonObject = {
          mrRunId: this.runId,
          mrSeqNmbr: this.mrSeqNo,
          lastSeqNmbr: this.priceDataArr.length != 0 ? this.priceDataArr[this.priceDataArr.length - 1].SEQNO : 0,
          randomFinger: randomFinger,
          mrRecordTimeString: this.headerDate +" "+(tempObj.mrRecordTimeString==""  ? this.headerFrom :tempObj.mrRecordTimeString),
          mrRcrdIndctr:"T",
          gotoStartSeqNmbr:this.gotoSeqNo
    }
    this.restService.postRequestWithParamaterForWebSocket('playPriceGraph',jsonObject).subscribe(res => {
        this.gotoSeqNo=0;
        if (res && res.responseCode==0 && res.resultData) {
            if (res.resultData.length > 0) {                                    
                this.mainDataArr=res.resultData;                   
                this.playCounter=0;
                this.insertGraphData();               
            }
            else {                  
                //this.plotGraph();
                this.enaplay=false;
            }                          
        }
    },
 err=>{
    //  let data={"responseCode":0,"responseMsg":"SUCCESS","resultData":[
    //      {"MRFILLPRICE":707.75,"SEQNO":163670,"MRJIFFYTMST":"11-03-2019 09:07:18.372"},{"MRFILLPRICE":707.75,"SEQNO":163671,"MRJIFFYTMST":"11-03-2019 09:07:18.372"},{"MRFILLPRICE":707.75,"SEQNO":163672,"MRJIFFYTMST":"11-03-2019 09:07:18.372"},{"MRFILLPRICE":707.75,"SEQNO":163673,"MRJIFFYTMST":"11-03-2019 09:07:18.372"},{"MRFILLPRICE":707.75,"SEQNO":163674,"MRJIFFYTMST":"11-03-2019 09:07:18.372"},{"MRFILLPRICE":707.75,"SEQNO":163675,"MRJIFFYTMST":"11-03-2019 09:07:18.372"},{"MRFILLPRICE":707.75,"SEQNO":163676,"MRJIFFYTMST":"11-03-2019 09:07:18.372"},{"MRFILLPRICE":707.75,"SEQNO":163677,"MRJIFFYTMST":"11-03-2019 09:07:18.372"},{"MRFILLPRICE":707.75,"SEQNO":163678,"MRJIFFYTMST":"11-03-2019 09:07:18.372"},{"MRFILLPRICE":707.75,"SEQNO":163679,"MRJIFFYTMST":"11-03-2019 09:07:18.372"},{"MRFILLPRICE":707.75,"SEQNO":1102818,"MRJIFFYTMST":"11-03-2019 09:18:00.789"},{"MRFILLPRICE":707.75,"SEQNO":1110923,"MRJIFFYTMST":"11-03-2019 09:18:02.428"},{"MRFILLPRICE":707.75,"SEQNO":1110924,"MRJIFFYTMST":"11-03-2019 09:18:02.428"},{"MRFILLPRICE":707.85,"SEQNO":1113615,"MRJIFFYTMST":""},{"MRFILLPRICE":707.85,"SEQNO":1136977,"MRJIFFYTMST":"11-03-2019 09:18:07.807"},{"MRFILLPRICE":708.95,"SEQNO":1136983,"MRJIFFYTMST":"11-03-2019 09:18:07.807"},{"MRFILLPRICE":709.0,"SEQNO":1161111,"MRJIFFYTMST":"11-03-2019 09:18:12.934"},{"MRFILLPRICE":709.0,"SEQNO":1244255,"MRJIFFYTMST":"11-03-2019 09:18:30.498"},{"MRFILLPRICE":710.0,"SEQNO":1244256,"MRJIFFYTMST":"11-03-2019 09:18:30.498"},{"MRFILLPRICE":711.1,"SEQNO":1844897,"MRJIFFYTMST":""},{"MRFILLPRICE":711.05,"SEQNO":1844898,"MRJIFFYTMST":""},{"MRFILLPRICE":711.0,"SEQNO":1844899,"MRJIFFYTMST":""},{"MRFILLPRICE":711.0,"SEQNO":1844900,"MRJIFFYTMST":""},{"MRFILLPRICE":710.2,"SEQNO":1844901,"MRJIFFYTMST":""},{"MRFILLPRICE":708.95,"SEQNO":2710277,"MRJIFFYTMST":"11-03-2019 09:25:28.618"},{"MRFILLPRICE":708.05,"SEQNO":2770263,"MRJIFFYTMST":"11-03-2019 09:25:48.587"},{"MRFILLPRICE":707.75,"SEQNO":2796997,"MRJIFFYTMST":"11-03-2019 09:25:57.580"},{"MRFILLPRICE":708.0,"SEQNO":3201265,"MRJIFFYTMST":"11-03-2019 09:28:18.226"},{"MRFILLPRICE":707.75,"SEQNO":3201266,"MRJIFFYTMST":"11-03-2019 09:28:18.226"},{"MRFILLPRICE":707.75,"SEQNO":3523538,"MRJIFFYTMST":"11-03-2019 09:30:14.237"},{"MRFILLPRICE":707.65,"SEQNO":3523539,"MRJIFFYTMST":"11-03-2019 09:30:14.237"},{"MRFILLPRICE":707.45,"SEQNO":3523545,"MRJIFFYTMST":"11-03-2019 09:30:14.237"},{"MRFILLPRICE":707.0,"SEQNO":3606167,"MRJIFFYTMST":"11-03-2019 09:30:41.231"},{"MRFILLPRICE":706.45,"SEQNO":3606168,"MRJIFFYTMST":"11-03-2019 09:30:41.231"},{"MRFILLPRICE":706.05,"SEQNO":3606169,"MRJIFFYTMST":"11-03-2019 09:30:41.231"},{"MRFILLPRICE":706.0,"SEQNO":3606172,"MRJIFFYTMST":"11-03-2019 09:30:41.231"},{"MRFILLPRICE":704.05,"SEQNO":4237510,"MRJIFFYTMST":"11-03-2019 09:34:55.908"},{"MRFILLPRICE":703.25,"SEQNO":4254848,"MRJIFFYTMST":"11-03-2019 09:35:01.356"},{"MRFILLPRICE":704.9,"SEQNO":4814382,"MRJIFFYTMST":""},{"MRFILLPRICE":703.3,"SEQNO":5075492,"MRJIFFYTMST":"11-03-2019 09:40:07.340"},{"MRFILLPRICE":703.25,"SEQNO":5075493,"MRJIFFYTMST":"11-03-2019 09:40:07.340"},{"MRFILLPRICE":703.0,"SEQNO":5075494,"MRJIFFYTMST":"11-03-2019 09:40:07.340"},{"MRFILLPRICE":702.85,"SEQNO":5075495,"MRJIFFYTMST":"11-03-2019 09:40:07.340"},{"MRFILLPRICE":702.45,"SEQNO":5075496,"MRJIFFYTMST":"11-03-2019 09:40:07.340"},{"MRFILLPRICE":702.05,"SEQNO":5075497,"MRJIFFYTMST":"11-03-2019 09:40:07.340"},{"MRFILLPRICE":702.05,"SEQNO":5075498,"MRJIFFYTMST":"11-03-2019 09:40:07.340"},{"MRFILLPRICE":701.65,"SEQNO":5075499,"MRJIFFYTMST":"11-03-2019 09:40:07.340"},{"MRFILLPRICE":701.25,"SEQNO":5075500,"MRJIFFYTMST":"11-03-2019 09:40:07.340"},{"MRFILLPRICE":702.0,"SEQNO":5310699,"MRJIFFYTMST":"11-03-2019 09:41:45.727"},{"MRFILLPRICE":700.5,"SEQNO":5336740,"MRJIFFYTMST":"11-03-2019 09:41:56.269"},{"MRFILLPRICE":700.45,"SEQNO":5336741,"MRJIFFYTMST":"11-03-2019 09:41:56.269"},{"MRFILLPRICE":700.4,"SEQNO":5336742,"MRJIFFYTMST":"11-03-2019 09:41:56.269"},{"MRFILLPRICE":700.3,"SEQNO":5336743,"MRJIFFYTMST":"11-03-2019 09:41:56.269"},{"MRFILLPRICE":700.25,"SEQNO":5336744,"MRJIFFYTMST":"11-03-2019 09:41:56.269"},{"MRFILLPRICE":700.25,"SEQNO":5336745,"MRJIFFYTMST":"11-03-2019 09:41:56.269"},{"MRFILLPRICE":700.05,"SEQNO":5336746,"MRJIFFYTMST":"11-03-2019 09:41:56.269"},{"MRFILLPRICE":700.05,"SEQNO":5336747,"MRJIFFYTMST":"11-03-2019 09:41:56.269"},{"MRFILLPRICE":700.05,"SEQNO":5336748,"MRJIFFYTMST":"11-03-2019 09:41:56.269"},{"MRFILLPRICE":700.05,"SEQNO":5336749,"MRJIFFYTMST":"11-03-2019 09:41:56.269"},{"MRFILLPRICE":703.85,"SEQNO":5344513,"MRJIFFYTMST":""},{"MRFILLPRICE":703.9,"SEQNO":5344514,"MRJIFFYTMST":""},{"MRFILLPRICE":703.95,"SEQNO":5344515,"MRJIFFYTMST":""},{"MRFILLPRICE":704.0,"SEQNO":5344516,"MRJIFFYTMST":""},{"MRFILLPRICE":701.05,"SEQNO":5371741,"MRJIFFYTMST":"11-03-2019 09:42:07.405"},{"MRFILLPRICE":703.15,"SEQNO":5376649,"MRJIFFYTMST":"11-03-2019 09:42:09.569"},{"MRFILLPRICE":703.15,"SEQNO":5376652,"MRJIFFYTMST":"11-03-2019 09:42:09.569"},{"MRFILLPRICE":703.15,"SEQNO":5376675,"MRJIFFYTMST":"11-03-2019 09:42:09.574"},{"MRFILLPRICE":701.25,"SEQNO":5681735,"MRJIFFYTMST":"11-03-2019 09:44:33.190"},{"MRFILLPRICE":701.2,"SEQNO":5681736,"MRJIFFYTMST":"11-03-2019 09:44:33.190"},{"MRFILLPRICE":701.0,"SEQNO":5681737,"MRJIFFYTMST":"11-03-2019 09:44:33.190"},{"MRFILLPRICE":700.05,"SEQNO":5710325,"MRJIFFYTMST":"11-03-2019 09:44:46.462"},{"MRFILLPRICE":700.0,"SEQNO":5710327,"MRJIFFYTMST":"11-03-2019 09:44:46.462"},{"MRFILLPRICE":700.0,"SEQNO":5710328,"MRJIFFYTMST":"11-03-2019 09:44:46.462"},{"MRFILLPRICE":700.0,"SEQNO":5710329,"MRJIFFYTMST":"11-03-2019 09:44:46.462"},{"MRFILLPRICE":700.0,"SEQNO":5715021,"MRJIFFYTMST":"11-03-2019 09:44:48.868"},{"MRFILLPRICE":700.25,"SEQNO":5725191,"MRJIFFYTMST":""}]};
     
 let data={"responseCode":0,"responseMsg":"SUCCESS","resultData":[
   
{"MRFILLPRICE":700,"SEQNO":163671,"MRJIFFYTMST":"11-03-2019 09:07:18.372"},
{"MRFILLPRICE":701,"SEQNO":163671,"MRJIFFYTMST":"11-03-2019 09:07:18.374"},
// {"MRFILLPRICE":1,"SEQNO":163671,"MRJIFFYTMST":"11-03-2019 09:07:18.375"},
// {"MRFILLPRICE":70,"SEQNO":163671,"MRJIFFYTMST":"11-03-2019 09:07:18.376"},
{"MRFILLPRICE":500,"SEQNO":163671,"MRJIFFYTMST":"11-03-2019 09:07:18.377"},
{"MRFILLPRICE":900,"SEQNO":163671,"MRJIFFYTMST":"11-03-2019 09:07:18.378"},
{"MRFILLPRICE":701,"SEQNO":1102818,"MRJIFFYTMST":"11-03-2019 09:18:00.789"},
{"MRFILLPRICE":702,"SEQNO":1110923,"MRJIFFYTMST":"11-03-2019 09:18:02.428"},

{"MRFILLPRICE":707.85,"SEQNO":1136977,"MRJIFFYTMST":"11-03-2019 09:18:07.807"},
{"MRFILLPRICE":708.95,"SEQNO":1136983,"MRJIFFYTMST":"11-03-2019 09:18:07.807"},
{"MRFILLPRICE":709.0,"SEQNO":1161111,"MRJIFFYTMST":"11-03-2019 09:18:12.934"},
{"MRFILLPRICE":709.0,"SEQNO":1244255,"MRJIFFYTMST":"11-03-2019 09:18:30.498"},
{"MRFILLPRICE":710.0,"SEQNO":1244256,"MRJIFFYTMST":"11-03-2019 09:18:30.498"},
{"MRFILLPRICE":708.95,"SEQNO":2710277,"MRJIFFYTMST":"11-03-2019 09:25:28.618"},
{"MRFILLPRICE":708.05,"SEQNO":2770263,"MRJIFFYTMST":"11-03-2019 09:25:48.587"},
{"MRFILLPRICE":707.75,"SEQNO":2796997,"MRJIFFYTMST":"11-03-2019 09:25:57.580"},
{"MRFILLPRICE":708.0,"SEQNO":3201265,"MRJIFFYTMST":"11-03-2019 09:28:18.226"},
{"MRFILLPRICE":707.75,"SEQNO":3201266,"MRJIFFYTMST":"11-03-2019 09:28:18.226"},
{"MRFILLPRICE":707.75,"SEQNO":3523538,"MRJIFFYTMST":"11-03-2019 09:30:14.237"},
{"MRFILLPRICE":707.65,"SEQNO":3523539,"MRJIFFYTMST":"11-03-2019 09:30:14.237"},
{"MRFILLPRICE":707.45,"SEQNO":3523545,"MRJIFFYTMST":"11-03-2019 09:30:14.237"},
{"MRFILLPRICE":707.0,"SEQNO":3606167,"MRJIFFYTMST":"11-03-2019 09:30:41.231"},
{"MRFILLPRICE":706.45,"SEQNO":3606168,"MRJIFFYTMST":"11-03-2019 09:30:41.231"},
{"MRFILLPRICE":706.05,"SEQNO":3606169,"MRJIFFYTMST":"11-03-2019 09:30:41.231"},
{"MRFILLPRICE":706.0,"SEQNO":3606172,"MRJIFFYTMST":"11-03-2019 09:30:41.231"},
{"MRFILLPRICE":704.05,"SEQNO":4237510,"MRJIFFYTMST":"11-03-2019 09:34:55.908"},
{"MRFILLPRICE":703.25,"SEQNO":4254848,"MRJIFFYTMST":"11-03-2019 09:35:01.356"},

{"MRFILLPRICE":703.3,"SEQNO":5075492,"MRJIFFYTMST":"11-03-2019 09:40:07.340"},
{"MRFILLPRICE":703.25,"SEQNO":5075493,"MRJIFFYTMST":"11-03-2019 09:40:07.340"},
{"MRFILLPRICE":703.0,"SEQNO":5075494,"MRJIFFYTMST":"11-03-2019 09:40:07.340"},
{"MRFILLPRICE":702.85,"SEQNO":5075495,"MRJIFFYTMST":"11-03-2019 09:40:07.340"},
{"MRFILLPRICE":702.45,"SEQNO":5075496,"MRJIFFYTMST":"11-03-2019 09:40:07.340"},
{"MRFILLPRICE":702.05,"SEQNO":5075497,"MRJIFFYTMST":"11-03-2019 09:40:07.340"},
{"MRFILLPRICE":702.05,"SEQNO":5075498,"MRJIFFYTMST":"11-03-2019 09:40:07.340"},
{"MRFILLPRICE":701.65,"SEQNO":5075499,"MRJIFFYTMST":"11-03-2019 09:40:07.340"},
{"MRFILLPRICE":701.25,"SEQNO":5075500,"MRJIFFYTMST":"11-03-2019 09:40:07.340"},
{"MRFILLPRICE":702.0,"SEQNO":5310699,"MRJIFFYTMST":"11-03-2019 09:41:45.727"},
{"MRFILLPRICE":700.5,"SEQNO":5336740,"MRJIFFYTMST":"11-03-2019 09:41:56.269"},
{"MRFILLPRICE":700.45,"SEQNO":5336741,"MRJIFFYTMST":"11-03-2019 09:41:56.269"},
{"MRFILLPRICE":700.4,"SEQNO":5336742,"MRJIFFYTMST":"11-03-2019 09:41:56.269"},
{"MRFILLPRICE":700.3,"SEQNO":5336743,"MRJIFFYTMST":"11-03-2019 09:41:56.269"},
{"MRFILLPRICE":700.25,"SEQNO":5336744,"MRJIFFYTMST":"11-03-2019 09:41:56.269"},
{"MRFILLPRICE":700.25,"SEQNO":5336745,"MRJIFFYTMST":"11-03-2019 09:41:56.269"},
{"MRFILLPRICE":700.05,"SEQNO":5336746,"MRJIFFYTMST":"11-03-2019 09:41:56.269"},

{"MRFILLPRICE":701.05,"SEQNO":5371741,"MRJIFFYTMST":"11-03-2019 09:42:07.405"},
{"MRFILLPRICE":703.15,"SEQNO":5376649,"MRJIFFYTMST":"11-03-2019 09:42:09.569"},
{"MRFILLPRICE":703.15,"SEQNO":5376652,"MRJIFFYTMST":"11-03-2019 09:42:09.569"},
{"MRFILLPRICE":703.15,"SEQNO":5376675,"MRJIFFYTMST":"11-03-2019 09:42:09.574"},
{"MRFILLPRICE":701.25,"SEQNO":5681735,"MRJIFFYTMST":"11-03-2019 09:44:33.190"},
{"MRFILLPRICE":701.2,"SEQNO":5681736,"MRJIFFYTMST":"11-03-2019 09:44:33.190"},
{"MRFILLPRICE":701.0,"SEQNO":5681737,"MRJIFFYTMST":"11-03-2019 09:44:33.190"},
{"MRFILLPRICE":700.05,"SEQNO":5710325,"MRJIFFYTMST":"11-03-2019 09:44:46.462"},
{"MRFILLPRICE":700.0,"SEQNO":5710327,"MRJIFFYTMST":"11-03-2019 09:44:46.462"},

]};
        
      this.mainDataArr=data.resultData;                   
      this.playCounter=0;
      this.insertGraphData();
      //this.plotGraph();
 }


  );

   }


   ngOnDestroy() {
    if (this.priceChart) {
      this.AmCharts.destroyChart(this.priceChart);      
    }
    this.priceDataArr=[];
  }
  plotGraph(graphData) {
 
  
    graphData.sort(function (a, b) {
    return +new Date(a.MRJIFFYTMST) - +new Date(b.MRJIFFYTMST);
  });
  
  this.graphconfig.priceGraph.panels[0].valueAxes[0].maximum=Math.floor(Math.min.apply(Math,graphData)) == 0 ? 1 : Math.floor(Math.min.apply(Math,graphData));
  this.graphconfig.priceGraph.panels[0].valueAxes[0].minimum=Math.ceil(Math.max.apply(Math,graphData));
    if(!this.priceChart) {        
        this.graphconfig.priceGraph.dataSets[0].dataProvider=graphData;
        let ele=document.getElementById("chartdiv");
        this.priceChart=this.AmCharts.makeChart(ele,this.graphconfig.priceGraph);          
    }
    else {
        this.AmCharts.updateChart(this.priceChart, () => {
            // Change whatever properties you want    
            this.priceChart.dataSets[0].dataProvider= this.priceChart.dataSets[0].dataProvider.concat(graphData);
            this.priceChart.ignoreZoom = true;                   
            this.priceChart.validateData();            
          });
    }      
  }
  ngAfterViewInit() {
      
  }
  insertGraphData() {

    
    if(this.playCounter <= this.mainDataArr.length-1) {
        setTimeout(()=>{
                console.log(this.playCounter);
                let data = this.mainDataArr[this.playCounter];                  
                console.log(data);          
                if(data.MRJIFFYTMST!="") {
                    let tmptm=data["MRJIFFYTMST"]; 
                    data.tm=tmptm.split(" ")[1];                     
                    data.MRJIFFYTMST=new Date(data.MRJIFFYTMST);                                                
                    this.priceDataArr.push(data);     
                }    
                this.playCounter++; 
                var mod  = (this.playCounter+1) % 50;
                if (mod === 0) {
                    let data1= this.priceDataArr;
                    this.priceDataArr=[];
                   this.plotGraph(data1);
                
                } 
                if (this.isPlaying) {    
                    this.insertGraphData();          
                } 
            },0.5)       
    }
    else {
        this.fetchGraphData();
    }
   

  }

  goToButtonClickEvent() {
   
    let tempObj = this.formGraphData.getRawValue();
    var jsonObject = {
      mrSeqNmbr: this.mrSeqNo,
      mrRecordTimeString: tempObj.mrRecordTimeString.trim().length > 0 ? this.headerDate + " " + tempObj.mrRecordTimeString : tempObj.mrRecordTimeString,     
      mrBuyPan: '',
      mrSellPan: '',
      mrBroker: '',
      mrOrderNmbr: '',
      mrFillNmbr: '',
      mrRunId: this.runId
    }
    this.restService.postRequestWithParamater('goToMarketReplay', jsonObject).subscribe(data => { 
        this.gotoSeqNo=data.resultData;
    }    
    );
  }

  pauseGraph() {
      this.isPlaying=false;
      let data=this.priceDataArr;
      this.priceDataArr=[];
      this.plotGraph(data);

  }
  refreshButtonClickEvent() {
      this.priceDataArr = [];
      this.priceChart.clear();
      this.playCounter = 0;
      this.isPlaying   = false;
      this.enaplay     = true;
  }

}