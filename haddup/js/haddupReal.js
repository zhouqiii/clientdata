

function load() {
    $(".right").mLoading("show");
}
function onblu(){
    $("#real-datatableAll").bootstrapTable('destroy');
    $('#real-datatableAll').css('display','none')
    $('.titleLoadAdd').css('display','block')
    var timeMM= document.getElementsByClassName('el-range-input')
    var  texts=timeMM[0].value
    var  texte=timeMM[1].value
    var serverSub= $("#district").val(); //区服
    if (serverSub != null) {
        serverSub = serverSub.join(",");
    }
    var text6 = $('#channel').val();//渠道号
    if (text6 != null) {
        text6 = text6.join(",");
    }
    AddUser(text6,serverSub,texts,texte)
}

homedata()
function homedata() {
    $('#real-datatableAll').css('display','none')
    $('.titleLoadAdd').css('display','block')
    var text5 = $("#district").val(); //区服
    var time
    var text1
    var textTime
    // var aa=vm.ruleForm.dateValue
    var date = new Date();
    var now=new Date(date)
    var lastday= new Date(date-24*3600*1000);
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
    var formatwdateNow = yn+'-'+mn+'-'+dn;//昨天
    text1=formatwdate
    textTime=formatwdateNow//晚
    if (text5 != null) {
        text5 = text5.join(",");
    }

    change(text1,textTime)
}
function change(texts,texte) {
    //渠道号查询
    $.ajax({
        type: "post",
        url:"http://152.136.218.252:9100/frontEnd/queryChannels",
        async: true,
        data: {
        },
        success: function (obj) {
            for (var i = 0; i < obj.data.length; i++) {
                $("#channel").append("<option value='" + obj.data[i].flag + "'>" + obj.data[i].name + "</option>");
            }
            $("#channel").each(function () {
                $(this).find("option").attr("selected", "selected")
            })
            $('#channel').multiselect("destroy").multiselect({
                buttonWidth: '80%',
                nonSelectedText: '请选择',
                maxHeight: 200,
                numberDisplayed: 1,
                includeSelectAllOption: true,
                selectAllText: '全选/全不选', //全选按钮显示的文本
                nSelectedText: '项被选中',
                allSelectedText: '已选中所有渠道号',
            });
        }
    });
    $('#districtNext').css('display','block')
    $.ajax({
        type: "post",
        // url: "../queryAreas.action",
        url:"http://152.136.218.252:9100/frontEnd/queryAreas",
        async: true,
        data: {
            startTime:texts,
            endTime:texte,
        },
        success: function (obj) {
            for (var i = 0; i < obj.data.length; i++) {
                $("#district").append("<option value='" + obj.data[i].flag + "'>" + obj.data[i].name + "</option>");
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
            var text5 = $("#district").val(); //区服
            if (text5 != null) {
                text5 = text5.join(",");
            }
            var text6 = $('#channel').val();//渠道号
            if (text6 != null) {
                text6 = text6.join(",");
            }
            AddUser(text6,text5,texts,texte);
        }
    });
}
function retentionTable(channel,server,start,end) {
    $('.titleLoadAdd').css('display','none')
    $('#real-datatableAll').css('display','block')
    var t = $("#real-datatableAll").bootstrapTable({
        // url: '../queryDaily.action',
        url:'http://152.136.218.252:9100/frontEnd/queryDaily',
        method: 'post',
        dataType: "json",
        contentType: "application/x-www-form-urlencoded", //post请求的话就加上这个句话
        queryParamsType: "",
        striped: true, //设置为 true 会有隔行变色效果
        undefinedText: "0", //当数据为 undefined 时显示的字符
        pagination: true, //分页
        paginationLoop: false,
        // paginationLoop:true,//设置为 true 启用分页条无限循环的功能。
        showToggle: false, //是否显示 切换试图（table/card）按钮
        // showColumns: "true", //是否显示 内容列下拉框
        pageNumber: 1, //如果设置了分页，首页页码
        // showPaginationSwitch:true,//是否显示 数据条数选择框
        pageSize: 30, //如果设置了分页，页面数据条数
        pageList: [10, 30, 50,'All'], //如果设置了分页，设置可供选择的页面数据条数。设置为All 则显示所有记录。
        paginationPreText: '‹', //指定分页条中上一页按钮的图标或文字,这里是<
        paginationNextText: '›', //指定分页条中下一页按钮的图标或文字,这里是>
        // singleSelect: false,//设置True 将禁止多选
        search: false, //显示搜索框
        data_local: "zh-US", //表格汉化
        // sortable: true,      //是否启用排序
        // sortOrder: "desc",     //排序方式
        sidePagination: "server", //客户端处理分页
        queryParams: function(params) { //自定义参数，这里的参数是传给后台的，我这是是分页用的
            return { //这里的params是table提供的
                pageIndex: params.pageNumber,//从数据库第几条记录开始
                pageSize: params.pageSize,//找多少条
                serverId: server,
                startTime: start,
                endTime:end,
                channelId:channel
            };
        },
        responseHandler:function(res){
            // var arr=[];
            // for(var i=res.data.length-1;i>=0;i--){
            //     arr.push(res.data[i])
            // }
            return {
                'rows':res.data,
                'total':res.count
            }
        },
        idField: "logId", //指定主键列
        columns: [
            {
                title: '日期',//区服号
                field: 'timedate',//json数据中rows数组中的属性名
                width:130,
                align: 'center',//水平居中
                formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
                    var html =('<span>'+row.timedate.substr(0,10)+'</span>');
                    return html;
                }
            },
            {
                title: '注册人数',
                width:100,
                field: 'dailyRegister',
                align: 'center'
            },
            {
                title: '首登人数',
                field: 'newPlayers',
                width:100,
                align: 'center',
            },
            {
                title: '活跃人数',
                field: 'activeNumber',
                width:100,
                align: 'center'
            },
            {
                title: '付费总额',
                field: 'payAmount',
                width:95,
                align: 'center'
            },
            {
                title: '付费总人数',
                field: 'payNumber',
                width:105,
                align: 'center'
            },
            {
                title: '付费率(%)',
                field: 'rate',
                width:105,
                align: 'center'
            },
            {
                title: 'ARPU',
                field: 'arpu',
                width:90,
                align: 'center'
            },
            {
                title: 'ARPPU',
                field: 'arppu',
                width:90,
                align: 'center'
            },
            {
                title: '次留(%)',
                field: 'dayRetain',
                align: 'center',
                width:110,
                formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
                    //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
                    var nub=0;
                    if(row.dayRetainCount==0)
                    {
                        nub = "0"
                        return nub;
                    }
                    nub = (row.dayRetain/row.dayAccountCount);
                    if(isNaN(nub) || nub == "NaN"){
                        nub = "0.00";
                    }
                    return (nub * 100).toFixed(2);
                    // return Math.floor(nub * 100);
                }
            },
            {
                title: '3留(%)',
                field: 'threeRetain',
                align: 'center',
                width:110,
                formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
                    //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
                    var nub=0;
                    if(row.threeRetainCount==0)
                    {
                        nub = "0"
                        return nub;
                    }
                    nub = (row.threeRetain/row.threeAccountCount);
                    if(isNaN(nub) || nub == "NaN"){
                        nub = "0.00";
                    };
                    return (nub * 100).toFixed(2);
                    // return Math.floor(nub * 100);
                }
            },
            {
                title: '7留(%)',
                field: 'weekRetain',
                align: 'center',
                width:110,
                formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
                    //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
                    var nub=0;
                    if(row.weekRetainCount==0)
                    {
                        nub = "0"
                        return nub;
                    }
                    nub = (row.weekRetain/row.weekAccountCount);
                    if(isNaN(nub) || nub == "NaN"){
                        nub = "0.00";
                    };
                    // return nub;
                    return (nub * 100).toFixed(2);
                }
            },
            {
                title: '最高在线人数',
                field: 'maxOnlineNumber',
                align: 'center',
                width:115
            },
            // {
            //     title: '平均游戏次数',
            //     field: 'aveGamenumber',
            //     align: 'center',
            //     width:105
            // },
            // {
            //     title: '游戏次数',
            //     field: 'gameNumber',
            //     width:100,
            //     align: 'center'
            // },
            {
                title: '首付总额',
                field: 'fristAmount',
                width:110,
                align: 'center'
            },
            {
                title: '首付总人数',
                field: 'fristNumber',
                width:120,
                align: 'center'
            },
        ],
    });
    t.on('load-success.bs.table', function(data) { //table加载成功后的监听函数
        $(".page-wrapper").mLoading("hide");
    });
}
//数据
function AddUser(channel,server,start,end) {
    retentionTable(channel,server,start,end)
}
function chartDaily(data) {
    var chart=null
    var arr5 = [];
    var arr6 = [];
    var arr15 = [];
    var arr10 = [];
    for (var i = 0; i < data.data[2].length; i++) {
        var someDate = data.data[2][i].logTime.substring(0, data.data[2][i].logTime.indexOf(' '))
        var tm = Math.floor(data.data[2][i].dayRetain * 100) / 100;
        var rq = Math.floor(data.data[2][i].threeRetain * 100) / 100;
        var we = Math.floor(data.data[2][i].weekRetain * 100) / 100;
        arr5.push(tm)
        arr6.push(rq)
        arr15.push(we)
        arr10.push(someDate)
    }
    chart = Highcharts.chart('div-one', {
        chart: {
            height:310,
            type: 'spline',
            backgroundColor: {
                stops: [
                    [0, 'rgb(54, 54, 54)']
                ]
            },
        },
        title: {
            text: '留存分析',
            style:{
                color:'#ffffff',
                fontSize:16,
                fontWeight:'400',
            },
        },
        credits: {
            enabled: false // 禁用版权信息
        },
        exporting: {
            enabled:false,//默认为可用，当设置为false时，图表的打印及导出功能失效
            filename:'注册数据',//导出的文件名
        },
        xAxis: {
            plotLines:[{
                color:'white',            //线的颜色
                dashStyle:'longdashdot',//标示线的样式，默认是solid（实线），这里定义为长虚线
                value:this,                //定义在哪个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                width:1                 //标示线的宽度，2px
            }],
            gridLineWidth: .5,
            gridLineColor:'#363636',
            gridLineDashStyle:"Dash",
            tickmarkPlacement:'on',
            type: 'datetime',
            categories: arr10,
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
                color: '#ffffff',
                dashStyle: 'Dash'
            },
            valueSuffix: '%'
            // backgroundColor: '#1B1B1B',   // 背景颜色
            //    borderColor: '#1B1B1B',         // 边框颜色
            //    borderRadius: 2,             // 边框圆角
            //    opacity:'.6',
            //    // useHTML: true,
            //    style: {                      // 文字内容相关样式
            //        color: "#ffffff",
            // 	opacity:'.7',
            //        fontSize: "14px",
            //    },
        },
        yAxis: {
            title: {
                text: ''
            },
            gridLineColor:'#707070',
            labels: {
                format: '{value}',
                style: {
                    color: 'rgb(218,213,213)',

                }
            },
            valueSuffix: '%'
        },
        legend: {
            // align: 'center', //水平方向位置
            // verticalAlign: 'top', //垂直方向位置
            // // x: 50, //距离x轴的距离
            // y: -30, //距离Y轴的距离
            itemStyle: {
                color: '#c0c0c0',
            },
            itemHoverStyle: {
                color: '#fff'
            }
        },
        plotOptions: {
            series: {
                lineWidth: 2,
                color:"#ffb665"
            }
        },
        series: [{
            id: 'exSeries',
            name: '次日留存',
            data: arr5,
            lineWidth: 2,
            color:"#4AA3E5",
            tooltip:{
                //             formatter:function() {
                //     return (this.value*100).toFixed(2)
                // },
                valueSuffix: '%'
            }
        },{
            name: '3日留存',
            data: arr6,
            lineWidth: 2,
            color:"#FFB665",
            tooltip:{
                //             formatter:function() {
                //     return (this.value*100).toFixed(2)
                // },
                valueSuffix: '%'
            }
        },{
            name: '7日留存',
            data: arr15,
            lineWidth: 2,
            color:"#AB32C2",
            tooltip:{
                //             formatter:function() {
                //     return (this.value*100).toFixed(2)
                // },
                valueSuffix: '%'
            }
        }],
    });
}
