﻿/*
Copyright 2012, KISSY UI Library v1.40dev
MIT Licensed
build time: Aug 7 22:12
*/
/**
 * Add indent and outdent command identifier for KISSY Editor.
 * @author yiminghe@gmail.com
 */
KISSY.add("editor/plugin/indent/cmd", function (S, Editor, dentUtils) {
    var addCommand = dentUtils.addCommand;
    return {
        init:function (editor) {
            addCommand(editor, "indent");
        }
    };

}, {
    requires:['editor', '../dent-utils/cmd']
});
