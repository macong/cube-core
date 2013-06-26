/*
Copyright 2012, KISSY UI Library v1.40dev
MIT Licensed
build time: Aug 1 22:21
*/
KISSY.add("waterfall/base",function(f,p,q){function g(){g.superclass.constructor.apply(this,arguments);this._init()}function r(a,c,b,d){var l={},h,j;l.stop=function(){h&&(clearTimeout(h),j=[],a.each(function(a){a.stop()}))};l.start=function(){j=[].concat(f.makeArray(a));0<j.length?function(){var l=+new Date;do{var e=j.shift();c.call(b,e)}while(0<j.length&&50>+new Date-l);0<j.length?h=setTimeout(arguments.callee,25):d&&d.call(b,a)}():d&&d.call(b,a)};return l}function t(){var a=this._containerRegion||
{};a&&this.get("container").width()===a.width||this.adjust()}function o(){var a=this.get("container").width(),c=this.get("curColHeights");c.length=Math.max(Math.floor(a/this.get("colWidth")),this.get("minColCount"));this._containerRegion={width:a};f.each(c,function(a,d){c[d]=0});this.set("colItems",[])}function m(a,c,b,d){var l=a.get("effect"),b=u(b),h=a.get("align"),j,n=a.get("curColHeights"),e=a.get("container"),f=a.get("colWidth"),k=n.length,i=0,g=a._containerRegion;j=Number.MAX_VALUE;if(k){if(b.hasClass("ks-waterfall-fixed-left"))i=
0;else if(b.hasClass("ks-waterfall-fixed-right"))i=0<k?k-1:0;else for(var s=0;s<k;s++)n[s]<j&&(j=n[s],i=s);j="left"===h?0:Math.max(g.width-k*a.get("colWidth"),0);"center"===h&&(j/=2);"justify"===h&&1<k&&(j=0<i?Math.max((g.width-f)/(k-1)-f,0)*i:0);h={left:i*f+j,top:n[i]};c?(b.css(h),l&&l.effect&&b.css("visibility","hidden"),e.append(b),d&&d()):(c=a.get("adjustEffect"))?b.animate(h,c.duration,c.easing,d):(b.css(h),d&&d());n[i]+=b.outerHeight(!0);a=a.get("colItems");a[i]=a[i]||[];a[i].push(b);b.attr("data-waterfall-col",
i);a=b[0].className.replace(/\s*ks-waterfall-col-(?:first|last|\d+)/g,"");a+=" ks-waterfall-col-"+i;0==i?a+=" ks-waterfall-col-first":i==n.length-1&&(a+=" ks-waterfall-col-last");b[0].className=a;return b}}function v(a){var a=m(this,!0,a),c=this.get("effect");c&&c.effect&&(a.hide(),a.css("visibility",""),a[c.effect](c.duration,0,c.easing))}var u=p.all,e=f.Env.host;g.ATTRS={container:{setter:function(a){return u(a)}},curColHeights:{value:[]},align:{value:"center"},minColCount:{value:1},effect:{value:{effect:"fadeIn",
duration:1}},colWidth:{},colItems:{value:[]},adjustEffect:{}};f.extend(g,q,{isAdjusting:function(){return!!this._adjuster},isAdding:function(){return!!this._adder},_init:function(){t.call(this);this.__onResize=f.buffer(t,50,this);u(e).on("resize",this.__onResize)},adjustItem:function(a,c){function b(){m--;0>=m&&(d._adjuster=0,c.callback&&c.callback.call(d))}var d=this,c=c||{};if(!d.isAdjusting()){var l=a.outerHeight(!0),h;c.process&&(h=c.process.call(d));void 0===h&&(h=a.outerHeight(!0));var j=h-
l,e=d.get("curColHeights"),f=parseInt(a.attr("data-waterfall-col")),g=d.get("colItems")[f],l=[];h=Math.max.apply(Math,e);for(var k=0;k<g.length&&g[k][0]!==a[0];k++);for(k++;k<g.length;)l.push(g[k]),k++;e[f]+=j;e=Math.max.apply(Math,e);e!=h&&d.get("container").height(e);var i=c.effect,m=l.length;if(!m)return c.callback&&c.callback.call(d);void 0===i&&(i=d.get("adjustEffect"));d._adjuster=r(l,function(a){i?a.animate({top:parseInt(a.css("top"))+j},i.duration,i.easing,b):(a.css("top",parseInt(a.css("top"))+
j),b())});d._adjuster.start();return d._adjuster}},removeItem:function(a,c){var c=c||{},b=this,d=c.callback;b.adjustItem(a,f.mix(c,{process:function(){a.remove();return 0},callback:function(){for(var c=parseInt(a.attr("data-waterfall-col")),c=b.get("colItems")[c],h=0;h<c.length;h++)if(c[h][0]==a[0]){c.splice(h,1);break}d&&d()}}))},adjust:function(a){function c(){e--;0>=e&&(b.get("container").height(Math.max.apply(Math,b.get("curColHeights"))),b._adjuster=0,a&&a.call(b),b.fire("adjustComplete",{items:d}))}
var b=this,d=b.get("container").all(".ks-waterfall");b.isAdjusting()&&(b._adjuster.stop(),b._adjuster=0);o.call(b);var e=d.length;if(!e)return a&&a.call(b);b._adjuster=r(d,function(a){m(b,false,a,c)});b._adjuster.start();return b._adjuster},addItems:function(a,c){var b=this;b._adder=r(a,v,b,function(){b.get("container").height(Math.max.apply(Math,b.get("curColHeights")));b._adder=0;c&&c.call(b);b.fire("addComplete",{items:a})});b._adder.start();return b._adder},destroy:function(){u(e).detach("resize",
this.__onResize)}});return g},{requires:["node","base"]});
KISSY.add("waterfall/loader",function(f,p,q){function g(){g.superclass.constructor.apply(this,arguments)}function r(){if(!this.__loading)if(this.isAdjusting())this.__onScroll();else{var f=this.get("container").offset().top,g=this.get("diff"),e=this.get("curColHeights");e.length&&(f+=Math.min.apply(Math,e));g+o(m).scrollTop()+o(m).height()>f&&t.call(this)}}function t(){function f(a,b){e.__loading=0;e.addItems(a,b)}function g(){e.end()}var e=this;e.get("container");e.__loading=1;var a=e.get("load");
a&&a(f,g)}var o=p.all,m=f.Env.host;g.ATTRS={diff:{value:0}};f.extend(g,q,{_init:function(){g.superclass._init.apply(this,arguments);this.__onScroll=f.buffer(r,50,this);this.__onScroll();this.start()},start:function(){this.__started||(o(m).on("scroll",this.__onScroll),this.__started=1)},end:function(){o(m).detach("scroll",this.__onScroll)},pause:function(){this.end()},resume:function(){this.start()},destroy:function(){g.superclass.destroy.apply(this,arguments);o(m).detach("scroll",this.__onScroll);
this.__started=0}});return g},{requires:["node","./base"]});KISSY.add("waterfall",function(f,p,q){p.Loader=q;return p},{requires:["waterfall/base","waterfall/loader"]});
