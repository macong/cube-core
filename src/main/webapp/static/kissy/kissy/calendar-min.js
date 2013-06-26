/*
Copyright 2012, KISSY UI Library v1.40dev
MIT Licensed
build time: Jul 30 19:00
*/
KISSY.add("calendar/base",function(g,h,k,j,f){function c(a,b){this._init(a,b)}var b=h.all;g.augment(c,k.Target,{_init:function(a,n){var d=b(a);this.id=this._stamp(d);this._buildParam(n);this.popup?(this.trigger=d,this.con=new h("<div>"),b(document.body).append(this.con),this.con.css({top:"0px",position:"absolute",background:"white",visibility:"hidden","z-index":99999999})):this.con=d;this.C_Id=this._stamp(this.con);this.render();this._buildEvent();return this},render:function(a){var b=0,d,e,a=a||
{};this._parseParam(a);this.con.addClass("ks-cal-call ks-clearfix ks-cal-call-multi-"+this.pages);this.ca=this.ca||[];for(b=0;b<this.ca.length;b++)this.ca[b].detachEvent();this.__shimEl&&(this.__shimEl.remove(),delete this.__shimEl);this.con.empty();this.ca.length=this.pages;var c=!1,f=!1;this.range&&(this.range.start&&(c=!0),this.range.end&&(f=!0));e=c&&!this.rangeLinkage?[this.range.start.getFullYear(),this.range.start.getMonth()]:[this.year,this.month];for(b=0;b<this.pages;b++){0===b?(c&&(this._time=
g.clone(this.range.start)),a=!0):this.rangeLinkage?(f&&(this._time=g.clone(this.range.end)),a=!1,e=this._computeNextMonth(e)):(f&&(this._time=g.clone(this.range.end)),a=!0,e=f&&b+1==this.pages?[this.range.end.getFullYear(),this.range.end.getMonth()]:this._computeNextMonth(e));d=this.rangeLinkage?b==this.pages-1:!0;var i=this.ca[b];if(!this.rangeLinkage&&i&&(i.year!=e[0]||i.month!=e[1]))e=[i.year,i.month];this.ca[b]=new this.Page({year:e[0],month:e[1],prevArrow:a,nextArrow:d,showTime:this.showTime},
this);this.ca[b].render()}this.popup&&6===j.ie&&(this.__shimEl=new h("<iframe frameBorder='0' style='position: absolute;border: none;width: expression(this.parentNode.offsetWidth-3);top: 0;left: 0;z-index: 0;height: expression(this.parentNode.offsetHeight-3);'></iframe>"),this.con.prepend(this.__shimEl));return this},destroy:function(){for(var a=0;a<this.ca.length;a++)this.ca[a].detachEvent();g.each(this.EV,function(a){a&&a.target.detach(a.type,a.fn)});this.con.remove()},_stamp:function(a){a.attr("id")||
a.attr("id",g.guid("K_Calendar"));return a.attr("id")},_buildEvent:function(){var a=this,c,d;if(!a.popup)return this;g.each(a.EV,function(a){a&&a.target.detach(a.type,a.fn)});a.EV=a.EV||[];c=a.EV[0]={target:b(document),type:"click"};c.fn=function(e){var d=b(e.target);d.attr("id")===a.C_Id||(d.hasClass("ks-next")||d.hasClass("ks-prev"))&&"A"===d[0].tagName||d.attr("id")==a.id||"hidden"==a.con.css("visibility")||a.con.contains(d)&&("option"===d[0].nodeName.toLowerCase()||"select"===d[0].nodeName.toLowerCase())||
(e=[e.pageX,e.pageY],d=[{x:a.con.offset().left,y:a.con.offset().top},{x:a.con.offset().left+a.con.width(),y:a.con.offset().top+a.con.height()}],e[0]>d[0].x&&e[0]<d[1].x&&e[1]>d[0].y&&e[1]<d[1].y||a.hide())};c.target.on(c.type,c.fn);for(d=0;d<a.triggerType.length;d++)c=a.EV[d+1]={target:b("#"+a.id),type:a.triggerType[d],fn:function(e){e.target=b(e.target);e.preventDefault();var d=a.triggerType;g.inArray("click",d)&&g.inArray("focus",d)?"focus"==e.type&&a.toggle():g.inArray("click",d)&&!g.inArray("focus",
d)?"click"==e.type&&a.toggle():!g.inArray("click",d)&&g.inArray("focus",d)?setTimeout(function(){a.toggle()},170):a.toggle()}},c.target.on(c.type,c.fn);return this},__getAlignOffset:function(a,b){var d=b.charAt(0),e=b.charAt(1),c,f,i,g;a?(a=h.one(a),c=a.offset(),f=a.outerWidth(),i=a.outerHeight()):(c={left:DOM.scrollLeft(),top:DOM.scrollTop()},f=DOM.viewportWidth(),i=DOM.viewportHeight());g=c.left;c=c.top;"c"===d?c+=i/2:"b"===d&&(c+=i);"c"===e?g+=f/2:"r"===e&&(g+=f);return{left:g,top:c}},toggle:function(){"hidden"==
this.con.css("visibility")?this.show():this.hide()},show:function(){this.con.css("visibility","");var a=this.align.points,b=this.align.offset||[0,0],d=this.con.offset(),e=this.__getAlignOffset(this.trigger,a[0]),a=this.__getAlignOffset(this.con,a[1]),e=[a.left-e.left,a.top-e.top],a=d.top-e[1]+b[1];this.con.css("left",(d.left-e[0]+b[0]).toString()+"px");this.con.css("top",a.toString()+"px");this.fire("show");return this},hide:function(){this.con.css("visibility","hidden");this.fire("hide");return this},
_buildParam:function(a){var b=this;if(a===f||null===a)a={};g.each({date:new Date,selected:null,startDay:0,pages:1,closable:!1,rangeSelect:!1,minDate:!1,maxDate:!1,multiSelect:!1,multi:null,navigator:!0,popup:!1,showTime:!1,triggerType:["click"],disabled:null,range:null,rangeLinkage:!0,align:{points:["bl","tl"],offset:[0,0]},notLimited:!1},function(d,e){var c=a[e];b[e]=c===f||null===c?d:c});return this},_parseParam:function(a){var b;if(a===f||null===a)a={};for(b in a)this[b]=a[b];"string"===typeof this.triggerType&&
(this.triggerType=[this.triggerType]);this.startDay%=7;0>this.startDay&&(this.startDay+=7);this.EV=[];this._handleDate();if(this.multiSelect&&(this.rangeSelect=!1,this.selected=this.range=null,this.multi))for(b=0;b<this.multi.length;b++)this.multi[b]instanceof Date&&(this.multi[b]=this._handleDate2String(this.multi[b]));return this},_templetShow:function(a,b){var d,e,c,g;if(b instanceof Array){d="";for(e=0;e<b.length;e++)d+=arguments.callee(a,b[e]);a=d}else if(d=a.match(/{\$(.*?)}/g),b!==f&&null!==
d){e=0;for(c=d.length;e<c;e++)g=d[e].replace(/({\$)|}/g,""),g=b[g]!==f?b[g]:"",a=a.replace(d[e],g)}return a},_handleDate:function(){var a=this.date;this.weekday=a.getDay()+1;this.day=a.getDate();this.month=a.getMonth();this.year=a.getFullYear();return this},_handleDate2String:function(a){var b=a.getFullYear(),d=a.getMonth(),a=a.getDate();return b+"-"+(8<d?d+1:"0"+(d+1))+"-"+(9<a?a:"0"+a)},_handleString2Date:function(a){a=a.toString().split("-");if(3==a.length&&(date=new Date(parseInt(a[0],10),parseInt(a[1],
10)-1,parseInt(a[2],10)),date instanceof Date&&"Invalid Date"!=date&&!isNaN(date)))return date},_getHeadStr:function(a,b){return a.toString()+"\u5e74"+(Number(b)+1).toString()+"\u6708"},_monthAdd:function(){11==this.month?(this.year++,this.month=0):this.month++;this.date=new Date(this.year.toString()+"/"+(this.month+1).toString()+"/1");return this},_monthMinus:function(){0===this.month?(this.year--,this.month=11):this.month--;this.date=new Date(this.year.toString()+"/"+(this.month+1).toString()+"/1");return this},
_yearAdd:function(){this.year++;this.date=new Date(this.year.toString()+"/"+(this.month+1).toString()+"/1");return this},_yearMinus:function(){this.year--;this.date=new Date(this.year.toString()+"/"+(this.month+1).toString()+"/1");return this},_computeNextMonth:function(a){var b=a[0],a=a[1];11==a?(b++,a=0):a++;return[b,a]},_handleOffset:function(){for(var a="\u65e5,\u4e00,\u4e8c,\u4e09,\u56db,\u4e94,\u516d".split(","),b=this.startDay,d="",d=[],e=0;7>e;e++)d[e]={day:a[(e+b)%7]};d=this._templetShow("<span>{$day}</span>",d);return{day_html:d}},
_handleRange:function(a){this.range=this.range||{start:null,end:null};null===this.range.start&&null===this.range.end||null!==this.range.start&&null!==this.range.end?(this.range.start=a,this.range.end=null):null!==this.range.start&&null===this.range.end&&(this.range.end=a,this.range.start.getTime()>this.range.end.getTime()&&(a=this.range.start,this.range.start=this.range.end,this.range.end=a),this.fire("rangeSelect",this.range),this.popup&&this.closable&&this.hide());return this},_handleMultiSelectStart:function(a){this.multiStart=
a},_handleMultiSelectEnd:function(a){if(this.multiStart){this.multi=this.multi||[];a<this.multiStart?(this.multiEnd=this.multiStart,this.multiStart=a):this.multiEnd=a;this.minDate&&this.multiStart<this.minDate&&(this.multiStart=new Date(this.minDate.getFullYear(),this.minDate.getMonth(),this.minDate.getDate()));this.maxDate&&this.multiEnd>this.maxDate&&(this.multiEnd=new Date(this.maxDate.getFullYear(),this.maxDate.getMonth(),this.maxDate.getDate()));for(;this.multiStart<=this.multiEnd;){a=!1;if(this.disabled&&
0<this.disabled.length)for(var b=0;b<this.disabled.length;b++)if(this.disabled[b].getTime()==this.multiStart.getTime()){a=!0;break}a||(a=this._handleDate2String(this.multiStart),g.inArray(a,this.multi)?this.multi.splice(g.indexOf(a,this.multi),1):this.multi.push(a),this.multiStart.setDate(this.multiStart.getDate()+1))}this.multiStart=null;this.render()}},_handleMultiSelect:function(){this.multi=this.multi||[];this.multi.sort(function(a,b){return a>b?1:-1});for(var a=0;a<this.multi.length;a++)this.multi[a]=
this._handleString2Date(this.multi[a]);this.fire("multiSelect",{multi:this.multi});this.popup&&this.closable&&this.hide()}});return c},{requires:["node","event","ua"]});KISSY.add("calendar",function(g,h,k,j,f){g.Date=h.Date=f;return g.Calendar=h},{requires:["calendar/base","calendar/page","calendar/time","calendar/date"]});
KISSY.add("calendar/date",function(){function g(g,j){var f=null,j=j||"-";if(f instanceof Date)return f;f=new Date(g);if(f instanceof Date&&"Invalid Date"!=f&&!isNaN(f))return f;f=g.toString().split(j);return 3==f.length&&(f=new Date(f[0],parseInt(f[1],10)-1,f[2]),f instanceof Date&&"Invalid Date"!=f&&!isNaN(f))?f:null}var h=function(){var g=/w{1}|d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,j=/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
f=/[^-+\dA-Z]/g,c=function(a,b){a=""+a;for(b=b||2;a.length<b;)a="0"+a;return a},b={"default":"ddd mmm dd yyyy HH:MM:ss",shortDate:"m/d/yy",longDate:"mmmm d, yyyy",fullDate:"dddd, mmmm d, yyyy",shortTime:"h:MM TT",longTime:"h:MM:ss TT Z",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",isoUTCDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",localShortDate:"yy\u5e74mm\u6708dd\u65e5",localShortDateTime:"yy\u5e74mm\u6708dd\u65e5 hh:MM:ss TT",localLongDate:"yyyy\u5e74mm\u6708dd\u65e5",localLongDateTime:"yyyy\u5e74mm\u6708dd\u65e5 hh:MM:ss TT",
localFullDate:"yyyy\u5e74mm\u6708dd\u65e5 w",localFullDateTime:"yyyy\u5e74mm\u6708dd\u65e5 w hh:MM:ss TT"},a="Sun,Mon,Tue,Wed,Thu,Fri,Sat,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,\u661f\u671f\u65e5,\u661f\u671f\u4e00,\u661f\u671f\u4e8c,\u661f\u671f\u4e09,\u661f\u671f\u56db,\u661f\u671f\u4e94,\u661f\u671f\u516d".split(","),n="Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec,January,February,March,April,May,June,July,August,September,October,November,December".split(",");return function(d,e,o){1==arguments.length&&"[object String]"==Object.prototype.toString.call(d)&&!/\d/.test(d)&&(e=d,d=void 0);d=d?new Date(d):new Date;
if(isNaN(d))throw SyntaxError("invalid date");e=""+(b[e]||e||b["default"]);"UTC:"==e.slice(0,4)&&(e=e.slice(4),o=!0);var l=o?"getUTC":"get",i=d[l+"Date"](),h=d[l+"Day"](),p=d[l+"Month"](),r=d[l+"FullYear"](),m=d[l+"Hours"](),s=d[l+"Minutes"](),t=d[l+"Seconds"](),l=d[l+"Milliseconds"](),q=o?0:d.getTimezoneOffset(),u={d:i,dd:c(i,void 0),ddd:a[h],dddd:a[h+7],w:a[h+14],m:p+1,mm:c(p+1,void 0),mmm:n[p],mmmm:n[p+12],yy:(""+r).slice(2),yyyy:r,h:m%12||12,hh:c(m%12||12,void 0),H:m,HH:c(m,void 0),M:s,MM:c(s,
void 0),s:t,ss:c(t,void 0),l:c(l,3),L:c(99<l?Math.round(l/10):l,void 0),t:12>m?"a":"p",tt:12>m?"am":"pm",T:12>m?"A":"P",TT:12>m?"AM":"PM",Z:o?"UTC":((""+d).match(j)||[""]).pop().replace(f,""),o:(0<q?"-":"+")+c(100*Math.floor(Math.abs(q)/60)+Math.abs(q)%60,4),S:["th","st","nd","rd"][3<i%10?0:(10!=i%100-i%10)*i%10]};return e.replace(g,function(a){return a in u?u[a]:a.slice(1,a.length-1)})}}();return{format:function(g,j,f){return h(g,j,f)},parse:function(h,j){return g(h,j)}}});
KISSY.add("calendar/page",function(g,h,k,j){g.augment(j,{Page:function(f,c){this.father=c;this.month=Number(f.month);this.year=Number(f.year);this.prevArrow=f.prevArrow;this.nextArrow=f.nextArrow;this.timmer=this.node=null;this.id="";this.html=['<div class="ks-cal-box" id="{$id}"><div class="ks-cal-hd"><a href="javascript:void(0);" class="ks-prev-year {$prev}"><</a><a href="javascript:void(0);" class="ks-prev-month {$prev}"><</a><a href="javascript:void(0);" class="ks-title">{$title}</a><a href="javascript:void(0);" class="ks-next-month {$next}">></a><a href="javascript:void(0);" class="ks-next-year {$next}">></a></div><div class="ks-cal-bd"><div class="ks-whd">',
c._handleOffset().day_html,'</div><div class="ks-dbd ks-clearfix">{$ds}<div style="clear:both;"></div></div></div><div class="ks-setime hidden"></div><div class="{$notlimited}"><a href="#" class="ks-cal-notLimited {$notlimitedCls}">\u4e0d\u9650</a></div><div class="ks-multi-select {$multiSelect}"><button class="ks-multi-select-btn">\u786e\u5b9a</button></div><div class="ks-cal-ft {$showtime}"><div class="ks-cal-time">\u65f6\u95f4\uff1a00:00 &hearts;</div></div><div class="ks-selectime hidden"></div></div><\!--#ks-cal-box--\>'].join("");
this.nav_html='<p>\u6708<select value="{$the_month}"><option class="m1" value="1">01</option><option class="m2" value="2">02</option><option class="m3" value="3">03</option><option class="m4" value="4">04</option><option class="m5" value="5">05</option><option class="m6" value="6">06</option><option class="m7" value="7">07</option><option class="m8" value="8">08</option><option class="m9" value="9">09</option><option class="m10" value="10">10</option><option class="m11" value="11">11</option><option class="m12" value="12">12</option></select></p><p>\u5e74<input type="text" value="{$the_year}" onfocus="this.select()"/></p><p><button class="ok">\u786e\u5b9a</button><button class="cancel">\u53d6\u6d88</button></p>';
this.Verify=function(){return{isDay:function(b){if(!/^\d+$/i.test(b))return!1;b=Number(b);return!(1>b||31<b)},isYear:function(b){if(!/^\d+$/i.test(b))return!1;b=Number(b);return!(100>b||1E4<b)},isMonth:function(b){if(!/^\d+$/i.test(b))return!1;b=Number(b);return!(1>b||12<b)}}};this._renderUI=function(){var b={};this.HTML="";b.prev="";b.next="";b.title="";b.ds="";b.notlimited="";b.notlimitedClass="";this.prevArrow||(b.prev="hidden");this.nextArrow||(b.next="hidden");this.father.showTime||(b.showtime=
"hidden");this.father.notLimited||(b.notlimited="hidden");this.father.multiSelect||(b.multiSelect="hidden");this.father.showTime&&this.father.notLimited&&(b.notlimitedCls="ks-cal-notLimited-showTime");this.father.notLimited&&!this.father.selected&&(b.notlimitedCls+=" ks-cal-notLimited-selected");b.id=this.id="ks-cal-"+Math.random().toString().replace(/.\./i,"");b.title=this.father._getHeadStr(this.year,this.month);this.createDS();b.ds=this.ds;this.father.con.append(this.father._templetShow(this.html,
b));this.node=k.one("#"+this.id);this.father.showTime&&(b=this.node.one(".ks-cal-ft"),this.timmer=new this.father.TimeSelector(b,this.father));return this};this.detachEvent=function(){this.EV=this.EV||[];g.each(this.EV,function(b){b&&b.target.detach(b.type,b.fn)})};this._buildEvent=function(){function b(){c.target.on(c.type,c.fn)}var a=this,c,d=k.one("#"+a.id);a.EV=[];a.father.multiSelect||(c=a.EV[a.EV.length]={target:d.one("div.ks-dbd"),type:"click",fn:function(b){b.preventDefault();"A"==b.target.tagName&&
(b.target=k(b.target),!b.target.hasClass("ks-null")&&!b.target.hasClass("ks-disabled")&&(b=new Date(a.year,a.month,Number(b.target.html())),a.father.dt_date=b,a.father.fire("select",{date:b}),a.father.popup&&a.father.closable&&!a.father.showTime&&!a.father.rangeSelect&&a.father.hide(),a.father.rangeSelect&&(a.timmer&&(b.setHours(a.timmer.get("h")),b.setMinutes(a.timmer.get("m")),b.setSeconds(a.timmer.get("s"))),a.father._handleRange(b)),a.father.render({selected:b})))}},b());c=a.EV[a.EV.length]={target:d.one("a.ks-prev-month"),
type:"click",fn:function(b){b.preventDefault();a.father.rangeLinkage||a._monthMinus();a.father._monthMinus().render();a.father.fire("monthChange",{date:new Date(a.father.year+"/"+(a.father.month+1)+"/01")})}};b();c=a.EV[a.EV.length]={target:d.one("a.ks-next-month"),type:"click",fn:function(b){b.preventDefault();a.father.rangeLinkage||a._monthAdd();a.father._monthAdd().render();a.father.fire("monthChange",{date:new Date(a.father.year+"/"+(a.father.month+1)+"/01")})}};b();c=a.EV[a.EV.length]={target:d.one("a.ks-prev-year"),
type:"click",fn:function(b){b.preventDefault();a.father.rangeLinkage||a._yearMinus();a.father._yearMinus().render();a.father.fire("monthChange",{date:new Date(a.father.year+"/"+(a.father.month+1)+"/01")})}};b();c=a.EV[a.EV.length]={target:d.one("a.ks-next-year"),type:"click",fn:function(b){b.preventDefault();a.father.rangeLinkage||a._yearAdd();a.father._yearAdd().render();a.father.fire("monthChange",{date:new Date(a.father.year+"/"+(a.father.month+1)+"/01")})}};b();a.father.navigator&&(c=a.EV[a.EV.length]=
{target:d.one("a.ks-title"),type:"click",fn:function(b){try{a.timmer.hidePopup();b.preventDefault()}catch(c){}b.target=k(b.target);b=d.one(".ks-setime");b.html("");var f=a.father._templetShow(a.nav_html,{the_month:a.month+1,the_year:a.year});b.html(f);b.removeClass("hidden");d.one("input").on("keydown",function(b){b.target=k(b.target);if(b.keyCode==38){b.target.val(Number(b.target.val())+1);b.target[0].select()}if(b.keyCode==40){b.target.val(Number(b.target.val())-1);b.target[0].select()}if(b.keyCode==
13){var b=d.one(".ks-setime").one("select").val(),c=d.one(".ks-setime").one("input").val();d.one(".ks-setime").addClass("hidden");if(a.Verify().isYear(c)&&a.Verify().isMonth(b)){a.father.render({date:new Date(c+"/"+b+"/01")});a.father.fire("monthChange",{date:new Date(c+"/"+b+"/01")})}}})}},b(),c=a.EV[a.EV.length]={target:d.one(".ks-setime"),type:"click",fn:function(b){b.preventDefault();b.target=k(b.target);if(b.target.hasClass("ok")){var b=d.one(".ks-setime").one("select").val(),c=d.one(".ks-setime").one("input").val();
d.one(".ks-setime").addClass("hidden");if(a.Verify().isYear(c)&&a.Verify().isMonth(b)){a.father.render({date:new Date(c+"/"+b+"/01")});a.father.fire("monthChange",{date:new Date(c+"/"+b+"/01")})}}else b.target.hasClass("cancel")&&d.one(".ks-setime").addClass("hidden")}},b());a.father.notLimited&&(c=a.EV[a.EV.length]={target:d.one(".ks-cal-notLimited"),type:"click",fn:function(b){b.preventDefault();a.father.range={start:null,end:null};a.father.fire("select",{date:null});a.father.popup&&a.father.closable&&
a.father.hide();a.father.render({selected:null})}},b());a.father.multiSelect&&(c=a.EV[a.EV.length]={target:d.one("div.ks-dbd"),type:"mousedown",fn:function(b){b.preventDefault();if(b.target.tagName=="A"){b.target=k(b.target);if(!b.target.hasClass("ks-null")&&!b.target.hasClass("ks-disabled")){b=new Date(a.year,a.month,Number(b.target.html()));a.father._handleMultiSelectStart(b)}}}},b(),c=a.EV[a.EV.length]={target:d.one("div.ks-dbd"),type:"mouseup",fn:function(b){b.preventDefault();if(b.target.tagName==
"A"){b.target=k(b.target);if(!b.target.hasClass("ks-null")&&!b.target.hasClass("ks-disabled")){b=new Date(a.year,a.month,Number(b.target.html()));a.father._handleMultiSelectEnd(b)}}}},b(),c=a.EV[a.EV.length]={target:d.one(".ks-multi-select-btn"),type:"click",fn:function(b){b.preventDefault();a.father._handleMultiSelect()}},b());return this};this._monthAdd=function(){11==this.month?(this.year++,this.month=0):this.month++};this._monthMinus=function(){0===this.month?(this.year--,this.month=11):this.month--};
this._yearAdd=function(){this.year++};this._yearMinus=function(){this.year--};this._getNode=function(){return this.node};this._getNumOfDays=function(b,a){return 32-(new Date(b,a-1,32)).getDate()};this._isDisabled=function(b,a){if(b&&0<b.length)for(var c=0;c<b.length;c++){var d=b[c];if(a.getFullYear()==d.getFullYear()&&a.getMonth()==d.getMonth()&&a.getDate()==d.getDate())return!0}return!1};this.isInMulit=function(b,a){if(b&&0<b.length)for(var c=0;c<b.length;c++){var d=b[c].split("-");if(a.getFullYear()==
parseInt(d[0],10)&&a.getMonth()==parseInt(d[1],10)-1&&a.getDate()==parseInt(d[2],10))return!0}return!1};this.createDS=function(){var b="",a=(7-this.father.startDay+(new Date(this.year+"/"+(this.month+1)+"/01")).getDay())%7,c=this._getNumOfDays(this.year,this.month+1),d=this.father.selected,e=new Date,f;for(f=0;f<a;f++)b+='<a href="javascript:void(0);" class="ks-null">0</a>';for(f=1;f<=c;f++){var a="",g=new Date(this.year,this.month,f);if(this.father.minDate&&new Date(this.year,this.month,f+1)<=this.father.minDate||
this.father.maxDate&&g>this.father.maxDate||this._isDisabled(this.father.disabled,g))a="ks-disabled";else if(this.father.range&&g>=this.father.range.start&&g<=this.father.range.end)a="ks-range";else if(d&&d.getFullYear()==this.year&&d.getMonth()==this.month&&d.getDate()==f||this.isInMulit(this.father.multi,g))a="ks-selected";e.getFullYear()==this.year&&e.getMonth()==this.month&&e.getDate()==f&&(a+=" ks-today");b+="<a "+(a?"class="+a:"")+' href="javascript:void(0);">'+f+"</a>"}this.ds=b;return this};
this.render=function(){this._renderUI();this._buildEvent();return this}}});return j},{requires:["ua","node","calendar/base"]});
KISSY.add("calendar/time",function(g,h,k){g.augment(k,{TimeSelector:function(g,f){this.father=f;this.fcon=g.parent(".ks-cal-box");this.popupannel=this.fcon.one(".ks-selectime");"undefined"==typeof f._time&&(f._time=new Date);this.time=f._time;this.status="s";this.ctime=h('<div class="ks-cal-time">\u65f6\u95f4\uff1a<span class="h">h</span>:<span class="m">m</span>:<span class="s">s</span><\!--{{arrow--\><div class="cta"><button class="u"></button><button class="d"></button></div><\!--arrow}}--\></div>');this.button=
h('<button class="ct-ok">\u786e\u5b9a</button>');this.h_a="00,01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23".split(",");this.m_a="00,10,20,30,40,50".split(",");this.s_a="00,10,20,30,40,50".split(",");this.parseSubHtml=function(c){for(var b="",a=0;a<c.length;a++)b=b+('<a href="javascript:void(0);" class="item">'+c[a]+"</a>");return b+'<a href="javascript:void(0);" class="x">x</a>'};this.showPopup=function(c){this.popupannel.html(c);this.popupannel.removeClass("hidden");c=this.status;this.ctime.all("span").removeClass("on");
switch(c){case "h":this.ctime.all(".h").addClass("on");break;case "m":this.ctime.all(".m").addClass("on");break;case "s":this.ctime.all(".s").addClass("on")}};this.hidePopup=function(){this.popupannel.addClass("hidden")};this.render=function(){var c=this.get("h"),b=this.get("m"),a=this.get("s");this.father._time=this.time;this.ctime.all(".h").html(c);this.ctime.all(".m").html(b);this.ctime.all(".s").html(a);return this};this.set=function(c,b){b=Number(b);switch(c){case "h":this.time.setHours(b);break;
case "m":this.time.setMinutes(b);break;case "s":this.time.setSeconds(b)}this.render()};this.get=function(c){var b=this.time;switch(c){case "h":return b.getHours();case "m":return b.getMinutes();case "s":return b.getSeconds()}};this.add=function(){var c=this.status,b=this.get(c);b++;this.set(c,b)};this.minus=function(){var c=this.status,b=this.get(c);b--;this.set(c,b)};this._init=function(){var c=this;g.html("").append(c.ctime);g.append(c.button);c.render();c.popupannel.on("click",function(b){b=h(b.target);
if(b.hasClass("x"))c.hidePopup();else if(b.hasClass("item")){b=Number(b.html());c.set(c.status,b);c.hidePopup()}});c.button.on("click",function(){var b=typeof c.father.dt_date=="undefined"?c.father.date:c.father.dt_date;b.setHours(c.get("h"));b.setMinutes(c.get("m"));b.setSeconds(c.get("s"));c.father.fire("timeSelect",{date:b});c.father.popup&&c.father.closable&&c.father.hide()});c.ctime.on("keyup",function(b){if(b.keyCode==38||b.keyCode==37){b.preventDefault();c.add()}if(b.keyCode==40||b.keyCode==
39){b.preventDefault();c.minus()}});c.ctime.one(".u").on("click",function(){c.hidePopup();c.add()});c.ctime.one(".d").on("click",function(){c.hidePopup();c.minus()});c.ctime.one(".h").on("click",function(){var b=c.parseSubHtml(c.h_a);c.status="h";c.showPopup(b)});c.ctime.one(".m").on("click",function(){var b=c.parseSubHtml(c.m_a);c.status="m";c.showPopup(b)});c.ctime.one(".s").on("click",function(){var b=c.parseSubHtml(c.s_a);c.status="s";c.showPopup(b)})};this._init()}});return k},{requires:["node",
"calendar/base"]});
