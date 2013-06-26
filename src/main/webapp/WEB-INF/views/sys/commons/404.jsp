<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ include file="/WEB-INF/views/sys/commons/taglibs.jsp"%>
<html>
<head>
<title>404页面</title>
<link href="${ctx}/static/themes/css/err.css" rel="stylesheet" type="text/css" />
<script type="text/javascript">
   function seturl(){
	   var urlHref = location.href;
	   var newHref = urlHref;
	   if(urlHref.length>100){
		   newHref = urlHref.substring(0,100)+"...";
	   }
	   var urlEl = document.getElementById("url");
	   urlEl.setAttribute('title',urlHref);
	   urlEl.innerHTML = newHref;
   }
</script>	
</head>
<body onload="seturl()" class="topui_error_bg" style="width:auto;height:auto;">
<div class="topui_error">
    <div class="topui_error_box404">
        <div class="topui_error_box_line">
            <h1>
                404 - 页面不存在!
            </h1>
            <p>
                	您请求的页面<label id="url"></label>不存在，它可能已经转到其他地址，或者可能您输入的URL有错误
            </p>
        </div>
        <div class="topui_error_box_font">
            <p>
                	如果您持续遇到这类问题，请联络我们
            </p>
            <p>
                	对此产生的不便我们表示歉意
            </p>
            <p>
                &nbsp;
            </p>
            <p>
                &nbsp;
            </p>
            <p>
                <!-- 
	                <a href="javascript:window.close();">
	                    	关闭此页
	                </a>
	             -->
            </p>
        </div>
    </div>
</div>
</body>
</html>
