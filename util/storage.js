
/** 说明
 * 1. 微信自身的存储 api 有一定几率失败，因此统一加入 try catch 封装了一下
 */

class Storage {
    constructor() {

    }
    getStorageSync(key) {
        try {
            return wx.getStorageSync(key);
        } catch (error) {
            return undefined;
        }
    }
    getStorage(key, success, fail, complete) {
        try {
            wx.getStorage({
                key,
                success: function(res) {
                    typeof success === 'function' && success(res);
                },
                fail: function(err) {
                    typeof fail === 'function' && fail(res);
                }
            })
        } catch(err) {
            console.log(`wx.getStorge '${key}' error`, err || '');
        }
    }
    setStorage(key, value) {
        try {
            wx.setStorage({
                key:key,
                data: value
            })
        } catch (error) {
            console.log(`wx.setStorage '${key}' error `, error || '')		
        }
    }
    setDataAsKey(key) {
        this.setStorage(key, this[key]);
    }
    setData(key) {
        if (key) this.setDataAsKey(key);
    }
    removeStorageSync(key) {
    }
    initData() {
        this.QuestionList = this.getStorageSync('QuestionList') || [];
    }

}

const Storer = new Storage();
Storer.initData();

export default Storer;