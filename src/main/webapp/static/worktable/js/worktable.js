/*
 * worktable.js
 * by macong 2012-03-20
 * 班组工作台js
*/
var unddoBeginCollapse = true;//待办层初始化是否折叠
var scrollFx;
var winSize = {};//用于判断是否resize了
//渲染菜单区域
var pageMap;//用于存储pageCode和url的键值对
window.addEvent('domready', function() {
	//定义布局对象
	var container=new Mui.Container({
		el:'bodyEl',
		items:[
			new Mui.Box({
				el:'topEl',
				position:'top',
				height:35,
				collapsed:false
			}),
			new Mui.Panel({
				el:'leftEl',
				position:'left',
				headerEl:'lheader',
				mainEl:'lmain',
				width:42,
				collapsed:false,
				gap:'0 5px 0 0',
				resizable:false,
				collapsedIconClass:'left-icon'
			}),
			new Mui.Panel({
				el:'innerTopEl',
				headerEl:'innerTopHeader',
				mainEl:'innerTopMain',
				position:'center'
			})
		]
	});
	container.render();
	renderMenuData();
	container.addEvent("resize",containerResize);
	//初始化左侧菜单相关
	scrollFx = new Fx.Scroll($("left_menu"));//初始化代办菜单的滚动对象
	renderLeftData();
	initLeftMenuEvent();
	initLoadingEvent();
	setMainFrameUrl(null,'index');//加载我的首页
});
var n=0;
function renderMenuData(){
	$("menuDataMess").setStyle("display","");
	n=0;
	pageMap = {};
	initMenuData();
	initPageData();
}

