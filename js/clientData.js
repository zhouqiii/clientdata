
//倒计时
var countDownAll//定义一个全局变量,用来转换清除内部定时器
function countDown(){
    var m = 5;  //分
    var s = 00;  //秒
    var countdown = document.getElementsByClassName("countdown");
    var len=countdown.length
    function getCountdown (){
        var htm=m+'min'
        for(var i=0;i<len;i++){
            countdown[i].innerHTML=htm
        }
        if( m == 0 && s == 0 ){
            var timeMM= document.getElementsByClassName('el-range-input')
            var  texts=timeMM[0].value//开始时间
            var  texte=timeMM[1].value//结束时间
            var textstart=texts+' 00:00:00'
            var textend=texte+' 23:59:59'
            var timeday= document.getElementsByClassName('el-input__inner')
            var  textday_to=timeday[0].value//开始时间
            querytime(textday_to)
            anotherCharts(textstart,textend)//更新下部图表

            m = 5;
            s = 00;
        }else if( m >= 0 ){
            if( s >= 0 && s<59){
                s++;
            }else if( s == 59 ){
                m--;
                s = 00;
            }
        }
    }
    getCountdown();
    countDownAll=setInterval(function(){ getCountdown() },1000);
}
// change()

// function onblu(){
//     var timeMM= document.getElementsByClassName('el-range-input')
//     var  texts=timeMM[0].value//开始时间
//     var  texte=timeMM[1].value//结束时间
//
// }
function change() {
    // $("#page-wrapper").mLoading("show");
	$.ajax({
		type: "get",
		url: "../queryAreas.action",
		async: false,
		success: function (obj) {
			for (var i = 0; i < obj.rows.length; i++) {
				$("#district").append("<option value='" + obj.rows[i].areaid + "'>" + obj.rows[i].areaname + "</option>");
			}
			$("#district").each(function () {
				$(this).find("option").attr("selected", "selected")
			})
			$('#district').multiselect("destroy").multiselect({
				buttonWidth: '70%',
				nonSelectedText: '请选择',
				maxHeight: 200,
				numberDisplayed: 1,
				includeSelectAllOption: true,
				selectAllText: '全选/全不选', //全选按钮显示的文本
				nSelectedText: '项被选中',
				allSelectedText: '已选中所有区服',
			});
			homedata()
		}
	});
}
homedata()
function todaytime(datatoday,start,end) {
    $.ajax({
        type: "post",
        url: "http://152.136.218.252:8123/selectStartTime",//启动时间点
        async: true,
        data: {
            startTime:start,
            endTime:end,
        },
        success: function (data) {
            startTime(datatoday,data)
        }
    });
}
var todaydateall=[]
var timequeryShow
function homedata() {
    var today=new Date();
    var ty = today.getFullYear();
    var tm = today.getMonth()+1;
    var td = today.getDate();
    var gettoday=ty+'-'+tm+'-'+td;//今天
    var todayend=gettoday+' 23:54:59'//今天结束

    var date = new Date();
    var now=new Date(date)
    var lastday= new Date(date-24*3600*1000*2);
    var oneweekdate = new Date(date-7*24*3600*1000);
    var y = oneweekdate.getFullYear();
    var m = oneweekdate.getMonth()+1;
    var d = oneweekdate.getDate();
    var formatwdate = y+'-'+m+'-'+d;//8天前
    var yn = lastday.getFullYear();
    var mn = lastday.getMonth()+1;
    var dn = lastday.getDate();
    var formatwdateNow = yn+'-'+mn+'-'+dn;
    var text1=formatwdate
    var textTime=formatwdateNow
    var defaltOneTime=textTime+' 23:59:59'//昨天
    var defaltone=textTime+' 00:00:00'
    var defaltDuraTime=text1+' 00:00:00'//一周前

    var zeotime=new Date(date-24*3600*1000);
    var zeoy=zeotime.getFullYear();
    var zeom=zeotime.getMonth()+1;
    var zeod=zeotime.getDate();
    var zeotime_to=zeoy+'-'+zeom+'-'+zeod
    var zeotime_substart=zeotime_to+' 23:55:00'//昨天
    var zeotimetime=zeotime_to+' 23:54:59'//昨天加点
    var zeotime_subend=textTime+' 23:55:00'
    timequeryShow=zeotime_to.substring(5,10)+'日'
    countDown()
    $("#page-inner").mLoading("show");
	$.ajax({
		type: "post",
		url: "http://152.136.218.252:8123/selectStartTime",//启动时间点
		async: true,
		data: {
		    startTime:zeotime_substart,
            endTime:todayend,
		},
		success: function (data) {
            for (var i = 0; i < data.data.length; i++) {
                var rq = parseInt(data.data[i].timeNum)
                todaydateall.push(rq)
            }
            todaytime(todaydateall,zeotime_subend,zeotimetime)
            anotherCharts(defaltDuraTime,todayend)//更新下部图表
            $("#page-inner").mLoading("hide");
		}
	});

}
//更新下部图
function anotherCharts(startTime,endTime) {
    delayTime(startTime,endTime);//延迟时间
    // phoneBrands(ob)//手机品牌
   ipmap(startTime,endTime)//ip地址分布
    // osVersion()//操作系统版本
    // resolution()//分辨率
    internetCon(startTime,endTime)//网络连接
}

