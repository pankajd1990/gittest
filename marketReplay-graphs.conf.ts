export class marketReplayGraphConfig
{
    public DT=[];
public  marketReplay = {
    
    tooltip : {
        trigger: 'axis',      
    },
    legend: {
        data:['P','V','I'],
        inactiveColor  : 'grey',
        textStyle : {
            color : 'white'
        }
    },
    grid : {
        containLabel: true,
        left:"4%",
        right:"10%"
    },
    toolbox: {
        left: 'center',
        show:false,
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {
                show:true,
            },
            saveAsImage: {
                show:true,
            }
        }
    },
    dataZoom: [{
        startValue: '',
        textStyle:{
            color :'white'
        }
    }, {
        type: 'inside'
        
    }],
    calculable : true,
    xAxis : [
        {
           
            boundaryGap : true,
            axisLabel: {
                color:'white'
            },
            axisLine: {
                lineStyle: {
                    color: 'white'
                }
            },
            data: this.getXaxis(),            
        }
    ],
    yAxis : [
        {
            type : 'value',
            name : 'P',
            min:0,
            max:0,            
            //interval: 1,
            axisLabel : {
                formatter: '{value}',
                show:true
            },
            axisLine: {
                lineStyle: {
                    color: 'white'
                }
            },
            axisTick:{
                show:true
            },
            splitLine: {
                show: false
            }
        },
        {
            type : 'value',
            name : 'V',
            min:0,
            max:0,           
             show:true,
          //  interval: 100,
            axisLabel : {
                formatter: '{value}',
                show:true
            },
            splitLine: {
                show: false
            },
            axisTick:{
                show:true
            },
            axisLine: {
                lineStyle: {
                    color: 'white'
                }
            },
        },
        {
            type : 'value',
            name : 'I',
            min:0,
            max:0,           
            // interval: 50,    
            offset : 50,
            axisLabel : {
                formatter: '{value}',
                show:true
            },
            axisTick:{
                show:true
            },
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: 'white'
                }
            },
        },
    ],
    series : [
        {
            name:'P',
            type:'line',
            largeThreshold:1000,
            data: this.getXaxis(),
            color :  'Red',
            smooth:1,
            markPoint : {               
                data : [                    
                ]
            },
        },
        {
            name:'V',
            type:'bar',
            data:this.getXaxis(),
            largeThreshold:1000,
            yAxisIndex: 1,
            color : 'Green',
            barMaxWidth:20,
          
            markPoint : {
                symbolSize :10,
                data : [
                   
                ]
            },
        },
        {
            name:'I',
            type:'line',
            data:this.getXaxis(),
            largeThreshold:1000,
            yAxisIndex: 2,
            smooth:1,
            color :  'Blue',           
            markPoint : {               
                data : [
                  
                ]
            },
        }
    ]
};

getXaxis(){
    var data = [];
    return data;
}


public  marketReplay2 = {
    
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['P','B','S'],
    },
    grid : {
        containLabel: true,
    },
    toolbox: {
        left: 'center',
        show:false,
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {
                show:true,
            },
            saveAsImage: {
                show:true,
            }
        }
    },
    dataZoom: [{
        startValue: '09:16:35'
    }, {
        type: 'inside'
    }],
    calculable : true,
    xAxis : [
        {
           
            boundaryGap : false,
            axisLabel: {
                color:'white'
            },
            axisLine: {
                lineStyle: {
                    color: 'white'
                }
            },
            data: [],
        }
    ],
    yAxis : [
        {
            type : 'value',
            name : 'P',
            min: 2075,
            max: 2110,
            //interval:1 ,
            axisLabel : {
                formatter: '{value}'
            },
            axisLine: {
                lineStyle: {
                    color: 'white'
                }
            },
            splitLine: {
                show: false
            }
        },
        {
            type : 'value',
            name : 'B',
            min: 27921,
            max: 203533,
            interval: 50000,
            axisLabel : {
                formatter: '{value}'
            },
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: 'white'
                }
            },
        },
        {
            type : 'value',
            name : 'S',
            min: 41501,
            max: 269457,
            interval: 50000,    
            offset : 60,
            axisLabel : {
                formatter: '{value}'
            },
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: 'white'
                }
            },
        },
    ],
    series : [
        {
            name:'P',
            type:'line',
            data: [],
             markPoint : {
                data : [
                   
                ]
            },
        },
        {
            name:'B',
            type:'line',
            data:[],
            yAxisIndex: 1,
            markPoint : {
                data : [
                   
                ]
            },
        },
        {
            name:'S',
            type:'line',
            data:[],
            yAxisIndex: 2,
            markPoint : {
                data : [                   
                ]
            },
        }
    ]
};

