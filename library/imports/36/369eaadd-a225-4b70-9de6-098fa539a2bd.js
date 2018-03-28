"use strict";
cc._RF.push(module, '369eardoiVLcJ3mCY+lOaK9', 'noPierce');
// script/noPierce.js

'use strict';

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

    onLoad: function onLoad() {

        this.node.on(cc.Node.EventType.TOUCH_END, function (e) {

            e.stopPropagation();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_START, function (e) {

            e.stopPropagation();
        }, this);
    }
});

cc._RF.pop();