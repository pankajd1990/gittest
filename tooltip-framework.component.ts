declare var require: any;
declare var $;
import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ChangeDetectorRef, OnDestroy, AfterContentInit, AfterViewChecked } from '@angular/core';
import { GridOptions, GridApi, RowNode } from 'ag-grid-community';

import CommonFunction from '../../../ngs-service/common.function';
import { SharedService } from '../../../ngs-service/shared.service';
import Util from 'src/app/ngs-utility/util';
import { RestService } from '../../../ngs-service/rest.service';
import { ReportInputComponent } from '../../generic-component/report/report.input.component';
import { survConst } from '../../../ngs-utility/surv.constant';
import { Router, Route } from '@angular/router';
import { ReportOutputService } from '../../report-output-component/report.output.service';
import { ToastMessageService } from '../../../ngs-service/toast.message.service';
import { ReportOutputConfig } from '../../report-output-component/report.output.config';
import { messageConstant } from '../../../ngs-utility/message.constant';
@Component({
    templateUrl: './report.component.html',
    styleUrls: [`./report.component.css`]
})

export class ReportComponent implements OnInit, OnDestroy,AfterViewChecked {

    @ViewChild(ReportInputComponent) rptComponent: ReportInputComponent;
    public exportQryCount: any;
    public exportCompletedCount: any;
    public menuId: number;
    public isShowSideBar: boolean = true;
    public apiLink: string = 'loadReportData';
    public reportOutputApi: any=[];
    public reportOutputGridData: any = [];
    public reportOutputGridOption: GridOptions;
    public pageNo: number = null;
    public totalReportDataCnt: number = 0;
    public reportOutputPaginationData: any = {};
    public isShowOutputGrid: boolean = false;
    public reportDescription: string = '';
    public isEnableSubReset: boolean = false;
    @ViewChild('reportHeaderOp', { read: ViewContainerRef }) reportHeaderOp;
    @ViewChild('reportFooterOp', { read: ViewContainerRef }) reportFooterOp;
    @ViewChild('reportContentOp', { read: ViewContainerRef }) reportContentOp;
    public reportExecutorGridObject: any = [];
    public reportExecutorGridPaginationObject: any = [];
    public gridCount: any = [];
    public tableTitle: any = [];
    public isAllowedReportPagination: string = '';
    public isExporting: boolean = false;
    public panReportOutputPaginationObject: any = {};
    public panReportOutputGridOptions: GridOptions;
    public panReportData: any = [];
    public isShowMainComp: boolean = true;
    public reportName: string;
    public extraData: any = {};
    public gridStyle: any = [];
    public rptOutputDisplay: string;
    public enabledExport: boolean = true;
    public enabledButtonOne: boolean = false;
    public buttonOneMethodName: any;
    public buttonOneLabelName: any;
    public rptExportOnly: string = "N";
    public directExportTotalCount:number=0;
    public directExportDownloadFlag:boolean=false;
    public buttonClickData:any={};  
    public setGridHeight:boolean=false;
    public reportOutputdata:any=[];
    public reportData:any=[];
    public exportButtonArr:any=[];
    public gridOtherInfo: any = [];
    public isFilterShow:boolean= true;
    public gridRowStyle:any=[];
    public rptContentStyle:any={};
    constructor(public sharedService: SharedService, public restService: RestService, private componentFactoryResolver: ComponentFactoryResolver, private router: Router, public reportOutputService: ReportOutputService, private cdref: ChangeDetectorRef, public toastMessageService: ToastMessageService) {

    }

    ngOnInit() {
        this.menuId = this.sharedService.tabArray[this.sharedService.currentActiveTab].menuId;
        this.reportOutputGridOption = {
            rowData: [],
            context: this,
            columnDefs: []
        };
        this.panReportOutputGridOptions = {
            rowData: [],
            context: this,
            columnDefs: []
        };
        this.isEnableSubReset = true;
        this.reportOutputService.isShowReportMainComp.subscribe((obj) => {
            if (obj != null) {
                this.isShowMainComp = obj;
            }
        });
        this.sharedService.tabObs.subscribe((obj) => {
            if (obj && obj['type']) {
                    if (obj['type'] == "change" && obj['routerLink'] == "report" && obj['menuId']==this.sharedService.tabArray[this.sharedService.currentActiveTab].menuId) {                      
                       // this.setGridHeight = false;
                       // this.setoutPutGridHeight();                                                
                    }               
            }           
        });
        this.reportOutputService.isShowReportMainComp.subscribe((obj) => {
            if (obj != null) {                
                this.isShowMainComp = (obj['isShowMain'] !=undefined ? obj['isShowMain'] :true);
                this.enabledExport =  (obj['enabledExport']!=undefined ? obj['enabledExport'] :true);
                this.isFilterShow =  (obj['isFilterShow'] !=undefined  ? obj['isFilterShow'] : true);
            }
        });
    }

    showSidebar() {
        this.isShowSideBar = !this.isShowSideBar;
    }

    generateReport(emitData) {
    
        if(emitData.type=="clerarGrid") {
            this.gridCount = [];
            this.reportHeaderOp.clear();
            this.reportFooterOp.clear();
            this.exportButtonArr=[];
            return;
        }   
         let data = emitData.data;
        this.reportExecutorGridPaginationObject = [];
        this.reportExecutorGridObject = [];
        this.cdref.detectChanges();
        this.gridStyle=[];
        this.reportOutputService.showReportMainComp(true);
        this.reportData=[];
        if (Util.checkResponse(data)) {

            this.showSidebar();
            if (this.rptExportOnly == "Y") {

                this.directExport(data);
                return;
            }
            if (this.rptOutputDisplay == "N") {
                if (data.responseMsg) {
                    this.toastMessageService.showMessage(survConst.ERROR_STATUS[data.responseCode], data.responseMsg, survConst.ERROR_STATUS[data.responseCode]);
                }
                return false;
            }
            else {
                this.setMultipleGridOptions(data.resultData);
            }
        } else {
            this.showSidebar();
            this.toastMessageService.showMessage(survConst.ERROR_STATUS[data.responseCode], data.responseMsg, survConst.ERROR_STATUS[data.responseCode]);
        }
    }

