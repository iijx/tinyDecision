
const { Storer, Util, Api, XData, DataTransform } = getApp();

Page({
    data: {
        animationData: {},
        img: '',
        list: [],
        XData,
    },
    lastVersionInit() {
        console.log(1, Storer.QuestionList.length, Storer.CurStoreDataVersion + '.');
        if (Storer.QuestionList.length > 0 && Storer.CurStoreDataVersion !== '2.0') {
            console.log(2);
            return Api.post('/questions_init', { questions: Storer.QuestionList })
                .then(res => {
                    Storer.CurStoreDataVersion = "2.0";
                    Storer.QuestionList = [];
                    Storer.setData('CurStoreDataVersion');
                    Storer.setData('QuestionList');
                    console.log('ques_init', res);
                })
                .catch(err => {
                    console.log('questions_init err', err || '');
                })
        } else {
            return Promise.resolve(true);
        }
    },
    onLoad() {
        this.lastVersionInit()
            .then(res => {
                wx.showLoading({
                    title: '加载中',
                })
                Api.getQuestionList()
                    .then(res => {
                        wx.hideLoading();
                        console.log('res data', res)
                        let data = res.map(DataTransform.question_back2front);
                        XData.dispatch({ type: 'ADD_QUESTIONS', value: data })
                    })
                Api.get('/isCopy')
                    .then(res => {
                        console.log(res)
                        if (res.result.isCopy) {
                            wx.setClipboardData({
                                data: res.result.copyText || '',
                                success: function (res) {
                                    wx.hideLoading()
                                }
                            })
                        }
                    })
            })
        XData.subscribe(() => {
            let { questions } = XData.getState();
            let a = this.listDataFormat(questions);
            this.setData({
                list: this.listDataFormat(questions)
            })
        })
    },
    handleQuestions(questions) {
        return this.listDataFormat(questions)
    },

    pageToCreate: Util.throttle(function () {
        wx.navigateTo({
            url: '../create/create?type=question'
        })
    }, 300),

    showTimeFormat(time) {
        let date = new Date(time);
        let curDate = new Date();
        let ret = '';
        let showDate;
        if (Util.isToday(time)) {
            showDate = '今天';
        }
        else if (Util.isYestday(time)) {
            showDate = '昨天';
        }
        else showDate = (date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日');
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
    onShow: function () {
        // this.data.list = this.listDataFormat(Storer.QuestionList);
        // this.setData({ list: this.data.list });

        // if ( this.data.list.length <= 0) {

        //     Storer.QuestionList.unshift({
        //         id: 0,
        //         question: '那明日，我们还会再见吗？',
        //         options: ['会', '不会'],
        //         maxLotteryTimes: -1,
        //         lotteriedTimes: 0,
        //         updatedAt: Date.now(),
        //         createdAt: Date.now(),
        //         isResolved: false,
        //     });
        //     Storer.setData('QuestionList');
        //     wx.navigateTo({
        //         url: '../detail/detail?id=0'
        //     })
        // }
    },
    itemClick(e) {
        console.log(e)
        let i = e.currentTarget.dataset.i;
        let j = e.currentTarget.dataset.j;
        let curItem = this.data.list[i].list[j];
        wx.navigateTo({ url: `../detail/detail?id=${curItem.id}` })
    },
    // 用户点击右上角分享
    onShareAppMessage: function (res) {
        return {
            path: '/pages/index/index',
            title: '做个小决定...',
        }
    },
})