
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
            var timetoday= document.getElementsByClassName('el-input__inner')
            var  top=timetoday[0].value//开始时间
            var top_to=top+' 23:55:00'
            var datetop = new Date(top_to.replace(/-/g, '/'));
            var topthis =Date.parse(datetop)
            var to_totop=new Date(topthis-24*3600*1000)
            var dday=to_totop.getDate()
            var mm=(to_totop.getMonth()+1)
            if(dday<10){
                dday='0'+dday
            }
            if(mm<10){
                mm='0'+mm
            }
            var formatwdatetop = to_totop.getFullYear()+'-'+mm+'-'+dday
            var topstarttime=formatwdatetop+' 23:55:00'//开始
            var getTimetop=top.substring(5,10)
            timequeryShow=getTimetop+'日'
            $('#chartTop').css('display','none')
            $('#loadstart').css('display','block')
            $.ajax({
                type: "post",
                url: "http://150.109.84.142:9100/frontEnd/selectNumOfBreakdown",//启动时间点
                async: true,
                data: {
                    startTime:zeotime_substart,
                    endTime:todayend,
                },
                success: function (data) {
                    todaydateall=[]
                    if(data.state===false){
                        alert('崩溃时间点查询错误')
                    }
                    for (var i = 0; i < data.data.length; i++) {
                        var rq = parseInt(data.data[i].count)
                        todaydateall.push(rq)
                    }
                }
            });
            todaytime(todaydateall,topstarttime,top_to)
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
function onblu(){
    $('#partFourLeft').css('display','none')
    $('#partFiveRight').css('display','none')
    $('#partFiveL').css('display','none')
    $('#partFiveR').css('display','none')
    $('.partThree').css('display','none')
    $('.cpu').css('display','none')
    $('.gpu').css('display','none')
    $('#loaddelay').css('display','block')
    $('#loadcpu').css('display','block')
    $('#loadnet').css('display','block')
    $('#loadgpu').css('display','block')
    $('#loadver').css('display','block')
    $('#loadphone').css('display','block')
    $('#loadfen').css('display','block')
    clearInterval(countDownAll);
    countDown()
    var timeMM= document.getElementsByClassName('el-range-input')
    var  texts=timeMM[0].value//开始时间
    var  texte=timeMM[1].value//结束时间
    var textstart=texts+' 00:00:00'
    var textend=texte+' 23:59:59'
    var totopstart=texte+' 23:55:00'
    var date = new Date(totopstart.replace(/-/g, '/'));
    var thisthis =Date.parse(date)
    var to_to=new Date(thisthis-24*3600*1000)
    var dday=to_to.getDate()
    var mmon=to_to.getMonth()+1
    if(dday<10){
        dday='0'+dday
    }
    if(mmon<10){
        mmon='0'+mmon
    }
    var formatwdate = to_to.getFullYear()+'-'+mmon+'-'+dday
    var starttimetime=formatwdate+' 23:55:00'//开始
    var getTime=texte.substring(5,10)
    showPart(textstart,textend)
    anotherCharts(textstart,textend,ostype)

}
function onbluTop(){
    $('#chartTop').css('display','none')
    $('#loadstart').css('display','block')
    clearInterval(countDownAll);
    countDown()
    var timeMM= document.getElementsByClassName('el-input__inner')
    var  texts=timeMM[0].value//开始时间
    // var  texte=timeMM[1].value//结束时间
    var textstart=texts+' 00:00:00'
    var textend=texts+' 23:59:59'
    var totopstart=texts+' 23:55:00'
    var date = new Date(totopstart.replace(/-/g, '/'));
    var thisthis =Date.parse(date)
    var to_to=new Date(thisthis-24*3600*1000)
    var dd=to_to.getDate()
    var mmon=to_to.getMonth()+1
    if(dd<10){
        dd='0'+dd
    }
    if(mmon<10){
        mmon='0'+mmon
    }
    var formatwdate = to_to.getFullYear()+'-'+mmon+'-'+dd
    var starttimetime=formatwdate+' 23:55:00'//开始
    var getTime=texts.substring(5,10)
    timequeryShow=getTime+'日'

    todaytime(todaydateall,starttimetime,totopstart)
}

