window.$i= window.$id=function(id){ return document.getElementById(id);};
window.$m = window.$name = function(name){ return document.getElementsByName(name);};
/*
*	数组元素根据值删除
*/
Array.prototype.removeByValue = function(val) {
	for(var i=0; i<this.length; i++) {
		if(this[i] == val) {
			this.splice(i, 1);
			break;
		}
	}
};
/*
*	数组元素根据下标删除，从0开始
*/
Array.prototype.removeByIndex = function(idx) {
	for(var i=0; i<this.length; i++) {
		if(i == idx) {
			this.splice(i, 1);
			break;
		}
	}
};
/*
*   去除数组中重复元素
*/
Array.prototype.toUnique = function(){
	var temp = [];
	var arr = [];

	for(var i=0; i<this.length; i++){

		var val = this[i];

		if(!temp[val]){
			arr.push(val);
			temp[val] = true;
		}
	}

	return arr;
};
/*
 * 取数组最大值
 * */
Array.prototype.max = function(bol){
	 var i, max = this[0];
	 if(bol){
		 max = Math.abs(max);
	 }
	 for (i = 1; i < this.length; i++)
	 {
		 var n = this[i];
		 if(bol){
			 n = Math.abs(n);
		 }
	     if (max < n)
	     max = n;
	 }
	 return max;
};
Array.prototype.nolen = function(){
	var count = 0;
	for(i=0;i<this.length;i++){
		if(this[i] != null){
			count++;
		}
	}
	return count;
};
Array.prototype.sum = function(){
	var total = 0;
	for(var i=0;i<this.length;i++){
		total+=Number(this[i]);
	}
	return total;
};
var numB = {
		numTopercent : function(num,total,s){
			if(total==0||typeof num =='undefined'){
				return 0;
			}else{
				var temp = num/total*100;
				temp = temp.toFixed(1);
				return Number(temp);
			}
		}
};
var ry_JSON = {
	fmartData:function(jsonstr){//str to json
		//return $.parseJSON(jsonstr);
		return jsonstr;
	},
	mergeData:function(str1,str2){//合并json
		var objStr1 = this.fmartData(str1),
			objStr2 = this.fmartData(str2);
		for(var i=0;i<objStr1.length;i++){
			var temp = objStr2[i];
			for(var k in temp){
				objStr1[i][k] = temp[k];
			}
		}
		return objStr1;
	}
};
var myDate = {
	prevMonthFirstDay : function(){
		 var d = new Date();
		 yy = d.getFullYear();
		 m = d.getMonth();
		 if(m==0){
			 mm = 12;
			 yy--;
		 }else{
			 mm = ("00"+m).slice(-2);
		 }
		
		 dd = "01";
		 return yy+"-"+mm+"-"+dd;
	},
	today : function(){
		var d = new Date();
		 yy = d.getFullYear();
		 mm = ("00"+(d.getMonth()+1)).slice(-2);
		 dd = ("00"+d.getDate()).slice(-2);
		 return yy+"-"+mm+"-"+dd;
	},
	formatDate : function(str,n){
		var dd, mm, yy;   
		var reg = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
		if (typeof str!='undefined' && str.match(reg)) {
			arr = str.match(reg);
			yy = Number(arr[1]);
		    mm = Number(arr[2])-1;
		    dd = Number(arr[3]);
		} else {
		    var d = new Date();
		    yy = d.getFullYear();
		    mm = ("00"+(d.getMonth())).slice(-2);
		    dd = ("00"+d.getDate()).slice(-2);
		}
		return this.dateToStr(yy, mm, dd, n);
	},
	dateToStr : function(yy, mm, dd,n) {
	    var s, d, t, t2;
	    t = Date.UTC(yy, mm, dd);
	    t2 = n * 1000 * 3600 * 24;
	    t+= t2;
	    d = new Date(t);
	    s = d.getFullYear() + "-";
	    s += ("00"+(d.getMonth()+1)).slice(-2) + "-";
	    s += ("00"+d.getDate()).slice(-2);
	    return s;
	},
	initDate : function(_date, n, flag){
		//_date日期，为空默认为当前日期;n为当前日期加n天，负数推前
		var startDate = "",endDate = "";
		if(n>0){
			startDate = this.formatDate(_date, 0);
			endDate = this.formatDate(startDate, n);
		}else{
			endDate = this.formatDate(_date, 0);
			startDate = this.formatDate(endDate, n);
		}
		if(flag==1){//昨天
			endDate = startDate;
		}
		return [startDate,endDate];
	}
};
var fmtStr = {
		nullTo : function(Str,def){
			if(typeof Str == 'undefined' || Str == ''){
				return def;
			}else{
				return Str;
			}
		}
};
var EventUtil = {
		addHandler: function(element, type, handler){//绑定事件
			this.removeHandler(element, type, handler);
			if (element.addEventListener)
			{	
				if(type=='propertychange'){
					type = "input";
				}
				element.addEventListener(type, handler, false);
			} else if (element.attachEvent)
			{
				element.attachEvent("on" + type, handler);
			} else {
				element["on" + type] = handler;
			}
		},
		removeHandler: function(element, type, handler){//移除事件
			if (element.removeEventListener)
			{	
				element.removeEventListener(type, handler, false);
			} else if (element.detachEvent)
			{
				element.detachEvent("on" + type, handler);
			} else {
				element["on" + type] = null;
			}
		},
		getEvent: function(event){//
			return event ? event : window.event;
		},
		getTarget: function(event){//
			return event.target || event.srcElement;
		},
		preventDefault: function(event){//阻止默认事件
			if (event.preventDefault)
			{
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
		},
		stopPropagation: function(event){//阻止事件流
			
			if (event.stopPropagation)
			{
				event.stopPropagation();
			} else {
				event.cancelBubble = true;
			}
		},
		getCharCode: function (event) {//取字符编码
	        if (typeof event.charCode == "number") 
			{
	            return event.charCode;
	        } else {
	            return event.keyCode;
	        }
	    },
	    getCliboardText: function(event){//获取剪贴板数据
			var clipboardData = (event.clipboardData || window.clipboardData);
			return clipboardData.getData("text");
		},
		setClipboardText: function(event, value){//设置剪贴板数据
			if (event.clipboardData)
			{
				return event.clipboardData.setData("text/plain", value);
			}else if (window.clipboardData)//IE
			{
				return window.clipboardData.setData("text", value);
			}
		}
};
function checkAll(obj,name){
	var bol = true;
	
	$(obj).click(function(){
		var chknow = $(this).attr("chknow");
		if(typeof chknow!='undefined'&&chknow=='1'){
			$(this).removeAttr("chknow");
			bol = false;
		}else{
			$(this).attr("chknow","1");
			bol = true;
		}
		$("input[type='checkbox'][name='"+name+"']").each(function(){
			this.checked = bol;
		});
	});
}
function getBrowserWidthHeight() {
    var intH = 0;
    var intW = 0;
    if (typeof window.innerWidth == 'number') {
        intH = window.innerHeight;
        intW = window.innerWidth;
    }
    else if (document.documentElement &&
        (document.documentElement.clientWidth ||
        document.documentElement.clientHeight)) {
        intH = document.documentElement.clientHeight;
        intW = document.documentElement.clientWidth;
    }
    else if (document.body &&
        (document.body.clientWidth || document.body.clientHeight)) {
        if (document.body.scrollHeight > document.body.clientHeight) {
            intH = document.body.scrollHeight;
            intW = document.body.scrollWidth;
        }
        else {
            intH = document.body.clientHeight;
            intW = document.body.clientWidth;
        }
    }
    return { width: parseInt(intW), height: parseInt(intH) };
}
var common = {
		taggleTableToChart : function(){ //四个按钮事件			
			$(".chartbtn_pic").unbind().bind("click",function(){
				var i = $(".chartbtn_pic").index(this);
				$(".chartbtn_table:eq("+i+")").removeClass("chartbtn_active_table");
				$(".chartbtn_pic:eq("+i+")").addClass("chartbtn_active_pic");
				$(".drawInfoTable:eq("+i+")").hide();
				var btnObj = $(this).parent().parent().find(".btn");
				if(btnObj.length>0){
					$(".drawInfo:eq("+i+")").show();
					btnObj.click();
				}else{
					if(typeof execute.onlyEvent == 'function'){
						execute.onlyEvent(i);
					}
					$(".drawInfo:eq("+i+")").show();
				}
			});
			
			$(".chartbtn_table").unbind().bind("click",function(){
				var i = $(".chartbtn_table").index(this);
				$(".drawInfo:eq("+i+")").hide();
				$(".drawInfoTable:eq("+i+")").show();
				$(".chartbtn_pic:eq("+i+")").removeClass("chartbtn_active_pic");
				$(".chartbtn_table:eq("+i+")").addClass("chartbtn_active_table");
			});
			
			var that = this;
			$(".chartbtn_down").unbind().bind("click",function(){
				var idx = $(".chartbtn_down").index(this);
				var tableObj = $("table[exporttable]:eq("+idx+")");
				that.downloadTable(tableObj);
			});
		},
		downloadTable : function(tableObj){
			var csv_text = tableObj.table2CSV({delivery:'value'});
			$('#data').val(csv_text);
			$("#export_button").click();
		},
		loadImg : function(height){
			if(typeof height == 'undefined'||height==''){
				height = 'height:100%';
			}else{
				height = 'height:'+height+'px';
			}
			if(typeof col == 'undefined'||col==''){
				col = 0;
			}
			var tableHTML = '<table style="width:100%;'+height+'"><tr><td><div class="loading"></div></td></tr></table>';
			return tableHTML;
		},
		loadImgList : function(height,col){
			if(typeof height == 'undefined'||height==''){
				height = 200;
			}
			if(typeof col == 'undefined'||col==''){
				col = 0;
			}
			var tableHTML = '<tr style="height:'+height+'px"><td colspan="'+col+'"><div class="loading"></div></td></tr>';
			return tableHTML;
		},
		getTip : function(tname){
			return $("p[tipname='"+tname+"']").html();
		},
		cloneJSON: function(para){
            var rePara = null;
            var type = Object.prototype.toString.call(para);
            if(type.indexOf("Object") > -1){
            	rePara = jQuery.extend(true, {}, para);
             }else if(type.indexOf("Array") > 0){
                 rePara = para.concat();
             }else{
                rePara = para;
	         }
            return rePara;
		},
		timeoutEvent : function(jsonStr){//{"status":"-1"}
			try{
				var result = $.parseJSON(jsonStr),status = result.status;
				if(typeof  status!='undefined' && status == "nologin"){
					//window.location.href = "index";
				}
			}catch(e){
				
			}
		}
};
