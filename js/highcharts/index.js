$(function(){
	meau.init();
});
var demoname = "demo@reyun.com";
var meau = {
	init : function(){
//		 this.segmentMeau();
		 this.hidePageInfo();
		 this.powerCheck();
		 this.manageEvent();
		
		 $("#loginout").click(function(){
			 window.location.href="logout";
		 });
		 $("#uname").find("span").text($("#loginname").val());
		 
		 var that = this;
		 $(".languageInfo a").click(function(){
			 that.resetLanguage(this);
		 });
		 var loc = $("#locale").val();
		 $(".languageInfo a[lang='"+loc+"']").addClass("ahover");
		 this.noticeMeau();
		 
		 this.getNoticeCount();
		 
		 if($("#mygamemeau").length>0){
			 this.appMeau();
			 $("#mygamemeau").click(function(event){
				 if($("#gameDiv").css("display")!='none'){
					 $("#gameDiv").hide();
					 $(this).removeClass("mygamelist");
				 }else{
					 var w = $(this).width()*1.5;
					 $("#gameDiv").slideDown();
					 $("#gameDiv").width(w);
					 EventUtil.stopPropagation(event);
					 $(this).addClass("mygamelist");
				 }
				 $("#mygameul").show();
			 });
		 }
		 $(".realtimebtn").attr("title",common.getTip("realtime"));
	},
	hidePageInfo : function(){
		if(window.top.location!=window.location){
			 var that = this;
			 if($("#mygame").length>0){
				 $(".subheader").show();
				 $("#mygame").show();
				 $("#mygame span").click(function(){
					 window.location.href = that.getRootHref()+"/appgame";
				 });
				 $("#userInfos").hide();
			 }else{
				 $("#subheader").hide();
			 }
			
			 $("#header").hide();
			 
			 $("#foot").hide();
			 $("#meautempDiv").show();
		}
	},
	meau : function(){
		
		var that = this;
		$("#dataMeau").delegate("a","click",function(){
			
			var activePre = $(this).attr("class").split(" ").pop();
			var ulObj = $(this).siblings("ul");
			var isChild = false; //是否有子菜单
			
			if(ulObj.length>0){
				isChild = true;
			}
			if(activePre.indexOf("active")>-1&&typeof $(this).attr("urlname")=='undefined'){
				$(this).removeClass(activePre);
				
				if(isChild){
					ulObj.slideUp();
				}
			}else{
				var nowActive = activePre+"active";
				var parent = $(this).parentsUntil("ul").parent();
				
				if(typeof parent.attr("id")=='undefined'){
					
					if($("."+nowActive).siblings("ul").length>0){
						$("."+nowActive).siblings("ul").slideUp();
					}
					$("."+nowActive).removeClass(nowActive);
					
				}else{
					$(".sidebar a[class$='active']").each(function(){
						var c = $(this).attr("class").split(" ").pop();
						$(this).removeClass(c);
					});
					$("ul[class]").slideUp();
				}
				
				$(this).addClass(nowActive);
				if(isChild){
					ulObj.slideDown();
				}else{
					var urlname = $(this).attr("urlname");
					if(typeof urlname!='undefined' && urlname!=''){
						var href = that.getRootHref();
						window.location = href+"/"+urlname;
					}
					
				}
			}
			
		});
	},
	homeMeau : function(idx){
		 $(".headerinfo .active").removeClass("active");
		 $(".headerinfo a:eq("+idx+")").addClass("active");
	},
	appMeau : function(){
		$("#mygame span").click(function(){
			 window.location.href = that.getRootHref()+"/appgame";
		});
		var obj = $("#mygameul");
		obj.html("");
		var that = this;
		$.post("ajax/getMyApps?sign=1",{r:Math.random()},function(dat){
			common.timeoutEvent(dat);
			var data = eval("("+dat+")");
			var liHTML = [];
			 for(var i=0;i<data.length;i++){
				 liHTML = [];
				 liHTML.push("<li>");
				 var os = data[i].os;
				 if(os=='0'){
					 cls = 'appleFFF';
				 }else if(os=='1'){
					 cls = 'androidFFF';
				 }else{
					 cls = 'webFFF';
				 }
				 liHTML.push('<a href="javascript:void(0)" class="'+cls+'" apk="'+data[i].appkey+'" title="'+data[i].name+'">'+data[i].name+'</a>');
				 liHTML.push("</li>");
				 obj.append(liHTML.join(""));
			 }
			 $("#mygameul a").click(function(){
				 var apk = $(this).attr("apk"),rootname = that.getRootName();
				if(rootname.indexOf("customHopper")>-1){
					rootname = "customevent";
				}
				if(rootname.indexOf("user_define") > -1){
					window.location.href = that.getRootHref() + '/inapp?appkey='+apk;
				} else {
					window.location.href = that.getRootHref() + '/inapp?appkey='+apk+"&report="+rootname;
				}
			 });
			 
			 EventUtil.addHandler(document, "click", function(){
				 $("#gameDiv").hide();
				 $("#mygamemeau").removeClass("mygamelist");
			 });
		});
	},
	meauInit : function(flag){
		this.homeMeau(1);
		switch(flag){
			case 1: 
				this.classMeau(".a1", 0);
				break;
			case 2://
				this.classMeau(".a1", 2);
				break;
			case 3://
				this.classMeau(".a1", 5);
				break;
			case 4://
				this.classMeau(".a1", 6);
				break;
			case 5://
				this.classMeau(".a1", 7);
				break;
			case 6://
				this.classMeau(".a2", 0);
				break;
			case 7://
				this.classMeau(".a2", 2);
				break;
			case 8://
				this.classMeau(".a3", 0);
				break;
			case 9://
				this.classMeau(".a3", 2);
				break;
			case 10://
				this.classMeau(".a4", 0);
				break;
			case 11://
				this.classMeau(".a4", 1);
				break;
			case 12: //
				this.classMeau(".a5", 0);
				break;
			case 13: //
				this.classMeau(".a5", 5);
				break;
			case 14: //
				this.classMeau(".a5", 6);
				break;
			case 15://
				this.classMeau(".a5", 7);
				break;
			case 16://
				this.classMeau(".a5", 8);
				break;
			case 17://
				this.classMeau(".a6", 0);
				break;
			case 18://
				this.classMeau(".a7", 0);
				break;
			case 19://
				this.classMeau(".a7", 1);
				break;
			case 20://
				this.classMeau(".a7", 2);
				break;
			case 21://
				this.classMeau(".a7", 3);
				break;
			case 22://
				this.classMeau(".a7", 4);
				break;
			case 23://
				this.classMeau(".a7", 5);
				break;
			case 24://
				var meauidx = 0; //segment
				var href = window.location.href,hrefparams = href.split("?"),parentLi = $(".sencondMeau a[urlname='segment']").parent(),parentUL = parentLi.parent();
				if(hrefparams.length>1){
					var urlparams = hrefparams[1];
					meauidx = parentUL.find("li").index(parentUL.find("a[urlname='segment?"+urlparams+"']").parent());
				}
				this.classMeau(".a8", meauidx);
				break;
			case 25://
				this.classMeau(".a10", 0);
				break;
			case 26://
				this.classMeau(".a10", 1);
				break;
			case 27://
				this.classMeau(".a5", 1);
				break;
			case 28://
				this.classMeau(".a5", 2);
				break;
			case 29://
				this.classMeau(".a5", 3);
				break;
			case 30://
				this.classMeau(".a3", 1);
				break;
			case 31://
				this.classMeau(".a5", 4);
				break;
			case 32://
				this.classMeau(".a2", 1);
				break;
			case 33: 
				this.classMeau(".a1", 1);
				break;
			case 34://
				this.classMeau(".a3", 3);
				break;
			case 35://
				this.classMeau(".a1", 3);
				break;
			case 36://
				this.classMeau(".a1", 4);
				break;
			case 37://
				var meauidx = 0; //
				var href = window.location.href,hrefparams = href.split("?"),parentUL = $(".a9").next();
				if(hrefparams.length>1){
					var urlparams = hrefparams[1];
					var name = urlparams.split("&")[0].split("=")[1];
					meauidx = parentUL.find("li").index(parentUL.find("a[href='user_define?name="+name+"']").parent());
				}else{
					meauidx = parentUL.find("li").index(parentUL.find("a[urlname='"+meau.getRootName()+"']").parent());
				}
				this.classMeau(".a9", meauidx);
				break;
			default:break;
		}
	},
	classMeau : function(obj,idx,tidx){
		var cn = obj.substring(1);
		$(obj).addClass(cn+"active");
		var sec = $(obj).parent().find(".sencondMeau");
		sec.show();
		sec.find(".sencondMeauAactive").removeClass("sencondMeauAactive")
		$(sec.find("a").get(idx)).addClass("sencondMeauAactive");
		
		if(typeof tidx !='undefined'){
			var trd = sec.find(".thirdMeau");
			trd.show();
			$(trd.find("a").get(tidx)).addClass("thirdMeauAactive");
		}
		return sec;
	},
	gameMeau:function(id1,id2){
		if($("#"+id1).length>0&&$("#"+id2).length>0){
			var CommendNavID = $i(id1);
			var CommendNavPopupID = $i(id2);
			function showPopup()
			{
			setTimeout(function(){CommendNavPopupID.style.display= "block";}, 200);
			}
			function hidePopup()
			{
			setTimeout(function(){CommendNavPopupID.style.display= "none";}, 500);
			}
			CommendNavID.onmouseover = showPopup;
			CommendNavID.onmouseout = hidePopup;
		}
	},
	getTop:function(obj){
		if(obj.offsetParent){
			return getTop(obj.offsetParent)+obj.offsetTop;
		}
		return obj.offsetTop;
	},
	getLeft:function(obj){
		if(obj.offsetParent){
			return getLeft(obj.offsetParent)+obj.offsetLeft;
		}
		return obj.offsetLeft;
	},
	resizeWidth : function(){
		var w = $("#content").width()-270,d = $(document).height(),wd = $(window).height() ;
		
		if(d == wd ||d == wd+4){
			w = w - 17;
		}
		$(".maincont").width(w);
	},
	resizeHeight : function(){
		var h1 = $("#content").height(),
			h2 = $(".maincont").height();
		var h = Math.max(h1,h2);
		$(".maincont").height(h);
	},
	footTop : function(){
		
		window.setTimeout(function(){
			var st = $(document).height()-$("#foot").height();
			$("#foot").css({"position":"absolute","top":st,"left":0});
		}, 100);
	},
	getRootHref : function(){
		var location = window.location.href;
		var arr = location.split("/");
		arr.pop();
		var href = arr.join("/");
		return href;
	},
	getRootName : function(){
		var location = window.location.href;
		var arr = location.split("/");
		var method = arr.pop();
		if(method=='customHopper'){
			method = "customevent";
		}
		if(method.indexOf("?")>-1){
			method = method.split("?").shift();
		}
		return method;
	},
	manageEvent : function(){
		var that = this;
		$(".headerinfo a").click(function(){
			var urlname = $(this).attr("urlname");
			if(typeof urlname!='undefined' && urlname!=''){
				var href = that.getRootHref();
				window.location = href+"/"+urlname;
			}
		});
	},
	resetLanguage : function(obj){
		var lag = $(obj).attr("lang");
		if(typeof lag !='undefined'&&lag!=''){
			$.post("ajax/setLanguage",{"request_locale":lag,r:Math.random()},function(data){
				common.timeoutEvent(data);
				window.location.reload(true);
			});
		}
	},
	noticeMeau : function(){
		$("#notice").click(function(){
			window.location.href = meau.getRootHref()+"/information";
		});
	},
	getNoticeCount : function(){
		$.get("ajax/getInformationNoScanCount",{r:Math.random()},function(data){
			try{
				common.timeoutEvent(data);
				var d = eval("("+data+")");
				var count = d.count;
				$("#notice").find("em").html(count);
			}catch(e){
				$("#notice").find("em").html("0");
			}
			
		});
		var that = this;
//		window.setTimeout(function(){
//			that.getNoticeCount();
//		}, 1000*10);
	},
	powerCheck : function(){
		 var userflag = $("#userflag").val(),isusermanager = $("#isusermanager").val(),p = $("#dataMeau"),isspecialaccount = $("#isspecialaccount").val();
		 if(isspecialaccount=="1"){
			 var emailMeau = ["consumePointManage","channelmanage","warnmanage"];
			 for(var i=0;i<emailMeau.length;i++){
				 var li = p.find("a[urlname='"+emailMeau[i]+"']").parent();
				 li.hide();
				 li.attr("hide",1);
			 }
			 $("#manage").parent().hide();
			 $("#amanage").html("&nbsp;").removeAttr("id").css({"cursor":"default"});
		 }
		 var winoper = $("#winoper").val();
		 if(winoper!=''&&winoper=='0'){
			 $("#apStoremeau").show();
		 }else{
			 $("#apStoremeau").hide();
		 }
		 if(userflag!='1'&&isusermanager!='1'){
			 $("#manage").parent().hide();
			 var meaus = [];
			 p.find("a[urlname]").each(function(i){
				 meaus[i] = $(this).attr("urlname");
			 });
			 var powerkey = $("#powerkey").val();
			 if(powerkey!="-1"){
				 powerkey = "," + powerkey;
				 if(powerkey.indexOf("channeldata")>-1){
					 powerkey = powerkey + "channeldatacps" +",";
				 }
				 for(var i=0;i<meaus.length;i++){
					 var li = p.find("a[urlname='"+meaus[i]+"']").parent();
					 if(powerkey.indexOf(","+meaus[i]+",")==-1){
						 li.hide();
						 li.attr("hide",1);
					 }
				 }
				 if(powerkey.indexOf("segment")>-1){
					 this.segmentMeau();
				 }
			 }
		 }else{
			 this.segmentMeau();
		 }
		 $(".thirdMeau").each(function(){
			 if($(this).find("li").length==$(this).find("li[hide]").length){
				 $(this).parent().hide();
				 $(this).parent().attr("hide",1);
			 }
		 });
		 $(".sencondMeau").each(function(){
			 if($(this).find("li").length==$(this).find("li[hide]").length){
				 $(this).parent().hide();
			 }
		 });
		 
		 var mName = meau.getRootName(),pw = $("#powerkey").val();
		 if(userflag=='1' || isusermanager=='1' || pw.indexOf(mName) > -1){
			$.post("ajax/getUserDefineReport",function(data){
	//			 data = "{\"val\":[{\"adjust市场报表\":\"lt_infos\"}],\"size\":1}";
				 var meaujson = $.parseJSON(data),meausize = meaujson.size,meauval = meaujson.val;
				 if(meausize>0){
					 $("#zdyReport").show();
					 var firMeauUL = $("#zdyReport ul");
					 for(var i=0;i<meausize;i++){
						 var tempmeau = meauval[i];
						 for(var m in tempmeau){
							 if(tempmeau[m] == "lt_infos"){
								 firMeauUL.append('<li><a class="sencondMeauA" urlname="adjust">'+m+'</a></li>');
							 }else if(tempmeau[m] == "adjustrevenue"){
								 firMeauUL.append('<li><a class="sencondMeauA" urlname="adjustrevenue">'+m+'</a></li>');
							 }else{
								 firMeauUL.append('<li><a class="sencondMeauA" href="user_define?name='+tempmeau[m]+'">'+m+'</a></li>');
							 }
							 
						 }
						 
					}
				}
			});
		 }
		 
		 this.meau();
		 
	},
	judgeFarmat : function (str){
		str = str.split(" ").join("");
		var reg = /^[A-Za-z0-9\u4E00-\u9FA5._-\，\；]+$/;
		if(str.match(reg)){
			return true;
		}else{
			return false;
		}
		//return str.match(reg);
	},
	loadOperate: function(){
		var t = $(document).scrollTop()+$(window).height()/2-50;
		$("body").prepend("<div id='blackdiv' style='width:100%;height:"+$(document).height()+"px;position:absolute;z-index:99999;background:#000;opacity:0.3;filter:alpha(opacity=30);'>" +
		 "<div class='loading' style='top:"+t+"px;position:absolute;left:50%;height:60px;width:60px;'></div></div>");
	},
	removeLoadOperate : function(){
		$("#blackdiv").remove();
	},
	getRealLength : function(str,maxlen){
		var len = str.replace(/[^\x00-\xff]/g,"aa").length;
		if(typeof maxlen =='undefined'){
			maxlen = 100;
		}
		if(len>maxlen){
			return "-1";
		}else{
			return 1;
		}
	},
	segmentMeau : function(){
		var that = this;
		return false;
		var mName = meau.getRootName(),pw = $("#powerkey").val();
		if(pw.indexOf(mName) == -1){return false;}

		$.post("ajax/getSegBookmark",{r:Math.random(),"report":"segment"},function(dat){
			//common.timeoutEvent(dat);
			var jsondata  = $.parseJSON(dat);
			var pli = $(".sencondMeau a[urlname='segment']").parent();
			$(".sencondMeau li[sg='1']").remove();
			for(var i=0;i<jsondata.length;i++){
				var data = jsondata[i];
				var html = '<li sg="1"><a href="javascript:void(0)" class="sencondMeauA" urlname = "segment?sid='+data.id+'">'+data.name+'</a></li>'
				pli.after(html);
			}
		});
	}
	
};
