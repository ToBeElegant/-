"use strict";
cc._RF.push(module, '2cb8cx/YBJFo51X11SDXoqZ', 'player');
// script/player.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {

        this.node.on('touchend', function () {

            cc.director.loadScene("game");
        });
    }
}

// update (dt) {},
);

cc._RF.pop();