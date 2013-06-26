<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ include file="/WEB-INF/views/sys/commons/taglibs.jsp"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>用户编辑</title>
<link href="${ctx}/static/themes/css/main.css" rel="stylesheet" type="text/css" />
<link href="${ctx}/static/kissy/dpl/css/reset-min.css" rel="stylesheet" type="text/css" />
<link href="${ctx}/static/kissy/kissy/validation/assets/base-min.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="${ctx}/static/kissy/kissy/kissy.js"></script>
</head>
<body>
	<div id="container" class="lay-cf"> 
		<div id="content">
			<div class="form-title">人员信息</div>
			<form id="auth_form" class="form">
				<input id="userId" name="userId" type="hidden" value="${user.userId }">
				<ul class="form">
		            <li>
		                <label class="hd">用户名：<i>*</i></label>
		                <input id="userName" name="userName" class="text" type="text" value="${user.userName }" data-valid="regex: [/\S{6,18}/,'用户名必须为6~18个字符']}"/>
		            </li>
		            <li>
		                <label class="hd">真实姓名：</label>
		                <input id="realName" name="realName" class="text" type="text" value="${user.realName }" data-valid="{required:false}"/>
		            </li>
		            <li>
		                <label class="hd">密码：<i>*</i></label>
		                <input id="userPassword" name="userPassword" class="text" type="password" value="${user.userPassword }"
	                                   data-valid="regex: [/\S{5,30}/,'密码必须为6~18个字符']"/>
		            </li>
		            <li>
		                <label class="hd">重复密码：<i>*</i></label>
		                <input id="plainPassword" name="plainPassword" class="text" type="password" value="${user.userPassword }" data-valid="{equalTo:['#userPassword','两次密码不一致了']}"/>
		            </li>
		            <li>
		                <label class="hd">邮箱：</label>
		                <input id="email" name="email" class="text" type="text" value="${user.email }" data-valid="{email:true,required:false}"/>
		            </li>
		            <li>
		                <label class="hd">状态：</label>
		                <input id="radioid0" name="userStatus" type="radio" value="1" <c:if test="${user.userStatus == 1}">checked</c:if>><label class="label" for="radioid0">可用</label>
	                                    <input id="radioid1" name="userStatus" type="radio" data-valid="{}"
	                                    	value="0" <c:if test="${user.userStatus == 0}">checked</c:if>><label class="label" for="radioid1">禁用</label>
		            </li>
		        </ul>
			</form>
		</div>
		<div id="footer">
			<div class="btn-right">
				<button id="btn_save" class="btn btn-primary">保存</button>
				<button id="btn_close" class="btn">关闭</button>
			</div>
		</div>
	</div>
<script type="text/javascript">
(function(S){
	S.use("validation", function (S, validation) {

        var form = new validation('#auth_form', {
        	event: 'blur',  //响应事件
        	style:'text'
        });

        S.Event.on('#btn_save', "click", function () {
            if(form.isValid()){//验证通过
            	S.io({
                    url:'${ctx}/admin/user/save',
                    form:'#auth_form',
                    type:'post',
                    dataType:'json',
                    serializeArray:false,
                    success:function(d,s,xhr){
                    	parent.gridReflash();
                    	parent.winHide();
                    }
                });
            }
        });
        
        S.Event.on('#btn_close', "click", function () {
            parent.winHide();
        });

    });
})(KISSY);
</script>
</body>
</html>
