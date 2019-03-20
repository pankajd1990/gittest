import * as echarts from 'echarts';
import * as SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';

import Fingerprint2 from 'fingerprintjs2sync';

import { Base64 } from 'js-base64';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { RestService, Command } from '../ng-service/rest.service';
import { CONSTANT } from '../ng-utility/ng.constant';
import { mrConstant } from '../ng-utility/mrConstant';
import { thisConstants } from '../ng-component/market-component/market.replay/market.replay.constant';
import { GraphService } from '../ng-service/graph.service';
import * as _ from 'lodash'; 
@Injectable()
export class WebSocketService {

    stompClient: any;
    public priceArr: any[] = [];
    public indArr: any[] = [];
    public volArr: any[] = [];
    //public timeArr: any[] = [];
    public filteredArr: any[] = [];
    public activityArr: any[] = [];
    public uniqueArr: any[] = [];
    public activityPushArr: any[] = [];
    public playPauseCounter: any = 0;
    public forwardBackWardFlag: boolean = false;
    public forwardManualFlag: boolean = true;
    public scrolldir: string = "";
    public isLoadedResponse: boolean = false;
    public subscription: any;
    public mrReplay;
    public curgotoSeq:number;
    private _websocket_url = CONSTANT.URL.WEB_SOCKET_SERVER;
    public GraphActivityArr=[];    public GraphEventArr=[];
    constructor(private cookieService: CookieService,public graphService: GraphService,private restService : RestService ) {
        var preFix = window.location.pathname;
        this._websocket_url = preFix + CONSTANT.URL.WEB_SOCKET_SERVER;
    }

    connect() {
        let that = this;
        var socket = new SockJS(this._websocket_url);
        this.stompClient = Stomp.over(socket);
        this.stompClient.connect({}, function (frame) {
            that.subscribeWSActivity();
         });
    }

    start(mrReplayObj) {
        this.mrReplay = mrReplayObj;
        var jsonObject = {};
        jsonObject = this.mrReplay.getJsonForStart();
        var fingerPrint = (new Fingerprint2()).getSync().fprint;
        var randomToken = this.cookieService.get('random-token');
        var randomFinger = fingerPrint + randomToken;
        this.isLoadedResponse = false;
        //this.stompClient.send(CONSTANT.TOPIC.START_ACTIVITY, { 'random-finger': randomFinger }, JSON.stringify(jsonObject));
        this.restService.postRequestWithParamaterForWebSocket('start', jsonObject).subscribe(data => { this.subscribeActivity(data)});
    }

    subscribeWSActivity(){
       this.stompClient.subscribe('/user/topic/subscribeactivity', (data)=> {      
       this.subscribeActivity(data);
    });
    }

    subscribeActivity(data) {
        let that = this;
        
        this.curgotoSeq=this.mrReplay.gotoStartSeqNmbr;
            this.mrReplay.gotoStartSeqNmbr = 0;
            that.isLoadedResponse = true;
            //var resData = JSON.parse(data.body);
            var resData = data.resultData;
            if (resData && resData.Event && resData.Event.length > 0) {
                //gridOptions.eventData = resData.Event;//changes for appending event on each call
               
            
                    if(this.mrReplay.eventData.length == 0){
                        this.mrReplay.eventData = resData.Event;
                    }else{
                        this.mrReplay.eventData = this.mrReplay.eventData.concat(resData.Event);
                    }
                
                this.mrReplay.gridOptionsEventLog.api.setRowData(this.mrReplay.eventData);
                this.GraphEventArr=this.mrReplay.eventData;
                this.mrReplay.gridOptionsEventLog.api.rowRenderer.gridCore.gridOptionsWrapper.layoutElements[2].scrollTop = Number(this.mrReplay.gridOptionsEventLog.api.gridCore.rowRenderer.gridCore.gridOptionsWrapper.layoutElements[2].scrollHeight);
            }
            if (resData && resData.Activity && resData.Activity.length > 0) {
                //that.activityArr = [];
                that.activityArr = resData.Activity;
                that.activityArr.sort(this.mrReplay.genericComponent.sortArray(mrConstant.MR_SEQ_NMBR));
                var p = 0;
                that.run(p, that.activityArr, this.mrReplay);
                this.mrReplay.enfwdbkd=true;
                this.mrReplay.enBlPlayButton=true;
                this.mrReplay.scrollRestrict=false;
            }
            if(resData && resData.Activity && resData.Activity.length==0){
                this.mrReplay.pauseButtonClickEvent();
                this.drawGraph(this.mrReplay);
                if(this.forwardBackWardFlag){
                    this.mrReplay.enbbkd=false;
                } 
                else{
                    this.mrReplay.enbfwd=false;
                }               
                this.mrReplay.enBlPlayButton=false;
                this.mrReplay.lastSeqnum= this.activityArr[this.activityArr.length-1].mrSeqNmbr;
            }

            //  else {
            //     that.stompClient.unsubscribe(CONSTANT.TOPIC.START_ACTIVITY);
            //     that.stompClient.send(CONSTANT.TOPIC.PAUSE_ACTIVITY, {}, "");
            // }
        // });
    }

