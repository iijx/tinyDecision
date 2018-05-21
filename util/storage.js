
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
        this.IsHandledQuestionList_1_0_6 = this.getStorageSync('IsHandledQuestionList_1_0_6') || false;
        if (this.IsHandledQuestionList_1_0_6 + '' === 'false') {
            this.handlerQuestionList_1_0_6(this.QuestionList);

            this.IsHandledQuestionList_1_0_6 = true;
            this.setData('IsHandledQuestionList_1_0_6');
        }
    }
    /* v1.0.6 版本 数据清理 
    *  添加 maxLotteryTimes 字段 和 lotteriedTimes 字段
    */
    handlerQuestionList_1_0_6( list ) {
        console.log(this.QuestionList)
        list.forEach( item => {
           if (item.id === 0) {
               item.maxLotteryTimes = -1;
               item.lotteriedTimes = item.isResolved ? 1 : 0;
           } else {
               item.maxLotteryTimes = item.maxLotteryTimes || 1;
               item.lotteriedTimes = item.isResolved ? 1 : 0;
           }
        })
    }



}

const Storer = new Storage();
Storer.initData();

export default Storer;