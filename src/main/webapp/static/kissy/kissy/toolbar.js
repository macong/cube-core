﻿/*
Copyright 2012, KISSY UI Library v1.40dev
MIT Licensed
build time: Jul 30 19:04
*/
/**
 * @fileOverview toolbar separator def
 * @author yiminghe@gmail.com
 */
KISSY.add("toolbar/separator", function (S, Component, Separator) {

    /**
     * @extends Separator
     * @class
     * toolbar separator.
     * xclass: 'toolbar-separator'.
     * @memberOf Toolbar
     * @name Separator
     */
    var ToolbarSeparator = Separator.extend({
    }, {}, {
        xclass:'toolbar-separator',
        priority:20
    });

    return ToolbarSeparator;

}, {
    requires:['component', 'separator']
});/**
 * Toolbar for KISSY.
 * @author yiminghe@gmail.com
 */
KISSY.add("toolbar", function (S, Component, Node, Separator, undefined) {

    var KeyCodes = Node.KeyCodes;

    function getEnabledHighlightedItem(index, direction, self) {
        var children = self.get("children"),
            count = 0,
            childrenLength = children.length;

        if (index == undefined) {
            if (direction == 1) {
                index = 0;
            } else {
                index = childrenLength - 1;
            }
            if (!children[index].get("disabled")) {
                return children[index];
            }
        }

        do {
            count++;
            index = (index + childrenLength + direction) % childrenLength;
        } while (count < childrenLength && children[index].get("disabled"));

        if (count != childrenLength) {
            return children[index];
        }

        return null;
    }

    function afterCollapsedChange(e) {
        var self = this;
        if (e.target != self) {
            if (e.newVal) {
                self.set("expandedItem", null);
            } else {
                self.set("expandedItem", e.target);
            }
        }
    }

    function afterHighlightedChange(e) {
        var self = this,
            expandedItem,
            t = e.target;
        if (
        // 不是自己本身的事件！
            t != self) {

            if (e.newVal) {
                self.set("highlightedItem", t);
                // 保持扩展状态，只不过扩展的 item 变了
                if ((expandedItem = self.get("expandedItem")) &&
                    expandedItem.hasAttr("collapsed") &&
                    expandedItem != t) {
                    expandedItem.set("collapsed", true);
                    t.set("collapsed", false);
                }
            } else {
                self.set("highlightedItem", null);
            }

        }
    }

    function processChild(e) {
        var c = e.child;
        // 交给容器代理
        c.set("handleMouseEvents", false);
        c.set("focusable", false);
        // managed by parent toolbar
        c.publish("afterCollapsedChange afterHighlightedChange", {
            bubbles:1
        });
    }

    /**
     * @name Toolbar
     * @class
     * KISSY Toolbar.
     * xclass: 'toolbar'.
     * @extends Component.Container
     */
    var Toolbar = Component.Container.extend(
        /**
         * @lends Toolbar#
         */
        {

            initializer:function () {
                this.on("addChild", processChild);
            },

            createDom:function () {
                this.get("el").attr("role", "toolbar");
            },

            _uiSetHighlightedItem:function (item) {
                var id;
                if (item) {
                    id = item.get("el").attr("id");
                    if (!id) {
                        item.get("el").attr("id", id = S.guid("ks-toolbar-item"));
                    }
                    this.get("el").attr("aria-activedescendant", id);
                } else {
                    this.get("el").attr("aria-activedescendant", "");
                }
            },

            /**
             * Protected.
             */
            bindUI:function () {
                var self = this;
                self.on("afterCollapsedChange", afterCollapsedChange, self);
                self.on("afterHighlightedChange", afterHighlightedChange, self);
            },

            handleBlur:function () {

                var self = this,
                    highlightedItem,
                    expandedItem;
                if (expandedItem = self.get("expandedItem")) {
                    expandedItem.set("collapsed", true);
                }
                if (highlightedItem = self.get("highlightedItem")) {
                    highlightedItem.set("highlighted", false);
                }
            },

            handleKeyEventInternal:function (e) {
                var self = this,
                    highlightedItem = self.get("highlightedItem"),
                    previous = highlightedItem,
                    orientation = self.get("orientation"),
                    children = self.get("children"),
                    highlightedChildIndex = highlightedItem && S.indexOf(highlightedItem, children);
                if (highlightedItem) {
                    if (highlightedItem.handleKeyEventInternal(e)) {
                        return true;
                    }
                }
                // Do not handle the key event if any modifier key is pressed.
                if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) {
                    return false;
                }

                // Either nothing is highlighted, or the highlighted control didn't handle
                // the key event, so attempt to handle it here.
                switch (e.keyCode) {
                    case KeyCodes.ESC:
                        self.getKeyEventTarget().fire("blur");
                        return true;

                    case KeyCodes.HOME:
                        highlightedItem = getEnabledHighlightedItem(undefined, 1, self);
                        break;

                    case KeyCodes.END:
                        highlightedItem = getEnabledHighlightedItem(undefined, -1, self);
                        break;

                    case KeyCodes.UP:
                        if (orientation == Toolbar.VERTICAL) {
                            highlightedItem = getEnabledHighlightedItem(highlightedChildIndex, -1, self);
                        } else {
                            return false;
                        }
                        break;

                    case KeyCodes.LEFT:
                        if (orientation == Toolbar.HORIZONTAL) {
                            highlightedItem = getEnabledHighlightedItem(highlightedChildIndex, -1, self);
                        } else {
                            return false;
                        }
                        break;

                    case KeyCodes.DOWN:
                        if (orientation == Toolbar.VERTICAL) {
                            highlightedItem = getEnabledHighlightedItem(highlightedChildIndex, 1, self);
                        } else {
                            return false;
                        }
                        break;

                    case KeyCodes.RIGHT:
                        if (orientation == Toolbar.HORIZONTAL) {
                            highlightedItem = getEnabledHighlightedItem(highlightedChildIndex, 1, self);
                        } else {
                            return false;
                        }
                        break;

                    default:
                        return false;
                }

                if (previous) {
                    previous.set("highlighted", false);
                }

                if (highlightedItem) {
                    highlightedItem.set("highlighted", true);
                }

                return true;
            }

        }, {
            ATTRS:/**
             * @lends Toolbar#
             */
            {
                // 当前的高亮项
                highlightedItem:{
                },
                // 当前的扩展项，切换高亮项时如要把以前的扩展项收起，并展开当前的高亮项
                expandedItem:{
                },
                /**
                 * Toolbar orientation.
                 * Enum: Toolbar.HORIZONTAL or Toolbar.VERTICAL
                 */
                orientation:{
                    value:0
                }
            }
        }, {
            xclass:'toolbar'
        });

    S.mix(Toolbar,
        /**
         * @lends Toolbar
         */
        {
            HORIZONTAL:0,
            VERTICAL:1
        });

    return Toolbar;

}, {
    requires:['component', 'node', 'toolbar/separator']
});
