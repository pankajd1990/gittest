import * as $ from 'jquery'
import * as echarts from 'echarts';
import * as screenfull from 'screenfull';

import { GridOptions, ColumnApi } from 'ag-grid';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, HostBinding, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MessageConstant } from '../../../ng-utility/ng.message.constant';  

import Dygraph from 'dygraphs';
import Util from '../../../ng-utility/util';

import { thisConstants } from './market.replay.constant';
import Fingerprint2 from 'fingerprintjs2sync';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from '../../../ng-service/message.service';
import { RestService, Command } from '../../../ng-service/rest.service';
import { WebSocketService } from '../../../ng-service/web.socket.service';
import { DataShareService } from '../../../ng-service/data.share.service';
import { GenericComponent } from '../../generic-component/misc-component/generic.component';
import { marketReplayGraphConfig } from './marketReplay-graphs.conf';
import { survConst } from '../../../ng-utility/survConst';
import { mrConstant } from '../../../ng-utility/mrConstant';
import { GraphService } from '../../../ng-service/graph.service';
@Component({
  templateUrl: './market.replay.component.html'
})

export class MarketReplayComponent implements OnInit, OnDestroy {

  public subscription: Subscription;
  public speedSliderVal: number = 0;
  public playPauseButton: Boolean = null;
  public isMarketControlVisible: Boolean = null;

  public mdAwayLtpData = {};
  public orderTradeLogsData = '';

  public highlightForm: FormGroup;
  public isHighlightPopupVisible: Boolean = true;

  public rowClassRules;
  public gridApiActivityLog;
  public gridApiBuyOrderLog;
  public gridApiSellOrderLog;
  public gridApiEventLog;
  public gridApiOrderBookLog;
  public gridOptionsActivityLog: GridOptions;
  public gridOptionsBuyOrderLog: GridOptions;
  public gridOptionsSellOrderLog: GridOptions;
  public gridOptionsEventLog: GridOptions;
  public gridOptionsOrderBook: GridOptions;

  public activityLogColumns;
  public selectedActivityLogColumns: String[] = [];
  public isVisibleColumnConfigurator: Boolean = false;

  private jsonData: any = {};
  private paginationData: any = {};
  private dataSize: number;
  public showPagination: Boolean = false;


  public popupHeader: String = null;
  public showPopupWindow: Boolean = false;
  public isHighlightPopupWindow: Boolean = false;
  public display: Boolean = false;
  public orderBook;
  public eventData: any = [];
  public graphconfig: marketReplayGraphConfig = new marketReplayGraphConfig();
  public eleChartsRout;
  public gridscrollevent: boolean;
  /*
    Start - Temp Code
  */
  public headerDate;
  public headerFrom;
  public headerTo;
  public headerSeries;
  public headerSymbol;
  public headerIndexName;
  public gridColumnApi;

  public runId: any;
  public segId = 'C';
  public userNum: any;
  public mrSeqNmbr: any;
  public BStype: any = "";
  public replayDialogWidth: number;
  public replayDialogHeight: number;
  public dialogResize: Boolean;
  public fullscreenDis: Boolean = false;
  public selAll: Boolean = false;
  public showIndex: Boolean = false;
  public gotoForm: FormGroup;
  public gotoStartSeqNmbr: number = 0;
  public prevForwardFlag: number = 1;

  /**
   * Default Method: constructor & ngOnInit
   */
  constructor(private dataShareService: DataShareService, private router: Router, private route: ActivatedRoute,
    private restService: RestService, private messageService: MessageService, public genericComponent: GenericComponent, public webSocketService: WebSocketService,public graphService: GraphService, public cookieService : CookieService ) {

    router.paramsInheritanceStrategy
    this.subscription = restService.commands.subscribe(this.handleCommand);
    this.gridOptionsActivityLog = {
      rowData: [],
      rowHeight: 19,
      headerHeight: 17,
      columnDefs: thisConstants.ColumnDefs.ActivityLog,
      rowSelection: 'single',
      suppressRowHoverHighlight: true,
      suppressScrollOnNewData: true
    };
    this.gridOptionsBuyOrderLog = {
      rowData: [],
      rowHeight: 19,
      headerHeight: 17,
      columnDefs: thisConstants.ColumnDefs.BuyOrderLog,
      suppressHorizontalScroll: false,
    };
    this.gridOptionsSellOrderLog = {
      rowData: [],
      rowHeight: 19,
      headerHeight: 17,
      columnDefs: thisConstants.ColumnDefs.SellOrderLog
    };
    this.gridOptionsEventLog = {
      rowData: [],
      rowHeight: 19,
      headerHeight: 17,
      columnDefs: thisConstants.ColumnDefs.EventLog,
      suppressScrollOnNewData: true
    };
    this.gridOptionsOrderBook = {
      rowData: [],
      rowHeight: 19,
      headerHeight: 17,
      columnDefs: thisConstants.ColumnDefs.OrderBook,
      suppressColumnVirtualisation: true
    };
    this.rowClassRules = {
      'trade-row-style': function (params) {
        return params.data.mrBuySellFlag == mrConstant.MR_BUY_SELL_FLAG_TRADE;
      },
      'buy-row-style': function (params) {
        return params.data.mrBuySellFlag == mrConstant.MR_BUY_SELL_FLAG_BUY;
      },
      'sell-row-style': function (params) {
        return params.data.mrBuySellFlag == mrConstant.MR_BUY_SELL_FLAG_SELL;;
      },
      'highlight-condition': function (params) {
        return params.data.mrHighlighter == mrConstant.MR_BUY_SELL_FLAG_HIGHLIGHT;;
      },
    };
  }

