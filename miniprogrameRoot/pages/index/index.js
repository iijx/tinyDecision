const {
    Storer,
    Util,
    Api,
    XData,
    DataTransform,
    CloudRequest
} = getApp();

Page({
    data: {
        info: {
            id: '',
            question: '',
            resolvedValue: '',
            options: [],
            isLottering: false,
            maxLotteryTimes: -1,
            lotteriedTimes: 0,
        }
    },
  
    onLoad() {
        wx.showLoading({ title: '加载中'})
        Api.getQuestionList().then(res => {
            wx.hideLoading();
            XData.dispatch({
                type: 'ADD_QUESTIONS',
                value: res.list.map(DataTransform.question_back2front).sort((a, b) => a.sortedTime > b.sortedTime ? -1 : 1)
            })
        });
        // CloudRequest.getQuestionList().then(res => {
        //     let data = res.data.map(DataTransform.question_back2front);
        //     wx.hideLoading();
        //     XData.dispatch({
        //         type: 'ADD_QUESTIONS',
        //         value: data
        //     })
        // })
        XData.subscribe(() => {
            let { questions } = XData.getState();
            console.log(questions)
            this.setData({
                info: questions[0]
            })
            // console.log(' questions ', this.listDataFormat(questions))
        })
    },
    answer(answer) {
        let { questions } = XData.getState();
        let index = Util.iFind(questions, item => item.id === this.data.info.id);
        
        let result = {...this.data.info, options: questions[index].options};
        result.isResolved = true;
        result.lotteriedTimes += 1;
        result.resolvedAt = Date.now();
        result.resolvedAngle = answer.detail.angle;
        result.resolvedValue = answer.detail.value;
        this.setData({
            info: result
        })
        console.log(result);
        questions[index] = result;
        XData.dispatch({
            type: 'CHANGE_QUESTIONS',
            value: questions
        });
        Api.updateQuestion({
            id: result.id,
            lotteriedTimes: result.lotteriedTimes,
            resolveInfo: {
                isResolved: result.isResolved,
                resolvedTime: result.resolvedAt,
                resolvedAngle: result.resolvedAngle,
                resolvedValue: result.resolvedValue
            }
        }).then(res => {
            console.log('updateQuestion res => ', res);
        })
        // CloudRequest.updateQuestion({
        //     id: result.id,
        //     lotteriedTimes: result.lotteriedTimes,
        //     resolveInfo: {
        //         isResolved: result.isResolved,
        //         resolvedTime: result.resolvedAt,
        //         resolvedAngle: result.resolvedAngle,
        //         resolvedValue: result.resolvedValue
        //     }
        // }).then(res => {
        //     console.log('updateQuestion res => ', res)
        // })
    },
    handleQuestions(questions) {
        return this.listDataFormat(questions)
    },

    pageToCreate: Util.throttle(function() {
        wx.navigateTo({
            url: '../chooseCreateType/chooseCreateType'
        })
    }, 300),

    showTimeFormat(time) {
        let date = new Date(time);
        let curDate = new Date();
        let ret = '';
        let showDate;
        if (Util.isToday(time)) {
            showDate = '今天';
        } else if (Util.isYestday(time)) {
            showDate = '昨天';
        } else showDate = (date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日');
        return showDate;
    },
    listDataFormat(list) {
        let retArr = [];
        list.forEach(item => {
            let showTime = this.showTimeFormat(item.sortedTime);
            let i = Util.iFind(retArr, item => item.showTime === showTime);
            if (i === -1) {
                retArr.push({
                    showTime,
                    list: [item]
                })
            } else {
                retArr[i].list.push(item);
            }
        });
        return retArr;
    },
    onShow: function() {
    },
    itemClick(e) {
        console.log(e)
        let i = e.currentTarget.dataset.i;
        let j = e.currentTarget.dataset.j;
        let curItem = this.data.list[i].list[j];
        wx.navigateTo({
            url: `../detail/detail?id=${curItem.id}`
        })
    },
    // 用户点击右上角分享
    onShareAppMessage: function(res) {
        // return {
        //     path: '/pages/index/index',
        //     title: '做个小决定...',
        // }
        return {
            path: '/pages/detail/detail?source=share&id=' + this.data.info.id,
            title: '你来帮我抽一个吧！',
        }
    },
})