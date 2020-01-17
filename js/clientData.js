
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
            var  value=timeday[0].value//开始时间
            var endtimetime=value+' 23:55:00'//结束
            var date = new Date(endtimetime.replace(/-/g, '/'));
            var thisthis =Date.parse(date)
            var to_to=new Date(thisthis-24*3600*1000)
            var dd=to_to.getDate()
            if(dd<10){
                dd='0'+dd
            }
            var formatwdate = to_to.getFullYear()+'-'+(to_to.getMonth()+1)+'-'+dd
            var starttimetime=formatwdate+' 23:55:00'//开始
            $.ajax({
                type: "post",
                url: "http://152.136.218.252:9100/frontEnd/selectStart",//启动时间点
                async: true,
                data: {
                    startTime:starttimetime,
                    endTime:endtimetime,
                    startTimeSecond:textstart,
                    endTimeSecond:textend,
                },
                success: function (data) {
                    todaydateall=[]
                    if(data.state===false){
                        alert('查询错误')
                    }
                    for (var i = 0; i < data.row1.length; i++) {
                        var rq = parseInt(data.row1[i].count)
                        todaydateall.push(rq)
                        timePointToday.push(data.row1[i].timepoint)
                    }
                    startTime(todaydateall,data.row2,timePointToday)
                    anotherCharts(data)//更新下部图表
                }
            });
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
        url: "http://152.136.218.252:9100/selectStartTime",//启动时间点
        async: true,
        data: {
            startTime:start,
            endTime:end,
        },
        success: function (data) {
            if(data.state===false){
                alert('启动时间点查询失败')
            }
            startTime(datatoday, data)
            starttable(data)
        }
    });
}
var todaydateall=[]
var timePointToday=[]
var timequeryShow
var zeotime_substart
var todayend
function homedata() {
   $('#chartTop').css('display','none')
    $('.partThree').css('display','none')
    $('#partFourLeft').css('display','none')
    $('#partFiveRight').css('display','none')
    $('#loadstart').css('display','block')
    $('#loaddelay').css('display','block')
    $('#loadip').css('display','block')
    $('#loadnet').css('display','block')
    var today=new Date();
    var ty = today.getFullYear();
    var tm = today.getMonth()+1;
    var td = today.getDate();
    if(tm<10){
        tm='0'+tm
    }
    if(td<10){
        td='0'+td
    }
    var gettoday=ty+'-'+tm+'-'+td;//今天
    todayend=gettoday+' 23:55:00'//今天结束
    var todayendend=gettoday+' 23:59:59'
    var date = new Date();
    var now=new Date(date)
    var lastday= new Date(date-24*3600*1000*2);
    var oneweekdate = new Date(date-30*24*3600*1000);
    var y = oneweekdate.getFullYear();
    var m = oneweekdate.getMonth()+1;
    var d = oneweekdate.getDate();
    if(m<10){
        m='0'+m
    }
    if(d<10){
        d='0'+d
    }
    var formatwdate = y+'-'+m+'-'+d;//8天前
    var yn = lastday.getFullYear();
    var mn = lastday.getMonth()+1;
    var dn = lastday.getDate();
    if(mn<10){
        mn='0'+mn
    }
    if(dn<10){
        dn='0'+dn
    }
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
    if(zeom<10){
        zeom='0'+zeom
    }
    if(zeod<10){
        zeod='0'+zeod
    }
    var zeotime_to=zeoy+'-'+zeom+'-'+zeod
    zeotime_substart=zeotime_to+' 23:55:00'//昨天
    var zeotimetime=zeotime_to+' 23:55:00'//昨天加点
    var zeotime_subend=textTime+' 23:55:00'
    timequeryShow=zeotime_to.substring(5,10)+'日启动人数:'
    countDown()
	$.ajax({
		type: "post",
		url: "http://152.136.218.252:9100/frontEnd/selectStart",//启动时间点
		async: true,
		data: {
            startTime:zeotime_substart,
            endTime:todayend,
            startTimeSecond:defaltDuraTime,
            endTimeSecond:todayendend,
		},
		success: function (data) {
            if (data.state === false) {
                alert('启动时间点查询失败')
            }
            for (var i = 0; i < data.row1.length; i++) {
                var rq = parseInt(data.row1[i].count)
                timePointToday.push(data.row1[i].timepoint)
                todaydateall.push(rq)
            }
            startTime(todaydateall,data.row2,timePointToday)
            anotherCharts(data)//更新下部图表
            // todaytime(todaydateall, zeotime_subend, zeotimetime)
            // anotherCharts(defaltDuraTime, todayend)//更新下部图表
        }
	});

}
//更新下部图
function anotherCharts(data) {
    delay(data.data);//延迟时间
    // phoneBrands(ob)//手机品牌
    // osVersion()//操作系统版本
    // resolution()//分辨率
    internet(data.data)//网络连接
    map(data.data)//ip地址分布
}

