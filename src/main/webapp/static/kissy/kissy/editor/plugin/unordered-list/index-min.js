/*
Copyright 2012, KISSY UI Library v1.40dev
MIT Licensed
build time: Aug 7 22:12
*/
KISSY.add("editor/plugin/unordered-list/index",function(b,c,d,e){function a(){}b.augment(a,{renderUI:function(a){e.init(a);a.addButton("unorderedList",{cmdType:"insertUnorderedList",mode:c.WYSIWYG_MODE},d)}});return a},{requires:["editor","../list-utils/btn","./cmd"]});