    reportPaginationData(pageNo, i) {
        this.reportExecutorGridPaginationObject[i].pageNo = pageNo;
        if (this.rptComponent.reportDataReq && this.rptComponent.reportDataReq instanceof Object) {
            delete this.rptComponent.reportDataReq['pageNo'];
            // delete this.rptComponent.reportDataReq['from'];
            this.rptComponent.reportDataReq['pageSize'] = survConst.RECORDS_PER_PAGE;
            this.rptComponent.reportDataReq['fromRecord'] = this.reportExecutorGridPaginationObject[i].pageNo == 1 ? 0 : ((this.reportExecutorGridPaginationObject[i].pageNo - 1) * survConst.RECORDS_PER_PAGE);
            this.rptComponent.reportDataReq['tableId'] = this.reportExecutorGridPaginationObject[i].tableId;
        }
        let req: any = {};
        this.restService.postRequestWithParamater('loadPaginationGridData', this.rptComponent.reportDataReq).subscribe(data => this.loadPaginationGridDataCallback(data, i));
    }

    loadPaginationGridDataCallback(data, i) {
        if (Util.checkResponse(data)) {
            if (data.resultData && data.resultData && data.resultData.data && data.resultData.data instanceof Array) {
                //this.reportOutputGridOption.api.setRowData(data.resultData);   
                this.reportExecutorGridObject[i].api.setRowData(data.resultData.data);
                this.reportExecutorGridPaginationObject[i]['paginationObj'] = CommonFunction.setPagination({}, this.reportExecutorGridPaginationObject[i].pageNo, this.reportExecutorGridPaginationObject[i].count);
            }
        } else {
            console.log(data.responseMsg);
        }
    }

    onReportOutputGridReady(params,i) {
        this.reportOutputApi[i] = params.api;
    }

    setDescription(data) {
        this.reportDescription = data.description;
        this.isAllowedReportPagination = data.paginationFlag;
        this.rptOutputDisplay = data.rptOutputDisplay;
        this.rptExportOnly = data.rptExportOnly;
    }
    generateOutputComponent(data) {

        let componentFactory;
        this.extraData.reportInfo = (data.info) ? data.info : null;
        this.reportOutputService.reportOutputData = this;
        this.reportHeaderOp.clear();
        this.reportFooterOp.clear();
        let fetchMainMenuHeader = this.router.config.filter((ele) => {
            return ele['path'] == this.reportName + "Header";
        });
        if (fetchMainMenuHeader && fetchMainMenuHeader[0]) {
            componentFactory = this.componentFactoryResolver.resolveComponentFactory(fetchMainMenuHeader[0].component);
            this.reportHeaderOp.createComponent(componentFactory);
        }
        let fetchMainMenuFooter = this.router.config.filter((ele) => {
            return ele['path'] == this.reportName + "Footer";
        });
        if (fetchMainMenuFooter && fetchMainMenuFooter[0]) {
            componentFactory = this.componentFactoryResolver.resolveComponentFactory(fetchMainMenuFooter[0].component);
            this.reportFooterOp.createComponent(componentFactory);
        }
    }
    setMultipleGridOptions(data) {
        let infoMsg = '';
        this.exportButtonArr=[];
        this.reportData = data;
        this.exportQryCount = data.length;
        this.gridOtherInfo = [];
        this.tableTitle=[];
        let  infoObj:any={};
        this.setGridHeight = false;
        let tmpGridObj:any=[];
        // if (!data || data.length == 0) {
        //     return false;
        // }
        
        if (data[0] &&  data[0].reportName) {
            this.reportName =   data[0].reportName;
        }
    
        this.gridCount = Array.from({ length:data.length }, (x, i) => i);
        // if (data[0].info) {
        this.generateOutputComponent(data[0]);
        //}
        this.isShowOutputGrid = true;
        this.enabledButtonOne = false;
        if (data[0].info && data[0].info.buttonOneEnable && data[0].info.buttonOneEnable == "Y") {
            this.enabledButtonOne = true;          
            this.generateExportButton(data[0].info);                             
        }
        else {
            this.generateExportButton({});   
        }
     
        for (let c = 0; c <  data.length; c++) {
            infoObj={
                "tableTitle":null,
                "header":null,
                "footer":null
            }
            if (data[c] &&   data[c].info &&  data[c].info.Error && infoMsg == '') {
                infoMsg =     data[c].info.Error;
                this.toastMessageService.showMessage(survConst.ERROR_STATUS[-1], infoMsg, survConst.ERROR_STATUS[-1]);

            }
            if (data[c].count &&   data[c].count == 0 && infoMsg == '') {
                infoMsg = "No data found";
                this.toastMessageService.showMessage(survConst.ERROR_STATUS[-1], infoMsg, survConst.ERROR_STATUS[-1]);

            }

            this.reportExecutorGridPaginationObject[c] = {
                paginationObj: {}
            }
            //this.gridStyle[c] = { 'height':"350px"};
            // if (data[c].info &&     data[c].info.gridStyle) {
            //     this.gridStyle[c] =  { 'height':     data[c].info.gridStyle+"px" };
            // }
           
            this.enabledExport = true;
            if (data[c].info &&  data[c].info.exportFlag &&  data[c].info.exportFlag == "N") {
                this.enabledExport = false;
            }           
            let gridHeader = this.reportOutputService.generateHeader(data[c], c);
            let gridObj = {
                rowData: (    data[c].data) ?     data[c].data : [],
                context: this,
                columnDefs: gridHeader,
                getRowStyle: (params) => {
                    // console.log( this.gridRowStyle);
                    let styleobj = {};
                    if (this.reportOutputService.gridRowStyle[c] && this.reportOutputService.gridRowStyle[c]['color']) {
                        styleobj['background'] = params.data[this.reportOutputService.gridRowStyle[c]['color']]

                    }
                    if (this.reportOutputService.gridRowStyle[c] && this.reportOutputService.gridRowStyle[c]['fontWeight']) {
                        styleobj['fontWeight'] = params.data[this.reportOutputService.gridRowStyle[c]['fontWeight']]
                    }
                    return styleobj;

                }
            };
            if (CommonFunction.NotNullOrDefine(data[c].count)) {
                this.reportExecutorGridPaginationObject[c]['count'] =   data[c].count;
            }
            if (CommonFunction.NotNullOrDefine(data[c].info)) {
                this.reportExecutorGridPaginationObject[c]['tableId'] =  data[c].info.tableId;
            }

            if (data[c].data &&   data instanceof Array &&   data[c].data.length > 0) {
                if (this.reportExecutorGridPaginationObject[c].pageNo == null) {
                    this.reportExecutorGridPaginationObject[c]['pageNo'] = 1;
                }
                if (this.isAllowedReportPagination == "Y") {
                    this.reportExecutorGridPaginationObject[c]['paginationObj'] = CommonFunction.setPagination({}, this.reportExecutorGridPaginationObject[c].pageNo, this.reportExecutorGridPaginationObject[c].count);
                }
                else {
                    this.reportExecutorGridPaginationObject[c]['paginationObj'] = {};
                }
            }
            if (CommonFunction.NotNullOrDefine( data[c].info)) {
                infoObj={
                    "tableTitle":data[c].info.tableTitle,
                    "header":data[c].info.header,
                    "footer":data[c].info.footer 
                }                                     
            }
            this.gridOtherInfo.push(infoObj);   
            tmpGridObj.push(gridObj);
        }        
        this.reportExecutorGridObject = [];
        this.reportExecutorGridObject = [...tmpGridObj];
        
    }

