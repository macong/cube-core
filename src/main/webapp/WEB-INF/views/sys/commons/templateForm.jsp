<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ include file="/WEB-INF/views/sys/commons/taglibs.jsp"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>用户编辑</title>
<link href="${ctx}/static/themes/css/main.css" rel="stylesheet" type="text/css" />
<link href="${ctx}/static/kissy/dpl/css/reset-min.css" rel="stylesheet" type="text/css" />
<link href="${ctx}/static/kissy/dpl/css/form-min.css" rel="stylesheet" type="text/css" />
<link href="${ctx}/static/kissy/dpl/css/msg-min.css" rel="stylesheet" type="text/css" />
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
			<div class="btn-right">
				<button class="btn btn-primary">保存</button>
				<button class="btn">关闭</button>
			</div>
		</div>
		<div id="content">
			<form class="form">
				<hr/>
                <div class="field-msg-inline">
                    <!-- {{{ field.input -->
                    <div class="field">
                        <div class="hd">
                            <span class="required">*</span>
                            <label class="label">用户名：</label>
                        </div>
                        <div class="bd">
                            <div class="cell">
                                <input class="text" type="text" value="${user.userName }"/>
                            </div>
                            <!-- {{{ msg -->
                            <div class="msg msg-inline">
                                <div class="msg-default msg-tips">
                                    <i class="msg-icon"></i>
                                    <div class="msg-content">common tips</div>
                                </div>
                            </div>
                            <!-- msg }}} -->
                        </div>
                    </div>
                    <!-- field.input }}} -->
                    <!-- {{{ field.password -->
                    <div class="field">
                        <div class="hd">
                            <span class="required">*</span>
                            <label class="label">password：</label>
                        </div>
                        <div class="bd">
                            <div class="cell">
                                <input class="password" type="password"/>
                            </div>
                            <!-- {{{ msg -->
                            <div class="msg msg-inline">
                                <div class="msg-default msg-error">
                                    <i class="msg-icon"></i>
                                    <div class="msg-content">error message</div>
                                </div>
                            </div>
                            <!-- msg }}} -->
                        </div>
                    </div>
                    <!-- field.password }}} -->
                    <!-- {{{ field.file -->
                    <div class="field">
                        <div class="hd">
                            <span class="required">*</span>
                            <label class="label">file：</label>
                        </div>
                        <div class="bd">
                            <div class="cell">
                                <input type="file"/>
                            </div>
                            <!-- {{{ msg -->
                            <div class="msg msg-inline">
                                <div class="msg-default msg-ok">
                                    <i class="msg-icon"></i>
                                    <div class="msg-content">validate success</div>
                                </div>
                            </div>
                            <!-- msg }}} -->
                        </div>
                    </div>
                    <!-- field.file }}} -->
                </div>
				<hr/>
			</form>
		</div>
	</div>
</body>
</html>
