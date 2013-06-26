//浮动提示框组件
var message={};
//removeFlag是否有消除按钮， delayHiddenFlag是否延迟10秒消除
var messageTimer;
message.show = function(text,topPresent,removeFlag,delayHiddenFlag){
	var el = $("float_message");
	if(!el){
		el = new Element("div",{
			"id":"float_message",
			"class":"float_message",
			"html":"<div class=\"vh\"><em></em>&nbsp;&nbsp;"+(removeFlag?"<span class=\"ca\" onclick=\"message.hidden();\">消除</span>":"")+"</div>"
		});
		$(document.body).adopt(el);
	}
	el.getElements("em").set("html",text);
	var winS = $(window).getSize();
	el.setStyles({
		"visibility":"visible",
		"left":(winS.x-el.clientWidth)/2,
		"top":winS.y*(topPresent||0)
	});
	if(delayHiddenFlag){
		clearTimeout(messageTimer);
		messageTimer = message.hidden.delay(10000,this);//显示10秒
	}
}
//浮动提示框隐藏
message.hidden = function(){
	var el = $("float_message");
	if(el){
		el.setStyle("visibility","hidden");
	}
}
//加载栏显示
message.load = function(text){
	var el = $("float_load_message");
	if(!el){
		el = new Element("div",{
			"id":"float_load_message",
			"class":"float_message",
			"html":"<div class=\"vh\"><em>"+text+"</em>&nbsp;&nbsp;</div>"
		});
		$(document.body).adopt(el);
	}
	var winS = $(window).getSize();
	el.setStyles({
		"visibility":"visible",
		"left":(winS.x-el.clientWidth)/2,
		"top":0
	});
}
//加载栏隐藏
message.loadHidden = function(){
	var el = $("float_load_message");
	if(el){
		el.setStyle("visibility","hidden");
	}
}
/**********************************************UUID库代码开始**************************************************************/
/**
 * UUID库代码
 */
function UUID(){
	this.id = this.createUUID();
}

// When asked what this Object is, lie and return it's value
UUID.prototype.valueOf = function(){ return this.id; }
UUID.prototype.toString = function(){ return this.id; }

//
// INSTANCE SPECIFIC METHODS
//

UUID.prototype.createUUID = function(){
	var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
	var dc = new Date();
	var t = dc.getTime() - dg.getTime();
	var h = '-';
	var tl = UUID.getIntegerBits(t,0,31);
	var tm = UUID.getIntegerBits(t,32,47);
	var thv = UUID.getIntegerBits(t,48,59) + '1'; // version 1, security version is 2
	var csar = UUID.getIntegerBits(UUID.rand(4095),0,7);
	var csl = UUID.getIntegerBits(UUID.rand(4095),0,7);

	var n = UUID.getIntegerBits(UUID.rand(8191),0,7) +
			UUID.getIntegerBits(UUID.rand(8191),8,15) +
			UUID.getIntegerBits(UUID.rand(8191),0,7) +
			UUID.getIntegerBits(UUID.rand(8191),8,15) +
			UUID.getIntegerBits(UUID.rand(8191),0,15); // this last number is two octets long
	return tl + h + tm + h + thv + h + csar + csl + h + n;
}

UUID.getIntegerBits = function(val,start,end){
	var base16 = UUID.returnBase(val,16);
	var quadArray = new Array();
	var quadString = '';
	var i = 0;
	for(i=0;i<base16.length;i++){
		quadArray.push(base16.substring(i,i+1));
	}
	for(i=Math.floor(start/4);i<=Math.floor(end/4);i++){
		if(!quadArray[i] || quadArray[i] == '') quadString += '0';
		else quadString += quadArray[i];
	}
	return quadString;
}

UUID.returnBase = function(number, base){
	var convert = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    if (number < base) var output = convert[number];
    else {
        var MSD = '' + Math.floor(number / base);
        var LSD = number - MSD*base;
        if (MSD >= base) var output = this.returnBase(MSD,base) + convert[LSD];
        else var output = convert[MSD] + convert[LSD];
    }
    return output;
}

UUID.rand = function(max){
	return Math.floor(Math.random() * max);
}
/**********************************************UUID库代码结束*****************************************************************/