    exportButtonClickEvent(index:number) {
        var pageNum = 1;
        var dataCount = this.reportExecutorGridPaginationObject[0]['count'];
        for (var i = 0; i < this.reportExecutorGridPaginationObject.length; i++) {
            if (this.reportExecutorGridPaginationObject[i]['count'] > 0) {
                dataCount = this.reportExecutorGridPaginationObject[i]['count'];
                break;
            }
        }

        // if (dataCount > 0) {
            if (ReportOutputConfig.reportDataLimit[this.reportName] && dataCount > ReportOutputConfig.reportDataLimit[this.reportName]) {
                this.toastMessageService.showMessage(survConst.ERROR_STATUS[1], messageConstant.CommonMessage.RECORDLIMITEXCEEDFREXL, survConst.ERROR_STATUS[1]);
                return;
            }
            if (ReportOutputConfig.exportDataCount[this.reportName]) {
                var pages = dataCount / ReportOutputConfig.exportDataCount[this.reportName];
            }
            else {
                var pages = dataCount / survConst.RECORDS_PER_PAGE_FOR_EXPORT;
            }
            let pgCnt = Math.ceil(pages);
            if(pgCnt==0){
                this.export(1,index);
            }else{
            for (var i = 0; i < pgCnt; i++) {
                this.export(pageNum,index);
                pageNum++;
            }
        }
        // } else {
        //     this.toastMessageService.showMessage(survConst.ERROR_STATUS[1], "No rows to export", survConst.ERROR_STATUS[1]);
        // }


    }

    multipleExport(index) {
        this.exportCompletedCount = 0;
        let methodName =  this.exportButtonArr[index].buttonOneMethodName;
        let tmpreq = Object.assign({}, this.rptComponent.reportDataReq);
        if(this.rptComponent.buttonClickData) {
            let item = this.rptComponent.buttonClickData;
            tmpreq['argument'+item.prmParamId] = item.prmListName;   
        }
        tmpreq['exportMethodName'] = methodName;
        this.exportButtonArr[index].status = "exporting"
        for(var i = 0; i < this.reportData.length; i++) {
            tmpreq['queryId'] = this.reportData[i].info.qryId;
            this.restService.postRequestWithParamater('exportReportData', tmpreq, false).subscribe(
                data => this.multipleExportCallback(data, index, tmpreq),
            err => {
                this.isExporting = false;
                this.exportButtonArr[index].status = null;
            });
        }
    }

    multipleExportCallback(data, index, req) {
        if(Util.checkResponse(data)) {
            this.exportCompletedCount++;
            if(this.exportQryCount == this.exportCompletedCount) {
                req.queryId = -1;
                this.restService.postRequestWithParamater('exportReportData', req, false).subscribe(
                    data => this.exportcallBack(data, 1, index),
                err => {
                    this.isExporting = false;
                    this.exportButtonArr[index].status = null;
                });
            }
        }
    }

    export(pageNum: number, index:number) {
        // if (this.isExporting) {
        //     return;
        // }
        if(this.rptComponent.reportDataReq.queryId) {
            this.multipleExport(index);
            return;
        }
        this.isExporting = true;
        let methodName =  this.exportButtonArr[index].buttonOneMethodName;
        if (ReportOutputConfig.exportDataCount[this.reportName]) {
            this.rptComponent.reportDataReq['pageSize'] = ReportOutputConfig.exportDataCount[this.reportName];
            this.rptComponent.reportDataReq['fromRecord'] = pageNum == 1 ? 0 : ((pageNum - 1) * ReportOutputConfig.exportDataCount[this.reportName]);
        }
        else {
            this.rptComponent.reportDataReq['pageSize']  =  survConst.RECORDS_PER_PAGE_FOR_EXPORT;
            this.rptComponent.reportDataReq['fromRecord'] = pageNum == 1 ? 0 : ((pageNum - 1) * survConst.RECORDS_PER_PAGE_FOR_EXPORT);
        }
        
        let tmpreq = Object.assign({}, this.rptComponent.reportDataReq);
        if(this.rptComponent.buttonClickData) {
            let item = this.rptComponent.buttonClickData;
            tmpreq['argument'+item.prmParamId] = item.prmListName;   
        }
        tmpreq['exportMethodName'] = methodName;
        this.exportButtonArr[index].status = "exporting"
        this.restService.postRequestWithParamater('exportReportData', tmpreq, false).subscribe
            (data => this.exportcallBack(data, pageNum, index),
            err => {
                this.isExporting = false;
                this.exportButtonArr[index].status = null;
            });
    }
    exportcallBack(data, pageNum,index) {
        var base64 = require('base64-js');
        //this.isExporting = false;
        this.exportButtonArr[index].status = null;
        var FileSaver = require('file-saver');
        if (data.responseMsg == "SUCCESS") {
            if (data.resultData && data.resultData.file_Data) {
                var base64file = data.resultData.file_Data;
                var file = new Blob([base64.toByteArray(base64file)]);
                FileSaver.saveAs(file, data.resultData.file_name + "-" + pageNum + data.resultData.fileFormat);
            }
        }
    }
    panReportOutputGridReady(params) {

    }
    
