import { Component, QueryList, ViewChildren, ViewContainerRef,HostListener } from "@angular/core";
import { ICellEditorAngularComp } from "ag-grid-angular";

@Component({
    selector: "input-cell",
    template: `
    <div class='events'>;
        <span myTooltip  content="" (stockValueChange)='changeStockValue($event)' event="click" >Pankaj1</span>;
        <span myTooltip (stockValueChange)='changeStockValue($event)'  name="PANKAJ"  event="click" [content]="content">Pankaj</span>;
        <span myTooltip (stockValueChange)='changeStockValue($event)'  name="SHAILESH"  event="click" [content]="content">Shailesh</span>;
        <span myTooltip (stockValueChange)='changeStockValue($event)'  name="PRABHAKAR"   event="click" [content]="content">Prabhakar</span>;
        <span myTooltip (stockValueChange)='changeStockValue($event)'  name="DURGESH"   event="click"  [content]="content">durgesh</span>;
        <span myTooltip (stockValueChange)='changeStockValue($event)'  name="vaibhav"   event="click" [content]="content">vaibhav</span>;
        <span myTooltip (stockValueChange)='changeStockValue($event)'  name="PRAVIN"  event="click"  [content]="content">pravin</span>;
        <span myTooltip (stockValueChange)='changeStockValue($event)'  name="PRASAD"   event="click"  [content]="content">prasad</span>;
        <span myTooltip (stockValueChange)='changeStockValue($event)'   name="PRAFUL"  event="click" [content]="content">praful</span>;
        <span  myTooltip (stockValueChange)='changeStockValue($event)' name="YATISH"  event="click" [content]="content"s>yatish</span>;
    </div>";
    `,
    styles: [
        `
            .container {
                width: 350px;
            }
        `
    ]
})
export class TooltipInputComponent  {
    private params: any;
    public content:string;
    
    agInit(params: any): void {
        this.params = params;
        let str ='';
        str = "<h1>";
        str +="pankaj</h1>"
        this.content= str;
    }

    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
       
       
    }
    changeStockValue(name) {
        if (document.querySelector('.tooltip1')) {
            let str ='';
            console.log(name);
            str = "<h1>";
            str +=`${name} welcome good work</h1>`;
          
            document.getElementById("tooltip-content").innerHTML= str;
           
        }
      
    }
   

   
    
    

    
}