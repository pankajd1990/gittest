import { Component,OnInit, AfterViewInit,AfterContentInit,AfterViewChecked,HostListener} from '@angular/core';
import { Title }     from '@angular/platform-browser';
import {GridOptions} from "ag-grid-community";


declare var $ :any;

@Component({
    selector: "picker-list",
    templateUrl: `./pickerlist.html`,
    styles:[`.div-table {
      display: table;
      width: 100%; 
      border-spacing: 5px;
    }
    .tr {
      display: table-row;
    }
    .tc {
      display:table-cell;
      vertical-align:top;
      padding:5px 10px;
    }
    .tc1 {
      width:240px;
    }
    .tc4, .tc5, .tc6 {
      width: 80px;
    }
    
      
      `]
 
  })
  export class PickerListComponent  {
   private sourceList1 = [{
    id:1,
    type:'sr1',
    added:false
   },{
     id:2,
     type:'sr1',
     added:false
   }];
   private sourceList2 = [
    {
      id:1,
      type:'sr2',
      added:false
     },{
       id:2,
       type:'sr2',
       added:false
     }
   ];
   private pickerList=[];


   pickList(obj){

    if(obj) {
      this.pickerList.push(obj);
      //update status of pick list
      if(obj.type=="sr1") {
        let ind= this.sourceList1.findIndex((a)=> {
          return a.id==obj.id
         });
         this.sourceList1[ind].added=true;
      }
      else if(obj.type=="sr2") {
        let ind= this.sourceList2.findIndex((a)=> {
          return a.id==obj.id
        });
        this.sourceList1[ind].added=true;
      }
    }
    console.log( this.sourceList1);

   }
   removePickList(obj){
   let ind= this.pickerList.findIndex((a)=> {
        return a.id==obj.id
    });
    if(obj.type=="sr1") {
      let ind= this.sourceList1.findIndex((a)=> {
        return a.id==obj.id
       });
       this.sourceList1[ind].added=false;
    }
    else if(obj.type=="sr2") {
      let ind= this.sourceList2.findIndex((a)=> {
        return a.id==obj.id
      });
      this.sourceList1[ind].added=false;
    }

    this.pickerList.splice(ind,1);
   }



  }