    gridClickEvent(params) {

        if (CommonFunction.NotNullOrDefine(params.colDef.Clickable) && params.colDef.Clickable) {
            let componentFactory;
            this.reportContentOp.clear();
            this.extraData.gridParam = params;
            this.reportOutputService.reportOutputData = this;
            this.reportOutputService.showReportMainComp(false);
            let fetchMainMenuHeader = this.router.config.filter((ele) => {
                return ele['path'] == this.reportName + "Content";
            });

            if (fetchMainMenuHeader && fetchMainMenuHeader[0]) {
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(fetchMainMenuHeader[0].component);
                this.reportContentOp.createComponent(componentFactory);
            }
        }

    }
    ngOnDestroy() {
        this.isShowMainComp = true;
        //this.reportOutputService.isShowReportMainComp.unsubscribe();
    }


    directExport(data) {
       var pageNum = 1;
        if (Util.checkResponse(data)) {
            console.log(data);          
            if (data && data.resultData[0] && data.resultData[0].count > 0) {
                var pages = data.resultData[0].count / ReportOutputConfig.exportDataCount[this.rptComponent.reportDataReq.reportName];
                let pgCnt = Math.ceil(pages);
                this.directExportTotalCount = pgCnt;
                for (var i = 0; i < pgCnt; i++) {
                    this.directExportGenExcel(pageNum);
                    pageNum++;
                }
            }
        }
    }

     directExportGenExcel(pageNum) {
        
        this.directExportDownloadFlag = true;          
        if (this.rptComponent.reportDataReq && this.rptComponent.reportDataReq instanceof Object) {
            delete this.rptComponent.reportDataReq['pageNum'];
            this.rptComponent.reportDataReq['pageSize'] = ReportOutputConfig.exportDataCount[this.rptComponent.reportDataReq.reportName];
            this.rptComponent.reportDataReq['fromRecord'] = pageNum == 1 ? 0 : ((pageNum - 1) * ReportOutputConfig.exportDataCount[this.rptComponent.reportDataReq.reportName]);
        }
        this.restService.postRequestWithParamater('exportOnlyReportData', this.rptComponent.reportDataReq, false).subscribe(data => {
            this.directExportGenExcelCallBack(data, pageNum)
        },
        err => {
                this.directExportTotalCount--;
        });
    }

    directExportGenExcelCallBack(data, pageNum) {
        this.directExportTotalCount--;
        if(  this.directExportTotalCount==0) {
            this.directExportDownloadFlag =false;
        }
        var base64 = require('base64-js');
        var FileSaver = require('file-saver');
        if (data.resultData) {
            var base64file = data.resultData;
            var file = new Blob([base64.toByteArray(base64file)]);
            FileSaver.saveAs(file, "dataExport" + "-" + pageNum + ".csv");
        }
    }
   
    // setoutPutGridHeight() {
    //    // setTimeout(()=>{
    //        if(this.reportData.length ==0) {
    //          return false;
    //        }
    //        let totalGrid= this.reportData.length;
    //        let headerHeight= $(`#${this.menuId} .report-header`).height();
    //        let footerHeight= $(`#${this.menuId} .report-footer`).height();
    //        let pginationHeight= $(`#${this.menuId} .grid-pagination`).height()+4; 
    //        let gridTitle= $(`#${this.menuId}  .grid-title`).height();
    //        let gridHeaderHeight= $(`#${this.menuId} .grid-header-text`).height();
    //        let gridFooterHeight= $(`#${this.menuId} .grid-footer-text`).height();  
         
    //        //console.log(   this.reportOutputApi);
    //        if (headerHeight > 0) {
    //            $(`#${this.menuId} .main-component`).css("margin-top", "42px"); 
    //        }
    //        else {
    //            $(`#${this.menuId} .main-component`).css("margin-top", "43px"); 
    //        }
    //        let mainComponentMargin= parseInt($(`#${this.menuId} .main-component`).css('marginTop'));               
    //        if(totalGrid==1) {    
    //           this.sharedService.setFullHeightToMain = true; 
    //             $(`#${this.menuId} .grid-row:eq(0)`).css({
    //               height:`100%`
    //             });          
    //             if(headerHeight==0  && footerHeight==0) {     
                             
    //                 let rptContentHeight = mainComponentMargin+pginationHeight+10+gridTitle+gridHeaderHeight+gridFooterHeight;                   
    //                 this.rptContentStyle = {                      
    //                     height: `calc(100% - ${rptContentHeight}px)`
    //                 };               
    //                 this.gridStyle[0]= {
    //                     height:"100%"
    //                 }             
    //             }               
    //             else {
    //                   this.gridStyle[0]= {
    //                     height: '100%'
    //                    } 
    //                    let rptContentHeight =  mainComponentMargin+(headerHeight+30)+footerHeight+pginationHeight+10+gridTitle+gridHeaderHeight+gridFooterHeight;                    
    //                    this.rptContentStyle= {
    //                         height: `calc(100% - ${rptContentHeight}px)`
    //                    };
    //                 }                                                                                                                                
    //        }          
    //        else if(totalGrid==2) {    
    //           this.sharedService.setFullHeightToMain = true;                         
    //             if(headerHeight==0  && footerHeight==0) {   
    //                 this.rptContentStyle = {
    //                     height: "calc(100% - 52px)"
    //                 }; 
                     