//初始化左侧代办数据
function renderLeftData(){
	$("left_menu").set("html","<img src='"+webRoot+"/static/worktable/images/worktable/o_loading.gif' style='margin-top:25px;'/>");
	$("undoFloatDiv_con").set("html","<img border='0' style='margin-top:1px; ' src='"+webRoot+"/static/worktable/images/worktable/load_portal.gif'/>");
	var myRequest = new Request({
		method: 'get',
		url: webRoot+'/admin/worktable/toTaskMessage?time='+(new Date()).getTime(),
		onSuccess: function(responseText, responseXML){
	        $("left_menu").set("html",responseText);
	        setFloatDivMessage();
	    }
	});
	myRequest.send();
}
//初始化菜单元素
var menuData;//定义全局菜单对象
var lostRightPageIds=[];//用于存储没有权限的页面id。没有权限指在page集合中没有，但在menuJson中有
function initMenuData(){
	new Request({
	    url: ctx+'/admin/menu/getMenu',
	    data:{userName:globalUserName},
	    method: 'get',
	    noCache: true,
	    onSuccess: function(data){
	        if($type(data) == 'string'){
	        	data = JSON.decode(data);
	        }
	        data = data||{menuJson:'[]'};
	        menuData = data;
	        initMenuEvent("remove");
	        $("menuContent").setStyle("visibility","hidden");//先隐藏，计算
	        if(data){
	        	var temp = [];
	        	temp.push("<ul id=\"nav-one\" class=\"nav\"><li><a href=\"javaScript:;\" onclick=\"setMainFrameUrl(this,'index');\" class=\"current\">首页</a></li>");
	        	JSON.decode(data.menuJson).each(function(item,ind){
	        		if(item.pageId || item.child.length>0){
	        			temp.push("<li><a href=\"javaScript:;\" onclick=\"setMainFrameUrl(this);\" title=\""+item.name+"\" pageId=\""+(item.pageId?item.pageId:"")+"\">"+item.name+(item.child?"<small>▼</small>":"")+"</a>");
	        			if(item.child){
	        				temp.push("<ul>");
	        				item.child.each(function(ite){
	        					lostRightPageIds.push(ite.pageId);
	        					temp.push("<li><a href=\"javaScript:;\" onclick=\"setMainFrameUrl(this);\" title=\""+ite.name+"\" pageId=\""+ite.pageId+"\">"+ite.name+"</a></li>");
	        				});
	        				temp.push("</ul>");
	        			}else{
	        				lostRightPageIds.push(item.pageId);
	        			}
	        			temp.push("</li>");
	        		}
	        	});
	        	temp.push("</ul>");
	        	//temp.push("<ul class=\"nav_v\"><li id=\"more_li\"><a href=\"javaScript:;\" style=\"color: #000;\">更多<span class=\"gbma\"></span></a><ul id=\"more_ul\" style=\"display: block; opacity: 0.9999;\"></ul></li></ul>");
	        	temp.push("<ul class=\"nav_v\"><li id=\"more_li\"><a href=\"javaScript:;\" style=\"color: #000;\">更多<small>▼</small></a><ul id=\"more_ul\"></ul></li></ul>");
	        	$("menuContent").set("html",temp.join(""));
	        }
	        if(++n==2){
	        	initRightAndUrl();
	        	initMenuEvent("add");
	        }
	    }
	}).send();
}
//初始化页面数据
var pageData;//定义全局页面对象
function initPageData(){
	new Request({
	    url: ctx+'/admin/page/list',
	    method: 'get',
	    noCache: true,
	    onSuccess: function(data){
	        if($type(data) == 'string'){
				data = JSON.decode(data);
			}
			pageData = data;
			if(++n==2){
				initRightAndUrl();
				initMenuEvent("add");
			}
	    }
	}).send();
}
//初始化权限及url事情
function initRightAndUrl(){
	var temp = [];
	pageData.each(function(item,ind){
		item.pageId = item.pageId+"";//将id变为字符串
		if(lostRightPageIds.contains(item.pageId)){//有权限
			pageMap["p_"+item.pageId]=item;
			lostRightPageIds.erase(item.pageId);
		}
	});
	pageData = null;
	lostRightPageIds.each(function(item){//删除没有权限的菜单项
		var el = $("menuContent").getElement("a[pageId="+item+"]");
		if(el){
			var ulEl = el.getParent("ul");
			el.getParent().destroy();
			if(ulEl && ulEl.getChildren().length==0){//去除空菜单项的组
				ulEl.getParent().destroy();
			}
		}
	});
	calMoreMenu();
	$("menuDataMess").setStyle("display","none");
	$("menuContent").setStyle("visibility","visible");//先隐藏，计算
}
//初始化菜单事件，在ie6上使用
var timeDelay;
function initMenuEvent(type){
	$("menuContent").getElements("li").each(function(item){
		if(type=="add"){
	    	item.addEvents({
		    	"mouseover":function(e){
	    			(new Event(e)).stop();//阻止事件冒泡，这个是为了解决鼠标移动到li下面的li时候不至于触发上面li的mouserover事件
	    			clearTimeout(timeDelay);
	    			$('menuContent').getElements("li.sfHover").removeClass("sfHover");//这个是为了解决左右移动的时候使得移开的那个li失去hover
	    			var item = $(this);
	    			var itePar = item.getParent("li");
	    			if(itePar){
	    				itePar.addClass("sfHover");
	    			}
	    			if(item.getParent("li#more_li") && itePar!=$("more_li")){
	    				$("more_li").addClass("sfHover");
	    			}
		    		$(this).addClass("sfHover");
		    		//设置iframe遮挡层
		    		var el = $(this).getLast();
		    		if(el && el.get("tag")=="ul"){
		    			var cord = el.getCoordinates();
			    		var iframeEl = $("work_menu_frame");
						iframeEl.setStyles({
							"left":cord.left - 44,
							"top":cord.top-40,
							"width":cord.width,
							"height":cord.height
						})
		    		}
		    	},
		    	"mouseout":function(){
		    		clearTimeout(timeDelay);
		    		timeDelay = menuMouseout.delay(50,window,[this]);
		    	}
	    	})
    	}else{
    		item.removeEvents(["mouseover","mouseout"]);
    	}
    })
}
//菜单鼠标移开事件
function menuMouseout(currentItem){
	if(currentItem){
		$(currentItem).removeClass("sfHover");
	}
	$("work_menu_frame").setStyle("left",-500);
}
//计算生成更多菜单项
function calMoreMenu(){
	var el = $("menuContent");
	if($("more_li")){
		$("more_li").setStyle("display","none");
	}
	var totalW = el.getSize().x;
	//var tempW = $("more_li").getSize().x;
	var tempW = 48;
	var flag = false;
	var cilds = $("nav-one").getChildren();
	for(var j=0;j<cilds.length;j++){
		var ite = cilds[j];
		tempW+=ite.getSize().x;
		if(flag||tempW>totalW){
			flag = true;
		}
		if(flag){
			for(var k=cilds.length-1;k>=j&&j>1;k--){
				cilds[k].inject($("more_ul"), 'top');
			}
			break;
		}else if(cilds.length ==j+1){//结束的时候
			var els = $("more_ul").getChildren();
			for(var i=0;i<els.length && !flag;i++){//如果最后没有发现添加更多的情况则从更多中拿出元素摆放，直到摆放不下为止。
				$("nav-one").adopt(els[i]);
				tempW+=els[i].getSize().x;
				if(flag||tempW>totalW+4){
					flag = true;
					els[i].inject($("more_ul"), 'top');
				}
			}
		}
	}
	if($("more_ul").getChildren().length>0){
		$("more_li").setStyle("display","");
	}
}
//左侧展开点击
function leftToggleFun(){
	var el = $("leftToggle");
	var floatDiv = $("undoFloatDiv");
	if(el.get("class") == "right_toggle"){
		el.set("class","left_toggle");
		el.set("title","折叠");
		floatDiv.setStyle("display","");
		//用iframe垫着
		var tSize = floatDiv.getSize();
		setFrameProp(0,63,tSize.x,tSize.y,'float');
	}else{
		el.set("class","right_toggle");
		el.set("title","展开");
		floatDiv.setStyle("display","none");
		$("work_undoFloatDiv_frame").setStyle("left","-500px");
	}
}
//设置iframe的属性
function setFrameProp(l,t,w,h,type){
	$(type=="float"?"work_undoFloatDiv_frame":"work_tips_frame").setStyles({
		"left":l,
		"top":t,
		"width":w,
		"height":h
	})
}
//初始化左侧样式
function initUndoStyle(){
	var floatDiv = $("undoFloatDiv");
	var winSize = $(window).getSize();
	floatDiv.setStyle("height",winSize.y-63);
	$("undoFloatDiv_con").setStyle("height",$(window).getSize().y-93);
	var elLeft = $("leftToggle");
	elLeft.set("class",unddoBeginCollapse?"right_toggle":"left_toggle");
	elLeft.set("title",unddoBeginCollapse?"展开":"折叠");
	if(!unddoBeginCollapse){//用iframe垫着
		var tSize = floatDiv.getSize();
		setFrameProp(0,63,tSize.x,tSize.y,'float');
	}
	floatDiv.setStyle("display",unddoBeginCollapse?"none":"");
	$("leftEl-hidden").setStyle("display","none");
	var f_resieEl = $("float_resize");
	//使得左侧具有拖动功能
	floatDiv.makeResizable({
		handle: f_resieEl,
		snap : 1,
		modifiers: {x: 'width', y: false},
		limit: {x: [40,winSize.x-200]},
		onStart:function(el){
			$("drag_iframe_mask").setStyle("display","block");
		},
		onDrag: function(el) {
			var tSize = floatDiv.getSize();
			setFrameProp(0,63,tSize.x,tSize.y,'float');
		},
		onComplete: function() {
			$("drag_iframe_mask").setStyle("display","none");
		}
	});
}
//设置左侧浮动区元素
function setFloatDivMessage(){
	var temp = [];
	$("left_menu_ul").getChildren().each(function(item,ind){
		temp.push("<div class='item'><h3 workflowid='"+(item.get("workflowid")?item.get("workflowid"):"")+"'>"+item.getElement("label").get("html")+"</h3><div style='display:none;'><img border='0' src='"+webRoot+"/static/worktable/images/worktable/load_portal.gif'/></div></div>");
	});
	$("undoFloatDiv_con").set("html",temp.join(""));
	//判断是否需要出现上下移动的按钮
	var cEl = document.getElementById("left_menu");
	$$("div.arrDiv").setStyle("display",cEl.scrollHeight>cEl.clientHeight||cEl.offsetHeight>cEl.clientHeight?"":"none");
}
//初始化左侧代办事宜
function initLeftMenuEvent(){
	initUndoStyle();
	var tipEl = $("work_tips");
	var leftMenu = $("left_menu");
	$(document.body).addEvents({
	    "mouseover":function(e){
	    	var el = $(e.target);
	    	if(!el) return;
	    	var liEl = el.getParent("li[class=work_list]");
	    	if(el && (el.hasClass("work_list")||liEl)){
	    		liEl = liEl||el;
	    		checkLiVisible(liEl);
	    		var prop = liEl.get("property");
	    		leftMenu.getElements("div.work_list_div_move").set("class","work_list_div");
	    		tipEl.setStyle("visibility","hidden");
	    		$("work_tips_frame").setStyle("left","-500px");
	    		liEl.getFirst().set("class","work_list_div_move");
	    		if(prop){
	    			prop = JSON.decode(prop);
	    			tipElShow(prop,liEl);
	    		}else{
	    			var wfId = liEl.get("workflowid");
	    			var h3El = $("undoFloatDiv_con").getElements("h3[workflowid="+wfId+"]");
	    			if(wfId&&liEl.get("dwred")!='t'){//dwred为dwr请求标志 为t则为已经请求过了
	    				liEl.set("dwred",'t');
	    				h3El.set("dwred",'t');
	    				TodoTaskAction.getTaskTodoList(wfId,globalUserName,function(data){
	    					var pro = JSON.encode(data)||"[]";
	    					liEl.set("property",pro);
	    					h3El.set("property",pro);
	    					liEl.setStyle("cursor","pointer");
	    					liEl.getElement("label").setStyle("cursor","pointer");
	    					liEl.getElement("em").setStyle("cursor","pointer");
	    					if(liEl.getFirst().hasClass("work_list_div_move")){//如果鼠标还在该代办块上面的话则显示二级
	    						tipElShow(data,liEl);
	    					}
	    				});
	    			}
	    		}
	    	}else if(el.hasClass("work_nav_tips")||el.getParent("div#work_tips")){//这段不能删除
	    	}else{
	    		leftMenu.getElements("div.work_list_div_move").set("class","work_list_div");
	    		tipEl.setStyle("visibility","hidden");
	    		$("work_tips_frame").setStyle("left","-500px");
	    	}
	    },
	    "click":function(e){
	    	var el = $(e.target);
	    	if(!el) return;
			liClick(el,0);//如果是点击待办方块li
			if(el.get("tag")=="h3" &&el.get("workflowid")){//如果是点击待办头
				var contentEl = el.getNext();
				if(contentEl.getStyle("display")=="none"){
					contentEl.setStyle("display","block");
				}else{
					contentEl.setStyle("display","none");
				}
				if(contentEl.getElement("img")){//如果还没有渲染
					var prop = el.get("property");
					if(prop){
						renderLegend(JSON.decode(prop),contentEl);
					}else{
						var wfId = el.get("workflowid");
						var liEl = $("left_menu").getElements("li[workflowid="+wfId+"]");
						if(wfId&&el.get("dwred")!='t'){//dwred为dwr请求标志 为t则为已经请求过了
		    				el.set("dwred",'t');
		    				liEl.set("dwred",'t');
		    				/*TodoTaskAction.getTaskTodoList(wfId,globalUserName,function(data){
		    					var pro = JSON.encode(data)||"[]";
		    					el.set("property",pro);
		    					liEl.set("property",pro);
		    					liEl.setStyle("cursor","pointer");
		    					liEl.getElement("label").setStyle("cursor","pointer");
		    					liEl.getElement("em").setStyle("cursor","pointer");
								renderLegend(JSON.decode(pro),contentEl);
		    				});*/
		    			}
					}
				}
			}
	    }
    });
	/*$("left_menu").addEvents({//点击直接打开只有一级的代办信息
	    "click":function(e){
	    	var el = $(e.target);
	    	if(!el) return;
			liClick(el,0);
	    }
    });*/
}
//渲染legend点击后返回数据
function renderLegend(data,contentEl){
	var temp = [];
	data.each(function(item,ind){
		if(typeOf(item)!='object'){return;}
		if(ind!=0){
			temp.push("<br/>");
		}
		if(item.todoLinkList){
			temp.push(item.label+"&nbsp;");
			item.todoLinkList.each(function(it){
				temp.push("<a href=\"javascript:;\" style=\"display:inline;\" onclick=\"setMainUrl('"+it.url+"');\">"+it.linkName+(it.count>-1?"(<em>"+it.count+"</em>)":"")+"</a>&nbsp;");
			});
		}
	});
	contentEl.set("html",temp.join(""));
}
//代办点击执行代码
function liClick(el,n){
	var liEl = el.getParent("li[class=work_list]");
	if(el && (el.hasClass("work_list")||liEl)){
		liEl = liEl||el;
		var url = liEl.get("linkurl");
		var temp = liEl.get("property");
		if(!url && !temp && n<15){//dwr未返回 n<15意味着等等15*400秒后放弃
			liClick.delay(400,this,[el,n]);
		}else{
			setMainUrl(liEl.get("linkurl"));
		}
	}
}
//下面是为了使得li滚动到到显示区
function checkLiVisible(liEl){
	//下面是为了使得liEl滚动条到显示区
	var pos = liEl.getPosition();
	var menuEl = $("left_menu");
	var total = menuEl.getSize().y-46;
	var liSize = liEl.getSize();
	//var begTop = 53;
	var begTop = 80;
	if(pos.y>begTop && pos.y-begTop+liSize.y>total){
		scrollFx.set(0,menuEl.scrollTop);
		scrollFx.start(0,menuEl.scrollTop+(pos.y-begTop+liSize.y - total));//向上滑动
	}else if(pos.y<begTop){
		scrollFx.set(0,menuEl.scrollTop);
		scrollFx.start(0,menuEl.scrollTop-(begTop-pos.y+9));//向下滑动
	}
	//上面是为了使得liEl滚动条到显示区
}
//代办二级显示div层显示函数
function tipElShow(prop,liEl){
	//这个if是为了解决只返回一个代办项的时候不用弹出显示框，直接点击能够访问
	if(prop.length<2) {
		if(prop[0]){
			if(prop[0]['todoLinkList']){
				if(prop[0]['todoLinkList'].length<2){
					liEl.set("linkurl",prop[0]['todoLinkList'][0]["url"]||"_");//这里为空的时候“_”代替是为了返回一个标准位
					return;//小于1不显示
				}
			}else{
				return;
			}
		}else{
			return;
		}
	}
	var tipEl = $("work_tips");
	var temp = [];
	prop.each(function(item,ind){
		if(typeOf(item)!='object'){return;}
		if(ind!=0){
			temp.push("<br/>");
		}
		if(item.todoLinkList){
			temp.push(item.label+"&nbsp;");
			item.todoLinkList.each(function(it){
				temp.push("<a href=\"javascript:;\" style=\"display:inline;\" onclick=\"setMainUrl('"+it.url+"');\">"+it.linkName+(it.count>-1?"(<em>"+it.count+"</em>)":"")+"</a>&nbsp;");
			});
		}
	});
	$("work_tips_centent").set("html",temp.join(""));
	var pos = liEl.getPosition();
	//下面是为了使得tip提示框在window的显示区中
	pos.x +=28;
	var winSize = $(window).getSize();
	var tSize = tipEl.getSize();
	if(winSize.y<(pos.y+tSize.y)){
		pos.y = winSize.y - tSize.y-1;
	}
	tipEl.setPosition(pos);
	tipEl.setStyle("visibility","visible");
	//设置iframe遮挡层
	setFrameProp(pos.x,pos.y,tSize.x,tSize.y);
}

