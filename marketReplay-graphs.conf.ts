export class marketReplayGraphConfig
{
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
            offset : 40,
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
}