    //                 $(`#${this.menuId} .grid-row:eq(0)`).css({
    //                     height:`50%`
    //                 })
    //                 $(`#${this.menuId} .grid-row:eq(1)`).css({
    //                     height:`50%`
    //                 })

    //                 this.gridStyle[0]= {
    //                     height:  `calc(100% - ${pginationHeight}px)`
    //                  };
    //                  this.gridStyle[1]= {
    //                     height: `calc(100% - ${pginationHeight}px)`
    //                  }    
    //             }
    //             else {
    //                 this.rptContentStyle={
    //                     height: "inherit"
    //                 };
    //                 this.sharedService.setFullHeightToMain = false;
    //                 $(`#${this.menuId} .grid-row`).height("auto");
    //                 this.gridStyle[0]= {
    //                     height:"300px"
    //                  };
    //                  this.gridStyle[1]= {
    //                     height:"300px"
    //                  }   
    //             }
    //        }
    //        else {
    //            this.rptContentStyle={
    //               height: "inherit"
    //            };
    //            this.sharedService.setFullHeightToMain = false;
    //            $(`#${this.menuId} .grid-row`).height("auto");
    //            for(let c=0;c<totalGrid;c++) {
    //               this.gridStyle[c]= {
    //                 height:"300px"
    //               };
    //             }
    //        }
    //    // },3000)        
    //  }
     ngAfterViewChecked() {
         if (this.setGridHeight==true) {
             return;
         }
         if(this.reportOutputApi) {
           this.setGridHeight=true;
            this.setoutPutGridHeight();
         }
     }

