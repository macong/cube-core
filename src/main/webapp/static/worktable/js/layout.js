/*
Script:
	mui-layout.js v.0.2
License:
	MIT-style license.

Copyright:
	copyright (c) 2007 jander, <jander.sy@163.com>
*/

var Mui={
	name:'mui',
	version:'0.2'
};

/**
* Box Class, it imply a region in a  borderlayouted container.
*/
Mui.Box=new Class({
	Implements: [Options,Events],
	options:{
		left:0,
		top:0,
		width:'auto',
		height:'auto',
		gap:'0',               // describe the blank size of a box. '5px 4px 3px 2px'
		resizable:false,       // can be resize or not.
		splitSize:5,           // this size of resize bar.
		position:'left'        // Box position : top, right, bottom, or left.
	},
	// is the window or not.
	isWindow:false,
	initialize: function(options){
		this.setOptions(options);

		if(options.el!=null)
			this.el=$(options.el);

		if(options.el==null || this.el.tagName.toLowerCase()== 'body'){
			var ws=$(window).getSize();
			this.options.width=ws.x;
			this.options.height=ws.y;
			this.isWindow=true;
			this.outerEl=this.el;
		}else{
			var p=this.el.getParent();
			this.outerEl=new Element('div',{
					'id':options.el+'_outer',
					'class':'m-box-outer'
			}).adopt(this.el).inject(p);
		}



		this.el.setStyle('margin',this.options.gap);
		this.el.addClass('m-box');
		this.document=$(document);

		this.orientation=this.getOrientation(this.options.position);
		this.saveSize();

		if(this.options.position=='center')
			this.options.resizable=false;

		if(this.options.resizable===true)
			this.initResize();
	},

	// render a box.
	render:function(){
		if(this.isWindow===true)
			return;
		this.outerEl.setStyles({
			'left':this.options.left,
			'top':this.options.top,
			'width':this.options.width,
			'height':this.options.height
		});
		this.el.setBoxSize(this.options.width,this.options.height);

		if(this.resizeEl){
			switch(this.options.position){
				case 'left':
					this.resizeEl.setStyles({
						'left':this.options.width-this.options.splitSize,
						'top':this.options.top,
						'width':this.options.splitSize,
						'height':this.options.height
					});
					break;
				case 'right':
					this.resizeEl.setStyles({
						'left':this.options.left,
						'top':this.options.top,
						'width':this.options.splitSize,
						'height':this.options.height
					});
					break;
				case 'top':
					this.resizeEl.setStyles({
						'left':this.options.left,
						'top':this.options.height-this.options.splitSize,
						'width':this.options.width,
						'height':this.options.splitSize
					});
					break;
				case 'bottom':
					this.resizeEl.setStyles({
						'left':this.options.left,
						'top':this.options.top,
						'width':this.options.width,
						'height':this.options.splitSize
					});
					break;
				default:
					alert(this.options.position);
					throw 'Not insist the position "'+this.options.position
			}
		}
	},
	saveSize:function(){
		this.oldWidth=this.options.width;
		this.oldHeight=this.options.height;
	},
	setLeft:function(x){
		this.options.left=x;
	},
	setTop:function(y){
		this.options.top=y;
	},
	setWidth:function(w){
		this.options.width=w;
	},
	setHeight:function(h){
		this.options.height=h;
	},
	initResize:function(options){
		this.resizeEl=new Element('div',{
			'id':this.options.el+'_resize',
			'class':'m-box-resize'
		}).inject(this.outerEl,'after');

		this.resizeEl.set('html','<div class="m-box-resize-icon-'+this.orientation+'"></div>');

		this.resizebound = {
			'start': this.startResize.bind(this),
			'doing': this.onResizing.bind(this),
			'stop': this.endResize.bind(this)
		};
		if(this.options.collapsable==null || this.options.collapsable===false || (this.options.collapsable===true && this.options.collapsed===false)){
			this.resizeEl.addEvent('mousedown',this.resizebound.start);
			this.resizeEl.addClass('m-box-resize-'+this.orientation);
		}

		this.options.minSize=this.options.minSize || 100;
		if(this.orientation=='x')
			this.options.maxSize=this.options.maxSize || 300;
		else
			this.options.maxSize=this.options.maxSize || 300;
	},
	startResize:function(event){
		event.stop();
		this.resizeEl.removeEvent('mousedown',this.resizebound.start);
		this.resizeEl.addClass('m-box-resize-moving');

		this.maskEl=new Element("div",{
			'class': 'm-box-resize-mask'
		}).inject(this.resizeEl,'after');

		this.document.addEvent('mousemove',this.resizebound.doing);
		this.document.addEvent('mouseup',this.resizebound.stop);
	},
	onResizing:function(event){
		var event = new Event(event);
		event.stop();
		var outer=this.container.options;
		switch(this.options.position){
			case 'right':
				var now=event.page.x-outer.left;           //mouse position
				var size=outer.width-now-this.options.splitSize;
				if(size>=this.options.minSize && size<=this.options.maxSize)
					this.resizeEl.setStyle('left',now);
				break;
			case 'top':
				var now=event.page.y-outer.top;
			    var size=now;
				if(size>=this.options.minSize && size<=this.options.maxSize)
					this.resizeEl.setStyle('top',now);
				break;
			case 'bottom':
				var now=event.page.y-outer.top;
				var size=outer.height-now-this.options.splitSize;
				if(size>=this.options.minSize && size<=this.options.maxSize)
					this.resizeEl.setStyle('top',now);
				break;

			default:
				var now=event.page.x-outer.left;
				var size=now;
				if(size>=this.options.minSize && size<=this.options.maxSize)
					this.resizeEl.setStyle('left',now);
				break;
		}
	},
	endResize:function(event){
		var event = new Event(event);
		event.stop();
		this.document.removeEvent('mousemove',this.resizebound.doing);
		this.document.removeEvent('mouseup',this.resizebound.stop);
		var outer=this.container.options;
		var size=0;
		switch(this.options.position){
			case 'right':
				var now=event.page.x-outer.left;           //mouse position
				size=outer.width-now-this.options.splitSize;
				break;
			case 'top':
				var now=event.page.y-outer.top;
			    size=now;
				break;
			case 'bottom':
				var now=event.page.y-outer.top;
				size=outer.height-now-this.options.splitSize;
				break;
			default:
				var now=event.page.x-outer.left;
				size=now;
				break;
		}
		if(size<this.options.minSize)
			size=this.options.minSize;
		else if(size>this.options.maxSize)
			size=this.options.maxSize;

		if(this.orientation=='x')
			this.options.width=size;
		else if(this.orientation=='y')
			this.options.height=size;

		this.saveSize();

		this.resizeEl.removeClass('m-box-resize-moving');

		this.container.resize(this.options.position);

		this.maskEl.dispose();
		this.resizeEl.addEvent('mousedown',this.resizebound.start);
		this.fireEvent("endResize");
	},
	getOrientation:function(position){
		if(position=='top' || position=='bottom')
			return 'y';
		else if(position=='left' || position=='right')
			return 'x';
		else
			return 'z';
	}
});

