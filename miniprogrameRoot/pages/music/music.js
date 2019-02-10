// pages/music/music.js
const {
    Storer,
    Util,
    Api,
    XData,
    DataTransform
} = getApp();

const STATUS = {
    OFF: 'off', // 关机
    RECORDING: 'recording', // 录音中
    UPLOADING: 'uploading', // 上传中
    PLAYING: 'playing', // 播放中
}
const MAX_TIME = 30; // 120s
const recorderManager = wx.getRecorderManager();
const options = {
    duration: 20000,
    sampleRate: 44100,
    numberOfChannels: 1,
    encodeBitRate: 192000,
    format: 'aac',
    frameSize: 50
}
const qiniuUploader = require("../../assets/lib/qiniuUploader.js");
function initQiniu(_token, _domain) {
    var options = {
        region: 'NCN', // 华北区
        //   uptokenURL: `${Config.qiniu.uploadTokenUrl}`,
        uptoken: _token,
        domain: _domain,
        shouldUseQiniuFileName: true
    };
    qiniuUploader.init(options);
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        musicDisplayList: [{},{}],
        // music: {},
        curSelected: {
            id: -1,
            status: "PAUSE",
            isLike: false,
        },
        recorder: {
            status: STATUS.OFF,
            time: 0,
            maxTime: MAX_TIME
        },
        recordList: [
            {
                id: 1,
                avatar: '/assets/music/vae_ruyueerzhi.png',
                nickname: 'huan',
                isLike: false,
                likeNum: 345
            },
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this._recordInit();
        Api.get('/qiniuToken')
            .then(res => {
                console.log('qiniutoken', res);
                initQiniu(res.result.token, res.result.domain)
            })
        
        Api.get('/lyric_random?num=5')
            .then( res => {
                let music = res.result;
                console.log(music)
                music = music.map( item => ({
                    id: item.music._id,
                    cover: item.music.coverUrl,
                    author: item.music.author,
                    name: item.music.name,
                    selectedLyricIndex: item.lyricIndex,
                    lyrics: item.music.lyricBlock[item.lyricIndex].split(" ")
                }))
                this.setData({ musicDisplayList: music })
                return music[0];
            })
            .then( res => {
                Api.get(`/record?musicId=${res.id}&lyricIndex=${res.selectedLyricIndex}`)
                    .then(res => {
                        console.log('records ', res)
                        this.setData({
                            recordList: [...res.result.map( item => ({
                                id: item._id,
                                likeNum: item.likeNum,
                                fileId: item.fileId,
                                isLike: false,
                                avatar: '/assets/music/vae_ruyueerzhi.png',
                                nickname: 'huan',
                            }))]
                        })
                    })
            })
    },
    _recordInit() {
        recorderManager.onStop( res => {
            console.log('recorder onstop', res);
            if (res.duration < 3000) {
                wx.showToast({ title: '太短了' })
            } else {
                this.setData({ recorder: {...this.data.recorder, ...res} } );
            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },
    _upload(filePath) {
        return new Promise((resolve, reject) => {
            console.log('will be upload 1, filepath', filePath)
            qiniuUploader.upload(filePath, (res) => {
                console.log('上传res结果: ', res);
                resolve(res);
            }, (error) => {
                reject(error || '')
                console.log('error: ' + error);
            });
        }).then( res => {
            console.log('will upload 2, and 1 res: ', res);
            return Api.post('/record', {
                cat: 'music',
                musicId: this.data.music.id,
                lyricIndex: this.data.music.selectedLyricIndex,
                fileName: res.key,
                fileType: options.format === 'aac' ? 'm4a' : (options.format === 'mp3' ? 'mp3' : ''),
                filePath: res.imageURL,
            })

        })
    },
    uploadBtn() {
        this.setData({ recorder: { ...this.data.recorder, status: STATUS.UPLOADING }});
        this._upload( this.data.recorder.tempFilePath )
            .then( res => {
                console.log('上传成功', res)
            })
    },
    itemClick(e) {
        console.log(e.currentTarget.dataset.index)
        let index = Number(e.currentTarget.dataset.index);
        this.setData({
            curSelected: { ...this.data.curSelected, id: this.data.recordList[index].id }
        })
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },
    
    stopRecord() {
        this.setData({
            recorder: { ...this.data.recorder, status: STATUS.OFF }
        });
        recorderManager.stop()
    },
    startRecord() {
        this.setData({
            recorder: { ...this.data.recorder, status: STATUS.RECORDING }
        });
        recorderManager.start(options);
        // 开始计时
        // (() => {
        //     let that = this;
        //     let timer;
        //     function autoTimerRun() {
        //         that.setData({ recorder: {...that.data.recorder, time: that.data.recorder.time++ } })
        //         timer = setTimeout( () => {
        //             autoTimerRun();
        //         }, 1000);
        //     }
        // })();
    },
    recordBtn: function() {
        if (this.data.recorder.status === STATUS.OFF ) {
            this.startRecord();
        } else if (this.data.recorder.status === STATUS.RECORDING) {
            this.stopRecord();
        }
        
        
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})