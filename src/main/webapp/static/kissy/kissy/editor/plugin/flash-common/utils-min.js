/*
Copyright 2012, KISSY UI Library v1.40dev
MIT Licensed
build time: Aug 7 22:12
*/
KISSY.add("editor/plugin/flash-common/utils",function(m){var e=m.DOM,o=m.Node,q=m.UA,j={insertFlash:function(a,c,b,d,h){c=j.createSWF(c,{attrs:b},a.get("document")[0]);b=a.createFakeElement(c.el,d||"ke_flash",h||"flash",!0,c.html,b);a.insertElement(b);return b},isFlashEmbed:function(a){return"application/x-shockwave-flash"==a.getAttribute("type")||/\.swf(?:$|\?)/i.test(a.getAttribute("src")||"")},getUrl:function(a){var c="";if("object"==a.nodeName())for(var a=a[0].childNodes,b=0;b<a.length;b++)1==
a[b].nodeType&&("movie"==(e.attr(a[b],"name")||"").toLowerCase()?c=e.attr(a[b],"value"):"embed"==e.nodeName(a[b])?c=e.attr(a[b],"src"):"object"==e.nodeName(a[b])&&(c=e.attr(a[b],"data")));else"embed"==a.nodeName()&&(c=a.attr("src"));return c},createSWF:function(a,c,b){var d=c.attrs||{},h=c.flashVars,e="",i="",c=c.params||{},f="",b=b||document;m.mix(d,{wmode:"transparent"});for(var g in d)d.hasOwnProperty(g)&&(e+=g+"='"+d[g]+"' ");m.mix(c,{quality:"high",movie:a,wmode:"transparent"});for(var k in c)c.hasOwnProperty(k)&&
(i+="<param name='"+k+"' value='"+c[k]+"'/>");if(h){for(var l in h)h.hasOwnProperty(l)&&(f+="&"+l+"="+encodeURIComponent(h[l]));f=f.substring(1)}a="<object "+e+' classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" >'+i+(f?'<param name="flashVars" value="'+f+'"/>':"")+"<embed "+e+" "+(f?'FlashVars="'+f+'"':"")+' pluginspage="http://www.macromedia.com/go/getflashplayer"  quality="high"  src="'+a+'"  type="application/x-shockwave-flash"/></object>';return{el:new o(a,null,b),html:a}},createSWFRuntime2:function(a,
c,b){var b=b||document,d=(new o("<div style='width:0;height:0;overflow:hidden;'>",null,b)).appendTo(b.body),d=j.createSWF.apply(this,arguments).el.appendTo(d);q.ie||(d=d.one("object"));return d[0]},createSWFRuntime:function(a,c,b){var d=c.attrs||{},h=c.flashVars||{},j=c.params||{},i="",f="",g="",b=b||document;d.id=d.id||m.guid("ks-editor-runtimeflash-");for(var k in d)d.hasOwnProperty(k)&&(i+=k+"='"+d[k]+"' ");for(var l in j)j.hasOwnProperty(l)&&(f+="<param name='"+l+"' value='"+j[l]+"'/>");for(var p in h)h.hasOwnProperty(p)&&
(g+="&"+p+"="+encodeURIComponent(h[p]));var g=g.substring(1),a=q.ie?"<object "+i+' classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" >'+f+'<param name="movie" value="'+a+'" />'+(g?'<param name="flashVars" value="'+g+'" />':"")+"</object>":"<object type='application/x-shockwave-flash' data='"+a+"' "+i+">"+f+(g?'<param name="flashVars" value="'+g+'"/>':"")+"</object>",n=c.holder;n||(n=(new o("<div style='"+(c.style?c.style:"width:1px;height:1px;position:absolute;NaN")+"'>",null,b)).appendTo(b.body),
setTimeout(function(){n.offset({left:e.scrollLeft(),top:e.scrollTop()})},100));n.html(a);return b.getElementById(d.id)}};return j});
