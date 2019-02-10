import Storer from './storage.js';

class CloudRequest {
    getDb(){
        return this.db ? this.db : this.db = wx.cloud.database();
    }
    getOpenId() {
        if (this.openidPromise) return this.openidPromise;
        const openid = Storer.getStorageSync('openid');
        if (openid) {
            return this.openidPromise = Promise.resolve(openid);
        } else {
            return this.openidPromise = this.login().then(res => {
                Storer.setStorage('openid', res.result.openid);
                return res.result.openid;
            })
        }
    }
    login() {
        return wx.cloud.callFunction({
            name: 'login',
            data: {}
        })
    }
    createQuestion(question) {
        return wx.cloud.callFunction({
            name: 'question',
            data: {
                type: 'create',
                question,
            }
        })
    }
    getQuestionList() {
        const Questions = this.getDb().collection('questions');
        return this.getOpenId().then(openid => {
            console.log('openid', openid,typeof openid)
            return Questions.where({
                userOpenid: openid,
            }).orderBy('meta.updated', 'desc').get()
        })
    }
    getQuestionById(id) {
        const Questions = this.getDb().collection('questions');
        return Questions.doc(id).get()
    }
    updateQuestion(question) {
        return wx.cloud.callFunction({
            name: 'question',
            data: {
                type: 'update',
                question
            }
        })
    }
    getVersionsNote() {
        return wx.cloud.callFunction({
            name: 'versionNote',
            data: {}
        })
    }
    getDefaultTpls() {
        return wx.cloud.callFunction({
            name: 'tpl',
            data: {
                tplType: 'defaultTpl'
            }
        })
    }
    getUserTpls() {
        const Tpls = this.getDb().collection('tpls');
        return this.getOpenId().then(openid => {
            return Tpls.where({
                _openid: openid,
            }).orderBy('meta.updated', 'desc').get()
        })
    }
    getAllTpls() {
        return Promise.all([this.getUserTpls(), this.getDefaultTpls()])
            .then(res => {
                return {
                    data: [
                        ...(res[0].data).map(item => ({...item, id: item._id})),
                        ...(res[1].result.defaultTpls)
                    ]
                }
            })
    }

    createTpl(_tpl) {
        const Tpls = this.getDb().collection('tpls');
        return Tpls.add({
            data: {
                type: 'userCreate',
                ..._tpl
            }
        }).then(res => {
            return {
                id: res._id,
                ..._tpl,
            };
        })
    }
}

export default new CloudRequest();