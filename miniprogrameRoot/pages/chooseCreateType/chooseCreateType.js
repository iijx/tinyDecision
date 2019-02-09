const {
    Storer,
    Util,
    Api,
    XData,
    DataTransform,
    CloudRequest
} = getApp();

Page({

    /**
     * Page initial data
     */
    data: {
        defaultTplList: [
            {
                title: '聚餐吃什么？'
            },
            {
                title: '真心话 与 大冒险'
            },
        ]
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {

    },

    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady: function () {

    },

    /**
     * Lifecycle function--Called when page show
     */
    onShow: function () {

    },
    pageToCreate: Util.throttle(function() {
        wx.navigateTo({
            url: '../../create/create?type=question'
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

    }
})