     setoutPutGridHeight() {
        setTimeout(() => {
            var reportHeader = $(`#${this.menuId} .report-header`).outerHeight(true);
            var reportFooter = $(`#${this.menuId} .report-footer`).outerHeight(true);
            var reportFilterexport = $(`#${this.menuId} .filter-export-btn`).outerHeight(true)+9;
            this.rptContentStyle = {
                width: '100%',
                'height': `calc(100% - ${reportHeader + reportFooter + reportFilterexport}px)`,
                marginTop:"10px"
            }

            if (this.reportOutputApi.length != 0) {
                let gridLength = this.reportData.length;
                if (gridLength == 1) {    
                    let headerHeight:any;
                    let agGridScrollHeight:any;     
                    if(this.reportData[0].data !=null && this.reportData[0].data.length ==1) {
                        headerHeight = $(`#${this.menuId} .report-output-grid0 .ag-header`).outerHeight(true);
                        agGridScrollHeight = $(`#${this.menuId} .report-output-grid0 .ag-body-horizontal-scroll`).outerHeight(true);                        
                        this.gridStyle[0] = {
                            'height': (headerHeight + agGridScrollHeight + 31)+'px',
                            'width': '100%'
                        };
                    }      
                    else {
                        this.reportOutputApi[0].setDomLayout("autoHeight");
                    }
                    
                    let gridautoHeight = $(`#${this.menuId} .report-output-grid0`).outerHeight(true);
                    var gridTitleHeight = $(`#${this.menuId} .grid-title0`).outerHeight(true);
                    var gridPaginmation = $(`#${this.menuId} .grid-pagination0`).outerHeight(true);
                    let finalGrigHeight1 = gridTitleHeight + gridPaginmation;
                    setTimeout(() => {
                        this.reportOutputApi[0].setDomLayout("normal");
                        this.gridRowStyle[0] = {
                            height: "100%"
                        }
                        this.gridStyle[0] = {
                            'height': `calc(100% - ${finalGrigHeight1}px)`,
                            'width': '100%'
                        };
                    })
                    setTimeout(() => {
                        let gridHeight = $(`#${this.menuId} .report-output-grid0`).outerHeight(true);                     
                        if (gridautoHeight < gridHeight) {
                            if(this.reportData[0].data !=null  && this.reportData[0].data.length ==1) {                             
                                 this.gridStyle[0] = {
                                     'height': (headerHeight + agGridScrollHeight + 31)+'px',
                                     'width': '100%'
                                 };
                             }      
                             else {
                                 this.reportOutputApi[0].setDomLayout("autoHeight");
                                 this.gridRowStyle[0] = {
                                    height:"auto"
                                }
                                this.gridStyle[0] = {
                                    'height': "auto",
                                    'width': '100%'
                                };
                             }
                                                                               
                        }
                        else {
                            this.reportOutputApi[0].setDomLayout("normal");
                        }
                    })
                }
                else if (gridLength == 2) {
                    let gridTitleHeight: any = [];
                    let gridPaginmation: any = [];
                    let gridautoHeight: any = [];
                    let gridHeight: any = [];
                    let gridAutoRowHeight: any = [];
                    let isGridAutoFit: any = [];
                    let gridHeaderHeight:any=[];
                    let gridScrollHeight:any=[];
                    for (let c = 0; c < gridLength; c++) {
                        gridScrollHeight[c] = $(`#${this.menuId} .report-output-grid${c} .ag-body-horizontal-scroll`).outerHeight(true);
                        gridHeaderHeight[c] = $(`#${this.menuId} .report-output-grid${c} .ag-header`).outerHeight(true);
                        if(this.reportData[c].data !=null  && this.reportData[c].data.length ==1) {                                                       
                            this.gridStyle[c] = {
                                'height': (gridScrollHeight[c] + gridHeaderHeight[c] + 31)+'px',
                                'width': '100%'
                            };
                        }      
                        else {
                            this.reportOutputApi[c].setDomLayout("autoHeight");
                        }
                      
                    }
                    setTimeout(() => {
                        for (let c = 0; c < gridLength; c++) {
                            gridautoHeight[c] = $(`#${this.menuId} .report-output-grid${c}`).outerHeight(true);
                            gridAutoRowHeight[c] = $(`#${this.menuId} .grid-row${c}`).outerHeight(true);                                
                        }
                        for(let c=0;c<gridLength;c++) {
                            gridTitleHeight[c] = $(`#${this.menuId} .grid-title${c}`).outerHeight(true);
                            gridPaginmation[c] = $(`#${this.menuId} .grid-pagination${c}`).outerHeight(true);                       
                            let finalGrigHeight = gridTitleHeight[c] + gridPaginmation[c];
                            this.reportOutputApi[c].setDomLayout("normal");
                            this.gridRowStyle[c] = {
                                height: "50%"
                            }
                            this.gridStyle[c] = {
                                'height': `calc(100% - ${finalGrigHeight}px)`,
                                'width': '100%'
                            };
                        }

                    },0.08)
                  

                    setTimeout(() => {
                        for (let c = 0; c < gridLength; c++) {
                            gridHeight[c] = $(`#${this.menuId} .report-output-grid${c}`).outerHeight(true);
                            if (gridautoHeight[c] < gridHeight[c]) {
                                isGridAutoFit[c] = true;
                            }
                            else {
                                isGridAutoFit[c] = false;
                            }
                        }
                        setTimeout(() => {
                            // this.gridApi[0].setDomLayout("autoHeight");
                            //this.gridApi[1].setDomLayout("autoHeight");
                            if (isGridAutoFit.filter(x => x === true).length != 2 && isGridAutoFit.filter(x => x === false).length != 2) {
                                if (isGridAutoFit[1] == true) {
                                    if(this.reportData[1].data !=null  && this.reportData[1].data.length ==1) {                                                       
                                        this.gridStyle[1] = {
                                            'height': (gridScrollHeight[1] + gridHeaderHeight[1] + 31)+'px',
                                            'width': '100%'
                                        };
                                    }      
                                    else {
                                        this.reportOutputApi[1].setDomLayout("autoHeight");
                                    }
                                    let finalGrigHeight = gridTitleHeight[0] + gridPaginmation[0];
                                    this.reportOutputApi[0].setDomLayout("normal");
                                    this.gridRowStyle[0] = {
                                        height: `calc(100% - ${gridAutoRowHeight[1]}px)`
                                    }
                                    this.gridStyle[0] = {
                                        'height': `calc(100% - ${finalGrigHeight}px)`,
                                        'width': '100%'
                                    };
                                    this.gridRowStyle[1] = {
                                        height: `auto`
                                    }

                                }
                                else {
                                    if(this.reportData[0].data.length ==1) {                                                       
                                        this.gridStyle[0] = {
                                            'height': (gridScrollHeight[0] + gridHeaderHeight[0] + 31)+'px',
                                            'width': '100%'
                                        };
                                    }      
                                    else {
                                        this.reportOutputApi[0].setDomLayout("autoHeight");
                                    }
                                    let finalGrigHeight = gridTitleHeight[1] + gridPaginmation[1];
                                    this.reportOutputApi[1].setDomLayout("normal");
                                    this.gridRowStyle[1] = {
                                        height: `calc(100% - ${gridAutoRowHeight[1]}px)`
                                    }
                                    this.gridStyle[1] = {
                                        'height': `calc(100% - ${finalGrigHeight}px)`,
                                        'width': '100%'
                                    };
                                    this.gridRowStyle[0] = {
                                        height: `auto`
                                    }
                                }                               
                            }
                            else if(isGridAutoFit.filter(x => x === true).length==2) {

                                for(let c=0;c<gridLength;c++) {
                                    if(this.reportData[c].data !=null  && this.reportData[c].data.length ==1) {                                                       
                                        this.gridStyle[c] = {
                                            'height': (gridScrollHeight[c] + gridHeaderHeight[c] + 31)+'px',
                                            'width': '100%'
                                        };
                                    }      
                                    else {
                                        this.reportOutputApi[c].setDomLayout("autoHeight");
                                    }
                                        this.gridRowStyle[c] = {
                                            height:"auto"
                                        }
                                        this.gridStyle[c] = {
                                            'height': "auto",
                                            'width': '100%'
                                        };
                                }                                                                                                                            

                            }
                        }, 0.08)


                    })

                    console.log(this.gridRowStyle);
                }
                else if (gridLength == 3) {
                    let gridTitleHeight: any = [];
                    let gridPaginmation: any = [];
                    let gridautoHeight: any = [];
                    let gridHeight: any = [];
                    let gridAutoRowHeight: any = [];
                    let isGridAutoFit: any = [];
                    let gridHeaderHeight:any=[];
                    let gridScrollHeight:any=[];
                    for (let c = 0; c < gridLength; c++) {
                        gridScrollHeight[c] = $(`#${this.menuId} .report-output-grid${c} .ag-body-horizontal-scroll`).outerHeight(true);
                        gridHeaderHeight[c] = $(`#${this.menuId} .report-output-grid${c} .ag-header`).outerHeight(true);
                        if(this.reportData[c].data !=null  && this.reportData[c].data.length ==1) {                                                       
                            this.gridStyle[c] = {
                                'height': (gridScrollHeight[c] + gridHeaderHeight[c] + 31)+'px',
                                'width': '100%'
                            };
                        }      
                        else {
                            this.reportOutputApi[c].setDomLayout("autoHeight");
                        }
                    }

            

                    //return;
                    setTimeout(() => {
                        for (let c = 0; c < gridLength; c++) {
                            gridautoHeight[c] = $(`#${this.menuId} .report-output-grid${c}`).outerHeight(true);
                            gridAutoRowHeight[c] = $(`#${this.menuId} .grid-row${c}`).outerHeight(true);                                                         
                        }
                        for(let c=0;c<gridLength;c++) {
                            gridTitleHeight[c] = $(`#${this.menuId} .grid-title${c}`).outerHeight(true);
                            gridPaginmation[c] = $(`#${this.menuId} .grid-pagination${c}`).outerHeight(true);
                            let finalGrigHeight = gridTitleHeight[c] + gridPaginmation[c];
                            this.reportOutputApi[c].setDomLayout("normal");
                            this.gridRowStyle[c] = {
                                height: 100 / 3 + "%"
                            }
                            this.gridStyle[c] = {
                                'height': `calc(100% - ${finalGrigHeight}px)`,
                                'width': '100%'
                            };
                        }
                        
                    },1000);                                                         
                    setTimeout(() => {
                        for (let c = 0; c < gridLength; c++) {
                            gridHeight[c] = $(`#${this.menuId} .report-output-grid${c}`).outerHeight(true);
                            if (gridautoHeight[c] < gridHeight[c]) {
                                isGridAutoFit[c] = true;
                            }
                            else {
                                isGridAutoFit[c] = false;
                            }
                        }
                        console.log("grid auto height");
                        console.log(gridautoHeight);
                        console.log("normal grid  height");
                        console.log(gridHeight);

                        console.log("grid auto height variable");
                        console.log(isGridAutoFit);

                        setTimeout(() => {
                            if (isGridAutoFit.filter(x => x === true).length != 3 && isGridAutoFit.filter(x => x === false).length != 3) {
                                if (isGridAutoFit[0] == true && isGridAutoFit[1] == true && isGridAutoFit[2] == false) {
                                    if(this.reportData[0].data !=null  && this.reportData[0].data.length ==1) {                                                       
                                        this.gridStyle[0] = {
                                            'height': (gridScrollHeight[0] + gridHeaderHeight[0] + 31)+'px',
                                            'width': '100%'
                                        };
                                    }      
                                    else {
                                        this.reportOutputApi[0].setDomLayout("autoHeight");
                                    }

                                   if(this.reportData[1].data.length ==1) {                                                       
                                     this.gridStyle[1] = {
                                                 'height': (gridScrollHeight[1] + gridHeaderHeight[1] + 31)+'px',
                                                'width': '100%'
                                    };
                                   }      
                                 else {
                                     this.reportOutputApi[1].setDomLayout("autoHeight");
                                  }



                                    this.gridRowStyle[0] = {
                                        height: `auto`
                                    }
                                    this.gridRowStyle[1] = {
                                        height: `auto`
                                    }
                                    let totalRowHeight = gridAutoRowHeight[0] + gridAutoRowHeight[1];
                                    this.gridRowStyle[2] = {
                                        height: `calc(100% - ${totalRowHeight}px)`
                                    }
                                    let finalGrigHeight = gridTitleHeight[2] + gridPaginmation[2];
                                    this.gridStyle[2] = {
                                        'height': `calc(100% - ${finalGrigHeight}px)`,
                                        'width': '100%'
                                    };
                                }

                                if (isGridAutoFit[0] == true && isGridAutoFit[1] == false && isGridAutoFit[2] == true) {
                                    if(this.reportData[0].data !=null  && this.reportData[0].data.length ==1) {                                                       
                                        this.gridStyle[0] = {
                                            'height': (gridScrollHeight[0] + gridHeaderHeight[0] + 31)+'px',
                                            'width': '100%'
                                        };
                                    }      
                                    else {
                                        this.reportOutputApi[0].setDomLayout("autoHeight");
                                    }
                                    if(this.reportData[2].data !=null  && this.reportData[2].data.length ==1) {                                                       
                                        this.gridStyle[2] = {
                                            'height': (gridScrollHeight[2] + gridHeaderHeight[2] + 31)+'px',
                                            'width': '100%'
                                        };
                                    }      
                                    else {
                                        this.reportOutputApi[2].setDomLayout("autoHeight");
                                    }
                                    this.gridRowStyle[0] = {
                                        height: `auto`
                                    }
                                    this.gridRowStyle[2] = {
                                        height: `auto`
                                    }
                                    let totalRowHeight = gridAutoRowHeight[0] + gridAutoRowHeight[2];
                                    this.gridRowStyle[1] = {
                                        height: `calc(100% - ${totalRowHeight}px)`
                                    }
                                    let finalGrigHeight = gridTitleHeight[2] + gridPaginmation[2];
                                    this.gridStyle[1] = {
                                        'height': `calc(100% - ${finalGrigHeight}px)`,
                                        'width': '100%'
                                    };

                                }
                                if (isGridAutoFit[0] == false && isGridAutoFit[1] == true && isGridAutoFit[2] == true) {
                                    if(this.reportData[1].data !=null  && this.reportData[1].data.length ==1) {                                                       
                                        this.gridStyle[1] = {
                                            'height': (gridScrollHeight[1] + gridHeaderHeight[1] + 31)+'px',
                                            'width': '100%'
                                        };
                                    }      
                                    else {
                                        this.reportOutputApi[1].setDomLayout("autoHeight");
                                    }
                                    if(this.reportData[2].data !=null  && this.reportData[2].data.length ==1) {                                                       
                                        this.gridStyle[2] = {
                                            'height': (gridScrollHeight[2] + gridHeaderHeight[2] + 31)+'px',
                                            'width': '100%'
                                        };
                                    }      
                                    else {
                                        this.reportOutputApi[2].setDomLayout("autoHeight");
                                    }
                                    this.gridRowStyle[1] = {
                                        height: `auto`
                                    }
                                    this.gridRowStyle[2] = {
                                        height: `auto`
                                    }
                                    let totalRowHeight = gridAutoRowHeight[1] + gridAutoRowHeight[2];
                                    this.gridRowStyle[0] = {
                                        height: `calc(100% - ${totalRowHeight}px)`
                                    }
                                    let finalGrigHeight = gridTitleHeight[0] + gridPaginmation[0];
                                    this.gridStyle[0] = {
                                        'height': `calc(100% - ${finalGrigHeight}px)`,
                                        'width': '100%'
                                    };

                                }
                                if(isGridAutoFit[1]==false && isGridAutoFit[2]==false && isGridAutoFit[0]==true) {
                                    if(this.reportData[0].data !=null  && this.reportData[0].data.length ==1) {                                                       
                                        this.gridStyle[0] = {
                                            'height': (gridScrollHeight[0] + gridHeaderHeight[0] + 31)+'px',
                                            'width': '100%'
                                        };
                                    }      
                                    else {
                                        this.reportOutputApi[0].setDomLayout("autoHeight");
                                    }
                                    this.gridRowStyle[0] = {
                                        height: `auto`
                                    }
                                  
                                    let totalAutoRowHeight = gridAutoRowHeight[0];
                                    this.gridRowStyle[1] = {
                                        height: `calc(50% - ${totalAutoRowHeight/2}px)`                                        
                                    };
                                    let finalGrigHeight1 = gridTitleHeight[1] + gridPaginmation[1];
                                    this.gridStyle[1] = {
                                        'height': `calc(100% - ${finalGrigHeight1}px)`,
                                        'width': '100%'
                                    };
                                    this.gridRowStyle[2] = {
                                        height: `calc(50% - ${totalAutoRowHeight/2}px)`                                        
                                    };
                                    let finalGrigHeight2 = gridTitleHeight[2] + gridPaginmation[2];
                                    this.gridStyle[2] = {
                                        'height': `calc(100% - ${finalGrigHeight2}px)`,
                                        'width': '100%'
                                    };
                                }
                                if(isGridAutoFit[0]==false && isGridAutoFit[2]==false && isGridAutoFit[1]==true) {
                                    if(this.reportData[1].data !=null  && this.reportData[1].data.length ==1) {                                                       
                                        this.gridStyle[1] = {
                                            'height': (gridScrollHeight[1] + gridHeaderHeight[1] + 31)+'px',
                                            'width': '100%'
                                        };
                                    }      
                                    else {
                                        this.reportOutputApi[1].setDomLayout("autoHeight");
                                    }
                                    this.gridRowStyle[1] = {
                                        height: `auto`
                                    }
                                    let totalAutoRowHeight = gridAutoRowHeight[1];
                                    this.gridRowStyle[0] = {
                                        height: `calc(50% - ${totalAutoRowHeight/2}px)`                                        
                                    };
                                    let finalGrigHeight0 = gridTitleHeight[0] + gridPaginmation[0];
                                    this.gridStyle[0] = {
                                        'height': `calc(100% - ${finalGrigHeight0}px)`,
                                        'width': '100%'
                                    };
                                    this.gridRowStyle[2] = {
                                        height: `calc(50% - ${totalAutoRowHeight/2}px)`                                        
                                    };
                                    let finalGrigHeight2 = gridTitleHeight[2] + gridPaginmation[2];
                                    this.gridStyle[2] = {
                                        'height': `calc(100% - ${finalGrigHeight2}px)`,
                                        'width': '100%'
                                    };
                                }
                                if(isGridAutoFit[0]==false && isGridAutoFit[1]==false && isGridAutoFit[2]==true) {
                                    if(this.reportData[2].data !=null  && this.reportData[2].data.length ==1) {                                                       
                                        this.gridStyle[2] = {
                                            'height': (gridScrollHeight[2] + gridHeaderHeight[2] + 31)+'px',
                                            'width': '100%'
                                        };
                                    }      
                                    else {
                                        this.reportOutputApi[2].setDomLayout("autoHeight");
                                    }
                                    this.gridRowStyle[2] = {
                                        height: `auto`
                                    }
                                    let totalAutoRowHeight = gridAutoRowHeight[2];
                                    this.gridRowStyle[0] = {
                                        height: `calc(100% - ${totalAutoRowHeight/2}px)`                                        
                                    };
                                    let finalGrigHeight0 = gridTitleHeight[0] + gridPaginmation[0];
                                    this.gridStyle[0] = {
                                        'height': `calc(100% - ${finalGrigHeight0}px)`,
                                        'width': '100%'
                                    };
                                    this.gridRowStyle[1] = {
                                        height: `calc(100% - ${totalAutoRowHeight/2}px)`                                        
                                    };
                                    let finalGrigHeight1 = gridTitleHeight[1] + gridPaginmation[1];
                                    this.gridStyle[1] = {
                                        'height': `calc(100% - ${finalGrigHeight1}px)`,
                                        'width': '100%'
                                    };
                                }
                            }
                            else {
                                if(isGridAutoFit.filter(x => x === true).length == 3) {    
                                    
                                    for(let c=0;c < gridLength;c++) {
                                        if(this.reportData[c].data !=null  && this.reportData[c].data.length ==1) {                                                       
                                            this.gridStyle[c] = {
                                                'height': (gridScrollHeight[c] + gridHeaderHeight[c] + 31)+'px',
                                                'width': '100%'
                                            };
                                        }      
                                        else {
                                            this.reportOutputApi[c].setDomLayout("autoHeight");
                                        }
                                        this.gridRowStyle[c] = {
                                            height:"auto"
                                        }
                                        this.gridStyle[c] = {
                                            'height': "auto",
                                            'width': '100%'
                                        };                                        
                                    }                                                                                                          
                                   
                                }                              
                            }
                            
                        });
                    },1000);

                }
                else {
                    let headerHeight:any=[];
                    let agGridScrollHeight:any=[];
                    for(let c=0;c<gridLength;c++) {

                        if(this.reportData[c].data !=null  && this.reportData[c].data.length ==1) {
                            headerHeight = $(`#${this.menuId} .report-output-grid${c} .ag-header`).outerHeight(true);
                            agGridScrollHeight = $(`#${this.menuId} .report-output-grid${c} .ag-body-horizontal-scroll`).outerHeight(true);                        
                            this.gridStyle[c] = {
                                'height': (headerHeight + agGridScrollHeight + 31)+'px',
                                'width': '100%'
                            };
                        }      
                        else if(this.reportData[c].data !=null && this.reportData[c].data.length <=6) {
                            this.reportOutputApi[c].setDomLayout("autoHeight");
                            this.gridRowStyle[c] = {
                                height: `auto`
                            }
                        }
                        else {
                            this.gridStyle[c] = {
                                'height': '250px',
                                'width': '100%'
                            };
                        }
                    }

                }
            }

        }, 0.05)
    }




    generateExportButton(data) {
       if(this.exportButtonArr.length==0) {
            this.exportButtonArr= [{
                "buttonOneLabelName" :"Export",
                "buttonOneMethodName": "exportReport",
                "status" :null
            }];
       } 
       if (Object.keys(data).length){
            this.exportButtonArr.push({
                "buttonOneLabelName" :data.buttonOneLabelName,
                "buttonOneMethodName":data.buttonOneMethodName,
                "status" :null
            });
       }              
    }

}

