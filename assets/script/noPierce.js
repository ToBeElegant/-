/**
 * 吞噬挂载节点事件
 * 
 */


cc.Class({
    extends: cc.Component,

    editor: {

        menu: '吞噬事件'
    },

    properties: {},

    onLoad: function() {

        this.node.on(cc.Node.EventType.TOUCH_END, function(e) {

            e.stopPropagation();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_START, function(e) {

            e.stopPropagation();
        }, this)
    }
});