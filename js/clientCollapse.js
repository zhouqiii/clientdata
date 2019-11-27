
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
            console.log(todaydateall)
            var timeMM= document.getElementsByClassName('el-range-input')
            var  texts=timeMM[0].value//开始时间
            var  texte=timeMM[1].value//结束时间
            var textstart=texts+' 00:00:00'
            var textend=texte+' 23:59:59'
            var totopstart=texte+' 23:55:00'
            var date = new Date(totopstart.replace(/-/g, '/'));
            var thisthis =Date.parse(date)
            var to_to=new Date(thisthis-24*3600*1000)
            var formatwdate = to_to.getFullYear()+'-'+(to_to.getMonth()+1)+'-'+to_to.getDate()
            var starttimetime=formatwdate+' 23:55:00'//开始
            var getTime=texte.substring(5,10)
            timequeryShow=getTime+'日'
            $("#page-inner").mLoading("show");
            todaytime(todaydateall,starttimetime,totopstart)
            anotherCharts(textstart,textend,ostype)
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
    clearInterval(countDownAll);
    countDown()
    console.log(todaydateall)
    var timeMM= document.getElementsByClassName('el-range-input')
    var  texts=timeMM[0].value//开始时间
    var  texte=timeMM[1].value//结束时间
    var textstart=texts+' 00:00:00'
    var textend=texte+' 23:59:59'
    var totopstart=texte+' 23:55:00'
    var date = new Date(totopstart.replace(/-/g, '/'));
    var thisthis =Date.parse(date)
    var to_to=new Date(thisthis-24*3600*1000)
    var formatwdate = to_to.getFullYear()+'-'+(to_to.getMonth()+1)+'-'+to_to.getDate()
    var starttimetime=formatwdate+' 23:55:00'//开始
    var getTime=texte.substring(5,10)
    timequeryShow=getTime+'日'
    $("#page-inner").mLoading("show");
    todaytime(todaydateall,starttimetime,totopstart)
    anotherCharts(textstart,textend,ostype)
}
// function onblu(){
//     var timeMM= document.getElementsByClassName('el-range-input')
//     var  texts=timeMM[0].value//开始时间
//     var  texte=timeMM[1].value//结束时间
//
// }
var ostype=0
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
var todaydateall=[]
var timequeryShow
function homedata() {
    ostype=0
    var today=new Date();
    var ty = today.getFullYear();
    var tm = today.getMonth()+1;
    var td = today.getDate();
    var gettoday=ty+'-'+tm+'-'+td;//今天
    var todayend=gettoday+' 23:55:00'//今天结束
    var defaltOneTime=gettoday+' 23:59:59'//今天结束
    var date = new Date();
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
    var defaltDuraTime=text1+' 00:00:00'//一周前
    var zeotime=new Date(date-24*3600*1000);
    var zeoy=zeotime.getFullYear();
    var zeom=zeotime.getMonth()+1;
    var zeod=zeotime.getDate();
    var zeotime_to=zeoy+'-'+zeom+'-'+zeod
    var zeotime_substart=zeotime_to+' 23:55:00'//昨天
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
            todaytime(todaydateall,zeotime_subend,zeotime_substart)
            anotherCharts(defaltDuraTime,defaltOneTime,ostype)//更新下部图表
            $("#page-inner").mLoading("hide");
		}
	});

}
//更新下部图
function anotherCharts(startTime,endTime,ostype) {
    resolution(startTime,endTime)//分辨率
    phoneBrands(startTime,endTime)//手机品牌
    osVersion(startTime,endTime,ostype)//操作系统版本
    internetCon(startTime,endTime)//网络连接
    storage(startTime,endTime);//运行内存
    cpu(startTime,endTime)//CPU
    gpu(startTime,endTime)//GPU
}