    run(p, activityArr, marketReplayComponent) {
        var option = {};
        let distime=marketReplayComponent.speedSliderVal*500;
        if (!this.forwardBackWardFlag) {
            //PLAY FORWARD CODE
            if (p != undefined) {
                if(activityArr.length > 0 ){
                var rowData = activityArr[p];
                if ( p++ <= activityArr.length - 1) {
                    setTimeout(() => {
                        var duplicate =  false;
                        for (let row of this.activityPushArr) {
                            if (row.mrSeqNmbr == rowData.mrSeqNmbr) {
                                duplicate = true;
                            }
                        }

                     //   if (true) {
                            /**Graphs starts*/
                            var node;
                       
                            /**Graphs ends*/

                            rowData.mrFillPrice = Number(rowData.mrFillPrice).toFixed(2);
                            rowData.mrFillAmnt = Number(rowData.mrFillAmnt).toFixed(2);
                            rowData.mrBuyLimitPrice = Number(rowData.mrBuyLimitPrice).toFixed(2);
                            rowData.mrBuyTriggerPrice = Number(rowData.mrBuyTriggerPrice).toFixed(2);
                            rowData.mrSellLimitPrice = Number(rowData.mrSellLimitPrice).toFixed(2);
                            rowData.mrSellTriggerPrice = Number(rowData.mrSellTriggerPrice).toFixed(2);
                            rowData.mrTradeDevLtp = Number(rowData.mrTradeDevLtp).toFixed(2);
                            rowData.mrRecordTimeString = marketReplayComponent.getTimeFromTimestamp(rowData.mrRecordTimeString);
                            rowData.mrBuyEntryTmstString = marketReplayComponent.getTimeFromTimestamp(rowData.mrBuyEntryTmstString);
                            rowData.mrBuyLastModTmstString = marketReplayComponent.getTimeFromTimestamp(rowData.mrBuyLastModTmstString);
                            rowData.mrSellLastModTmstString = marketReplayComponent.getTimeFromTimestamp(rowData.mrSellLastModTmstString);
                            rowData.mrSellEntryTmstString = marketReplayComponent.getTimeFromTimestamp(rowData.mrSellEntryTmstString);
                            marketReplayComponent.orderBook = rowData;
                            let gridDataBuy = marketReplayComponent.getChangedFieldName(rowData.mdBuyPricePointArray);
                            let gridDataSell = marketReplayComponent.getChangedFieldName(rowData.mdSellPricePointArray);
                            if(gridDataBuy && gridDataBuy.length > 0){
                              marketReplayComponent.gridOptionsBuyOrderLog.api.setRowData(gridDataBuy);
                            }
                            if(gridDataSell && gridDataSell.length > 0){
                               marketReplayComponent.gridOptionsSellOrderLog.api.setRowData(gridDataSell);
                            }                            
                            marketReplayComponent.orderTradeLogsData = rowData.mrtradeLogData;
                            marketReplayComponent.mdAwayLtpData = rowData.mdAwayLtpData;
                            if (!duplicate) {
                                this.activityPushArr.push(rowData);
                                let ind=this.GraphActivityArr.findIndex(row1 => row1.mrSeqNmbr == rowData.mrSeqNmbr);
                                if(ind >=0){                                  
                                    if(!_.isEqual(this.GraphActivityArr[ind], rowData)){
                                        this.GraphActivityArr[ind]=rowData;
                                    }                                                                    
                                }
                                else{
                                    this.GraphActivityArr.push(rowData);
                                } 
                            }
                            if (this.activityPushArr.length > CONSTANT.GRID_SIZE) {
                                this.activityPushArr.shift()
                                /*todo : send single row to setHighlighterOnData
                                   check painting of single rows in grid 
                                */
                                marketReplayComponent.setHighlighterOnData(this.activityPushArr);
                                marketReplayComponent.gridOptionsActivityLog.api.setRowData(this.activityPushArr);

                                marketReplayComponent.gridOptionsActivityLog.api.rowRenderer.gridCore.gridOptionsWrapper.layoutElements[2].scrollTop = Number(marketReplayComponent.gridOptionsActivityLog.api.gridCore.rowRenderer.gridCore.gridOptionsWrapper.layoutElements[2].scrollHeight);

                            } else {
                                marketReplayComponent.setHighlighterOnData(this.activityPushArr);
                                marketReplayComponent.gridOptionsActivityLog.api.setRowData(this.activityPushArr);
                            }
                            marketReplayComponent.gridOptionsActivityLog.api.rowRenderer.gridCore.gridOptionsWrapper.layoutElements[2].scrollTop = Number(marketReplayComponent.gridOptionsActivityLog.api.gridCore.rowRenderer.gridCore.gridOptionsWrapper.layoutElements[2].scrollHeight);
                            node = marketReplayComponent.gridOptionsActivityLog.api.getRowNode(marketReplayComponent.gridOptionsActivityLog.api.getLastDisplayedRow());
                            node.setSelected(true);
                            marketReplayComponent.activityGridRowClickEvent(node);
                            marketReplayComponent.setHighlighterOnData(this.activityPushArr);
                            if (this.forwardManualFlag) {

                                var mod  = (p+1) % CONSTANT.GRAPH_REFRESH;
                                if( mod === 0){
                                  this.drawGraph(marketReplayComponent);
                                }
                               
                            }
                            

                            this.playPauseCounter = p;
                            if (!marketReplayComponent.playPauseButton) {
                                this.run(p, activityArr, marketReplayComponent)
                            }
                        //}
                    }, distime);
                } else {
                    var jsonObject = {};
                    if (this.isLoadedResponse) {
                        this.mrReplay.prevForwardFlag = 1;
                        jsonObject = marketReplayComponent.getJsonForStart();
                        this.start(this.mrReplay);
                    }
                }
            } else {
                //option = marketReplayComponent.graphconfig.marketReplay;
                //var chart = echarts.init(marketReplayComponent.eleChartsRout);
                //chart.setOption(option);
            }
            }
        } else {
            //PLAY PREVIOUS CODE
            //todo1 : desable PREVIOUS  and next button on reacing cache endpoints
            //todo2 : formatting should be in method            
            if (p == 0) {
           //     var activityArrLen = activityArr.length;
             //   var diff = activityArr.length - this.activityPushArr.length;
               // activityArr = activityArr.slice(CONSTANT.GRID_SIZE, activityArrLen);
                activityArr = activityArr.concat(this.activityPushArr);
                this.activityArr = activityArr;
                p = activityArr.length - 1;
                this.playPauseCounter = p;
            }
            if (p >= CONSTANT.GRID_SIZE) {
                setTimeout(() => {
                    var rowData = activityArr[p - (CONSTANT.GRID_SIZE)];

                    if (rowData != undefined) {
                        rowData.mrFillPrice = Number(rowData.mrFillPrice).toFixed(2);
                        rowData.mrFillAmnt = Number(rowData.mrFillAmnt).toFixed(2);
                        rowData.mrBuyLimitPrice = Number(rowData.mrBuyLimitPrice).toFixed(2);
                        rowData.mrBuyTriggerPrice = Number(rowData.mrBuyTriggerPrice).toFixed(2);
                        rowData.mrSellLimitPrice = Number(rowData.mrSellLimitPrice).toFixed(2);
                        rowData.mrSellTriggerPrice = Number(rowData.mrSellTriggerPrice).toFixed(2);
                        rowData.mrRecordTimeString = marketReplayComponent.getTimeFromTimestamp(rowData.mrRecordTimeString);
                        rowData.mrBuyEntryTmstString = marketReplayComponent.getTimeFromTimestamp(rowData.mrBuyEntryTmstString);
                        rowData.mrBuyLastModTmstString = marketReplayComponent.getTimeFromTimestamp(rowData.mrBuyLastModTmstString);
                        rowData.mrSellLastModTmstString = marketReplayComponent.getTimeFromTimestamp(rowData.mrSellLastModTmstString);
                        rowData.mrSellEntryTmstString = marketReplayComponent.getTimeFromTimestamp(rowData.mrSellEntryTmstString);
                        p--;
                        this.playPauseCounter = p;

                        var duplicate;
                        var node;
                        for (let row of this.activityPushArr) {
                            if (row.mrSeqNmbr == rowData.mrSeqNmbr) {
                                duplicate = true;
                            }
                        }
                        if (duplicate) {
                            return false;
                        }
                        if (!duplicate) {
                            this.activityPushArr.splice(0, 0, rowData);
                        }

                        if (this.activityPushArr.length > CONSTANT.GRID_SIZE) {
                            this.activityPushArr.pop()
                            marketReplayComponent.gridOptionsActivityLog.api.setRowData(this.activityPushArr);
                        } else {
                            marketReplayComponent.gridOptionsActivityLog.api.setRowData(this.activityPushArr);
                        }
                        if (this.scrolldir == "B") {
                            marketReplayComponent.gridOptionsActivityLog.api.rowRenderer.gridCore.gridOptionsWrapper.layoutElements[2].scrollTop = 0;
                            node = marketReplayComponent.gridOptionsActivityLog.api.getRowNode(marketReplayComponent.gridOptionsActivityLog.api.getFirstDisplayedRow());
                            node.setSelected(true);
                            marketReplayComponent.activityGridRowClickEvent(node);
                        }
                        else if (this.scrolldir == "F" || this.scrolldir == "") {
                           marketReplayComponent.gridOptionsActivityLog.api.rowRenderer.gridCore.gridOptionsWrapper.layoutElements[2].scrollTop = Number(marketReplayComponent.gridOptionsActivityLog.api.gridCore.rowRenderer.gridCore.gridOptionsWrapper.layoutElements[2].scrollHeight);
                        }
                    }
                }, distime);
            } else {
                var jsonObject = {};
                //Debi: should be in 1 method
                if (this.isLoadedResponse) {
                    this.mrReplay.prevForwardFlag = -1;
                    jsonObject = this.mrReplay.getJsonForStart();
                    this.start(this.mrReplay);
                }
            }
        }
    }