//开始时间点数据
function startTime(valueall,data) {
	var chart=null
	var arr = [];
	var arr4 = [];
	for (var i = 0; i < data.data.length; i++) {
		var date=data.data[i].timeCount
		var index=date.indexOf(' ')
		var someDate = date.substring(index,index+6);
		var rq = parseInt(data.data[i].timeNum)
		arr.push(rq)
		arr4.push(someDate)
	}
    chart = Highcharts.chart('chartTop', {
        chart: {
            reflow: true,
            type: 'spline',
            backgroundColor: {
                stops: [
                    [0, 'rgb(54, 54, 54)']
                ]
            },
        },
        title: {
            text: '启'+'<br />'+'动'+'<br />'+'时'+'<br />'+'间'+'<br />'+'点'+'<br />',
            align: 'left',
            x: -10,
            verticalAlign: 'middle',
            y: 0,
            style: {
                color: '#CCC',
                fontWeight:'400',
                fontSize:'12',
            }
        },
        credits: {
            enabled: false // 禁用版权信息
        },
        exporting: {
            enabled: false
        },
        xAxis: {
            plotLines:[{
                color:'#23B52D',            //线的颜色
                dashStyle:'longdashdot',//标示线的样式，默认是solid（实线），这里定义为长虚线
                value:this,                //定义在哪个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                width:1                 //标示线的宽度，2px
            }],
            tickInterval: 12,
            gridLineWidth: .5,
            gridLineColor:'#363636',
            gridLineDashStyle:"Dash",
            tickmarkPlacement:'on',
            categories: arr4,
            labels: {
                enable: true,
                style: {
                    color: '#fff'
                }
            }
        },
        tooltip: {
            shared: true,
            crosshairs:{
                width: 1,
                color: '#23B52D',
                dashStyle: 'Dash'
            },
            backgroundColor: '#ffffff',   // 背景颜色
            borderColor: '#363636',         // 边框颜色
            opacity:'1',
            borderRadius: 1,             // 边框圆角
            style: {                      // 文字内容相关样式
                color: "#202020",
                opacity:'1',
                fontSize: "14px",
                whiteSpace:'pre',
            },
        },
        yAxis: {
            title: {
                text:' ',
            },
            gridLineColor:'#707070',
            labels: {
                format: '{value}',
                style: {
                    color: 'rgb(218,213,213)',

                }
            }
        },
        legend: {
            itemStyle: {
                color: '#ffffff',
            },
            itemHoverStyle: {
                color: '#ffffff',
            }
        },
        series: [{
            name:  '今日',
            data: valueall,
            lineWidth: 2,
            color:"#E1AA13",
            symbolWidth:35,
            symbol:'circle',
        },
            {
            name: timequeryShow,
            data: arr,
            lineWidth: 2,
            color:"#4AA3E5",
            symbolWidth:35,
            symbol:'circle',
        }
        ],
    });
}
// 延迟时间
function delayTime(startTime,endTime) {
    $("#page-inner").mLoading("show");
    $.ajax({
        type: "post",
        url: "http://152.136.218.252:8123/selectStartRetarder",//接口-延迟时间
        async: true,
        data: {
            startTime:startTime,
            endTime:endTime
            // serverId: 300,
            // startTime: text1,
            // endTime:textTime,
        },
        success: function (ob) {
            delay(ob)
            $("#page-inner").mLoading("hide");
        }
    });
}
function delay(data) {
    var partThreeLeft = echarts.init(document.getElementById('partThreeLeft'));
    var number=[]
    var range=[]
    var rate=[]
    var acount=0
    for(var i=0;i<data.data.length;i++){
        var num=data.data[i].timeCount
        var ran=data.data[i].timeNum
        acount+=parseInt(num)
        number.push(num)
        range.push(ran)
    }
    for(var i=0;i<data.data.length;i++){
        var ra=(parseInt(data.data[i].timeCount))/acount
        var nn=(ra*100).toFixed(2)
        rate.push(nn)
    }
    var option = {
        title: {
            text: '启\n动\n延\n迟\n时\n间\n',
            x: 'left',
            left:'9',
            y: 'center',
            textStyle:{
                color:'#CCC',
                fontSize:12,
                fontWeight:'normal',
            },

        },
        backgroundColor: "#363636",
        color: "#FDB467",
        tooltip: {
        //     trigger: 'axis',
        //     formatter:function (params) {
        //         console.log(params)
        //     }
        },
        grid:{//图表距离外边框的距离
            x:'4%',
            width:'92%',
            height:'82%',
            y:'13%',
            containLabel: true
        },
        xAxis: [{
            type:"value",
            // type: "value",
            axisLabel: {
                textStyle: {
                    color: "#ffffff"
                },
                formatter: "{value}"
            },
            splitLine: {
                lineStyle: {
                    color: "#363636"
                }
            },
            axisLine: {//刻度线
                lineStyle: {
                    color: "#ffffff"
                },
                show: true
            }
        },],
        yAxis: [{
            type: "category",
            data: range,
            axisTick: {
                alignWithLabel: true
            },
            nameTextStyle: {
                color: "#ffffff"
            },
            axisLine: {
                lineStyle: {
                    color: "#ffffff"
                }
            },
            axisLabel: {
                textStyle: {
                    color: "#ffffff"
                },
                formatter: "{value} ms"
            },
            interval:80,//设置刻度间距
        },
            {
            type: "category",
            data:rate,
            axisTick: {
                alignWithLabel: true
            },

            nameTextStyle: {
                color: "#ffffff"
            },
            axisLine: {
                lineStyle: {
                    color: "#ffffff"
                }
            },
            axisLabel: {
                textStyle: {
                    color: "#ffffff"
                },
                formatter: "{value}%"
            }
        }
        ],
        series: [
        //     {//顶部椭圆突出显示点
        //     name: "",
        //     type: "pictorialBar",
        //     symbolSize: [10, 20],
        //     symbolOffset: [3,0],
        //     symbolPosition: "end",
        //     z: 12,
        //     xAxisIndex: 0,
        //     label: {
        //         normal: {
        //             show: true,
        //             position: "right",
        //             formatter: "{c}%"
        //         }
        //     },
        //     data: rate,//以y轴为基准的右侧提示数据,存放百分比---改
        // },
            {//数据柱
            type: "bar",
            itemStyle: {
                normal: {
                    opacity: 1,
                    // barBorderRadius: 5,
                }
            },
            barWidth: "10",//数据柱样式
            data: number,//数据柱以y轴为基准数---改
            markLine: {
                label: {
                    position: "middle",
                    formatter: "{b}",
                },

            }
        }]
    }
    partThreeLeft.setOption(option);
}
//ip地址分布
function ipmap(startTime,endTime) {
    $("#page-inner").mLoading("show");
    $.ajax({
        type: "post",
        url: "http://152.136.218.252:8123/selectRegion",//接口-ip地质分布
        async: true,
        data: {
            startTime:startTime,
            endTime:endTime
        },
        success: function (ob) {
            map(ob)
            $("#page-inner").mLoading("hide");

        }
    });
}


