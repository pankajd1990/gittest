 setoutPutGridHeight() {
        this.sharedService.setFullHeightToMain = true;
        var gridRowmargin:number=0;
        setTimeout(() => {
            var reportHeader = $(`#${this.menuId} .report-header`).outerHeight(true);
            var reportFooter = $(`#${this.menuId} .report-footer`).outerHeight(true);
            var reportFilterexport = $(`#${this.menuId} .filter-export-btn`).outerHeight(true)+9;
            if(this.reportData.length < 3) {
                gridRowmargin= parseInt($(`#${this.menuId} .grid-row0`).css('marginTop'))*3;  
            }
            if(reportFooter !=0) {
                reportFooter = reportFooter + parseInt($(`#${this.menuId} .report-footer`).css('marginTop'));
            }
                 
            this.rptContentStyle = {
                width: '100%',
                'height': `calc(100% - ${reportHeader + reportFooter + reportFilterexport + 10 + gridRowmargin}px)`,
                marginTop:"10px"
            }

            if (this.reportOutputApi.length != 0) {
                let gridLength = this.reportData.length;
                let isGridAutoFit:boolean=false;
                if (gridLength == 1) {    
                    let headerHeight:any;
                    let agGridScrollHeight:any;  
                    this.reportOutputApi[0].setDomLayout("autoHeight");   
                    if(this.reportData[0].data !=null && this.reportData[0].data.length ==1) {
                        // headerHeight = $(`#${this.menuId} .report-output-grid0 .ag-header`).outerHeight(true);
                        // agGridScrollHeight = $(`#${this.menuId} .report-output-grid0 .ag-body-horizontal-scroll`).outerHeight(true);                        
                        // this.gridStyle[0] = {
                        //     'height': (headerHeight + agGridScrollHeight + 30)+'px',
                        //     'width': '100%'
                        // };
                        let gridHeight = $(`#${this.menuId} .report-output-grid0`).outerHeight(true);
                        console.log("gridHeight"+gridHeight);
                        this.gridStyle[0] = {
                            'height': gridHeight - 22+"px",
                            'width': '100%'
                        };
                        
                        this.reportOutputApi[0].setDomLayout("normal");
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
                        this.resetHeightGridFinal();
                     },0.05);

                    setTimeout(() => {
                        let gridHeight = $(`#${this.menuId} .report-output-grid0`).outerHeight(true);
                        console.log(gridautoHeight);                     
                        console.log(gridHeight);
                        if (gridautoHeight <= gridHeight) {
                            if(this.reportData[0].data !=null  && this.reportData[0].data.length ==1) {                             
                                 this.gridStyle[0] = {
                                     'height': gridHeight - 22+"px",
                                     'width': '100%'
                                 };
                                 this.reportOutputApi[0].setDomLayout("normal");
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
                             isGridAutoFit = true;   
                             this.rptContentStyle = {
                                width: '100%',
                                'height': `auto`,
                                marginTop:"10px"
                            }                                              
                        }
                        else {
                            this.reportOutputApi[0].setDomLayout("normal");
                            isGridAutoFit = false;
                        }
                    },0.09)
                 
                }
                else if (gridLength == 2) {
                    let gridTitleHeight: any = [];
                    let gridPaginmation: any = [];
                    let gridautoHeight: any = [];
                    let gridHeight: any = [];
                    let gridAutoRowHeight: any = [];
                    let isGridAutoFit: any = [];
                    // let gridHeaderHeight:any=[];
                    // let gridScrollHeight:any=[];
                    this.reportOutputApi[0].setDomLayout("autoHeight");
                    this.reportOutputApi[1].setDomLayout("autoHeight");

                     setTimeout(()=>{
                        for (let c = 0; c < gridLength; c++) {
                            //gridScrollHeight[c] = $(`#${this.menuId} .report-output-grid${c} .ag-body-horizontal-scroll`).outerHeight(true);
                           // gridHeaderHeight[c] = $(`#${this.menuId} .report-output-grid${c} .ag-header`).outerHeight(true);
                          
                           let tmpgridHeight = $(`#${this.menuId} .report-output-grid${c}`).outerHeight(true);
                            if(this.reportData[c].data !=null  && this.reportData[c].data.length ==1) {                                                       
                                // this.gridStyle[c] = {
                                //     'height': (gridScrollHeight[c] + gridHeaderHeight[c] + 30)+'px',
                                //     'width': '100%'
                                // };

                                this.gridStyle[c] = {
                                    'height': tmpgridHeight - 22+"px",
                                    'width': '100%'
                                };
                                this.reportOutputApi[c].setDomLayout("normal");                            
                            }      
                            else {
                                this.reportOutputApi[c].setDomLayout("autoHeight");
                            }
                          
                        }
                     },0.05)
                  
                  
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

                        //console.log(gridautoHeight);

                    })

                   // return;
                    setTimeout(() => {
                       this.resetHeightGridFinal();
                     },0.09);

                    setTimeout(() => {
                        for (let c = 0; c < gridLength; c++) {
                            gridHeight[c] = $(`#${this.menuId} .report-output-grid${c}`).outerHeight(true);
                            if (gridautoHeight[c] <= gridHeight[c]) {
                                isGridAutoFit[c] = true;
                            }
                            else {
                                isGridAutoFit[c] = false;
                            }
                        }
                        console.log("grid auto height");
                        console.log(isGridAutoFit);
                        //return;
                        setTimeout(() => {
                            // this.gridApi[0].setDomLayout("autoHeight");
                            //this.gridApi[1].setDomLayout("autoHeight");
                            if (isGridAutoFit.filter(x => x === true).length != 2 && isGridAutoFit.filter(x => x === false).length != 2) {
                                if (isGridAutoFit[1] == true) {
                                    if(this.reportData[1].data !=null  && this.reportData[1].data.length ==1) {                                                       
                                        // this.gridStyle[1] = {
                                        //     'height': (gridScrollHeight[1] + gridHeaderHeight[1] + 30)+'px',
                                        //     'width': '100%'
                                        // };
                                        // this.reportOutputApi[1].setDomLayout("normal");
                                        // let  tmpgridHeight= $(`#${this.menuId} .report-output-grid1`).outerHeight(true);
                                        this.gridStyle[1] = {
                                            'height': gridautoHeight[1]+"px",
                                            'width': '100%'
                                        };
                                        this.reportOutputApi[1].setDomLayout("normal");     


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
                                        // this.gridStyle[0] = {
                                        //     'height': (gridScrollHeight[0] + gridHeaderHeight[0] + 30)+'px',
                                        //     'width': '100%'
                                        // };
                                        // this.reportOutputApi[0].setDomLayout("normal");
                                        let  tmpgridHeight= $(`#${this.menuId} .report-output-grid0`).outerHeight(true);
                                        this.gridStyle[0] = {
                                            'height': gridautoHeight[0]+"px",
                                            'width': '100%'
                                        };
                                        this.reportOutputApi[0].setDomLayout("normal");     
                                    }      
                                    else {
                                        this.reportOutputApi[0].setDomLayout("autoHeight");
                                    }
                                    let finalGrigHeight = gridTitleHeight[1] + gridPaginmation[1];
                                    this.reportOutputApi[1].setDomLayout("normal");
                                    this.gridRowStyle[1] = {
                                        height: `calc(100% - ${gridAutoRowHeight[0]}px)`
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
                                this.rptContentStyle = {
                                    width: '100%',
                                    'height': `auto`,
                                    marginTop:"10px"
                                }
                                for(let c=0;c<gridLength;c++) {
                                  
                                    if(this.reportData[c].data !=null  && this.reportData[c].data.length ==1) {                                                       
                                        // this.gridStyle[c] = {
                                        //     'height': (gridScrollHeight[c] + gridHeaderHeight[c] + 30)+'px',
                                        //     'width': '100%'
                                        // };
                                        // this.reportOutputApi[0].setDomLayout("normal");

                                        let  tmpgridHeight= $(`#${this.menuId} .report-output-grid${c}`).outerHeight(true);
                                        this.gridStyle[c] = {
                                            'height': gridautoHeight[c]+"px",
                                            'width': '100%'
                                        };
                                        this.reportOutputApi[c].setDomLayout("normal");     

                                    }      
                                    else {
                                        this.reportOutputApi[c].setDomLayout("autoHeight");
                                    }
                                        this.gridRowStyle[c] = {
                                            height:"auto"
                                        }
                                        // this.gridStyle[c] = {
                                        //     'height': "auto",
                                        //     'width': '100%'
                                        // };
                                }                                                                                                                            

                            }
                        }, 0.05)


                    },0.02)
                                     
                }
                else if (gridLength == 3) {
                    let gridTitleHeight: any = [];
                    let gridPaginmation: any = [];
                    let gridautoHeight: any = [];
                    let gridHeight: any = [];
                    let gridAutoRowHeight: any = [];
                    let isGridAutoFit: any = [];
                   // let gridHeaderHeight:any=[];
                    //let gridScrollHeight:any=[];
                
                    this.reportOutputApi[0].setDomLayout("autoHeight");
                    this.reportOutputApi[1].setDomLayout("autoHeight");
                    this.reportOutputApi[2].setDomLayout("autoHeight");
                    for (let c = 0; c < gridLength; c++) {
                        // gridScrollHeight[c] = $(`#${this.menuId} .report-output-grid${c} .ag-body-horizontal-scroll`).outerHeight(true);
                        // gridHeaderHeight[c] = $(`#${this.menuId} .report-output-grid${c} .ag-header`).outerHeight(true);
                        if(this.reportData[c].data !=null  && this.reportData[c].data.length ==1) {                                                       
                            // this.gridStyle[c] = {
                            //     'height': (gridScrollHeight[c] + gridHeaderHeight[c] + 30)+'px',
                            //     'width': '100%'
                            // };
                            let tmpgridHeight = $(`#${this.menuId} .report-output-grid${c}`).outerHeight(true);
                            this.gridStyle[c] = {
                                'height': tmpgridHeight - 22+"px",
                                'width': '100%'
                            };
                            this.reportOutputApi[c].setDomLayout("normal");  
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

                       
                        
                    },0.08);  
                    
                    //return;
                    
                      /*  added this on 270120  */
                      setTimeout(() => {
                        this.resetHeightGridFinal();
                     },0.09);
                      /* end  */
                 


                  
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
                                        // this.gridStyle[0] = {
                                        //     'height': (gridScrollHeight[0] + gridHeaderHeight[0] + 30)+'px',
                                        //     'width': '100%'
                                        // };
                                             this.gridStyle[0] = {
                                                'height': gridautoHeight[0]+"px",
                                                'width': '100%'
                                            };
                                            this.reportOutputApi[0].setDomLayout("normal"); 
                                    }      
                                    else {
                                        this.reportOutputApi[0].setDomLayout("autoHeight");
                                    }

                                   if(this.reportData[1].data.length ==1) {                                                       
                                        this.gridStyle[1] = {
                                            'height': gridautoHeight[1]+"px",
                                            'width': '100%'
                                        };
                                       this.reportOutputApi[1].setDomLayout("normal"); 
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
                                        // this.gridStyle[0] = {
                                        //     'height': (gridScrollHeight[0] + gridHeaderHeight[0] + 30)+'px',
                                        //     'width': '100%'
                                        // };
                                        this.gridStyle[0] = {
                                            'height': gridautoHeight[0]+"px",
                                            'width': '100%'
                                        };
                                        this.reportOutputApi[0].setDomLayout("normal"); 
                                    }      
                                    else {
                                        this.reportOutputApi[0].setDomLayout("autoHeight");
                                    }
                                    if(this.reportData[2].data !=null  && this.reportData[2].data.length ==1) {                                                       
                                        this.gridStyle[2] = {
                                            'height': gridautoHeight[2]+"px",
                                            'width': '100%'
                                        };
                                        this.reportOutputApi[2].setDomLayout("normal"); 
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
                                            'height': gridautoHeight[1]+"px",
                                            'width': '100%'
                                        };
                                        this.reportOutputApi[1].setDomLayout("normal"); 
                                    }      
                                    else {
                                        this.reportOutputApi[1].setDomLayout("autoHeight");
                                    }
                                    if(this.reportData[2].data !=null  && this.reportData[2].data.length ==1) {                                                       
                                        this.gridStyle[2] = {
                                            'height': gridautoHeight[2]+"px",
                                            'width': '100%'
                                        };
                                        this.reportOutputApi[2].setDomLayout("normal"); 
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
                                            'height': gridautoHeight[0]+"px",
                                            'width': '100%'
                                        };
                                        this.reportOutputApi[0].setDomLayout("normal"); 
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
                                            'height': gridautoHeight[1]+"px",
                                            'width': '100%'
                                        };
                                        this.reportOutputApi[1].setDomLayout("normal");
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
                                            'height': gridautoHeight[2]+"px",
                                            'width': '100%'
                                        };
                                        this.reportOutputApi[2].setDomLayout("normal"); 
                                    }      
                                    else {
                                        this.reportOutputApi[2].setDomLayout("autoHeight");
                                    }
                                    this.gridRowStyle[2] = {
                                        height: `auto`
                                    }
                                    let totalAutoRowHeight = gridAutoRowHeight[2];
                                    this.gridRowStyle[0] = {
                                        height: `calc(50% - ${totalAutoRowHeight/2}px)`                                        
                                    };
                                    let finalGrigHeight0 = gridTitleHeight[0] + gridPaginmation[0];
                                    this.gridStyle[0] = {
                                        'height': `calc(100% - ${finalGrigHeight0}px)`,
                                        'width': '100%'
                                    };
                                    this.gridRowStyle[1] = {
                                        height: `calc(50% - ${totalAutoRowHeight/2}px)`                                        
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
                                    this.rptContentStyle = {
                                        width: '100%',
                                        'height': `auto`,
                                        marginTop:"10px"
                                    }
                                    for(let c=0;c < gridLength;c++) {
                                        if(this.reportData[c].data !=null  && this.reportData[c].data.length ==1) {                                                       
                                            this.gridStyle[c] = {
                                                'height': gridautoHeight[c]+"px",
                                                'width': '100%'
                                            };
                                            this.reportOutputApi[c].setDomLayout("normal");
                                        }      
                                        else {
                                            this.reportOutputApi[c].setDomLayout("autoHeight");
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
                            
                        });                                            
                    });

                }
                else {
                    let headerHeight:any=[];
                    let agGridScrollHeight:any=[];
                    for(let c=0;c<gridLength;c++) {

                        if(this.reportData[c].data !=null  && this.reportData[c].data.length ==1) {
                            headerHeight = $(`#${this.menuId} .report-output-grid${c} .ag-header`).outerHeight(true);
                            agGridScrollHeight = $(`#${this.menuId} .report-output-grid${c} .ag-body-horizontal-scroll`).outerHeight(true);                        
                            this.gridStyle[c] = {
                                'height': (headerHeight + agGridScrollHeight + 30)+'px',
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

           

            setTimeout(()=>{
               // this.resetHeightGridFinal();
            },1000)
            

        }, 0.05)
    }





 resetHeightGridFinal() {           
        for (let c = 0; c < this.reportData.length; c++) {
            if(this.reportData[c].data !=null && this.reportData[c].data.length > 0) {
                let  gridHeight       =  $(`#${this.menuId} .report-output-grid${c}`).outerHeight(true);
                let gridHeightIncRow    =  $(`#${this.menuId} .report-output-grid${c} .ag-header`).outerHeight(true)+this.reportData[c].data.length * 28+2;               
                //  console.log(gridHeight);
                //  console.log(gridHeightIncRow);
                if(gridHeightIncRow < gridHeight) {
                this.reportOutputApi[c].setDomLayout("autoHeight");
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
     










