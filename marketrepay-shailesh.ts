import { Component,OnInit,AfterViewChecked} from '@angular/core';
import { Title }     from '@angular/platform-browser';
import {GridOptions} from "ag-grid-community";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { HEADER_OFFSET } from '@angular/core/src/render3/interfaces/view';
import {CONSTANT} from '../app.constant';
import {AppService} from '../app.service';

declare var $ :any;

@Component({
    selector: "market-repay",
    templateUrl:`./market-repay-shailesh.html`
  })
  export class MarketRepayShaileshComponent implements OnInit, AfterViewChecked {
    public activityArr: any[] = [];
    public forwardBackWardFlag: boolean = false;
    public activityPushArr: any[] = [];
    public playPauseButton: Boolean = false;
    public prevForwardFlag: number = 1;
    public playPauseCounter: any = 0;
    public is_loaded_response: boolean;
    public gridOptionsEmpLog: GridOptions;
    public gridApiempLog;
    public forwardManualFlag: boolean = true;
    public gotoStartSeqNmbr: number = 0;
    public scrolldir:string;
     public gridscrollevent:boolean;
    public isRefresh:Boolean=false;
    public enBlPlayButton:boolean=true;
    public upallowd:boolean=false;
    public downallowd:boolean=false;
  constructor(private http: HttpClient,private appservice:AppService){

  }

ngAfterViewChecked(){




}

ngOnInit(){

  this.navigateToNextCell = this.navigateToNextCell.bind(this);
  this.gridOptionsEmpLog = {
    rowData: [],
    columnDefs: CONSTANT.ColumnDefs.EmployeeLog,
    rowSelection: 'single',
    suppressRowHoverHighlight: true,
    suppressScrollOnNewData: true  
  };
  let jsonpbj=this.getJsonForStart();
this.apicall(jsonpbj);

}

apicall(jsonObject){

    this.is_loaded_response=false;
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
  "http://localhost/ang1/blog/public/getHugeData",jsonObject, options
)
.subscribe(data => {
    this.is_loaded_response=true;
   this.subscribeActivity(data);
});
}



