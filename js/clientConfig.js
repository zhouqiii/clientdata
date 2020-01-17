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
            var  texts=timeMM[2].value//开始时间
            var  texte=timeMM[3].value//结束时间
            var textstart=texts+' 00:00:00'
            var textend=texte+' 23:59:59'
            dataBottom(textstart,textend)
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
var ostype=0
//change()
function onblu(){
    clearInterval(countDownAll);
    countDown()
    var timeMM= document.getElementsByClassName('el-range-input')
    var  texts=timeMM[2].value//开始时间
    var  texte=timeMM[3].value//结束时间
    var textstart=texts+' 00:00:00'
    var textend=texte+' 23:59:59'
    $('#partFiveLeft').css('display','none')
    $('#partThreeRight').css('display','none')
    $('#partFourRight').css('display','none')
    $('#partFourLeft').css('display','none')
    $('.gpu').css('display','none')
    $('.cpu').css('display','none')
    $('#loadfen').css('display','block')
    $('#loadphone').css('display','block')
    $('#loadver').css('display','block')
    $('#loadsave').css('display','block')
    $('#loadcpu').css('display','block')
    $('#loadgpu').css('display','block')
    dataBottom(textstart,textend)

}
function onbludevice() {
    var timeMM= document.getElementsByClassName('el-range-input')
    var  texts=timeMM[0].value//开始时间
    var  texte=timeMM[1].value//结束时间
    var textstart=texts+' 00:00:00'
    var textend=texte+' 23:59:59'
    $('.chart_top').css('display','none')
    $('#loaddevice').css('display','block')
    devicenumber(textstart,textend)
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
				buttonWidth: '80%',
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
function homedata() {
    var ostype=0
    var date = new Date();
    var now=new Date(date)
    var lastday= new Date();
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
    var formatwdate = y+'-'+m+'-'+d;//7天前
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
    var defaltDuraTime=text1+' 00:00:00'//一周前
    $('.chart_top').css('display','none')
    $('#partFiveLeft').css('display','none')
    $('#partThreeRight').css('display','none')
    $('#partFourRight').css('display','none')
    $('#partFourLeft').css('display','none')
    $('.gpu').css('display','none')
    $('.cpu').css('display','none')
    $('#loaddevice').css('display','block')
    $('#loadfen').css('display','block')
    $('#loadphone').css('display','block')
    $('#loadver').css('display','block')
    $('#loadsave').css('display','block')
    $('#loadcpu').css('display','block')
    $('#loadgpu').css('display','block')
    countDown()
    devicenumber(defaltDuraTime,defaltOneTime)
    dataBottom(defaltDuraTime,defaltOneTime)


}
function devicenumber(strat,end) {
    $.ajax({
        type: "post",
        url: "http://152.136.218.252:9100/frontEnd/selectNumOfPeople",//接口-设备总数
        async: true,
        data: {
            startTime:strat,
            endTime:end
        },
        success: function (ob) {
            if(ob.state===false){
                alert('设备总数查询错误')
            }
            deviceCharts(ob)
            deviceTable(ob)
        }
    });
}
function dataBottom(defaltDuraTime,defaltOneTime) {
    var index=defaltDuraTime.indexOf(' ')
    var start=defaltDuraTime.substring(0,index)
    var indexte=defaltOneTime.indexOf(' ')
    var end=defaltOneTime.substring(0,indexte)
    var number=parseInt((Date.parse(end)-Date.parse(start))/(1000*60*60*24))
    var num=number+1
    $.ajax({
        type: "post",
        url: "http://152.136.218.252:9100/frontEnd/selectConfiguration",//接口-手机品牌
        async: true,
        data: {
            startTime:defaltDuraTime,
            endTime:defaltOneTime
        },
        success: function (ob) {
            if(ob.state===false){
                alert('查询错误')
            }
            anotherCharts(ob,num)
        }
    });
}
//更新下部图
function anotherCharts(data,num) {
    phone(data)
    version(data)
    resoluchart(data)
    save(data)
    cpuchart(data,num)
    gpucharts(data,num)
}
//设备总数数据
function deviceCharts(data) {
    $('#loaddevice').css('display','none')
    $('.chart_top').css('display','block')
    var chart=null
    var arr = [];
    var arr4 = [];
    for (var i = 0; i < data.data.length; i++) {
        var someDate = data.data[i].timedate;
        var rq = parseInt(data.data[i].count)
        arr.push(rq)
        arr4.push(someDate)
    }
    chart = Highcharts.chart('chartDvice', {
        chart: {
            reflow: true,
            type: 'line',
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
            tickInterval: 0,
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
            name:'设备总数',
            data: arr,
            lineWidth: 2,
            color:"#AF611C",
            symbolWidth:35,
            symbol:'circle',
        }
        ],
    });
}
function deviceTable(data) {
    $("#real-datatableStart").bootstrapTable('destroy');
    $("#real-tbodyStart").empty();
    for (var i = 0; i < data.data.length; i++) {
        $("#real-tbodyStart").append(
            "<tr><td>" + data.data[i].timedate +
            "</td><td>" + data.data[i].count +
            "</td></tr>"
        )
    };
}

