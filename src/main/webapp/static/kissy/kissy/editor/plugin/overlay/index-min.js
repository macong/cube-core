/*
Copyright 2012, KISSY UI Library v1.40dev
MIT Licensed
build time: Aug 7 22:12
*/
KISSY.add("editor/plugin/overlay/index",function(c,a,d,e){var b=d.extend({bindUI:function(){e.init(this)}},{ATTRS:{prefixCls:{value:"ks-editor-"},zIndex:{value:a.baseZIndex(a.zIndexManager.OVERLAY)}}});b.Dialog=d.Dialog.extend({bindUI:function(){e.init(this)},show:function(){this.center();var a=this.get("y");200<a-c.DOM.scrollTop()&&(a=c.DOM.scrollTop()+200,this.set("y",a));b.prototype.show.call(this)}},{ATTRS:{elAttrs:{value:{hideFocus:"hideFocus"}},prefixCls:{value:"ks-editor-"},zIndex:{value:a.baseZIndex(a.zIndexManager.OVERLAY)},
draggable:{value:{constrain:!0}},aria:{value:!0}}});return b},{requires:["editor","overlay","../focus-fix/","dd"]});
