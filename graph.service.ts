import * as echarts from 'echarts';
import * as SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';

import Fingerprint2 from 'fingerprintjs2sync';

import { Base64 } from 'js-base64';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { CONSTANT } from '../ng-utility/ng.constant';
import { mrConstant } from '../ng-utility/mrConstant';
import { thisConstants } from '../ng-component/market-component/market.replay/market.replay.constant';
import { marketReplayGraphConfig } from '../ng-component/market-component/market.replay/marketReplay-graphs.conf';
import * as _ from 'lodash'; 
@Injectable()
export class GraphService {
 public graphconfig: marketReplayGraphConfig = new marketReplayGraphConfig();
 public uniqueArr=[];
 public priceArr=[];
 public indArr=[];
 public volArr=[];
 public eleChartsRout;
 constructor(){
   
 }

marketRepayGraph(marketRepaydata,eventData,flag){
    this.uniqueArr=[];
    this.priceArr=[];
    this.indArr=[];
    this.volArr=[];  
   marketRepaydata.forEach((rowData,key) => {    
       var recTime = rowData.mrRecordTimeString;
       var ltp;
      if (recTime) {     
        if (this.uniqueArr.length == 0) {
            if(flag.gotoStartSeqNmbr === 0){
                if (recTime!= flag.headerFrom) {                                               
                  this.uniqueArr.splice(0, 0, flag.headerFrom);                   
                }
                else{
                    this.uniqueArr.splice(0, 0,recTime);
                }               
            }
            else{
                this.uniqueArr.splice(0, 0, flag.gotoFormObj.frmtm);         
            }
            if (rowData.mrRcrdIndctr == mrConstant.MR_BUY_SELL_FLAG_TRADE) {
                ltp=rowData.mrFillPrice;
            } else {
                ltp=rowData.mrTradePrice;
            }  
            this.priceArr.splice(0, 0, ltp);
            this.volArr.splice(0,0,(marketRepaydata[0].mrFillQty=='' ? 0 : marketRepaydata[0].mrFillQty));           
        }

        if (this.uniqueArr.indexOf(recTime) === -1) {
            this.uniqueArr.push(recTime);
            if (rowData.mrRcrdIndctr == mrConstant.MR_BUY_SELL_FLAG_TRADE) {
                this.priceArr.push(rowData.mrFillPrice);
            } else {
                this.priceArr.push(rowData.mrTradePrice);
            }
            this.volArr.push(rowData.mrFillQty);
            this.indArr.push(rowData.mrIndexVal);
        } else {
            this.uniqueArr[this.uniqueArr.indexOf(recTime)] = recTime;
            if (rowData.mrRcrdIndctr == mrConstant.MR_BUY_SELL_FLAG_TRADE) {
                this.priceArr[this.uniqueArr.indexOf(recTime)] = rowData.mrFillPrice;
            } else {
                this.priceArr[this.uniqueArr.indexOf(recTime)] = rowData.mrTradePrice;
            }
            if(!isNaN(rowData.mrFillQty)){
                this.volArr[this.uniqueArr.indexOf(recTime)] += Number(rowData.mrFillQty);
            }                       
            this.indArr[this.uniqueArr.indexOf(recTime)] = rowData.mrIndexVal;
        }
    }

   });


    for (var i = 0; i < this.indArr.length; i++) {
        if (this.indArr[i] === 0) {
            this.indArr.splice(i, 1);
        }
    }
    
    this.graphconfig.marketReplay.dataZoom[0].startValue = this.uniqueArr[0];
    this.graphconfig.marketReplay.xAxis[0].data =this.uniqueArr;
    this.graphconfig.marketReplay.yAxis[0].min = Math.floor(Math.min.apply(Math, this.priceArr)) == 0 ? 1 : Math.floor(Math.min.apply(Math, this.priceArr));
    this.graphconfig.marketReplay.yAxis[0].max = Math.ceil(Math.max.apply(Math, this.priceArr));
    this.graphconfig.marketReplay.series[0].data = this.priceArr;

    this.graphconfig.marketReplay.yAxis[1].min = Math.floor(Math.min.apply(Math, this.volArr)) == 0 ? 1 : Math.floor(Math.min.apply(Math, this.volArr));
    this.graphconfig.marketReplay.yAxis[1].max = Math.ceil(Math.max.apply(Math, this.volArr));
    this.graphconfig.marketReplay.series[1].data = this.replaceCharactr(this.volArr);

    this.graphconfig.marketReplay.yAxis[2].min = Math.floor(Math.min.apply(Math, this.indArr)) == 0 ? 1 : Math.floor(Math.min.apply(Math, this.indArr));
    this.graphconfig.marketReplay.yAxis[2].max = Math.ceil(Math.max.apply(Math, this.indArr));
    this.graphconfig.marketReplay.series[2].data = this.replaceCharactr(this.indArr);
    let uniqueEventArr=_.uniqWith(eventData, _.isEqual);
   let markPointArr=this.MarkPointGraph(uniqueEventArr);
   this.graphconfig.marketReplay.series[0].markPoint.data = markPointArr;  
    if (flag.showIndex) {
        this.graphconfig.marketReplay.legend.data = ['P', 'V', 'I'];
        this.graphconfig.marketReplay.yAxis[2].show = true;
    }
    else {
        this.graphconfig.marketReplay.legend.data = ['P', 'V'];
        this.graphconfig.marketReplay.yAxis[2].show = false;
    }
       var option={};
        option = this.graphconfig.marketReplay;
        //var chart = echarts.init(this.eleChartsRout);
        this.eleChartsRout.on("legendselectchanged",(param)=>{
            console.log(param);
           if(param.name=="P"){
              if(param.selected.P){
                this.graphconfig.marketReplay.yAxis[0].axisLabel.show = true;
                this.graphconfig.marketReplay.yAxis[0].axisTick.show = true;
              }
              else{
                this.graphconfig.marketReplay.yAxis[0].axisLabel.show = false;
                this.graphconfig.marketReplay.yAxis[0].axisTick.show = false;
              }
           }
           if(param.name=="V"){
            if(param.selected.V){
              this.graphconfig.marketReplay.yAxis[1].axisLabel.show =true;
              this.graphconfig.marketReplay.yAxis[1].axisTick.show = true;
            }
            else{
              this.graphconfig.marketReplay.yAxis[1].axisLabel.show = false;
              this.graphconfig.marketReplay.yAxis[1].axisTick.show = false;
            }
         }
         if(param.name=="I"){
            if(param.selected.I){
              this.graphconfig.marketReplay.yAxis[2].axisLabel.show = true;
              this.graphconfig.marketReplay.yAxis[2].axisTick.show = true;
            }
            else{
              this.graphconfig.marketReplay.yAxis[2].axisLabel.show = false;
              this.graphconfig.marketReplay.yAxis[2].axisTick.show = false;
            }
         }
         this.eleChartsRout.setOption(option);
       });
      this.eleChartsRout.setOption(option);

}
replaceCharactr(arr){ 
    let replacedArr=arr.map(function(item) { return item == 0 ? null : item});
    return replacedArr;
}
MarkPointGraph(eventArr){
    let reteventArr=[];
    let tempemp=[];
    let tmp=0;
    var offset;
    eventArr.forEach((eventval) => {
        if(this.uniqueArr.indexOf(eventval.mrEventTime) !== -1) {
            if(!tempemp.includes(eventval.mrEventTime)){
                tempemp.push(eventval.mrEventTime);
                tmp=0;
                offset = [0,tmp];
            }
            else{
                tmp=tmp-22;
                offset = [0,tmp];
            }           
           var markPoint = {
                        symbolSize: 25,
                        tooltip:{
                            formatter: function (params) {
                                return "<div>"+eventval.mrEvent+"</div>";
                            },
                            trigger: 'item',
                            textStyle:{
                                fontSize:12,
                                lineHeight:10,
                                color:'#FFFFFF'                                
                            }
                        },                      
                        value: eventval.mrEventType,
                        xAxis: eventval.mrEventTime,
                        yAxis: this.priceArr[this.uniqueArr.indexOf(eventval.mrEventTime)],
                        symbolOffset: offset
                     }
            reteventArr.push(markPoint);
        }        
    });
    return reteventArr;
}




}