  ngOnInit() {
    var chart = <HTMLCanvasElement>document.getElementById('marketReplay');     
    this.eleChartsRout= echarts.init(chart);     
    var headerData = this.dataShareService.getMwscrHeaderData();
    if (headerData != undefined) {
      this.headerDate = headerData.mrReqRunDate;
      this.headerFrom = headerData.mrReqFromTime;
      this.headerTo = headerData.mrReqToTime;
      this.headerSeries = headerData.mrReqSeries;
      this.headerSymbol = headerData.mrReqSymbol;
      this.runId = headerData.mrReqRunId;
      this.segId = headerData.mrReqSegInd
      this.userNum = headerData.mrReqUserNum;
      this.mrSeqNmbr = headerData.mrReqStartSeqNum;
      this.headerIndexName = headerData.mrReqIndexName;
      if (this.headerIndexName != null && this.headerIndexName != undefined && this.headerIndexName != "") {
        this.showIndex = true;
      }
    }

    //Debi: should be in 1 method
    var jsonObject = {};
    this.prevForwardFlag = 1;
    jsonObject = this.getJsonForStart();
   // this.webSocketService.subscribeActivity(this);
    this.webSocketService.start(this);

    this.playPauseButton = false;
    this.isMarketControlVisible = true;

    this.showPopupWindow = false;
    this.isHighlightPopupWindow = false;

    this.highlightForm = new FormGroup({
      mkwhgBrokerArray: new FormControl(),
      mkwhgDealerArray: new FormControl(),
      mkwhgAccNoArray: new FormControl(),
      mkwhgPanArray: new FormControl(),
      mkwhgNnfIdArray: new FormControl(),
      mkwhgLstUnexecQty: new FormControl('', [Validators.min(0), Validators.max(2147483647), Validators.pattern(thisConstants.patterns.numeric)]),
      mkwhgLstCancelledQty: new FormControl('', [Validators.min(0), Validators.max(2147483647), Validators.pattern(thisConstants.patterns.numeric)]),
      mkwhgPrcntgAwayLtp: new FormControl('', [Validators.max(100), Validators.min(0), Validators.pattern(thisConstants.patterns.decimal)]),
      mkwhgPrcntgAwayLtpSl: new FormControl('', [Validators.max(100), Validators.min(0), Validators.pattern(thisConstants.patterns.decimal)]),
    });

    this.setHighlighterForm();
    this.navigateToNextCell = this.navigateToNextCell.bind(this);
    this.gotoForm = new FormGroup({
      frmtm: new FormControl('', [Validators.pattern(thisConstants.patterns.time)]),
      frmorderno: new FormControl('', [Validators.pattern('^[0-9]*$'), Validators.maxLength(20)]),
      frmtradeno: new FormControl('', [Validators.pattern('^[0-9]*$'), Validators.maxLength(16)]),
      frmpanno: new FormControl('', [Validators.maxLength(10), Validators.pattern(thisConstants.patterns.alphanumeric), Validators.pattern(thisConstants.patterns.pan)]),
    });
  }

  setHighlighterForm() {
    this.highlightForm.reset();
    var jsonObject = {
      mkwhgRunId: this.runId
    }
    this.restService.postRequestWithParamater('getHighlightCondition', jsonObject).subscribe(data => { this.setHighlighterFormCallBack(data) });
  }

  setHighlighterFormCallBack(data) {
    if (Util.checkResponse(data)) {
      if (data.resultData != null) {
        Object.keys(this.highlightForm.value).forEach(name => {
          this.highlightForm.controls[name].setValue(data.resultData[name]);
        });
      }
    }
  }

  /**
   * Close Market Replay Button : Exit from Market Replay Form
   */
  closeMarketReplay() {
    if (screenfull.isFullscreen) {
      screenfull.exit();
    }
    this.pauseButtonClickEvent(); 
    this.refreshButtonClickEvent(false);
    this.router.navigateByUrl('/dashboard', { skipLocationChange: true });
  }

  /**
   * Show/Hide Control : Visible Control like backward, play/pause, forward, goTo etc...
   */
  showMarketControls() {
    this.isMarketControlVisible = !this.isMarketControlVisible;
  }

  backwardButtonClickEvent() {
    //todo: make generic method and passs directions for ups/down 
    if (this.playPauseButton) {
       var currow = this.gridApiActivityLog.getSelectedNodes();       
       if(currow && currow[0] && currow[0].rowIndex==0){
           this.webSocketService.forwardBackWardFlag = true;
           this.webSocketService.scrolldir = 'B';
           this.webSocketService.run(this.webSocketService.playPauseCounter, this.webSocketService.activityArr, this);
      }
      else{
           let node1=this.gridApiActivityLog.getRowNode(currow[0].rowIndex-1);  
           this.gridApiActivityLog.ensureIndexVisible(currow[0].rowIndex-1);       
           node1.setSelected(true);
           this.activityGridRowClickEvent(node1);
      }
    
    }
  }

  forwardButtonClickEvent() {
    if (this.playPauseButton) {
       var currow = this.gridApiActivityLog.getSelectedNodes();           
       var last_display_row  =  this.gridApiActivityLog.getLastDisplayedRow();    
       if(currow && currow[0] && currow[0].rowIndex < last_display_row ){
           let node1=this.gridApiActivityLog.getRowNode(currow[0].rowIndex+1);  
           this.gridApiActivityLog.ensureIndexVisible(currow[0].rowIndex+1);       
           node1.setSelected(true);
           this.activityGridRowClickEvent(node1);
      }
      else{
          this.webSocketService.forwardBackWardFlag = false;
          this.webSocketService.forwardManualFlag = false;
          this.webSocketService.scrolldir = 'F';
          this.webSocketService.run(this.webSocketService.playPauseCounter, this.webSocketService.activityArr, this);
      }    
    }
  }

  onResize(event) {
    event.target.innerWidth;
    var eleCharts = <HTMLCanvasElement>document.getElementById('marketReplay');
    var chart = echarts.init(eleCharts);
    chart.resize();
  }

