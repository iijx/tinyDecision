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
        CloudRequest.getVersionsNote().then(res => {
            console.log('versionnotes res', res);
            this.setData({
                nextVersionNotice: res.result.nextVersionNotice || {}
            })
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