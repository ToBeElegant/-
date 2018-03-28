cc.Class({
    extends: cc.Component,
    properties: {
        music: cc.AudioClip,
        pressedScale: 1.15,
        transDuration: 0.1
    },
    onLoad: function() {
        var thisobj = this;
        thisobj.initScale = this.node.scale;
        thisobj.button = thisobj.getComponent(cc.Button);
        thisobj.scaleDownAction = cc.scaleTo(thisobj.transDuration, thisobj.pressedScale);
        thisobj.scaleUpAction = cc.scaleTo(thisobj.transDuration, thisobj.initScale);

        function onTouchDown(event) {
            thisobj.music && cc.audioEngine.play(thisobj.music, false, OS.volume);
            this.stopAllActions();
            this.runAction(thisobj.scaleDownAction);
        }

        function onTouchUp(event) {
            this.stopAllActions();
            this.runAction(thisobj.scaleUpAction);
        }
        this.node.on('touchstart', onTouchDown, this.node);
        this.node.on('touchend', onTouchUp, this.node);
        this.node.on('touchcancel', onTouchUp, this.node);
    }

});