    disconnect() {
        if (this.stompClient != null) {
            this.stompClient.disconnect();
        }
    }

    refreshGraph(marketReplayComponent) {
        var option = {};
        marketReplayComponent.graphconfig.marketReplay.xAxis[0].data = [];
        marketReplayComponent.graphconfig.marketReplay.series[0].data = [];
        marketReplayComponent.graphconfig.marketReplay.series[1].data = [];
        marketReplayComponent.graphconfig.marketReplay.series[2].data = [];
        //option = marketReplayComponent.graphconfig.marketReplay;
        //var chart = echarts.init(marketReplayComponent.eleChartsRout);
        if(!marketReplayComponent.eleChartsRout.isDisposed()){
            marketReplayComponent.eleChartsRout.clear();        
            marketReplayComponent.eleChartsRout.dispose();
        }
        
    }
    drawGraph(marketReplayComponent){
        this.graphService.eleChartsRout= marketReplayComponent.eleChartsRout; 
        let tempobj= marketReplayComponent.gotoForm.getRawValue();
        this.graphService.marketRepayGraph( this.GraphActivityArr,this.GraphEventArr,{
                headerFrom:marketReplayComponent.headerFrom, 
                gotoStartSeqNmbr:this.curgotoSeq,
                showIndex:marketReplayComponent.showIndex,
                gotoFormObj:tempobj
        });
    }

}