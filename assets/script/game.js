/**
 * 局部坐标转换
 */
cc.Node.prototype.toWorldSpace = function(v2) {

    return cc.find('Canvas').convertToNodeSpaceAR(this.convertToWorldSpaceAR(v2))
};
cc.Class({
    extends: cc.Component,

    properties: {
        bg: {

            default: null,
            type: cc.Node,
            displayName: '背景'
        },


        bgimg: {
            default: [],
            type: [cc.SpriteFrame],
            displayName: '背景图'
        },
        restart: {
            default: null,
            type: cc.Node,
            displayName: '重开'

        },
        doubleHit: {

            default: null,
            type: cc.Label,
            displayName: '连击'
        },

        camera: {
            default: null,
            type: cc.Camera,
            displayName: '相机'
        },

        hero: {
            default: null,
            type: cc.Node,
            displayName: '主角'
        },

        stick: {
            default: null,
            type: cc.Node,
            displayName: '棍'
        },

        ground: {
            default: null,
            type: cc.Node,
            displayName: '地面'
        },

        _ground: null,

        current: {
            default: null,
            type: cc.Label,
            displayName: '当前得分'
        },

        highest: {
            default: null,
            type: cc.Label,
            displayName: '最高得分'
        },
        blank: {

            default: null,
            type: cc.SpriteFrame,
            displayName: '默认图片'
        },

        touch: {

            default: false,
            visible: false,
            displayName: '状态'
        },

        block: {

            default: true,
            visible: true,
            displayName: 'touchstart状态 1'
        },


        block_: {

            default: true,
            visible: true,
            displayName: 'touchend状态 2'
        },

        colors: {

            default: [],

            type: [cc.Color],

            displayName: '砖块颜色'
        }

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

        cc.log(this);

        var self = this;

        // 生成地面 2
        self.scheduleOnce(function() {

            self.addGround();

        });


        // 得分存储
        var scoreData = JSON.parse(cc.sys.localStorage.getItem('scoreData') || '{}');

        if (scoreData.value) {

            self.highest.string = scoreData.value;
        };


        self.randomBg();

        // 重开
        self.restart.children[1].on('touchend', function() {

            self.restart.active = false;

            //  cc.game.pause();

            // cc.game.restart();

            //  cc.game.resume();

            cc.director.loadScene("game");

        });

        self.node.on('touchstart', function() {

            if (self.block) return;

            self.block = true;

            self.touch = true;

            self.grow('heroPush');

            self.block_ = false;

        });

        self.node.on('touchend', function() {


            if (self.block_) return;

            self.block_ = true;

            self.touch = false;

            self.grow('heroPush', 1);

            self.grow('heroTick');

            self.deleteNode();

        });

        // 踢腿动画回调
        self.hero.getComponent(cc.Animation).on('finished', function() { // 开始

            self.judgeDistance()

        }, self);
    },

    /**
     * 删除摄像机视口外的节点
     */
    deleteNode() {

        var self = this;

        var nodeBox = self.stick.parent.children;


        if (nodeBox.length < 5) return;

        nodeBox[0].destroy();

        // var x = self.camera.node.toWorldSpace(cc.v2(0, 0)).x - self.ground.toWorldSpace(cc.v2(0, 0)).x;

        // cc.log(self.ground.toWorldSpace(cc.v2(0, 0)))

        // for (let i = 0; i < nodeBox.length; i++) {

        // if (nodeBox[i].toWorldSpace(cc.v2(0, 0)).x < self.ground.toWorldSpace(cc.v2(0, 0)).x) {

        //     cc.log(nodeBox[i].toWorldSpace(cc.v2(0, 0)));

        //     nodeBox[i].destroy();
        // }

        //     cc.log(nodeBox[i].toWorldSpace(cc.v2(0, 0)));
        // };

    },

    /**
     * 返回一个 n 到 m 的随机数
     * @param {*} n 
     * @param {*} m 
     */
    randomNumber(n, m) {
        var c = m - n + 1;
        return Math.floor(Math.random() * c + n);
    },

    /**
     * 随机背景
     */
    randomBg() {

        let self = this;

        self.bg.getComponent(cc.Sprite).spriteFrame = self.bgimg[Math.floor(Math.random() * self.bgimg.length)];
    },

    /**
     * 主角动画
     * @param {*} name 
     * @param {*} stop 
     */
    grow(name, stop) {

        var self = this;

        if (stop) return self.hero.getComponent(cc.Animation).stop(name);

        self.hero.getComponent(cc.Animation).play(name);
    },

    /**
     * 棍子动画
     * @param {*} x 位移距离
     * @param {*} time 
     * @param {*} angle 
     */
    rotateBy(x, time, angle, callF) {

        var self = this;

        self.stick.runAction(cc.sequence(

            cc.rotateBy(time, angle),

            cc.callFunc(function(e) {

                self.heroRun(x, function() {

                    callF()
                })
            })
        ));

    },

    /**
     * 主角行走
     * @param {*} x 位移距离
     */
    heroRun(x, callF) {

        // self.stick.height + 40
        var self = this;

        self.block_ = true;

        self.grow('heroRun');

        self.hero.parent.runAction(cc.sequence(

            cc.moveBy(x / 300, cc.p(x, 0)),

            cc.callFunc(function(e) {

                callF()
            })
        ));

    },

    // 复原
    resetUI() {

        var self = this;

        // 复原主角
        self.hero.getComponent(cc.Animation).stop();

        // 复原棍子
        self.stick = cc.instantiate(self.stick);

        self.ground.parent.addChild(self.stick);

        self.stick.rotation = 0;

        self.stick.height = 0;

        self.stick.x = self._ground.x + self._ground.width - 5;

        // // 复原地面
        self.ground = self._ground;

        self.addGround();

        // 加分
        self.current.string = parseInt(self.current.string) + 1;
    },

    /**
     * 死亡 end
     */
    death(callF) {

        var self = this;

        self.stick.runAction(cc.rotateBy(.5, 90));

        self.hero.runAction(

            cc.sequence(

                cc.moveBy(0.5, cc.p(0, -550)),

                cc.callFunc(function(e) {

                    self.restart.active = true;

                    self.block = false;

                    self.block_ = false;

                    // self.highest.string = self.current.string > self.highest.string ? self.current.string : self.highest.string;

                    if (self.current.string > self.highest.string) {

                        self.highest.string = self.current.string;

                        // 存储得分
                        var scoreData = {

                            value: self.highest.string
                        };
                        cc.sys.localStorage.setItem('scoreData', JSON.stringify(scoreData));
                    };
                    callF()
                })
            ));
    },

    /**
     * 生成地面
     */
    addGround() {

        var self = this;

        var node = cc.instantiate(self.ground);

        node.scaleY = 0;

        self.ground.parent.addChild(node);

        // 根据得分增加游戏难度

        if (self.current.string < 10) {

            node.width = self.randomNumber(20, 40) * 10;
        } else if (self.current.string < 20) {

            node.width = self.randomNumber(15, 30) * 10;
        } else if (self.current.string < 30) {

            node.width = self.randomNumber(10, 20) * 10;
        } else {

            node.width = self.randomNumber(2, 30) * 10;
        };

        //  cc.log(node.width);

        //   node.width = self.randomNumber(10, 30) * 10;

        node.x = self.randomNumber((self.ground.x + self.ground.width + 50), self.ground.x + 700 - node.width);

        // 特殊地面
        node.children[0].active = true;

        node.children[0].x = self.randomNumber(0, node.width - node.children[0].width);

        node.children[0].color = self.colors[self.randomNumber(0, 3)];

        node.name = '_ground';

        self._ground = node;

        //    cc.log(self._ground.width)

        self.block = true;

        self.block_ = true;

        node.runAction(cc.sequence(

            cc.scaleTo(.5, 1),
            cc.callFunc(function(e) {

                self.block = false;

                self.block_ = false;

            })
        ));

    },

    /**
     * 触发连击
     */
    triggerDoubleHit() {

        var self = this;

        self.doubleHit.string = parseInt(self.doubleHit.string) + 1;

        self.doubleHit.node.parent.scale = 0;

        self.doubleHit.node.parent.runAction(cc.sequence(

            cc.fadeIn(.1),

            cc.scaleTo(.1, 1, 1).easing(cc.easeBackOut()),

            cc.callFunc(function(e) {

                setTimeout(function() {

                    e.runAction(cc.fadeOut(.5));
                }, 2000)

            })
        ));

    },

    // 判断棍子顶部是否在地面
    judgeDistance() {

        var self = this;

        var interval = self._ground.x - (self.ground.x + self.ground.width);

        // 判断棍子长度是否大于地面间隔

        // cc.log(self.stick.height);

        // cc.log(interval)

        if (self.stick.height < (interval + 1)) {

            self.rotateBy(self.stick.height + 30, .5, 90, function() {

                self.death(function() {

                    cc.log('挑战失败')
                })
            });

        } else if (self.stick.height > (interval + self._ground.width)) {

            self.rotateBy(self.stick.height + 30, .5, 90, function() {

                self.death(function() {

                    cc.log('挑战失败')
                })
            });
        } else {
            // 位置合适
            self.rotateBy(self._ground.width + interval, .5, 90, function() {

                self.judgeBrick();

                self.resetUI();
            });

        }
    },

    /**
     * 判断棍子是否接触砖块
     */
    judgeBrick() {

        var self = this;

        var interval = self._ground.x - (self.ground.x + self.ground.width) + self._ground.children[0].x;

        cc.log('>>')
        cc.log(interval);

        cc.log(self.stick.height)

        if (interval <= self.stick.height && self.stick.height <= (interval + self._ground.children[0].width)) {

            // 触发特殊加分
            self.triggerDoubleHit();

            // 不同颜色触发不同加分倍数
            switch (self._ground.children[0].color._val) {

                case self.colors[0]._val:

                    self.current.string = parseInt(self.current.string) + 3 * self.doubleHit.string;

                    break
                case self.colors[1]._val:

                    self.current.string = parseInt(self.current.string) + 2 * self.doubleHit.string;

                    break
                case self.colors[2]._val:

                    self.current.string = parseInt(self.current.string) + 1 * self.doubleHit.string;

                    break
                case self.colors[3]._val:

                    self.current.string = parseInt(self.current.string) - 1 * self.doubleHit.string;

                    if (self.current.string < 0) {

                        self.current.string = 0
                    };

                    break
            };


        };

    },

    update(dt) {

        if (this.touch) {

            if (this.stick.rotation == 0) {

                this.stick.height += 5;
            }
        };

    },
});