<%@ page language="java" contentType="text/html; charset=UTF-8"%><%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/views/sys/commons/taglibs.jsp"%>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>班组工作台菜单管理</title>
<link href="${ctx}/static/worktable/css/worktable.css" rel="stylesheet" type="text/css" />
<link href="${ctx}/static/worktable/css/layout.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="${ctx}/static/worktable/js/mootools1.3.js"></script>
<script type="text/javascript" src="${ctx}/static/worktable/js/wt_util.js"></script>
<script type="text/javascript" src="${ctx}/static/worktable/js/layout.js"></script>
<script type="text/javascript" src="${ctx}/static/worktable/js/mbox.js"></script>
<script type="text/javascript">
	var type = "configByUserId";//如果type为"configByProf"则为从岗位菜单管理页面传递过来的，如果为configByUserId则为用户自定义操作
	var userIdOrProfCode;//全局id变量，可能为用户id,也可能为岗位id.
	var menuData;//定义菜单数据全局变量
	var dragObj;//拖动对象
	var editDiv;
	var saveFlag = false;
	var saveState = 0;
	var globalUserName = '<shiro:principal property="loginName"/>';
	window.addEvents({
		'domready':function() {
			initDataCallBack();
			
			var winSize = $(window).getSize();
			var togglePanel = new Mui.Panel({
				el:'bottomEl',
				position:'bottom',
				headerEl:'bottomHeader',
				mainEl:'bottomMain',
				height:Math.max(winSize.y*0.5,100),
				maxSize:winSize.y*0.8,
				collapsed:false,
				gap:'5px 0 0 0',
				resizable:true
			});
			//定义布局对象
			var container=new Mui.Container({
				el:'bodyEl',
				items:[
					new Mui.Panel({
						el:'centerEl',
						headerEl:'centerHeader',
						mainEl:'centerMain',
						position:'center',
						collapsed:false
					}),
					togglePanel
				]
			})
			container.render();
			//groupSortObj.removeItems("div#myWorkCalendar");
			//$("s_tips_input").addEvent("blur",inputBlur);
			$("s_tips_input").addEvent("blur",inputBlur);
			setDragEvent();
			togglePanel.addEvent("endResize",resizeTabpanel);
		},
		"resize":function(){
			if($("droppables")){
				$("droppables").setStyle("width",Math.max($("droppables").getChildren().length*108,document.body.clientWidth-2));//出现滚动条而不是换行
			}
		}
	});
	//初始化dwr调用结束后的操作
	var pageMenuCache = {};//用于存储菜单中包含的数据，主要是需要获取url，可以直接点击的时候链接过去。
	var lostRightPageIds=[];
	function initDataCallBack(){
		$$('.tabs LI.tab').removeEvent("click");//去除tab页上添加的事件，防止内存泄漏。
		$$("legend").removeEvent("click");
		new Request({
		    url: ctx+'/admin/worktable/configData',
		    data:{userName:globalUserName},
		    method: 'get',
		    noCache: true,
		    onSuccess: function(data){
		    	if($type(data) == 'string'){
					data = JSON.decode(data);
				}
		    	if($type(data.pageData) == 'string'){
					data.pageData = JSON.decode(data.pageData);
				}
				if($type(data.menuData) == 'string'){
					data.menuData = JSON.decode(data.menuData);
				}
				menuData = data.menuData||{userName:globalUserName,menuJson:'[]'};//如果该用户还没有配置菜单则初始化值
				//初始化lostRightPageIdss 值为菜单中所配置的所有页面id的集合
				menuData.menuJson = JSON.decode(menuData.menuJson);
				menuData.menuJson.each(function(item){
					if(item.pageId){
						lostRightPageIds.push(item.pageId);
					}else{
						item.child.each(function(ite){
							lostRightPageIds.push(ite.pageId);
						});
					}
				});
				initDraggablesData(data.pageData);
				initDroppablesData(menuData);
		    }
		}).send();
	}
	//初始化拖动区域菜单数据
	function initDraggablesData(pageData){
		//重组数据结构
		var allRecord = {};
		pageData.each(function(item,ind){
			if(!allRecord[item.catalogCode]){
				allRecord[item.catalogCode] = {};
			}
			if(!allRecord[item.catalogCode][item.modelCode]){
				allRecord[item.catalogCode][item.modelCode] = [];
			}
			allRecord[item.catalogCode][item.modelCode].push(item);
		});

		var allTitle = ["<ul class='tabs'>"];
		var allContent = [];
		for(var key in allRecord){
			var n=0;
			allContent.push("<div class='tabcontent'>");
			for(var k in allRecord[key]){
				var temp = allRecord[key][k];
				temp.each(function(item,ind){
					if(n++==0){
						allTitle.push("<li class='tab'>"+item["catalogName"]+"</li>");
					}
					if(ind==0){
						allContent.push("<fieldset id='fset_"+item.catalogCode+item.modelCode+"'><legend>"+item["modelName"]+"</legend><div style='float:left;'>");
					}
					item.pageId = item.pageId+"";
					if(!lostRightPageIds.contains(item.pageId)){//如果已经显示在菜单项中了则就不用显示了
						allContent.push("<div class=\"drag\" pageId=\""+item.pageId+"\" modelCode=\""+item.modelCode+"\" catalogCode=\""+item.catalogCode+"\" url=\""+item.url+"\" title=\""+item.pageName+"\">");
						allContent.push("<em class=\"move\">"+item.pageName+"</em>");
						allContent.push("<div class=\"sc_editdiv\" dropable=\"false\"><a class=\"sc_close sc-edit\" title=\"删除\" href=\"javascript:;\"></a><a class=\"sc_rename sc-edit\" title=\"重命名\" href=\"javascript:;\"></a></div>");
						allContent.push("</div>");
					}else{
						lostRightPageIds.erase(item.pageId);//如果有权限则从没有权限的集合中去除掉
						pageMenuCache['p_'+item.pageId] = item;
					}
				});
				allContent.push("</div></fieldset>");
			}
			allContent.push("</div>");
		}
		allTitle.push("</ul>");
		$("divDraggables").set("html",allTitle.join("")+allContent.join(""));
		renderTabpanel();
	}
	//初始化丢放区域菜单数据
	function initDroppablesData(menuData){
		removeSortTable()//如果排序对象不为null则清除之
		if(menuData){
			var temp = [];
			menuData.menuJson.each(function(item,ind){
				if(item.pageId){
					item.pageId  = item.pageId+"";
					if(!lostRightPageIds.contains(item.pageId)){//去除没有权限的菜单项
						temp.push("<div title=\""+item.name+"\" pageId=\""+item.pageId+"\" modelCode=\""+item.modelCode+"\" catalogCode=\""+item.catalogCode+"\" url=\""+(pageMenuCache['p_'+item.pageId]?pageMenuCache['p_'+item.pageId].url:"")+"\" class=\"drop drop_title_single\"><em class=\"move\">"+item.name+"</em><div dropable=\"false\" class=\"sc_editdiv\" style=\"display: none;\"><a href=\"javascript:;\" title=\"删除\" class=\"sc_close sc-edit\"></a><a href=\"javascript:;\" title=\"重命名\" class=\"sc_rename sc-edit\"></a></div></div>");
					}
				}else{
					temp.push("<div class=\"drop\"><div title=\""+item.name+"\" class=\"drop_title\"><em>"+item.name+"</em><div dropable=\"false\" class=\"sc_editdiv\" style=\"display: none;\"><a href=\"javascript:;\" title=\"删除\" class=\"sc_close sc-edit\"></a><a href=\"javascript:;\" title=\"重命名\" class=\"sc_rename sc-edit\"></a></div></div><div dropable=\"false\" class=\"drop_content\">");
					item.child.each(function(ite){
						ite.pageId  = ite.pageId+"";
						if(!lostRightPageIds.contains(ite.pageId)){//去除没有权限的菜单项
							temp.push("<div title=\""+ite.name+"\" pageId=\""+ite.pageId+"\" modelCode=\""+ite.modelCode+"\" catalogCode=\""+ite.catalogCode+"\" url=\""+(pageMenuCache['p_'+ite.pageId]?pageMenuCache['p_'+ite.pageId].url:"")+"\" class=\"dragMenu\"><em class=\"move\">"+ite.name+"</em><div dropable=\"false\" class=\"sc_editdiv\" style=\"display: none;\"><a href=\"javascript:;\" title=\"删除\" class=\"sc_close sc-edit\"></a><a href=\"javascript:;\" title=\"重命名\" class=\"sc_rename sc-edit\"></a></div></div>");
						}
					});
					temp.push("</div></div>");
				}
			});
			$("droppables").set("html",temp.join(""));
			$("droppables").setStyle("width",Math.max($("droppables").getChildren().length*108,document.body.clientWidth-2));//出现滚动条而不是换行
			menuData.menuJson = JSON.encode(getMenuJsonFormHtml());//这个是为了解决去掉没有权限的菜单项后导致离开时候验证不正确的问题。
		}
		initSortTable();
	}
	//清除所有操作 在专业分类被删除最后一条记录的时候调用
	function clearAll(){
		userIdOrProfCode = "";
		$("divDraggables").empty();
		$("droppables").empty();
		$("droppables").setStyle("width","auto");
		$$('.tabs LI.tab').removeEvent("click");//去除tab页上添加的事件，防止内存泄漏。
		$$("legend").removeEvent("click");
	}
	//input失去焦点事件
	function inputBlur(){
		if($("s_tips").getStyle("visibility")!="hidden"){
			var val = $("s_tips_input").get("value");
			if(editDiv && val){
				val = val.replace("'","‘");
				val = val.replace("\"","“");
				editDiv.set("title",val);
				editDiv.getFirst().set("html",val);
			}
			$("s_tips").setStyle("visibility","hidden");
		}
	}
	//初始化排序对象
	var groupSortObj;//定义组的排序对象
	var innerGroupSortObj;//定内的排序对象
	function initSortTable(){
		//定义组与组的拖动排序对象
		groupSortObj = new Sortables('div#droppables', {
			activeProp:'dropable',
		    revert: true,
		    opacity: 0.7
		});
		//定义组内的拖动排序对象
		innerGroupSortObj = new Sortables('div.drop_content', {
		    revert: true,
		    opacity: 0.7
		});
	}
	//如果排序对象不为null则清除之
	function removeSortTable(){
		if(groupSortObj){
			groupSortObj.removeItems($$('div#droppables').getChildren());
		}
		if(innerGroupSortObj){
			groupSortObj.removeItems($$('div.drop_content').getChildren());
		}
	}
	//设置拖动事件相关
	var dragParent;//用于处理从一个组内拖动排序的时候不进行drop操作
	function setDragEvent(){
		//添加拖动事件
	    //$$('div[class^=drag]').addEvent('mousedown',function(event) {
	    $(document.body).addEvent('mousedown',function(event) {
	        var tarEl = $(event.target);
	        if(tarEl==$("s_tips_input")) {//点击文本框
		        return true;
	        }
	        event.stop();
	        if(tarEl.hasClass("sc_close")) {//元素删除按钮
	        	var itemDiv = $(tarEl.parentNode.parentNode);
	        	if(itemDiv.hasClass("dragMenu")||itemDiv.hasClass("drop_title_single")){
					itemDiv.set("class","drag");
					if(itemDiv.hasClass("dragMenu")){
						innerGroupSortObj.removeItems(itemDiv);
					}else{
						groupSortObj.removeItems(itemDiv);
					}
					var el = $("fset_"+itemDiv.get("catalogCode")+itemDiv.get("modelCode"));
					if(el){
						el.adopt(itemDiv);
					}else{//这是一种强制移除策略
						itemDiv.destroy();
					}
					itemDiv.getLast().setStyle("display","none");
	        	}else if(itemDiv.hasClass("drop_title")){
	        		var itemCont = itemDiv.getNext();
	        		var itemContits = itemCont.getChildren();
					if(itemContits.length>0){
						if(confirm("\""+itemDiv.get("text")+"\"分组中还存在菜单项，是否确认删除?")) {
							itemContits.each(function(item){
								item.set("class","drag");
								innerGroupSortObj.removeItems(item);
								var el = $("fset_"+item.get("catalogCode")+item.get("modelCode"));
								if(el){
									el.adopt(item);
								}else{//这是一种强制移除策略
									item.destroy();
								}
							});
							groupSortObj.removeItems(itemDiv.parentNode);
							$(itemDiv.parentNode).destroy();
						}
					}else{
						groupSortObj.removeItems(itemDiv.parentNode);
						$(itemDiv.parentNode).destroy();
					}
	        	}
		        return;
	        }
	        if(tarEl.hasClass("sc_rename")) {//元素重命名按钮
	        	renameMenuName(tarEl);
		        return true;
	        }
	        if(tarEl.hasClass("sc_editdiv")){
		        return;
	        }
	        //if(tarEl.hasClass("drag")||tarEl.hasClass("dragMenu")||$(tarEl.parentNode).hasClass("drag")||$(tarEl.parentNode).hasClass("dragMenu")){//$$('div[class^=drag]').addEvent('mousedown',funxxx)相当于
	        if(tarEl.hasClass("drag")||$(tarEl.parentNode).hasClass("drag")){//$$('div[class^=drag]').addEvent('mousedown',funxxx)相当于
		        var item = (tarEl.hasClass("drag")||tarEl.hasClass("dragMenu"))?tarEl:$(tarEl.parentNode);
		        dragParent = $(item.parentNode);
		        var clone = item.clone().setStyles(item.getCoordinates()).setStyles({
		            opacity: 0.7,
		            position: 'absolute'
		        }).inject(document.body);
		        dragObj = new Drag.Move(clone, {
		            droppables: $$('#droppables Div.drop_content'),
		            //droppables: $$('div#droppables'),
		            onDrop: function(dragging, cart, e, now) {
		                dragging.destroy();
		                if(dragParent == cart){
		                	cart.setStyle('background-color', '#FFF');
		                	return;
		                }
		                if (cart != null) {
		                	item.set("class","dragMenu");
		                	item.inject(cart);
			                innerGroupSortObj.addItems(item);
		                    cart.highlight('#7389AE', '#fff');
		                }else{
			                if(checkMoved(now)){//判断是否到达了centerMain区域 新增单个分组
			                	/*if(item.hasClass("dragMenu")){//如果是从组内移出到单个分组的则需要从组内排序中移除
			                		innerGroupSortObj.removeItems(item);
			                	}*/
			                	addGroup("single",item);
			                	$("centerMain").highlight('#98B5C1', '#FFF');
				            }
			            }
		            },
		            onEnter: function(dragging, cart) {
		            	if(dragParent == cart) return;
		                cart.tween('background-color', '#98B5C1');
		            },
		            onLeave: function(dragging, cart) {
		                cart.tween('background-color', '#FFF');
		            },
		            onCancel: function(dragging) {
		                dragging.destroy();
		            }
		        });
		        dragObj.start(event);
	        }
	        inputBlur();
	    });
	    //添加全局鼠标移上变色效果
	    $(document.body).addEvent("mouseover",function(e){
	    	var el = $(e.target);
	    	if(el && (el.hasClass("dragMenu")||el.hasClass("drop_title")||el.hasClass("drop_title_single"))){
	    		var elTemp = el;
	    		elTemp.getElements("div.sc_editdiv").setStyle("display","block");
	    	}else{
	    		el.getElements("div.sc_editdiv").setStyle("display","none");
	    	}
	    	if(el && (el.hasClass("dragMenu")||el.hasClass("drop_title_single")||el.hasClass("drag")||(el.hasClass("move")&&el.get("tag")=="em"))){
	    		var elTemp2 = el||el.getParent();
	    		if(elTemp2.hasClass("drag")){
		    		var url = elTemp2.get("url");
		    		if(url){
			    		$("link_tips").set("url",url);
			    		var pos = elTemp2.getPosition();
			    		//pos.x+=(elTemp2.getSize().x-19);
			    		pos.x+=(elTemp2.getSize().x-19);
			    		pos.y+=1;
			    		$("link_tips").setPosition(pos);
			    		$("link_tips").setStyle("display","block");
		    		}
	    		}
	    	}else{
	    		if(!el.hasClass("link_tips")&&!el.hasClass("sc_link")){
	    			$("link_tips").setStyle("display","none");
	    		}
	    	}
	    });
	    //添加菜单全局双击事件
	    $("link_tips").addEvent("click",function(){
	    	var url = $(this).get("url");
	    	parent.dragMenuDblclick(url);
	    });
	}
	//判断是否到达了droppables区域
	function checkMoved(now){
		var el = $("centerMain").getCoordinates();
		return (now.x>el.left && now.x<el.right && now.y<el.bottom && now.y>el.top);
	}
	//重置菜单名字
	function renameMenuName(tarEl){
		var inputEl = $("s_tips");
       	if(inputEl.getStyle("visibility")=="visible"){//如果是已经在编辑状态
       		inputBlur();
       	}
       	editDiv = $(tarEl.parentNode.parentNode);
       	inputEl.setPosition(editDiv.getPosition());
       	inputEl.setStyle("visibility","visible");
       	var val = editDiv.get("title");
       	inputEl.getFirst().set("value",val);
       	inputEl.getFirst().selectRange(0,val.length);
	}
	//添加分组
	function addGroup(type,item){
		var el;
		var flag;
		if(type=='single'){
			el = item;
			el.set("class","drop drop_title_single");
		}else{
			el = new Element("div",{
				"class":"drop",
				"html":"<div class=\"drop_title\" title=\"新的分组\"><em>新的分组</em><div class=\"sc_editdiv\" dropable=\"false\"><a class=\"sc_close sc-edit\" title=\"删除\" href=\"javascript:;\"></a><a class=\"sc_rename sc-edit\" title=\"重命名\" href=\"javascript:;\"></a></div></div><div class=\"drop_content\" dropable=\"false\"></div>"
			});
			flag = true;
		}
		$("droppables").adopt(el);
		groupSortObj.addItems(el);
		var wid = document.body.clientWidth-2;
		var temp = Math.max($("droppables").getChildren().length*108,wid);
		$("droppables").setStyle("width",temp);//出现滚动条而不是换行
		if(temp>wid){
			$("centerMain").scrollTo(10000,0);
		}
		if(flag){
			renameMenuName.delay(100,this,el.getElement("a.sc_rename"));
		}
	}
	//保存布局
	function saveLayout(){
		saveState = 1;
		var resultObj = getMenuJsonFormHtml();
		saveFlag = true;//用于在关闭窗口的时候刷新父页面的菜单
		menuData.menuJson = JSON.encode(resultObj);
		new Request({
		    url: ctx+'/admin/menu/save',
		    data:menuData,
		    method: 'post',
		    noCache: true,
		    onSuccess: function(data){
		    	saveState = 2;
				message.show(data==1?"保存数据成功！！！":"保存数据失败！！！",0.2,true,true);
		    }
		}).send();
	}
	//保存数据回调函数
	function getMenuJsonFormHtml(){
		var resultObj = [];
		$("droppables").getChildren().each(function(item){
			var obj;
			if(item.hasClass("drop_title_single")){
				obj={name:item.get("title"),pageId:item.get("pageId"),modelCode:item.get("modelCode"),catalogCode:item.get("catalogCode")};
			}else{
				obj={name:item.getFirst().get("title"),child:[]};
				item.getLast().getChildren().each(function(ite){
					var ob={name:ite.get("title"),pageId:ite.get("pageId"),modelCode:ite.get("modelCode"),catalogCode:ite.get("catalogCode")};
					obj.child.push(ob);
				});
			}
			resultObj.push(obj);
		});
		return resultObj;
	}
	//是否修了的标志
	function checkModif(){
		if(saveState == 1){
			message.show("保存数据中，请稍候再关闭...",0.2,false,true);
		}
		var flag = true;
		if(JSON.encode(getMenuJsonFormHtml())==menuData.menuJson){
			flag = false;
		}
		return {modif:flag,save:saveFlag,saveState:saveState};
	}
	//初始化tabpanel事件
	function renderTabpanel(id){
		var tabs = $$('.tabs LI.tab'),content = $$('.tabcontent');
		tabs.each(function(tab, index){
			tab.addEvent('click', function(){
				tabs.removeClass('selected');
				content.removeClass('selected');
				tabs[index].addClass('selected');
				content[index].addClass('selected');
			});
			if(index==0){
				tabs[0].addClass('selected');
				content[0].addClass('selected');
			}
		});
		resizeTabpanel();
		$$("legend").each(function(item, ind){
			item.addEvent('click', function(){
				var nextEl = this.getNext();
				if(nextEl){
					nextEl.setStyle("display",nextEl.getStyle("display")!='none'?"none":"");
				}
			});
		});
	}
	//调整tabpanel区域size
	function resizeTabpanel(){
		var totalH = $("bottomMain").getSize().y;
		$("divDraggables").setStyle("height",Math.max(totalH-5,0));
		$$("div.tabcontent").setStyle("height",Math.max(totalH-58,150));
	}
	</script>