/**
*  Panel class is a sub class of Box. There are header,main, footer( or not) in a panel.
*/
Mui.Panel=new Class({
	Extends: Mui.Box,
	options:{
		headerEl:null,        // header element id
		mainEl:null,          // main element id
		footerEl:null,        // footer element id
		collapsable:true,     // can collapse or not.
		collapsedSize:27,     // the size of a collapsed panel
		collapsed:false,      // is collapsed or not when inited.
		collapsedIconClass:'' // a user's css class, define the appearance of the collapsed  panel.
	},
	initialize: function(options){
		this.parent(options);
		this.el.set('class','m-panel');

		//check header and main element.
		if(this.options.headerEl==null)
			throw "No header part for the panel: "+this.el.id;
		if(this.options.mainEl==null)
			throw "No main part for the panel: "+this.el.id;

		this.headerEl=$(this.options.headerEl);
		this.headerEl.addClass('m-panel-header');
		this.headerEl.onselectstart = function(){return false;};
		this.headerHeight=this.headerEl.getBoxSize()[1];

		this.footerHeight=0;
		if(this.options.footerEl) {
			this.footerEl=$(this.options.footerEl);
			this.footerEl.addClass('m-panel-footer');
			this.footerHeight=this.footerEl.getBoxSize()[1];
		}
		this.mainEl=$(this.options.mainEl);

		this.mainEl.addClass('m-panel-main');

		if(this.options.position=='center'){
			this.options.collapsable=false;
		}

		if(this.options.collapsable===true)
			this.initToggle(options);
	},
	initToggle:function(options){
		//collapse button element
		new Element("a", {
			href:'#',
			'id':this.el.get('id')+'-hidden',
			'title':'隐藏',
			'class':'m-panel-toggle-' + this.options.position,
			events: {
				'click': this.onToggle.bind(this)
			}
		}).inject(this.headerEl,'top');


		this.collapsedEl=new Element('div',{
			id:this.el.id+'-collapsed',
			styles:{
				'margin':this.options.gap
			},
			events: {
				'click': function(event){
					event.stop();
					return false;
				}
			},
			'class':'m-panel-collapsed-'+this.options.position
		}).inject(this.el,'after');

		//expand button element
		var expandBtn=new Element("a", {
			href:'#',
			'id':this.options.el+'-show',
			'class':'m-panel-toggle-' + this.getInversePosition(this.options.position),
			events: {
				'click': this.onToggle.bind(this)
			}
		});
		var inEl=new Element("div",{
				'class':'m-panel-collapsed-'+this.options.position+'-inner'
		}).adopt(expandBtn).inject(this.collapsedEl,'top');
		new Element('div',{
			'class':this.options.collapsedIconClass
		}).inject(inEl);

	},
	render:function(){
		this.parent();

		if(this.options.collapsable===true){
			if(this.options.collapsed===true){
				this.el.setStyle('display','none');
				this.collapsedEl.setBoxHeight(this.options.height);

			}else{
				this.collapsedEl.setStyle('display','none');
			}
		}

		if(this.options.collapsable===false || this.options.collapsed==false){
			var h=Math.max(this.el.getStyle('height').toInt()-this.headerHeight-this.footerHeight,0);
			this.mainEl.setBoxSize(this.el.getStyle('width').toInt(),h);
			if (this.mainEl.tagName.toLowerCase() == 'iframe') {
				this.mainEl.set('width',this.el.clientWidth);
				this.mainEl.set('height',this.el.clientHeight);
			}
		}


	},
	//flag = true则为展开 flag=false则为隐藏
	toggle:function(flag){
		this.options.collapsed = flag;
		this.onToggle();
	},
	onToggle:function(event){
		if(event) event.stop();
		if (this.options.collapsed===true) {
			this.collapsedEl.setStyle('display','none');
			this.el.setStyle('display','block');
			if(this.resizeEl){
				this.resizeEl.addEvent('mousedown',this.resizebound.start);
			}
		}else {
			this.collapsedEl.setStyle('display','block');
			this.el.setStyle('display','none');
			if(this.resizeEl){
				this.resizeEl.removeEvent('mousedown',this.resizebound.start);
			}
		}
		this.options.collapsed=!this.options.collapsed;
		this.resizeEl[this.options.collapsed?"removeClass":"addClass"]('m-box-resize-'+this.orientation);

		this.container.toggle(this.options.position);
		this.fireEvent("toggle",this.options.collapsed);
	},
	getInversePosition:function(p){
		switch(p){
			case 'left':
				return 'right';
			case 'right':
				return 'left';
			case 'top':
				return 'bottom';
			case 'bottom':
				return 'top';
			default:
				throw 'Not insist the position :'+p;
		}
	}
});

