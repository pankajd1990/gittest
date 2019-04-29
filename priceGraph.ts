declare var require: any;
import * as $ from 'jquery'
import * as echarts from 'echarts';
import { Router, ActivatedRoute } from '@angular/router';

import { Component, OnInit, HostBinding, OnDestroy,OnChanges,Input,AfterViewInit,NgZone } from '@angular/core';

import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
@Component({
  selector:'market-price-graph',
  template: `
  <div class="row" style="height:92%">
  <div class="col-md-12" style="height:100%">
  <div id="chartdiv"></div>	
  <input type='button' value='Show graph' (click)="playingGraph();">  
  <input type='button' value='pauseGraph' (click)="pauseGraph();">  
  </div>
  </div>
  `,

})

export class MarketPriceGraphComponent implements OnChanges,OnDestroy,AfterViewInit  {

    public browserFingerPrint:any;

    public formGraphData: FormGroup;
    public priceDataArr:any=[];
    public priceChart;
    public playCounter:number=0;
    public isPlaying:boolean=false;
    public gotoSeqNo;
    public enaplay:boolean=true;
    public mainDataArr=[];
    public graphArr=[];

//   public graphconfig= {
//     "type": "stock",
//     "theme": "none",
//     glueToTheEnd:true,
//     zoomOutOnDataSetChange:true,
//     "categoryAxesSettings": {
//       "minPeriod": "mm",
//       "groupToPeriods": ["mm"],
//       equalSpacing:true,
//     },
  
//     "dataSets": [ {
//       "color": "#b0de09",
//       "fieldMappings": [ {
//         "fromField": "value",
//         "toField": "value"
//       } ],
  
//       "dataProvider": [],
//       "categoryField": "date"
//     } ],
  
//     "panels": [ {
//       "showCategoryAxis": false,
//       "title": "Value",
//       "percentHeight": 70,
  
//       "stockGraphs": [ {
//         "id": "g1",
//         "valueField": "value",
//         "type": "smoothedLine",
//         "lineThickness": 2,
//         "bullet": "round"
//       } ],
  
  
//       "stockLegend": {
//         "valueTextRegular": " ",
//         "markerType": "none"
//       }
//     } ],
  
//     "chartScrollbarSettings": {
//       "graph": "g1",
//       "usePeriod": "mm",
//       "position": "top"
//     },
//     "chartScrollbar": {
//         "graph": "g1",
//         "scrollbarHeight": 40,
//         "color": "#FFFFFF",
//         "autoGridCount": true
//       },
  
//     "chartCursorSettings": {
//       "valueBalloonsEnabled": true
//     },
//   "chartCursor": {
//     "cursorPosition": "mouse"
//   },
//     "periodSelector": {
//       "position": "top",
//       "dateFormat": "YYYY-MM-DD JJ:NN",
//       "inputFieldWidth": 150,
//       "periods": [ {
//         "period": "hh",
//         "count": 1,
//         "label": "1 hour"
//       }, {
//         "period": "hh",
//         "count": 2,
//         "label": "2 hours"
//       }, {
//         "period": "hh",
//         "count": 5,
//         "selected": true,
//         "label": "5 hour"
//       }, {
//         "period": "hh",
//         "count": 12,
//         "label": "12 hours"
//       }, {
//         "period": "MAX",
//         "label": "MAX"
//       } ]
//     },
  
//     "panelsSettings": {
//       "usePrefixes": true
//     },
  
//     "export": {
//       "enabled": true,
//       "position": "bottom-right"
//     }
//   } 

public graphconfig={
    type: "stock",
    theme: "none",   
    glueToTheEnd:true,
    zoomOutOnDataSetChange:true,
    categoryAxis:{  
        showFirstLabel:true,
        showLastLabel:true,        
        gridPosition: "start",
        gridAlpha: 1,     
    tickPosition: "start",   
    tickLength: 20,
    autoGridCount :true,
    centerLabels:true,
    autoRotateAngle:true,
    autoRotateCount:2,
    autoWrap:true,
    fontSize:15,
 
    dateFormats:[{"period":"fff","format":"JJ:NN:SS.QQQ"},{"period":"ss","format":"JJ:NN:SS"},{"period":"mm","format":"JJ:NN"},{"period":"hh","format":"JJ:NN"}],           
    },
    valueAxesSettings :{
        gridThickness:1,    
        axisColor:"black",
        showLastLabel:true,
        axisThickness:1,
        inside:false,
        axisAlpha:1,
        unitPosition:"left",
        tickLength:1,        
    
        autoWrap:true,
        labelRotation:-90
    },
    categoryAxesSettings: {
      minPeriod:"fff",
      groupToPeriods:["fff"],
      color:"black",
      axisColor:"black",    
      minHorizontalGap:100,
      axisAlpha:1,    
     dateFormats:[{"period":"fff","format":"JJ:NN:SS.QQQ"},{"period":"ss","format":"JJ:NN:SS"},{"period":"mm","format":"JJ:NN"},{"period":"hh","format":"JJ:NN"}],           
      equalSpacing:true,
      gridPosition: "start",
      gridAlpha: 1,
      tickPosition: "start",
      tickLength: 5,
      inside:false,
      fontSize:15,
     
     
      autoWrap:true,
    } ,
    dataSets: [ {
      color: "black",
      fieldMappings: [ {
        fromField: "value",
        toField: "value"
      }     
    ],
     dataProvider:[],
      categoryField: "date",      
       stockEvents: []
    } ],
  
  
    panels: [ {
       
      title: "Price",
      marginTop:100,
      autoMargins:false,
      percentHeight:60,
      showCategoryAxis: true,
      valueAxes: [{
        position: "left",        
        id:"p1",              
        inside:false,     
        color: "black", 
        axisColor:"green", 
        axisAlpha:1,
        title:"Price",
        axisThickness:5,   
        minMarginTop:20,
        marginTop:20,             
        labelOffset:3,
       
      
        fontSize:15,
        "useDataSetColors": false,      
      },     
    ],
      stockGraphs: [ {
        id: "g1",
        valueField: "value",
        showAllValueLabels:true,
        valueAxis:"p1",
        type: "smoothedLine",
        lineThickness: 1,
        bullet: "round",   
        bulletAlpha:0,
     
        bulletSize:0,
        balloonColor:"black",
        lineColor: "red",
        showBalloon:true,
        
        balloonText:"Time:<b>[[tm]]</b><br> Price:-<b>[[value]]</b>",
        
        gapPeriod:5,
        "useDataSetColors": false,    
       
        




      } ],

     
      stockLegend: {
        valueTextRegular: " ",
        markerType: "square"
    }
    } ],
 

    chartScrollbarSettings: {
      graph: "g1",     
      position:"bottom"
    },
    chartScrollbar:{
        offset:1400,
        scrollbarHeight: 10,
        autoGridCount:true,
        dragIconWidth:20
       
    },
    chartCursorSettings: {
      valueBalloonsEnabled: true,
      graphBulletSize: 1,
      valueLineBalloonEnabled: true,
      valueLineEnabled: true,
      valueLineAlpha: 0.5,
      enabled:false,
      categoryBalloonDateFormats: [{
        period: "fff",
        format: "NN:SS:QQQ"
    }]
    },        
    panelsSettings: {
      usePrefixes: true,
      marginLeft:60,      
      marginTop:10, 
    },   
    "export": {
        "enabled": true,
        "position":"top-right"
      },
    listeners: [ {
        event: "dataUpdated",
        method: function(event) {
           
        }
      } ]
    }
    
    
  