subscribeActivity(data) {
  var resData = data.resultData;

  if (resData && resData.Activity && resData.Activity.length > 0) {
    //that.activityArr = [];
    this.activityArr = resData.Activity;
    console.log(  this.activityArr);
    this.activityArr.sort(this.sortArray("id"));
    var p = 0;
    this.run(p, this.activityArr);
    this.upallowd=true;
    this.downallowd=true;
}
if (resData && resData.Activity && resData.Activity.length == 0) {
    //this.appservice.start();

    this.pauseButtonClickEvent();
   
    if(this.forwardBackWardFlag){
      this.upallowd=false;
      this.downallowd=true;
      this.enBlPlayButton=true;
    } 
    else{
       this.downallowd=false;
       this.enBlPlayButton=false;
       this.upallowd=true;
    }               

   




}



}
run(p, activityArr) {
    
  var option = {};
  if (!this.forwardBackWardFlag) {
      //PLAY FORWARD CODE
      if (p != undefined) {
          if(activityArr.length > 0 ){
          var rowData = activityArr[p];
          if ( p++ <= activityArr.length - 1) {
              setTimeout(() => {
                  var duplicate =  false;
                  for (let row of this.activityPushArr) {
                      if (row.id == rowData.id) {
                          duplicate = true;
                      }
                  }

    
                      var node;
                 
                    

                                                                                                     
                      if (!duplicate) {
                          this.activityPushArr.push(rowData);                         
                      }
                      if (this.activityPushArr.length > CONSTANT.GRID_SIZE) {
                          this.activityPushArr.shift()
                          /*todo : send single row to setHighlighterOnData
                             check painting of single rows in grid 
                          */
                        
                          this.gridOptionsEmpLog.api.setRowData(this.activityPushArr);
                         // this.gridApiempLog.gridCore.rowRenderer.gridCore.gridOptionsWrapper.layoutElements[2].scrollTop= 200;//this.gridApiempLog.gridCore.rowRenderer.gridCore.gridOptionsWrapper.layoutElements[2].scrollHeight;
                         // this.gridApiempLog.rowRenderer.gridCore.gridOptionsWrapper.layoutElements[2].scrollTop = Number(this.gridApiempLog.gridCore.rowRenderer.gridCore.gridOptionsWrapper.layoutElements[2].scrollHeight);

                      } else {
                        
                          this.gridOptionsEmpLog.api.setRowData(this.activityPushArr);
                      }
                      //this.appservice.idle.interrupt();
                     $("#myGrid").scrollTop= 200;//this.gridApiempLog.gridCore.rowRenderer.gridCore.gridOptionsWrapper.layoutElements[2].scrollHeight;
                      //this.gridApiempLog.rowRenderer.gridCore.gridOptionsWrapper.layoutElements[2].scrollTop = Number(this.gridApiempLog.gridCore.rowRenderer.gridCore.gridOptionsWrapper.layoutElements[2].scrollHeight);
                     var node = this.gridApiempLog.getRowNode(this.gridApiempLog.getLastDisplayedRow());
                      node.setSelected(true);
                      this.playPauseCounter = p;
                      if (!this.playPauseButton) {
                          this.run(p, activityArr)
                      }
                  //}
              },50);
          } else {
              var jsonObject = {};
              if (activityArr.length > 0 && this.is_loaded_response) {
                  this.prevForwardFlag = 1;
                  jsonObject = this.getJsonForStart();
                  this.apicall(jsonObject);
              }
          }
      } 
      }
  } else {
      //PLAY PREVIOUS CODE
      //todo1 : desable PREVIOUS  and next button on reacing cache endpoints
      //todo2 : formatting should be in method            
      if (p == 0) {
        activityArr = activityArr.concat(this.activityPushArr);
        this.activityArr = activityArr;
        p = activityArr.length - 1;
        this.playPauseCounter = p;
      }
      if (p >= CONSTANT.GRID_SIZE) {
          setTimeout(() => {
              var rowData = activityArr[p - (CONSTANT.GRID_SIZE)];

              if (rowData != undefined) {
                 // rowData.mrFillPrice = Number(rowData.mrFillPrice).toFixed(2);                  
                  p--;
                  this.playPauseCounter = p;

                  var duplicate;
                  var node;
                  for (let row of this.activityPushArr) {
                      if (row.id == rowData.id) {
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
                      this.gridOptionsEmpLog.api.setRowData(this.activityPushArr);
                  } else {
                      this.gridOptionsEmpLog.api.setRowData(this.activityPushArr);
                  }
                  if (this.scrolldir == "B") {
                      this.gridApiempLog.rowRenderer.gridCore.gridOptionsWrapper.layoutElements[2].scrollTop = 0;
                      node = this.gridOptionsEmpLog.api.getRowNode(this.gridApiempLog.getFirstDisplayedRow());
                      node.setSelected(true);                    
                  }
                  else if (this.scrolldir == "F" || this.scrolldir == "") {
                     this.gridApiempLog.rowRenderer.gridCore.gridOptionsWrapper.layoutElements[2].scrollTop = Number(this.gridApiempLog.gridCore.rowRenderer.gridCore.gridOptionsWrapper.layoutElements[2].scrollHeight);
                  }
              }
          }, 0.5);
      } else {
          var jsonObject = {};
          //Debi: should be in 1 method
          if (this.activityArr.length > 0 && this.is_loaded_response) {
              this.prevForwardFlag = -1;
             jsonObject = this.getJsonForStart();
              this.apicall(jsonObject);
          }
      }
  }
}
onGridReadyEmp(params){
  this.gridApiempLog = params.api;
  this.gridscrollevent = true;
 
  this.gridApiempLog.rowRenderer.gridCore.gridOptionsWrapper.layoutElements[2].onmousewheel = (e) => {
    //scroll restricted while playing market repay
    if(!this.playPauseButton){        
      e.preventDefault();
      return false;
    }
    
    this.gridscrollevent = false;        
    if (!this.gridscrollevent) {           
      if (e.deltaY === 100) {
        var scrtop = this.gridApiempLog.rowRenderer.gridCore.gridOptionsWrapper.layoutElements[2].scrollTop;
        var scrheight = this.gridApiempLog.rowRenderer.gridCore.gridOptionsWrapper.layoutElements[2].scrollHeight;
        var innerhei = $(".ag-body-viewport.ag-layout-normal").innerHeight();
       console.log(scrtop +"+"+ innerhei +">="+ scrheight)
       // if (scrtop + innerhei >= scrheight) {
        this.upallowd=true;                        
          //this.forwardButtonClickEvent();     
           if(!this.downallowd){
            return false;
           }
         
            this.forwardBackWardFlag = false;  
            this.forwardManualFlag = false;
            this.scrolldir = 'F';
            this.run(this.playPauseCounter, this.activityArr);
         
          
       // }
      }
      else {
       
        if (this.gridApiempLog.rowRenderer.gridCore.gridOptionsWrapper.layoutElements[2].scrollTop === 0) {
           //this.backwardButtonClickEvent();
           let rows =  this.gridOptionsEmpLog.api.getRowNode(this.gridApiempLog.getFirstDisplayedRow().toString()).data;  
           this.downallowd=true;     
           if(!this.upallowd){
            return false;
           }
            this.forwardBackWardFlag = true;                          
            this.scrolldir = 'B';
            this.run(this.playPauseCounter, this.activityArr);
                            
           
        }
      }
    }

  }




}

playMarketReplayScocket() {
  this.playPauseButton = false;
  this.forwardBackWardFlag = false;
  this.forwardManualFlag = true; 
  this.appservice.stop();
  if (this.gotoStartSeqNmbr === -1) {
    this.pauseButtonClickEvent();
   // this.genericComponent.showErrorMessage(MessageConstant.MarketReplay.invalidGoto);
  }else if (this.gotoStartSeqNmbr === 0) {
    if(this.activityArr.length > 0){
      this.run(this.playPauseCounter, this.activityArr);
    }else{
      var jsonObject = {};
      this.prevForwardFlag = 1;
     jsonObject = this.getJsonForStart();
      this.apicall(jsonObject);
    }
  } else {
    var jsonObject = {};
    this.prevForwardFlag = 1;
  jsonObject = this.getJsonForStart();
    this.apicall(jsonObject);
  }
}
pauseButtonClickEvent() {
  this.playPauseButton = true; 
  this.appservice.start();
  //console.log(this.appservice.idle.getInterrupts());

}

backwardButtonClickEvent() {
  //todo: make generic method and passs directions for ups/down 
  if (this.playPauseButton) {
     var currow = this.gridApiempLog.getSelectedNodes();  
     this.downallowd=true;      
     if(currow && currow[0] && currow[0].rowIndex==0){
        let rows = this.gridApiempLog.getSelectedRows();             
           if(this.upallowd){
            this.gridApiempLog.ensureIndexVisible(0);
            this.forwardBackWardFlag=false;
            this.scrolldir = 'B';
            this.run(this.playPauseCounter, this.activityArr);
           }
                
            
                
    }
    else{
         let node1=this.gridApiempLog.getRowNode(currow[0].rowIndex-1);  
         this.gridApiempLog.ensureIndexVisible(currow[0].rowIndex-1);       
         node1.setSelected(true);
       
    }
  
  }
}

forwardButtonClickEvent() {
  if (this.playPauseButton) {
     var currow = this.gridApiempLog.getSelectedNodes();           
     var last_display_row  =  this.gridApiempLog.getLastDisplayedRow();  
     this.enBlPlayButton=true;  
     this.upallowd=true;
     if(currow && currow[0] && currow[0].rowIndex < last_display_row ){
         let node1=this.gridApiempLog.getRowNode(currow[0].rowIndex+1);  
         this.gridApiempLog.ensureIndexVisible(currow[0].rowIndex+1);       
         node1.setSelected(true);
       
    }
    else{
        let rows = this.gridApiempLog.getSelectedRows();  
        if(this.downallowd){
          this.forwardBackWardFlag=true;
          this.forwardManualFlag = false;
          this.scrolldir = 'F';
          this.run(this.playPauseCounter, this.activityArr);
        }
           
        
    }    
  }
}

getJsonForStart() {
    var lastSeqNum=0;
    if(!this.forwardBackWardFlag){
       lastSeqNum = this.activityArr.length != 0 ? this.activityArr[this.activityArr.length - 1].id : 0;
      }else{
       lastSeqNum = this.activityArr.length != 0 ? this.activityArr[0].id : 0;
      }



   let jsonObject = {
    
      lastSeqNmbr: lastSeqNum,
      firstid: '',
      prevForwardFlag: this.prevForwardFlag,
      gotoStartSeqNmbr: this.gotoStartSeqNmbr > 0 ? this.gotoStartSeqNmbr : 0,
     
  }
    return jsonObject;
  }

  public sortArray(prop) {
    return function (a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    }
}

refreshButtonClickEvent(gotoClick) {
    if(!this.playPauseButton){   
      alert("Please Stop first then click on Refresh");    
      return false;
    }

  //  this.webSocketService.timeArr = [];    
    this.activityArr = [];

    this.activityPushArr = [];

    this.playPauseCounter = 0;
    this.forwardBackWardFlag = false;
    this.forwardManualFlag = true;

    this.gridOptionsEmpLog.api.setRowData([]);     
    this.gotoStartSeqNmbr = 0;
    this.playPauseButton = true;
    this.upallowd=false;
    this.downallowd=true;
    this.enBlPlayButton=true;
   
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
        this.downallowd=true;
        if (params.nextCellDef) {
          selnode = this.gridOptionsEmpLog.api.getRowNode(params.nextCellDef.rowIndex);
          selnode.setSelected(true);
        
        }
        if (nextRowIndex < 0) {
          if (this.playPauseButton) {                                                       
            if(this.upallowd){
              this.backwardButtonClickEvent();
             }    
            
           
                                                
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
        this.upallowd=true;
        if (params.nextCellDef) {
          selnode = this.gridOptionsEmpLog.api.getRowNode(params.nextCellDef.rowIndex);
          selnode.setSelected(true);
       
        }
        var renderedRowCount = this.gridOptionsEmpLog.api.getModel().getRowCount();
        if (nextRowIndex >= renderedRowCount) {
          let rows = this.gridOptionsEmpLog.api.getSelectedRows();             
          if(this.downallowd){
            this.forwardButtonClickEvent();
           } 
            
                                      
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
  rowselect(){
    


    
 




  }






}