var ostype=0
homedata()
var todaydateall=[]
var timequeryShow
var zeotime_substart
var todayend
function homedata() {
    ostype=0
    var date=new Date()
    var today=new Date();
    var ty = today.getFullYear();
    var tm = today.getMonth()+1;
    var td = today.getDate();
    if(td<10){
        td='0'+td
    }
    if(tm<10){
        tm='0'+tm
    }
    var gettoday=ty+'-'+tm+'-'+td;//今天
    todayend=gettoday+' 23:55:00'//今天结束
    var defaltOneTime=gettoday+' 23:59:59'//今天结束
    var date = new Date();
    var lastday= new Date(date-24*3600*1000*2);
    var oneweekdate = new Date(date-30*24*3600*1000);
    var y = oneweekdate.getFullYear();
    var m = oneweekdate.getMonth()+1;
    var d = oneweekdate.getDate();
    if(d<10){
        d='0'+d
    }
    if(m<10){
        m='0'+m
    }
    var formatwdate = y+'-'+m+'-'+d;//8天前
    var yn = lastday.getFullYear();
    var mn = lastday.getMonth()+1;
    var dn = lastday.getDate();
    if(dn<10){
        dn='0'+dn
    }
    if(mn<10){
        mn='0'+mn
    }
    var formatwdateNow = yn+'-'+mn+'-'+dn;
    var text1=formatwdate
    var textTime=formatwdateNow
    var defaltDuraTime=text1+' 00:00:00'//一周前
    var zeotime=new Date(date-24*3600*1000);
    var zeoy=zeotime.getFullYear();
    var zeom=zeotime.getMonth()+1;
    var zeod=zeotime.getDate();
    if(zeod<10){
        zeod='0'+zeod
    }
    if(zeom<10){
        zeom='0'+zeom
    }
    var zeotime_to=zeoy+'-'+zeom+'-'+zeod
    var yesterdaySt=zeotime_to+' 00:00:00'
    var yesterdayEn=zeotime_to+' 23:59:59'
    zeotime_substart=zeotime_to+' 23:55:00'//昨天
    var zeotime_subend=textTime+' 23:55:00'
    timequeryShow=zeotime_to.substring(5,10)+'日'
    countDown()
    $('#chartTop').css('display','none')
    $('#partFourLeft').css('display','none')
    $('#partFiveRight').css('display','none')
    $('#partFiveL').css('display','none')
    $('#partFiveR').css('display','none')
    $('.partThree').css('display','none')
    $('.cpu').css('display','none')
    $('.gpu').css('display','none')
    $('#loadstart').css('display','block')
    $('#loaddelay').css('display','block')
    $('#loadcpu').css('display','block')
    $('#loadnet').css('display','block')
    $('#loadgpu').css('display','block')
    $('#loadver').css('display','block')
    $('#loadphone').css('display','block')
    $('#loadfen').css('display','block')
	$.ajax({
		type: "post",
		url: "http://150.109.84.142:9100/frontEnd/selectNumOfBreakdown",//今日启动时间点
		async: true,
		data: {
		    startTime:zeotime_substart,
            endTime:todayend,
		},
		success: function (data) {
            if(data.state===false){
                alert('崩溃时间点查询错误')
            }
            for (var i = 0; i < data.data.length; i++) {
                var rq = parseInt(data.data[i].count)
                todaydateall.push(rq)
            }
            showPart(defaltDuraTime,defaltOneTime)
            todaytime(todaydateall,zeotime_subend,zeotime_substart)
            anotherCharts(defaltDuraTime,defaltOneTime,ostype)//更新下部图表
		}
	});

}
function showPart(start,end) {
    $.ajax({
        type: "post",
        url: "http://150.109.84.142:9100/frontEnd/selectBreakdownCount",//崩溃次数
        async: true,
        data: {
            startTime:start,
            endTime:end,
        },
        success: function (data) {
            var numberShow = document.getElementById("query_number");
            numberShow.innerHTML=data.data.number
        }
    });
}
//更新下部图
function anotherCharts(startTime,endTime,ostype) {
    $.ajax({
        type: "post",
        url: "http://150.109.84.142:9100/frontEnd/selectBreakdown",//下部分图
        async: true,
        data: {
            startTime:startTime,
            endTime:endTime,
        },
        success: function (data) {
            if(data.state===false){
                alert('崩溃时间点查询错误')
            }
            resoluchart(data)
            phone(data)
            version(data)
            internet(data)
            save(data)
            cpuchart(data)
            gpucharts(data)
        }
    });
}

