const { Util } = getApp();

Page({
    wait() {
        wx.showToast({
            title: '敬请期待'
        })
    },
    pageToAbout: Util.throttle(() => {
        wx.navigateTo({ url: '../about/about'})
    }, 500)
})