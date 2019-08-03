
const { Config } = getApp();
Component({
   
    properties: {
        info: {
            type: Object,
            value: {
                options: []
            }
        }
    },
    data: {
        renderOptions: [],
        isLottering: false,
        animationData: {},
        img: '',
        pointerImg: '',
    },
    lifetimes: {
        // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
        attached: function () { },
        moved: function () { },
        ready: function(){ this.ready() },
        detached: function () { },
    },
    methods: {
        ready() {
            setTimeout(() => {
                this.canvasDraw();
                setTimeout( () => {
                    this.canvasPointerDraw();
                    setTimeout(() => {
                        this.canvas2Img();
                        setTimeout(() => {
                            wx.hideLoading();
                        }, 200);
                    }, 300)
                }, 200)
            }, 300)
        },

        startLottery() {
            let info = this.data.info;
            if (this.data.isLottering) return;
            if (info.maxLotteryTimes !== -1 && info.maxLotteryTimes <= info.lotteriedTimes ) {
                wx.showToast({
                    icon: 'none',
                    title: '已经抽过了...',
                })
                return;
            }
            // 动画归位
            this.lotteryAnimationReset();
    
            setTimeout(() => {
                wx.vibrateShort();
                this.data.isLottering = true;
                const durationTime = 7000;
                var animation = wx.createAnimation({
                    duration: durationTime,
                    timingFunction: 'ease',
                });
                let resultAngle = parseInt((20 + Math.random()) * 360);
                console.log('此次转动 resultAngle', resultAngle)
                animation.rotate(resultAngle).step();
                this.setData({
                    animationData: animation.export()
                })
                // 动画结束后震动一下，并显示答案
                setTimeout( () => {
                    wx.vibrateLong();
                    this.data.isLottering = false;
                    // this.setData({
                    //     info: this.data.info
                    // })
                    this.answerHandler(resultAngle);
                }, durationTime)
                // 答案处理
    
            }, 100);
        },

        lotteryAnimationReset() {
            let animation = wx.createAnimation({
                duration: 0,
            });
            let lastAngle = this.data.info.resolvedAngle || 0;
            lastAngle = parseInt(lastAngle % 360);
    
            animation.rotate(lastAngle).step();
            this.setData({
                animationData: animation.export()
            })
        },

        answerHandler(answerAngle) {
            // 根据相对性，转盘的转动可以看成是指针旋转了，并算出具体角度
            answerAngle = parseInt(answerAngle % 360);
            let pointRotateAngle = (270 - answerAngle);
            pointRotateAngle = pointRotateAngle < 0 ? pointRotateAngle + 360 : pointRotateAngle;
            let perAngle = 360 / this.data.renderOptions.length;
            
            let value = this.data.renderOptions[parseInt(pointRotateAngle / perAngle)];
            this.triggerEvent('answer', {
                angle: answerAngle,
                value: value 
            });
        },

        canvasDraw: function () {
            var ctx = wx.createCanvasContext('canvas-bg', this);
            // 外层淡蓝色圈
            // ctx.setStrokeStyle('#80deea');
            ctx.setStrokeStyle('#2d8cf0');
            ctx.setLineWidth(4);
            ctx.beginPath();
            ctx.arc(150, 150, 140, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.draw(true);
            // 外层白色
            ctx.setStrokeStyle('#efeff4');
            ctx.arc(150, 150, 138, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.draw(true);
    
            //区域划分
            let options = [...this.data.info.options];
            if(options.length <= 0) return;
            while (options.length < Config.turntable.minBlock ) {
                options = options.concat(options);
            }
            this.data.renderOptions = [...options];
            console.log(2);
            let minDivide = options.length;
            let perAngle = 2 * Math.PI / minDivide;
            let curStartAngle = perAngle;
            for (let i = 0; i < options.length; i++) {
                ctx.setFillStyle(Config.turntable.colors[i]);
                ctx.beginPath();
                ctx.moveTo(150, 150);
                ctx.arc(150, 150, 136, curStartAngle, curStartAngle + perAngle);
                curStartAngle += perAngle;
                ctx.closePath();
                ctx.fill();
                ctx.draw(true);
            }
            // 文字
            ctx.translate(150, 150);
            // this.staticData.options.length
            for (let i = 0; i < options.length; i++) {
                ctx.setFillStyle('#fff');
                ctx.setFontSize(16);
                if (i === 0) ctx.rotate(perAngle / 2);
                else ctx.rotate(perAngle);
                // 此次绘制的文字
                let text = options[i];
                text = text.length > 4 ? text.slice(0, 3) : text;
                // x坐标
                let x = 120 - text.length * 16;
                ctx.fillText(text, x, 6);
                ctx.draw(true);
            }
        },

        canvas2Img() {
            let that = this;
            wx.canvasToTempFilePath({
                canvasId: 'canvas-pointer',
                success: function (res) {
                    that.setData({
                        pointerImg: res.tempFilePath,
                    });
                    wx.canvasToTempFilePath({
                        canvasId: 'canvas-bg',
                        success: function (res) {
                            that.setData({
                                img: res.tempFilePath
                            })
                        },
                        fail: function (err) {
                            console.log(err);
                            wx.showToast({
                                title: '保存失败2'
                            });
                        }
                    }, that);
                },
                fail: function (err) {
                    console.log(err);
                    wx.showToast({
                        title: '保存失败1'
                    });
                },
            }, this);
        },

        canvasPointerDraw: function () {
            var ctx = wx.createCanvasContext('canvas-pointer', this);
            //指针
            ctx.setFillStyle('#fff');
            ctx.arc(150, 150, 40, 0, 2 * Math.PI);
            ctx.fill();
            ctx.draw(true);
    
            // ctx.setFillStyle('#80deea');
            ctx.setFillStyle('#e8e8e8');
            ctx.beginPath();
            ctx.arc(150, 150, 32, 1.56 * Math.PI, 1.44 * Math.PI);
            ctx.lineTo(150, 80);
            ctx.closePath();
            ctx.fill();
            ctx.draw(true);
    
            // 指针淡蓝色圈
            // ctx.setStrokeStyle('#4dd0e1');
            ctx.setStrokeStyle('#2d8cf0');
            ctx.setLineWidth(3);
            ctx.setFillStyle('#fff');
            ctx.beginPath();
            ctx.arc(150, 150, 20, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
            ctx.draw(true);
        },
    },
})