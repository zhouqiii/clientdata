layui.use('layer', function() {
    var layer = layui.layer;
    //自定义事件
    $('#selfBtn').click(function () {
        document.getElementById('pageName').value=""
        $('#selfChangeBtn').css('background','#52C93C')
        $(this).css('background','#999999')
        layer.open({
            type: 1,
            area: ['820px', '530px'],
            title: false,
            btn:['保存',"取消"],
            shadeClose :true,
            shade :0,
            content: $("#customize"),
            closeBtn: 1,
            yes: function(index, layero) {
                var interfaceName=document.getElementById('pageName').value//自定义事件名
                if(interfaceName===''||interfaceName===undefined||interfaceName===null){
                    alert('修改名称不能为空')
                    return false
                }
                var eventName = $("#eventName").val(); //事件
                if (eventName != null) {
                    eventName = eventName.join(",");
                }
                layer.close(index)
                $('#selfBtn').css('background','#10C7B6')
                $.ajax({
                    type: "post",
                    url: "http://152.136.218.252:9100/saveCustomEvent",
                    async: false,
                    data:{
                        customName:interfaceName,
                        eventIdGroup:eventName,
                    },
                    success: function (data) {
                       if(data.state===true){
                           layer.msg('保存成功')
                           eventNameGetRefrash()
                       }
                        else{
                           layer.msg('保存失败')
                       }
                    }
                });
            },
            btn2:function (index) {
                layer.close(index)
                $('#selfBtn').css('background','#10C7B6')
            },
            cancel: function(index, layero){
                layer.close(index)
                $('#selfBtn').css('background','#10C7B6')
            }
        })
        var btn=document.getElementsByClassName('layui-layer-ico')
        btn[0].classList.remove('layui-layer-close')
        btn[0].classList.remove('layui-layer-close2')
        var quit=document.createElement("i")
        quit.setAttribute('class','el-icon-close')
        var pare=document.getElementsByClassName('layui-layer-setwin')
        pare[0].appendChild(quit)
    })
    //修改自定义事件
    $('#selfChangeBtn').click(function () {
        document.getElementById('modifyName').value=""
        $('#selfBtn').css('background','#10C7B6')
        $(this).css('background','#999999')
        changeEvent()
        layer.open({
            type: 1,
            area: ['820px', '540px'],
            title: false,
            btn:['保存',"取消"],
            shadeClose :true,
            shade :0,
            content: $("#modifyCustomize"),
            closeBtn: 1,
            yes: function(index, layero) {
                var eventname=document.getElementById('modifyName').value//自定义事件名
                if(eventname===''||eventname===undefined||eventname===null){
                    alert('修改名称不能为空')
                    return false
                }
                var modEventName = $("#modEventName").val(); //事件id
                if (modEventName != null) {
                    modEventName = modEventName.join(",");
                }
                var cusEventAll = $("#cusEvent").val(); //事件
                var index=cusEventAll.indexOf('-')
                var idtype = cusEventAll.substring(0,index);
                layer.close(index)
                $('#selfChangeBtn').css('background','#52C93C')
                $.ajax({
                    type: "post",
                    url: "http://152.136.218.252:9100/updateCustomEvent",
                    async: false,
                    data:{
                        customName:eventname,
                        eventIdGroup:modEventName,
                        id:idtype,
                    },
                    success: function (data) {
                        if(data.state===true){
                            layer.msg('保存成功')
                            eventNameGetRefrash()
                            eventList(globalId)
                        }
                        else{
                            layer.msg('保存失败')
                        }
                    }
                });
            },
            btn2:function (index) {
                layer.close(index)
                $('#selfChangeBtn').css('background','#52C93C')
            },
            cancel: function(index, layero){
                layer.close(index)
                $('#selfChangeBtn').css('background','#52C93C')
            }
        })
        var btn=document.getElementsByClassName('layui-layer-ico')
        btn[0].classList.remove('layui-layer-close')
        btn[0].classList.remove('layui-layer-close2')
        var quit=document.createElement("i")
        quit.setAttribute('class','el-icon-close')
        var pare=document.getElementsByClassName('layui-layer-setwin')
        pare[0].appendChild(quit)
    })

})
//定义一个全局变量，用来在页面查询时传当前事件id
var globalId
function homedate(){
    change()
    eventNameGet()
    // initTable()
}
function change() {
   $('#district').css('display','block')
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
        }
    });
    $.ajax({
        type: "get",
        url: "http://152.136.218.252:9100/selectAllEventList",
        async: false,
        success: function (obj) {
            //给自定义事件赋值
            for (var i = 0; i < obj.data.length; i++) {
                $("#eventName").append("<option value='" + obj.data[i].id + "'>" + obj.data[i].eventName + "</option>");
            }
            $("#eventName").each(function () {
                $(this).find("option").attr("selected", "selected")
            })
            $('#eventName').multiselect("destroy").multiselect({
                buttonWidth: '68.5%',
                nonSelectedText: '请选择',
                maxHeight: 220,
                numberDisplayed: 1,
                includeSelectAllOption: true,
                selectAllText: '全选/全不选', //全选按钮显示的文本
                nSelectedText: '项被选中',
                allSelectedText: '已选中所有事件',
            });

        }
    });

}
var modOptionfir
//全部事件
function allEventData() {
    var timeMM= vm_analysis.ruleForm.dateValue
    var  startT=timeMM[0]//开始时间
    var  endT=timeMM[1]//结束时间
    var datatable=[]
    $.ajax({
        type: "post",
        url: "http://152.136.218.252:9100/selectCustomEvent",
        async: false,
        data:{
            startTime:startT,
            endTime:endT,
        },
        success: function (data) {
            if(data.data)
                for(var i=0;i<data.data.length;i++){
                    var obj={}
                    obj.eventId=data.data[i].eventId
                    obj.eventTypeName=data.data[i].eventTypeName
                    obj.eventName=data.data[i].eventName
                    obj.eventTimes=data.data[i].achieveNum
                    datatable.push(obj)
                }
            initTable(datatable)
            expTable(datatable)
        }
    });
}
//修改自定义事件
function changeEvent(){
    $.ajax({
        type: "get",
        url: "http://152.136.218.252:9100/selectCustomEventList",
        async: false,
        success: function (obj) {
            $("#cusEvent option").remove();
            for (var i = 0; i < obj.data.length; i++) {
                $("#cusEvent").append("<option  value='" + obj.data[i].id +"-"+obj.data[i].customName+ "'>" + obj.data[i].customName + "</option>");
            }
            changeEventList(obj.data[0].id)
            $("#cusEvent").find('option:eq(0)').prop('selected', true);
            document.getElementById('modifyName').value=obj.data[0].customName
            $('#cusEvent').multiselect("destroy").multiselect({
                buttonWidth: '68.2%',
                nonSelectedText: '请选择',
                maxHeight: 220,
                numberDisplayed: 1,
                includeSelectAllOption: true,
                selectAllText: '全选/全不选', //全选按钮显示的文本
                nSelectedText: '项被选中',
                allSelectedText: '已选中所有事件',
            });
        }
    });

}
$("#cusEvent").change(function() {
    var cusEventAll = $("#cusEvent").val(); //事件
    var index=cusEventAll.indexOf('-')
    var cusEvent = cusEventAll.substring(0,index);
    document.getElementById('modifyName').value=cusEventAll.substring(index+1)
    changeEventList(cusEvent)
});
//修改自定义事件里选择不同的自定义事件改变对应的事件列表
function changeEventList(idtype) {
    var timeMM= vm_analysis.ruleForm.dateValue
    var  startT=timeMM[0]//开始时间
    var  endT=timeMM[1]//结束时间
    var array=[]
    var arrayAno=[]
    $.ajax({
        type: "post",
        url: "http://152.136.218.252:9100/selectCustomEvent",
        async: false,
        data:{
            type:idtype,
            startTime:startT,
            endTime:endT,
        },
        success: function (obj) {
            for(var i=0;i<obj.data.length;i++){
                array.push(obj.data[i].eventId)
            }
        }
    });
    $.ajax({
        type: "get",
        url: "http://152.136.218.252:9100/selectAllEventList",
        async: false,
        success: function (obj) {
            for(var i=0;i<obj.data.length;i++){
                for(var j=0; j<array.length;j++){
                    if(parseInt(array[j])===obj.data[i].id){
                        arrayAno.push(i)
                    }
                }
            }
            $("#modEventName option").remove();
            for (var i = 0; i < obj.data.length; i++) {
                $("#modEventName").append("<option value='" + obj.data[i].id + "'>" + obj.data[i].eventName + "</option>");
            }
            for(var i=0;i<arrayAno.length;i++){
                var index= arrayAno[i]
                $("#modEventName").find('option:eq('+index+')').prop('selected', true);
            }
            $('#modEventName').multiselect("destroy").multiselect({
                buttonWidth: '68.5%',
                nonSelectedText: '请选择',
                maxHeight: 220,
                numberDisplayed: 1,
                includeSelectAllOption: true,
                selectAllText: '全选/全不选', //全选按钮显示的文本
                nSelectedText: '项被选中',
                allSelectedText: '已选中所有事件',
            });
        }
    });
}
//事件名刷新
function eventNameGetRefrash() {
    vm_analysis.eventNameList=[]
    var defaultId
    $.ajax({
        type: "get",
        url: "http://152.136.218.252:9100/selectCustomEventList",
        async: false,
        success: function (data) {
            if(data.data)
                defaultId=data.data[0].id
            for(var i=0;i<data.data.length;i++){
                var obj={}
                obj.name=data.data[i].customName
                obj.id=data.data[i].id
                vm_analysis.eventNameList.push(obj)
            }
        }
    });
}
//获取事件名
function eventNameGet() {
    vm_analysis.eventNameList=[]
    var defaultId
    $.ajax({
        type: "get",
        url: "http://152.136.218.252:9100/selectCustomEventList",
        async: false,
        success: function (data) {
            if(data.data)
                defaultId=data.data[0].id
                for(var i=0;i<data.data.length;i++){
                    var obj={}
                    obj.name=data.data[i].customName
                    obj.id=data.data[i].id
                    vm_analysis.eventNameList.push(obj)
                }
        }
    });
    eventList(defaultId)
}
//事件名对应的事件表格
function eventList(id) {
    globalId=id
    var timeMM= vm_analysis.ruleForm.dateValue
    var  startT=timeMM[0]//开始时间
    var  endT=timeMM[1]//结束时间
    var idtype=id
    var datatable=[]
    $.ajax({
        type: "post",
        url: "http://152.136.218.252:9100/selectCustomEvent",
        async: false,
        data:{
            type:idtype,
            startTime:startT,
            endTime:endT,
        },
        success: function (data) {
           if(data.data)
               for(var i=0;i<data.data.length;i++){
                   var obj={}
                   obj.eventId=data.data[i].eventId
                   obj.eventTypeName=data.data[i].eventTypeName
                   obj.eventName=data.data[i].eventName
                   obj.eventTimes=data.data[i].achieveNum
                   datatable.push(obj)
               }
            initTable(datatable)
            expTable(datatable)
        }
    });

}
//自定义的展开事件
function detailFormatter(index, row) {
    var obj=document.getElementById('chartShow')
    if(obj){
        obj.removeAttribute("id")
    }
    var htmlcon=''
    htmlcon='<div style="width: 100%;height: 300px;border-top: 3px solid #292929;border-bottom: 3px solid #292929" id="chartShow" class="chartClass"></div>'
    chartRequest(row.eventId)
    return htmlcon
}
//事件table列表
function chartRequest(param) {
    var timeMM= vm_analysis.ruleForm.dateValue
    var  startT=timeMM[0]//开始时间
    var  endT=timeMM[1]//结束时间
    $.ajax({
        type: "post",
        url: "http://152.136.218.252:9100/selectEventByEventId",
        async: true,
        data: {
            type: param,
            startTime: startT,
            endTime:endT
        },
        success: function (ob) {
            chartShow(ob)
        }
    });
}
//回调事件highcharts图
function chartShow(data) {
    var chart=null
    var arr = [];
    var arr4 = [];
    for (var i = 0; i < data.data.length; i++) {
        var someDate=data.data[i].logDate
        var rq = data.data[i].achieveNum
        arr.push(rq)
        arr4.push(someDate)
    }
    chart = Highcharts.chart('chartShow', {
        chart: {
            marginLeft:100,
            marginRight:80,
            marginTop:10,
            type: 'spline',
            height:'300px',
            backgroundColor: {
                stops: [
                    [0, 'rgb(54, 54, 54)']
                ]
            },
        },
        title: {
            text:'事<br />件<br />数<br />',
            align: 'left',
            verticalAlign: 'middle',
            x:10,
            y: -60,
            useHTML:true,
            style: {
                color: '#999999',
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
            lineWidth:1,
            lineColor:'#707070',
            tickColor:'#707070',
            gridLineWidth: .5,
            gridLineColor:'#363636',
            gridLineDashStyle:"Dash",
            tickmarkPlacement:'on',
            type: 'datetime',
            categories: arr4,
            labels: {
                style: {
                    color: '#999999'
                }
            }
        },
        tooltip: {
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
                text: ''
            },
            lineWidth:1,
            lineColor:'#707070',
            gridLineColor:'#707070',
            labels: {
                format: '{value}',
                style: {
                    color: '#999999',

                }
            }
        },
        legend: {
            enabled:false,
        },
        plotOptions: {
            series: {
                // fillColor: {
                //     linearGradient: [0, 0, 0, 150],
                //     stops: [
                //         [0, Highcharts.getOptions().colors[0]],
                //         [.5, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                //     ]
                // },
                lineWidth: 2,
                color:"#10C7B6",
            }
        },
        series: [{
            id: 'exSeries',
            name: '事件数',
            data: arr,
            marker: { lineColor: '#10C7B6' },
        }],
    });
}
//事件列表导出
function expTable(data) {
    $("#tableEvent").bootstrapTable('destroy')
    $("#bodyEvent").empty();
    for (var i = 0; i <data.length; i++) {
        var id=data[i].eventTypeName
        var name=data[i].eventName
        var times=data[i].eventTimes
        $("#bodyEvent").append(
            "<tr><td>" + id +
        "</td><td>" + name+
        "</td><td>" + times +
            "</td></tr>"
        )
    }
}
//查询
function queryBtn() {
    eventList(globalId)
}
//搜索
function searchEvent() {
    var timeMM= vm_analysis.ruleForm.dateValue
    var  startT=timeMM[0]//开始时间
    var  endT=timeMM[1]//结束时间
    var searchId=document.getElementById('inputContent').value
    var datatable=[]
    $.ajax({
        type: "post",
        url: "http://152.136.218.252:9100/selectCustomEvent",//改变接口
        async: false,
        data:{
            condition:searchId,
            startTime:startT,
            endTime:endT,
        },
        success: function (data) {
            if(data.data)
                for(var i=0;i<data.data.length;i++){
                    var obj={}
                    obj.eventId=data.data[i].eventId
                    obj.eventTypeName=data.data[i].eventTypeName
                    obj.eventName=data.data[i].eventName
                    obj.eventTimes=data.data[i].achieveNum
                    datatable.push(obj)
                }
            initTable(datatable)
            expTable(datatable)
        }
    });
}
//清空
function onclear() {
document.getElementById('inputContent').value=''
}
//删除事件主
function deleteEvent(id){
    var idParam=id
    $.ajax({
        type: "post",
        url: "http://152.136.218.252:9100/deleteCustomEvent",
        async: false,
        data:{
            id:idParam
        },
        success: function (data) {
            if(data.state===true){
                alert("删除成功")
                eventNameGet()
                vm_analysis.clickname=0
            }else{
                alert("删除失败")
                return false
            }
        }
    });
}