/**
* Container class , it is only a borderlayouted container now.
*/
Mui.Container=new Class({
	Extends: Mui.Box,
	boxs:{},
	initialize: function(options){
		var items=options.items;
        options.items = {}

		this.parent(options);
        this.options.items = items;

		this.el.set('class','m-container');
		for(var i=0;i<this.options.items.length;i++){
			var item=this.options.items[i];
			item.container=this;
			this.boxs[item.options.position]=item;
		};
		if (this.isWindow===true)
			$(window).addEvent('resize', this.render.bindWithEvent(this));
	},
	render:function(){
		this.parent();
		if(this.isWindow===true){
			var ws=$(window).getSize();
			this.options.width=ws.x;
			this.options.height=ws.y;
		}
		var s=this.getPartSizes();

		var ch=Math.max(this.options.height-s[0]-s[2],50);
		var cw=Math.max(this.options.width-s[1]-s[3],50);

		if(this.boxs.top){
			this.boxs.top.setWidth(this.options.width);
			this.boxs.top.setHeight(s[0]);
		}
		if(this.boxs.bottom){
			this.boxs.bottom.setWidth(this.options.width);
			this.boxs.bottom.setHeight(s[2]);
			this.boxs.bottom.setTop(this.options.height-s[2]);
		}
		if(this.boxs.left){
			this.boxs.left.setTop(s[0]);
			this.boxs.left.setWidth(s[3]);
			this.boxs.left.setHeight(ch);
		}
		if(this.boxs.right){
			this.boxs.right.setTop(s[0]);
			this.boxs.right.setLeft(this.options.width-s[1]);
			this.boxs.right.setWidth(s[1]);
			this.boxs.right.setHeight(ch);
		}
		this.boxs.center.setLeft(s[3]);
		this.boxs.center.setTop(s[0]);
		this.boxs.center.setWidth(cw);
		this.boxs.center.setHeight(ch);

		$each(this.boxs, function(child, key){
			child.render();
		});
		this.fireEvent("resize");
	},
	resize:function(position){
		var s=this.getPartSizes();

		var ch=Math.max(this.options.height-s[0]-s[2],50);
		var cw=Math.max(this.options.width-s[1]-s[3],50);

		switch(position){
			case 'left':
				this.boxs.left.setWidth(s[3]);
				this.boxs.center.setLeft(s[3]);
				this.boxs.center.setWidth(cw);

				this.boxs.left.render();
				this.boxs.center.render();
				break;
			case 'right':
				this.boxs.right.setLeft(this.options.width-s[1]);
				this.boxs.center.setWidth(cw);

				this.boxs.right.render();
				this.boxs.center.render();

				break;
			case 'top':
				this.boxs.top.setHeight(s[0]);
				this.boxs.center.setTop(s[0]);
				this.boxs.center.setHeight(ch);

				this.boxs.top.render();
				this.boxs.center.render();
				break;
			case 'bottom':
				this.boxs.bottom.setTop(this.options.height-s[2]);
				this.boxs.bottom.setHeight(s[2]);
				this.boxs.center.setHeight(ch);

				this.boxs.bottom.render();
				this.boxs.center.render();
				break;
			default:
				throw 'Not insist the position '+position+' for resizing a panel.';
		}
	},
	toggle:function(position){
		var cs=this.el.getSize();
		var s=this.getPartSizes();

		var ch=this.options.height-s[0]-s[2];
		var cw=this.options.width-s[1]-s[3];

		//todo add transition
		switch(position){
			case 'left':
				this.boxs.left.setWidth(s[3]);
				this.boxs.center.setLeft(s[3]);
				this.boxs.center.setWidth(cw);

				this.boxs.left.render();
				this.boxs.center.render();
				break;
			case 'right':
				this.boxs.right.setLeft(this.options.width-s[1]);
				this.boxs.right.setWidth(s[1]);
				this.boxs.center.setWidth(cw);

				this.boxs.right.render();
				this.boxs.center.render();

				break;
			case 'top':
				this.boxs.top.setHeight(s[0]);
				this.boxs.center.setTop(s[0]);
				this.boxs.center.setHeight(ch);

				this.boxs.top.render();
				this.boxs.center.render();
				break;
			case 'bottom':
				this.boxs.bottom.setHeight(s[2]);
				this.boxs.bottom.setTop(this.options.height-s[2]);
				this.boxs.center.setHeight(ch);

				this.boxs.bottom.render();
				this.boxs.center.render();
				break;
			default:
				throw 'Not insist the position '+position +' for toggling a panel.';
		}
	},
	getPartSizes:function(){
		var s=[0,0,0,0];
		if(this.boxs.top){
			if(this.boxs.top.options.collapsed===true){
				var m=this.boxs.top.el.getMarginSizes();
				s[0]=this.boxs.top.options.collapsedSize+m[0]+m[2];
			}else
				s[0]=this.boxs.top.oldHeight;
		}
		if(this.boxs.bottom){
			if(this.boxs.bottom.options.collapsed===true){
				var m=this.boxs.bottom.el.getMarginSizes();
				s[2]=this.boxs.bottom.options.collapsedSize+m[0]+m[2];
			}else
				s[2]=this.boxs.bottom.oldHeight;
		}
		if(this.boxs.left){
			if(this.boxs.left.options.collapsed===true){
				var m=this.boxs.left.el.getMarginSizes();
				s[3]=this.boxs.left.options.collapsedSize+m[1]+m[3];

			}else
				s[3]=this.boxs.left.oldWidth;
		}
		if(this.boxs.right){
			if(this.boxs.right.options.collapsed===true){
				var m=this.boxs.right.el.getMarginSizes();
				s[1]=this.boxs.right.options.collapsedSize+m[1]+m[3];
			}else
				s[1]=this.boxs.right.oldWidth;
		}
		return s;
	}
});

