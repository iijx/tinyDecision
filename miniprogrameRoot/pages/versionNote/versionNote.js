// pages/versionNote/versionNote.js
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
        versionsNote: [],
        nextVersionNotice: {}
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {
        wx.showLoading()
        CloudRequest.getVersionsNote().then(res => {
            console.log('versionnotes res', res);
            wx.hideLoading();
            this.setData({
                nextVersionNotice: res.result.nextVersionNotice || {}
            })
        }).catch(err => {
            wx.hideLoading();
        })
    },
    wait() {
        wx.showToast({
            title: '敬请期待'
        })
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