const { Util } = getApp();

Page({
    wait() {
        wx.showToast({
            title: '敬请期待'
        })
    },
    pageToAbout: Util.throttle(() => {
        wx.navigateTo({ url: '../about/about'})
    }, 500),
    pageToTpl: Util.throttle(() => {
        wx.navigateTo({ url: '../tpl/tpl'})
    }, 500),
    pageToVersionNote: Util.throttle(() => {
        wx.navigateTo({ url: '../versionNote/versionNote'})
    }, 500),
    pageToAccount: Util.throttle(() => {
        wx.navigateTo({ url: '../account/account'})
    }, 500),
    
    onShareAppMessage: function (res) {
        return {
            path: '/pages/index/index',
            title: '做个小决定...',
        }
    },
})