//崩溃时间点数据
function todaytime(datatoday,start,end) {
    $.ajax({
        type: "post",
        url: "http://150.109.84.142:9100/frontEnd/selectNumOfBreakdown",//昨日启动时间点
        async: true,
        data: {
            startTime:start,
            endTime:end,
        },
        success: function (data) {
            if(data.state===false){
                alert('崩溃时间点查询错误')
            }
            startTime(datatoday,data)
            collapsetable(data)
        }
    });
}
function startTime(valueall,data) {
    $('#loadstart').css('display','none')
    $('#chartTop').css('display','block')
	var chart=null
	var arr = [];
	var arr4 = [];
	for (var i = 0; i < data.data.length; i++) {
		var date=data.data[i].property
		var index=date.indexOf(' ')
		var someDate = date.substring(index,index+6);
		var rq = parseInt(data.data[i].count)
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
            text: ' ',
        },
        credits: {
            enabled: false // 禁用版权信息
        },
        exporting: {
            enabled: false
        },
        xAxis: {
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
        },
        series: [{
            name:  '今日',
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
}
function collapsetable(data) {
    $("#real-datatableCol").bootstrapTable('destroy')
    $("#real-tbodyCol").empty();
    for (var i = 0; i < data.data.length; i++) {
        var date=data.data[i].property
        var index=date.indexOf(' ')
        var someDate = date.substring(index,index+6);
        var rq = parseInt(data.data[i].count)
        $("#real-tbodyCol").append(
            "<tr><td>" + someDate +
            "</td><td>" + rq +
            "</td></tr>"
        )
    }
}
//分辨率
function resoluchart(data) {
    var partFiveLeft = echarts.init(document.getElementById('partFourLeft'));
    var number=[]
    var range=[]
    var rate=[]
    var acount=0
    if(data.data.breakdown_resolution)
    var res=data.data.breakdown_resolution
    for(var i=0;i<res.length;i++){
        var num=res[i].property
        var ran=res[i].count
        if(num===null){
            num=''
        }
        acount+=parseInt(ran)
        number.push(num)
        range.push(ran)
    }
    for(var i=0;i<res.length;i++){
        if(acount===0){
            rate.push('0.00')
        }
        var ra=(parseInt(res[i].count))/acount
        var nn=(ra*100).toFixed(2)
        rate.push(nn)
    }
    var option = {
        title: {
            text: '分辨率',
            left: 'center',
            y:10,
            textStyle:{
                color:'#999999',
                fontSize:12,
                fontWeight:'normal',
            },

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
                    +'<span style="margin-left:10px;color:#fff;font-size:14px;">'+params.name+':'+'</span>'+'<span style="color:#ffffff;margin:0 6px;">'+params.data+'人'+'</span>'+'</div>';
                // +'<div style="padding-left:8px;">'
                // +'<p style="color:#fff;font-size:14px;">'+'<i style="display:inline-block;width:10px;height:10px;background:#16d6ff;border-radius:40px;margin:0 8px">'+'</i>'
                // +'总数：'+'<span style="color:#ffffff;margin:0 6px;">'+params.data['value']+'</span>'+'人'+'</p>'
                // +'</div>';
                // setTimeout(function() {
                //     tooltipCharts(params.name);
                // }, 10);
                return tipHtml;
            }
        },
        grid:{//图表距离外边框的距离
            x:'4%',
            width:'94%',
            height:'82%',
            y:'11%',
            containLabel: true
        },
        xAxis: [{
            type:"value",
            // type: "value",
            axisLabel: {
                textStyle: {
                    color: "#999999"
                },
                formatter: "{value}"
            },
            splitLine: {
                lineStyle: {
                    color: "#202020"
                }
            },
            axisLine: {//刻度线
                lineStyle: {
                    color: "#202020"
                },
                show: true
            }
        },],
        yAxis: [{
            type: "category",
            data: number,
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
                formatter: "{value}"
            },
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
            }],
        series: [{//数据柱
            type: "bar",
            itemStyle: {
                normal: {
                    opacity: 1,
                    // barBorderRadius: 5,
                }
            },
            barWidth: "10",//数据柱样式
            data: range,//数据柱以y轴为基准数---改
            markLine: {
                label: {
                    position: "middle",
                    formatter: "{b}",
                },

            }
        }]
    }
    partFiveLeft.setOption(option);
}
// //手机品牌
function phone(data) {
    var partThreeRight=echarts.init(document.getElementById('partFiveRight'));
    var phoneB=[]
    var number=[]
    var rate=[]
    var acount=0
    if(data.data.breakdown_brand)
    var res=data.data.breakdown_brand
    for(var i=0;i<res.length;i++){
        var cate=res[i].property
        if(cate===null||cate===undefined||cate===''){
            cate='Unknow'
        }
        var num=res[i].count
        acount+=parseInt(num)
        phoneB.push(cate)//手机品牌
        number.push(num)//数量
    }
    for(var i=0;i<res.length;i++){
        if(acount===0){
            rate.push('0.00')
        }
        var ra=(parseInt(res[i].count))/acount
        var nn=(ra*100).toFixed(2)
        rate.push(nn)
    }
// Generate data
    var category = phoneB;//手机品牌
    var option = {
        title: {
            text: '手机品牌',
            left: 'center',
            y: 10,
            textStyle:{
                color:'#999999',
                fontSize:12,
                fontWeight:'normal',
            },

        },
        // backgroundColor: '#363636',
        tooltip: {
            trigger: 'axis',
            padding: 0,
            enterable: true,
            transitionDuration: 1,
            textStyle: {
                color: '#000',
                decoration: 'none',
            },
            formatter:function (params){
                var tipHtml = '';
                    tipHtml = '<div style="width:130px;height:70px;font-size:14px;background: #363F48;padding-left: 10px">'
                        +'<span style="color:#fff;font-size:14px;">'+params[0].name+'</span>'+'<br />'
                        +'<i style="display:inline-block;width:8px;height:8px;background:#10CFBD;border-radius:4px;">'+'</i>'+'<span style="color:#ffffff;font-size:14px;margin:0 6px;">'+'数量:  '+params[1].data+'人'+'</span>'+'<br />'
                        +'<i style="display:inline-block;width:8px;height:8px;background:#A873EC;border-radius:4px;">'+'</i>'+'<span style="color:#ffffff;margin:0 6px;">'+'占比:  '+params[0].data+'%'+'</span>'+'</div>';
                    return tipHtml;
            }
        },
        legend: {//图例
            show:false,
        },
        grid:{//图表距离外边框的距离
            x:'5%',
            right:'4%',
            width:'89%',
            height:'75%',
            bottom:'4%',
            y:'12%',
        },
        xAxis: {
            data: category,//x坐标轴刻度
            axisLabel:{
                textStyle: {
                    color: "#999999"
                },
                interval: 0
            },
            axisLine: {
                lineStyle: {//坐标轴样式
                    color: '#333333'
                }
            },
            axisTick:{
                show:false,
            },
        },
        yAxis: [{
            // name:'手机品牌',
            // position: 'left', // 位置靠左
            // nameLocation: 'middle', // 位置居中
            // nameGap: 42, // 与y轴距离
            // nameRotate: 90 ,// 角度
            splitLine: {show: false},//是否显示网格线
            axisLine: {
                lineStyle: {
                    color: '#333333',
                }
            },
            nameTextStyle: {
                color: "#999999"
            },
            axisLabel:{
                textStyle: {
                    color: "#999999"
                },
                formatter:'{value} ',
            }
        },
            {

                splitLine: {show: false},
                axisLine: {
                    lineStyle: {
                        color: '#333333',
                    }
                },
                axisLabel:{
                    textStyle: {
                        color: "#999999"
                    },
                    formatter:'{value}%',
                }
            }],
        series: [
            {
                name: '百分比',
                type: 'line',
                smooth: false,//false是指折线是直线而不是圆滑曲线
                showAllSymbol: true,
                symbol: 'circle',
                symbolSize:6,
                yAxisIndex: 1,
                itemStyle: {//折点样式
                    normal: {
                        color:'#A873EC'},
                },
                data: rate
            },
            {
                name: '人数',
                type: 'bar',
                barWidth:10,
                itemStyle: {
                    normal: {
                        // barBorderRadius: 5,
                        color:'#10CFBD'
                    }
                },
                data: number
            }
        ]
    };
    partThreeRight.setOption(option);

}
//操作系统版本
function version(data){
    var partFourRight = echarts.init(document.getElementById('partFiveL'));
    var number=[]
    var range=[]
    var rate=[]
    var acount=0
    if(data.data.breakdown_os)
    var res=data.data.breakdown_os
    for(var i=0;i<res.length;i++){
        var num=res[i].property
        var ran=res[i].count
        if(num===null){
            num=''
        }
        acount+=parseInt(ran)
        number.push(num)
        range.push(ran)
    }
    for(var i=0;i<res.length;i++){
        if(acount===0){
            rate.push('0.00')
        }
        var ra=(parseInt(res[i].count))/acount
        var nn=(ra*100).toFixed(2)
        rate.push(nn)
    }
    var option = {
        title: {
            text: '操作系统版本',
            left: 'center',
            y: 10,
            textStyle:{
                color:'#999999',
                fontSize:12,
                fontWeight:'normal',
            },

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
                    +'<span style="margin-left:10px;color:#fff;font-size:14px;">'+params.name+':'+'</span>'+'<span style="color:#ffffff;margin:0 6px;">'+params.data+'人'+'</span>'+'</div>';
                return tipHtml;
            }},
        grid:{//图表距离外边框的距离
            x:'3%',
            width:'94%',
            height:'85%',
            y:'12%',
            containLabel: true
        },
        xAxis: [{
            type: "value",
            axisLabel: {
                textStyle: {
                    color: "#999999"
                },
                formatter: "{value}"
            },
            splitLine: {
                lineStyle: {
                    color: "#202020"
                }
            },
            axisLine: {//刻度线
                lineStyle: {
                    color: "#202020"
                },
                show: true
            }
        },],
        yAxis: [{
            type: "category",
            data: number,
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
                formatter: "{value}"
            },
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
            }],
        series: [{//数据柱
            type: "bar",
            itemStyle: {
                normal: {
                    opacity: 1,
                    // barBorderRadius: 5,
                }
            },
            barWidth: "10",//数据柱样式
            data: range,//数据柱以y轴为基准数
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
function internet(data) {
    var datashow=[]
    if(data.data.breakdown_network)
    var res=data.data.breakdown_network
    for(var i=0;i<res.length;i++){
        var nameNet=res[i].property
        if(nameNet==='0'||nameNet===''||nameNet===undefined||nameNet===null){
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
        var num=res[i].count
        var obj={}
        obj.value=num
        obj.name=nameNet
        datashow.push(obj)
    }
    var partFiveRight = echarts.init(document.getElementById('partFiveR'));
    var option = {
        title: {
            text: '网络连接',
            left: 'center',
            y: 10,
            textStyle:{
                color:'#999999',
                fontSize:12,
                fontWeight:'normal',
            },

        },
        // backgroundColor:'#363636',
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
                return tipHtml;
            }
            // formatter: "{a}:{b} <br/>{c}人  ({d}%)"
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
//内存
function save(data) {
    var partFourLeft = echarts.init(document.getElementById('partThreeLeft'));
    var number=[]
    var range=[]
    var rate=[]
    var acount=0
    if(data.data.breakdown_memory)
    var res=data.data.breakdown_memory
    for(var i=0;i<res.length;i++){
        var num=res[i].property
        var ran=res[i].count
        if(num===null){
            num=''
        }
        acount+=parseInt(ran)
        number.push(num)
        range.push(ran)
    }
    for(var i=0;i<res.length;i++){
        if(acount===0){
            rate.push('0.00')
        }
        var ra=(parseInt(res[i].count))/acount
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
                    +'<span style="margin-left:10px;color:#fff;font-size:14px;">'+params.name+'G: '+'</span>'+'<span style="color:#ffffff;margin:0 6px;">'+params.data+'人'+'</span>'+'</div>';
                return tipHtml;
            }
        },
        grid:{//图表距离外边框的距离
            x:'2.5%',
            width:'95.5%',
            height:'92%',
            y:'2%',
            containLabel: true
        },
        xAxis: [{
            type: "value",
            axisLabel: {
                textStyle: {
                    color: "#999999"
                },
                formatter: "{value}"
            },
            splitLine: {
                lineStyle: {
                    color: "#202020"
                }
            },
            axisLine: {//刻度线
                lineStyle: {
                    color: "#202020"
                },
                show: true
            }
        },],
        yAxis: [{
            type: "category",
            data: number,
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
                formatter: "{value} G"
            },
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
            }],
        series: [{//数据柱
            type: "bar",
            itemStyle: {
                normal: {
                    opacity: 1,
                    // barBorderRadius: 5,
                }
            },
            barWidth: "10",//数据柱样式
            data: range,//数据柱以y轴为基准数
            markLine: {
                label: {
                    position: "middle",
                    formatter: "{b}",
                },

            }
        }]
    }
    partFourLeft.setOption(option);
    savetable(data)
}
function savetable(data) {
    $("#real-datatableSave").bootstrapTable('destroy')
    $("#real-tbodySave").empty();
    if(data.data.breakdown_memory)
    var res=data.data.breakdown_memory
    for (var i = 0; i < res.length; i++) {
        var someDate = res[i].property
        var rq = parseInt(res[i].count)
        $("#real-tbodySave").append(
            "<tr><td>" + someDate +
            "</td><td>" + rq +
            "</td></tr>"
        )
    }
}
//CPU
function cpuchart(data) {
    echarts.init(document.getElementById('chartCpu')).dispose();//销毁前一个实例
    var chartCpu = echarts.init(document.getElementById('chartCpu'));
    vm_collapse.cpulist=[]
    var gpuname=[]
    var numberzoo=[]
    var numberone=[]
    var numbertwo=[]
    var numberthree=[]
    var numberfour=[]
    var numberfive=[]
    var numbersix=[]
    var numberseven=[]
    var numbereight=[]
    var numbernine=[]
    var date=[]
    var numon=0
    var numtw=0
    var numth=0
    var numfo=0
    var numfi=0
    var numsi=0
    var numse=0
    var numei=0
    var numni=0
    var numte=0
    var accountall=0
    if(data.data.breakdown_cpu[0]){
        for(var i=0;i<data.data.breakdown_cpu[0].length;i++){
            date.push(data.data.breakdown_cpu[0][i].times)
        }
    }else{
        for(var i=0;i<10;i++){//默认写了十天
            date.push('')
        }
    }
    if(data.data.breakdown_cpu.length!==0){
        for(var i=0;i<data.data.breakdown_cpu.length;i++){
            gpuname.push(data.data.breakdown_cpu[i][0].type)
        }
    }else{
        for(var i=0;i<10;i++){
            gpuname.push('未知')
        }
    }
    var leng=gpuname.length
    if(leng<10){
        for(var j=0;j<(10-leng);j++){
            gpuname.push('未知')
        }
    }
    var res=data.data.breakdown_cpu
    if(res[0]){
        for(var i=0;i<res[0].length;i++){
            numberzoo.push(parseInt(res[0][i].number))
        }
    }else{
        for(var i=0;i<10;i++){
            numberzoo.push(0)
        }
    }
    if(res[1]){
        for(var i=0;i<res[1].length;i++){
            numberone.push(parseInt(res[1][i].number))
        }
    }else{
        for(var i=0;i<numberzoo.length;i++){
            numberone.push(0)
        }
    }
    if(res[2]){
        for(var i=0;i<res[2].length;i++){
            numbertwo.push(parseInt(res[2][i].number))
        }
    }else{
        for(var i=0;i<numberzoo.length;i++){
            numbertwo.push(0)
        }
    }
    if(res[3]){
        for(var i=0;i<res[3].length;i++){
            numberthree.push(parseInt(res[3][i].number))
        }
    }else{
        for(var i=0;i<numberzoo.length;i++){
            numberthree.push(0)
        }
    }
    if(res[4]){
        for(var i=0;i<res[4].length;i++){
            numberfour.push(parseInt(res[4][i].number))
        }
    }else{
        for(var i=0;i<numberzoo.length;i++){
            numberfour.push(0)
        }
    }
    if(res[5]){
        for(var i=0;i<res[5].length;i++){
            numberfive.push(parseInt(res[5][i].number))
        }
    }else{
        for(var i=0;i<numberzoo.length;i++){
            numberfive.push(0)
        }
    }
    if(res[6]){
        for(var i=0;i<res[6].length;i++){
            numbersix.push(parseInt(res[6][i].number))
        }
    }else{
        for(var i=0;i<numberzoo.length;i++){
            numbersix.push(0)
        }
    }
    if(res[7]){
        for(var i=0;i<res[7].length;i++){
            numberseven.push(parseInt(res[7][i].number))
        }
    }else{
        for(var i=0;i<numberzoo.length;i++){
            numberseven.push(0)
        }
    }
    if(res[8]){
        for(var i=0;i<res[8].length;i++){
            numbereight.push(parseInt(res[8][i].number))
        }
    }else{
        for(var i=0;i<numberzoo.length;i++){
            numbereight.push(0)
        }
    }
    if(res[9]){
        for(var i=0;i<res[9].length;i++){
            numbernine.push(parseInt(res[9][i].number))
        }
    }else{
        for(var i=0;i<numberzoo.length;i++){
            numbernine.push(0)
        }
    }
    for(var i=0;i<numberzoo.length;i++){
        accountall+=numbernine[i]+numbereight[i]+numberseven[i]+numbersix[i]+numberfive[i]+numberfour[i]+numberthree[i]+numbertwo[i]+numberone[i]+numberzoo[i]
        numon+=numberzoo[i]
        numtw+=numberone[i]
        numth+=numbertwo[i]
        numfo+=numberthree[i]
        numfi+=numberfour[i]
        numsi+=numberfive[i]
        numse+=numbersix[i]
        numei+=numberseven[i]
        numni+=numbereight[i]
        numte+=numbernine[i]
    }
    var number=[numon,numtw,numth,numfo,numfi,numsi,numse,numei,numni,numte]
    console.log(accountall,numon,numtw,numth,numfo,numfi,numsi,numse,numei,numni,numte)
    var serieszoo=gpuname[0]
    var seriesone=gpuname[1]
    var seriestwo=gpuname[2]
    var seriesthree=gpuname[3]
    var seriesfour=gpuname[4]
    var seriesfive=gpuname[5]
    var seriessix=gpuname[6]
    var seriesseven=gpuname[7]
    var serieseight=gpuname[8]
    var seriesnine=gpuname[9]
    var cpu_List=[]
    var percentData=[]
    if(accountall===0){
       for(var i=0;i<10;i++ ){
           var obj={}
           obj.name=gpuname[i]
           obj.percent='0.00%'
           percentData.push('0.00')
           cpu_List.push(obj)
       }
    }else{
        for(var i=0;i<10;i++){
            var obj={}
            obj.name=gpuname[i]
            obj.percent=((number[i]/accountall)*100).toFixed(2)+'%'
            percentData.push(((number[i]/accountall)*100).toFixed(2))
            cpu_List.push(obj)
        }
    }
    vm_collapse.cpulist=cpu_List
    expCPU(gpuname,percentData)
    option = {
        title: {
            text: ' ',
        },
        tooltip : {
            trigger: 'axis',
            borderColor:'#363F48',
            padding:0,
            backgroundColor:'#363F48',
            textStyle: {
                fontSize:12,
                // color: '#ffffff',
                align:'left',
                // fontSize:'12px',
            },
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'line', // 默认为直线，可选为：'line' | 'shadow'
                lineStyle:{
                    color:'#707070'
                },
                itemStyle: {normal: {
                        borderColor:'#ffffff',
                    }},
            }
        },
        legend: {
            show:false,
        },
        toolbox: {
            show:false,
        },
        grid: {
            left: '2%',
            width:'95%',
            height:'94%',
            top:"2%",
            containLabel: true

        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : true,
                data :date,
                axisLabel: {
                    textStyle: {
                        color: "#999999"
                    },
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
            }
        ],
        yAxis : [
            {
                type : 'value',
                splitNumber:4,
                axisTick: {
                    alignWithLabel: true
                },
                nameTextStyle: {
                    color: "#999999"
                },
                splitLine: {
                    lineStyle: {
                        color: "#202020",
                        width:2,
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
                },
            }
        ],
        series : [
            {
                name:serieszoo,
                type:'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                        color: "rgba(16,207,189,0.5)",
                        lineStyle: {
                            color: "#10cfbd"
                        }
                    }},
                itemStyle: {normal: {
                        color: "#10cfbd",
                        // borderColor:'#ffffff',
                        lineStyle: {
                            color: "#10cfbd"
                        }
                    }},
                symbol: 'circle',
                data:numberzoo
            },
            {
                name:seriesone,
                type:'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                        color: "rgba(245,87,83,0.5)",
                        lineStyle: {
                            color: "#f55753"
                        }
                    }},
                itemStyle: {normal: {
                        color: "#f55753",
                        // borderColor:'#ffffff',
                        lineStyle: {
                            color: "#f55753"
                        }
                    }},
                symbol: 'circle',
                data:numberone
            },
            {
                name:seriestwo,
                type:'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                        color: "rgba(168,115,236,0.5)",
                        lineStyle: {
                            color: "#a873ec"
                        }
                    }},
                itemStyle: {normal: {
                        color: "#a873ec",
                        // borderColor:'#ffffff',
                        lineStyle: {
                            color: "#a873ec"
                        }
                    }},
                symbol: 'circle',
                data:numbertwo
            },
            {
                name:seriesthree,
                type:'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                        color: "rgba(207,16,162,0.5)",
                        lineStyle: {
                            color: "#cf10a2"
                        }
                    }},
                itemStyle: {normal: {
                        color: "#cf10a2",
                        // borderColor:'#ffffff',
                        lineStyle: {
                            color: "#cf10a2"
                        }
                    }},
                symbol: 'circle',
                data:numberthree
            },
            {
                name:seriesfour,
                type:'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                        color: "rgba(66,226,79,0.5)",
                        lineStyle: {
                            color: "#42e24f"
                        }
                    }},
                itemStyle: {normal: {
                        color: "#42e24f",
                        // borderColor:'#ffffff',
                        lineStyle: {
                            color: "#42e24f"
                        }
                    }},
                symbol: 'circle',
                data:numberfour
            },
            {
                name:seriesfive,
                type:'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                        color: "rgba(214,115,27,0.5)",
                        lineStyle: {
                            color: "#d6731b"
                        }
                    }},
                itemStyle: {normal: {
                        color: "#d6731b",
                        // borderColor:'#ffffff',
                        lineStyle: {
                            color: "#d6731b"
                        }
                    }},
                symbol: 'circle',
                data:numberfive
            },
            {
                name:seriessix,
                type:'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                        color: "rgba(112,149,242,0.5)",
                        lineStyle: {
                            color: "#7095f2"
                        }
                    }},
                itemStyle: {normal: {
                        color: "#7095f2",
                        // borderColor:'#ffffff',
                        lineStyle: {
                            color: "#7095f2"
                        }
                    }},
                symbol: 'circle',
                data:numbersix
            },
            {
                name:seriesseven,
                type:'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                        color: "rgba(37,64,119,0.5)",
                        lineStyle: {
                            color: "#254077"
                        }
                    }},
                itemStyle: {normal: {
                        color: "#254077",
                        // borderColor:'#ffffff',
                        lineStyle: {
                            color: "#254077"
                        }
                    }},
                symbol: 'circle',
                data:numberseven
            },
            {
                name:serieseight,
                type:'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                        color: "rgba(5,73,243,0.5)",
                        lineStyle: {
                            color: "#0549f3"
                        }
                    }},
                itemStyle: {normal: {
                        color: "#0549f3",
                        // borderColor:'#ffffff',
                        lineStyle: {
                            color: "#0549f3"
                        }
                    }},
                symbol: 'circle',
                data:numbereight
            },
            {
                name:seriesnine,
                type:'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                        color: "rgba(174,169,35,0.5)",
                        lineStyle: {
                            color: "#aea923"
                        }
                    }},
                itemStyle: {normal: {
                        color: "#aea923",
                        // borderColor:'#ffffff',
                        lineStyle: {
                            color: "#aea923"
                        }
                    }},
                symbol: 'circle',
                data:numbernine
            },
        ]
    };
    chartCpu.setOption(option);
}
function expCPU(name,percent) {
    $("#real-datatableCPU").bootstrapTable('destroy')
    $("#real-tbodyCPU").empty();
    for (var i = 0; i < name.length; i++) {
        var date=name[i]
        var rq = percent[i]
        $("#real-tbodyCPU").append(
            "<tr><td>" + date +"</td><td>" + rq +
            "</td></tr>"
        )
    }
}
//GPU
function gpucharts(data) {
    $('#loaddelay').css('display','none')
    $('#loadcpu').css('display','none')
    $('#loadnet').css('display','none')
    $('#loadgpu').css('display','none')
    $('#loadver').css('display','none')
    $('#loadphone').css('display','none')
    $('#loadfen').css('display','none')
    $('#partFourLeft').css('display','block')
    $('#partFiveRight').css('display','block')
    $('#partFiveL').css('display','block')
    $('#partFiveR').css('display','block')
    $('.partThree').css('display','block')
    $('.cpu').css('display','block')
    $('.gpu').css('display','block')
    echarts.init(document.getElementById('chartGPU')).dispose();//销毁前一个实例
    var chartGPU = echarts.init(document.getElementById('chartGPU'));
    vm_collapse.gpulist=[]
    var gpuname=[]
    var numberzoo=[]
    var numberone=[]
    var numbertwo=[]
    var numberthree=[]
    var numberfour=[]
    var numberfive=[]
    var numbersix=[]
    var numberseven=[]
    var numbereight=[]
    var numbernine=[]
    var date=[]
    var numon=0
    var numtw=0
    var numth=0
    var numfo=0
    var numfi=0
    var numsi=0
    var numse=0
    var numei=0
    var numni=0
    var numte=0
    var accountall=0
    if(data.data.breakdown_gpu[0]){
        for(var i=0;i<data.data.breakdown_gpu[0].length;i++){
            date.push(data.data.breakdown_gpu[0][i].times)
        }
    }else{
        for(var i=0;i<10;i++){//默认写了十天
            date.push('')
        }
    }
    if(data.data.breakdown_gpu.length!==0){
        for(var i=0;i<data.data.breakdown_gpu.length;i++){
            gpuname.push(data.data.breakdown_gpu[i][0].type)
        }
    }else{
        for(var i=0;i<10;i++){
            gpuname.push('未知')
        }
    }
    var leng=gpuname.length
    if(leng<10){
        for(var j=0;j<(10-leng);j++){
            gpuname.push('未知')
        }
    }
    var res=data.data.breakdown_gpu
    if(res[0]){
        for(var i=0;i<res[0].length;i++){
            numberzoo.push(parseInt(res[0][i].number))
        }
    }else{
        for(var i=0;i<10;i++){
            numberzoo.push(0)
        }
    }
    if(res[1]){
        for(var i=0;i<res[1].length;i++){
            numberone.push(parseInt(res[1][i].number))
        }
    }else{
        for(var i=0;i<numberzoo.length;i++){
            numberone.push(0)
        }
    }
    if(res[2]){
        for(var i=0;i<res[2].length;i++){
            numbertwo.push(parseInt(res[2][i].number))
        }
    }else{
        for(var i=0;i<numberzoo.length;i++){
            numbertwo.push(0)
        }
    }
    if(res[3]){
        for(var i=0;i<res[3].length;i++){
            numberthree.push(parseInt(res[3][i].number))
        }
    }else{
        for(var i=0;i<numberzoo.length;i++){
            numberthree.push(0)
        }
    }
    if(res[4]){
        for(var i=0;i<res[4].length;i++){
            numberfour.push(parseInt(res[4][i].number))
        }
    }else{
        for(var i=0;i<numberzoo.length;i++){
            numberfour.push(0)
        }
    }
    if(res[5]){
        for(var i=0;i<res[5].length;i++){
            numberfive.push(parseInt(res[5][i].number))
        }
    }else{
        for(var i=0;i<numberzoo.length;i++){
            numberfive.push(0)
        }
    }
    if(res[6]){
        for(var i=0;i<res[6].length;i++){
            numbersix.push(parseInt(res[6][i].number))
        }
    }else{
        for(var i=0;i<numberzoo.length;i++){
            numbersix.push(0)
        }
    }
    if(res[7]){
        for(var i=0;i<res[7].length;i++){
            numberseven.push(parseInt(res[7][i].number))
        }
    }else{
        for(var i=0;i<numberzoo.length;i++){
            numberseven.push(0)
        }
    }
    if(res[8]){
        for(var i=0;i<res[8].length;i++){
            numbereight.push(parseInt(res[8][i].number))
        }
    }else{
        for(var i=0;i<numberzoo.length;i++){
            numbereight.push(0)
        }
    }
    if(res[9]){
        for(var i=0;i<res[9].length;i++){
            numbernine.push(parseInt(res[9][i].number))
        }
    }else{
        for(var i=0;i<numberzoo.length;i++){
            numbernine.push(0)
        }
    }
    for(var i=0;i<numberzoo.length;i++){
        accountall+=numbernine[i]+numbereight[i]+numberseven[i]+numbersix[i]+numberfive[i]+numberfour[i]+numberthree[i]+numbertwo[i]+numberone[i]+numberzoo[i]
        numon+=numberzoo[i]
        numtw+=numberone[i]
        numth+=numbertwo[i]
        numfo+=numberthree[i]
        numfi+=numberfour[i]
        numsi+=numberfive[i]
        numse+=numbersix[i]
        numei+=numberseven[i]
        numni+=numbereight[i]
        numte+=numbernine[i]
    }
    var number=[numon,numtw,numth,numfo,numfi,numsi,numse,numei,numni,numte]
    var serieszoo=gpuname[0]
    var seriesone=gpuname[1]
    var seriestwo=gpuname[2]
    var seriesthree=gpuname[3]
    var seriesfour=gpuname[4]
    var seriesfive=gpuname[5]
    var seriessix=gpuname[6]
    var seriesseven=gpuname[7]
    var serieseight=gpuname[8]
    var seriesnine=gpuname[9]
    var cpu_List=[]
    var percentData=[]
    if(accountall===0){
        for(var i=0;i<10;i++ ){
            var obj={}
            obj.name=gpuname[i]
            obj.percent='0.00%'
            percentData.push('0.00')
            cpu_List.push(obj)
        }
    }else{
        for(var i=0;i<10;i++){
            var obj={}
            obj.name=gpuname[i]
            obj.percent=((number[i]/accountall)*100).toFixed(2)+'%'
            percentData.push(((number[i]/accountall)*100).toFixed(2))
            cpu_List.push(obj)
        }
    }
    vm_collapse.gpulist=cpu_List
    expGPU(gpuname,percentData)
    option = {
        title: {
            text: ' ',
        },
        tooltip : {
            trigger: 'axis',
            borderColor:'#363F48',
            padding:0,
            backgroundColor:'#363F48',
            textStyle: {
                fontSize:12,
                // color: '#ffffff',
                align:'left',
                // fontSize:'12px',
            },
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'line', // 默认为直线，可选为：'line' | 'shadow'
                lineStyle:{
                    color:'#707070'
                },
                itemStyle: {normal: {
                        borderColor:'#ffffff',
                    }},
            }
        },
        legend: {
            show:false,
        },
        toolbox: {
            show:false,
        },
        grid: {
            left: '2%',
            width:'95%',
            height:'94%',
            top:"2%",
            containLabel: true

        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : true,
                data :date,
                axisLabel: {
                    textStyle: {
                        color: "#999999"
                    },
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
            }
        ],
        yAxis : [
            {
                type : 'value',
                splitNumber:4,
                axisTick: {
                    alignWithLabel: true
                },
                nameTextStyle: {
                    color: "#999999"
                },
                splitLine: {
                    lineStyle: {
                        color: "#202020",
                        width:2,
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
                },
            }
        ],
        series : [
            {
                name:serieszoo,
                type:'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                        color: "rgba(16,207,189,0.5)",
                        lineStyle: {
                            color: "#10cfbd"
                        }
                    }},
                itemStyle: {normal: {
                        color: "#10cfbd",
                        // borderColor:'#ffffff',
                        lineStyle: {
                            color: "#10cfbd"
                        }
                    }},
                symbol: 'circle',
                data:numberzoo
            },
            {
                name:seriesone,
                type:'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                        color: "rgba(245,87,83,0.5)",
                        lineStyle: {
                            color: "#f55753"
                        }
                    }},
                itemStyle: {normal: {
                        color: "#f55753",
                        // borderColor:'#ffffff',
                        lineStyle: {
                            color: "#f55753"
                        }
                    }},
                symbol: 'circle',
                data:numberone
            },
            {
                name:seriestwo,
                type:'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                        color: "rgba(168,115,236,0.5)",
                        lineStyle: {
                            color: "#a873ec"
                        }
                    }},
                itemStyle: {normal: {
                        color: "#a873ec",
                        // borderColor:'#ffffff',
                        lineStyle: {
                            color: "#a873ec"
                        }
                    }},
                symbol: 'circle',
                data:numbertwo
            },
            {
                name:seriesthree,
                type:'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                        color: "rgba(207,16,162,0.5)",
                        lineStyle: {
                            color: "#cf10a2"
                        }
                    }},
                itemStyle: {normal: {
                        color: "#cf10a2",
                        // borderColor:'#ffffff',
                        lineStyle: {
                            color: "#cf10a2"
                        }
                    }},
                symbol: 'circle',
                data:numberthree
            },
            {
                name:seriesfour,
                type:'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                        color: "rgba(66,226,79,0.5)",
                        lineStyle: {
                            color: "#42e24f"
                        }
                    }},
                itemStyle: {normal: {
                        color: "#42e24f",
                        // borderColor:'#ffffff',
                        lineStyle: {
                            color: "#42e24f"
                        }
                    }},
                symbol: 'circle',
                data:numberfour
            },
            {
                name:seriesfive,
                type:'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                        color: "rgba(214,115,27,0.5)",
                        lineStyle: {
                            color: "#d6731b"
                        }
                    }},
                itemStyle: {normal: {
                        color: "#d6731b",
                        // borderColor:'#ffffff',
                        lineStyle: {
                            color: "#d6731b"
                        }
                    }},
                symbol: 'circle',
                data:numberfive
            },
            {
                name:seriessix,
                type:'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                        color: "rgba(112,149,242,0.5)",
                        lineStyle: {
                            color: "#7095f2"
                        }
                    }},
                itemStyle: {normal: {
                        color: "#7095f2",
                        // borderColor:'#ffffff',
                        lineStyle: {
                            color: "#7095f2"
                        }
                    }},
                symbol: 'circle',
                data:numbersix
            },
            {
                name:seriesseven,
                type:'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                        color: "rgba(37,64,119,0.5)",
                        lineStyle: {
                            color: "#254077"
                        }
                    }},
                itemStyle: {normal: {
                        color: "#254077",
                        // borderColor:'#ffffff',
                        lineStyle: {
                            color: "#254077"
                        }
                    }},
                symbol: 'circle',
                data:numberseven
            },
            {
                name:serieseight,
                type:'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                        color: "rgba(5,73,243,0.5)",
                        lineStyle: {
                            color: "#0549f3"
                        }
                    }},
                itemStyle: {normal: {
                        color: "#0549f3",
                        // borderColor:'#ffffff',
                        lineStyle: {
                            color: "#0549f3"
                        }
                    }},
                symbol: 'circle',
                data:numbereight
            },
            {
                name:seriesnine,
                type:'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                        color: "rgba(174,169,35,0.5)",
                        lineStyle: {
                            color: "#aea923"
                        }
                    }},
                itemStyle: {normal: {
                        color: "#aea923",
                        // borderColor:'#ffffff',
                        lineStyle: {
                            color: "#aea923"
                        }
                    }},
                symbol: 'circle',
                data:numbernine
            },
        ]
    };
    chartGPU.setOption(option);
}
function expGPU(name,percent) {
    $("#real-datatableGPU").bootstrapTable('destroy')
    $("#real-tbodyGPU").empty();
    for (var i = 0; i < name.length; i++) {
        var date=name[i]
        var rq = percent[i]
        $("#real-tbodyGPU").append(
            "<tr><td>" + date +"</td><td>" + rq +
            "</td></tr>"
        )
    }
}

