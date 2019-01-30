const { Storer, Api, Util, XData, Config, CloudRequest } = getApp();
Page({
    staticData: {
        // color: ['#ef5350', '#ffa626', '#ffca28', '#66ba6a', '#42a5f5', '#5c6bc0', '#ab47bc', '#ec407a', '#dc1846'],
    },
    data: {
        info: {
            answer: '???',
            question: '',
        },
        animationData: {},
        img: '',
        pointerImg: '',
    },
    getInitData(opt) {
        let { questions } = XData.getState();
        let index = Util.iFind(questions, item => item.id === opt.id);
        let info = {...questions[index]};

        // 没找到
        if (index === -1) { return; }
        // 找到了
        
        this.setData({
            info: info,
        });

        // 如果已经决议了，就动画到决议角度
        if ( info.isResolved ) {
            var animation = wx.createAnimation({
                duration: 10,
            });
            let resultAngle = info.resolvedAngle;
            animation.rotate(resultAngle).step();
            this.setData({
                animationData: animation.export()
            })
        }
    },

    onLoad: function (opt) {
        this.getInitData(opt);
        wx.showLoading({
            title: '加载中...'
        })
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
                    fail: function () {
                        wx.showToast({
                            title: '保存失败'
                        });
                    }
                });
            },
            fail: function () {
                wx.showToast({
                    title: '保存失败'
                });
            },
        });
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
    startLottery() {
        let info = this.data.info;
        if (this.data.isLottering) return;
        if (info.maxLotteryTimes !== -1 && info.maxLotteryTimes <= info.lotteriedTimes ) {
            wx.showToast({
                title: '无抽取机会',
            })
            return;
        }
        // 动画归位
        this.lotteryAnimationReset();

        setTimeout(() => {
            wx.vibrateShort();
            this.data.isLottering = true;

            var animation = wx.createAnimation({
                duration: 6000,
                timingFunction: 'ease',
            });
            let resultAngle = parseInt((20 + Math.random()) * 360);
            console.log('此次转动 resultAngle', resultAngle)
            animation.rotate(resultAngle).step();
            this.setData({
                animationData: animation.export()
            })
            let that = this;
            // 6s 后震动，并显示答案
            setTimeout( () => {
                wx.vibrateLong();
                this.data.isLottering = false;
                // let res = parseInt(resultAngle % 360);
                // // 根据相对性，转盘的转动可以看成是指针旋转了，并算出具体角度
                // let pointRotateAngle = (270 + (360 - res))%360;
                // let perAngle = 360 / this.staticData.options.length;
                // let lotteryRes = this.staticData.options[parseInt(pointRotateAngle / perAngle)];
                this.setData({
                    info: this.data.info
                })
            }, 6000)
            // 答案处理

            this.answerHandler(resultAngle);
        }, 100);
    },
    answerHandler(answerAngle) {
        let info = this.data.info;
        info.isResolved = true;
        info.lotteriedTimes += 1;
        info.resolvedAt = Date.now();
        console.log(0)
        // 根据相对性，转盘的转动可以看成是指针旋转了，并算出具体角度
        answerAngle = parseInt(answerAngle % 360);
        let pointRotateAngle = (270 - answerAngle);
        pointRotateAngle = pointRotateAngle < 0 ? pointRotateAngle + 360 : pointRotateAngle;
        let perAngle = 360 / info.options.length;
        console.log('point', pointRotateAngle, info)
        let answer = info.options[parseInt(pointRotateAngle / perAngle)];

        info.resolvedValue = answer;
        info.resolvedAngle = answerAngle;

        let { questions } = XData.getState();
        let index = Util.iFind(questions, item => item.id === this.data.info.id);
        
        let result = {...info, options: questions[index].options};
        questions[index] = result;
        XData.dispatch({
            type: 'CHANGE_QUESTIONS',
            value: questions
        });
        console.log(1)
        CloudRequest.updateQuestion({
            id: result.id,
            lotteriedTimes: result.lotteriedTimes,
            resolveInfo: {
                isResolved: result.isLottering,
                resolvedTime: result.resolvedAt,
                resolvedAngle: result.resolvedAngle,
                resolvedValue: result.resolvedValue
            }
        }).then(res => {
            console.log('updateQuestion res => ', res)
        })
        // Api.put('/question', result)
        //     .then( res => {
        //         console.log('put success', res)
        //     })
    },
    onShow() {
    },
    canvasPointerDraw: function () {
        var ctx = wx.createCanvasContext('canvas-pointer');
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
        ctx.setStrokeStyle('#4dd0e1');
        ctx.setLineWidth(2);
        ctx.setFillStyle('#fff');
        ctx.beginPath();
        ctx.arc(150, 150, 20, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.draw(true);


    },
    canvasDraw: function () {
        let that = this;
        var ctx = wx.createCanvasContext('canvas-bg');
        // 外层淡蓝色圈
        ctx.setStrokeStyle('#80deea');
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
        let options = this.data.info.options;
        while (options.length < Config.turntable.minBlock ) {
            options = options.concat(options);
        }
        this.data.info.options = options;
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
    onShareAppMessage: function (res) {
        return {
            path: '/pages/index/index',
            title: '做个小决定...',
        }
    },
})