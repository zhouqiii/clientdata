var colors = {
	pink : "#25acde",// 区域颜色、线颜色
	defaultBlue : "#4897f1",
	levelColor : "#d3aad3",
	ageColor : "#34baeb",
	commonBlue : "#25acde",
	twoColumn : [ "#34baeb", "#ffc200" ],
	background : "#0068d2",
	oneLine : [ "#0884e3" ],
	twoLine : [ "#1aa0ed", "#8b97a6" ],
	threeLine : ["#00aeff","#8b97a6","#18bcaf"],
	fiveColor : [ "#01a3e7", "#868686", "#4475d9", "#da6659", "#429800" ],
	color20 : ["#ff7f50","#87cefa","#da70d6","#32cd32","#6495ed","#ff69b4","#ba55d3","#cd5c5c","#ffa500","#40e0d0","#1e90ff","#ff6347","#7b68ee","#00fa9a","#ffd700","#6699FF","#ff6666","#3cb371","#b8860b","#30e0e0"]
};
var rationnum = -25;
var showlabel = false;
var downimg = false;
var chartx = "", chartname = "", kocdata = [ "X(7,1)", "X(14,7)", "X(30,14)",
		"X(60,30)", "X(90,60)", "X(120,90)", "X(150,120)", "X(180,150)",
		"X(210,180)", "X(240,210)", "X(270,240)", "X(300,270)", "X(330,300)",
		"X(360,330)" ];
