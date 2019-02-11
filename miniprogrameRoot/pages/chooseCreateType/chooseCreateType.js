const {
    Storer,
    Util,
    Api,
    XData,
    DataTransform,
    CloudRequest
} = getApp();
let pageUnsubscribe;
Page({

    /**
     * Page initial data
     */
    data: {
        tplList: []
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {
        let { tpls } = XData.getState();
        if (tpls.length <= 0) {
            CloudRequest.getAllTpls().then(res => {
                XData.dispatch({
                    type: 'ADD_TPLS',
                    value: res.data
                })
            })
        } else {
            this.setData({
                tplList: tpls,
            })
        }
        pageUnsubscribe = XData.subscribe(() => {
            let { tpls } = XData.getState();
            console.log('tpls', tpls)
            this.setData({
                tplList: tpls,
            })
        })
    },

    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady: function () {

    },
    tplBtnTap: Util.throttle(function(e) {
        wx.navigateTo({
            url: '../create/create?type=question&tplId=' + e.target.dataset.id
        })
    }, 200),
    /**
     * Lifecycle function--Called when page show
     */
    onShow: function () {

    },
    pageToCreate: Util.throttle(function() {
        wx.navigateTo({
            url: '../create/create?type=question'
        })
    }, 200),
    /**
     * Lifecycle function--Called when page hide
     */
    onHide: function () {

    },

    /**
     * Lifecycle function--Called when page unload
     */
    onUnload: function () {

    },

    /**
     * Page event handler function--Called when user drop down
     */
    onPullDownRefresh: function () {

    },

    /**
     * Called when page reach bottom
     */
    onReachBottom: function () {

    },

    /**
     * Called when user click on the top right corner to share
     */
    onShareAppMessage: function () {

    },
    onUnload () {
        pageUnsubscribe();
    },
})