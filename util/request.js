import Storer from './storage.js';

class Request {
    constructor(opt) {
        let { appid = '', baseUrl = '', loginUrl = '' } = opt;
        this.baseUrl = baseUrl;
        this.appid = appid;
        this.loginUrl = loginUrl;
    }

    // 静默登录，code换token
    getToken(getFromServer = false) {
        let that = this;
        if (Storer.Token && getFromServer === false) return Promise.resolve({ token: Storer.Token });
        else {
            return new Promise((resolve, reject) => {
                wx.login({
                    success: function (res) {
                        if (res.code) {
                            that.request({ url: '/login', data: { code: res.code } })
                                .then(res => {
                                    console.log('login 123', res);
                                    if (res.success) {
                                        Storer.Token = res.result.token;
                                        Storer.setData('Token');
                                        that.token = res.result.token || ''; // 存起来
                                        resolve(res.result);
                                    }
                                })
                                .catch(err => console.log(err || 'register error'));
                        }
                    }
                })
            });
        }
    }

    get(url) {
        return this.request({
            url,
            method: 'GET'
        });
    }
    post(url, opt) {
        return this.request({
            url,
            data: opt,
            method: 'POST'
        });
    }
    put(url, opt) {
        return this.request({
            url,
            data: opt,
            method: 'PUT'
        });
    }
    
    request(opt, needReFetch = true) {
        let { url, data = {}, method = 'POST', dataType = 'json' } = opt;
        let that = this;
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.baseUrl + url,
                data,
                method,
                header: {
                    'Authorization': 'Bearer ' + (Storer.Token || ''),
                    'appid': this.appid || '',
                    'content-type': 'application/json'
                },
                dataType: dataType,
                success: function (res) {
                    // 如果状态码是 2xx 说明正确
                    var code = res.statusCode + '';
                    if (code && (code.charAt(0) === '2')) {
                        if (res.error) reject(res.error);
                        else resolve(res.data);
                    } else {
                        // token 过期 && 需要重新请求
                        console.log(needReFetch);
                        if (code === '401' && needReFetch) {
                            that.getToken(true)
                                .then(res => {
                                    that.request(opt, false)
                                        .then(res => resolve(res))
                                        .catch(err => reject('request失败', err || ''))
                                })
                                .catch(err => reject(err || 'request获取失败'))
                        } else {
                            reject(res);
                        }
                    }
                },
                fail: function (err = 'request fail 失败') {
                    reject(err);
                },
                complete: function () {
                    // console.log('request complete');
                }
            })
        })
    }
}

export { Request }