var DrawCharts = {
	color : "#4897f1",
	bgColor : "#f7f8f9",
	analyseData : function(idx, flag, method, color, params, nochannel,
			ismethod) {// ismethod 1
		var that = this;
		var jsonparams = {};
		if (typeof params != 'undefined' && params != null) {
			jsonparams = params;
		} else {
			if(typeof dateAndApp!='undefined'){
				if (nochannel && nochannel != null) {
					jsonparams = dateAndApp.params(nochannel);
				} else {
					jsonparams = dateAndApp.params();
				}
			}else{
				jsonparams.report = meau.getRootName();
			}
		}
		if (method.indexOf("&channelName") > -1) {
			var temp = method.split("&");
			cname = temp[1].split("=").pop();

			jsonparams.channel = cname;
		}

		var objHelp = $(".chartbtn_help:eq(" + idx + ")");
		var obj = $(".drawInfo:eq(" + idx + ")");
		if (typeof obj.attr("data-sign") && obj.attr("data-sign") == '1') {
			jsonparams.datasign = 1;
		}
		if(typeof obj.attr("_echarts_instance_")!='undefined'){
			drawEcharts.unBindClick(obj);
			obj.removeAttr("_echarts_instance_");
		}
		obj.html(common.loadImg());
		if (obj.parent().find(".selectChart").length > 0) {
			var c = jsonparams.channel;
			if (typeof c != 'undefined') {
				jsonparams.channel = c.split(",").shift();
			}
		}

		if (typeof obj.attr("moreserver") != 'undefined'
				&& typeof jsonparams.server == 'undefined') { // online-trend
			method = "realtime_overall";
		}

		var url = "";
		if (ismethod && ismethod == 1) {
			url = method;
		}else if (ismethod && ismethod == 2) {
			url = "ajax/getResult4Channel?metric=" + method;
		} else {
			url = "ajax/getResult?metric=" + method;
		}

		if (method.indexOf("_drill_down") > -1) {
			jsonparams.drilldown = 1;
			var sel = obj.prev(".selectChart");
			if (jsonparams.byAcc == 0) {
				if (chartname.indexOf("(") > -1) {
					chartname = chartname.substring(0, chartname.indexOf("("));
				}
				if (jsonparams.byApp == 0) {
					var servers = jsonparams.server, sevArr = [];
					if (typeof servers != 'undefined') {
						sevArr = servers.split(",");
					}
					if (sevArr.length <= 1) {
						jsonparams.channel = chartname;
					} else {
						if (sel.length > 0) {
							jsonparams.channel = sel.attr("rel");
						}
						jsonparams.server = chartname;
					}
				} else {
					var c = jsonparams.channel;
					if (c.indexOf(",") > -1) {
						jsonparams.channel = chartname;
					}
				}
			}
			jsonparams.drillname = obj.attr("drillname");
		}
		if (typeof obj.attr("ctype") != 'undefined'
				&& obj.attr("ctype") == 'sex') {
			jsonparams.byAcc = 1;
		}
		if (typeof obj.attr("paramsno") != 'undefined'
				&& obj.attr("paramsno") == '1') {
			delete jsonparams.byAcc;
			delete jsonparams.byApp;
		}
		if (typeof obj.attr("no-server") != 'undefined'
				&& obj.attr("no-server") == '1') {
			delete jsonparams.server;
		}
		if (typeof obj.attr("no-date") != 'undefined'
				&& obj.attr("no-date") == '1') {
			delete jsonparams.startDate;
			delete jsonparams.endDate;
		}
		var reportArr = [ "retention_loggedin", "retention_new_account", "retention_reflow" ];
		var rp = (url.substring(url.indexOf("?")).split("&"))[0].split("=")[1];
		
		if ($.inArray(rp, reportArr)>-1 && typeof jsonparams.server == 'undefined'
				&& typeof jsonparams.channel == 'undefined') {
			jsonparams.channel = 'reyunzxy';
		}
		$.post(url,jsonparams,function(data) {
				common.timeoutEvent(data);
				var ajaxdata = $.parseJSON(data);
				if (url.indexOf("KOC&") > -1) {
					ajaxdata.key = kocdata;
				}
				com.helpTip(objHelp, ajaxdata.help);
				var categories = ajaxdata.key, data = ajaxdata.val, column = ajaxdata.column, name = ajaxdata.name,mycolor = [];
				if(url.indexOf("analysis_whale_lost&") > -1){
					for(var i=0;i< categories.length;i++){
						if(categories[i]==1){
							categories[i] = common.getTip("islost");
						}else{
							categories[i] = common.getTip("nolost");
						}
					}
				}
				if(url.indexOf("analysis_whale_lost_users_info&") > -1){
					categories = column;
					ajaxdata.key = column;
				}
				that.anayDataToChart(idx, ajaxdata, flag);
		   });
	},
	anayDataToChart : function(idx, ajaxdata, flag, sign, chartTitle) {
		var obj = $(".drawInfo:eq(" + idx + ")");
		if (sign && sign == 1) {
			var objHelp = $(".chartbtn_help:eq(" + idx + ")");
			com.helpTip(objHelp, ajaxdata.help);
		}
		
		if (flag == 402) {
			this.drawSmallLine(obj, ajaxdata);
		}
		else if(flag == 555){
			this.drawSpider(obj, ajaxdata);
		}
		else if(flag == 6){
			this.drawPie(obj, ajaxdata);
		}
		else if(flag == 7){
			this.drawStackColumn(obj, ajaxdata);
		}
		else{
			this.myHCharts(obj, ajaxdata,flag);
		}
		
		var listnum = 9;
		if(typeof obj.attr("listnum")!='undefined'){
			listnum = parseInt(obj.attr("listnum"));
		}
		if (typeof obj.attr("nolist") == 'undefined'
				|| obj.attr("nolist") == '') {
			var categories = ajaxdata.key, data = ajaxdata.val, column = ajaxdata.column, name = ajaxdata.name;
			this.dataToTable(obj, categories, column, name, data,listnum);
		}
	},
	dataToTable : function(obj, title, column, name, data, num, curpage) {
		if (typeof num == 'undefined' || num == '') {// 每页显示条数
			num = 9;
		}
		if (typeof curpage == 'undefined' || curpage == '') {// 当前页
			curpage = 1;
		}

		var tableObj = $(obj).next(".drawInfoTable");
		if (tableObj.length < 1) {
			tableObj = $(".drawInfoTable");
		}
		var tableHead = tableObj.find("thead");
		dataObj = tableObj.find("tbody");
		var total = title.length;
		
		var headHtml = [];
		tableHead.html("");
		headHtml.push("<tr>");
		headHtml.push("<th>" + column[0] + "</th>");
		if (name.length == 0) {
			headHtml.push("<th>" + column[1] + "</th>");
		} else {
			var remark = "", c = column[1] + "";
			if (c != '' && c != 'null') {
				remark = "(" + c + ")";
			}
			for ( var i = 0; i < name.length; i++) {

				headHtml.push("<th>" + name[i] + remark + "</th>");
			}
		}
		headHtml.push("</tr>");
		tableHead.append(headHtml.join(""));

		dataObj.html("");
		var cols = data.length;
		for ( var i = 0; i < total; i++) {
			var trHtml = [];
			trHtml.push("<tr>");
			trHtml.push("<td>" + title[i] + "</td>");
			if (cols == 0) {
				trHtml.push("<td>&nbsp;</td>");
			} else {
				for ( var j = 0; j < cols; j++) {
					var t = com.fixedStr(data[j][i]);
					if (t == "") {
						t = "0";
					}
					trHtml.push("<td>" + t + "</td>");
				}
			}

			trHtml.push("</tr>");
			dataObj.append(trHtml.join(""));
		}

		var nowCols = name.length + column.length - 1;
		var mod = num - total % num;
		for ( var i = 0; i < mod; i++) {
			var temp = [];
			temp.push("<tr>");
			for (j = 0; j < nowCols; j++) {
				temp.push("<td>&nbsp;</td>");
			}

			temp.push("</tr>");
			dataObj.append(temp.join(""));
		}
		tableObj.find("table tr:nth-child(even)").addClass("tdodd");
		tableObj.find("table tr:nth-child(odd)").addClass("tdBgColor");
		com.pagePreOrNext(num, curpage, total, tableObj);

	},
	drawArea : function(obj, categories, data, evt) {// 区域图
		var drawWidth = $(obj).parent().width();

		var len = data.length;
		if (len > 0) {
			len = data[0].data.length;
		}
		var step = Math.round(len/14);
		 
		var tip = "";
		if (evt && evt == 1) {
			tip = "<br/>(点击查看详情)";
		}
		var resetname = common.getTip("reset");
		Highcharts.setOptions({
			lang: {
				resetZoom : resetname
			}
		});
		var drawTitle = "",dt = $(obj).attr("drawTitle");
		if(typeof dt!='undefined'){
			drawTitle = dt;
		}
		$(obj).highcharts({
			chart : {
				type : 'area',
				backgroundColor : this.bgColor,
				width : drawWidth,
				zoomType : "x"
			},
			title : {
				text : drawTitle,
				style : {
					fontSize : "14px"
				}
			},
			subtitle : {
				text : ''// 副标题，暂不使用
			},
			xAxis : {
				categories : categories,
				labels : {
					formatter : function() {
						return this.value;
					},
					rotation : rationnum,
					align : 'right',
					step : step
				} 
			},
			yAxis : {
				title : {
					text : ''
				},
				labels : {
					formatter : function() {
						return this.value;
					}
				},
				gridLineWidth : 1,// gridLineColor
				gridLineDashStyle : 'longdash'
			},
			tooltip : {
				enabled : true,
				crosshairs : [ {// 控制十字线
					width : 1,
					color : "#CCC",
					dashStyle : "longdash"
				} ],
				formatter : function() {
					var s = this.x + "<br/>";
					$.each(this.points, function(i, point) {
						if (i > 0) {
							s += "<br/>";
						}
						s += this.series.name;
						s += ':' + com.fixedStr(point.y);
					});
					return s + tip;
				},
				shared : true
			},
			credits : {
				enabled : false
			},
			exporting : {
				enabled : downimg
			},
			legend : {
				enabled : true
			// 设置图例不可见
			},
			plotOptions : {
				area : {
					dataLabels : {
						enabled : showlabel, // 点上显示数值
						userHTML : true,
						formatter : function() {
							var y = this.point.y;
							return com.fixedStr(y);
						}
					},
					cursor : "pointer",
					marker : {
						enabled : false,
						symbol : 'circle',
						radius : 3,
						states : {
							hover : {
								enabled : true
							}
						}
					},
					events : {
						click : function(e) {
							// alert(e.point.y+" "+e.point.category);
							var nowdate = e.point.category;
							if (typeof execute.drawMoreEvent == 'function') {
								execute.drawMoreEvent(nowdate);
							}
						}
					}
				}
			},
			series : data
		});
	},
	myHCharts : function(obj, ajaxdata,flag,paramsJSON) {
		var categories = ajaxdata.key, data = ajaxdata.val, column = ajaxdata.column, name = ajaxdata.name,drawData = [];
		var datalen = data.length,drawWidth = $(obj).parent().width(),len = categories.length;
		var step = Math.round(len/25),pdW = Math.floor((drawWidth-65)/len),isColumn = false,namelen = name.length,columnsLen = namelen,dotidx = 0,
		plotJSON = {from: 0,to: 0,color: 'rgba(68, 170, 213, 0.1)'},circleshow = true;
		
		var columnJSON = {
							pointPadding: 0,
							borderWidth : 0,
							events : {
								click : function(e) {
									var drilldown = obj.attr("drilldown");
									// alert(e.point.y+" "+this.name+"
									// "+e.point.category);
									var xdata = e.point.category;
									if (drilldown && drilldown != 'undefined') {
										chartx = xdata;
										chartname = this.name;
										if(typeof execute.myservers!='undefined'){
											execute.eventDrilldown(this.columnIndex);
										}else{
											if(typeof execute.eventDrilldownDetail == 'function'){
												execute.eventDrilldownDetail(parseInt(drilldown));
											}
											if(typeof execute.eventDrilldown =='function'){
												$(obj).attr("drillname", chartx);
												execute.eventDrilldown(parseInt(drilldown));
											}
										}
									}
								}
							}
						},
			barJSON = {
				pointPadding:0,
				borderWidth : 0
			};
		var y = {
                title: {
                    text: ''
                },
                labels: {
                    formatter: function() {
                    	return this.value;
                    },
                    style : {
						fontFamily : "arial",
						color : "#333",
						fontSize : "12px"
					}
                },
                min:0,
                opposite: true,
                lineColor : "#4489bb",
				lineWidth : 2,
                gridLineWidth : 0,
                reversedStacks : false
		    },y1 = {title: {text: ''}};
		
		if(obj.attr("isonline")&&obj.attr("isonline")=='1'){//实时在线
			data = com.setNull(categories,data);
		}
		for ( var i = 0; i < datalen; i++) {
			var oneData = {};
			oneData.name = name[i];
			oneData.data = data[i];
			oneData.fillOpacity = "0.15";
			
			if(flag==1){
				// 折线图
				oneData.type = "line";
			}else if(flag == 11){ //折线图+N条折线图为虚线
				var showLen = $(obj).attr("dotLen");
				oneData.type = "area";
				if(typeof showLen=='undefined'){
					showLen = 1;
				}
				if(i >= datalen-showLen){
					oneData.dashStyle = "dot";
					oneData.color = colors.color20[dotidx];
					dotidx++;
				}
			}else if(flag == 12){ //折线图+预测(颜色值从后对应)
				var showLen = $(obj).attr("dotLen");
				oneData.type = "line";
				if(typeof showLen=='undefined'){
					showLen = 1;
				}
				if(i >= datalen-showLen){
					oneData.dashStyle = "dash";
					oneData.color = colors.color20[datalen-showLen*2+dotidx];
					dotidx++;
				}
				
				if(typeof paramsJSON!='undefined'){
					plotJSON.from = paramsJSON.from;
					plotJSON.to = paramsJSON.to;
				}
				circleshow = false;
			}else if(flag == 121){ //折线图+预测(颜色值从前对应)
				var showLen = $(obj).attr("dotLen");
				oneData.type = "line";
				if(typeof showLen=='undefined'){
					showLen = 1;
				}
				if(i >= datalen-showLen){
					oneData.dashStyle = "dash";
					oneData.color = colors.color20[dotidx];
					dotidx++;
				}
				
				if(typeof paramsJSON!='undefined'){
					plotJSON.from = paramsJSON.from;
					plotJSON.to = paramsJSON.to;
				}
				circleshow = false;
			}else if(flag==13){
				// 折线图
				oneData.type = "area";
			}
			else if(flag == 2){
				// 柱图
				oneData.type = "column";
				isColumn = true;
			}
			else if(flag == 21 || flag == 22){
				// 柱图+百分比线图（双Y）
				oneData.type = "column";
				if(i == datalen-1){
					oneData.type = "line";
					oneData.yAxis = 1;
				}
				isColumn = true;
				columnsLen = namelen - 1;
				y1 = y;
			}
			else if(flag == 23){
				// 柱图（双Y）
				oneData.type = "column";
				if(i == datalen-1){
					oneData.yAxis = 1;
				}
				isColumn = true;
				y1 = y;
			}
			else if(flag == 3){
				// 横向柱图
				oneData.type = "bar";
				isColumn = true;
			}
			else if(flag == 51){
				////堆积柱图
				oneData.type = "column";
			}
			else if(flag == 52){
				//多柱柱图+线图
				oneData.type = "column";
				if(i == datalen-1){
					oneData.type = "line";
					oneData.dashStyle = "dot";
					oneData.yAxis = 1;
				}
				y1 = y;
			}
			else if(flag == 53 || flag == 54 || flag == 55){
				//多柱柱图+线图+最后一条线为虚线或N条线
				//多柱柱图+线图+只显示最后一条线或N条线
				//多柱堆积柱图+线图+只显示最后一条线或N条线
				oneData.type = "column";
				var showLen = $(obj).attr("showLen"),lennum=1;
				if(typeof showLen !='undefined'){
					lennum = Number(showLen);
				}
				if((datalen - i)<=lennum){
					oneData.type = "line";
					oneData.yAxis = 1;
					oneData.visible = false;
				}
				if(i == datalen-1){
					oneData.dashStyle = "dash";
					oneData.visible = true;
				}
				if(flag == 53){
					oneData.visible = true;
				}
				y1 = y;
			}
			drawData[i] = oneData;
		}
		if(flag == 51 || flag == 55){
			columnJSON.stacking = 'normal';
			columnJSON.borderWidth = 0.3;
			columnJSON.borderColor = "#ccc";
			columnJSON.groupPadding = 0;
		}
		if(flag == 22){
			y1.max = 1;
		}
		var drawTitle = "",dt = $(obj).attr("drawTitle"),mp = "top",flt = true;
		if(typeof dt!='undefined'){
			drawTitle = dt;
			mp = "bottom",
			flt = false;
		}
		if(typeof $(obj).attr("loadname")!='undefined' && typeof execute.loadNameMeauEvent =='function'){ //付费用户流失下钻使用
			execute.loadNameMeauEvent(name);
		}
		$(obj).highcharts({
			chart : {
				backgroundColor : this.bgColor,
				width : drawWidth
			},
			colors : colors.color20,
			title : {
				text : drawTitle,
				style : {
					fontSize : "14px"
				}
			},
			subtitle : {
				text : ''// 副标题，暂不使用
			},
			xAxis : {
				categories : categories,
				plotBands : [plotJSON],
				labels : {
					formatter : function() {
						return this.value;
					},
					rotation : rationnum,
					align : 'right',
					step : step,
					style : {
						fontFamily : "arial",
						color : "#333",
						fontSize : "12px"
					}
				},
				lineColor : "#4489bb",
				lineWidth : 2,
				tickColor : "#4489bb"
			},
			yAxis : [{
				title : {
					text : ''
				},
				labels : {
					formatter : function() {
						return this.value;
					},
					style : {
						fontFamily : "arial",
						color : "#333",
						fontSize : "12px"
					}
				},
				min:0,
				gridLineWidth : 1,
				gridLineDashStyle : 'dot',
				lineColor : "#4489bb",
				lineWidth : 2,
				reversedStacks : false
			},y1],
			tooltip : {
				enabled : true,
				crosshairs : [ {// 控制十字线
					width : 2,
					dashStyle : "dash",
					zIndex : 3,
					color : "#4489bb"
				} ],
				formatter : function() {
					var s = this.x + "<br/>";
					$.each(this.points, function(i, point) {
						if (i > 0) {
							s += "<br/>";
						}
						s += '<span style="color:'+this.series.color+'">\u25CF</span>'+this.series.name;
						s += ':' + com.fixedStr(point.y);
					});
					return s;
				},
				backgroundColor : "rgba(0, 0, 0, .75)",
				borderColor : "rgba(0, 0, 0, .75)",
				style : {
					color:"#fff",
					fontFamily : "arial"
				},
				shared : true
			},
			credits : {
				enabled : false
			},
			exporting : {
				enabled : downimg
			},
			legend : {
				enabled : true,
				borderWidth : 0,
				align:"center",
				floating : flt,
				verticalAlign :mp,
				itemStyle : {
					color : "#345965",
					fontFamily : "arial"
				},
				itemHoverStyle : {
					color : "#ccc"
				},
				y:0
			},
			plotOptions : {
				series :{
					dataLabels : {
						enabled : showlabel, // 点上显示数值
						userHTML : true,
						formatter : function() {
							var y = this.point.y;
							return com.fixedStr(y);
						}
					},
					marker : {
						enabled : circleshow,
						symbol : "circle",
						lineWidth: 2,
						lineColor : null,
						fillColor : "#fff",
						radius : 3
					},
					cursor : "pointer"
				},
				line : {
					zIndex : 2
				},
				column : columnJSON,
				bar : barJSON
			},
			series : drawData
		},function(chart){
			if(isColumn){
				if(columnsLen > 0)
				{
					//柱子总数
					var columnCount = len*columnsLen;
					//图表宽度
					var chartWidth = chart.chartWidth;
					var interval = chartWidth/len*0.1*2;
					//动态计算后的柱子宽度
					var columnWidth = (chartWidth-(columnCount+1)*interval)/columnCount;
					columnWidth  = columnWidth > 18 ? 18 : columnWidth;
					//动态更新
					//for循环逐个series进行更新
					for(var i = 0;i<columnsLen;i++)
					{
						chart.series[i].update({
							pointWidth:columnWidth
						});
					}
				}
			}
		});
	},
	drawStackColumn : function(obj, ajaxdata){ //用户构成 --颜色从红色增强
		var categories = ajaxdata.key, data = ajaxdata.val, column = ajaxdata.column, name = ajaxdata.name;
		var datalen = data.length,drawWidth = $(obj).parent().width(),len = categories.length,step = Math.round(len/25);
		
		var drawData = [],stackFlag = "normal",stackFlagP = $(obj).attr("stackFlag"),ispercent = false;
		if(typeof stackFlagP!='undefined'){
			stackFlag = stackFlagP;
		}
		if(stackFlag == 'percent'){
			datalen--;
			ispercent = true;
		}
		for ( var i = 0; i < datalen; i++) {
			var oneData = {};
			oneData.name = name[i];
			oneData.data = data[i];
			oneData.fillOpacity = "0.15";
			drawData[i] = oneData;
		}
		if(!ispercent&datalen>0){
			var lastData = drawData[datalen-1],fdata = lastData.data,newfData = [];
			lastData.visible = false;
			
			for(var i=0;i<fdata.length;i++){
				newfData[i] = 0 - fdata[i];
			}
			drawData[datalen-1].data = newfData;
		}
		
		$(obj).highcharts({
			chart : {
				backgroundColor : this.bgColor,
				width : drawWidth,
				type : "column"
			},
			colors : ['#fdd772', '#f9b865', '#f6994e', '#f17a40', '#e35a3f', '#d44141', '#ccc'],
			title : {
				text : "",
				style : {
					fontSize : "14px"
				}
			},
			subtitle : {
				text : ''
			},
			xAxis : {
				categories : categories,
				labels : {
					formatter : function() {
						return this.value;
					},
					rotation : rationnum,
					align : 'right',
					step : step,
					style : {
						fontFamily : "arial",
						color : "#333",
						fontSize : "12px"
					}
				},
				lineColor : "#4489bb",
				lineWidth : 2,
				tickColor : "#4489bb"
			},
			yAxis : {
				title : {
					text : ''
				},
				labels : {
					formatter: function(){
                        if(ispercent){
                            return Math.abs(this.value) + '%';
                        }else{
                            return Math.abs(this.value);
                        }
                        
                    },
					style : {
						fontFamily : "arial",
						color : "#333",
						fontSize : "12px"
					}
				},
				gridLineWidth : 1,
				gridLineDashStyle : 'dot',
				lineColor : "#4489bb",
				lineWidth : 2,
				reversedStacks : true
			},
			tooltip : {
				enabled : true,
				crosshairs : [ {// 控制十字线
					width : 2,
					dashStyle : "dash",
					zIndex : 3,
					color : "#4489bb"
				} ],
				formatter : function() {
					 var s = '<b>' + this.x + '</b>';
                     $.each(this.points, function () {
                         if(this.y != undefined){
                        	 s += '<br/><span style="color:'+this.series.color+'">\u25CF</span>' + this.series.name + ': ' +com.fixedStr(Math.abs(this.y));
                             if(ispercent){
                                 s +=  '('+com.fixedStr(this.percentage)+'%)';
                             }
                         }
                     });
                     return s;
				},
				backgroundColor : "rgba(0, 0, 0, .75)",
				borderColor : "rgba(0, 0, 0, .75)",
				style : {
					color:"#fff",
					fontFamily : "arial"
				},
				shared : true
			},
			credits : {
				enabled : false
			},
			exporting : {
				enabled : downimg
			},
			legend : {
				enabled : true,
				borderWidth : 0,
				verticalAlign : "top",
				align:"center",
				itemStyle : {
					color : "#345965",
					fontFamily : "arial"
				},
				itemHoverStyle : {
					color : "#ccc"
				},
				y:0
			},
			plotOptions : {
				column : {
					pointPadding: 0,
					borderWidth : 0,
					pointWidth : 20,
					stacking : stackFlag
				}
			},
			series : drawData
		},function(chart){
			//柱子总数
			var columnCount = datalen;
			//图表宽度
			var chartWidth = chart.chartWidth;
			var interval = chartWidth/len*0.1*2;
			//动态计算后的柱子宽度
			var columnWidth = (chartWidth-(columnCount+1)*interval)/columnCount;
			columnWidth  = columnWidth > 18 ? 18 : columnWidth;
			//动态更新
			//for循环逐个series进行更新
			for(var i = 0;i<columnCount;i++)
			{
				chart.series[i].update({
					pointWidth:columnWidth
				});
			}
		});
	},
	drawStackBar : function(obj, ajaxdata){ //
		var categories = ajaxdata.key, data = ajaxdata.val, column = ajaxdata.column, name = ajaxdata.name;
		var datalen = data.length,drawWidth = $(obj).parent().width(),len = categories.length,step = Math.round(len/20);
		
		var drawData = [],maxArr = [],maxY = 100;
		for ( var i = 0; i < datalen; i++) {
			var oneData = {},fdata = data[i];
			oneData.name = name[i];
			oneData.fillOpacity = "0.15";
			
			if(i%2==0){
				var newfData  = [];
				for(var j=0;j<fdata.length;j++){
					newfData[j] = 0 - fdata[j];
				}
				oneData.data = newfData;
			}else{
				oneData.data = fdata;
			}
			maxArr.push(oneData.data.max(true));
			drawData[i] = oneData;
		}
		maxY += maxArr.max(true);
		$(obj).highcharts({
			chart : {
				backgroundColor : this.bgColor,
				width : drawWidth,
				type : "bar"
			},
			colors : colors.color20,
			title : {
				text : "",
				style : {
					fontSize : "14px"
				}
			},
			subtitle : {
				text : ''
			},
			xAxis : [{
				categories : categories,
				reversed: true,
				labels : {
					formatter : function() {
						return this.value;
					},
					align : 'right',
					step : step,
					style : {
						fontFamily : "arial",
						color : "#333",
						fontSize : "12px"
					}
				},
				lineColor : "#4489bb",
				lineWidth : 2,
				tickColor : "#4489bb",
				gridLineWidth : 1,
				gridLineDashStyle : 'dot'
			},{
				categories : categories,
				opposite: true,
				reversed: true,
				linkedTo: 0,
				labels : {
					formatter : function() {
						return this.value;
					},
					align : 'left',
					step : step,
					style : {
						fontFamily : "arial",
						color : "#333",
						fontSize : "12px"
					}
				},
				lineColor : "#4489bb",
				lineWidth : 2,
				tickColor : "#4489bb"
			}],
			yAxis : {
				title : {
					text : ''
				},
				labels : {
					formatter: function(){
						return Math.abs(this.value);
                    },
					style : {
						fontFamily : "arial",
						color : "#333",
						fontSize : "12px"
					}
				},
				max : maxY,
				min : 0 - maxY,
				gridLineWidth : 1,
				gridLineDashStyle : 'dot',
				lineColor : "#4489bb",
				lineWidth : 2,
				reversedStacks : true
			},
			tooltip : {
				enabled : true,
				crosshairs : [ {// 控制十字线
					width : 2,
					dashStyle : "dash",
					zIndex : 3,
					color : "#4489bb"
				} ],
				formatter : function() {
					 var s = '<b>' + this.x + '</b>';
                     $.each(this.points, function () {
                         if(this.y != undefined){
                        	 s += '<br/><span style="color:'+this.series.color+'">\u25CF</span>' + this.series.name + ': ' +com.fixedStr(Math.abs(this.y));
                         }
                     });
                     return s;
				},
				backgroundColor : "rgba(0, 0, 0, .75)",
				borderColor : "rgba(0, 0, 0, .75)",
				style : {
					color:"#fff",
					fontFamily : "arial"
				},
				shared : true
			},
			credits : {
				enabled : false
			},
			exporting : {
				enabled : downimg
			},
			legend : {
				enabled : true,
				borderWidth : 0,
				verticalAlign : "top",
				align:"center",
				itemStyle : {
					color : "#345965",
					fontFamily : "arial"
				},
				itemHoverStyle : {
					color : "#ccc"
				},
				y:0
			},
			plotOptions : {
				bar : {
					pointPadding: 0,
					borderWidth : 0,
					stacking : "normal"
				}
			},
			series : drawData
		},function(chart){
			//柱子总数
			var columnCount = datalen*(len-1);
			//图表宽度
			var chartWidth = chart.chartHeight;
			var interval = chartWidth/len*0.1;
			//动态计算后的柱子宽度
			var columnWidth = (chartWidth-(columnCount+1)*interval)/columnCount;
			columnWidth  = columnWidth > 18 ? 18 : columnWidth;
			columnWidth = Math.round(columnWidth);
			//动态更新
			//for循环逐个series进行更新
			for(var i = 0;i<datalen;i++)
			{
				chart.series[i].update({
					pointWidth:columnWidth
				});
			}
		});
	},
	drawPie : function(obj, ajaxdata) { // 饼图
		var name = ajaxdata.name,datas = ajaxdata.val,categories = ajaxdata.key,piedata = [],piename = "";
		if(datas.length>0){
			var data = datas[0],piename = name[0];
			for(var i=0;i<categories.length;i++){
				var temp = {};
				temp.name = categories[i];
				temp.y = data[i];
				
				piedata[i] = temp;
			}
		}
		var drawWidth = $(obj).parent().width();
		if($(obj).hasClass("halfd")){
			drawWidth = drawWidth * 0.49;
		}
		var ct = "",dt = $(obj).attr("drawTitle");
		if(typeof dt!='undefined'){
			ct = dt;
		}else{
			dt = $(obj).attr("ctitle");
			if(typeof dt!='undefined'){
				ct = common.getTip(dt);
			}
		}
		$(obj).highcharts(
				{
					chart : {
						plotBackgroundColor : null,
						plotBorderWidth : null,
						plotShadow : false,
						backgroundColor : '#fff',
						width : drawWidth
					},
					colors : colors.color20,
					title : {
						text : ct, // 图形标题
						style : {
							fontSize : "14px"
						}
					},
					legend : {
						enabled : true,
						borderWidth : 0,
						align:"center"
					},
					tooltip : {
						percentageDecimals: 1,
						formatter : function() {
							return this.point.name+"<br/>"
									+this.series.name + ': '
									+ com.fixedStr(this.y) + "("
									+ com.fixedStr(this.percentage)
									+ ' %)';
						},
						backgroundColor : "rgba(0, 0, 0, .75)",
						borderColor : "rgba(0, 0, 0, .75)",
						style : {
							color:"#fff",
							fontFamily : "arial"
						}
					},
					plotOptions : {
						pie : {
							allowPointSelect : true,
							cursor : 'pointer',
							dataLabels: {
		                        enabled: false
		                    },
		                    showInLegend: true,
							events : {
								click : function(e) {
//									 alert(e.point.y+" "+e.point.name);
									var name = e.point.name;
									if (typeof execute.drillPieEvent == 'function') {
										execute.drillPieEvent(obj,name);
									}
								}
							}
						}
					},
					credits : {
						enabled : false
					},
					exporting : {
						enabled : downimg
					},
					series : [ {
						type : 'pie',
						name : piename,
						data : piedata
					} ]
				});
	},
	drawSmallLine : function(obj, ajaxdata) {// 折线图--x轴不显示
		var categories = ajaxdata.key, data = ajaxdata.val, column = ajaxdata.column, name = ajaxdata.name;
		var datalen = data.length;
		
		var drawData = [];
		for ( var i = 0; i < datalen; i++) {
			var oneData = {};
			oneData.name = name[i];
			oneData.data = data[i];
			oneData.fillOpacity = "0.15";
			drawData[i] = oneData;
		}
		
		data.pointInterval = 10;
		var drawWidth = $(obj).parent().width() - 12;
		var tip = "";
		var jsony = {
				title : {
					text : ''
				},
				labels : {
					formatter : function() {
						return this.value;
					}
				},
				min : 0,
				gridLineWidth : 1,// gridLineColor
				gridLineDashStyle : 'dot'
		};
		if(typeof obj.attr("maxnum")!='undefined'){
			jsony.min = 0;
			jsony.max = Number(obj.attr("maxnum"));
		}
		var dtitle = "";
		if(obj.attr("drawTitle")){
			dtitle = obj.attr("drawTitle");
		}
		$(obj).highcharts({
			chart : {
				type : 'line',
				backgroundColor : this.bgColor,
				width : drawWidth
			},
			colors :["#87cefa"],
			title : {
				text : dtitle
			},
			subtitle : {
				text : ''// 副标题，暂不使用
			},
			xAxis : {
				categories : categories,
				labels : {
					formatter : function() {
						return "";
					}
				},
				enabled : false
			},
			yAxis : jsony,
			tooltip : {
				enabled : true,
				formatter : function() {
					var s = this.x + "<br/>";
					$.each(this.points, function(i, point) {
						if (i > 0) {
							s += "<br/>";
						}
						s += this.series.name;
						s += ':' + com.fixedStr(point.y);
					});
					return s + tip;
				},
				backgroundColor : "rgba(0, 0, 0, .75)",
				borderColor : "rgba(0, 0, 0, .75)",
				style : {
					color:"#fff",
					fontFamily : "arial"
				},
				shared : true
			},
			credits : {
				enabled : false
			},
			exporting : {
				enabled : false
			},
			legend : {
				enabled : false
			// 设置图例不可见
			},
			plotOptions : {
				line : {
					dataLabels : {
						enabled : showlabel, // 点上显示数值
						userHTML : true,
						formatter : function() {
							var y = this.point.y;
							return com.fixedStr(y);
						}
					},
					cursor : "pointer",
					marker : {
						enabled : false,
						symbol : 'circle',
						radius : 1,
						states : {
							hover : {
								enabled : true
							}
						}
					}
				}
			},
			series : drawData
		});
	},
	drawSpider : function(obj, ajaxdata) {// 雷达图
		var categories = ajaxdata.key, data = ajaxdata.val, column = ajaxdata.column, name = ajaxdata.name;
		var datalen = data.length;
		var drawData = [];
		for ( var i = 0; i < datalen; i++) {
			var oneData = {};
			oneData.name = name[i];
			oneData.data = data[i];
			oneData.fillOpacity = "0.15";
			oneData.pointPlacement = "on";
			drawData[i] = oneData;
		}
		
		$(obj).highcharts({
			chart : {
				polar: true,
		        type: 'line',
		        spacingRight : 20
			},
			title : {
				text : '',
				 x: -80
			},
			pane: {
		    	size: '75%'
		    },
			credits : {
				enabled : false
			},
			exporting : {
				enabled : downimg
			},
			xAxis: {
		        categories: categories,
		        tickmarkPlacement: 'on',
		        lineWidth: 0,
		        labels: {
		        	formatter: function () {
		        		return this.value ;
		        	}
		        }
		    },
		    yAxis: {
		        gridLineInterpolation: 'polygon',
		        lineWidth: 0,
		        min: 0
		    },
		    tooltip: {
		    	shared: true,
		    	backgroundColor : "rgba(0, 0, 0, .75)",
				borderColor : "rgba(0, 0, 0, .75)",
				style : {
					color:"#fff",
					fontFamily : "arial"
				},
		        pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
		    },
		    legend: {
		    	enabled : true,
		    	borderWidth : 0,
				align:"center",
				itemStyle : {
					color : "#333"
				},
				itemHoverStyle : {
					color : "#ccc"
				}
		    },
			series : drawData
		});
	},
	drawOnlyColumn : function(obj,data,categories,name,svg){//滚服分析
	    var drawData = [],temp = {},mydata = [],dlen = data.length,opa = [1,0.7,0.3,0.1],tempcolor= ["#f16118","#f28149","#f29262","#f2b191"];
	    if(typeof svg!='undefined'){
	    	 for(var i=0;i<4;i++){
	    		 mydata[i] = new Array();
	    		 for(var j=0;j<dlen;j++){
	    			 mydata[i][j] = null;
		 	     }
	 	     }
	    	 for(var i=0;i<dlen;i++){
	 	    	var tempnow = data[i];
	 	    	if(tempnow < svg*1.3 && tempnow >= svg){ //0.7
	 	    		mydata[1][i] = tempnow;
	 	    	}else if(tempnow<svg && tempnow>= svg*0.3){//0.3
	 	    		mydata[2][i] = tempnow;
	 	    	}else if(tempnow < svg*0.3){//0.1
	 	    		mydata[3][i] = tempnow;
	 	    	}else{
	 	    		mydata[0][i] = tempnow;
	 	    	}
	 	     }
	    	 for(var i=0;i<4;i++){
	    		temp = {};
	    		temp.data = mydata[i];
	 	    	temp.name = name;
	 	    	temp.color = tempcolor[i];
	 		   	temp.fillOpacity = opa[i];
	 		   	drawData.push(temp);
	    	 }
	    }else{
	    	temp.data = data;
	    	temp.name = name;
		   	temp.fillOpacity = "0.15";
		   	drawData.push(temp);
	    }
	   	var drawWidth = $(obj).width();
	   	obj.find(".horizonDrawinfo").highcharts({
				chart:{
					backgroundColor : "",
					width : drawWidth,
					type : "column",
					margin : 0,
					padding : 0
				},
				colors : ["#ff7f50"],
				title : {
					text : "",
					style : {
						fontSize : "14px"
					}
				},
				subtitle : {
					text : ''
				},
				xAxis : {
					categories : categories,
					labels : {
						formatter : function() {
							return "";
						}
					},
					lineWidth : 0,
					tickWidth : 0,
					gridLineWidth : 0
				},
				yAxis : {
					title : {
						text : ''
					},
					labels : {
						formatter : function() {
							return "";
						}
					},
					gridLineWidth : 0
				},
				tooltip : {
					enabled : true,
					crosshairs : [ {// 控制十字线
						width : 2,
						dashStyle : "dash",
						zIndex : 3,
						color : "#4489bb"
					} ],
					formatter : function() {
						execute.showTip(this.x,$(event.target).attr("x"));
						return false;
					}
				},
				credits : {
					enabled : false
				},
				exporting : {
					enabled : false
				},
				legend : {
					enabled : false
				},
				plotOptions : {
					series :{
						cursor : "pointer"
					},
					column : {
						groupPadding: 0,
						pointPadding: 0,
						borderWidth : 0,
						stacking : "normal"
					}
				},
				series : drawData
			});
	  }
};
var listData = {
	listDataInfo : function(idx, method, num, fn, sign, helpidx, iptparams,
			curpage) {// sign为1,不需要传时间等
		var that = this;
		var jsonparams = {};
		if (!sign || sign != 1) {
			jsonparams = dateAndApp.params();
		} else {
			jsonparams.report = meau.getRootName();
			jsonparams.r = Math.random();
			jsonparams.channel = "-1";
		}
		var url = "ajax/getResult?metric=" + method;
		if (iptparams && iptparams != null) {
			jsonparams = iptparams;
			jsonparams.report = meau.getRootName();
			url = method;
		}

		if (method.indexOf("flag=9") > -1) {
			delete jsonparams.byAcc;
			delete jsonparams.byApp;
		}
		if (typeof curpage == 'undefined' || curpage == '') {// 当前页
			curpage = 1;
		}
		var dypage = false;
		if (method.indexOf("flag=13") > -1) {// 动态翻页
			jsonparams.pageSize = num;
			jsonparams.pageIndex = curpage;
			dypage = true;
		}
		if (method && method != '') {
			var listobj = $(".listInfoTable:eq(" + idx + ")"), tbody = listobj
					.find("tbody"), cols = listobj.find("th").length,loadHtml = "";
			if(cols==0){
				loadHtml = common.loadImg("300");
			}else{
				loadHtml = common.loadImgList("300", cols);
			}
			tbody.html("<tr><td>" + loadHtml + "</td></tr>");
			
			var reportArr = [
		  				"retention_user_define_day_loggedin",
		  				"retention_user_define_day_newaccount"];
	  		var rp = (url.substring(url.indexOf("?")).split("&"))[0].split("=")[1];
	  		
	  		if ($.inArray(rp, reportArr)>-1 && typeof jsonparams.server == 'undefined'
	  				&& typeof jsonparams.channel == 'undefined') {
	  			jsonparams.channel = 'reyunzxy';
	  		}
	  		var ajaxdata = {};	
			$.post(
							url,
							jsonparams,
							function(data) {
								common.timeoutEvent(data);
								ajaxdata = $.parseJSON(data);
								var column = ajaxdata.column, dat = ajaxdata.val, help = ajaxdata.help, size = ajaxdata.size;
								
								listobj.data("listInfoData",ajaxdata);
								if (dypage) {
									tbody.data("url", url);
									jsonparams.size = size;
									jsonparams.listindex = idx;
									tbody.data("params", jsonparams);
								}
								that.dataToTable(idx, column, dat, num, fn,
										curpage, dypage);
								if (typeof listobj.attr("updown") != 'undefined'
										&& listobj.attr("updown") == '1') {// 消费点排序
									listobj.data("buycount", that.orderByData(dat, 1, 1, 0,column));
									listobj.data("curcount", that.orderByData(dat, 2, 1, 1,column));
								}

								var helpObj = $(".chartbtn_help:eq(" + idx
										+ ")");
								if (helpidx) {
									helpObj = $(".chartbtn_help:eq(" + helpidx
											+ ")");
								}
								com.helpTip(helpObj, help);
								
								if(typeof execute.dataToMychart == 'function'){
									execute.dataToMychart(ajaxdata);
								}
							});
		}
	},
	dataToTable : function(idx, title, data, num, fn, curpage, dypage) {
		if (typeof num == 'undefined' || num == '') {// 每页显示条数
			num = 10;
		}
		if (typeof curpage == 'undefined' || curpage == '') {// 当前页
			curpage = 1;
		}
		var tableObj = $(".listInfoTable:eq(" + idx + ")"), isupdown = false, that = this;
		var dataObj = tableObj.find("tbody"), tableHead = tableObj
				.find("thead"), pageObj = tableObj.find(".tablePage");

		if (typeof tableObj.attr("updown") != 'undefined') {
			isupdown = true;
		}

		var total = data.length, cols = title.length;
		var threl = tableHead.find("th[rel]");
		if (threl.length > 0) {
			cols = 11;
			threl.each(function(i) {
				$(this).text(title[i]);
			});
		} else {
			var headHtml = [], updownHTML = "";
			tableHead.html("");
			headHtml.push("<tr>");
			for ( var i = 0; i < cols; i++) {
				if (i > 0 && isupdown) {
					updownHTML = "<span class='upbtn' evt='upevent' idx='"
							+ i
							+ "' downorup = '1'>　</span><span  class='downbtn' evt='upevent' idx='"
							+ i + "' downorup = '2'>　</span>";
				} else {
					updownHTML = "";
				}
				headHtml.push("<th idx='" + i + "'>" + title[i] + updownHTML
						+ "</th>");
			}
			headHtml.push("</tr>");
			tableHead.append(headHtml.join(""));
		}
		if (isupdown) {
			tableHead
					.find("span[evt='upevent']")
					.unbind()
					.bind(
							"click",
							function() {
								var thidx = $(this).attr("idx"), newdata = [], downorup = $(
										this).attr("downorup");
								if (thidx == '1' && downorup == '1') {
									newdata = tableObj.data("buycount");
									if (typeof newdata == 'undefined') {
										newdata = that.orderByData(data, 1, 1);
									}
								} else if (thidx == '2' && downorup == '1') {
									newdata = tableObj.data("curcount");
									if (typeof newdata == 'undefined') {
										newdata = that.orderByData(data, 2, 1);
									}
								} else {
									newdata = that.orderByData(data, thidx,
											downorup);
								}
								that.dataToTable(idx, title, newdata, num, fn,
										curpage, dypage);
							});
		}

		dataObj.html("");
		var moneyBol = false;
		if ($("a[money]").length > 0 && $("a[money]").attr("money") != 0) {
			moneyBol = true;
		}
		for ( var i = 0; i < total; i++) {
			var tempData = data[i];
			var trHtml = [];
			trHtml.push("<tr axis='1'>");
			var totalNum = 0;
			for ( var j = 0; j < cols; j++) {
				var tempNum = tempData[j];
				var tdColor = "";
				if (!moneyBol && threl.length > 0 && j > 0) {
					if (j == 1) {
						totalNum = tempNum;
					} else {
						if (totalNum > 0) {
							tempNum = tempNum / totalNum * 100;
							tempNum = com.fixedStr(tempNum);

							if (tempNum > 20) {
								tdColor = "#c2d69a";
							} else if (tempNum > 10 && tempNum <= 20) {
								tdColor = "#d7e4bc";
							} else if (tempNum > 2 && tempNum <= 10) {
								tdColor = "#eaf1dd";
							} else if (tempNum >= 0 && tempNum <= 2) {
								tdColor = "#f2dddc";
							}
							if (tdColor != '') {
								tdColor = "background:" + tdColor;
							}
							if (parseFloat(tempNum) > 100) {
								tempNum = 100;
							}
							tempNum += "%";
						} else {
							tempNum = '--';
						}
					}
					trHtml.push("<td idx='" + j + "' style='" + tdColor + "'>"
							+ tempNum + "</td>");
				} else {
					trHtml.push("<td idx='" + j + "'>" + com.fixedStr(tempNum)
							+ "</td>");
				}
			}
			trHtml.push("</tr>");
			dataObj.append(trHtml.join(""));
		}

		var mod = total % num;
		if (mod > 0) {
			mod = num - mod;
		}
		if (total == 0) {
			mod = num;
		}
		for ( var i = 0; i < mod; i++) {
			var temp = [];
			temp.push("<tr axis='2'>");
			for (j = 0; j < cols; j++) {
				temp.push("<td>&nbsp;</td>");
			}
			temp.push("</tr>");
			dataObj.append(temp.join(""));
		}
		tableObj.find("table tr:nth-child(even)").addClass("tdodd");
		tableObj.find("table tr:nth-child(odd)").addClass("tdBgColor");

		if (typeof fn == 'function') {
			fn();
		}
		if (dypage) {
			this.dypageNext(dataObj, curpage);
		} else {
			com.pagePreOrNext(num, curpage, total, tableObj);
		}
	},
	orderByData : function(arr, i, o, idx,column) {
		var v = [];
		if (arr != null) {
			v = arr.slice(0);
			v.sort(function(a, b) {
				if (typeof o != 'undefined' && o == '1') {// 降序
					return a[i] < b[i] ? 1 : -1;
				} else {// 升序
					return a[i] > b[i] ? 1 : -1;
				}
			});
			if (typeof idx != 'undefined') {
				var obj = $(".drawInfo:eq(" + idx + ")");
				if (obj.length > 0) {
					var key = [], data = [], ajaxdata = {};
					var len = v.length, len = len > 10 ? 10 : len;
					for ( var j = 0; j < len; j++) {
						key[j] = v[j][0];
						data[j] = v[j][i];
					}
					ajaxdata.key = key;
					var adata = [];
					adata[0] = data;
					ajaxdata.val = adata;
					ajaxdata.column = column;
					ajaxdata.name = column[Number(idx+1)];
					DrawCharts.anayDataToChart(idx, ajaxdata, 6);
//					drawEcharts.solveData(idx,6,ajaxdata);
				}
			}
		}
		return v;
	},
	dypageNext : function(dataObj, currentPage) {
		var url = dataObj.data("url"), params = dataObj.data("params");
		var pagenum = params.pageSize, psize = params.size, size = 0, listindex = params.listindex;
		if (typeof psize != 'undefined' && psize.length > 0) {
			size = parseInt(psize[0]);
		}
		params.pageIndex = currentPage;

		var totalPage = Math.ceil(size / pagenum);
		var pageObj = $(".tablePage"), pre = pageObj.find(".pre"), next = pageObj
				.find(".next");

		var fn = null;
		if (typeof execute.editShow != 'undefined') {
			fn = execute.editShow;
		}
		var that = this;
		if (totalPage > 1) {
			pageObj.show();
			if (currentPage > 1) {
				pre.css("cursor", "pointer").unbind().bind(
						"click",
						function() {
							that.listDataInfo(listindex, url, pagenum, fn,
									null, null, params, currentPage - 1);
						});
			} else {
				pre.css("cursor", "").unbind();
			}
			if (currentPage < totalPage) {
				next.css("cursor", "pointer").unbind().bind(
						"click",
						function() {
							that.listDataInfo(listindex, url, pagenum, fn,
									null, null, params, currentPage + 1);
						});
			} else {
				next.css("cursor", "").unbind();
			}
			pageObj.find("span").html(
					"<em>" + currentPage + "</em>/" + totalPage);
		} else {
			pageObj.hide();
		}

	},
	subTrData : function(obj) {
		// var data = ['aadsfsdfsdf','sdfsdfsdfsdbb'];
		var cols = $(obj).siblings().length + 1, part = $(obj).parent();
		var dID = part.find("td:eq(0)").html();

		if (part.next().attr("info")) {
			part.next().remove();
		} else {
			var trHtml = [];
			trHtml.push("<tr info='1' rel='" + dID + "'><td colspan='" + cols
					+ "'>" + common.loadImg(50) + "</td></tr>");
			$(trHtml.join("")).insertAfter(part);

			var jsonparams = dateAndApp.params();
			jsonparams.deviceId = dID;
			$.post("ajax/topUsersByDevice", jsonparams, function(dat) {
				common.timeoutEvent(dat);
				var data = $.parseJSON(dat);
				var dUser = data.accountids;
				var users = dUser.split(",");
				var len = users.length;

				var userHTML = [];
				userHTML.push("<ul id='deviceUsers'>");
				userHTML.push("<li class='lititle'>"
						+ common.getTip("deviceuser") + "：</li>");
				if (dUser != '' && len > 0) {
					for ( var i = 0; i < len; i++) {
						userHTML.push("<li>" + users[i] + "</li>");
					}
				}
				userHTML.push("</ul>");
				part.parent().find("tr[rel='" + dID + "'] td").html(
						userHTML.join(""));
			});
		}
	},
	trMore : function(idx, min) {
		var objP = $(".listInfoTable:eq(" + idx + ")");
		var ths = objP.find("th").length;
		var tbody = objP.find("tbody");
		var trs = tbody.find("tr").length;
		for ( var i = min - trs; i > 0; i--) {
			var html = "<tr>";
			for ( var j = 0; j < ths; j++) {
				html += "<td>&nbsp;</td>";
			}
			html += "</tr>";
			tbody.append(html);
		}
	},
	setFlownumber : function(idx) {
		var obj = $(".listInfoTable:eq(" + idx + ")");
		var ftd = obj.find("tr[axis='1']").find("td:eq(0)");
		ftd.each(function(i) {
			$(this).html(i + 1);
		});
	},
	getAjaxData : function(method, fn, flag) {
		var jsonparams = dateAndApp.params(), url = "ajax/getResult?metric="
				+ method;
		if (flag && flag == 1) {
			delete jsonparams.server;
		}
		$.post(url, jsonparams, function(data) {
			common.timeoutEvent(data);
			var ajaxdata = $.parseJSON(data);
			fn(ajaxdata);
		});
	}
};