Element.implement({
	getBorderSizes:function(){
		var s=[];
		s[0] = this.getStyle('border-top-width').toInt();
		s[1] = this.getStyle('border-right-width').toInt();
		s[2] = this.getStyle('border-bottom-width').toInt();
		s[3] = this.getStyle('border-left-width').toInt();
		return s;
	},
	getMarginSizes:function(){
		var s=[];
		s[0] = this.getStyle('margin-top').toInt();
		s[1] = this.getStyle('margin-right').toInt();
		s[2] = this.getStyle('margin-bottom').toInt();
		s[3] = this.getStyle('margin-left').toInt();
		return s;
	},
	getBoxSize: function(el) {
		var size = [0, 0];
		var m = this.getMarginSizes();
		size[1] =this.offsetHeight + (m[0] + m[2]);
		size[0] = this.offsetWidth + (m[1] + m[3]);
		return size;
	},
	setBoxHeight:function(h){
		var b = this.getBorderSizes();
		var m=this.getMarginSizes();
		h = (h - (b[0] + b[2])-(m[0]+m[2]));
		this.setStyle('height',h);
	},
	setBoxWidth:function(w){
		var b = this.getBorderSizes();
		var m=this.getMarginSizes();
		w = (w - (b[1] + b[3])-(m[1]+m[3]));
		this.setStyle('width',w);
	},
	setBoxSize:function(w,h){
		var b = this.getBorderSizes();
		var m=this.getMarginSizes();
		h = (h - (b[0] + b[2])-(m[0]+m[2]));
		w = (w - (b[1] + b[3])-(m[1]+m[3]));
		this.setStyle('height',h);
		this.setStyle('width',w);
	}
});