//开始时间点数据
function startTime(valueall,data,timePointToday) {
    $('#loadstart').css('display','none')
    $('#chartTop').css('display','block')
	var chart=null
	var arr = [];
	var arr4 = [];
	if(data.length===0){
        for (var i = 0; i < timePointToday.length; i++){
            var date=timePointToday[i].timepoint
            var index=date.indexOf(' ')
            var someDate = date.substring(index,index+6);
            arr4.push(someDate)
        }
    }else{
        for (var i = 0; i < data.length; i++) {
            var date=data[i].timepoint
            var index=date.indexOf(' ')
            var someDate = date.substring(index,index+6);
            var rq = parseInt(data[i].count)
            arr.push(rq)
            arr4.push(someDate)
        }
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
            text: ' ',
            // align: 'left',
            // x: -10,
            // verticalAlign: 'middle',
            // y: 0,
            // style: {
            //     color: '#CCC',
            //     fontWeight:'400',
            //     fontSize:'12',
            // }
        },
        credits: {
            enabled: false // 禁用版权信息
        },
        exporting: {
            enabled: false
        },
        xAxis: {
            // plotLines:[{
            //     color:'#23B52D',            //线的颜色
            //     dashStyle:'longdashdot',//标示线的样式，默认是solid（实线），这里定义为长虚线
            //     value:this,                //定义在哪个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
            //     width:1                 //标示线的宽度，2px
            // }],
            lineWidth:1,
            lineColor:'#333333',
            tickColor:'#333333',
            tickInterval: 12,
            gridLineWidth: .5,
            gridLineColor:'#202020',
            gridLineDashStyle:"Dash",
            tickmarkPlacement:'on',
            categories: arr4,
            labels: {
                enable: true,
                style: {
                    color: '#999999'
                }
            }
        },
        tooltip: {
            shared: true,
            crosshairs:{
                width: 1,
                color: '#707070',
                dashStyle: 'Dash'
            },
            backgroundColor: '#363F48',   // 背景颜色
            borderColor: '#363F48',         // 边框颜色
            borderRadius: 2,             // 边框圆角
            opacity:'1',
            // useHTML: true,
            style: {                      // 文字内容相关样式
                color: "#ffffff",
                opacity:'1',
                fontSize: "12px",
            },
        },
        yAxis: {
            title: {
                text:' ',
            },
            lineWidth:1,
            lineColor:'#333333',
            gridLineColor:'#333333',
            labels: {
                format: '{value}',
                style: {
                    color: '#999999',

                }
            }
        },
        legend: {
            enabled:false
            // itemStyle: {
            //     color: '#ffffff',
            // },
            // itemHoverStyle: {
            //     color: '#ffffff',
            // }
        },
        series: [{
            name:  '当前启动人数',
            data: valueall,
            lineWidth: 2,
            color:"#AF611C",
            symbolWidth:35,
            symbol:'circle',
        },
            {
            name: timequeryShow,
            data: arr,
            lineWidth: 2,
            color:"#999999",
            symbolWidth:35,
            symbol:'circle',
        }
        ],
    });
    starttable(data)
}
function starttable(data) {
    $("#real-datatableStart").bootstrapTable('destroy')
    $("#real-tbodyStart").empty();
    for (var i = 0; i < data.length; i++) {
        var date=data[i].timepoint
        var index=date.indexOf(' ')
        var someDate = date.substring(index,index+6);
        var rq = parseInt(data[i].count)
        $("#real-tbodyStart").append(
            "<tr><td>" + someDate +
            "</td><td>" + rq +
            "</td></tr>"
        )
    }
}
// 延迟时间
function delayTime(startTime,endTime) {
    $.ajax({
        type: "post",
        url: "http://152.136.218.252:9100/selectStartRetarder",//接口-延迟时间
        async: true,
        data: {
            startTime:startTime,
            endTime:endTime
            // serverId: 300,
            // startTime: text1,
            // endTime:textTime,
        },
        success: function (ob) {
            if(ob.state===false){
                alert('启动延迟时间查询失败')
            }
            delay(ob)
            delaytable(ob)
        }
    });
}
function delay(data) {
    var partThreeLeft = echarts.init(document.getElementById('partThreeLeft'));
    var number=[]
    var range=[]
    var rate=[]
    var acount=0
    for(var i=0;i<data.coldStartTime.length;i++){
        var num=data.coldStartTime[i].count
        var ran=data.coldStartTime[i].timequantum
        acount+=parseInt(num)
        number.push(num)
        range.push(ran)
    }
    for(var i=0;i<data.coldStartTime.length;i++){
        if(acount===0){
            rate.push('0.00')
        }
        var ra=(parseInt(data.coldStartTime[i].count))/acount
        var nn=(ra*100).toFixed(2)
        rate.push(nn)
    }
    var option = {
        title: {
            text: ' ',

        },
        // backgroundColor: "#363636",
        color: "#10CFBD",
        tooltip: {
            padding: 0,
            enterable: true,
            transitionDuration: 1,
            textStyle: {
                color: '#000',
                decoration: 'none',
            },
            formatter:function (params) {
                var tipHtml = '';
                tipHtml = '<div style="width:200px;height:40px;line-height:40px;font-size:14px;background: #363F48;padding-left: 10px">'+'<i style="display:inline-block;width:8px;height:8px;background:#10CFBD;border-radius:4px;">'+'</i>'
                    +'<span style="margin-left:10px;color:#fff;font-size:14px;">'+params.name+'ms: '+'</span>'+'<span style="color:#ffffff;margin:0 6px;">'+params.data+'人'+'</span>'+'</div>';

                return tipHtml;
            }
        },
        grid:{//图表距离外边框的距离
            x:'2%',
            width:'96%',
            height:'82%',
            y:'6%',
            containLabel: true
        },
        xAxis: [{
            type:"value",
            // type: "value",
            axisLabel: {
                textStyle: {
                    color: "#999999"
                },
                interval: 0,
                formatter: "{value}"
            },
            splitLine: {
                lineStyle: {
                    color: "#202020"
                }
            },
            axisLine: {//刻度线
                lineStyle: {
                    color: "#333333"
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
            splitLine: {
                lineStyle: {
                    color: "#333333"
                }
            },
            axisLine: {
                lineStyle: {
                    color: "#333333"
                }
            },
            axisLabel: {
                textStyle: {
                    color: "#999999"
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
                color: "#999999"
            },
            axisLine: {
                lineStyle: {
                    color: "#333333"
                }
            },
            axisLabel: {
                textStyle: {
                    color: "#999999"
                },
                formatter: "{value}%"
            }
        }
        ],
        series: [
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
    delaytable(data)
}
function delaytable(data) {
    $("#real-datatableDelay").bootstrapTable('destroy')
    $("#real-tbodyDelay").empty();
    for (var i = 0; i <data.coldStartTime.length; i++) {
        var date=data.coldStartTime[i].timequantum
        var rq = parseInt(data.coldStartTime[i].count)
        $("#real-tbodyDelay").append(
            "<tr><td>" + date +
            "</td><td>" + rq +
            "</td></tr>"
        )
    }
}
//ip地址分布
function ipmap(startTime,endTime) {
    $.ajax({
        type: "post",
        url: "http://152.136.218.252:9100/selectRegion",//接口-ip地质分布
        async: true,
        data: {
            startTime:startTime,
            endTime:endTime
        },
        success: function (ob) {
            if(ob.state===false){
                alert('ip分布查询失败')
            }
            map(ob)

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
        url: "http://152.136.218.252:9100/selectNetWork",//网络连接
        async: true,
        data: {
            startTime:startTime,
            endTime:endTime
        },
        success: function (ob) {
            if(ob.state===false){
                alert('网络连接查询失败')
            }
            internet(ob)
            // $(".right").mLoading("hide");
        }
    });
}
function internet(data) {
    $('#loaddelay').css('display','none')
    $('#loadip').css('display','none')
    $('#loadnet').css('display','none')
    $('.partThree').css('display','block')
    $('#partFourLeft').css('display','block')
    $('#partFiveRight').css('display','block')
    var datashow=[]
    for(var i=0;i<data.networkStates.length;i++){
        var nameNet=data.networkStates[i].networktype
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
        var num=data.networkStates[i].count
        var obj={}
        obj.value=num
        obj.name=nameNet
        datashow.push(obj)
    }
    var partFiveRight = echarts.init(document.getElementById('partFiveRight'));
    var option = {
        title: {
            text: '网络连接',
            left:'center',
            y: 10,
            textStyle:{
                color:'#999999',
                fontSize:14,
                fontWeight:'normal',
            },

        },
        tooltip: {
            padding: 0,
            enterable: true,
            transitionDuration: 1,
            textStyle: {
                color: '#000',
                decoration: 'none',
            },
            formatter:function (params) {
                var tipHtml = '';
                tipHtml =
                '<div style="width:200px;height:40px;line-height:40px;background:#363F48;padding-left: 5px">'+'<div style="width: 100%;height: 100%">'
                    +'<span style="margin-left:5px;color:#fff;font-size:14px;">'+params.name+': '+params.value+'</span>'+'<span style="color:#ffffff;margin:0 3px;">'+'   占比: '+params.percent+'% '+'</span>'+'</div>'+'</div>'
                    // +'<div style="padding-left:8px;">'
                    // +'<p style="color:#fff;font-size:14px;margin-top: 8px;">'+'<i style="display:inline-block;width:10px;height:10px;background:#16d6ff;border-radius:40px;margin:0 8px">'+'</i>'
                    // +'总数：'+'<span style="color:#ffffff;margin:0 6px;">'+params.data['value']+'</span>'+'人'+'</p>'
                    // +'</div>'+'</div>';
                // setTimeout(function() {
                //     tooltipCharts(params.name);
                // }, 10);
                return tipHtml;
            }
                // "{a}:{b} <br/>{c}人  ({d}%)"
        },
        color:['#9F17FF','#00FFA8', '#FFE400','#FE2C8A','#ACA7F1'],
        legend: {
            itemWidth: 20,
            itemHeight: 8,
            orient: 'horizontal',
            left:'center',
            bottom:20,
            textStyle: {
                color: '#999999'
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
    var endtimetime=value+' 23:55:00'//结束
    var date = new Date(endtimetime.replace(/-/g, '/'));
    var thisthis =Date.parse(date)
    var to_to=new Date(thisthis-24*3600*1000)
    var dd=to_to.getDate()
    var mm=to_to.getMonth()+1
    if(mm<10){
        mm='0'+mm
    }
    if(dd<10){
        dd='0'+dd
    }
    var formatwdate = to_to.getFullYear()+'-'+mm+'-'+dd
    var starttimetime=formatwdate+' 23:55:00'//开始
    var getTime=value.substring(5,10)
    timequeryShow=getTime+'日启动人数'
    $.ajax({
        type: "post",
        url: "http://152.136.218.252:9100/frontEnd/selectStartTime",//启动时间点
        async: true,
        data: {
            startTime:starttimetime,
            endTime:endtimetime
        },
        success: function (ob) {
            if(ob.state===false){
                alert('启动时间点查询失败')
            }
            if(ob.data.length===0){
                alert('所选时间无数据')
            }
            startTime(todaydateall,ob.data,timePointToday);//启动时间点
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
    $.ajax({
        type: "post",
        url: "http://152.136.218.252:9100/frontEnd/selectTimeQuantum",
        async: true,
        data: {
            startTimeSecond:starttime,
            endTimeSecond:endtime
        },
        success: function (ob) {
            if(ob.state===false){
                alert('查询错误')
            }if(ob.data.region.length===0){
                alert('所选时间范围内IP分布无数据')
            }
                if(ob.data.coldStartTime.length===0){
                    alert('所选时间范围内延迟时间无数据')
                }
                if(ob.data.networkStates.length===0){
                    alert('所选时间范围内网络连接无数据')
                }
                anotherCharts(ob)
        }
    });
}
