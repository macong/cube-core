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
</head>
<body>
	<div id="container"> 
		<div id="header">
			<div class="btn-right">
				<button id="btn_save" class="btn btn-primary">保存</button>
				<button id="btn_close" class="btn">关闭</button>
			</div>
		</div>
		<div id="content">
			<form id="auth_form" class="form">
				<hr/>
                <div>
                    <div class="field">
                        <div class="hd">
                            <span class="required">*</span>
                            <label class="label">用户名</label>
                        </div>
                        <div class="bd">
                            <div class="cell">
                                <input id="username" name="username" class="text" type="text" value="${user.userName }" required data-valid="{required:'必填'}"/>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <div class="hd">
                            <span class="required">*</span>
                            <label class="label">真实姓名</label>
                        </div>
                        <div class="bd">
                            <div class="cell">
                                <input id="realName" name="realName" class="text" type="text" value="${user.realName }" required data-valid="{required:'必填'}"/>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <div class="hd">
                            <span class="required">*</span>
                            <label class="label">密码</label>
                        </div>
                        <div class="bd">
                            <div class="cell">
                                <input id="password" name="userPassword" class="text" type="password" value="${user.userPassword }" required pattern="[\w\W]{3,18}"
                                   data-valid="{required:'密码必填',pattern:'密码格式不正确'}"/>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <div class="hd">
                            <span class="required">*</span>
                            <label class="label">重复密码</label>
                        </div>
                        <div class="bd">
                            <div class="cell">
                                <input id="plainPassword" name="plainPassword" class="text" type="password" value="${user.userPassword }" data-valid="{equalTo:'两次密码不一致'}" equalTo="#password"/>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <div class="hd">
                            <label class="label">邮箱</label>
                        </div>
                        <div class="bd">
                            <div class="cell">
	                            <input id="email" name="email" type="text" class="text" value="${user.email }"
	                                   pattern="^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$"
	                                   data-valid="{pattern:'邮箱格式不对'}"/>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <div class="hd">
                            <label class="label">状态</label>
                        </div>
                        <div class="bd">
                            <div class="cell">
	                            <div class="cell">
                                    <input id="radioid0" name="userStatus" type="radio" value="1" <c:if test="${user.userStatus == 1}">checked</c:if>><label class="label" for="radioid0">可用</label>
                                    <input id="radioid1" name="userStatus" type="radio" required="required" data-valid="{required:'状态必填'}"
                                    	value="0" <c:if test="${user.userStatus == 0}">checked</c:if>><label class="label" for="radioid1">禁用</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 
                    <div class="field">
                        <div class="hd">
                            <span class="required">*</span>
                            <label class="label">file：</label>
                        </div>
                        <div class="bd">
                            <div class="cell">
                                <input type="file"/>
                            </div>
                        </div>
                    </div>
                     -->
                </div>
				<hr/>
			</form>
		</div>
	</div>
<script type="text/javascript">
(function(S){
	S.use("gallery/form/1.2/auth/index", function (S, Auth) {

        var form = new Auth('#auth_form', {
            autoBind:true,
            stopOnError:false,
            msg:{
                tpl:'<div class="msg-default msg-error"><i class="msg-icon"></i><div class="msg-content">{msg}</div></div>'
            }
        });

        S.Event.on('#btn_save', "click", function () {
            form.validate();
            if(form.get('result')){//验证通过
            	alert("save");
            }
        });

    });
})(KISSY);
</script>
</body>
</html>
