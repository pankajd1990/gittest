resetHeightGridFinal() {

 if (this.rowData.length ==3)  {

    for (let c = 0; c < 3; c++) {
        let  gridHeight       =  $(`#${this.menuId} .report-output-grid${c}`).outerHeight(true);
         let gridHeightIncRow    =  $(`#${this.menuId} .report-output-grid${c} .ag-header`).outerHeight(true)+this.rowData[c].length * 28+2;
         console.log(gridHeight);
         console.log(gridHeightIncRow);
         if(gridHeightIncRow < gridHeight) {
            this.gridApi[c].setDomLayout("autoHeight");
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




}
