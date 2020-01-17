

homedata()
function load() {
    $(".right").mLoading("show");
}
function onblu(){
    $("#real-datatableAll").bootstrapTable('destroy');
    $('#div-one').css('display','none')
    $('#real-datatableAll').css('display','none')
    $('#loadchart').css('display','block')
    $('#loadtable').css('display','block')
    var timeMM= document.getElementsByClassName('el-range-input')
    var  texts=timeMM[0].value
    var  texte=timeMM[1].value
    var serverSub= $("#district").val(); //区服
    if (serverSub != null) {
        serverSub = serverSub.join(",");
    }
    $.ajax({
        type: "post",
        // url: "../queryHomeDate.action",
        url:"http://192.168.0.116:9100/frontEnd/queryRetain",
        async: true,
        data: {
            serverId: serverSub,
            startTime: texts,
            endTime:texte
        },
        success: function (ob) {
            AddUser(ob);
            tableRetain(ob)
            retentionTable(ob,serverSub,texts,texte)
        }
    });
}
function homedata() {
    $('#div-one').css('display','none')
    $('#real-datatableAll').css('display','none')
    $('#loadchart').css('display','block')
    $('#loadtable').css('display','block')
    var text5 = $("#district").val(); //区服
    var time
    var text1
    var textTime
    // var aa=vm.ruleForm.dateValue
    var date = new Date();
    var now=new Date(date-24*3600*1000)
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
    var formatwdate = y+'-'+m+'-'+d;
    var yn = now.getFullYear();
    var mn = now.getMonth()+1;
    var dn = now.getDate();
    if(mn<10){
        mn='0'+mn
    }
    if(dn<10){
        dn='0'+dn
    }
    var formatwdateNow = yn+'-'+mn+'-'+dn;
    text1=formatwdate
    textTime=formatwdateNow//晚
    if (text5 != null) {
        text5 = text5.join(",");
    }
    $('#district').css('display','block')
    $.ajax({
        type: "post",
        url: "http://152.136.218.252:9100/frontEnd/queryAreas",
        async: false,
        data: {
            startTime:text1,
            endTime:textTime,
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
        }
    });
    $.ajax({
        type: "post",
        url: "http://152.136.218.252:9100/frontEnd/queryRetain",
        async: true,
        data: {
            serverId: text5,
            startTime: text1,
            endTime:textTime
        },
        success: function (ob) {
            AddUser(ob);
            tableRetain(ob)
            retentionTable(ob,text5,text1,textTime)
        }
    });
}
function retentionTable(ob,text5,text1,textTime) {
    $('#loadtable').css('display','none')
    $('#real-datatableAll').css('display','block')
    var t = $("#real-datatableAll").bootstrapTable({
        // url: 'http://192.168.0.116:9100/frontEnd/queryRetain',
        method: 'post',
        dataType: "json",
        data:ob.data,
        // height:360,
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
        sidePagination: "client", //服务端处理分页
        queryParams: function(params) { //自定义参数，这里的参数是传给后台的，我这是是分页用的
            return { //这里的params是table提供的
                serverId: text5,
                startTime: text1,
                endTime:textTime,
                pageIndex: params.pageNumber,//从数据库第几条记录开始
                pageSize: params.pageSize,//找多少条
            };
        },
        responseHandler:function(res){
            return {
                'rows':res.data,
                'total':res.count
            }
        },
        idField: "logId", //指定主键列
        columns: [
            {
                title: '日期',
                field: 'timedate',
                align: 'center',
                width: 160,
                // formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
                //     var index=row.timedate.indexOf(' ')
                    // return row.timedate.substring(0,index)
                // }
            },
            {
                title: '新增注册',
                field: 'dailyRegister',
                align: 'center',
                width: 140
            },
            {
                title: '新增活跃',
                field: 'newPlayers',
                align: 'center',
                width: 140
            },
            // {
            //     title: '付费账号数',
            //     field: 'newRecharge',
            //     align: 'center',
            //     width: 90
            // },

            {
                title: '付费总金额',
                field: 'payAmount',
                align: 'center',
                width: 140
            },
            {
                title: 'DAU',
                field: 'activeNumber',
                align: 'center',
                width: 140
            },
            {
                title: 'PCU',
                field: 'maxOnlineNumber',
                align: 'center',
                width: 140
            },
            {
                title: '次留(%)',
                field: 'dayRetain',
                align: 'center',
                width: 140,
                formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
                    //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
                    var nub=0;
                    if(row.dayAccountCount===0)
                    {
                        nub = "0.00"
                        return nub;
                    }
                    nub = (row.dayRetain/row.dayAccountCount).toFixed(4);
                    return (nub * 100).toFixed(2);
                }
            },
            {
                title: '3留(%)',
                field: 'threeRetain',
                align: 'center',
                width: 140,
                formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
                    //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
                    var nub=0;
                    if(row.threeAccountCount==0)
                    {
                        nub = "0.00"
                        return nub;
                    }
                    nub = (row.threeRetain/row.threeAccountCount).toFixed(4);
                    return (nub * 100).toFixed(2);
                }
            },
            // {
            //     title: '4日留存(%)',
            //     field: 'fourRetain',
            //     align: 'center',
            //     width: 50,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.fourAccountCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.fourRetain/row.fourAccountCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },
            // {
            //     title: '5日留存(%)',
            //     field: 'fiveRetain',
            //     align: 'center',
            //     width: 50,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.fiveAccountCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.fiveRetain/row.fiveAccountCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },
            // {
            //     title: '6日留存(%)',
            //     field: 'sixRetain',
            //     align: 'center',
            //     width: 50,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.sixAccountCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.sixRetain/row.sixAccountCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },
            {
                title: '7留(%)',
                field: 'weekRetain',
                align: 'center',
                width: 140,
                formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
                    //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
                    var nub=0;
                    if(row.weekAccountCount==0)
                    {
                        nub = "0.00"
                        return nub;
                    }
                    nub = (row.weekRetain/row.weekAccountCount).toFixed(4);
                    return (nub * 100).toFixed(2);
                }
            },
            // {
            //     title: '8日留存(%)',
            //     field: 'eightRetain',
            //     align: 'center',
            //     width: 50,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.eightAccountCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.eightRetain/row.eightAccountCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },{
            //     title: '9日留存(%)',
            //     field: 'nineRetain',
            //     align: 'center',
            //     width: 50,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.nineAccountCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.nineRetain/row.nineAccountCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },{
            //     title: '10日留存(%)',
            //     field: 'tenRetain',
            //     align: 'center',
            //     width: 50,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.tenAccountCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.tenRetain/row.tenAccountCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },{
            //     title: '11日留存(%)',
            //     field: 'elevenRetain',
            //     align: 'center',
            //     width: 50,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.elevenAccountCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.elevenRetain/row.elevenAccountCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },
            // {
            //     title: '12日留存(%)',
            //     field: 'twelveRetain',
            //     align: 'center',
            //     width: 50,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.twelveAccountCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.twelveRetain/row.twelveAccountCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },
            // {
            //     title: '13日留存(%)',
            //     field: 'thirteenRetain',
            //     align: 'center',
            //     width: 50,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.thirteenAccountCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.thirteenRetain/row.thirteenAccountCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },
            {
                title: '14留(%)',
                field: 'fourteenRetain',
                align: 'center',
                width: 140,
                formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
                    //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
                    var nub=0;
                    if(row.fourteenAccountCount==0)
                    {
                        nub = "0.00"
                        return nub;
                    }
                    nub = (row.fourteenRetain/row.fourteenAccountCount).toFixed(4);
                    return (nub * 100).toFixed(2);
                }
            },
            // {
            //     title: '15日留存(%)',
            //     field: 'fifteenRetain',
            //     align: 'center',
            //     width: 50,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.fifteenRetainCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.fifteenRetain/row.fifteenRetainCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },
            // {
            //     title: '16日留存(%)',
            //     field: 'sixteenRetain',
            //     align: 'center',
            //     width: 50,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.sixteenRetainCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.sixteenRetain/row.sixteenRetainCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },{
            //     title: '17日留存(%)',
            //     field: 'seventeenRetain',
            //     align: 'center',
            //     width: 50,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.seventeenRetainCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.seventeenRetain/row.seventeenRetainCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },{
            //     title: '18日留存(%)',
            //     field: 'eighteenRetain',
            //     align: 'center',
            //     width: 50,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.eighteenRetainCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.eighteenRetain/row.eighteenRetainCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },{
            //     title: '19日留存(%)',
            //     field: 'nineteenRetain',
            //     align: 'center',
            //     width: 50,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.nineteenRetainCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.nineteenRetain/row.nineteenRetainCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },{
            //     title: '20日留存(%)',
            //     field: 'twentyRetain',
            //     align: 'center',
            //     width: 50,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.twentyRetainCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.twentyRetain/row.twentyRetainCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },{
            //     title: '21日留存(%)',
            //     field: 'twentyOneRetain',
            //     align: 'center',
            //     width: 50,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.twentyOneRetainCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.twentyOneRetain/row.twentyOneRetainCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },
            // {
            //     title: '22日留存(%)',
            //     field: 'twentyTwoRetain',
            //     align: 'center',
            //     width: 50,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.twentyTwoRetainCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.twentyTwoRetain/row.twentyTwoRetainCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },
            // {
            //     title: '23日留存(%)',
            //     field: 'twentyThreeRetain',
            //     align: 'center',
            //     width: 50,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.twentyThreeRetainCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.twentyThreeRetain/row.twentyThreeRetainCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },
            // {
            //     title: '24日留存(%)',
            //     field: 'twentyFourRetain',
            //     align: 'center',
            //     width: 50,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.twentyFourRetainCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.twentyFourRetain/row.twentyFourRetainCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },
            // {
            //     title: '25日留存(%)',
            //     field: 'twentyFiveRetain',
            //     align: 'center',
            //     width: 50,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.twentyFiveRetainCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.twentyFiveRetain/row.twentyFiveRetainCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },
            // {
            //     title: '26日留存(%)',
            //     field: 'twentySixRetain',
            //     align: 'center',
            //     width: 50,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.twentySixRetainCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.twentySixRetain/row.twentySixRetainCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },{
            //     title: '27日留存(%)',
            //     field: 'twentySevenRetain',
            //     align: 'center',
            //     width: 50,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.twentySevenRetainCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.twentySevenRetain/row.twentySevenRetainCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },{
            //     title: '28日留存(%)',
            //     field: 'twentyEightRetain',
            //     align: 'center',
            //     width: 50,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.twentyEightRetainCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.twentyEightRetain/row.twentyEightRetainCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },{
            //     title: '29日留存(%)',
            //     field: 'twentyNineRetain',
            //     align: 'center',
            //     width: 50,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.twentyNineRetainCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.twentyNineRetain/row.twentyNineRetainCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },
            {
                title: '30留(%)',
                field: 'thirtyRetain',
                align: 'center',
                width: 140,
                formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
                    //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
                    var nub=0;
                    if(row.thirtyAccountCount==0)
                    {
                        nub = "0.00"
                        return nub;
                    }
                    nub = (row.thirtyRetain/row.thirtyAccountCount).toFixed(4);
                    return (nub * 100).toFixed(2);
                }
            },
            // {
            //     title: '45日留存(%)',
            //     field: 'fortyfiveRetain',
            //     align: 'center',
            //     width: 100,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.fortyfiveRetainCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.fortyfiveRetain/row.fortyfiveRetainCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },
            {
                title: '60留(%)',
                field: 'sixtyRetain',
                align: 'center',
                width: 140,
                formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
                    //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
                    var nub=0;
                    if(row.sixtyAccountCount==0)
                    {
                        nub = "0.00"
                        return nub;
                    }
                    nub = (row.sixtyRetain/row.sixtyAccountCount).toFixed(4);
                    return (nub * 100).toFixed(2);
                }
            },
            // {
            //     title: '90日留存(%)',
            //     field: 'ninetyRetain',
            //     align: 'center',
            //     width: 100,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.ninetyRetainCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.ninetyRetain/row.ninetyRetainCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },{
            //     title: '120日留存(%)',
            //     field: 'onehatwentyRetain',
            //     align: 'center',
            //     width: 120,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.onehatwentyRetainCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.onehatwentyRetain/row.onehatwentyRetainCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },{
            //     title: '150日留存(%)',
            //     field: 'onehafiftyRetain',
            //     align: 'center',
            //     width: 120,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.onehafiftyRetainCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.onehafiftyRetain/row.onehafiftyRetainCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },{
            //     title: '180日留存(%)',
            //     field: 'onehaeightRetain',
            //     align: 'center',
            //     width: 120,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.onehaeightRetainCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.onehaeightRetain/row.onehaeightRetainCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // },{
            //     title: '360日留存(%)',
            //     field: 'oneYearRetain',
            //     align: 'center',
            //     width: 120,
            //     formatter: function (value, row, index) {//自定义显示，这三个参数分别是：value该行的属性，row该行记录，index该行下标
            //         //row.dayRetain = Math.floor(row.dayRetain/25 * 100) / 100
            //         var nub=0;
            //         if(row.oneYearRetainCount==0)
            //         {
            //             nub = "0"
            //             return nub;
            //         }
            //         nub = (row.oneYearRetain/row.oneYearRetainCount).toFixed(2);
            //         return Math.floor(nub * 100);
            //     }
            // }
        ]
    });
    t.on('load-success.bs.table', function(data) { //table加载成功后的监听函数
        $("#page-wrapper").mLoading("hide");
    });
}
//留存图形
function tableRetain(data) {
    $("#real-datatableT").bootstrapTable('destroy')
    $("#real-tbodyT").empty();
    for (var i = data.data.length-1; i >= 0; i--) {
        $("#real-tbodyT").append(
            "<tr><td>" + data.data[i].timedate +
            "</td><td>" + (Math.floor(data.data[i].dayRetain * 100) / 100) +
            "</td><td>" + (Math.floor(data.data[i].threeRetain * 100) / 100) +
            "</td><td>"+(Math.floor(data.data[i].weekRetain * 100) / 100)+"</td></tr>"
        )
    }
}
function AddUser(data) {
    $('#loadchart').css('display','none')
    $('#div-one').css('display','block')
    var chart=null
    var arr5 = [];
    var arr6 = [];
    var arr15 = [];
    var arr10 = [];
    for (var i = data.data.length-1; i >= 0; i--) {
        var someDate = data.data[i].timedate
        var tm = Math.floor(data.data[i].dayRetain * 100) / 100;
        var rq = Math.floor(data.data[i].threeRetain * 100) / 100;
        var we = Math.floor(data.data[i].weekRetain * 100) / 100;
        arr5.push(tm)
        arr6.push(rq)
        arr15.push(we)
        arr10.push(someDate)
    }
    chart = Highcharts.chart('div-one', {
        chart: {
            height:280,
            type: 'spline',
            marginLeft:35,
            backgroundColor: {
                stops: [
                    [0, 'rgb(54, 54, 54)']
                ]
            },
        },
        title: {
            text:' ',
            // align: 'center',
            // verticalAlign: 'middle',
            // x:-10,
            // y: -60,
            // useHTML:true,
            // style: {
            //     color: '#999999',
            //     fontWeight:'400',
            //     fontSize:'12',
            // }
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
            lineWidth:1,
            lineColor:'#333333',
            tickColor:'#333333',
            gridLineWidth: .5,
            gridLineColor:'#202020',
            gridLineDashStyle:"Dash",
            tickmarkPlacement:'on',
            type: 'datetime',
            categories: arr10,
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
            valueSuffix: '%',
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
            // useHTML: true,
            // headerFormat: '<span style="font-size:12px">{point.key}</span><br />',
        },
        yAxis: {
            title: {
                text: ''
            },
            lineWidth:1,
            lineColor:'#333333',
            gridLineColor:'#333333',
            labels: {
                format: '{value}',
                style: {
                    color: '#999999',

                }
            },
            valueSuffix: '%'
        },
        legend: {
            // align: 'center', //水平方向位置
            // verticalAlign: 'bott', //垂直方向位置
            // right:30,
            // y: -30, //距离Y轴的距离
            itemStyle: {
                color: '#999999',
            },
            itemHoverStyle: {
                color: '#999999'
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
            color:"#10CFBD",
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
            color:"#CF10A2",
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
            color:"#999999",
            tooltip:{
                //             formatter:function() {
                //     return (this.value*100).toFixed(2)
                // },
                valueSuffix: '%'
            }
        }],
    });
}
