import Storer from './storage.js';
import { config } from '../config.js';

const noTokenApi = ['/isCopy'];
const TokeExpireTime = 86400000; // (86400000 = 24 * 60 * 60 * 1000 一天 )

const apiRequestNeedToken = (url) => noTokenApi.findIndex(item => item === url) === -1;
const tokenIsExpire = () => {
    return !Storer.Token || (Storer.LastSaveTokenTime && (Date.now() - Storer.LastSaveTokenTime) > TokeExpireTime)
}

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
            if ( this.tokenPromise ) return this.tokenPromise;
            else {
                this.tokenPromise = new Promise((resolve, reject) => {
                    console.log('get token')
                    wx.login({
                        success: function (res) {
                            console.log('res.code', res.code)
                            if (res.code) {
                                that._request({ url: '/auth/login', data: { code: res.code } })
                                    .then(res => {
                                        if (res.success) {
                                            that.tokenPromise = '';
                                            Storer.Token = res.result.token;
                                            Storer.LastSaveTokenTime = Date.now();
                                            Storer.setData('Token');
                                            Storer.setData('LastSaveTokenTime');
                                            resolve(res.result);
                                        }
                                    })
                                    .catch(err => console.log(err || 'register error'));
                            }
                        }
                    })
                });
                return this.tokenPromise;
            }
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
    
    _request(opt, needReFetch) {
        let that = this;
        let { url, data = {}, method = 'POST', dataType = 'json' } = opt;
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
                    console.log('raw res', res);
                    // 如果状态码是 2xx 说明正确
                    var code = res.statusCode + '';
                    if (code && (code.charAt(0) === '2')) {
                        resolve(res.data);
                    } else {
                        // token 过期 && 需要重新请求
                        if (code === '401' && needReFetch) {
                            console.log('重新请求')
                            that.getToken(true)
                                .then(res => {
                                    that._request(opt, false)
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
    request(opt, needReFetch = true) {
        // 简单判断下 过期了 
        if (apiRequestNeedToken(opt.url) && tokenIsExpire() ) { 
            return this.getToken(true).then( res => {
                return this._request(opt, false)
            })
        } else { // 初步判断没有过期
            return this._request(opt, true)
        }
        
    }
}

export { Request }