//操作系统版本
function osVersion() {
    var partFourRight = echarts.init(document.getElementById('partFourRight'));
    var option = {
        title: {
            text: '操作系统版本',
            x: 'center',
            y: 18,
            textStyle:{
                color:'#CCC',
                fontSize:12,
                fontWeight:'normal',
            },

        },
        backgroundColor: "#363636",
        color: "#287CA1",
        tooltip: {},
        grid:{//图表距离外边框的距离
            x:'4%',
            width:'92%',
            height:'82%',
            y:'13%',
            containLabel: true
        },
        xAxis: [{
            type: "value",
            axisLabel: {
                textStyle: {
                    color: "#ffffff"
                },
                formatter: "{value}%"
            },
            splitLine: {
                lineStyle: {
                    color: "#363636"
                }
            },
            axisLine: {//刻度线
                lineStyle: {
                    color: "#ffffff"
                },
                show: true
            }
        },],
        yAxis: [{
            type: "category",
            data: ["01月", "02月", "03月", "04月", "05月", "06月", "07月", "08月", "09月", "10月"],
            axisTick: {
                alignWithLabel: true
            },
            nameTextStyle: {
                color: "#82b0ec"
            },
            axisLine: {
                lineStyle: {
                    color: "#ffffff"
                }
            },
            axisLabel: {
                textStyle: {
                    color: "#ffffff"
                }
            },
            interval:80,//设置刻度间距
        },{
            type: "category",
            data: ["01月", "02月", "03月", "04月", "05月", "06月", "07月", "08月", "09月", "10月"],
            axisTick: {
                alignWithLabel: true
            },
            nameTextStyle: {
                color: "#ffffff"
            },
            axisLine: {
                lineStyle: {
                    color: "#ffffff"
                }
            },
            axisLabel: {
                textStyle: {
                    color: "#ffffff"
                }
            }
        }],
        series: [{//顶部椭圆突出显示点
            name: "",
            type: "pictorialBar",
            symbolSize: [10, 20],
            symbolOffset: [3,0],
            symbolPosition: "end",
            z: 12,
            label: {
                normal: {
                    show: true,
                    position: "right",
                    formatter: "{c}%"
                }
            },
            data: [60, 70, 80, 90, 60,40, 80, 90]//以y轴为基准的右侧提示数据
        }, {//数据柱
            type: "bar",
            itemStyle: {
                normal: {
                    opacity: .7,
                }
            },
            barWidth: "20",//数据柱样式
            data: [60, 60, 60, 90, 60, 70, 80, 90],//数据柱以y轴为基准数
            markLine: {
                label: {
                    position: "middle",
                    formatter: "{b}",
                },

            }
        }]
    }
    partFourRight.setOption(option);
}

