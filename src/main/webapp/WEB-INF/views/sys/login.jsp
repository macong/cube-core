<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ include file="/WEB-INF/views/sys/commons/taglibs.jsp"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ page import="org.apache.shiro.web.filter.authc.FormAuthenticationFilter"%>
<%@ page import="org.apache.shiro.authc.LockedAccountException "%>
<html>
	<head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
        <link href="${ctx}/static/themes/css/login.css" type="text/css" title="R3CSS" rel="stylesheet">
        <noscript>登录到cube系统需要启用 JavaScript。当前浏览器不支持 JavaScript 或阻止了脚本。&lt;br /&gt;&lt;br/&gt;若要查看你的浏览器是否支持 JavaScript 或允许使用脚本，请查看浏览器联机帮助。</noscript>
        <title>系统登录</title>
        <style type="text/css">
            body{display:none;}
        </style>
        <!-- 这里加载js -->
        <style type="text/css">
            body{display:block !important;}
        </style>
        <script type="text/javascript">
        	function $id(domId){
        		return document.getElementById(domId);
        	}
        	//初始化操作
        	function init(){
        		//如果用户名处为空则显示提示消息
        		if(!$id("username").value){
        			$id("usernameHolder").style.display="block";
        		}
        		$id("username").focus();
        	}
        	//当input框获得焦点时候
        	function inputFocus(input,holderId){
        		$id(holderId).style.display="none";
        	}
        	//当input框失去焦点时候
        	function inputBlur(input,holderId){
        		if(!input.value){
        			$id(holderId).style.display="block";
        		}
        	}
        </script>
    </head>
    
    <body onload="init();">
    	<!-- 头部logo区域 -->
        <div style="width:100%;">
        	<!-- 
            <iframe width="100%" scrolling="no" height="123px" frameborder="0" id="i0277" marginheight="0px" marginwidth="0px" src=""></iframe>
        	 -->
        	<div style="width:100%;height:123px;">
		        <div class="container" style="height:120px;">
				    <div class="logo" style="padding-top:10px;">
				        <div class="floatLeft">
				        	<!-- 比较良好的尺寸：200×55 -->
				        	 <img width="90" height="80" src="${ctx}/static/themes/images/login/logo.png" alt="cube">
				        </div>
				    </div>
				</div>
        	</div>
        </div>
        <!-- 主区域 -->
        <div id="shellTD" class="centerParent" style="width: 100%;">
            <div id="shellTBL" class="center" style="width: 935px;">
                <div class="centerParent">
                    <div id="mainTD" class="center" style="width: 895px;">
                        <div id="brandModeTD" class="floatLeft" style="width: 475px;">
                            <div id="productTD" style="width: 475px;">
                                <iframe width="475px" scrolling="no" height="400px" frameborder="0" marginheight="0px" marginwidth="0px" src="${ctx}/loginInner">
                                </iframe>
                            </div>
                        </div>
                        <div id="signInTD" class="floatLeft" style="width: 420px; position: relative;">
                            <div id="titleTD" class="signInHeader">
                                <h1 id="idSUHeader9" class="cssSubHeader"> 登录</h1>
                            </div>
                            <div class="centerParent floatLeft" style="width: 100px;">
                                <div class="center" style="width: 1px; height: 328px; background-color: rgb(221, 221, 221);">
                                </div>
                            </div>
                            <div class="floatLeft" style="width: 320px;">
                                <div id="rightTD">
	                                <form:form id="loginForm"  action="${ctx}/admin/login" method="post">
									    <%
										String error = (String) request.getAttribute(FormAuthenticationFilter.DEFAULT_ERROR_KEY_ATTRIBUTE_NAME);
										if(error != null){
											if(error.contains("DisabledAccountException")){
										%>		
											<div>
										        <div class="errorDiv firstError">用户已被屏蔽,请登录其他用户.</div>
										    </div>
										<% 
											}else{
										%>
											<div>
										        <div class="errorDiv firstError">错误的用户名或密码.</div>
										    </div>
										<%
											}
										}
										%>
									    <div style="margin-bottom: 4px;" class="TextSizeSmall">
									        <span id="idLbl_PWD_Username">请输入用户名和密码</span>
									    </div>
									    <div id="errorUserName" style="display: none;">
									        <div id="errorUserName_Div" class="errorDiv">
									        </div>
									    </div>
									    <div style="margin-bottom: 8px;" class="textbox">
									        <div style="position: relative; width: 100%;">
									            <input id="username" name="username" value="${username}" class="inputstyle" maxlength="113" type="text" onfocus="inputFocus(this,'usernameHolder');" onblur="inputBlur(this,'usernameHolder');">
									            <div id="usernameHolder" style="position: absolute; top: 0px; left: 0px; z-index: 5; width: 100%;display:none;" onclick="$id('username').focus();">
									                <div style="cursor: text;" class="placeholder">用户名</div>
									            </div>
									        </div>
									    </div>
									    <div id="errorPassword" style="display: none;">
									        <div id="errorPassword_Div" class="errorDiv">
									        </div>
									    </div>
									    <div style="margin-bottom: 8px;" class="textbox" id="idDiv_PWD_PasswordTb">
									        <div style="position: relative; width: 100%;">
									            <input id="password" name="password" class="inputstyle" autocomplete="off" type="password" onfocus="inputFocus(this,'passwdHolder');" onblur="inputBlur(this,'passwdHolder');">
									            <div id="passwdHolder" style="position: absolute; top: 0px; left: 0px; z-index: 5; width: 100%;" onclick="$id('password').focus();">
									                <div style="cursor: text;" class="placeholder">密码</div>
									            </div>
									        </div>
									    </div>
									    <div style="margin-bottom: 30px;" id="idTd_PWD_KMSI_Cb">
									        <input id="rememberMe" name="rememberMe" type="checkbox">
									        <label id="idLbl_PWD_KMSI_Cb" for="idChkBx_PWD_KMSI0Pwd">保持登录状态</label>
									    </div>
									    <div style="margin-bottom: 30px;" id="idTd_PWD_SubmitCancelTbl">
									        <input class="default XLargePaddingRight" value="登录" type="submit">
									        <input class="default" value="快速登录" type="button" onclick="$id('passwdHolder').style.display='none';$id('password').value='admin',$id('usernameHolder').style.display='none';$id('username').value='admin',$id('loginForm').submit();">
									    </div>
									    <div style="margin-bottom: 6px;" class="TextSizeSmall">
									        <a href="#">忘记密码?</a>
									    </div>
									    <!-- 
									    <div class="TextSizeSmall">
									        <a href="#">使用一次性代码登录</a>
									    </div>
									     -->
									</form:form>
                                </div>
                                <div style="visibility: hidden;">
                                </div>
                            </div>
                            <div class="signUpFloat">
                            </div>
                        </div>
                    </div>
                </div>
                <div style="height: 50px; clear: both;">
                </div>
                <!-- 框架底部声明 -->
                <div id="footerTD" class="centerParent" style="clear: both; border-top: 1px solid rgb(204, 204, 204);">
                    <div class="center TextSizeSmall" style="width: 895px; padding-top: 10px; padding-bottom: 10px;">
                        <table cellspacing="0" cellpadding="0" style="width: 100%;">
                            <tbody>
                                <tr>
                                    <td align="left">
                                        <table cellspacing="0" cellpadding="0">
                                            <tbody>
                                                <tr>
                                                    <td style="text-align: left;">
                                                        <span id="ftrCopy" style="color: rgb(102, 102, 102);">
                                                            &copy;2012 CUBE
                                                        </span>
                                                    </td>
                                                    <td><span></span></td>
                                                    <td width="10px">&nbsp;</td>
                                                    <td width="10px">&nbsp;</td>
                                                    <td style="text-align: left;">
                                                        <a href="#" style="color: rgb(0, 0, 0);">条款</a>
                                                    </td>
                                                    <td width="10px">&nbsp;</td>
                                                    <td width="10px">&nbsp;</td>
                                                    <td style="text-align: left;">
                                                    	<!-- 
                                                        <a href="#" style="color: rgb(0, 0, 0);"> 隐私和 Cookie</a>
                                                    	 -->
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td>
                                    </td>
                                    <td align="right">
                                        <table cellspacing="0" cellpadding="0">
                                            <tbody>
                                                <tr>
                                                    <td style="text-align: right;">
                                                        <a href="#" style="color: rgb(0, 0, 0);" id="ftrHelp"> 帮助中心</a>
                                                    </td>
                                                    <td width="10px">&nbsp;</td>
                                                    <td width="10px">&nbsp;</td>
                                                    <td style="text-align: right;">
                                                        <a href="#" style="color: rgb(0, 0, 0);" id="ftrFdbk">问题反馈</a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <!-- 框架底部声明结束 -->
            </div>
        </div>
    </body>
</html>
