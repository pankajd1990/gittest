import { Component, QueryList, ViewChildren, ViewContainerRef,HostListener } from "@angular/core";
import { ICellEditorAngularComp } from "ag-grid-angular";

@Component({
    selector: "input-cell",
    template: `
    <div class='events'>;
        <span myTooltip>Pankaj1</span>;
        <span myTooltip>Pankaj2</span>;
        <span myTooltip>Pankaj3</span>;
        <span myTooltip>Pankaj4</span>;
        <span myTooltip>Pankaj5</span>;
        <span myTooltip>Pankaj6</span>;
        <span myTooltip>Pankaj7</span>;
        <span myTooltip>Pankaj8</span>;
        <span myTooltip>Pankaj9</span>;
        <span  myTooltip>Pankaj10</span>;
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
  
    
    agInit(params: any): void {
        this.params = params;
    }

    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
       
    }

   

   
    
    

    
}