</head>
<body id="bodyEl">
		<div id='centerEl'>
			<div id='centerHeader'>
				<div style="float: left;width:100%;">
					<a class="a_but" id="addGroupId" href="javascript:;" style="float:right;height: 18px;line-height: 18px;margin:2px 5px 0 0" onclick="addGroup();">&nbsp;添加分组&nbsp;</a>
					<a class="a_but" id="saveId" href="javascript:;" style="float:right;height: 18px;line-height: 18px;margin:2px 5px 0 0" onclick="saveLayout();">&nbsp;保存&nbsp;</a>
				</div>
			</div>
			<!-- 主工作区div -->
			<div id='centerMain'>
				<div id="droppables">
				</div>
			</div>
		</div>

		<div id='bottomEl' style="overflow: hidden;">
			<div id='bottomHeader' style="display:none;">
			</div>
			<div id="bottomMain" style="overflow: hidden;">
				<div id="divDraggables" style="overflow: hidden;">
				</div>
			</div>
		</div>
		<!-- 浮动修改文本框 -->
		<div class="tip_input" id="s_tips" style="visibility: hidden; top: -9999px; left: -9999px;"><input type="text" value="" id="s_tips_input" maxlength="20" style="height:21px;line-height:21px;width:96px;font-size:12px;"/></div>
		<!-- 浮动链接点击图标 -->
		<div class="tip_input link_tips" id="link_tips" style="visibility: visible; top: -9999px; left: -9999px;width: 18px;height:24px;"><a class="sc_link" title="直接链接" href="javascript:;"></div>
</body>
</html>