    public price=10;
    constructor(private zone: NgZone,private AmCharts: AmChartsService,private http: HttpClient){


   }
   ngOnInit() {

    window.addEventListener('resize', (event)=>{
        //this.priceChart.invalidateSize();
      });
    

   }
   ngOnChanges() {    
  

   }

    playingGraph(goto:boolean=false) {
        this.isPlaying=true;
        if (goto) {
            this.fetchGraphData();      
        }
        else {
            if (this.mainDataArr.length > 0) {
                this.insertGraphData();
              } else {         
                this.fetchGraphData();           
              }
        }              
      }
  
   fetchGraphData() {

  
    let jsonObject = {
        lastSeqNmbr:this.mainDataArr.length  > 0 ? this.mainDataArr[ this.mainDataArr.length-1].id :0
    }
    this.http
    .post(
      "http://localhost/ang1/blog/public/getGraphdt",jsonObject,{}
      
    )
    .subscribe(data => {
        //console.log(data["resultData"].graphArr);
        if( data["resultData"].graphArr.length >0) {
            
            this.mainDataArr=data["resultData"].graphArr;  
           console.log("api called");
            this.playCounter=0;
            this.insertGraphData();  
           // this.plotGraph( this.mainDataArr);
        }
        else {
            this.isPlaying=false;
            this.mainDataArr=[];
        }
                   
    });

   }


