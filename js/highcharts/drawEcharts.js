var myDIdx = 0;
var drawEcharts = {
		showZoom : false,
		showMgk : false,
		savePng : false,
		rotateNum : 28,
		myAllCharts : [],
		solveData : function(idx,chartflag,ajaxdata,showlen){
			var obj = $(".drawInfo:eq("+idx+")"),online = obj.attr("isonline"),isonline = false;
			if(typeof online!="undefined" && online=='1'){
				isonline = true;
			}
			if(typeof obj.attr("_echarts_instance_")!='undefined'){
				this.unBindClick(obj);
				obj.removeAttr("_echarts_instance_");
			}
			var name = ajaxdata.name,key = ajaxdata.key,data = ajaxdata.val,chartType;
			for(var i=0;i<data.length;i++){
				var temp = data[i];
				for(var j=0;j<temp.length;j++){
					if(temp[j]==null ||(isonline&&temp[j]==0)){
						data[i][j] = "-";
					}else{
						data[i][j] = com.fixedStr(temp[j]);
					}
				}
			}
			myDIdx = idx;
			if(chartflag==1)
			{//线图
				this.lineCharts(idx, name, key, data);
			}
			else if(chartflag==11)
			{//线图+百分比线图（双Y）
				this.lineCharts(idx, name, key, data,{"lenidx":"-1"});
			}
			else if(chartflag==12)
			{//线图（没有X）
				//this.lineChartsNox(idx, name, key, data);
			}
			else if(chartflag==13)
			{//区域图
				this.lineCharts(idx, name, key, data,{"areatype":true});
			}
			else if(chartflag==14)
			{//堆积面积图
				this.lineCharts(idx, name, key, data,{"areatype":true,"stack":true});
			}
			else if(chartflag==2)
			{//柱图
				this.lineCharts(idx, name, key, data,{"chartType":"bar"});
			}
			else if(chartflag==21)
			{//柱图+百分比线图（双Y）
				this.lineCharts(idx, name, key, data,{"chartType":"bar","lenidx":"-1"});
			}
			else if(chartflag==22)
			{//柱图+百分比线图（双Y）右Y刻度为0-1
				this.lineCharts(idx, name, key, data,{"chartType":"bar","lenidx":"-1","rate":true});
			}
			else if(chartflag==3)
			{//柱图--横向
				this.barCharts(idx, name, key, data);
			}
			else if(chartflag==5)
			{//堆积柱图+线图
				this.lineAndBar(idx, name, key, data);
			}
			else if(chartflag==51)
			{//堆积柱图
				this.lineAndBar(idx, name, key, data,{"lenidx":null});
			}
			else if(chartflag==52)
			{//多柱柱图+线图
				this.lineAndBar(idx, name, key, data,{"stack":false});
			}
			else if(chartflag==53)
			{//多柱柱图+线图+最后一条线为虚线
				this.lineAndBar(idx, name, key, data,{"stack":false,"linestyle":true});
			}
			else if(chartflag==54)
			{//多柱柱图+线图+只显示最后一条线
				this.lineAndBar(idx, name, key, data,{"lenidx":showlen});
			}
			else if(chartflag==55)
			{//多柱堆积柱图+线图+只显示最后一条线
				this.lineAndBar(idx, name, key, data,{"lenidx":showlen,"linestyle":true});
			}
			else if(chartflag==56)
			{//多柱堆积柱图+一条线
				this.lineAndBar(idx, name, key, data,{"lenidx":name.length-2,"linestyle":true});
			}
			else if(chartflag==6)
			{//饼图
				this.pieCharts(idx, name, key, data);
			}
			
			var listnum = 9;
			if(typeof obj.attr("listnum")!='undefined'){
				listnum = parseInt(obj.attr("listnum"));
			}
			if (typeof obj.attr("nolist") == 'undefined'
					|| obj.attr("nolist") == '') {
				DrawCharts.dataToTable(obj, key, ajaxdata.column, name, data,listnum);
			}
		},
		lineCharts : function(idx,name,key,data,param){ //线图、柱图
//			key = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
			var seriesData = [],nlen = name.length,jsonparam = {"lenidx":nlen-1,"chartType":"line","areatype":false,"rate":false,"stack":false},cflag=1;
			if(typeof param !='undefined'){
				for(var k in param){
					jsonparam[k] = param[k];
				}
			}
			var chartType = jsonparam.chartType;
			var ySecond = {
		            type : 'value',
		            splitLine:{
		            	show:false
		            }
		        };
			if(jsonparam.rate){
				ySecond.min = 0;
				ySecond.max = 1;
				ySecond.scale = false;
				ySecond.splitNumber = 5;
			}
			if(jsonparam.lenidx == "-1"){
				slen = nlen-2;
			}else{
				slen = jsonparam.lenidx;
			}
			if(key.length>0){
				for(var i=0;i<nlen;i++){
					var temp = {};
					temp.name = name[i];
					if(i>slen){
						temp.type = "line";
						temp.yAxisIndex = 1;
					}else{
						temp.type = chartType;
					}
					if(temp.type == "bar"){
						temp.barMaxWidth = 18;
						temp.barGap = 0;
						cflag=2;
					}
					if(temp.type == "line"){
						if(jsonparam.areatype){
//							temp.smooth = true;
							temp.itemStyle = {normal: {areaStyle: {type: 'default'}}};
						}
						if(jsonparam.stack){
							temp.stack = "aaa";
						}
					}
					temp.data = data[i];
					seriesData[i] = temp;
				}
			}
			var option = {
					backgroundColor : "#f7f8f9",
				    tooltip : {
				        trigger: 'axis',
				        textStyle: {
				        	align:"left"
				        }
				    },
				    legend: {
				        data:name
				    },
				    toolbox: {
				        show : true,
				        orient: 'vertical',
				        x: 'right',
				        y: 'center',
				        feature : {
				            mark : {show: false},
				            dataZoom : {show: this.showZoom},
				            dataView : {show: false, readOnly: false},
				            magicType : {show: this.showMgk, type: ['line', 'bar']},
				            restore : {show: this.showMgk},
				            saveAsImage : {show: this.savePng}
				        }
				    },
//				    dataZoom : {
//				        show : this.showZoom,
//				        realtime : true,
//				        start : 20,
//				        end : 100
//				    },
				    xAxis : [
						        {
						            type : 'category',
						            data : key,
						            splitLine:{
						            	show:false
						            },
						            axisLabel:{
						              rotate:this.rotateNum,
						              interval:this.getInterval(key)
						            }
						        }
						    ],
				    yAxis : [
				        {
				            type : 'value',
				            position: 'left',
				            splitLine:{
				            	show:true,
				            	lineStyle:{
				            		type:"dashed"
				            	}
				            }
				        },
				        ySecond
				    ],
				    series : seriesData
				};
			this.initDraw(idx, option,cflag);
		},
		barCharts : function(idx,name,key,data){ //柱图横向
			var seriesData = [];
			if(key.length>0){
				for(var i=0;i<name.length;i++){
					var temp = {};
					temp.name = name[i];
					temp.type = "bar";
					temp.barMaxWidth = 18;
					temp.barGap = 0;
					temp.data = data[i];
					seriesData[i] = temp;
				}
			}
			var option = {
					backgroundColor : "#f7f8f9",
				    tooltip : {
				        trigger: 'axis',
				        textStyle: {
				        	align:"left"
				        }
				    },
				    legend: {
				        data:name
				    },
				    toolbox: {
				        show : true,
				        orient: 'vertical',
				        x: 'right',
				        y: 'center',
				        feature : {
				            mark : {show: false},
				            dataView : {show: false, readOnly: false},
				            magicType : {show: this.showMgk, type: ['line', 'bar', 'stack']},
				            restore : {show: this.showMgk},
				            saveAsImage : {show: this.showMgk}
				        }
				    },
				    xAxis : [
						{
						    type : 'value',
				            splitLine:{
				            	show:false
				            }
						}
				    ],
				    yAxis : [
						{
						    type : 'category',
						    data : key,
				            splitLine:{
				            	show:true,
				            	lineStyle:{
				            		type:"dotted"
				            	}
				            }
						}
				    ],
				    series : seriesData
				};
			this.initDraw(idx, option);
		},
		lineAndBar : function(idx,name,key,data,param){
			//param {"lenidx":4,"stack":true}
			var seriesData = [],selected = {},cflag=1;
			if(key.length>0){
				var nlen = name.length;
				var jsonparam = {"lenidx":nlen-2,"stack":true,"linestyle":false};
				if(typeof param !='undefined'){
					for(var k in param){
						jsonparam[k] = param[k];
					}
				}
				if(jsonparam.lenidx == null){
					slen = nlen-1;
				}else{
					slen = jsonparam.lenidx;
				}
			
				for(var i=0;i<nlen;i++){
					var temp = {};
					temp.name = name[i];
					if(i>slen){
						temp.type = "line";
						temp.yAxisIndex = 1;
						if(i<nlen-1){//显示最后一条
							selected[name[i]] = false;
						}else{
							if(jsonparam.linestyle){
								temp.itemStyle = {
										normal:{
											lineStyle:{
												type: 'dotted'
											}
										}
								};
							}
						}
					}else{
						temp.type = "bar";
						temp.barCategoryGap = 0;
						temp.itemStyle = {
								normal:{
									borderWidth:5,
									barBorderColor : "#000"
								}
						};
						if(jsonparam.stack){
							temp.stack = "aaa";
						}
					}
					temp.data = data[i];
					seriesData[i] = temp;
				}
			}
			var option = {
					backgroundColor : "#f7f8f9",
				    tooltip : {
				        trigger: 'axis',
				        textStyle: {
				        	align:"left"
				        }
				    },
				    legend: {
				        data:name,
				        selected : selected
				    },
				    toolbox: {
				        show : true,
				        orient: 'vertical',
				        x: 'right',
				        y: 'center',
				        feature : {
				            mark : {show: false},
				            dataZoom : {show: this.showZoom},
				            dataView : {show: false},
				            magicType : {show: this.showMgk, type: ['line', 'bar', 'stack']},
				            restore : {show: this.showMgk},
				            saveAsImage : {show: this.showMgk}
				        }
				    },
//				    dataZoom : {
//				        show : this.showZoom,
//				        realtime : true,
//				        start : 20,
//				        end : 100
//				    },
				    xAxis : [
				        {
				            type : 'category',
				            data : key,
				            splitLine:{
				            	show:false
				            },
				            axisLabel:{
				            	rotate:this.rotateNum,
					            interval:this.getInterval(key)
				            }
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value',
				            position: 'left',
				            splitLine:{
				            	show:true,
				            	lineStyle:{
				            		type:"dashed"
				            	}
				            }
				        },
				        {
				            type : 'value',
				            splitLine:{
				            	show:false
				            }
				        }
				    ],
				    series : seriesData
				};
			this.initDraw(idx, option,2);
				                    
		},
		pieCharts : function(idx,name,key,data){ //饼图
			var seriesData = [];
			if(data.length>0&&data[0].length>0){
				for(var i=0;i<key.length;i++){
					var temp = {};
					temp.name = key[i];
					temp.value = data[0][i];
					
					seriesData[i] = temp;
				}
			}
			var pieTitle = "",dddObj = $(".drawInfo:eq("+idx+")"),dt = dddObj.attr("drawTitle");
			if(typeof dt!= 'undefined'){
				pieTitle = dt;
			}else{
				var ct = dddObj.attr("ctitle");
				if(typeof ct!='undefined'){
					pieTitle = common.getTip(ct);
				}
			}
			
			var option = {
					title :{
						text : pieTitle,
						x : "center",
						textStyle : {
							color:"#274b6d",
							fontSize:14,
							fontWeight:"normal"
						}
					},
				    tooltip : {
				        trigger: 'item',
				        formatter: "{b} <br/>"+name+" : {c} ({d}%)",
				        textStyle: {
				        	align:"left"
				        }
				    },
				    legend: {
				        orient : 'vertical',
				        x : 'left',
				        data:key
				    },
				    toolbox: {
				        show : true,
				        feature : {
				            mark : {show: false},
				            dataView : {show: false, readOnly: false},
				            magicType : {
				                show: false, 
				                type: ['pie', 'funnel'],
				                option: {
				                    funnel: {
				                        x: '25%',
				                        width: '100%',
				                        funnelAlign: 'center',
				                        max: 1548
				                    }
				                }
				            },
				            restore : {show: false},
				            saveAsImage : {show: this.savePng}
				        }
				    },
				    series : [
				        {
				            name:'',
				            type:'pie',
				            center : ['50%', '50%'], 
				            radius : ['0', '75%'],
				            itemStyle : {
				                normal : {
				                    label : {
				                        show : false
				                    },
				                    labelLine : {
				                        show : false
				                    }
				                },
				                emphasis : {
				                    label : {
				                        show : true,
				                        position : 'center',
				                        textStyle : {
				                            fontSize : '30',
				                            fontWeight : 'bold',
											color : "#000"
				                        }
				                    }
				                }
				            },
				            data:seriesData
				        }
				    ]
				};
			this.initDraw(idx, option,6); 
		},
		initDraw : function(idx,option,cflag){
			var obj = $(".drawInfo").get(idx),myChart = null,drill = $(obj).attr("drilldown"),that = this;
			option.animation = false;
			if(cflag!=6){
				option.grid = {borderWidth:0,x2:50};
			}
			
			this.unBindClick(obj);
			try{
				myChart = echarts.init(obj);
			}catch(e){
				try{
					myChart = echarts.init(obj);
				}catch(e){
					myChart = echarts.init(obj);
				}
			}
			myChart.setOption(option);
			var drillEv = function(param){
				that.chartEvent(param,obj,drill);
			};
			var drillPie = function(param){
				if(typeof execute.drillPieEvent == 'function') {
					execute.drillPieEvent(obj,param.name);
				}
			};
			if(typeof drill !='undefined'){
				var ecConfig = echarts.config;
				if(cflag==2){
					myChart.on(ecConfig.EVENT.CLICK,drillEv);
					$.data(obj,"myonDevt",drillEv);
				}
				if(cflag==6){
					myChart.on(ecConfig.EVENT.CLICK,drillPie);
					$.data(obj,"myonDevt",drillPie);
				}
	            if(typeof $(obj).attr("loadname")!='undefined' && typeof execute.loadNameMeauEvent =='function'){ //付费用户流失下钻使用
					execute.loadNameMeauEvent(option.legend.data);
				}
			}
		},
		chartEvent : function(param,obj,drill){
			var seriesName = param.seriesName,name = param.name;
        	chartx = name;
			chartname = seriesName;
        	if(typeof execute.eventDrilldown =='function'){
				$(obj).attr("drillname", chartx);
				execute.eventDrilldown(parseInt(drill));
			}
        	if(typeof execute.eventDrilldownDetail =='function'){
				execute.eventDrilldownDetail();
			}
		},
		unBindClick : function(obj){
			var key = $(obj).attr("_echarts_instance_"),oldChart=null,ecConfig = echarts.config;
			if(typeof key!='undefined'){
				oldChart = echarts.getInstanceById(key);
				if(typeof oldChart!='undefined'){
					oldChart.un(ecConfig.EVENT.CLICK,$.data(obj,"myonDevt"));
					oldChart.dispose();
				}
			}
		},
		getInterval : function(key){
			if(key.length>31){
				var inv = Math.floor(key.length/31);
				return inv;
			}else{
				return "auto";
			}
		}
}