//解决窗口resize的时候右下角折叠区重置的问题
function containerResize(flag){
	$("undoFloatDiv").setStyle("height",$(window).getSize().y-63);
	$("undoFloatDiv_con").setStyle("height",$(window).getSize().y-93);
	if($("innerCenterEl_show") && $("innerCenterEl_show").getStyle("display")!="none"){
		$("innerCenterEl").setStyle("display","");
	}
	//判断是否需要出现上下移动的按钮
	var cEl = document.getElementById("left_menu");
	$$("div.arrDiv").setStyle("display",cEl.scrollHeight>cEl.clientHeight||cEl.offsetHeight>cEl.clientHeight?"":"none");
	var siz = $(window).getSize();
//	if(winSize.y != siz.y){//判断window窗口是否变化了高度
//		winSize.y = siz.y;
//	}
	if(winSize.x != siz.x){//判断window窗口是否变化了宽度
		winSize.x = siz.x;
		var el = $("nav-one");
		if(el){
			el.setStyle("visibility","hidden");
			calMoreMenu.delay(450,this);
			el.setStyle("visibility","visible");
		}
	}
}
//点击上下滚动
function leftMenuScroll(type){
	var el = $("left_menu");
	var dis = $("left_menu").getSize().y*0.6;
	scrollFx.set(0,el.scrollTop);
	scrollFx.start(0,el.scrollTop+dis*(type==1?-1:1));//向上向下点击
}
//从菜单项切换主工作区iframe
function setMainFrameUrl(el,type){
	var url;
	if(type=="index"){//首页
		url= webRoot+"/admin/index";
	}else if(el && $(el).get("pageId") && pageMap["p_"+$(el).get("pageId")]){
		var item = pageMap["p_"+$(el).get("pageId")];
		url= webRoot+item.url+"?"+Object.toQueryString(item);
	}
	if(url){
		$("innerTopMain").set("src",url);
		message.load("加载中...&nbsp;&nbsp;&nbsp;");
		if(el){//高亮选择的菜单项
			var elcontent = $("menuContent");
			elcontent.getElements("a.current").removeClass("current");
			el.addClass("current");
			var temp = el.getParent("ul");
			while(temp && (!temp.hasClass("nav")||!temp.hasClass("nav_v"))){
				var a = temp.getPrevious();
				if(a){
					a.addClass("current");
					temp = a.getParent("ul");
				}else{
					temp = null;
				}
			}
		}
	}
}
//切换主工作区iframe值
function setMainUrl(url){
	if(url){
		message.load("加载中...&nbsp;&nbsp;&nbsp;");
		$("innerTopMain").set("src",webRoot+url);
		$("menuContent").getElements("a.current").removeClass("current");
	}
}
//切换主工作区iframe
function openWorkTableConfig(){
	var winSize = $(window).getSize();
	Mbox.open({
		title: '配置菜单',
		url: webRoot+"/admin/worktable/toWorkTableConfig",
		width: winSize.x*0.90,
		height: winSize.y*0.90,
		type: "iframe",
		loadimg:webRoot+"/static/worktable/images/worktable/o_loading.gif",
		onClose:function(){
			var win = window.frames[$$("iframe.mbox_ajax_iframe")[0].get("name")];
			var sel = true;
			if(win.checkModif){
				var modVal = win.checkModif();
				if(win && modVal.saveState ==1){
					return false;//如果保存数据了还未返回则阻止关闭
				}
				if(win && modVal.modif){
					sel = confirm("桌面配置编辑未保存，是否确定离开?");
				}
				if(win && modVal.save){
					renderMenuData();
				}
			}
			return sel;
		},
		ajax: true
	});
}
//处理在配置菜单页面双击访问菜单
function dragMenuDblclick(url){
	if(Mbox.close()===false) return;
	setMainUrl(url);
}
//初始化加载事件
function initLoadingEvent(){
	var iframe1 = $('innerTopMain');
	if(iframe1){
		if (iframe1.attachEvent){
			iframe1.attachEvent("onload", function(){
				message.loadHidden();
			});
		} else {
			iframe1.onload = function(){
				message.loadHidden();
			};
		}
	}
}
