﻿/*
Copyright 2012, KISSY UI Library v1.40dev
MIT Licensed
build time: Aug 7 22:12
*/
/**
 * custom overlay  for kissy editor
 * @author yiminghe@gmail.com
 */
KISSY.add("editor/plugin/overlay/index", function (S, Editor, Overlay, focusFix) {
    var Overlay4E = Overlay.extend({
        bindUI:function () {
            focusFix.init(this);
        }
    }, {
        ATTRS:{
            prefixCls:{
                value:"ks-editor-"
            },
            "zIndex":{
                value:Editor.baseZIndex(Editor.zIndexManager.OVERLAY)
            }
        }
    });

    Overlay4E.Dialog = Overlay.Dialog.extend({
        bindUI:function () {
            focusFix.init(this);
        },
        show:function () {
            var self = this;
            //在 show 之前调用
            self.center();
            var y = self.get("y");
            //居中有点偏下
            if (y - S.DOM.scrollTop() > 200) {
                y = S.DOM.scrollTop() + 200;
                self.set("y", y);
            }
            Overlay4E.prototype.show.call(self);
        }
    }, {
        ATTRS:{
            elAttrs:{
                value:{
                    hideFocus:'hideFocus'
                }
            },
            prefixCls:{
                value:"ks-editor-"
            },
            "zIndex":{
                value:Editor.baseZIndex(Editor.zIndexManager.OVERLAY)
            },
            draggable:{
                value:{
                    constrain:true
                }
            },
            aria:{
                value:true
            }
        }
    });

    return Overlay4E
}, {
    requires:["editor", 'overlay', '../focus-fix/', 'dd']
});
