import { Component,OnInit,AfterViewChecked} from '@angular/core';
import { Title }     from '@angular/platform-browser';
import {GridOptions} from "ag-grid-community";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { HEADER_OFFSET } from '@angular/core/src/render3/interfaces/view';
import {AppService} from '../app.service';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

declare var $ :any;

@Component({
    selector: "market-repay",
    templateUrl:`./market-repay.html`
  })
  export class MarketRepayComponent implements OnInit, AfterViewChecked {
    private gridApi;
    private gridColumnApi;
    private gridApi1;
    private gridColumnApi1;
    private columnDefs;
 
   
    private rowData:any= [];
    

    public gridOptions=<GridOptions>{};
    private id:any;
    public dataArray=[];
    public p:number=0;
    public is_playing:boolean=true;
    public intval_st:any;
    public data:any=[];
    GRID_LIMIT=5;
    TOTAL_DATA_LIMIT=10;
    public currDataOffset=0;
    public limittodataFetch=10;
    public manualflag:boolean=false;
    public is_forward:boolean;
    public is_loaded_data:boolean;
    public getRowHeight;
    public minRowHeight=25;
    public currentRowHeight;
    constructor(private http: HttpClient,public appSer:AppService) {
      this.columnDefs = [
        {
         
        
          headerName: "Price Range",
         width:90,
         field: "prange",
          resizable: true,
        
        },
       {
        headerName:"buy",
        children:[
        {
          headerName: "From",
          field: "id",
          width: 20,
          resizable: true
        },
        {
          headerName: "To",
          field: "id",
          width: 20,
          resizable: true
        },
        {
          headerName: "Quantity",
          field: "id",
          width: 20,
          resizable: true
        }

      ]
      
    },
    {
      headerName:"Sell",
      children:[
        {
          headerName: "From",
          field: "id",
          width: 20,
          resizable: true
        },
        {
          headerName: "To",
          field: "id",
          width: 20,
          resizable: true
        },
        {
          headerName: "Quantity",
          field: "id",
          width: 20,
          resizable: true
        }


    ]
    
  }
    
      ];
      this.appSer.start();


     this.data= [{
        eid: 'e101',
        ename: 'ravi',
        esal: 1000
        },{
        eid: 'e102',
        ename: 'ram',
        esal: 2000
        },{
        eid: 'e103',
        ename: 'rajesh',
        esal: 3000
        }];

       
    
    }
  

ngAfterViewChecked(){

    // setInterval(()=>{
    //     $(".ag-body-viewport.ag-layout-normal").scrollTop(40); 
    // },1000)
    


}

ngOnInit(){
 ;

    this.gridOptions = {
        columnDefs: this.columnDefs,  
        enableFilter: true,
        suppressColumnVirtualisation:true,
        enableCellChangeFlash:true,
        suppressSetColumnStateEvents:true,
        rowSelection:"single",
        suppressScrollOnNewData:false
    };

    this.callApi(0);
   // this.navigateToNextCell = this.navigateToNextCell.bind(this);

var int=0;



}
    onGridReady(params) {
        //console.log("aa");
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi; 
      window.addEventListener("resize", ()=> {
        setTimeout(()=> {
          params.api.sizeColumnsToFit();
          this.resizeRow();
        });
      });       
    }

    onGridReady1(params) {
      //console.log("aa");
    this.gridApi1 = params.api;
    this.gridColumnApi1 = params.columnApi; 
    window.addEventListener("resize", ()=> {
      setTimeout(()=> {
        params.api.sizeColumnsToFit();
        this.resizeRow1();
      });
    });       
  }


    callApi(offset){
        this.is_loaded_data=false;
        let jsonObject = {
    
            lastSeqNmbr: 1,
            firstid: '',
            prevForwardFlag: 1,
            gotoStartSeqNmbr: 0
           
        }

        let httpHeaders = new HttpHeaders({
            'Content-Type' : 'application/json',
            'Cache-Control': 'no-cache'
             });   
             let options = {
                headers: httpHeaders
           };  
           //console.log(this.currDataOffset);
      this.http
        .post(
          "http://localhost/ang1/blog/public/getHugeData",
            jsonObject
          , options
        )
        .subscribe(data => {
            this.is_loaded_data=true;
         
          // if(this.manualflag==true){

            //if(data['data'].length > 0){
                this.dataArray=data['resultData']['Activity'];
                let tmp=1000;
                this.currDataOffset=offset;
                let pRange=["<10","5%-10%","10%-%15","Beyond 15"];
                this.dataArray.forEach( (element,key) => {
                    element['rowid']=key+1;
                    element['id']=tmp;
                    element['prange']=pRange[key];;
                    tmp=tmp+1000;
                });
              
                  this.rowData= this.dataArray;
                  this.resizeRow();
                  this.resizeRow1();
                
                console.log( this.rowData);
            //}
       // }
                                                  
        });
    }
         
    unwatch(){
      this.appSer.stop();
    }
         
    watch(){
      this.appSer.start();
    }

    public exportAsExcelFile(json: any[], excelFileName: string): void {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const workbook1: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data1'] };
     let  excelBuffer:any;
    
       XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(workbook1,worksheet)
       XLSX.write(workbook);
      this.saveAsExcelFile(excelBuffer, excelFileName);
      }



    private saveAsExcelFile(buffer: any, fileName: string='pankaj'): void {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([this.data], {
        type: EXCEL_TYPE
      });
      var today = new Date();
      var date = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate() + '_';
      var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
      var name = fileName + date + time;
      FileSaver.saveAs(data);

      }
      onGridSizeChanged(params) {
      
      // var gridHeight =$(".ag-body-viewport").offsetHeight();
      console.log(params);
      this.resizeRow();
    

    }
    onGridSizeChanged1(params) {
      
      // var gridHeight =$(".ag-body-viewport").offsetHeight();
      console.log(params);
      this.resizeRow1();
    

    }
    resizeRow(){
      setTimeout(()=>{
        var gridHeight= this.gridApi.gridCore.eGridDiv.children["0"].children["0"].children["0"].children[2].offsetHeight;
             var renderedRows = 4;
        
        if (renderedRows * this.minRowHeight >= gridHeight) {
          if (this.currentRowHeight !== this.minRowHeight) {
            this.currentRowHeight = this.minRowHeight;
            this.gridApi.resetRowHeights();
          }
        } else {
          this.currentRowHeight = Math.floor(gridHeight / renderedRows);
          this.gridApi.resetRowHeights();
        }
      
        this.gridApi.forEachNode(rowNode => {
          if (rowNode.data) {
            rowNode.setRowHeight(this.currentRowHeight);
          }
        });
        this.gridApi.onRowHeightChanged();
        this.gridApi.sizeColumnsToFit();
     },100)
    }

    resizeRow1(){
      setTimeout(()=>{
        var gridHeight= this.gridApi1.gridCore.eGridDiv.children["0"].children["0"].children["0"].children[2].offsetHeight;
             var renderedRows = 4;
        
        if (renderedRows * this.minRowHeight >= gridHeight) {
          if (this.currentRowHeight !== this.minRowHeight) {
            this.currentRowHeight = this.minRowHeight;
            this.gridApi1.resetRowHeights();
          }
        } else {
          this.currentRowHeight = Math.floor(gridHeight / renderedRows);
          this.gridApi1.resetRowHeights();
        }
      
        this.gridApi1.forEachNode(rowNode => {
          if (rowNode.data) {
            rowNode.setRowHeight(this.currentRowHeight);
          }
        });
        this.gridApi1.onRowHeightChanged();
        this.gridApi1.sizeColumnsToFit();
     },100)
    }



   
  }