//开始时间点数据
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
//分辨率
function resolution(start,end) {
    $('#page-inner').mLoading('show')
    $.ajax({
        type: "post",
        url: "http://152.136.218.252:8123/selectScreenResolution",//接口-分辨率
        async: true,
        data: {
            startTime:start,
            endTime:end
        },
        success: function (ob) {
            resoluchart(ob)
            $('#page-inner').mLoading('hide')
        }
    });
}
function resoluchart(data) {
    var partFiveLeft = echarts.init(document.getElementById('partFourLeft'));
    var number=[]
    var range=[]
    var rate=[]
    var acount=0
    for(var i=0;i<data.data.length;i++){
        var num=data.data[i].timeCount
        var ran=data.data[i].timeNum
        acount+=parseInt(ran)
        number.push(num)
        range.push(ran)
    }
    for(var i=0;i<data.data.length;i++){
        var ra=(parseInt(data.data[i].timeNum))/acount
        var nn=(ra*100).toFixed(2)
        rate.push(nn)
    }
    var option = {
        title: {
            text: '分\n辨\n率\n',
            x: 'left',
            y: 'center',
            left:'9',
            textStyle:{
                color:'#CCC',
                fontSize:12,
                fontWeight:'normal',
            },

        },
        backgroundColor: "#363636",
        color: "#FDB467",
        tooltip: {},
        grid:{//图表距离外边框的距离
            x:'6%',
            width:'92%',
            height:'82%',
            y:'8%',
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
            data: number,
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
function phoneBrands(startTime,endTime) {
    $('#page-inner').mLoading('show')
    $.ajax({
        type: "post",
        url: "http://152.136.218.252:8123/selectBrand",//接口-手机品牌
        async: true,
        data: {
            startTime:startTime,
            endTime:endTime
            // serverId: 300,
            // startTime: text1,
            // endTime:textTime,
        },
        success: function (ob) {
            phone(ob)
            $('#page-inner').mLoading('hide')
        }
    });
}
function phone(data) {
    var partThreeRight=echarts.init(document.getElementById('partFiveRight'));
    var phoneB=[]
    var number=[]
    var rate=[]
    var acount=0
    for(var i=0;i<data.data.length;i++){
        var cate=data.data[i].timeCount
        var num=data.data[i].timeNum
        acount+=parseInt(num)
        phoneB.push(cate)//手机品牌
        number.push(num)//数量
    }
    for(var i=0;i<data.data.length;i++){
        var ra=(parseInt(data.data[i].timeNum))/acount
        var nn=(ra*100).toFixed(2)
        rate.push(nn)
    }
// Generate data
    var category = phoneB;//手机品牌
    // var dottedBase = [];
    // var lineData = [18092,24045,32808
    //     ,36097,44715,50415
    //     ,56061,59521,18092,24045,32808
    //     ,36097,44715,50415,39867,44715,48444,50415
    //     ,50061,32677,49521,32808];
    // var barData = [4600,5500,7500
    //     ,8500,12500,21500
    //     ,23200,25250,4600,5500,6500
    //     ,8500,22500,21500,9900,12500,14000,21500
    //     ,23200,24450,25250,7500];
    // var rateData = [];
    // for (var i = 0; i < 33; i++) {
    //     // var date = i+2001;
    //     // category.push(date)
    //     var rate=barData[i]/lineData[i]*100;
    //     rateData[i] = rate.toFixed(2);
    // }
// option
    var option = {
        title: {
            text: '手\n机\n品\n牌\n',
            x: 'left',
            y: 'center',
            textStyle:{
                color:'#CCC',
                fontSize:12,
                fontWeight:'normal',
            },

        },
        backgroundColor: '#363636',
        tooltip: {
            trigger: 'axis',
            backgroundColor:'rgba(255,255,255,0.1)',
            axisPointer: {
                type: 'shadow',
                label: {
                    show: true,
                    backgroundColor: '#363636'
                }
            }
        },
        legend: {//图例
            // data: ['增值税应纳税额', '一般纳税人户数','增幅',],
            textStyle: {
                color: '#ffffff'
            },
            x:'center',
            y:'bottom',
            itemWidth: 20,
            itemHeight: 8,
        },
        grid:{//图表距离外边框的距离
            x:'10%',
            right:'4%',
            width:'83%',
            height:'75%',
            bottom:'4%',
            y:'8%',
        },
        xAxis: {
            data: category,//x坐标轴刻度
            axisLabel:{
                interval: 0
            },
            axisLine: {
                lineStyle: {//坐标轴样式
                    color: '#ffffff'
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
                    color: '#ffffff',
                }
            },
            nameTextStyle: {
                color: "#ffffff"
            },
            axisLabel:{
                textStyle: {
                    color: "#ffffff"
                },
                formatter:'{value} ',
            }
        },
            {

                splitLine: {show: false},
                axisLine: {
                    lineStyle: {
                        color: '#ffffff',
                    }
                },
                axisLabel:{
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
                        color:'#FFB665'},
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
                        color:'#9665BF'
                    }
                },
                data: number
            }
        ]
    };
    partThreeRight.setOption(option);

}
//操作系统版本
function osVersion(startTime,endTime,ostype) {
    $('#page-inner').mLoading('show')
    $.ajax({
        type: "post",
        url: "http://152.136.218.252:8123/selectSystemVersion",//接口-操作系统版本
        async: true,
        data: {
            startTime:startTime,
            endTime:endTime,
            type:ostype
            // serverId: 300,
            // startTime: text1,
            // endTime:textTime,
        },
        success: function (ob) {
            version(ob)
            $('#page-inner').mLoading('hide')
        }
    });
}
function version(data){
    var partFourRight = echarts.init(document.getElementById('partFiveL'));
    var number=[]
    var range=[]
    var rate=[]
    var acount=0
    for(var i=0;i<data.data.length;i++){
        var num=data.data[i].timeCount
        var ran=data.data[i].timeNum
        acount+=parseInt(ran)
        number.push(num)
        range.push(ran)
    }
    for(var i=0;i<data.data.length;i++){
        var ra=(parseInt(data.data[i].timeNum))/acount
        var nn=(ra*100).toFixed(2)
        rate.push(nn)
    }
    var option = {
        title: {
            text: '操\n作\n系\n统\n版\n本\n',
            x: 'left',
            y: 'center',
            left:'9',
            textStyle:{
                color:'#CCC',
                fontSize:12,
                fontWeight:'normal',
            },

        },
        backgroundColor: "#363636",
        color: "#FDB467",
        tooltip: {},
        grid:{//图表距离外边框的距离
            x:'4%',
            width:'92%',
            height:'88%',
            y:'4%',
            containLabel: true
        },
        xAxis: [{
            type: "value",
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
            data: number,
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
    var partFiveRight = echarts.init(document.getElementById('partFiveR'));
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
//内存
function storage(startTime,endTime) {
    $('#page-inner').mLoading('show')
    $.ajax({
        type: "post",
        url: "http://152.136.218.252:8123/selectRunMemory",//接口-内存
        async: true,
        data: {
            startTime:startTime,
            endTime:endTime,
        },
        success: function (ob) {
            save(ob)
            $('#page-inner').mLoading('hide')
        }
    });
}
function save(data) {
    var partFourLeft = echarts.init(document.getElementById('partThreeLeft'));
    var number=[]
    var range=[]
    var rate=[]
    var acount=0
    for(var i=0;i<data.data.length;i++){
        var num=data.data[i].timeCount
        var ran=data.data[i].timeNum
        acount+=parseInt(ran)
        number.push(num)
        range.push(ran)
    }
    for(var i=0;i<data.data.length;i++){
        var ra=(parseInt(data.data[i].timeNum))/acount
        var nn=(ra*100).toFixed(2)
        rate.push(nn)
    }
    var option = {
        title: {
            text: '运\n行\n总\n内\n存\n',
            x: '10',
            y: 'center',
            textStyle:{
                color:'#CCC',
                fontSize:12,
                fontWeight:'normal',
            },

        },
        backgroundColor: "#363636",
        color: "#FDB467",
        tooltip: {},
        grid:{//图表距离外边框的距离
            x:'5%',
            width:'93%',
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
            data: number,
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
}

//CPU
function cpu(startTime,endTime) {
    var index=startTime.indexOf(' ')
    var start=startTime.substring(0,index)
    var indexte=endTime.indexOf(' ')
    var end=endTime.substring(0,indexte)
    var number=parseInt((Date.parse(end)-Date.parse(start))/(1000*60*60*24))
    var num=number+1
    $('#page-inner').mLoading('show')
    $.ajax({
        type: "post",
        url: "http://152.136.218.252:8123/selectCpuName",//接口-CPU
        async: true,
        data: {
            startTime:startTime,
            endTime:endTime,
            number:num
        },
        success: function (ob) {
            cpuchart(ob)
            $('#page-inner').mLoading('hide')
        }
    });
}
function cpuchart(data) {
    echarts.init(document.getElementById('chartCpu')).dispose();//销毁前一个实例
    var chartCpu = echarts.init(document.getElementById('chartCpu'));
    var numberzoo=[]
    var numberone=[]
    var numbertwo=[]
    var numberthree=[]
    var numberfour=[]
    var numberfive=[]
    var numbersix=[]
    var numberseven=[]
    var gpuname=[]
    var date=[]
    for(var i=0;i<data.data[0].length;i++){
        date.push(data.data[0][i].timeTime)
    }
    for(var i=0;i<data.data.length;i++){
        gpuname.push(data.data[i][0].timeCount)
    }
    for(var i=0;i<data.data[0].length;i++){
        numberzoo.push(parseInt(data.data[0][i].timeNum))
    }for(var i=0;i<data.data[1].length;i++){
        numberone.push(parseInt(data.data[1][i].timeNum))
    }for(var i=0;i<data.data[2].length;i++){
        numbertwo.push(parseInt(data.data[2][i].timeNum))
    }for(var i=0;i<data.data[3].length;i++){
        numberthree.push(parseInt(data.data[3][i].timeNum))
    }for(var i=0;i<data.data[4].length;i++){
        numberfour.push(parseInt(data.data[4][i].timeNum))
    }for(var i=0;i<data.data[5].length;i++){
        numberfive.push(parseInt(data.data[5][i].timeNum))
    }for(var i=0;i<data.data[6].length;i++){
        numbersix.push(parseInt(data.data[6][i].timeNum))
    }for(var i=0;i<data.data[7].length;i++){
        numberseven.push(parseInt(data.data[7][i].timeNum))
    }
    var serieszoo=gpuname[0]
    var seriesone=gpuname[1]
    var seriestwo=gpuname[2]
    var seriesthree=gpuname[3]
    var seriesfour=gpuname[4]
    var seriesfive=gpuname[5]
    var seriessix=gpuname[6]
    var seriestseven=gpuname[7]
    option = {
        title: {
            text: 'C\nP\nU\n',
            x: 'left',
            left:'9',
            y: 'center',
            textStyle:{
                color:'#CCC',
                fontSize:12,
                fontWeight:'normal',
            },

        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: '#57617B'
                }
            }
        },
        legend: {
            icon: 'rect',
            itemWidth: 14,
            itemHeight: 5,
            itemGap: 13,
            x:'center',
            y:'bottom',
            textStyle: {
                fontSize: 12,
                color: '#ffffff'
            }
        },
        grid: {
            left: '5%',
            width:'92%',
            height:'82%',
            bottom: '3%',
            top:"3%",
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#ffffff'
                }
            },
            data: date
        }],
        yAxis: [{
            type: 'value',
            splitLine: {show: false},//是否显示网格线
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#ffffff',
                }
            },
            axisLabel: {
                margin: 5,
                textStyle: {
                    fontSize: 12,
                    fontWeight:400
                }
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: '#363636'
                }
            }
        }],
        series: [{
            name: serieszoo,
            type: 'line',
            smooth: false,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
                normal: {
                    width: 3
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(16,97,204,.9)'
                    }, {
                        offset: 0.8,
                        color: 'rgba(16,97,204,0)'
                    }], false),
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            itemStyle: {
                normal: {
                    color: '#4C2BFE'
                },
                emphasis: {
                    color: '#4C2BFE',
                    borderColor: 'rgba(0,196,132,0.2)',
                    extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
                    borderWidth: 10,

                },
            },
            data: numberzoo
        },
            {
                name: seriesone,
                type: 'line',
                smooth: false,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 3
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(253,189,103, 0.9)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(253,189,103, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#FDB467'
                    },
                    emphasis: {
                        color: 'rgba(253,189,103)',
                        borderColor: 'rgba(0,196,132,0.2)',
                        extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
                        borderWidth: 10,

                    },
                },
                data: numberone
            },
            {
                name: seriestwo,
                type: 'line',
                smooth: false,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 3
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(253,111,13, 0.9)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(253,111,13, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#fd6f0d'
                    },
                    emphasis: {
                        color: '#fd6f0d',
                        borderColor: 'rgba(0,196,132,0.2)',
                        extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
                        borderWidth: 10,

                    },
                },
                data: numbertwo
            },
            {
                name: seriesthree,
                type: 'line',
                smooth: false,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 3
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(19,235,141, 0.9)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(19,235,141,0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#13EB8D'
                    },
                    emphasis: {
                        color: '#13EB8D',
                        borderColor: 'rgba(0,196,132,0.2)',
                        extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
                        borderWidth: 10,

                    },
                },
                data: numberthree
            },
            {
                name: seriesfour,
                type: 'line',
                smooth: false,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 3
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(255,255,255, 0.9)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(255,255,255, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#ffffff'
                    },
                    emphasis: {
                        color: '#ffffff',
                        borderColor: 'rgba(0,196,132,0.2)',
                        extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
                        borderWidth: 10,
                    },
                },
                data: numberfour
            },
            {
                name: seriesfive,
                type: 'line',
                smooth: false,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 3
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0,1, [{
                            offset: 0,
                            color: 'rgba(238,223,23, 0.9)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(238,223,23, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#EEDF17'
                    },
                    emphasis: {
                        color: '#EEDF17',
                        borderColor: 'rgba(0,196,132,0.2)',
                        extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
                        borderWidth: 10,

                    },
                },
                data: numberfive
            },
            {
                name: seriessix,
                type: 'line',
                smooth: false,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 3
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(86,144,219, 0.9)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(86,144,219, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#5690DB'
                    },
                    emphasis: {
                        color: '#5690DB',
                        borderColor: 'rgba(0,196,132,0.2)',
                        extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
                        borderWidth: 10,

                    },
                },
                data: numbersix
            },
            {
                name: seriestseven,
                type: 'line',
                smooth: false,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 3
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(228,27,21, 0.9)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(228,27,21, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#30C495'
                    },
                    emphasis: {
                        color: '#30C495',
                        borderColor: 'rgba(0,196,132,0.2)',
                        extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
                        borderWidth: 10,

                    },
                },
                data: numberseven
            },
            // {
            //     name: serieseight,
            //     type: 'line',
            //     smooth: false,
            //     symbol: 'circle',
            //     symbolSize: 5,
            //     showSymbol: false,
            //     lineStyle: {
            //         normal: {
            //             width: 3
            //         }
            //     },
            //     areaStyle: {
            //         normal: {
            //             color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            //                 offset: 0,
            //                 color: 'rgba(76,43,254, 0.9)'
            //             }, {
            //                 offset: 0.8,
            //                 color: 'rgba(76,43,254, 0)'
            //             }], false),
            //             shadowColor: 'rgba(0, 0, 0, 0.1)',
            //             shadowBlur: 10
            //         }
            //     },
            //     itemStyle: {
            //         normal: {
            //             color: 'rgba(16,97,204,1)'
            //         },
            //         emphasis: {
            //             color: 'rgba(16,97,204,1)',
            //             borderColor: 'rgba(0,196,132,0.2)',
            //             extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
            //             borderWidth: 10,
            //
            //         },
            //     },
            //     data: numbereight
            // },
            // {
            //     name: seriesnine,
            //     type: 'line',
            //     smooth: false,
            //     symbol: 'circle',
            //     symbolSize: 5,
            //     showSymbol: false,
            //     lineStyle: {
            //         normal: {
            //             width: 3
            //         }
            //     },
            //     areaStyle: {
            //         normal: {
            //             color: new echarts.graphic.LinearGradient(0, 0, 0,1, [{
            //                 offset: 0,
            //                 color: 'rgba(48,196,149, 0.9)'
            //             }, {
            //                 offset: 0.8,
            //                 color: 'rgba(48,196,149, 0)'
            //             }], false),
            //             shadowColor: 'rgba(0, 0, 0, 0.1)',
            //             shadowBlur: 10
            //         }
            //     },
            //     itemStyle: {
            //         normal: {
            //             color: '#E41BDD'
            //         },
            //         emphasis: {
            //             color: '#E41BDD',
            //             borderColor: 'rgba(0,196,132,0.2)',
            //             extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
            //             borderWidth: 10,
            //
            //         },
            //     },
            //     data: numbernine
            // },
        ]
    };
    chartCpu.setOption(option);
}
//GPU
function gpu(startTime,endTime) {
    var index=startTime.indexOf(' ')
    var start=startTime.substring(0,index)
    var indexte=endTime.indexOf(' ')
    var end=endTime.substring(0,indexte)
    var number=parseInt((Date.parse(end)-Date.parse(start))/(1000*60*60*24))
    var num=number+1
    $('#page-inner').mLoading('show')
    $.ajax({
        type: "post",
        url: "http://152.136.218.252:8123/selectGpuRender",//接口-GPU
        async: true,
        data: {
            startTime:startTime,
            endTime:endTime,
            number:num
        },
        success: function (ob) {
            gpucharts(ob)
            $('#page-inner').mLoading('hide')
        }
    });
}
function gpucharts(data) {
    echarts.init(document.getElementById('chartGPU')).dispose();//销毁前一个实例
    var chartGPU = echarts.init(document.getElementById('chartGPU'));
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
    var gpuname=[]
    var date=[]
    for(var i=0;i<data.data[0].length;i++){
        date.push(data.data[0][i].timeTime)
    }
    for(var i=0;i<data.data.length;i++){
        gpuname.push(data.data[i][0].timeCount)
    }
    for(var i=0;i<data.data[0].length;i++){
        numberzoo.push(parseInt(data.data[0][i].timeNum))
    }for(var i=0;i<data.data[1].length;i++){
        numberone.push(parseInt(data.data[1][i].timeNum))
    }for(var i=0;i<data.data[2].length;i++){
        numbertwo.push(parseInt(data.data[2][i].timeNum))
    }for(var i=0;i<data.data[3].length;i++){
        numberthree.push(parseInt(data.data[3][i].timeNum))
    }for(var i=0;i<data.data[4].length;i++){
        numberfour.push(parseInt(data.data[4][i].timeNum))
    }for(var i=0;i<data.data[5].length;i++){
        numberfive.push(parseInt(data.data[5][i].timeNum))
    }for(var i=0;i<data.data[6].length;i++){
        numbersix.push(parseInt(data.data[6][i].timeNum))
    }for(var i=0;i<data.data[7].length;i++){
        numberseven.push(parseInt(data.data[7][i].timeNum))
    }for(var i=0;i<data.data[8].length;i++){
        numbereight.push(parseInt(data.data[8][i].timeNum))
    }for(var i=0;i<data.data[9].length;i++){
        numbernine.push(parseInt(data.data[9][i].timeNum))
    }
    var serieszoo=gpuname[0]
    var seriesone=gpuname[1]
    var seriestwo=gpuname[2]
    var seriesthree=gpuname[3]
    var seriesfour=gpuname[4]
    var seriesfive=gpuname[5]
    var seriessix=gpuname[6]
    var seriestseven=gpuname[7]
    var serieseight=gpuname[8]
    var seriesnine=gpuname[9]
    option = {
        title: {
            text: 'G\nP\nU\n',
            x: 'left',
            left:'9',
            y: 'center',
            textStyle:{
                color:'#CCC',
                fontSize:12,
                fontWeight:'normal',
            },

        },
        backgroundColor: '#363636',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: '#57617B'
                }
            }
        },
        legend: {
            icon: 'rect',
            itemWidth: 14,
            itemHeight: 5,
            itemGap: 13,
            x:'center',
            y:'bottom',
            textStyle: {
                fontSize: 12,
                color: '#ffffff'
            }
        },
        grid: {
            left: '5%',
            width:'92%',
            height:'82%',
            bottom: '1%',
            top:"5%",
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#ffffff'
                }
            },
            data: date
        }],
        yAxis: [{
            type: 'value',
            splitLine: {show: false},//是否显示网格线
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#ffffff',
                }
            },
            axisLabel: {
                margin: 5,
                textStyle: {
                    fontSize: 12,
                    fontWeight:400
                }
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: '#363636'
                }
            }
        }],
        series: [{
            name: serieszoo,
            type: 'line',
            smooth: false,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
                normal: {
                    width: 3
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(16,97,204,.9)'
                    }, {
                        offset: 0.8,
                        color: 'rgba(16,97,204,0)'
                    }], false),
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            itemStyle: {
                normal: {
                    color: 'rgba(16,97,204,1)'
                },
                emphasis: {
                    color: 'rgba(16,97,204)',
                    borderColor: 'rgba(0,196,132,0.2)',
                    extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
                    borderWidth: 10,

                },
            },
            data: numberzoo
        },
            {
                name: seriesone,
                type: 'line',
                smooth: false,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 3
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(253,189,103, 0.9)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(253,189,103, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#FDB467'
                    },
                    emphasis: {
                        color: 'rgba(253,189,103)',
                        borderColor: 'rgba(0,196,132,0.2)',
                        extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
                        borderWidth: 10,

                    },
                },
                data: numberone
            },
            {
                name: seriestwo,
                type: 'line',
                smooth: false,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 3
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(253,111,13, 0.9)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(253,111,13, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#fd6f0d'
                    },
                    emphasis: {
                        color: '#fd6f0d',
                        borderColor: 'rgba(0,196,132,0.2)',
                        extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
                        borderWidth: 10,

                    },
                },
                data: numbertwo
            },
            {
                name: seriesthree,
                type: 'line',
                smooth: false,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 3
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(19,235,141, 0.9)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(19,235,141,0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#13EB8D'
                    },
                    emphasis: {
                        color: '#13EB8D',
                        borderColor: 'rgba(0,196,132,0.2)',
                        extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
                        borderWidth: 10,

                    },
                },
                data: numberthree
            },
            {
                name: seriesfour,
                type: 'line',
                smooth: false,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 3
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(255,255,255, 0.9)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(255,255,255, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#ffffff'
                    },
                    emphasis: {
                        color: '#ffffff',
                        borderColor: 'rgba(0,196,132,0.2)',
                        extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
                        borderWidth: 10,
                    },
                },
                data: numberfour
            },
            {
                name: seriesfive,
                type: 'line',
                smooth: false,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 3
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0,1, [{
                            offset: 0,
                            color: 'rgba(238,223,23, 0.9)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(238,223,23, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#EEDF17'
                    },
                    emphasis: {
                        color: '#EEDF17',
                        borderColor: 'rgba(0,196,132,0.2)',
                        extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
                        borderWidth: 10,

                    },
                },
                data: numberfive
            },
            {
                name: seriessix,
                type: 'line',
                smooth: false,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 3
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(86,144,219, 0.9)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(86,144,219, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#5690DB'
                    },
                    emphasis: {
                        color: '#5690DB',
                        borderColor: 'rgba(0,196,132,0.2)',
                        extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
                        borderWidth: 10,

                    },
                },
                data: numbersix
            },
            {
                name: seriestseven,
                type: 'line',
                smooth: false,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 3
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(228,27,21, 0.9)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(228,27,21, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#E41BDD'
                    },
                    emphasis: {
                        color: '#E41BDD',
                        borderColor: 'rgba(0,196,132,0.2)',
                        extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
                        borderWidth: 10,

                    },
                },
                data: numberseven
            },
            {
                name: serieseight,
                type: 'line',
                smooth: false,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 3
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(76,43,254, 0.9)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(76,43,254, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#4C2BFE'
                    },
                    emphasis: {
                        color: '#4C2BFE',
                        borderColor: 'rgba(0,196,132,0.2)',
                        extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
                        borderWidth: 10,

                    },
                },
                data: numbereight
            },
            {
                name: seriesnine,
                type: 'line',
                smooth: false,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 3
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0,1, [{
                            offset: 0,
                            color: 'rgba(48,196,149, 0.9)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(48,196,149, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#30C495'
                    },
                    emphasis: {
                        color: '#30C495',
                        borderColor: 'rgba(0,196,132,0.2)',
                        extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
                        borderWidth: 10,

                    },
                },
                data: numbernine
            },
            //     {
            //     name: '最低温度',
            //     type: 'line',
            //     smooth: false,
            //     symbol: 'circle',
            //     symbolSize: 5,
            //     showSymbol: false,
            //     lineStyle: {
            //         normal: {
            //             width: 3
            //         }
            //     },
            //     areaStyle: {
            //         normal: {
            //             color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            //                 offset: 0,
            //                 color: 'rgba(205,52,42, 0.5)'
            //             }, {
            //                 offset: 0.8,
            //                 color: 'rgba(235,235,21, 0)'
            //             }], false),
            //             shadowColor: 'rgba(0, 0, 0, 0.1)',
            //             shadowBlur: 10
            //         },
            //     },
            //     itemStyle: {
            //         normal: {
            //
            //             color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
            //                 offset: 0,
            //                 color: 'rgba(205,52,42,1)'
            //             }, {
            //                 offset: 1,
            //                 color: 'rgba(235,235,21,1)'
            //             }])
            //         },
            //         emphasis: {
            //             color: 'rgb(99,250,235)',
            //             borderColor: 'rgba(99,250,235,0.2)',
            //             extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
            //             borderWidth: 10
            //         }
            //     },
            //     data: [25, 22, 26, 28, 27, 26, 23]
            // }
        ]
    };
    chartGPU.setOption(option);
}
//启动时间点图表单独查询
// function querytime(value) {
//     clearInterval(countDownAll);
//     countDown()
//     var endtimetime=value+' 23:54:59'//结束
//     var date = new Date(endtimetime.replace(/-/g, '/'));
//     var thisthis =Date.parse(date)
//     var to_to=new Date(thisthis-24*3600*1000)
//     var formatwdate = to_to.getFullYear()+'-'+(to_to.getMonth()+1)+'-'+to_to.getDate()
//     var starttimetime=formatwdate+' 23:55:00'//开始
//     var getTime=value.substring(5,10)
//     timequeryShow=getTime+'日'
//     $("#page-inner").mLoading("show");
//     $.ajax({
//         type: "post",
//         url: "http://152.136.218.252:8123/selectStartTime",//启动时间点
//         async: true,
//         data: {
//             startTime:starttimetime,
//             endTime:endtimetime
//         },
//         success: function (ob) {
//             startTime(todaydateall,ob);//启动时间点
//             $("#page-inner").mLoading("hide");
//         }
//     });
// }
// function querydurationTime(valuestart,valueend) {
//     clearInterval(countDownAll);
//     countDown()
//     var  textst=valuestart//开始时间
//     var  texten=valueend//结束时间
//     var starttime=textst+' 00:00:00'//开始
//     var endtime=texten+' 23:59:59'//结束
//     anotherCharts(starttime,endtime)
// }