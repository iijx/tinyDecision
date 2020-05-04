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
        animationData: {},
        img: '',
        list: [],
    },
  
    onLoad() {
        // Api.get
        // CloudRequest.getQuestionList().then(res => {
        //     let data = res.data.map(DataTransform.question_back2front);
        //     wx.hideLoading();
        //     XData.dispatch({
        //         type: 'ADD_QUESTIONS',
        //         value: data
        //     })
        // })
        let { questions } = XData.getState();
        this.setData({
            list: this.listDataFormat(questions)
        })

        XData.subscribe(() => {
            let { questions } = XData.getState();
            this.setData({
                list: this.listDataFormat(questions)
            })
        })


        
    },
    handleQuestions(questions) {
        return this.listDataFormat(questions)
    },
    tocreate() {
        wx.navigateTo({
            url: '../create/create'
        });
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
        return {
            path: '/pages/index/index',
            title: '做个小决定...',
        }
    },
})