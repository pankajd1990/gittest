import { Component,OnInit,AfterViewChecked,OnDestroy,AfterViewInit,NgZone} from '@angular/core';
import { Title }     from '@angular/platform-browser';
import {GridOptions} from "ag-grid-community";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { HEADER_OFFSET } from '@angular/core/src/render3/interfaces/view';
import {AppService} from '../../app.service';
import { Router } from "@angular/router";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";


declare var $ :any;
am4core.useTheme(am4themes_animated);

@Component({
    selector: "am-chart-multiple",
    template:`<div style='margin-left:60px'>
    Event Marker
    <div id="chartdiv" style="width: 80%; height: 500px"></div>
    </div>`
  })
  export class EventMarkerAxisAMComponent implements OnDestroy,AfterViewInit  {
    private chart;
    public chartData=[];

   constructor(private zone: NgZone,private AmCharts: AmChartsService,private http: HttpClient){

   }
   ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
    let cnt=0;
    let val=100;
  //   let tmp= setInterval(()=> {
  //       var d = new Date();
      
  //       this.chartData.push({
  //         date:d.toISOString(),
  //         value:val++,
  //         price:20,
  //         volume:40,
  //         category:"MAR"
  //       })
        
  //      if(cnt==20) {
  //        //this.drawChart();
  //        console.log("print chart");
  //        clearInterval(tmp);
  //        val=0;
  //        console.log(this.chartData);
  //      }
  // cnt++;

  //     },500)
   

    this.getGraphData();

   



    })
  }

ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
}


generateChartData() {
  
 
// this.chartData=[];
//   this.chartData[0]={
//     date:new Date(2019,4,11,23,11,1,331),
//     value:1400,
//     price:100,
//     volume:20,
//     category:"JAN"
// }

// this.chartData[1]={
//   date:new Date(2019,4,11,23,11,2,334),
//     value:100,
//     price:15,
//     volume:30,
//     category:"FEB"

// }
// this.chartData[2]={
//     date:new Date(2019,4,11,23,11,2,335),
//     value:110,
//     price:20,
//     volume:40,
//     category:"MAR"
// }
// this.chartData[3]={
//     date:new Date(2019,4,11,23,11,2,300),
//     value:50,
//     price:50,
//     volume:50,
//     category:"APR"
// }
// this.chartData[4]={
//     date:new Date(2019,4,11,23,11,2,400),
//     value:2,
//     price:90,
//     volume:60,
//     category:"MAY"
// }
// this.chartData[5]={
//     date:new Date(2019,4,11,23,11,2,500),
//     value:200,
//     price:300,
//     volume:70,
//     category:"JUN"
// }


console.log(this.chartData);
  return this.chartData;
}

drawChart() {
  this.chart = this.AmCharts.makeChart("chartdiv", {

    type: "stock",
    "theme": "light",
 
    pathToImages: "http://www.amcharts.com/lib/3/images/",
   
    categoryAxesSettings: {
        minPeriod: "fff", // set minimum to milliseconds,
        groupToPeriods:["1fff"],   
        color:"red",     
      
    },

    dataSets: [{
     
        fieldMappings: [{
            fromField: "value",
            toField: "value"
        }, {
            fromField: "volume",
            toField: "volume"
        },
        {
          fromField: "price",
          toField: "price"
      }
      ],
     
        dataProvider: this.chartData,
        categoryField: "date",
        stockEvents: [ {
          "date": new Date("2019-04-22 10:10:40.521241"),
          "type": "sign",
          "backgroundColor": "#85CDE6",
          "graph": "g1",
          "text": "S",
          "description": "This is description of an event"
        },
        {
          "date": new Date("2019-04-22 10:11:20.572532"),
          "type": "sign",
          "backgroundColor": "#85CDE6",
          "graph": "g1",
          "text": "S",
          "description": "This is description of an event"
        },
        {
          "date": new Date("2019-04-22 10:11:20.572532"),
          "type": "sign",
          "backgroundColor": "#85CDE6",
          "graph": "g1",
          "text": "S",
          "description": "This is description of an event"
        },
        {
          "date": new Date("2019-04-22 10:11:20.572532"),
          "type": "sign",
          "backgroundColor": "#85CDE6",
          "graph": "g1",
          "text": "S",
          "description": "This is description of an event"
        },
        {
          "date": new Date("2019-04-22 10:11:20.572532"),
          "type": "sign",
          "backgroundColor": "#85CDE6",
          "graph": "g1",
          "text": "S",
          "description": "This is description of an event"
        },
        {
          "date": new Date("2019-04-22 10:11:20.572532"),
          "type": "sign",
          "backgroundColor": "#85CDE6",
          "graph": "g1",
          "text": "S",
          "description": "This is description of an event"
        },
      
      
      
      ]
    }],


    panels: [{
        showCategoryAxis: true,
    
        percentHeight: 70,
        valueAxes: [{
          position: "left",
          title:'pankaj',
          id:"pan1",              
          inside:false,
          labelRotation:-90,
          color: "green",        
        },
        {
          position: "right",
          title:'pankaj',
          id:"pan2",          
          color: "red",
         
        }
      
      ],
        stockGraphs: [{
            id:"g1",
            lineColorField:"red",
            valueField: "value",
            type: "smoothedLine",
            lineThickness: 1,
            bullet: "round",           
            valueAxis:"pan1",
            bulletSize:2,
            balloonColor:"blue",
            lineColor: "red",
            "useDataSetColors": false,
            balloonFunction:()=>{
              return "PANKAJ";
            }
         
        },
        {
          id: "g2",
          valueField: "price",   
          lineColor: "green",
          lineThickness:3,
          lineAlpha:1,
          type: "column",        
           
          "useDataSetColors": false,  
          valueAxis:"pan2",   
         
        },
      
      ],

        minMarginLeft:90,
        stockLegend: {
            valueTextRegular: " ",
            markerType: "none"
        }
    },
  

 ],

 valueAxesSettings:{
  "inside": false,
  fillColor:'green'
},
    chartScrollbarSettings: {
        graph: "g1",
        usePeriod:"fff",
        position: "left",
        
    },

    chartCursorSettings: {
        valueBalloonsEnabled: true,
        categoryBalloonDateFormats: [{
            period: "fff",
            format: "NN:SS:QQQ"
        }]
    },

    periodSelector: {

    },
   

    panelsSettings: {
        usePrefixes: true,
        marginLeft:50,
        marginRight:50
    },
});
}


getGraphData() {

  this.http
  .get(
    "http://localhost/ang1/blog/public/getGraphdt",
    
  )
  .subscribe(data => {
 
    let res=data['resultData'].graphArr;
    let price=0;
    res.forEach(element => {
       element.date=new Date(element.time).toISOString();
       element.color='green';
      
       element.price=price;
       if(element.id%10==0) {
        element.value=0;
        element.price=0;
       }
       if(element.id%20==0) {
        element.price=price-10;;

       }
       price++;
       
    });
    this.chartData=res;
    console.log(this.chartData);

  this.drawChart();
  });

}









  }




  