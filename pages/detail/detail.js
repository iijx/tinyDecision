const { Storer, Util } = getApp();
Page({
    staticData: {
        // color: ['#8ad4fa', '#f36c60', '#4db6ac', '#d4e157', '#ba68a8', '#00ba31', '#00a7ce', '#f1b731', '#dc1846'],
        color: ['#ef5350', '#ffa626', '#ffca28', '#66ba6a', '#42a5f5', '#5c6bc0', '#ab47bc', '#ec407a', '#dc1846'],
        dataIndex: -1,
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
        let id = Number(opt.id);
        let index = Util.iFind(Storer.QuestionList, item => item.id === id)
        console.log('id is ', opt.id, typeof id,  index);
        // 没找到
        if (index === -1) { return; }
        // 找到了
        this.staticData.dataIndex = index;
        let info = Storer.QuestionList[index];
        this.staticData.options = info.options;
        this.setData({
            info: info,
        });
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
            this.canvasPointerDraw();
            setTimeout(() => {
                this.canvas2Img();
                setTimeout(() => {
                    wx.hideLoading();
                }, 200);
            }, 300)
        }, 100)
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
                        console.log('canvas-bg success to img')
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
                console.log(22);
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
            let resultAngle = (20 + Math.random()) * 360;
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
        
        // 根据相对性，转盘的转动可以看成是指针旋转了，并算出具体角度
        answerAngle = parseInt(answerAngle % 360);
        let pointRotateAngle = (270 + (360 - answerAngle))%360;
        let perAngle = 360 / this.staticData.options.length;
        let answer = this.staticData.options[parseInt(pointRotateAngle / perAngle)];

        info.resolvedValue = answer;
        info.resolvedAngle = answerAngle;

        let curData = Storer.QuestionList[this.staticData.dataIndex];
        curData.resolvedAngle = answerAngle;
        curData.resolvedValue = answer;
        curData.isResolved = true;
        curData.resolvedAt = Date.now();
        curData.lotteriedTimes += 1;

        Storer.setData('QuestionList');
        
        
        
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

        // 区域划分
        while( this.staticData.options.length < 6 ) {
            this.staticData.options = this.staticData.options.concat(this.staticData.options);
        }
        let minDivide = this.staticData.options.length;
        let perAngle = 2 * Math.PI / minDivide;
        let curStartAngle = perAngle;
        for (let i = 0; i < this.staticData.options.length; i++) {
            ctx.setFillStyle(this.staticData.color[i]);
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
        for (let i = 0; i < this.staticData.options.length; i++) {
            ctx.setFillStyle('#fff');
            ctx.setFontSize(16);
            if (i === 0) ctx.rotate(perAngle / 2);
            else ctx.rotate(perAngle);
            // 此次绘制的文字
            let text = this.staticData.options[i];
            text = text.length > 4 ? text.slice(0, 3) : text;
            // x坐标
            let x = 120 - text.length * 16;
            ctx.fillText(text, x, 6);
            ctx.draw(true);
        }
    }
})