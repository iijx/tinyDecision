// pages/tpl/tpl.js
const { Storer, Util, Api, XData } = getApp();
let pageUnsubscribe;
Page({
    data: {
        tplList: []
    },
    onLoad () {
        pageUnsubscribe = XData.subscribe( () => {
            let { tpls } = XData.getState();
            this.setData({
                tplList: tpls,
            })
        })
        this.loadData();
    },
    loadData() {
        let { tpls } = XData.getState();
        
        if ( tpls.length <= 0) {
            Api.get('/tpl')
                .then(res => {
                    XData.dispatch({
                        type: 'ADD_TPLS',
                        value: res.result,
                    })
                })
        } else {
            this.setData({
                tplList: tpls,
            })
        }
    },
    itemTap(e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `../create/create?type=tpl_edit&id=${id}`,
        })
    },
    onUnload () {
        pageUnsubscribe();
    },
    pageToCreate: Util.throttle(function () {
        wx.navigateTo({
            url: '../create/create?type=tpl'
        })
    }, 300),
})