var com = {
	totalData : function(idx, method,ismethod) {
		var obj = $(".totalNum a:eq(" + idx + ")");
		obj.css({
			"padding" : "10px 0px"
		});
		obj.find("span").html('<div class="loading"></div>');
		var isreal = false, emobj = obj.find("em");
		if (emobj.hasClass("realtimebtn")) {
			isreal = true;
			emobj.removeClass("realtimebtn");
		}
		emobj.html("");
		// var ajaxdata = {"name":["dfdf"],"val":[[323]]};
		var jsonparams = dateAndApp.params(),url = "";
		if(ismethod&&ismethod==2){
			url = "ajax/getResult4Channel?metric=" + method;
		}else{
			url = "ajax/getResult?metric=" + method;
		}	
		$.post(url + "&flag=12", jsonparams,
				function(data) {
					common.timeoutEvent(data);
					var ajaxdata = $.parseJSON(data);
					var name = ajaxdata.name, val = ajaxdata.val;
					obj.css({
						"padding-top" : "20px"
					});
					obj.find("span").html("");
					if (val.length > 0 && val[0].length > 0) {
						var tval = val[0][0];
						if (tval == '' || tval == null || tval == 'null'
								|| isNaN(tval)) {
							tval = "--";
						} else {
							tval = com.fixedStr(tval);
						}
						obj.find("span").text(tval);
					} else {
						obj.find("span").text("--");
					}
					if (isreal) {
						emobj.addClass("realtimebtn");
					}
					emobj.text(name);
				});
	},
	pagePreOrNext : function(num, curpage, total, tableObj) {
		
		var pageObj = tableObj.find(".tablePage"), dataObj = tableObj
				.find("tbody");
		var page = Math.ceil(total / num), pre = pageObj.find(".pre"), next = pageObj
				.find(".next");

		var start = (curpage - 1) * num;
		var end = start + num;
		dataObj.find("tr").hide();
		var tdDraw = dataObj.find(".drawInfoContent");
		if(tdDraw.length>0){
			tdDraw.parentsUntil("tr").parent().remove();
			$(".trhoverBg").removeClass("trhoverBg");
		}
		for ( var i = start; i < end; i++) {
			dataObj.find("tr:eq(" + i + ")").show();
		}

		if (page > 1) {
			pageObj.show();
			var that = this;
			if (curpage > 1) {
				pre.css("cursor", "pointer").unbind().bind("click", function() {
					that.pagePreOrNext(num, curpage - 1, total, tableObj);
				});
			} else {
				pre.css("cursor", "").unbind();
			}
			if (curpage < page) {
				next.css("cursor", "pointer").unbind().bind(
						"click",
						function() {
							that.pagePreOrNext(num, curpage + 1, total,
									tableObj);
						});
			} else {
				next.css("cursor", "").unbind();
			}
			pageObj.find("span").html("<em>" + curpage + "</em>/" + page);
		} else {
			pageObj.hide();
		}
	},
	helpTip : function(obj, title) {
		if (title && typeof title != 'undefined') {
			var html = [];
			html.push("<div class='helpinfoTip'>");
			html.push("<div class='helpinfoTitle'>");
			html.push("</div>");
			html.push("<div class='helpinfobg'>");

			var arr = [];
			if (title.indexOf("<br/>") > -1) {
				arr = title.split("<br/>");
			} else if (title.indexOf("&lt;br/&gt;") > -1) {
				arr = title.split("&lt;br/&gt;");
			} else if (title.indexOf("&lt;br&gt;") > -1) {
				arr = title.split("&lt;br&gt;");
			} else {
				arr = title.split("<br>");
			}
			html.push("<ul>");
			for ( var i = 0; i < arr.length; i++) {
				if (i > 0) {
					html.push("<li>");
				} else {
					html.push("<li style='border-top:none'>");
				}
				html.push(arr[i]);
				html.push("</li>");
			}
			html.push("</ul>");
			html.push("</div>");
			html.push("<div class='helpinfobm'>");
			html.push("</div>");
			html.push("</div>");

			obj.html(html.join(""));

			obj.unbind("click");
			obj.bind("click", function() {
				var help = obj.find(".helpinfoTip");
				if (help.css("display") != 'none') {
					help.slideUp();
				} else {
					help.slideDown();
				}
			});
		}
	},
	splitDate : function(str) {
		var arr = str.split(":");
		var date = new Date();
		var y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
		return Date.UTC(y, m, d, arr[0], arr[1]);
	},
	fixedStr : function(num) {
		try {
			if (num == null || num == 'null') {
				num = '';
			}
			if (num % 1 != 0) {
				return num.toFixed(2);
			} else {
				return num;
			}

		} catch (e) {
			return num;
		}
	},
	dataFixed : function(data) {
		var newdata = [];
		for ( var i = 0; i < data.length; i++) {
			var temp = data[i], temparr = [];
			for ( var j = 0; j < temp.length; j++) {
				temparr[j] = com.fixedStr(temp[j]);
			}
			newdata[i] = temparr;
		}
		return newdata;
	},
	setNull : function(key,data){//设置0为null
		var val = [],idx = 0,didx = data.length - 1;
		val = data[didx];
		var date = new Date(),now = new Date(),ms = [];
		for(var i=key.length-1;i>=0;i--){
			ms = key[i].split(":");
			date.setHours(Number(ms[0]), Number(ms[1]));
			if(date <= now){
				idx = i+1;
				break;
			}
		}
		for(var i=val.length-1;i>=idx;i--){
			if(val[i]==0){
				val[i] = null;
			}
		}
		data[didx] = val;
		return data;
	},
	getTestJSON : function(){
		var params = dateAndApp.params();
		$.post("ajax/getResult?metric=test",params,function(data){
			console.log(data);
		});
	},
	//根据差值获取后七天的预测数据，val为二维数组
	getForecastData: function(val) {
		var arrResult = [];
		var v = val.length;
		for (var i = 0; i < v; i++) {
			if (typeof val[i] != 'undefined') {
				var arrEach = [];
				var arrCopy = val[i].slice(0);
				var l = arrCopy.length;
				arrEach.push(arrCopy[l - 1]);
				for (var k = 0; k < 7; k++) {
					var num = 0;
					if (l == 7) {
						for (var j = 6; j > 0; j--) {
							num += arrCopy[j] - arrCopy[j - 1];
						}
						num = num / 6;
					} else {
						for (var j = 0; j < 7; j++) {
							num += arrCopy[l - j - 1] - arrCopy[l - j - 2];
						}
						num = num / 7;
					}
					arrEach.push(num + arrCopy[l - 1]);
					arrCopy.push(num + arrCopy[l - 1]);
					l++;
				}
				for (var m = 0; m < l - 8; m++) {
					arrEach.unshift(null);
				}
				arrResult.push(arrEach);
			}
		}
		return arrResult;
	}
};
