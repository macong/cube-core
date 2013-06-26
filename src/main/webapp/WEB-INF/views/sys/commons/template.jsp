<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ include file="/WEB-INF/views/sys/commons/taglibs.jsp"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>template</title>
<link href="${ctx}/static/themes/css/main.css" rel="stylesheet" type="text/css" />
<link href="${ctx}/static/kissy/dpl/css/reset-min.css" rel="stylesheet" type="text/css" />
<link href="${ctx}/static/kissy/gallery/grid/1.0/assets/grid-min.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="${ctx}/static/kissy/kissy/kissy.js"></script>
<script type="text/javascript">
/*KISSY.config({
	packages:[{
		name:"gallery",
		path:"${ctx}/static/kissy/",
		charset:'utf-8'
	}]
});*/
</script>
</head>
<body>
	<div id="container"> 
		<div id="header">
			<!-- 导航栏 -->
			<ul class="navi">
				<li style="margin-right: 5px" class="right">
				  	<a accesskey="I" title="General Index" href="#">index</a></li>
				<li class="right">
				  	<a title="Python Module Index" href="#">modules</a> | </li>
				<li class="right">
				  	<a accesskey="N" title="add" href="#">next</a> | </li>
				<li class="right">
				  	<a accesskey="P" title="getScript" href="#">previous</a> | </li>
				<li><a href="#">KISSY v1.3rc Documentation</a> » </li>
				<li><a href="#">API Documentation</a> » </li>
				<li><a href="#">Seed</a> » </li>
				<li><a accesskey="U" href="#">loader</a> » </li> 
			</ul>
		</div>
		<!-- 主内容区 -->
		<div id="content" style="background-color:blue;">content</div>
	</div>
</body>
</html>