   ngOnDestroy() {
    // if (this.priceChart) {
    //   this.AmCharts.destroyChart(this.priceChart);      
    // }
    // this.priceDataArr=[];
  }
  plotGraph(data) {

   data.sort(function (a, b) {
    return +new Date(a.time) - +new Date(b.time);
  });
  let httpHeaders = new HttpHeaders({
    'Content-Type' : 'application/json',
    'Cache-Control': 'no-cache'
     });   
     let options = {
        headers: httpHeaders
   }; 


  this.http
  .post(
    "http://localhost/ang1/blog/public/setGraphDatatmp",{tmpdata:data},options
    
  )
  .subscribe(resdata => {
  
    if(!this.priceChart) {               
      console.log("new graph");
      this.graphconfig.dataSets[0].dataProvider=data;
      let ele=document.getElementById("chartdiv");
      this.priceChart=this.AmCharts.makeChart(ele,this.graphconfig);
   
   
  }
  else {
      this.AmCharts.updateChart(this.priceChart, () => {       
         
          this.priceChart.dataSets[0].dataProvider= this.priceChart.dataSets[0].dataProvider.concat(data);
          this.priceChart.ignoreZoom = true;
          this.priceChart.validateData();
        
          // data.forEach(element => {
             
          //     this.priceChart.dataSets[0].dataProvider.push(element);
          //     this.priceChart.ignoreZoom = true;
          //     this.priceChart.validateData();
             
         // });
        
      
         console.log("update graph");
       
       
        });
  }
    

  
  });



          
  }
  ngAfterViewInit() {
      
  }
  insertGraphData() {

    
    if(this.playCounter <= this.mainDataArr.length-1) {
        let data = this.mainDataArr[this.playCounter]; 
        setTimeout(()=>{
               console.log(this.playCounter);
                               
               //console.log(data);          
                if(data.time!="") {     
                    //console.log(data) 
                  this.graphArr.push(data);     
                    
                }    
                
                //console.log("Length"+ this.graphArr.length);
                
                var mod  = (this.playCounter+1) % 50;
                if (mod === 0) {
                   // let resdata=this.priceDataArr;
                   let data1= this.graphArr;
                   this.graphArr=[];
                   this.plotGraph(data1); 
                    //console.log(this.graphArr);
                    
              
                } 
                this.playCounter++;
                if (this.isPlaying) {    
                    this.insertGraphData();          
                } 
            },0.2)       
    }
    else {
        this.fetchGraphData();
    }
   

  }

  goToButtonClickEvent() {
   
    let tempObj = this.formGraphData.getRawValue();
    var jsonObject = {
   
    }
   

    this.http
    .post(
      "http://localhost/ang1/blog/public/setGraphData",{},{}
      
    )
    .subscribe(data => {
   
      
     
    ;
    });


  }

  pauseGraph() {
      this.isPlaying=false;
      console.log( this.graphArr);
      let data=this.graphArr;
      this.graphArr=[];
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