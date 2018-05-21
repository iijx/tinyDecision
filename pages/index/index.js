
const { Storer, Util } = getApp();

Page({
    data: {
        animationData: {},
        img: '',
        list: []
    },
    pageToCreate: Util.throttle( function() {
        wx.navigateTo({
            url: '../create/create'
        })
    }, 300),
    itemDataFormat( item ) {
        return {
            id: item.id,
            question: item.question,
            isResolved: item.isResolved,
            resolvedValue: item.resolvedValue || undefined,
            sortedTime: item.resolvedTime || item.updatedAt,
            maxLotteryTimes: item.maxLotteryTimes,
            lotteriedTimes: item.lotteriedTimes
        }
    },
    showTimeFormat(time) {
        let date = new Date(time);
        let curDate = new Date();
        let ret = '';
        let showDate;
        if( Util.isToday(time) ) {
            showDate = '今天';
        } 
        else if ( Util.isYestday(time)){
            showDate = '昨天';
        } 
        else  showDate = (date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日');
        return showDate;
    },
    listDataFormat( _list ) {
        let list = _list.map(this.itemDataFormat);
        let retArr  = [];
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
        this.data.list = this.listDataFormat(Storer.QuestionList);
        this.setData({ list: this.data.list });

        if ( this.data.list.length <= 0) {
            
            Storer.QuestionList.unshift({
                id: 0,
                question: '那明日，我们还会再见吗？',
                options: ['会', '不会'],
                maxLotteryTimes: -1,
                lotteriedTimes: 0,
                updatedAt: Date.now(),
                createdAt: Date.now(),
                isResolved: false,
            });
            Storer.setData('QuestionList');
            wx.navigateTo({
                url: '../detail/detail?id=0'
            })
        }
    },
    itemClick(e) {
        let i = e.currentTarget.dataset.i;
        let j = e.currentTarget.dataset.j;
        let curItem = this.data.list[i].list[j];
        wx.navigateTo({ url: `../detail/detail?id=${curItem.id}` })
    },
    // 用户点击右上角分享
	onShareAppMessage: function (res) {
        return {
            path: '/pages/index/index',
            title: '我决定...',
        }
	},
})