<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ include file="/WEB-INF/views/sys/commons/taglibs.jsp"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>用户管理</title>
<link href="${ctx}/static/themes/css/main.css" rel="stylesheet" type="text/css" />
<link href="${ctx}/static/kissy/dpl/css/reset-min.css" rel="stylesheet" type="text/css" />
<link href="${ctx}/static/kissy/gallery/grid/1.0/assets/grid-min.css" rel="stylesheet" type="text/css" />
<link href="${ctx}/static/kissy/kissy/overlay/assets/cool.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="${ctx}/static/kissy/kissy/kissy.js"></script>
</head>
<body>
<div id="container" class="lay-hc">
	<div id="header">
		<!-- 导航栏 -->
		<ul class="navi">
			<li>${pageInfo.catalogName } » </li>
			<li>${pageInfo.modelName } »</li>
			<li>${pageInfo.pageName } </li>
		</ul>
	</div>
	<!-- 主内容区 -->
	<div id="content"></div>
</div>
<script type="text/javascript">
(function(S){
	/**定义编辑页面层以及异步grid引用*/
	var win,asyncStore;
	S.use("overlay", function (S, Overlay) {
		win = new Overlay.Dialog({
            bodyContent:'<iframe id="popupIframe" name="popupIframe"  height="320px" width=450px" frameborder="0"></iframe>',
            headerContent:'用户编辑',
            mask:true,
            maskShared:false,
            zIndex:1000
        });
		//关闭也就是隐藏的时候将iframe的url置空
		win.on("hide",function(){
			S.DOM.get("#popupIframe").src ="";
		});
    });
	/**定义列表*/
	S.use('gallery/grid/1.0/',function(S,Grid){
		asyncStore = new Grid.Store({
			url:'${ctx}/admin/user/pageData',
			autoLoad:true
		});
		var userStateEnum = {"0":"禁用","1":"可用"},
			asyncConfig = {
				renderTo:'content',
				columns:[
					{ title:'用户名',width:150,sortable:true,dataIndex:'userName',renderer:function(value,obj){
						return '<span class="grid-command btn-update" objid="'+obj.userId+'">'+value+'</span>';
					}},
					{ title:'真实姓名',width:150,sortable:true,dataIndex:'realName'},
					{ title:'邮箱',width:200,dataIndex:'email'},
					{ title:'状态',width:150,dataIndex:'userStatus',renderer:Grid.Util.Format.multipleItemsRenderer(userStateEnum)},
					{ title:'操作',width:100,dataIndex:'isDelete',renderer:function(value,obj){
						return '<span class="grid-command btn-del" objid="'+obj.userId+'">删除</span>';
					}}
				],
				width:Math.max(S.DOM.outerWidth("#content")-10,500),
				height:Math.max(S.DOM.outerHeight("#content"),200),
				checkable:true,//是否允许多选
				loadMask:true,
				store:asyncStore,
				tbar:{buttons:[
				               {id:'addsomething',text:'添加用户',
								handler:function(){
									win.show().center();
									S.DOM.get("#popupIframe").src ="${ctx}/admin/user/create";
								},
								css:'bar-btn-add'
				               },
				               {id:'delsomething',text:'批量删除',
								handler:function(){
									alert("批量删除");
								},
								css:'bar-btn-del'
				               }
							]
				},
				bbar:{pageSize : 20}
			};
		var asyncGrid = new Grid.Grid(asyncConfig);
	
		asyncGrid.on('cellclick',function(event){
			event.halt();//阻止事件冒泡
			var sender = S.one(event.domTarget);
			if(sender.hasClass('btn-update')){
				win.show().center();
				S.DOM.get("#popupIframe").src ="${ctx}/admin/user/update/"+sender.attr("objid");
			}else if(sender.hasClass('btn-del')){
				S.io({
                    url:'${ctx}/admin/user/delete/'+sender.attr("objid"),
                    type:'get',
                    success:function(d,s,xhr){
						asyncStore.load();//会重新加载数据，刷新
                    }
                });
			}
		});
	});
	//这个是给编辑页面调用的
	window.winHide = function(){
		win.hide();
	}
	window.gridReflash = function(){
		asyncStore.load();//会重新加载数据，刷新
	}
})(KISSY);
</script>
</body>
</html>
