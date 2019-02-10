// pages/tpl/tpl.js
const { Api, Storer, Util, XData, DataTransform,CloudRequest } = getApp();
let pageUnsubscribe;
Page({
    data: {
        tplList: []
    },
    onLoad () {
        pageUnsubscribe = XData.subscribe( () => {
            let { tpls } = XData.getState();
            console.log('tpls', tpls)
            this.setData({
                tplList: tpls,
            })
        })
        this.loadData();
    },
    loadData() {
        let { tpls } = XData.getState();
        
        if ( tpls.length <= 0) {
            CloudRequest.getAllTpls().then(res => {
                console.log(res)
                XData.dispatch({
                    type: 'ADD_TPLS',
                    value: res.data.filter(item => item.type !== 'defaultTpl'),
                })
            })
        } else {
            this.setData({
                tplList: tpls.filter(item => item.type !== 'defaultTpl'),
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