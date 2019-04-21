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
declare var $ :any;
am4core.useTheme(am4themes_animated);

@Component({
    selector: "am-chart-multiple",
    template:`<div>
    Value axis
    <div id="chartdiv" style="width: 100%; height: 500px"></div>
    </div>`
  })
  export class MultipleValueAxisAMComponent implements OnDestroy,AfterViewInit  {
    private chart;

   constructor(private zone: NgZone){

   }
   ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
    this.chart = am4core.create("chartdiv", am4charts.XYChart);
        this.chart.data = [{
            "category": "Research & Development",
            "value": 3.5,
            "payment":1000,
            "price":100,
            "showBalloon": true
          }, {
            "category": "Marketing",
            "value": 6,
            "payment":4000,
            "price":200000
          }, {
            "category": "Distribution",
            "value": 16,
            "payment":20000,
            "price":500000          }];

          let categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
          categoryAxis.dataFields.category = "category";
          
          let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
          let value1Axis = this.chart.yAxes.push(new am4charts.ValueAxis());
          let value2Axis = this.chart.yAxes.push(new am4charts.ValueAxis());
          value1Axis.title.text = "Units sold";
          value2Axis.title.text = "Price";
          
          // Create series
          var series = this.chart.series.push(new am4charts.ColumnSeries());
          series.dataFields.valueY = "value";
          series.dataFields.categoryX = "category";
          series.name = "Sales";


          var series2 = this.chart.series.push(new am4charts.LineSeries());
          series2.dataFields.valueY = "payment";
          series2.dataFields.categoryX = "category";
          series2.name = "Units";
          series2.tooltipText = "{name}: [bold]{valueY}[/]";
          series2.strokeWidth = 3;
          series2.yAxis = value1Axis;
          value1Axis.renderer.opposite = true;

          var series3 = this.chart.series.push(new am4charts.LineSeries());
          series3.dataFields.valueY = "price";
          series3.dataFields.categoryX = "category";
          series3.name = "price";
          series3.tooltipText = "{name}: [bold]{valueY}[/]";
          series3.strokeWidth = 3;
          series3.yAxis = value2Axis;
          value2Axis.renderer.opposite = true;




          this.chart.cursor = new am4charts.XYCursor();
          let axisTooltip = categoryAxis.tooltip;
          axisTooltip.background.fill = am4core.color("red");
          axisTooltip.background.strokeWidth = 0;
          axisTooltip.background.cornerRadius = 3;
          axisTooltip.background.pointerLength = 0;
          axisTooltip.dy = 5;


          var bullet = series3.bullets.push(new am4charts.Bullet());
          bullet.valueY=500000;

          var square = bullet.createChild(am4core.Rectangle);
          square.width = 10;
          square.height = 10;


          var range = valueAxis.createSeriesRange(series);
        range.value = 1;
        range.endValue = 11;
        range.contents.stroke = am4core.color("blue");
        range.contents.fill = range.contents.stroke;

          categoryAxis.adapter.add("getTooltipText", (text) => {
            return ">>> [bold]" + text + "[/] <<<";
           });


    });
  }

ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
}

  }




  