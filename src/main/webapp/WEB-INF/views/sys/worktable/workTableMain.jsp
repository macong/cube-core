<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ include file="/WEB-INF/views/sys/commons/taglibs.jsp"%>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>工作台</title>
<link href="${ctx}/static/worktable/css/worktable.css" rel="stylesheet" type="text/css" />
<link href="${ctx}/static/worktable/css/layout.css" rel="stylesheet" type="text/css" />
<style type="text/css">
body{display:none;}
</style>
<script type="text/javascript" src="${ctx}/static/worktable/js/mootools1.3.js"></script>
<script type="text/javascript" src="${ctx}/static/worktable/js/wt_util.js"></script>
<script type="text/javascript" src="${ctx}/static/worktable/js/layout.js"></script>
<script type="text/javascript" src="${ctx}/static/worktable/js/mbox.js"></script>
<script type="text/javascript" src="${ctx}/static/worktable/js/worktable.js"></script>
<style type="text/css">
body{display:block !important;}
</style>

<script language="javascript">
	var webRoot = "${ctx}";
	var globalUserName = '<shiro:principal property="loginName"/>';
	var mainFrameName = "innerTopMain";
	//离开页面
	function relogin(){
		if(confirm("您确定要退出系统?")){
			window.location.href ="${ctx}/admin/logout";	
		}
	}

</script>
</head>
<body id='bodyEl'>
	<!-- 头部区域 -->
	<div id="topEl" class="header">
	    <div class="work_heard">
		    <div class="work_heard_logo" id="currentTeamDutyId">
            	我的工作台
		    </div>
		    <div class="work_heard_user" style="width: 420px;">
		        <ul>
		            <li class="ic_quit" style="cursor: pointer;">
		                <a href="javascript:" title="退出" onclick="relogin();return false;">
		                    退出
		                </a>
		            </li>
		            <li class="ic_return">
		                <a href="javascript:" title="切换到菜单模式窗口" onclick="return false;">
		                    菜单模式
		                </a>
		            </li>
					<shiro:user>
					<li class="ic_user" style="padding-right:5px;">
						<shiro:principal property="name"/>
					</li>
					</shiro:user>
		        </ul>
		    </div>
		    <!-- 
		    <div class="work_heard_tool">
		        <span class="work_ic_contact" title="联系我们" onclick="openPopup(3);">
		        </span>
		        <span class="work_ic_download" title="下载部件" onclick="alert('下载部件');">
		        </span>
		        <span class="work_ic_feedback" title="问题反馈" onclick="alert('问题反馈');">
		        </span>
		        <span class="work_ic_manual" title="下载用户手册" onclick="alert('下载用户手册');">
		        </span>
		        <span class="work_ic_chart" title="统计中心" onclick="alert('统计中心');">
		        </span>
		    </div>
		     -->
		</div>
	</div>
	<!-- 左侧导航区域 -->
	<div id='leftEl'>
		<div id='lheader'><a href="javascript:;" onclick="leftToggleFun();" class="left_togbut" style=""><span id="leftToggle"></span></a></div>
		<div id='lmain' style="overflow: hidden;">
			<!-- 代办导航 -->
			<div class="arrDiv up_arr"><a href="javascript:;" class="a_up_arr" onclick="leftMenuScroll(1);return false;" title="上">▲</a><a href="javascript:;" class="a_down_arr" onclick="leftMenuScroll(2);return false;" title="下">▼</a></div>
			<div id="left_menu" class="left_menu" style="height:100%;overflow: hidden;padding:0 2px;">
			</div>
			<div class="arrDiv down_arr"><a href="javascript:;" class="a_up_arr" onclick="leftMenuScroll(1);return false;" title="上">▲</a><a href="javascript:;" class="a_down_arr" onclick="leftMenuScroll(2);return false;" title="下">▼</a></div>
		</div>
	</div>
	<!-- 主工作区域 -->
	<div id='innerTopEl'>
		<!-- 菜单展示区域  position:static;这个样式很关键，不然ie6上出不来-->
		<div id='innerTopHeader' style="position:static;overflow:visible;">
			<div style="width:100%;position:absolute;z-index: 120;left:0;top:0;">
				<div id='menuContent' style="margin:0 24px 0 0;height:25px;">
				</div>
				<div style="position: absolute;right:0;top:0px;width:24px;height:25px;padding:3px;">
					<a class="a_conf" href="javascript:;" onclick="openWorkTableConfig();return false;" title="配置菜单" hidefocus="true" ><span class="i_conf"></span></a>
				</div>
			</div>
			<iframe id="work_menu_frame" scrolling="no" style="dispaly:none;left: -500px;width:100px;height:100px;position:absolute; z-index:111; border:0; filter:alpha(opacity='0')"></iframe>
		</div>
		<!-- 主工作区iframe -->
		<iframe id='innerTopMain' name="innerTopMain" frameborder="0"></iframe>
	</div>
	<!-- 待办事宜显示的内容块 -->
	<div id="work_tips" style="top:55px; left: -500px; min-width: 127px; _width: 127px;overflow:visible; padding-bottom: 10px;visibility: visible;" class="work_nav_tips">
        <div id="work_tips_centent" class="work_list_cont">
        </div>
        <span class="work_nav_tips_close" onclick="this.parentNode.style.visibility='hidden';">
        </span>
    </div>
    <iframe id="work_tips_frame" scrolling="no" style="dispaly:none;left: -500px;width:100px;height:100px;position:absolute; z-index:89; border:0; filter:alpha(opacity='0')"></iframe>
    <iframe id="work_undoFloatDiv_frame" scrolling="no" style="dispaly:none;left: -500px;width:100px;height:100px;position:absolute; z-index:89; border:0; filter:alpha(opacity='0')"></iframe>
    <!-- 菜单数据加载菊花 -->
    <div id="menuDataMess" style="position: absolute;left: 45px;top: 40px;z-index: 1;"><img border="0" style="margin-top:3px; " src="${ctx}/static/worktable/images/worktable/load_portal.gif"/></div>
    <!-- 左侧待办浮动块 -->
    <div id="undoFloatDiv" style="position: absolute;left: 0px;bottom: 0px;z-index: 90;border:1px solid #909090;border-right:2px solid #909090;width: 300px;background-color: #fff;">
    	<div class='m-panel-header'><label style='float:left;font-weight:bold;'>&nbsp;待办事宜</label><a style='float:right;margin-right:35px;color: #0066CC;' href="javascript:;" onclick="renderLeftData();">&nbsp;刷新</a><span class='work_nav_tips_close' onclick='leftToggleFun();' style='right:2px;top:6px;' title='关闭'></span></div>
    	<div id="undoFloatDiv_con" style="width: 100%;height:100%;overflow: auto;"></div>
    	<div id="float_resize" class="float_resize"></div>
    </div>
    <!-- drag_iframe_mask这个是为了拖动的时候不至于拖动到iframe上而没有反映 -->
    <div id="drag_iframe_mask" style="position: absolute;left: 0px;top: 0px;z-index: 99;height:100%;width:100%;display:none;"></div>
</body>
</html>
