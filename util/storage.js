
/** 说明
 * 1. 微信自身的存储 api 有一定几率失败，因此统一加入 try catch 封装了一下
 */

class Storage {
    constructor() {

    }
    getStorageSync(key) {
        if ( this[key] !== undefined ) return this[key];
        else {
            try {
                return this[key] =  wx.getStorageSync(key);
            } catch (error) {
                return undefined;
            }
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
        this[key] = value;
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
    // 将本地存储的变量，获取出来，存至全局 Store 中，方便后续获取
    initData() {
        // token
        this.Token = this.getStorageSync('Token') || ''; 
        // 最近一次 token 存储时间
        this.LastSaveTokenTime = this.getStorageSync('LastSaveTokenTime') || ''; 
        // 复制时间
        this.CopyTodayInfo = this.getStorageSync('CopyTodayInfo') || ''; 
        // 本地数据版本号
        Storer.CurStoreDataVersion = this.getStorageSync('CurStoreDataVersion') || ''; 
    }



}

const Storer = new Storage();
Storer.initData();

export default Storer;