  getChangedFieldName(arr) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].price == -1) {
        arr[i].dummyPrice = mrConstant.MR_BUY_SELL_MARKET
      } else if (arr[i].price == -2) {
        arr[i].dummyPrice = mrConstant.MR_BUY_SELL_ATO
      } else {
        arr[i].dummyPrice = Number(arr[i].price).toFixed(2);
      }
    }
    return arr;
  }

  setHighlighterOnData(data) {
    if (data != undefined && data != null) {
      for (let i = 0; i < data.length; i++) {
        if (this.highlightForm != undefined && this.highlightForm != null) {
          if (this.highlightForm.value != undefined && this.highlightForm.value != null) {
            /**
             * Highlighter on Broker
             */
            if (this.highlightForm.value.mkwhgBrokerArray != null) {
              if (data[i].mrBuyBrokerId != null) {
                if (this.highlightForm.value.mkwhgBrokerArray.indexOf(data[i].mrBuyBrokerId) >= 0) {
                  data[i].mrHighlighter = 'H';
                  continue;
                }
              }
              if (data[i].mrSellBrokerId != null) {
                if (this.highlightForm.value.mkwhgBrokerArray.indexOf(data[i].mrSellBrokerId) >= 0) {
                  data[i].mrHighlighter = 'H';
                  continue;
                }
              }
            }

            /**
             * Highlighter on Dealer
             */
            if (this.highlightForm.value.mkwhgDealerArray != null) {
              if (data[i].mrBuyDealerId != null) {
                if (this.highlightForm.value.mkwhgDealerArray.indexOf(data[i].mrBuyDealerId.toString()) >= 0) {
                  data[i].mrHighlighter = 'H';
                  continue;
                }
              }
              if (data[i].mrSellDealerId != null) {
                if (this.highlightForm.value.mkwhgDealerArray.indexOf(data[i].mrSellDealerId.toString()) >= 0) {
                  data[i].mrHighlighter = 'H';
                  continue;
                }
              }
            }

            /**
             * Highlighter on PAN
             */
            if (this.highlightForm.value.mkwhgPanArray != null) {
              if (data[i].mrBuyPan != null) {
                if (this.highlightForm.value.mkwhgPanArray.indexOf(data[i].mrBuyPan) >= 0) {
                  data[i].mrHighlighter = 'H';
                  continue;
                }
              }
              if (data[i].mrSellPan != null) {
                if (this.highlightForm.value.mkwhgPanArray.indexOf(data[i].mrSellPan) >= 0) {
                  data[i].mrHighlighter = 'H';
                  continue;
                }
              }
            }

            /**
             * Highlighter on NNF Id
             */
            if (this.highlightForm.value.mkwhgNnfIdArray != null) {
              if (data[i].mrBuyNnfId != null) {
                if (this.highlightForm.value.mkwhgNnfIdArray.indexOf(data[i].mrBuyNnfId.toString()) >= 0) {
                  data[i].mrHighlighter = 'H';
                  continue;
                }
              }
              if (data[i].mrSellNnfId != null) {
                if (this.highlightForm.value.mkwhgNnfIdArray.indexOf(data[i].mrSellNnfId.toString()) >= 0) {
                  data[i].mrHighlighter = 'H';
                  continue;
                }
              }
            }

             /**
             * Highlighter on Account Number
             */
            if (this.highlightForm.value.mkwhgAccNoArray != null) {
              if (data[i].mrBuyClientId != null) {
                if (this.highlightForm.value.mkwhgAccNoArray.indexOf(data[i].mrBuyClientId.toString()) >= 0) {
                  data[i].mrHighlighter = 'H';
                  continue;
                }
              }
              if (data[i].mrSellerClientId != null) {
                if (this.highlightForm.value.mkwhgAccNoArray.indexOf(data[i].mrSellerClientId.toString()) >= 0) {
                  data[i].mrHighlighter = 'H';
                  continue;
                }
              }
            }



          }
        }
        data[i].mrHighlighter = 'F'
      }
    }
  }

  pauseButtonClickEvent() {
    this.playPauseButton = true;
    this.webSocketService.drawGraph(this);
  }

  refreshButtonClickEvent(gotoClick) {
    if(!this.playPauseButton){
        this.genericComponent.showErrorMessage("Please Stop first then click on Refresh");
        return false;
    }
    this.webSocketService.priceArr = [];
    this.webSocketService.indArr = [];
    this.webSocketService.volArr = [];
  //  this.webSocketService.timeArr = [];
    this.webSocketService.filteredArr = [];
    this.webSocketService.activityArr = [];
    this.webSocketService.uniqueArr = [];
    this.webSocketService.activityPushArr = [];
    this.eventData=[]; 
    this.webSocketService.GraphActivityArr=[];
    this.webSocketService.GraphEventArr=[];
    this.webSocketService.playPauseCounter = 0;
    this.webSocketService.forwardBackWardFlag = false;
    this.webSocketService.forwardManualFlag = true;
    this.mdAwayLtpData = {};
    this.orderTradeLogsData = '';
    this.gridOptionsEventLog.api.setRowData([]);
    this.gridOptionsActivityLog.api.setRowData([]);
    this.gridOptionsBuyOrderLog.api.setRowData([]);
    this.gridOptionsSellOrderLog.api.setRowData([]);    
    this.webSocketService.refreshGraph(this);
    this.gotoStartSeqNmbr = 0;
    this.playPauseButton = true;
    if (!gotoClick) {
      this.gotoForm.reset();
      this.gotoForm.enable();

    }
  }

  goToButtonClickEvent() {
    //Debi: clean up all the data and also reinit all variables; write a common method to clean
    //temporary adding goto form validation 
    var totalcontrols=Object.keys(this.gotoForm.controls).length;  
    var tmp=0;
    Object.keys(this.gotoForm.controls).forEach( formkey => {  
        if(this.gotoForm.controls[formkey].value==""){
            tmp++;
        }         
    });   
    if(totalcontrols==tmp){
        this.genericComponent.showErrorMessage(MessageConstant.MarketReplay.GoToBlankClick);
        return false;
    }
    if(!this.gotoForm.valid){
      this.genericComponent.showErrorMessage(MessageConstant.MarketReplay.goToInvalid);
      return false;
    }     
    var gotoClick = true;
    this.refreshButtonClickEvent(gotoClick);
    let tempObj = this.gotoForm.getRawValue();
    var jsonObject = {
      mrSeqNmbr: this.mrSeqNmbr,
      mrRecordTimeString: tempObj.frmtm.trim().length > 0 ? this.headerDate + " " + tempObj.frmtm : tempObj.frmtm,
      mrPan: tempObj.frmpanno,
      mrOrderNmbr: tempObj.frmorderno,
      mrFillNmbr: tempObj.frmtradeno,
      mrRunId: this.runId,
    }
    this.restService.postRequestWithParamater('goToMarketReplay', jsonObject).subscribe(data => { this.setGotoStartSeqNmbr(data) });
  }

  activityGridRowClickEvent(params) {
    var selectedData = params.data;
    if (selectedData != null) {
      this.orderBook = selectedData;
      this.mdAwayLtpData = selectedData.mdAwayLtpData;
      this.orderTradeLogsData = selectedData.mrtradeLogData;
      let gridDataBuy = selectedData.mdBuyPricePointArray;
      for (var i = 0; i < gridDataBuy.length; i++) {
        if (gridDataBuy[i].price == -1) {
          gridDataBuy[i].dummyPrice = mrConstant.MR_BUY_SELL_MARKET
        } else if (gridDataBuy[i].price == -2) {
          gridDataBuy[i].dummyPrice = mrConstant.MR_BUY_SELL_ATO
        } else {
          gridDataBuy[i].dummyPrice = Number(gridDataBuy[i].price).toFixed(2);
        }
      }
      let gridDataSell = selectedData.mdSellPricePointArray;
      for (var i = 0; i < gridDataSell.length; i++) {
        if (gridDataSell[i].price == -1) {
          gridDataSell[i].dummyPrice = mrConstant.MR_BUY_SELL_MARKET
        } else if (gridDataSell[i].price == -2) {
          gridDataSell[i].dummyPrice = mrConstant.MR_BUY_SELL_ATO
        } else {
          gridDataSell[i].dummyPrice = Number(gridDataSell[i].price).toFixed(2);
        }
      }
      this.gridOptionsBuyOrderLog.api.setRowData(gridDataBuy);
      this.gridOptionsSellOrderLog.api.setRowData(gridDataSell);
    }
  }

  /**
   * Configure Columns : Adjustment(show/hide) of Activity Grid Columns
   */
  showConfigureColumnsPanel() {
    this.selectedActivityLogColumns = [];
    this.activityLogColumns = thisConstants.ColumnDefs.ActivityLog;
    for (let column of thisConstants.ColumnDefs.ActivityLog) {
      if (!column.hide) {
        this.selectedActivityLogColumns.push(column.field);
      }
    }
    this.isVisibleColumnConfigurator = true;
  }

  submitColumnConfiguration() {
    if (this.selectedActivityLogColumns.length > 0) {
      var visibleActivityColumnData: any = [];

      var allActivityColumnData: String[] = [];
      for (let column of thisConstants.ColumnDefs.ActivityLog) {
        allActivityColumnData.push(column.field);
      }

      var showColumndef;
      for (let i = 0; i < this.selectedActivityLogColumns.length; i++) {
        showColumndef = thisConstants.ColumnDefs.ActivityLog.find(e => e.field === this.selectedActivityLogColumns[i]);
        showColumndef.hide = false;
        visibleActivityColumnData.push(showColumndef);
      }

      var hideColumndef;
      var hiddenColumn = Util.difference(allActivityColumnData, this.selectedActivityLogColumns);
      for (let i = 0; i < hiddenColumn.length; i++) {
        hideColumndef = thisConstants.ColumnDefs.ActivityLog.find(e => e.field === hiddenColumn[i]);
        hideColumndef.hide = true;
        visibleActivityColumnData.push(hideColumndef);
      }

      this.gridApiActivityLog.setColumnDefs(visibleActivityColumnData);

      if (visibleActivityColumnData.length < 13) {
        this.gridApiActivityLog.sizeColumnsToFit();
      }

      this.isVisibleColumnConfigurator = false;
    } else {
      this.genericComponent.showErrorMessage(MessageConstant.MarketReplay.ColSelection);
    }
  }

  /**
    * Highlight Conditions : Open highlight popup for highlight data into activity grid
    */
  showHighlightPopupWindow() {
    this.highlightForm.reset();
    var jsonObject = {
      mkwhgRunId: this.runId
    }
    this.restService.postRequestWithParamater('getHighlightCondition', jsonObject).subscribe(data => { this.showHighlightPopupWindowCallBack(data) });
  }

  showHighlightPopupWindowCallBack(data) {
    if (Util.checkResponse(data)) {
      if (data.resultData != null) {
        Object.keys(this.highlightForm.value).forEach(name => {
          this.highlightForm.controls[name].setValue(data.resultData[name]);
        });
      }
    }
    this.display = true;
    this.isHighlightPopupVisible = true;
    this.replayDialogWidth = 608;
    this.replayDialogHeight = 300;
    this.dialogResize = false;
    this.popupHeader = 'Highlight Attributes';
  }

  onAddBrokerValueEvent(event) {
    let broker = event.value;
    let length = this.highlightForm.value.mkwhgBrokerArray.length - 1;
    if (length > 0) {
      for (let i = 0; i < length; i++) {
        if (this.highlightForm.value.mkwhgBrokerArray[i].toUpperCase() == broker.toUpperCase()) {
          this.highlightForm.value.mkwhgBrokerArray.pop();
          return;
        }
      }
    }
    if (!broker.match(thisConstants.patterns.alphanumeric) || broker.length != 5) {
      this.highlightForm.value.mkwhgBrokerArray.pop();
      this.genericComponent.showErrorMessage(MessageConstant.ValidationMessage.BrokerId);
    }
  }

  onAddDealerValueEvent(event) {
    let dealer = event.value;
    let length = this.highlightForm.value.mkwhgDealerArray.length - 1;
    if (length > 0) {
      for (let i = 0; i < length; i++) {
        if (this.highlightForm.value.mkwhgDealerArray[i].toUpperCase() == dealer.toUpperCase()) {
          this.highlightForm.value.mkwhgDealerArray.pop();
          return;
        }
      }
    }
    if (!dealer.match(thisConstants.patterns.alphanumeric) || dealer.length > 5) {
      this.highlightForm.value.mkwhgDealerArray.pop();
      this.genericComponent.showErrorMessage(MessageConstant.ValidationMessage.DealerId);
    }
  }

  onAddAccNoValueEvent(event) {
    let accNo = event.value;
    let length = this.highlightForm.value.mkwhgAccNoArray.length - 1;
    if (length > 0) {
      for (let i = 0; i < length; i++) {
        if (this.highlightForm.value.mkwhgAccNoArray[i].toUpperCase() == accNo.toUpperCase()) {
          this.highlightForm.value.mkwhgAccNoArray.pop();
          return;
        }
      }
    }
    if (!accNo.match(thisConstants.patterns.alphanumeric) || !(accNo.length >= 0 && accNo.length <= 10)) {
      this.highlightForm.value.mkwhgAccNoArray.pop();
      this.genericComponent.showErrorMessage(MessageConstant.ValidationMessage.AccountId);
    }
  }

  onAddPanValueEvent(event) {
    let pan = event.value;
    let length = this.highlightForm.value.mkwhgPanArray.length - 1;
    if (length > 0) {
      for (let i = 0; i < length; i++) {
        if (this.highlightForm.value.mkwhgPanArray[i].toUpperCase() == pan.toUpperCase()) {
          this.highlightForm.value.mkwhgPanArray.pop();
          return;
        }
      }
    }
    if (!pan.match(thisConstants.patterns.pan) || pan.length != 10) {
      this.highlightForm.value.mkwhgPanArray.pop();
      this.genericComponent.showErrorMessage(MessageConstant.ValidationMessage.PAN);
    }
  }

  onAddNnfIdValueEvent(event) {
    let nnfId = event.value;
    let length = this.highlightForm.value.mkwhgNnfIdArray.length - 1;
    if (length > 0) {
      for (let i = 0; i < length; i++) {
        if (this.highlightForm.value.mkwhgNnfIdArray[i].toUpperCase() == nnfId.toUpperCase()) {
          this.highlightForm.value.mkwhgNnfIdArray.pop();
          return;
        }
      }
    }
    if (!nnfId.match(thisConstants.patterns.alphanumeric) || nnfId.length != 15) {
      this.highlightForm.value.mkwhgNnfIdArray.pop();
      this.genericComponent.showErrorMessage(MessageConstant.ValidationMessage.NnfId);
    }
  }

  submitHighlightForm(highlightForm) {
    highlightForm.value.mkwhgRunId = this.runId;
    highlightForm.value.mkwhgUserNum = this.userNum;
    highlightForm.value.mkwhgRunDate = new Date(this.headerDate),
    highlightForm.value.mkwhgSegInd = this.segId;
    highlightForm.value.mkwhgSymbol = this.headerSymbol;
    highlightForm.value.mkwhgSeries = this.headerSeries;

    this.restService.postRequestWithParamater('submitHighlightCondition', highlightForm.value).subscribe(data => { this.submitHighlightFormCallBack(data) });
  }

  submitHighlightFormCallBack(data) {
    if (data.responseCode === 0) {
      this.display = false;
    } else {
      this.messageService.putMessage(data);
    }
  }

  closeButtonEvent() {
    this.display = false;
    this.messageService.clearMessages();
  }

  /**
   * Popup Grid: Open Popup and load data into Grid for button like B-U, S-U, B-C, S-C and also when click on Buy/Sell Grid Row 
   */
  marketReplayPopupGridDataCount(type, params) {
    if (type == 'BUY') {
      this.BStype = "BUY";
      this.jsonData = {
        flag: 'B',
        runId: this.dataShareService.getMwscrHeaderData().mrReqRunId,
        mrSeqNmbr: params.data.seqNo,
        mrStartSeqNmbr: 0,
        limitPrice: params.data.price == 'A' ? -2 : params.data.price == 'M' ? -1 : params.data.price,
        thresholdQty: 0,
        thresholdCxlQty: 0
      };
      this.popupHeader = 'Buy Order Book at Price Point: ' + params.data.dummyPrice;
      this.restService.postRequestWithParamater('marketReplayPopupGridDataCount', this.jsonData).subscribe(data => { this.marketReplayPopupGridDataCountCallBack(data) });
    }
    if (type == 'SELL') {
      this.BStype = "SELL";
      this.jsonData = {
        flag: 'S',
        runId: this.dataShareService.getMwscrHeaderData().mrReqRunId,
        mrSeqNmbr: params.data.seqNo,
        mrStartSeqNmbr: 0,
        limitPrice: params.data.price == 'A' ? -2 : params.data.price == 'M' ? -1 : params.data.price,
        thresholdQty: 0,
        thresholdCxlQty: 0
      };
      this.popupHeader = 'Sell Order Book at Price Point: ' + params.data.dummyPrice;
      this.restService.postRequestWithParamater('marketReplayPopupGridDataCount', this.jsonData).subscribe(data => { this.marketReplayPopupGridDataCountCallBack(data) });
    }
    if (type == 'BU') {
      this.BStype = "BU";
      this.jsonData = {
        flag: 'BU',
        runId: this.dataShareService.getMwscrHeaderData().mrReqRunId,
        mrSeqNmbr: this.orderBook.mrSeqNmbr,
        mrStartSeqNmbr: this.dataShareService.getMwscrHeaderData().mrReqStartSeqNum,
        limitPrice: 0,
        thresholdQty: this.dataShareService.getMwscrHeaderData().mrReqLargeUnexecutedQty,
        thresholdCxlQty: 0
      };
      this.popupHeader = 'Buy Unexecuted Orders at Sequence No : ' + this.orderBook.mrSeqNmbr;
      this.restService.postRequestWithParamater('marketReplayPopupGridDataCount', this.jsonData).subscribe(data => { this.marketReplayPopupGridDataCountCallBack(data) });
    }
    if (type == 'SU') {
      this.BStype = "SU";
      this.jsonData = {
        flag: 'SU',
        runId: this.dataShareService.getMwscrHeaderData().mrReqRunId,
        mrSeqNmbr: this.orderBook.mrSeqNmbr,
        mrStartSeqNmbr: this.dataShareService.getMwscrHeaderData().mrReqStartSeqNum,
        limitPrice: 0,
        thresholdQty: this.dataShareService.getMwscrHeaderData().mrReqLargeUnexecutedQty,
        thresholdCxlQty: 0
      };
      this.popupHeader = 'Sell Unexecuted Orders at Sequence No : ' + this.orderBook.mrSeqNmbr;
      this.restService.postRequestWithParamater('marketReplayPopupGridDataCount', this.jsonData).subscribe(data => { this.marketReplayPopupGridDataCountCallBack(data) });
    }
    if (type == 'BC') {
      this.BStype = "BC";
      this.jsonData = {
        flag: 'BC',
        runId: this.dataShareService.getMwscrHeaderData().mrReqRunId,
        mrSeqNmbr: this.orderBook.mrSeqNmbr,
        mrStartSeqNmbr: this.dataShareService.getMwscrHeaderData().mrReqStartSeqNum,
        limitPrice: 0,
        thresholdQty: 0,
        thresholdCxlQty: this.dataShareService.getMwscrHeaderData().mrReqLargeCxlQty,
      };
      this.popupHeader = 'Buy Large Cancelled Orders at Sequence No : ' + this.orderBook.mrSeqNmbr;
      this.restService.postRequestWithParamater('marketReplayPopupGridDataCount', this.jsonData).subscribe(data => { this.marketReplayPopupGridDataCountCallBack(data) });
    }
    if (type == 'SC') {
      this.BStype = "SC";
      this.jsonData = {
        flag: 'SC',
        runId: this.dataShareService.getMwscrHeaderData().mrReqRunId,
        mrSeqNmbr: this.orderBook.mrSeqNmbr,
        mrStartSeqNmbr: this.dataShareService.getMwscrHeaderData().mrReqStartSeqNum,
        limitPrice: 0,
        thresholdQty: 0,
        thresholdCxlQty: this.dataShareService.getMwscrHeaderData().mrReqLargeCxlQty,
      };
      this.popupHeader = 'Sell Large Cancelled Orders at Sequence No : ' + this.orderBook.mrSeqNmbr;
      this.restService.postRequestWithParamater('marketReplayPopupGridDataCount', this.jsonData).subscribe(data => { this.marketReplayPopupGridDataCountCallBack(data) });
    }
    if (type == 'BUYLTP') {
      this.BStype = "BUYLTP";
      var mrLtp = this.orderBook.mrtradeLogData.split(",")[7];
      mrLtp = mrLtp.split(":")[1];
      mrLtp = mrLtp.trim();
      var mrReqPectAwayLTP = this.dataShareService.getMwscrHeaderData().mrReqPectAwayLTP;
      this.jsonData = {
        flag: 'BLTP',
        runId: this.dataShareService.getMwscrHeaderData().mrReqRunId,
        mrSeqNmbr: this.orderBook.mrSeqNmbr,
        mrStartSeqNmbr: 0,
        limitPrice: (mrLtp) * (1 - (mrReqPectAwayLTP / 100)),
        thresholdQty: 0,
        thresholdCxlQty: 0,
      };
      this.popupHeader = 'Buy Qty away from LTP at Sequence No : ' + this.orderBook.mrSeqNmbr;
      this.restService.postRequestWithParamater('marketReplayPopupGridDataCount', this.jsonData).subscribe(data => { this.marketReplayPopupGridDataCountCallBack(data) });
    }
    if (type == 'SELLLTP') {
      this.BStype = "SELLLTP";
      var mrLtp = this.orderBook.mrtradeLogData.split(",")[7];
      mrLtp = mrLtp.split(":")[1];
      mrLtp = mrLtp.trim();
      var mrReqPectAwayLTP = this.dataShareService.getMwscrHeaderData().mrReqPectAwayLTP;
      this.jsonData = {
        flag: 'SLTP',
        runId: this.dataShareService.getMwscrHeaderData().mrReqRunId,
        mrSeqNmbr: this.orderBook.mrSeqNmbr,
        mrStartSeqNmbr: 0,
        limitPrice: (mrLtp) * (1 + (mrReqPectAwayLTP / 100)),
        thresholdQty: 0,
        thresholdCxlQty: 0,
      };
      this.popupHeader = 'Sell Qty away from LTP at Sequence No : ' + this.orderBook.mrSeqNmbr;
      this.restService.postRequestWithParamater('marketReplayPopupGridDataCount', this.jsonData).subscribe(data => { this.marketReplayPopupGridDataCountCallBack(data) });
    }
    if (type == 'BUYLTPSL') {
      this.BStype = "BUYLTPSL";
      var mrLtp = this.orderBook.mrtradeLogData.split(",")[7];
      mrLtp = mrLtp.split(":")[1];
      mrLtp = mrLtp.trim();
      var mrReqSLPectAwayLTP = this.dataShareService.getMwscrHeaderData().mrReqSLPectAwayLTP;
      this.jsonData = {
        flag: 'BLTPSL',
        runId: this.dataShareService.getMwscrHeaderData().mrReqRunId,
        mrSeqNmbr: this.orderBook.mrSeqNmbr,
        mrStartSeqNmbr: 0,
        limitPrice: (mrLtp) * (1 + (mrReqSLPectAwayLTP / 100)),
        thresholdQty: 0,
        thresholdCxlQty: 0,
      };
      this.popupHeader = 'Buy SL Qty away from LTP at Sequence No : ' + this.orderBook.mrSeqNmbr;
      this.restService.postRequestWithParamater('marketReplayPopupGridDataCount', this.jsonData).subscribe(data => { this.marketReplayPopupGridDataCountCallBack(data) });
    }
    if (type == 'SELLLTPSL') {
      this.BStype = "SELLLTPSL";
      var mrLtp = this.orderBook.mrtradeLogData.split(",")[7];
      mrLtp = mrLtp.split(":")[1];
      mrLtp = mrLtp.trim();
      var mrReqSLPectAwayLTP = this.dataShareService.getMwscrHeaderData().mrReqSLPectAwayLTP;
      this.jsonData = {
        flag: 'SLTPSL',
        runId: this.dataShareService.getMwscrHeaderData().mrReqRunId,
        mrSeqNmbr: this.orderBook.mrSeqNmbr,
        mrStartSeqNmbr: 0,
        limitPrice: (mrLtp) * (1 - (mrReqSLPectAwayLTP / 100)),
        thresholdQty: 0,
        thresholdCxlQty: 0,
      };
      this.popupHeader = 'Sell SL Qty away from LTP at Sequence No : ' + this.orderBook.mrSeqNmbr;
      this.restService.postRequestWithParamater('marketReplayPopupGridDataCount', this.jsonData).subscribe(data => { this.marketReplayPopupGridDataCountCallBack(data) });
    }

  }

  marketReplayPopupGridDataCountCallBack(data) {
    if (Util.checkResponse(data)) {
      this.dataSize = data.resultData;
      if (data.resultData > 0)
        this.marketReplayPopupGridData(1);
    } else {
      this.genericComponent.showErrorMessage(survConst.errorMsg.noDataErr);
    }
  }
  marketReplayPopupGridData(pageNum: number) {
    try {
      this.jsonData.pageSize = survConst.RECORDS_PER_PAGE;
      this.jsonData.from = pageNum == 1 ? 0 : ((pageNum - 1) * survConst.RECORDS_PER_PAGE);
      this.paginationData = {};
      this.restService.postRequestWithParamater('marketReplayPopupGridData', this.jsonData).subscribe(data => { this.marketReplayPopupGridDataCallBack(data, pageNum, this.BStype) });
    } catch (err) {
      this.genericComponent.showErrorMessage(survConst.errorMsg.noDataErr);
    }
  }
  marketReplayPopupGridDataCallBack(data, pageNum, type) {
    this.showPagination = true;
    if (Util.checkResponse(data)) {
      this.display = true;
      this.isHighlightPopupVisible = false;
      this.replayDialogWidth = 1350;
      this.replayDialogHeight = 650;
      this.dialogResize = true;
      this.gridApiOrderBookLog.sizeColumnsToFit();
      this.gridOptionsOrderBook.getRowClass = function (params) {
        if (type == 'BUY' || type == 'BU' || type == 'BC' || type == 'BUYLTP' || type == 'BUYLTPSL') {
          return 'buy-row-style';
        }
        if (type == 'SELL' || type == 'SU' || type == 'SC' || type == 'SELLLTP' || type == 'SELLLTPSL') {
          return 'sell-row-style';
        }
      }
      let gridData = data.resultData;
      for (var i = 0; i < gridData.length; i++) {
        gridData[i].mrBuyLimitPrice = Number(gridData[i].mrBuyLimitPrice).toFixed(2);
        gridData[i].mrBuyTriggerPrice = Number(gridData[i].mrBuyTriggerPrice).toFixed(2);
        gridData[i].mrRecordTimeString = this.getTimeFromTimestamp(gridData[i].mrRecordTimeString);
      }
      this.gridOptionsOrderBook.api.setRowData(gridData);
      this.paginationData = this.genericComponent.setPagination({}, pageNum, this.dataSize);
    } else {
      this.genericComponent.showErrorMessage(data.responseMsg);
    }
  }


  /**
   * Commponent Functionality
   */
  onGridReadyActivityLog(params) {
    this.gridApiActivityLog = params.api;
    this.gridscrollevent = true;
    this.gridApiActivityLog.rowRenderer.gridCore.gridOptionsWrapper.layoutElements[2].onmousewheel = (e) => {
      //scroll restricted while playing market repay
      if(!this.playPauseButton){
        e.preventDefault();
        return false;
      }
      this.gridscrollevent = false;
      if (!this.gridscrollevent) {           
        if (e.deltaY === 100) {
          var scrtop = this.gridApiActivityLog.rowRenderer.gridCore.gridOptionsWrapper.layoutElements[2].scrollTop;
          var scrheight = this.gridApiActivityLog.rowRenderer.gridCore.gridOptionsWrapper.layoutElements[2].scrollHeight;
          var innerhei = $(".ag-body-viewport.ag-layout-normal").innerHeight();
          if (scrtop + innerhei >= scrheight) {
            //this.forwardButtonClickEvent();
            this.webSocketService.forwardBackWardFlag = false;
            this.webSocketService.forwardManualFlag = false;
            this.webSocketService.scrolldir = 'F';
            this.webSocketService.run(this.webSocketService.playPauseCounter, this.webSocketService.activityArr, this);
          }
        }
        else {
          if (this.gridApiActivityLog.rowRenderer.gridCore.gridOptionsWrapper.layoutElements[2].scrollTop === 0) {
             //this.backwardButtonClickEvent();
             this.webSocketService.forwardBackWardFlag = true;
             this.webSocketService.scrolldir = 'B';
             this.webSocketService.run(this.webSocketService.playPauseCounter, this.webSocketService.activityArr, this);
          }
        }
      }

    }
  }

  onGridReadyBuyOrderLog(params) {
    params.api.sizeColumnsToFit();
    this.gridApiBuyOrderLog = params.api;
  }

  onGridReadySellOrderLog(params) {
    params.api.sizeColumnsToFit();
    this.gridApiSellOrderLog = params.api;
  }

  onGridReadyOrderBook(params) {
    params.api.sizeColumnsToFit();
    this.gridApiOrderBookLog = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onGridReadyEventLog(params) {
    params.api.sizeColumnsToFit();
    setTimeout(function () {
      params.api.resetRowHeights();
    }, 500);
  }

  handleCommand = (command: Command) => {
    switch (command.name) {
      case 'Submit': this.submitHighlightForm(this.highlightForm); break;
      case 'Cancel': this.closeButtonEvent(); break;
    }
  }

  get f() {
    return this.highlightForm.controls;
  }

  getTimeFromTimestamp(TimeString: any) {
    if (TimeString != "" && TimeString != null) {
      if (TimeString.split(' ')[1] != undefined) {
        return TimeString.split(' ')[1];
      } else {
        return TimeString;
      }
    }
  }

  playMarketReplayScocket() {
    this.playPauseButton = false;
    this.webSocketService.forwardBackWardFlag = false;
    this.webSocketService.forwardManualFlag = true;
    if(this.eleChartsRout.isDisposed()){
      var chart = <HTMLCanvasElement>document.getElementById('marketReplay');     
      this.eleChartsRout= echarts.init(chart);  
    }
    if (this.gotoStartSeqNmbr === -1) {
      this.pauseButtonClickEvent();
      this.genericComponent.showErrorMessage(MessageConstant.MarketReplay.invalidGoto);
    }else if (this.gotoStartSeqNmbr === 0) {
      if(this.webSocketService.activityArr.length > 0){
        this.webSocketService.run(this.webSocketService.playPauseCounter, this.webSocketService.activityArr, this);
      }else{
        var jsonObject = {};
        this.prevForwardFlag = 1;
        jsonObject = this.getJsonForStart();
        this.webSocketService.start(this);
      }
    } else {
      var jsonObject = {};
      this.prevForwardFlag = 1;
      jsonObject = this.getJsonForStart();
      this.webSocketService.start(this);
    }
  }

  resizeDialog(event) {
    window.dispatchEvent(new Event('resize'));
  }

  /*  function for autosizing column for grid  */
  autoSizeAll() {
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumn(allColumnIds);
    this.gridColumnApi.resetColumnState();
    this.gridApiOrderBookLog.refreshHeader();
    this.gridApiOrderBookLog.sizeColumnsToFit();
  }

  onGridSizeChanged(params) {
    this.autoSizeAll();
    var height = $(".ui-dialog-draggable").height();
    var width = $(".ui-dialog-draggable").width();
    /* In case of  dialog small width and small height*/
    if (height <= 180 || width < 390) {
      $("#actgrd").height(height - 100);
    }
    else {
      $("#actgrd").height(height - 60);
    }
  }

  fullscreenmode() {
    this.fullscreenDis = false;
    screenfull.toggle();
  }

  resetGrid() {
    this.gridOptionsOrderBook.api.ensureColumnVisible("mrSeqNmbr");
  }

  /*select all /deslect all columns in activity grid*/
  selectAll(status, chktype) {
    this.selAll = status;
    if (chktype == "indck") {
      if (thisConstants.ColumnDefs.ActivityLog.length === this.selectedActivityLogColumns.length) {
        this.selAll = true;
      }
      else {
        this.selAll = false;
      }
    }
    else {
      this.selectedActivityLogColumns = [];
      if (status) {
        for (let column of thisConstants.ColumnDefs.ActivityLog) {
          this.selectedActivityLogColumns.push(column.field);
        }
      }
      else {
        this.selectedActivityLogColumns = [];
      }
    }
  }

  navigateToNextCell(params) {
    var KEY_LEFT = 37;
    var KEY_UP = 38;
    var KEY_RIGHT = 39;
    var KEY_DOWN = 40;
    var previousCell = params.previousCellDef;
    var suggestedNextCell = params.nextCellDef;
    var selnode;
    switch (params.key) {
      case KEY_UP:
        var nextRowIndex = previousCell.rowIndex - 1;
        if (params.nextCellDef) {
          selnode = this.gridApiActivityLog.getRowNode(params.nextCellDef.rowIndex);
          selnode.setSelected(true);
          this.activityGridRowClickEvent(selnode);
        }
        if (nextRowIndex < 0) {
          if (this.playPauseButton) {
            this.backwardButtonClickEvent();

          }
          return null;
        } else {
          return {
            rowIndex: nextRowIndex,
            column: previousCell.column,
            floating: previousCell.floating
          };
        }
      case KEY_DOWN:
        nextRowIndex = previousCell.rowIndex + 1;
        if (params.nextCellDef) {
          selnode = this.gridApiActivityLog.getRowNode(params.nextCellDef.rowIndex);
          selnode.setSelected(true);
          this.activityGridRowClickEvent(selnode);
        }
        var renderedRowCount = this.gridApiActivityLog.getModel().getRowCount();
        if (nextRowIndex >= renderedRowCount) {
          this.forwardButtonClickEvent();
          return null;
        } else {
          return {
            rowIndex: nextRowIndex,
            column: previousCell.column,
            floating: previousCell.floating
          };
        }
      case KEY_LEFT:
      case KEY_RIGHT:
        return suggestedNextCell;
      default:
        throw "this will never happen, navigation is always on of the 4 keys above";
    }
  }

  ngOnDestroy() {
    //this.refreshButtonClickEvent();
  }

  setGotoStartSeqNmbr(data) {
    if (data.resultData) {
      this.gotoStartSeqNmbr = data.resultData;
    }
  }

  DisabledGoto(event) {
    Object.keys(this.gotoForm.controls).forEach(formkey => {
      if (this.gotoForm.controls[event.target.attributes[2].nodeValue].value.length > 0) {
        if (formkey != event.target.attributes[2].nodeValue) {
          this.gotoForm.controls[formkey].disable();
          this.gotoForm.controls[formkey].setValue("");
        }
      }
      else {
        this.gotoForm.controls[formkey].enable();
      }
    });
  }

  getJsonForStart() {
    var jsonObject = {};
    var fingerPrint = (new Fingerprint2()).getSync().fprint;
    var randomToken = this.cookieService.get('random-token');
    var randomFinger = fingerPrint + randomToken;

    jsonObject = {
      mrRunId: this.runId,
      mrSeqNmbr: this.mrSeqNmbr,
      lastSeqNmbr: this.webSocketService.activityArr.length != 0 ? this.webSocketService.activityArr[this.webSocketService.activityArr.length - 1].mrSeqNmbr : 0,
      prevForwardFlag: this.prevForwardFlag,
      gotoStartSeqNmbr: this.gotoStartSeqNmbr > 0 ? this.gotoStartSeqNmbr : 0,
      randomFinger: randomFinger
  }
    return jsonObject;
  }
}