public priceGraph={
    type: "stock",
    theme: "none",   
    categoryAxis:{  
        showFirstLabel:true,
        showLastLabel:true,        
        gridPosition: "start",
        gridAlpha: 1,     
    tickPosition: "start",   
    tickLength: 20,
    autoGridCount :true,
    centerLabels:true,
    fontSize:15,
    glueToTheEnd:true,
    zoomOutOnDataSetChange:true,
    dateFormats:[{"period":"fff","format":"JJ:NN:SS.QQQ"},{"period":"ss","format":"JJ:NN:SS"},{"period":"mm","format":"JJ:NN"},{"period":"hh","format":"JJ:NN"}],           
    },
    valueAxesSettings :{
        gridThickness:1,    
        axisColor:"#FFFFFF",
        showLastLabel:true,
        axisThickness:1,
        inside:false,
        axisAlpha:1,
        unitPosition:"left",
        tickLength:1,        
        labelRotation:-90, 
    },
    categoryAxesSettings: {
      minPeriod:"fff",
      groupToPeriods:["fff"],
      color:"#FFFFFF",
      axisColor:"#FFFFFF",    
      axisAlpha:1,    
      dateFormats:[{"period":"fff","format":"JJ:NN:SS.QQQ"},{"period":"ss","format":"JJ:NN:SS"},{"period":"mm","format":"JJ:NN"},{"period":"hh","format":"JJ:NN"}],           
      equalSpacing:true,
      gridPosition: "start",
      gridAlpha: 1,
      tickPosition: "start",
      tickLength: 5,
      inside:false,
      fontSize:15,
     
    } ,
    dataSets: [ {
      color: "white",
      fieldMappings: [ {
        fromField: "MRFILLPRICE",
        toField: "MRFILLPRICE"
      }     
    ],
     dataProvider:[],
      categoryField: "MRJIFFYTMST",      
       stockEvents: []
    } ],
  
  
    panels: [ {
       
      title: "Price",
      marginTop:100,
      autoMargins:false,
      percentHeight:60,
      showCategoryAxis: true,
      valueAxes: [{
        position: "left",        
        id:"p1",              
        inside:false,     
        color: "#FFFFFF", 
        axisColor:"green", 
        axisAlpha:1,
        title:"Price",
        axisThickness:5,   
        minMarginTop:20,
        marginTop:20,             
        labelOffset:3,
        labelRotation:-90, 
        maximum:0,
        minimum:0,
        fontSize:15,
        "useDataSetColors": false,      
      },     
    ],
      stockGraphs: [ {
        id: "g1",
        valueField: "MRFILLPRICE",
        showAllValueLabels:true,
        valueAxis:"p1",
        type: "smoothedLine",
        lineThickness: 1,
        bullet: "round",   
        bulletAlpha:0,
        // forceGap:true,
        bulletSize:0,
        balloonColor:"white",
        lineColor: "red",
        showBalloon:true,
        
        balloonText:"Time:<b>[[tm]]</b><br> Price:-<b>[[MRFILLPRICE]]</b>",
        
        gapPeriod:5,
        "useDataSetColors": false,       
      } ],
      stockLegend: {
        valueTextRegular: " ",
        markerType: "square"
    }
    } ],
    stockLegend: {

    },
    chartScrollbarSettings: {
      graph: "g1",     
      offset:10,
      enable:false,
      autoGridCount:true,
      position:"top"
    },
    chartScrollbar:{
        offset:200,
        updateOnReleaseOnly: true,
        autoGridCount:true
    },
    chartCursorSettings: {
      valueBalloonsEnabled: true,
      graphBulletSize: 1,
      valueLineBalloonEnabled: true,
      valueLineEnabled: true,
      valueLineAlpha: 0.5,
      enabled:false,
      categoryBalloonDateFormats: [{
        period: "fff",
        format: "NN:SS:QQQ"
    }]
    },        
    panelsSettings: {
      usePrefixes: true,
      marginLeft:60,      
      marginTop:10, 
    },   
    export: {
        enabled: true,
        position: "bottom-right"
    },
    listeners: [ {
        event: "dataUpdated",
        method: function(event) {
          console.log("data updated");
        }
      } ]        
  } 
}