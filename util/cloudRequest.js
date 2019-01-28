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
    getQuestionList() {
        const Questions = this.getDb().collection('Questions');
        return this.getOpenId().then(openid => {

            return Questions.where({
                _openid: openid,
            }).get()
        })
    }
}

export default new CloudRequest();