//网络连接
function  internetCon(startTime,endTime) {
    $.ajax({
        type: "post",
        url: "http://152.136.218.252:8123/selectNetWork",//网络连接
        async: true,
        data: {
            startTime:startTime,
            endTime:endTime
        },
        success: function (ob) {
            internet(ob)
            console.log(ob)
            // $(".right").mLoading("hide");
        }
    });
}
function internet(data) {
    var datashow=[]
    for(var i=0;i<data.data.length;i++){
        var nameNet=data.data[i].timeCount
        if(nameNet==='0'){
            nameNet='Unkown'
        }else if(nameNet==='1'){
            nameNet='Wifi'
        }else if(nameNet==='2'){
            nameNet='2G'
        }else if(nameNet==='3'){
            nameNet='3G'
        }else if(nameNet==='4'){
            nameNet='4G'
        }
        var num=data.data[i].timeNum
        var obj={}
        obj.value=num
        obj.name=nameNet
        datashow.push(obj)
    }
    var partFiveRight = echarts.init(document.getElementById('partFiveRight'));
    var option = {
        title: {
            text: '网\n络\n连\n接\n',
            x: 'left',
            left:'9',
            y: 'center',
            textStyle:{
                color:'#CCC',
                fontSize:12,
                fontWeight:'normal',
            },

        },
        backgroundColor:'#363636',
        tooltip: {
            trigger: 'item',
            fontSize:'16px',
            formatter: "{a}:{b} <br/>{c}人  ({d}%)"
        },
        color:['#5690DB','#FFFFFF', '#AE77AA','#FDB467','#ACA7F1'],
        legend: {
            itemWidth: 20,
            itemHeight: 8,
            orient: 'vertical',
            x:'84%',
            y:20,
            textStyle: {
                color: '#FFFFFF'
            },
            data:['Wifi','2G','3G','4G','Unkown'],
        },
        series: [
            // {
            //     name:'访问来源',
            //     type:'pie',
            //     selectedMode: 'single',
            //     radius: [0, '30%'],
            //
            //     label: {
            //         normal: {
            //             position: 'inner'
            //         }
            //     },
            //     labelLine: {
            //         normal: {
            //             show: false
            //         }
            //     },
            //     data:[
            //         {value:335, name:'直达', selected:true},
            //         {value:679, name:'营销广告'},
            //         {value:1548, name:'搜索引擎'}
            //     ]
            // },
            {
                name:' 网络来源',
                type:'pie',
                radius: ['35%', '55%'],
                label: {
                    normal: {
                        formatter: ' {b}：{c}   '+'占比'+'：{d}%  ',
                        rich: {
                            a: {
                                color: '#999',
                                lineHeight: 33,
                                align: 'center'
                            },
                            b: {
                                fontSize: 16,
                                lineHeight: 44
                            },
                            per: {
                                color: '#eee',
                                backgroundColor: '#334455',
                                padding: [2, 4],
                                borderRadius: 2
                            }
                        }
                    }
                },
                data:datashow
            }
        ]
    };
    partFiveRight.setOption(option);
}
//启动时间点图表单独查询
function querytime(value) {
    clearInterval(countDownAll);
    countDown()
    var endtimetime=value+' 23:54:59'//结束
    var date = new Date(endtimetime.replace(/-/g, '/'));
    var thisthis =Date.parse(date)
    var to_to=new Date(thisthis-24*3600*1000)
    var formatwdate = to_to.getFullYear()+'-'+(to_to.getMonth()+1)+'-'+to_to.getDate()
    var starttimetime=formatwdate+' 23:55:00'//开始
    var getTime=value.substring(5,10)
    timequeryShow=getTime+'日'
    $("#page-inner").mLoading("show");
    $.ajax({
        type: "post",
        url: "http://152.136.218.252:8123/selectStartTime",//启动时间点
        async: true,
        data: {
            startTime:starttimetime,
            endTime:endtimetime
        },
        success: function (ob) {
            startTime(todaydateall,ob);//启动时间点
            $("#page-inner").mLoading("hide");
        }
    });
}
function querydurationTime(valuestart,valueend) {
    clearInterval(countDownAll);
    countDown()
    var  textst=valuestart//开始时间
    var  texten=valueend//结束时间
    var starttime=textst+' 00:00:00'//开始
    var endtime=texten+' 23:59:59'//结束
    anotherCharts(starttime,endtime)
}