// //手机品牌
function phoneBrands(startTime,endTime) {
    $.ajax({
        type: "post",
        url: "http://152.136.218.252:9100/selectBrand",//接口-手机品牌
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
                alert('手机品牌查询错误')
            }
            phone(ob)
            $(document.body).mLoading("hide")
        }
    });
}
function phone(data) {
    var partThreeRight=echarts.init(document.getElementById('partThreeRight'));
    var phoneB=[]
    var number=[]
    var rate=[]
    var brand=[]
    var acount=0
    var len=data.data.brand.length
    if(len>10){
        data.data.brand=data.data.brand.slice(0,10)
    }
    for(var i=0;i<data.data.brand.length;i++){
        var cate=data.data.brand[i].property
        var num=data.data.brand[i].count
        acount+=parseInt(num)
        phoneB.push(cate)//手机品牌
        number.push(num)//数量
    }
    for(var i=0;i<data.data.brand.length;i++){
        if(acount===0){
            rate.push('0.00')
        }
        var ra=(parseInt(data.data.brand[i].count))/acount
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
            x:'8%',
            right:'4%',
            width:'84%',
            height:'74%',
            bottom:'2%',
            y:'15%',
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
function osVersion(startTime,endTime,ostype) {

    $.ajax({
        type: "post",
        url: "http://152.136.218.252:9100/selectSystemVersion",//接口-操作系统版本
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
            if(ob.state===false){
                alert('操作系统版本查询错误')
            }
            version(ob)

        }
    });
}
function version(data){
    var partFourRight = echarts.init(document.getElementById('partFourRight'));
    var number=[]
    var range=[]
    var rate=[]
    var acount=0
    for(var i=0;i<data.data.os.length;i++){
        var num=data.data.os[i].property
        var ran=data.data.os[i].count
        acount+=parseInt(ran)
        number.push(num)
        range.push(ran)
    }
    for(var i=0;i<data.data.os.length;i++){
        if(acount===0){
            rate.push('0.00')
        }
        var ra=(parseInt(data.data.os[i].count))/acount
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
                console.log(params)
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
            x:'2.5%',
            width:'95.5%',
            height:'81%',
            y:'12.5%',
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
                    color: "#333333"
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
//分辨率
function resolution(start,end) {
    $.ajax({
        type: "post",
        url: "http://152.136.218.252:9100/selectScreenResolution",//接口-分辨率
        async: true,
        data: {
            startTime:start,
            endTime:end
        },
        success: function (ob) {
            if(ob.state===false){
                alert('分辨率查询错误')
            }
            resoluchart(ob)

        }
    });
}
function resoluchart(data) {
    var partFiveLeft = echarts.init(document.getElementById('partFiveLeft'));
    var number=[]
    var range=[]
    var rate=[]
    var acount=0
    for(var i=0;i<data.data.resolution.length;i++){
        var num=data.data.resolution[i].property
        var ran=data.data.resolution[i].count
        acount+=parseInt(ran)
        number.push(num)
        range.push(ran)
    }
    for(var i=0;i<data.data.resolution.length;i++){
        if(acount===0){
            rate.push('0.00')
        }
        var ra=(parseInt(data.data.resolution[i].count))/acount
        var nn=(ra*100).toFixed(2)
        rate.push(nn)
    }
    var option = {
        title: {
            text: '分辨率',
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
//内存
function storage(startTime,endTime) {

    $.ajax({
        type: "post",
        url: "http://152.136.218.252:9100/selectRunMemory",//接口-内存
        async: true,
        data: {
            startTime:startTime,
            endTime:endTime,
        },
        success: function (ob) {
            if(ob.state===false){
                alert('内存查询错误')
            }
            save(ob)

        }
    });
}
function save(data) {

    var partFourLeft = echarts.init(document.getElementById('partFourLeft'));
    var number=[]
    var range=[]
    var rate=[]
    var acount=0
    for(var i=0;i<data.data.memory.length;i++){
        var num=data.data.memory[i].property
        var ran=data.data.memory[i].count
        acount+=parseInt(ran)
        number.push(num)
        range.push(ran)
    }
    for(var i=0;i<data.data.memory.length;i++){
        if(acount===0){
            rate.push('0.00')
        }
        var ra=(parseInt(data.data.memory[i].count))/acount
        var nn=(ra*100).toFixed(2)
        rate.push(nn)
    }
    var option = {
        title: {
            text: '设备总内存大小',
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
                    +'<span style="margin-left:10px;color:#fff;font-size:14px;">'+params.name+'G:'+'</span>'+'<span style="color:#ffffff;margin:0 6px;">'+params.data+'人'+'</span>'+'</div>';
                return tipHtml;
            }
        },
        grid:{//图表距离外边框的距离
            x:'3%',
            width:'95%',
            height:'82%',
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
                    color: "#333333"
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
}
//CPU
function cpu(startTime,endTime) {
    var index=startTime.indexOf(' ')
    var start=startTime.substring(0,index)
    var indexte=endTime.indexOf(' ')
    var end=endTime.substring(0,indexte)
    var number=parseInt((Date.parse(end)-Date.parse(start))/(1000*60*60*24))
    var num=number+1

    $.ajax({
        type: "post",
        url: "http://152.136.218.252:9100/selectCpuName",//接口-CPU
        async: true,
        data: {
            startTime:startTime,
            endTime:endTime,
            number:num
        },
        success: function (ob) {
            if(ob.state===false){
                alert('CPU查询错误')
            }
            cpuchart(ob,num)

        }
    });
}
function cpuchart(data,num) {
    echarts.init(document.getElementById('chartCpu')).dispose();//销毁前一个实例
    var chartCpu = echarts.init(document.getElementById('chartCpu'));
    vm_clientConfig.cpulist=[]
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
    if(data.data.cpu[0]){
        for(var i=0;i<data.data.cpu[0].length;i++){
            date.push(data.data.cpu[0][i].times)
        }
    }else{
        for(var i=0;i<num;i++){
            date.push('')
        }
    }
    if(data.data.cpu.length!==0){
        for(var i=0;i<data.data.cpu.length;i++){
            gpuname.push(data.data.cpu[i][0].type)
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
    if(data.data.cpu[0]){
        for(var i=0;i<data.data.cpu[0].length;i++){
            numberzoo.push(parseInt(data.data.cpu[0][i].number))
        }
    }else{
        for(var i=0;i<date.length;i++){
            numberzoo.push(0)
        }
    }
    if(data.data.cpu[1]){
        for(var i=0;i<data.data.cpu[1].length;i++){
            numberone.push(parseInt(data.data.cpu[1][i].number))
        }
    }else{
        for(var i=0;i<date.length;i++){
            numberone.push(0)
        }
    }
    if(data.data.cpu[2]){
        for(var i=0;i<data.data.cpu[2].length;i++){
            numbertwo.push(parseInt(data.data.cpu[2][i].number))
        }
    }else{
        for(var i=0;i<date.length;i++){
            numbertwo.push(0)
        }
    }
    if(data.data.cpu[3]){
        for(var i=0;i<data.data.cpu[3].length;i++){
            numberthree.push(parseInt(data.data.cpu[3][i].number))
        }
    }else{
        for(var i=0;i<date.length;i++){
            numberthree.push(0)
        }
    }
    if(data.data.cpu[4]){
        for(var i=0;i<data.data.cpu[4].length;i++){
            numberfour.push(parseInt(data.data.cpu[4][i].number))
        }
    }else{
        for(var i=0;i<date.length;i++){
            numberfour.push(0)
        }
    }
    if(data.data.cpu[5]){
        for(var i=0;i<data.data.cpu[5].length;i++){
            numberfive.push(parseInt(data.data.cpu[5][i].number))
        }
    }else{
        for(var i=0;i<date.length;i++){
            numberfive.push(0)
        }
    }
    if(data.data.cpu[6]){
        for(var i=0;i<data.data.cpu[6].length;i++){
            numbersix.push(parseInt(data.data.cpu[6][i].number))
        }
    }else{
        for(var i=0;i<date.length;i++){
            numbersix.push(0)
        }
    }
    if(data.data.cpu[7]){
        for(var i=0;i<data.data.cpu[7].length;i++){
            numberseven.push(parseInt(data.data.cpu[7][i].number))
        }
    }else{
        for(var i=0;i<date.length;i++){
            numberseven.push(0)
        }
    }
    if(data.data.cpu[8]){
        for(var i=0;i<data.data.cpu[8].length;i++){
            numbereight.push(parseInt(data.data.cpu[8][i].number))
        }
    }else{
        for(var i=0;i<date.length;i++){
            numbereight.push(0)
        }
    }
    if(data.data.cpu[9]){
        for(var i=0;i<data.data.cpu[9].length;i++){
            numbernine.push(parseInt(data.data.cpu[9][i].number))
        }
    }else{
        for(var i=0;i<date.length;i++){
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
    console.log(numberzoo,numberone,numbertwo,numberthree,numberfour,numberfive,numbersix,numberseven,numbereight,numbernine)
var number=[numon,numtw,numth,numfo,numfi,numsi,numse,numei,numni,numte]
    console.log(number)
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
    for(var i=0;i<10;i++){
        var obj={}
        obj.name=gpuname[i]
        if(accountall===0){
            percentData.push('0.00')
            obj.percent='0.00%'
        }
        obj.percent=((number[i]/accountall)*100).toFixed(2)+'%'
        percentData.push(((number[i]/accountall)*100).toFixed(2))
        cpu_List.push(obj)
    }
    vm_clientConfig.cpulist=cpu_List
    expCpu(gpuname,percentData)
    console.log(accountall,number)
    // console.log(serieszoo,seriesone,seriestwo,seriesthree,seriesfour,seriesfive,seriessix,seriesseven,serieseight,seriesnine)
    // console.log(numberzoo,numberone,numbertwo,numberthree,numberfour,numberfive,numbersix,numberseven,numbereight,numbernine)
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
function expCpu(name,percent) {
    $("#real-datatableCPU").bootstrapTable('destroy')
    $("#real-tbodyCPU").empty();
    for (var i = 0; i < name.length; i++) {
        var date=name[i]
        var rq = percent[i]
        $("#real-tbodyCPU").append(
            "<tr><td>" + date +
            "</td><td>" + rq +
            "</td></tr>"
        )
    }
}
//GPU
function gpu(startTime,endTime) {
    var index=startTime.indexOf(' ')
    var start=startTime.substring(0,index)
    var indexte=endTime.indexOf(' ')
    var end=endTime.substring(0,indexte)
    var number=parseInt((Date.parse(end)-Date.parse(start))/(1000*60*60*24))
    var num=number+1

    $.ajax({
        type: "post",
        url: "http://152.136.218.252:9100/selectGpuRender",//接口-GPU
        async: true,
        data: {
            startTime:startTime,
            endTime:endTime,
            number:num
        },
        success: function (ob) {
            if(ob.state===false){
                alert('GPU查询错误')
            }
            gpucharts(ob,num)
        }
    });
}
function gpucharts(data,num) {
    $('#loadfen').css('display','none')
    $('#loadphone').css('display','none')
    $('#loadver').css('display','none')
    $('#loadsave').css('display','none')
    $('#loadcpu').css('display','none')
    $('#loadgpu').css('display','none')
    $('#partFiveLeft').css('display','block')
    $('#partThreeRight').css('display','block')
    $('#partFourRight').css('display','block')
    $('#partFourLeft').css('display','block')
    $('.cpu').css('display','block')
    $('.gpu').css('display','block')
    echarts.init(document.getElementById('chartGPU')).dispose();//销毁前一个实例
    var chartGPU = echarts.init(document.getElementById('chartGPU'));
    vm_clientConfig.gpulist=[]
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
    if(data.data.gpu[0]){
        for(var i=0;i<data.data.gpu[0].length;i++){
            date.push(data.data.gpu[0][i].times)
        }
    }else{
        for(var i=0;i<num;i++){
            date.push('')
        }
    }
    if(data.data.gpu.length!==0){
        for(var i=0;i<data.data.gpu.length;i++){
            gpuname.push(data.data.gpu[i][0].type)
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
    if(data.data.gpu[0]){
        for(var i=0;i<data.data.gpu[0].length;i++){
            numberzoo.push(parseInt(data.data.gpu[0][i].number))
        }
    }else{
        for(var i=0;i<date.length;i++){
            numberzoo.push(0)
        }
    }
    if(data.data.gpu[1]){
        for(var i=0;i<data.data.gpu[1].length;i++){
            numberone.push(parseInt(data.data.gpu[1][i].number))
        }
    }else{
        for(var i=0;i<date.length;i++){
            numberone.push(0)
        }
    }
    if(data.data.gpu[2]){
        for(var i=0;i<data.data.gpu[2].length;i++){
            numbertwo.push(parseInt(data.data.gpu[2][i].number))
        }
    }else{
        for(var i=0;i<date.length;i++){
            numbertwo.push(0)
        }
    }
    if(data.data.gpu[3]){
        for(var i=0;i<data.data.gpu[3].length;i++){
            numberthree.push(parseInt(data.data.gpu[3][i].number))
        }
    }else{
        for(var i=0;i<date.length;i++){
            numberthree.push(0)
        }
    }
    if(data.data.gpu[4]){
        for(var i=0;i<data.data.gpu[4].length;i++){
            numberfour.push(parseInt(data.data.gpu[4][i].number))
        }
    }else{
        for(var i=0;i<date.length;i++){
            numberfour.push(0)
        }
    }
    if(data.data.gpu[5]){
        for(var i=0;i<data.data.gpu[5].length;i++){
            numberfive.push(parseInt(data.data.gpu[5][i].number))
        }
    }else{
        for(var i=0;i<date.length;i++){
            numberfive.push(0)
        }
    }
    if(data.data.gpu[6]){
        for(var i=0;i<data.data.gpu[6].length;i++){
            numbersix.push(parseInt(data.data.gpu[6][i].number))
        }
    }else{
        for(var i=0;i<date.length;i++){
            numbersix.push(0)
        }
    }
    if(data.data.gpu[7]){
        for(var i=0;i<data.data.gpu[7].length;i++){
            numberseven.push(parseInt(data.data.gpu[7][i].number))
        }
    }else{
        for(var i=0;i<date.length;i++){
            numberseven.push(0)
        }
    }
    if(data.data.gpu[8]){
        for(var i=0;i<data.data.gpu[8].length;i++){
            numbereight.push(parseInt(data.data.gpu[8][i].number))
        }
    }else{
        for(var i=0;i<date.length;i++){
            numbereight.push(0)
        }
    }
    if(data.data.gpu[9]){
        for(var i=0;i<data.data.gpu[9].length;i++){
            numbernine.push(parseInt(data.data.gpu[9][i].number))
        }
    }else{
        for(var i=0;i<date.length;i++){
            numbernine.push(0)
        }
    }
    for(var i=0;i<num;i++){
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
    for(var i=0;i<10;i++){
        var obj={}
        obj.name=gpuname[i]
        if(accountall===0){
            percentData.push('0.00')
            obj.percent='0.00%'
        }
        obj.percent=((number[i]/accountall)*100).toFixed(2)+'%'
        percentData.push(((number[i]/accountall)*100).toFixed(2))
        cpu_List.push(obj)
    }
    vm_clientConfig.gpulist=cpu_List
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
            "<tr><td>" + date +
            "</td><td>" + rq +
            "</td></tr>"
        )
    }
}
window.onresize = function(){
    chartCpu.resize();
    chartGPU.resize();
    partFourLeft.resize();
    partFiveLeft.resize();
    partFourRight.resize();
    partThreeRight.resize();
}
